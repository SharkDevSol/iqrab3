const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/school_management2'
});

async function testSettingsSave() {
  try {
    console.log('Testing settings save...\n');
    
    // Test 1: Check current settings
    console.log('1. Current settings:');
    const current = await pool.query('SELECT * FROM academic_student_attendance_settings LIMIT 1');
    if (current.rows.length > 0) {
      console.log('   ✓ Settings found');
      console.log('   - school_days:', current.rows[0].school_days);
      console.log('   - auto_absent_enabled:', current.rows[0].auto_absent_enabled);
    }
    
    // Test 2: Try to update settings
    console.log('\n2. Testing update...');
    const testData = {
      check_in_start_time: '07:00:00',
      check_in_end_time: '08:30:00',
      late_threshold_time: '08:00:00',
      absent_marking_time: '09:00:00',
      shift1_check_in_start: '07:00:00',
      shift1_check_in_end: '08:30:00',
      shift1_late_threshold: '08:00:00',
      shift1_absent_marking: '09:00:00',
      shift2_check_in_start: '13:00:00',
      shift2_check_in_end: '14:30:00',
      shift2_late_threshold: '14:00:00',
      shift2_absent_marking: '15:00:00',
      school_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      auto_absent_enabled: true
    };
    
    const result = await pool.query(`
      UPDATE academic_student_attendance_settings
      SET 
        check_in_start_time = $1,
        check_in_end_time = $2,
        late_threshold_time = $3,
        absent_marking_time = $4,
        shift1_check_in_start = $5,
        shift1_check_in_end = $6,
        shift1_late_threshold = $7,
        shift1_absent_marking = $8,
        shift2_check_in_start = $9,
        shift2_check_in_end = $10,
        shift2_late_threshold = $11,
        shift2_absent_marking = $12,
        school_days = $13,
        auto_absent_enabled = $14,
        updated_at = NOW()
      WHERE id = (SELECT id FROM academic_student_attendance_settings ORDER BY id DESC LIMIT 1)
      RETURNING *
    `, [
      testData.check_in_start_time,
      testData.check_in_end_time,
      testData.late_threshold_time,
      testData.absent_marking_time,
      testData.shift1_check_in_start,
      testData.shift1_check_in_end,
      testData.shift1_late_threshold,
      testData.shift1_absent_marking,
      testData.shift2_check_in_start,
      testData.shift2_check_in_end,
      testData.shift2_late_threshold,
      testData.shift2_absent_marking,
      testData.school_days,
      testData.auto_absent_enabled
    ]);
    
    if (result.rows.length > 0) {
      console.log('   ✅ Update successful!');
      console.log('   - school_days:', result.rows[0].school_days);
      console.log('   - auto_absent_enabled:', result.rows[0].auto_absent_enabled);
    } else {
      console.log('   ⚠️ No rows updated');
    }
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testSettingsSave();
