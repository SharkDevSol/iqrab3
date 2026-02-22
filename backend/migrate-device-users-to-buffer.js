const axios = require('axios');
const pool = require('./config/db');
require('dotenv').config();

// AI06 Device Configuration
const DEVICE_IP = '192.168.1.2';
const DEVICE_PORT = 80;

/**
 * Migration script to populate device_user_buffer from current AI06 device users
 * This script is idempotent and safe to run multiple times
 */
async function migrateDeviceUsersToBuffer() {
  console.log('========================================');
  console.log('Device User Buffer Migration');
  console.log('========================================\n');

  try {
    // Step 1: Get all users from AI06 device
    console.log('📡 Connecting to AI06 device...');
    const deviceResponse = await axios.post(
      `http://${DEVICE_IP}:${DEVICE_PORT}/cgi-bin/js/app/module/userManager.js`,
      {
        command: 'getUserList',
        token: ''
      },
      { timeout: 10000 }
    );

    if (!deviceResponse.data || deviceResponse.data.result !== 'success') {
      console.log('❌ Failed to get users from device');
      return;
    }

    const deviceUsers = deviceResponse.data.users || [];
    console.log(`✅ Retrieved ${deviceUsers.length} users from device\n`);

    // Step 2: Identify unmapped users
    console.log('🔍 Identifying unmapped users...');
    let unmappedCount = 0;
    let mappedCount = 0;
    let bufferedCount = 0;

    for (const user of deviceUsers) {
      try {
        // Check if user has a mapping
        const mappingResult = await pool.query(
          'SELECT person_id FROM user_machine_mapping WHERE machine_user_id = $1',
          [user.id]
        );

        if (mappingResult.rows.length === 0) {
          // User is unmapped - add to buffer
          unmappedCount++;

          // Check if already in buffer (idempotent)
          const bufferCheck = await pool.query(
            'SELECT id FROM device_user_buffer WHERE device_user_id = $1',
            [user.id]
          );

          if (bufferCheck.rows.length === 0) {
            // Insert into buffer
            await pool.query(
              `INSERT INTO device_user_buffer 
               (device_user_id, name, card_number, privilege, password, group_id, timezone_id, mapping_status)
               VALUES ($1, $2, $3, $4, $5, $6, $7, 'unmapped')`,
              [
                user.id,
                user.name || null,
                user.cardNumber || null,
                user.privilege || null,
                user.password || null,
                user.groupId || null,
                user.timezoneId || null
              ]
            );
            bufferedCount++;
            console.log(`  ✅ Buffered: ${user.name || 'Unknown'} (ID: ${user.id})`);
          } else {
            // Update last_seen_at
            await pool.query(
              'UPDATE device_user_buffer SET last_seen_at = NOW() WHERE device_user_id = $1',
              [user.id]
            );
            console.log(`  ♻️  Updated: ${user.name || 'Unknown'} (ID: ${user.id})`);
          }
        } else {
          mappedCount++;
        }
      } catch (error) {
        console.error(`  ❌ Error processing user ${user.id}:`, error.message);
      }
    }

    console.log('\n========================================');
    console.log('Migration Summary:');
    console.log('========================================');
    console.log(`📊 Total device users: ${deviceUsers.length}`);
    console.log(`✅ Mapped users: ${mappedCount}`);
    console.log(`⚠️  Unmapped users: ${unmappedCount}`);
    console.log(`💾 Newly buffered: ${bufferedCount}`);
    console.log('========================================\n');

    if (unmappedCount > 0) {
      console.log('💡 Next steps:');
      console.log('   1. Review unmapped users: GET /api/device-users/buffer');
      console.log('   2. Map users to staff records: POST /api/device-users/buffer/:id/map');
      console.log('   3. Monitor device users: GET /api/device-users/monitoring/status\n');
    } else {
      console.log('✅ All device users are mapped! No action needed.\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error.stack);
  } finally {
    // Close database connection
    await pool.end();
  }
}

// Run migration
migrateDeviceUsersToBuffer();
