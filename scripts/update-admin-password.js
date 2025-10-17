const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Script to update admin password
// Usage: node scripts/update-admin-password.js <new-password>

const newPassword = process.argv[2];

if (!newPassword) {
  console.error('Usage: node scripts/update-admin-password.js <new-password>');
  process.exit(1);
}

async function updatePassword() {
  try {
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Read the current admin config
    const configPath = path.join(__dirname, '..', 'src', 'data', 'admin-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Update the password
    config.admin.password = hashedPassword;
    
    // Write back to file
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    console.log('✅ Admin password updated successfully!');
    console.log('🔐 New password hash:', hashedPassword);
    console.log('📝 Username: admin');
    console.log('🔑 New password:', newPassword);
    
  } catch (error) {
    console.error('❌ Error updating password:', error.message);
    process.exit(1);
  }
}

updatePassword();
