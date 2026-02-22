const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testAutoMarkerToday() {
  try {
    console.log('\n🔍 Testing Auto-Marker for Today\n');
    
    // Use the same method as the auto-marker
    const { getCurrentEthiopianDate } = require('./utils/ethiopianCalendar');
    const currentDate = getCurrentEthiopianDate();
    
    console.log(`📅 Current Ethiopian Date: ${currentDate.year}/${currentDate.month}/${currentDate.day}`);
    
    // Get current time
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    console.log(`🕐 Current Time: ${currentTime}\n`);
    
    // Get settings
    const settingsResult = await pool.query(`
      SELECT * FROM academic_student_attendance_settings 
      ORDER BY id DESC LIMIT 1
    `);
    
    if (settingsResult.rows.length === 0) {
      console.log('❌ No settings found');
      return;
    }
    
    const settings = settingsResult.rows[0];
    console.log(`✅ Auto-absent enabled: ${settings.auto_absent_enabled}`);
    console.log(`   - School days: ${settings.school_days.join(', ')}`);
    console.log(`   - Shift 1 absent marking: ${settings.shift1_absent_marking}`);
    console.log(`   - Shift 2 absent marking: ${settings.shift2_absent_marking}\n`);
    
    // Get day of week
    const { getEthiopianDayOfWeek } = require('./utils/ethiopianCalendar');
    const dayOfWeek = getEthiopianDayOfWeek(currentDate.year, currentDate.month, currentDate.day);
    console.log(`📅 Day of Week: ${dayOfWeek}\n`);
    
    // Check if today is a school day
    if (!settings.school_days.includes(dayOfWeek)) {
      console.log(`ℹ️  Today (${dayOfWeek}) is not a school day`);
      return;
    }
    
    console.log(`✅ Today is a school day\n`);
    
    // Get all students from KG1B class
    const studentsResult = await pool.query(`
      SELECT school_id, student_name, class_id, smachine_id
      FROM classes_schema."KG1B"
    `);
    
    console.log(`👥 Students in KG1B: ${studentsResult.rows.length}\n`);
    
    // Check attendance records for today
    for (const student of studentsResult.rows) {
      const attendanceResult = await pool.query(`
        SELECT * FROM academic_student_attendance
        WHERE student_id = $1
          AND class_name = 'KG1B'
          AND ethiopian_year = $2
          AND ethiopian_month = $3
          AND ethiopian_day = $4
      `, [String(student.school_id), currentDate.year, currentDate.month, currentDate.day]);
      
      if (attendanceResult.rows.length > 0) {
        const record = attendanceResult.rows[0];
        console.log(`   ${student.student_name}: ${record.status} (${record.check_in_time || 'no time'})`);
      } else {
        console.log(`   ${student.student_name}: NO RECORD ❌`);
        
        // Check if we should mark absent
        const absentMarkingTime = settings.shift1_absent_marking;
        const absentTimeOnly = absentMarkingTime.substring(0, 5);
        
        if (currentTime >= absentTimeOnly) {
          console.log(`      → Should be marked ABSENT (current time ${currentTime} >= ${absentTimeOnly})`);
        } else {
          console.log(`      → Too early to mark absent (current time ${currentTime} < ${absentTimeOnly})`);
        }
      }
    }
    
    console.log('\n✅ Test complete\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testAutoMarkerToday();
