import fs from 'fs';
import path from 'path';

/**
 * Backup all JSON data files before migration
 */
async function backupJSONFiles() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), 'src', 'data', 'backups', timestamp);

    try {
        // Create backup directory
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Files to backup
        const filesToBackup = [
            'projects.json',
            'blog-posts.json',
            'admin-config.json'
        ];

        console.log('🔄 Starting backup process...');
        console.log(`📁 Backup directory: ${backupDir}\n`);

        for (const filename of filesToBackup) {
            const sourcePath = path.join(process.cwd(), 'src', 'data', filename);
            const destPath = path.join(backupDir, filename);

            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);

                // Verify backup
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

export default backupJSONFiles;

// Run backup if called directly
backupJSONFiles()
    .then(() => {
        console.log('\n✨ All files backed up successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Backup process failed:', error);
        process.exit(1);
    });
