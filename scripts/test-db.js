// Simple test to check MongoDB connection
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaizen-ngo';

console.log('Testing MongoDB connection...');
console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//***@'));

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected!');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log('\nCollections:');
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`  ${col.name}: ${count} documents`);
        }

        // Check projects specifically
        const projects = await db.collection('projects').find({}).limit(3).toArray();
        console.log('\nSample projects:');
        projects.forEach(p => {
            console.log(`  - ${p.projectId}: ${p.title}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Test complete');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });
