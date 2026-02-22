const axios = require('axios');
const fs = require('fs');
const path = require('path');

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.2'; // Change to your device IP
const DEVICE_PORT = 80;
const CHECK_INTERVAL = 60000; // Check every 1 minute
const MIN_EXPECTED_USERS = 10; // Alert if users drop below this

let lastUserCount = 0;
let lastBackupTime = null;

async function checkDeviceUsers() {
  try {
    console.log(`[${new Date().toISOString()}] Checking device users...`);
    
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
      const currentCount = users.length;
      
      console.log(`✅ Device has ${currentCount} users`);

      // Check for user deletion
      if (lastUserCount > 0 && currentCount < lastUserCount) {
        const deletedCount = lastUserCount - currentCount;
        console.log(`⚠️  WARNING: ${deletedCount} users were deleted!`);
        console.log(`   Previous count: ${lastUserCount}`);
        console.log(`   Current count: ${currentCount}`);
        
        // Log the incident
        logIncident({
          timestamp: new Date().toISOString(),
          previousCount: lastUserCount,
          currentCount: currentCount,
          deletedCount: deletedCount,
          remainingUsers: users.map(u => ({ id: u.id, name: u.name }))
        });
        
        // Alert if critical
        if (currentCount < MIN_EXPECTED_USERS) {
          console.log(`🚨 CRITICAL: User count below minimum threshold!`);
          // Here you could send email/SMS alert
        }
      }

      // Auto-backup every hour
      const now = Date.now();
      if (!lastBackupTime || (now - lastBackupTime) > 3600000) {
        await backupUsers(users);
        lastBackupTime = now;
      }

      lastUserCount = currentCount;
    } else {
      console.log('❌ Failed to get users from device');
    }
  } catch (error) {
    console.error(`❌ Check failed: ${error.message}`);
  }
}

async function backupUsers(users) {
  try {
    const backupDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `ai06-users-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(users, null, 2));

    console.log(`💾 Backup saved: ${backupFile}`);
  } catch (error) {
    console.error(`❌ Backup failed: ${error.message}`);
  }
}

function logIncident(incident) {
  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const logFile = path.join(logDir, 'user-deletion-incidents.log');
  const logEntry = JSON.stringify(incident) + '\n';
  fs.appendFileSync(logFile, logEntry);
}

// Start monitoring
console.log('========================================');
console.log('AI06 Device User Monitor');
console.log('========================================');
console.log(`Device: ${DEVICE_IP}:${DEVICE_PORT}`);
console.log(`Check interval: ${CHECK_INTERVAL / 1000} seconds`);
console.log(`Minimum expected users: ${MIN_EXPECTED_USERS}`);
console.log('========================================\n');

// Initial check
checkDeviceUsers();

// Schedule periodic checks
setInterval(checkDeviceUsers, CHECK_INTERVAL);
