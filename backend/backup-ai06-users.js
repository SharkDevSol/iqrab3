const axios = require('axios');
const fs = require('fs');
const path = require('path');

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.2'; // Change to your device IP
const DEVICE_PORT = 80;

async function backupUsers() {
  try {
    console.log('========================================');
    console.log('AI06 User Backup Script');
    console.log('========================================\n');
    console.log(`Connecting to AI06 device at ${DEVICE_IP}:${DEVICE_PORT}...`);
    
    // Get all users from device
    const response = await axios.post(
      `http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`,
      {
        command: 'getUserList',
        token: ''
      },
      { timeout: 10000 }
    );

    if (response.data && response.data.result === 'success') {
      const users = response.data.users || [];
      console.log(`✅ Found ${users.length} users on device\n`);

      // Create backup directory
      const backupDir = path.join(__dirname, 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
        console.log('📁 Created backup directory');
      }

      // Save backup
      const timestamp = new Date().toISOString().split('T')[0];
      const backupFile = path.join(backupDir, `ai06-users-backup-${timestamp}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));

      console.log(`✅ Backup saved: ${backupFile}\n`);
      console.log('User Summary:');
      console.log('========================================');
      users.forEach(user => {
        console.log(`  ID: ${user.id.toString().padEnd(6)} | Name: ${user.name}`);
      });
      console.log('========================================\n');

      return users;
    } else {
      console.log('❌ Failed to get users from device');
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check device IP is correct');
    console.error('2. Verify device is powered on');
    console.error('3. Ensure device and server are on same network');
    console.error(`4. Try accessing: http://${DEVICE_IP} in browser`);
  }
}

// Run backup
backupUsers();
