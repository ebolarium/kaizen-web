// Check what database the migration script used
const mongoose = require('mongoose');

// Migration script uses this default
const MIGRATION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kaizen-ngo';

console.log('=== CHECKING MIGRATION DATABASE ===\n');
console.log('Migration script URI:', MIGRATION_URI.replace(/\/\/.*@/, '//***@'));

mongoose.connect(MIGRATION_URI)
    .then(async () => {
        console.log('✅ Connected to migration database');
        console.log('Database name:', mongoose.connection.db.databaseName);
        console.log('Host:', mongoose.connection.host);
        console.log('');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:');

        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`  - ${col.name}: ${count} documents`);
        }

        await mongoose.connection.close();
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });
