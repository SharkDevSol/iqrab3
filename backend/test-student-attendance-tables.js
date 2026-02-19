const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/school_management2'
});

async function testStudentAttendanceTables() {
  try {
    console.log('Testing student attendance tables...\n');
    
    // Test 1: Check if tables exist
    console.log('1. Checking if tables exist...');
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('academic_student_attendance_settings', 'academic_class_shift_assignment', 'academic_student_attendance')
      ORDER BY table_name
    `;
    
    const tablesResult = await pool.query(tablesQuery);
    console.log(`   Found ${tablesResult.rows.length} tables:`);
    tablesResult.rows.forEach(row => {
      console.log(`      ✓ ${row.table_name}`);
    });
    
    if (tablesResult.rows.length < 3) {
      console.log('\n   ⚠️ Missing tables! Running schema...');
      const fs = require('fs');
      const path = require('path');
      const schemaPath = path.join(__dirname, 'database/student_attendance_settings_schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      console.log('   ✓ Tables created successfully');
    }
    
    // Test 2: Check settings table
    console.log('\n2. Checking settings table...');
    const settingsResult = await pool.query('SELECT * FROM academic_student_attendance_settings LIMIT 1');
    
    if (settingsResult.rows.length === 0) {
      console.log('   ⚠️ No settings found, inserting defaults...');
      await pool.query(`
        INSERT INTO academic_student_attendance_settings (
          check_in_start_time, check_in_end_time, late_threshold_time, absent_marking_time,
          shift1_check_in_start, shift1_check_in_end, shift1_late_threshold, shift1_absent_marking,
          shift2_check_in_start, shift2_check_in_end, shift2_late_threshold, shift2_absent_marking
        ) VALUES (
          '07:00:00', '08:30:00', '08:00:00', '09:00:00',
          '07:00:00', '08:30:00', '08:00:00', '09:00:00',
          '12:00:00', '13:30:00', '13:00:00', '14:00:00'
        )
      `);
      console.log('   ✓ Default settings inserted');
    } else {
      console.log('   ✓ Settings found:');
      const settings = settingsResult.rows[0];
      console.log(`      - Check-in: ${settings.check_in_start_time} - ${settings.check_in_end_time}`);
      console.log(`      - Late threshold: ${settings.late_threshold_time}`);
      console.log(`      - Absent marking: ${settings.absent_marking_time}`);
      console.log(`      - Shift 1: ${settings.shift1_check_in_start} - ${settings.shift1_check_in_end}`);
      console.log(`      - Shift 2: ${settings.shift2_check_in_start} - ${settings.shift2_check_in_end}`);
    }
    
    // Test 3: Check class shift assignments
    console.log('\n3. Checking class shift assignments...');
    const shiftsResult = await pool.query('SELECT * FROM academic_class_shift_assignment');
    console.log(`   Found ${shiftsResult.rows.length} class shift assignments`);
    
    if (shiftsResult.rows.length > 0) {
      shiftsResult.rows.forEach(row => {
        console.log(`      - ${row.class_name}: Shift ${row.shift_number}`);
      });
    } else {
      console.log('   ℹ️ No class shift assignments yet (this is normal for new setup)');
    }
    
    // Test 4: Check attendance records
    console.log('\n4. Checking attendance records...');
    const attendanceResult = await pool.query('SELECT COUNT(*) FROM academic_student_attendance');
    console.log(`   Found ${attendanceResult.rows[0].count} attendance records`);
    
    console.log('\n✅ All tests passed!');
    console.log('\nStudent attendance system is ready to use.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testStudentAttendanceTables();
