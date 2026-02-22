const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fixAbsentMarkingTimes() {
  try {
    console.log('\n🔧 Fixing Absent Marking Times\n');
    
    // Get current settings
    const current = await pool.query(`
      SELECT shift1_absent_marking, shift2_absent_marking
      FROM academic_student_attendance_settings
      ORDER BY id DESC LIMIT 1
    `);
    
    if (current.rows.length > 0) {
      console.log('Current settings:');
      console.log(`   Shift 1 absent marking: ${current.rows[0].shift1_absent_marking}`);
      console.log(`   Shift 2 absent marking: ${current.rows[0].shift2_absent_marking}\n`);
    }
    
    // Update to correct times (morning, not night!)
    const result = await pool.query(`
      UPDATE academic_student_attendance_settings
      SET 
        shift1_absent_marking = '09:00:00',
        shift2_absent_marking = '14:00:00',
        updated_at = NOW()
      WHERE id = (SELECT id FROM academic_student_attendance_settings ORDER BY id DESC LIMIT 1)
      RETURNING shift1_absent_marking, shift2_absent_marking
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Updated settings:');
      console.log(`   Shift 1 absent marking: ${result.rows[0].shift1_absent_marking} (9:00 AM)`);
      console.log(`   Shift 2 absent marking: ${result.rows[0].shift2_absent_marking} (2:00 PM)\n`);
      console.log('✅ Absent marking times fixed!\n');
      console.log('ℹ️  Students will now be marked absent after:');
      console.log('   - 9:00 AM for Shift 1 students');
      console.log('   - 2:00 PM for Shift 2 students\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixAbsentMarkingTimes();
