import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const MONGODB_URI = process.env.MONGODB_URI || '';

const ProjectSchema = new mongoose.Schema({}, { strict: false });
const PostSchema = new mongoose.Schema({}, { strict: false });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function uploadLocalFileToFirebase(localPath: string, firebasePath: string): Promise<string> {
    const fileBuffer = fs.readFileSync(localPath);
    const storageRef = ref(storage, firebasePath);
    const snapshot = await uploadBytes(storageRef, fileBuffer);
    return await getDownloadURL(snapshot.ref);
}

async function forceUploadAllToFirebase() {
    console.log('🔥 Force uploading ALL images to Firebase...\n');

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const publicDir = path.join(process.cwd(), 'public');
        const imageMap: Map<string, string> = new Map();

        const projects = await Project.find({});
        const posts = await Post.find({});

        const imagePaths = new Set<string>();

        projects.forEach((project: any) => {
            if (project.image) imagePaths.add(project.image);
            if (project.gallery) project.gallery.forEach((img: string) => imagePaths.add(img));
            if (project.activities) {
                project.activities.forEach((activity: any) => {
                    if (activity.images) activity.images.forEach((img: string) => imagePaths.add(img));
                });
            }
        });

        posts.forEach((post: any) => {
            if (post.image) imagePaths.add(post.image);
        });

        console.log(`📸 Found ${imagePaths.size} image references\n`);

        let uploadedCount = 0;
        let skippedCount = 0;

        for (const imagePath of imagePaths) {
            try {
                // Skip if already Firebase URL
                if (imagePath.includes('firebasestorage.googleapis.com')) {
                    console.log(`⏭️  Already on Firebase: ${imagePath.substring(0, 50)}...`);
                    skippedCount++;
                    continue;
                }

                const localPath = path.join(publicDir, imagePath);

                if (!fs.existsSync(localPath)) {
                    console.log(`⚠️  File not found: ${localPath}`);
                    skippedCount++;
                    continue;
                }

                const fileName = path.basename(imagePath);
                const firebasePath = `projects/${fileName}`;

                console.log(`📤 Uploading: ${fileName}...`);
                const downloadURL = await uploadLocalFileToFirebase(localPath, firebasePath);

                imageMap.set(imagePath, downloadURL);
                uploadedCount++;
                console.log(`✅ ${downloadURL.substring(0, 80)}...\n`);

            } catch (error: any) {
                console.error(`❌ Failed: ${imagePath} - ${error.message}\n`);
            }
        }

        console.log(`\n📊 Upload Summary:`);
        console.log(`   ✅ Uploaded: ${uploadedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}\n`);

        // Update database
        console.log('💾 Updating database...\n');

        for (const project of projects) {
            let updated = false;

            if (project.image && imageMap.has(project.image)) {
                project.image = imageMap.get(project.image);
                updated = true;
            }

            if (project.gallery) {
                project.gallery = project.gallery.map((img: string) => imageMap.get(img) || img);
                updated = true;
            }

            if (project.activities) {
                project.activities.forEach((activity: any) => {
                    if (activity.images) {
                        activity.images = activity.images.map((img: string) => imageMap.get(img) || img);
                        updated = true;
                    }
                });
            }

            if (updated) {
                await project.save();
                console.log(`✅ Updated: ${project.title}`);
            }
        }

        for (const post of posts) {
            if (post.image && imageMap.has(post.image)) {
                post.image = imageMap.get(post.image);
                await post.save();
                console.log(`✅ Updated post: ${post.title}`);
            }
        }

        console.log('\n🎉 All images now on Firebase!');
        console.log(`\n📝 ${uploadedCount} images uploaded and database updated\n`);

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

forceUploadAllToFirebase();
