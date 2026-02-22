const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.2'; // Change to your device IP
const DEVICE_PORT = 80;

async function syncUsersToDatabase() {
  try {
    console.log('========================================');
    console.log('AI06 to Staff Database Sync');
    console.log('========================================\n');
    console.log(`📡 Connecting to AI06 device at ${DEVICE_IP}:${DEVICE_PORT}...`);
    
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

      let syncedCount = 0;
      let skippedCount = 0;
      let errorCount = 0;

      for (const user of users) {
        try {
          // Check if staff with this machineId already exists
          const existingStaff = await prisma.staff.findUnique({
            where: { machineId: user.id }
          });

          if (existingStaff) {
            console.log(`⏭️  Skipped: ${user.name} (Machine ID: ${user.id}) - Already exists`);
            skippedCount++;
            continue;
          }

          // Split name into first and last
          const nameParts = user.name.trim().split(' ');
          const firstName = nameParts[0] || 'Unknown';
          const lastName = nameParts.slice(1).join(' ') || 'Staff';

          // Create new staff record
          await prisma.staff.create({
            data: {
              employeeNumber: `EMP${user.id.toString().padStart(4, '0')}`,
              machineId: user.id,
              firstName: firstName,
              lastName: lastName,
              email: `staff${user.id}@school.com`,
              phone: '0900000000',
              staffType: 'TEACHER', // Default - can be changed later
              dateOfBirth: new Date('1990-01-01'),
              gender: 'MALE', // Default - can be changed later
              hireDate: new Date(),
              contractType: 'PERMANENT',
              status: 'ACTIVE'
            }
          });

          console.log(`✅ Synced: ${user.name} (Machine ID: ${user.id})`);
          syncedCount++;

        } catch (error) {
          console.log(`❌ Error syncing ${user.name}: ${error.message}`);
          errorCount++;
        }
      }

      console.log('\n========================================');
      console.log('Sync Summary:');
      console.log('========================================');
      console.log(`✅ Successfully Synced: ${syncedCount}`);
      console.log(`⏭️  Skipped (Already Exists): ${skippedCount}`);
      console.log(`❌ Errors: ${errorCount}`);
      console.log('========================================\n');

      if (syncedCount > 0) {
        console.log('✅ Users have been synced to Staff database!');
        console.log('📝 Note: Default values were used for email, phone, etc.');
        console.log('   Please update staff details in the HR module.');
      }

    } else {
      console.log('❌ Failed to get users from device');
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Check device IP is correct');
    console.error('2. Verify device is powered on');
    console.error('3. Ensure device and server are on same network');
    console.error(`4. Try accessing: http://${DEVICE_IP} in browser`);
  } finally {
    await prisma.$disconnect();
  }
}

// Run sync
syncUsersToDatabase();
