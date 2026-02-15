const axios = require('axios');
const fs = require('fs');
const path = require('path');

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
const DEVICE_PORT = 80;

async function restoreUsers() {
  try {
    // Find latest backup file
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      console.log('❌ No backup directory found');
      return;
    }

    const backupFiles = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('ai06-users-backup-') && f.endsWith('.json'))
      .sort()
      .reverse();

    if (backupFiles.length === 0) {
      console.log('❌ No backup files found');
      return;
    }

    const latestBackup = backupFiles[0];
    console.log(`Using backup: ${latestBackup}`);

    const backupPath = path.join(backupDir, latestBackup);
    const users = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log(`Found ${users.length} users in backup`);
    console.log('Connecting to AI06 device...');

    // Restore each user
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      try {
        const response = await axios.post(`http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`, {
          command: 'addUser',
          token: '',
          user: user
        }, {
          timeout: 5000
        });

        if (response.data && response.data.result === 'success') {
          console.log(`✅ Restored: ${user.name} (ID: ${user.id})`);
          successCount++;
        } else {
          console.log(`⚠️  Failed: ${user.name} (ID: ${user.id})`);
          failCount++;
        }
      } catch (error) {
        console.log(`❌ Error restoring ${user.name}: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n========================================');
    console.log(`Restore Summary:`);
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('========================================');

  } catch (error) {
    console.error('❌ Restore failed:', error.message);
  }
}

// Run restore
restoreUsers();
