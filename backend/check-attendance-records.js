// Check Attendance Records - Debug Script
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkAttendanceRecords() {
  console.log('🔍 CHECKING ATTENDANCE RECORDS\n');
  console.log('=' .repeat(60));

  try {
    // Check 1: Look for Khalid's staff record
    console.log('\n📋 Step 1: Checking Staff Record for Khalid (Machine ID: 100)');
    const staffCheck = await pool.query(`
      SELECT global_staff_id, name, machine_id, role, staff_work_time
      FROM staff_teachers.teachers
      WHERE machine_id = '100' OR name ILIKE '%khalid%'
    `);

    if (staffCheck.rows.length > 0) {
      console.log('   ✅ Found staff record:');
      staffCheck.rows.forEach(staff => {
        console.log(`      - Name: ${staff.name}`);
        console.log(`      - Global Staff ID: ${staff.global_staff_id}`);
        console.log(`      - Machine ID: ${staff.machine_id}`);
        console.log(`      - Role: ${staff.role}`);
        console.log(`      - Work Time: ${staff.staff_work_time}`);
      });
    } else {
      console.log('   ❌ No staff record found for Khalid or Machine ID 100');
      console.log('   → This is the problem! Staff must exist with machine_id = 100');
    }

    // Check 2: Look for attendance records
    console.log('\n📅 Step 2: Checking Attendance Records');
    
    // Check hr_staff_attendance table
    const hrAttendance = await pool.query(`
      SELECT * FROM hr_staff_attendance
      WHERE staff_name ILIKE '%khalid%'
      ORDER BY eth_year DESC, eth_month DESC, eth_day DESC
      LIMIT 5
    `);

    if (hrAttendance.rows.length > 0) {
      console.log('   ✅ Found attendance in hr_staff_attendance:');
      hrAttendance.rows.forEach(record => {
        console.log(`      - Date: ${record.eth_year}/${record.eth_month}/${record.eth_day}`);
        console.log(`      - Staff: ${record.staff_name} (ID: ${record.staff_id})`);
        console.log(`      - Check-in: ${record.check_in_time || 'N/A'}`);
        console.log(`      - Check-out: ${record.check_out_time || 'N/A'}`);
        console.log(`      - Status: ${record.status}`);
        console.log('      ---');
      });
    } else {
      console.log('   ⚠️  No attendance records found in hr_staff_attendance');
    }

    // Check 3: Check today's date in Ethiopian calendar
    console.log('\n📆 Step 3: Current Date Information');
    const now = new Date();
    console.log(`   Gregorian Date: ${now.toISOString().split('T')[0]}`);
    console.log(`   Time: ${now.toLocaleTimeString()}`);
    
    // Simple Ethiopian date calculation
    const ethYear = now.getFullYear() - 8;
    const ethMonth = now.getMonth() + 5; // Rough approximation
    const ethDay = now.getDate() - 7;
    console.log(`   Ethiopian Date (approx): ${ethYear}/${ethMonth}/${ethDay}`);

    // Check 4: Recent attendance records (any staff)
    console.log('\n📊 Step 4: Recent Attendance Records (All Staff)');
    const recentAttendance = await pool.query(`
      SELECT * FROM hr_staff_attendance
      ORDER BY created_at DESC
      LIMIT 10
    `);

    if (recentAttendance.rows.length > 0) {
      console.log(`   Found ${recentAttendance.rows.length} recent records:`);
      recentAttendance.rows.forEach((record, idx) => {
        console.log(`   ${idx + 1}. ${record.staff_name} - ${record.eth_year}/${record.eth_month}/${record.eth_day} - ${record.status}`);
      });
    } else {
      console.log('   ⚠️  No attendance records found at all!');
      console.log('   → This means the machine is not sending data OR');
      console.log('   → The WebSocket service is not receiving/saving data');
    }

    // Check 5: Check if table exists and structure
    console.log('\n🗄️  Step 5: Database Table Structure');
    const tableCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'hr_staff_attendance'
      ORDER BY ordinal_position
    `);

    if (tableCheck.rows.length > 0) {
      console.log('   ✅ Table hr_staff_attendance exists with columns:');
      tableCheck.rows.forEach(col => {
        console.log(`      - ${col.column_name} (${col.data_type})`);
      });
    } else {
      console.log('   ❌ Table hr_staff_attendance does not exist!');
      console.log('   → Run database migration to create the table');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 DIAGNOSIS SUMMARY');
    console.log('='.repeat(60));

    const hasStaff = staffCheck.rows.length > 0;
    const hasAttendance = hrAttendance.rows.length > 0;
    const hasAnyAttendance = recentAttendance.rows.length > 0;

    if (!hasStaff) {
      console.log('❌ PROBLEM: Khalid not found with Machine ID 100');
      console.log('   SOLUTION: Update Khalid\'s record to set machine_id = 100');
      console.log('   SQL: UPDATE staff_teachers.teachers SET machine_id = \'100\' WHERE name ILIKE \'%khalid%\'');
    } else if (!hasAttendance && !hasAnyAttendance) {
      console.log('❌ PROBLEM: No attendance records at all');
      console.log('   SOLUTION: Check WebSocket connection and backend logs');
      console.log('   1. Is backend server running?');
      console.log('   2. Is AI06 WebSocket service connected?');
      console.log('   3. Check backend console for attendance messages');
    } else if (!hasAttendance && hasAnyAttendance) {
      console.log('⚠️  PROBLEM: Other staff have attendance but not Khalid');
      console.log('   SOLUTION: Check if Khalid scanned correctly');
      console.log('   1. Verify Machine ID 100 is correct on the device');
      console.log('   2. Check backend logs when Khalid scans');
      console.log('   3. Verify name matching (case-sensitive)');
    } else {
      console.log('✅ Khalid has attendance records!');
      console.log('   Check the attendance page with correct date filter');
    }

    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Check backend console logs when scanning');
    console.log('   2. Verify WebSocket connection is active');
    console.log('   3. Ensure machine_id = 100 is set for Khalid');
    console.log('   4. Refresh the attendance page');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
    console.log('\n' + '='.repeat(60));
  }
}

checkAttendanceRecords();
