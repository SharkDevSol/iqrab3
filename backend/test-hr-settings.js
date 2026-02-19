const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/school_management2'
});

async function testHRSettings() {
  try {
    console.log('Testing HR attendance time settings...\n');
    
    // Test 1: Check if table exists
    console.log('1. Checking if table exists...');
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name = 'hr_attendance_time_settings'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('   ✓ Table exists');
    } else {
      console.log('   ✗ Table does not exist');
      return;
    }
    
    // Test 2: Check settings
    console.log('\n2. Checking settings...');
    const settings = await pool.query('SELECT * FROM hr_attendance_time_settings LIMIT 1');
    
    if (settings.rows.length > 0) {
      console.log('   ✓ Settings found:');
      const s = settings.rows[0];
      console.log(`      - Late threshold: ${s.late_threshold}`);
      console.log(`      - Half-day threshold: ${s.half_day_threshold} hours`);
      console.log(`      - Max checkout hours: ${s.max_checkout_hours} hours`);
      console.log(`      - Absent threshold: ${s.absent_threshold_time}`);
      console.log(`      - Weekend days: ${s.weekend_days.length > 0 ? s.weekend_days.join(', ') : 'None'}`);
    } else {
      console.log('   ⚠️ No settings found');
    }
    
    console.log('\n✅ All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testHRSettings();
