import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Import models directly with relative paths
const projectRoot = process.cwd();

interface ProjectsData {
    local: any[];
    erasmus: {
        k1: {
            k152: any[];
            k153: any[];
        };
        k2: {
            ka210: any[];
            k220: any[];
        };
    };
}

interface BlogPostsData {
    posts: any[];
}

interface AdminConfigData {
    admin: {
        username: string;
        email: string;
        password: string;
    };
    settings: {
        siteName: string;
        siteDescription: string;
        contactEmail: string;
        socialMedia: {
            facebook: string;
            twitter: string;
            linkedin: string;
            instagram: string;
        };
    };
}

/**
 * Backup all JSON data files before migration
 */
async function backupJSONFiles() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(projectRoot, 'src', 'data', 'backups', timestamp);

    try {
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const filesToBackup = ['projects.json', 'blog-posts.json', 'admin-config.json'];

        console.log('🔄 Starting backup process...');
        console.log(`📁 Backup directory: ${backupDir}\n`);

        for (const filename of filesToBackup) {
            const sourcePath = path.join(projectRoot, 'src', 'data', filename);
            const destPath = path.join(backupDir, filename);

            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
                const sourceSize = fs.statSync(sourcePath).size;
                const destSize = fs.statSync(destPath).size;

                if (sourceSize === destSize) {
                    console.log(`✅ ${filename} backed up successfully (${sourceSize} bytes)`);
                } else {
                    throw new Error(`Backup verification failed for ${filename}`);
                }
            } else {
                console.log(`⚠️  ${filename} not found, skipping...`);
            }
        }

        console.log(`\n✅ Backup completed successfully!`);
        console.log(`📍 Location: ${backupDir}`);
        return backupDir;
    } catch (error) {
        console.error('❌ Backup failed:', error);
        throw error;
    }
}

/**
 * Connect to MongoDB
 */
async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaizen-ngo';

    console.log(`📍 Connecting to: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}`);

    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    return mongoose;
}

/**
 * Define Mongoose Schemas inline
 */
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin' },
    forgotPasswordToken: String,
    forgotPasswordExpires: Date,
}, { timestamps: true });

const ActivitySchema = new mongoose.Schema({
    activityId: String,
    content: String,
    images: [String]
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ['local', 'k152', 'k153', 'ka210', 'k220'] },
    title: { type: String, required: true },
    description: String,
    content: String,
    image: String,
    gallery: [String],
    activities: [ActivitySchema],
    date: Date,
    status: { type: String, enum: ['active', 'completed', 'ongoing'], default: 'active' },
    partners: [String],
}, { timestamps: true });

const PostSchema = new mongoose.Schema({
    postId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: String,
    content: { type: String, required: true },
    image: String,
    author: String,
    date: Date,
    tags: [String],
    published: { type: Boolean, default: true },
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
    siteName: String,
    siteDescription: String,
    contactEmail: String,
    socialMedia: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String,
    },
}, { timestamps: { createdAt: false, updatedAt: true } });

// Create models
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

/**
 * Migration script to move data from JSON files to MongoDB
 */
async function migrateToDatabase() {
    console.log('🚀 Starting database migration...\n');

    try {
        // Step 1: Backup existing JSON files
        console.log('📦 Step 1: Backing up JSON files...');
        const backupDir = await backupJSONFiles();
        console.log('');

        // Step 2: Connect to MongoDB
        console.log('🔌 Step 2: Connecting to MongoDB...');
        await connectDB();
        console.log('');

        // Step 3: Clear existing data
        console.log('🧹 Step 3: Clearing existing database collections...');
        await User.deleteMany({});
        await Project.deleteMany({});
        await Post.deleteMany({});
        await Settings.deleteMany({});
        console.log('✅ Collections cleared\n');

        // Step 4: Migrate Projects
        console.log('📂 Step 4: Migrating projects...');
        const projectsPath = path.join(projectRoot, 'src', 'data', 'projects.json');
        const projectsData: ProjectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

        let projectCount = 0;

        // Helper function to migrate projects
        const migrateProjects = async (projects: any[], category: string) => {
            for (const project of projects) {
                await Project.create({
                    projectId: project.id,
                    category,
                    title: project.title,
                    description: project.description || '',
                    content: project.content || '',
                    image: project.image || '/images/Erasmus_Logo.png',
                    gallery: project.gallery || [],
                    activities: (project.activities || []).map((activity: any) => ({
                        activityId: activity.id,
                        content: activity.content,
                        images: activity.images || [],
                    })),
                    date: new Date(project.date),
                    status: project.status || 'active',
                    partners: project.partners,
                });
                projectCount++;
            }
        };

        await migrateProjects(projectsData.local, 'local');
        console.log(`  ✅ Migrated ${projectsData.local.length} local projects`);

        await migrateProjects(projectsData.erasmus.k1.k152, 'k152');
        console.log(`  ✅ Migrated ${projectsData.erasmus.k1.k152.length} K152 projects`);

        await migrateProjects(projectsData.erasmus.k1.k153, 'k153');
        console.log(`  ✅ Migrated ${projectsData.erasmus.k1.k153.length} K153 projects`);

        await migrateProjects(projectsData.erasmus.k2.ka210, 'ka210');
        console.log(`  ✅ Migrated ${projectsData.erasmus.k2.ka210.length} KA210 projects`);

        await migrateProjects(projectsData.erasmus.k2.k220, 'k220');
        console.log(`  ✅ Migrated ${projectsData.erasmus.k2.k220.length} K220 projects`);

        console.log(`  📊 Total projects migrated: ${projectCount}\n`);

        // Step 5: Migrate Blog Posts
        console.log('📝 Step 5: Migrating blog posts...');
        const postsPath = path.join(projectRoot, 'src', 'data', 'blog-posts.json');
        const postsData: BlogPostsData = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

        for (const post of postsData.posts) {
            await Post.create({
                postId: post.id,
                title: post.title,
                excerpt: post.excerpt || '',
                content: post.content,
                image: post.image || '/images/blog/default.jpg',
                author: post.author || 'Admin',
                date: new Date(post.date),
                tags: post.tags || [],
                published: post.published !== undefined ? post.published : true,
            });
        }
        console.log(`  ✅ Migrated ${postsData.posts.length} blog posts\n`);

        // Step 6: Migrate Admin User and Settings
        console.log('👤 Step 6: Migrating admin user and settings...');
        const adminConfigPath = path.join(projectRoot, 'src', 'data', 'admin-config.json');
        const adminConfig: AdminConfigData = JSON.parse(fs.readFileSync(adminConfigPath, 'utf8'));

        await User.create({
            username: adminConfig.admin.username,
            email: adminConfig.admin.email,
            password: adminConfig.admin.password,
            role: 'admin',
        });
        console.log('  ✅ Admin user created');

        await Settings.create({
            siteName: adminConfig.settings.siteName,
            siteDescription: adminConfig.settings.siteDescription,
            contactEmail: adminConfig.settings.contactEmail,
            socialMedia: adminConfig.settings.socialMedia,
        });
        console.log('  ✅ Settings created\n');

        // Step 7: Verification
        console.log('🔍 Step 7: Verifying migration...');
        const verifyProjectCount = await Project.countDocuments();
        const verifyPostCount = await Post.countDocuments();
        const verifyUserCount = await User.countDocuments();
        const verifySettingsCount = await Settings.countDocuments();

        console.log(`  📊 Projects in database: ${verifyProjectCount}`);
        console.log(`  📊 Posts in database: ${verifyPostCount}`);
        console.log(`  📊 Users in database: ${verifyUserCount}`);
        console.log(`  📊 Settings in database: ${verifySettingsCount}\n`);

        if (verifyProjectCount === projectCount && verifyPostCount === postsData.posts.length) {
            console.log('✅ Migration completed successfully!');
            console.log(`📍 Backup location: ${backupDir}`);
            console.log('\n🎉 All data has been migrated to MongoDB!');

            // Close connection
            await mongoose.connection.close();
            return true;
        } else {
            throw new Error('Verification failed: Document counts do not match');
        }
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        console.log('\n💡 Your original JSON files are backed up and safe.');
        console.log('   You can restore them if needed.');
        await mongoose.connection.close();
        throw error;
    }
}

// Run migration
migrateToDatabase()
    .then(() => {
        console.log('\n✨ Migration process completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration process failed:', error);
        process.exit(1);
    });
