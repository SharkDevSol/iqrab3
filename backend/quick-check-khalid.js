// Quick Check for Khalid's Attendance
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management',
  password: '12345678',
  port: 5432,
});

async function quickCheck() {
  console.log('\n🔍 QUICK CHECK FOR KHALID\n');
  
  try {
    // Check 1: Find Khalid in staff table
    console.log('1️⃣ Looking for Khalid in staff table...');
    const staffResult = await pool.query(`
      SELECT global_staff_id, name, machine_id, role
      FROM staff_teachers.teachers
      WHERE name ILIKE '%khalid%' OR machine_id = '100'
    `);
    
    if (staffResult.rows.length > 0) {
      console.log('   ✅ Found Khalid:');
      staffResult.rows.forEach(s => {
        console.log(`      Name: ${s.name}`);
        console.log(`      Global Staff ID: ${s.global_staff_id}`);
        console.log(`      Machine ID: ${s.machine_id || 'NOT SET'}`);
        console.log(`      Role: ${s.role}`);
      });
    } else {
      console.log('   ❌ Khalid not found!');
    }
    
    // Check 2: Look for attendance records
    console.log('\n2️⃣ Looking for attendance records...');
    const attendanceResult = await pool.query(`
      SELECT * FROM hr_staff_attendance
      WHERE staff_name ILIKE '%khalid%'
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (attendanceResult.rows.length > 0) {
      console.log(`   ✅ Found ${attendanceResult.rows.length} attendance records:`);
      attendanceResult.rows.forEach((r, i) => {
        console.log(`   ${i+1}. Date: ${r.eth_year}/${r.eth_month}/${r.eth_day}`);
        console.log(`      Check-in: ${r.check_in_time || 'N/A'}`);
        console.log(`      Status: ${r.status}`);
      });
    } else {
      console.log('   ❌ No attendance records found for Khalid');
    }
    
    // Check 3: Recent attendance (any staff)
    console.log('\n3️⃣ Recent attendance records (all staff)...');
    const recentResult = await pool.query(`
      SELECT staff_name, eth_year, eth_month, eth_day, check_in_time, status
      FROM hr_staff_attendance
      ORDER BY created_at DESC
      LIMIT 5
    `);
    
    if (recentResult.rows.length > 0) {
      console.log(`   Found ${recentResult.rows.length} recent records:`);
      recentResult.rows.forEach((r, i) => {
        console.log(`   ${i+1}. ${r.staff_name} - ${r.eth_year}/${r.eth_month}/${r.eth_day} - ${r.check_in_time} - ${r.status}`);
      });
    } else {
      console.log('   ⚠️  No attendance records at all!');
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('💡 DIAGNOSIS:');
    
    if (staffResult.rows.length === 0) {
      console.log('❌ Khalid not found in database');
      console.log('   → Add Khalid to staff with machine_id = 100');
    } else if (!staffResult.rows[0].machine_id || staffResult.rows[0].machine_id !== '100') {
      console.log('⚠️  Khalid exists but machine_id is not 100');
      console.log(`   → Current machine_id: ${staffResult.rows[0].machine_id || 'NULL'}`);
      console.log('   → Update it to 100');
    } else if (attendanceResult.rows.length === 0 && recentResult.rows.length === 0) {
      console.log('❌ No attendance records at all');
      console.log('   → WebSocket connection issue');
      console.log('   → Check backend console logs');
    } else if (attendanceResult.rows.length === 0 && recentResult.rows.length > 0) {
      console.log('⚠️  Other staff have attendance but not Khalid');
      console.log('   → Check if Khalid scanned correctly');
      console.log('   → Verify machine ID on device');
    } else {
      console.log('✅ Khalid has attendance records!');
      console.log('   → Check date filter on attendance page');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

quickCheck();
