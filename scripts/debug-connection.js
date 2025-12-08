// Debug script to check which database Next.js is using
const mongoose = require('mongoose');

// Load environment variables like Next.js does
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaizen-ngo';

console.log('=== DATABASE CONNECTION DEBUG ===\n');
console.log('Environment variables loaded from .env.local');
console.log('MONGODB_URI from env:', MONGODB_URI);
console.log('');

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected successfully!');
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Connection string:', mongoose.connection.host + ':' + mongoose.connection.port);
        console.log('');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in this database:');

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`  - ${col.name}: ${count} documents`);
        }

        await mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    });
