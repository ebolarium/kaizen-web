import mongoose from 'mongoose';

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaizen-ngo';

console.log('🔍 Checking MongoDB connection and data...\n');
console.log(`📍 Connection URI: ${MONGODB_URI.replace(/\/\/.*@/, '//***@')}\n`);

async function checkDatabase() {
    try {
        // Connect
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Get database name
        const dbName = mongoose.connection.db.databaseName;
        console.log(`📊 Database: ${dbName}\n`);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📁 Collections found: ${collections.length}`);
        collections.forEach(col => console.log(`   - ${col.name}`));
        console.log('');

        // Check each collection
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`📦 ${col.name}: ${count} documents`);

            // Show sample data
            if (count > 0) {
                const sample = await mongoose.connection.db.collection(col.name).findOne({});
                console.log(`   Sample:`, JSON.stringify(sample, null, 2).substring(0, 200) + '...\n');
            }
        }

        // Specific checks for our collections
        console.log('\n🔍 Detailed Check:\n');

        const projects = await mongoose.connection.db.collection('projects').find({}).toArray();
        console.log(`Projects: ${projects.length} total`);
        if (projects.length > 0) {
            const categories = projects.reduce((acc: any, p: any) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
            }, {});
            console.log('  By category:', categories);
            console.log('  Sample project IDs:', projects.slice(0, 3).map((p: any) => p.projectId));
        }

        const posts = await mongoose.connection.db.collection('posts').find({}).toArray();
        console.log(`\nPosts: ${posts.length} total`);
        if (posts.length > 0) {
            console.log('  Sample post IDs:', posts.map((p: any) => p.postId));
        }

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(`\nUsers: ${users.length} total`);
        if (users.length > 0) {
            console.log('  Usernames:', users.map((u: any) => u.username));
        }

        const settings = await mongoose.connection.db.collection('settings').find({}).toArray();
        console.log(`\nSettings: ${settings.length} total`);

        await mongoose.connection.close();
        console.log('\n✅ Database check complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkDatabase();
