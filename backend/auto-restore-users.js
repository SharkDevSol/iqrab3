const axios = require('axios');
const fs = require('fs');
const path = require('path');

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.201'; // Change to your device IP
const DEVICE_PORT = 80;

async function autoRestoreUsers() {
  try {
    console.log('========================================');
    console.log('AI06 Auto-Restore Users');
    console.log('========================================\n');

    // Step 1: Get current users from device
    console.log('📡 Checking current device users...');
    const currentResponse = await axios.post(
      `http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`,
      {
        command: 'getUserList',
        token: ''
      },
      { timeout: 10000 }
    );

    if (!currentResponse.data || currentResponse.data.result !== 'success') {
      console.log('❌ Failed to get current users from device');
      return;
    }

    const currentUsers = currentResponse.data.users || [];
    const currentUserIds = new Set(currentUsers.map(u => u.id));
    console.log(`✅ Device currently has ${currentUsers.length} users\n`);

    // Step 2: Find latest backup
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
    console.log(`📂 Using backup: ${latestBackup}`);

    const backupPath = path.join(backupDir, latestBackup);
    const backupUsers = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    console.log(`📋 Backup contains ${backupUsers.length} users\n`);

    // Step 3: Find missing users
    const missingUsers = backupUsers.filter(u => !currentUserIds.has(u.id));

    if (missingUsers.length === 0) {
      console.log('✅ No missing users detected. All users are present on device.');
      return;
    }

    console.log(`⚠️  Found ${missingUsers.length} missing users:\n`);
    missingUsers.forEach(u => {
      console.log(`   - ${u.name} (ID: ${u.id})`);
    });
    console.log('');

    // Step 4: Restore missing users
    console.log('🔄 Restoring missing users...\n');
    let successCount = 0;
    let failCount = 0;

    for (const user of missingUsers) {
      try {
        const response = await axios.post(
          `http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`,
          {
            command: 'addUser',
            token: '',
            user: user
          },
          { timeout: 5000 }
        );

        if (response.data && response.data.result === 'success') {
          console.log(`✅ Restored: ${user.name} (ID: ${user.id})`);
          successCount++;
        } else {
          console.log(`⚠️  Failed: ${user.name} (ID: ${user.id})`);
          failCount++;
        }

        // Small delay to avoid overwhelming device
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.log(`❌ Error restoring ${user.name}: ${error.message}`);
        failCount++;
      }
    }

    console.log('\n========================================');
    console.log('Restore Summary:');
    console.log('========================================');
    console.log(`✅ Successfully Restored: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);
    console.log('========================================\n');

    if (successCount > 0) {
      console.log('✅ Missing users have been restored to the device!');
    }

  } catch (error) {
    console.error('❌ Auto-restore failed:', error.message);
  }
}

// Run auto-restore
autoRestoreUsers();
