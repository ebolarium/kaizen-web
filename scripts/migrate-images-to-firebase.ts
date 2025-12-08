import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaizen-ngo';

// Simple Mongoose schemas for migration
const ProjectSchema = new mongoose.Schema({}, { strict: false });
const PostSchema = new mongoose.Schema({}, { strict: false });

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

/**
 * Upload a local file to Firebase Storage
 */
async function uploadLocalFileToFirebase(localPath: string, firebasePath: string): Promise<string> {
    try {
        const fileBuffer = fs.readFileSync(localPath);
        const storageRef = ref(storage, firebasePath);

        const snapshot = await uploadBytes(storageRef, fileBuffer);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error(`Error uploading ${localPath}:`, error);
        throw error;
    }
}

/**
 * Main migration function
 */
async function migrateImagesToFirebase() {
    console.log('🔥 Starting Firebase Storage Migration...\n');

    try {
        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const publicDir = path.join(process.cwd(), 'public');
        const imageMap: Map<string, string> = new Map();

        // Get all projects and posts
        const projects = await Project.find({});
        const posts = await Post.find({});

        console.log(`📊 Found ${projects.length} projects and ${posts.length} posts\n`);

        // Collect all image paths
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

        console.log(`📸 Found ${imagePaths.size} unique image references\n`);

        // Upload each image to Firebase
        let uploadedCount = 0;
        let skippedCount = 0;

        for (const imagePath of imagePaths) {
            try {
                // Skip if already a Firebase URL
                if (imagePath.includes('firebasestorage.googleapis.com')) {
                    console.log(`⏭️  Skipping (already on Firebase): ${imagePath}`);
                    skippedCount++;
                    continue;
                }

                // Convert URL path to local file path
                const localPath = path.join(publicDir, imagePath);

                // Check if file exists
                if (!fs.existsSync(localPath)) {
                    console.log(`⚠️  File not found: ${localPath}`);
                    skippedCount++;
                    continue;
                }

                // Create Firebase path
                const fileName = path.basename(imagePath);
                const firebasePath = `projects/${fileName}`;

                // Upload to Firebase
                console.log(`📤 Uploading: ${fileName}...`);
                const downloadURL = await uploadLocalFileToFirebase(localPath, firebasePath);

                imageMap.set(imagePath, downloadURL);
                uploadedCount++;
                console.log(`✅ Uploaded: ${downloadURL}\n`);

            } catch (error) {
                console.error(`❌ Failed to upload ${imagePath}:`, error);
            }
        }

        console.log(`\n📊 Upload Summary:`);
        console.log(`   ✅ Uploaded: ${uploadedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}\n`);

        // Update database with new URLs
        console.log('💾 Updating database with Firebase URLs...\n');

        for (const project of projects) {
            let updated = false;

            if (project.image && imageMap.has(project.image)) {
                project.image = imageMap.get(project.image);
                updated = true;
            }

            if (project.gallery) {
                project.gallery = project.gallery.map((img: string) =>
                    imageMap.get(img) || img
                );
                updated = true;
            }

            if (project.activities) {
                project.activities.forEach((activity: any) => {
                    if (activity.images) {
                        activity.images = activity.images.map((img: string) =>
                            imageMap.get(img) || img
                        );
                        updated = true;
                    }
                });
            }

            if (updated) {
                await project.save();
                console.log(`✅ Updated project: ${project.title}`);
            }
        }

        for (const post of posts) {
            if (post.image && imageMap.has(post.image)) {
                post.image = imageMap.get(post.image);
                await post.save();
                console.log(`✅ Updated post: ${post.title}`);
            }
        }

        console.log('\n🎉 Migration completed successfully!');
        console.log(`\n📝 Summary:`);
        console.log(`   - Images uploaded to Firebase: ${uploadedCount}`);
        console.log(`   - Database records updated`);
        console.log(`   - Old images still in public/images (backup)`);
        console.log(`\n💡 Next steps:`);
        console.log(`   1. Test your website to ensure all images load`);
        console.log(`   2. Once confirmed, you can delete public/images/uploads folder`);
        console.log(`   3. Commit and push changes to deploy\n`);

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Run migration
migrateImagesToFirebase();
