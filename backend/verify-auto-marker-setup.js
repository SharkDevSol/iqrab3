const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function verifySetup() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║   AUTO-MARKER SETUP VERIFICATION                      ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // 1. Check settings
    console.log('1️⃣  Checking Settings...');
    const settingsResult = await pool.query(`
      SELECT * FROM academic_student_attendance_settings 
      ORDER BY id DESC LIMIT 1
    `);

    if (settingsResult.rows.length === 0) {
      console.log('   ❌ No settings found!\n');
      return;
    }

    const settings = settingsResult.rows[0];
    console.log('   ✅ Settings found');
    console.log(`   📅 School days: ${settings.school_days.join(', ')}`);
    console.log(`   🤖 Auto-absent enabled: ${settings.auto_absent_enabled ? '✅ YES' : '❌ NO'}`);
    console.log(`   ⏰ Shift 1 absent marking: ${settings.shift1_absent_marking}`);
    console.log(`   ⏰ Shift 2 absent marking: ${settings.shift2_absent_marking}\n`);

    if (!settings.auto_absent_enabled) {
      console.log('   ⚠️  WARNING: Auto-absent is DISABLED!\n');
      console.log('   To enable, run:');
      console.log('   UPDATE academic_student_attendance_settings SET auto_absent_enabled = true;\n');
    }

    // 2. Check current date
    console.log('2️⃣  Checking Current Date...');
    const { getCurrentEthiopianDate, getEthiopianDayOfWeek } = require('./utils/ethiopianCalendar');
    const currentDate = getCurrentEthiopianDate();
    const dayOfWeek = getEthiopianDayOfWeek(currentDate.year, currentDate.month, currentDate.day);
    
    console.log(`   📅 Ethiopian Date: ${currentDate.year}/${currentDate.month}/${currentDate.day}`);
    console.log(`   📅 Day: ${dayOfWeek}`);
    
    const isSchoolDay = settings.school_days.includes(dayOfWeek);
    console.log(`   ${isSchoolDay ? '✅' : '❌'} ${isSchoolDay ? 'Is a school day' : 'Not a school day'}\n`);

    // 3. Check current time vs marking time
    console.log('3️⃣  Checking Current Time...');
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    console.log(`   🕐 Current time: ${currentTime}`);
    
    const shift1Time = settings.shift1_absent_marking.substring(0, 5);
    const shift2Time = settings.shift2_absent_marking.substring(0, 5);
    
    const pastShift1 = currentTime >= shift1Time;
    const pastShift2 = currentTime >= shift2Time;
    
    console.log(`   ${pastShift1 ? '✅' : '⏳'} Shift 1 marking time (${shift1Time}): ${pastShift1 ? 'PASSED' : 'Not yet'}`);
    console.log(`   ${pastShift2 ? '✅' : '⏳'} Shift 2 marking time (${shift2Time}): ${pastShift2 ? 'PASSED' : 'Not yet'}\n`);

    // 4. Check students
    console.log('4️⃣  Checking Students...');
    const classesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);
    
    console.log(`   📚 Total classes: ${classesResult.rows.length}`);
    
    let totalStudents = 0;
    for (const row of classesResult.rows) {
      const className = row.table_name;
      const countResult = await pool.query(`
        SELECT COUNT(*) as count FROM classes_schema."${className}"
      `);
      totalStudents += parseInt(countResult.rows[0].count);
    }
    
    console.log(`   👥 Total students: ${totalStudents}\n`);

    // 5. Check today's attendance
    if (isSchoolDay) {
      console.log('5️⃣  Checking Today\'s Attendance...');
      const todayResult = await pool.query(`
        SELECT 
          status,
          COUNT(*) as count
        FROM academic_student_attendance
        WHERE ethiopian_year = $1
          AND ethiopian_month = $2
          AND ethiopian_day = $3
        GROUP BY status
      `, [currentDate.year, currentDate.month, currentDate.day]);
      
      if (todayResult.rows.length === 0) {
        console.log('   ⚠️  No attendance records for today yet\n');
      } else {
        console.log('   📊 Today\'s attendance:');
        todayResult.rows.forEach(row => {
          console.log(`      ${row.status}: ${row.count}`);
        });
        console.log('');
      }
    }

    // 6. Final verdict
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   VERDICT                                              ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const allGood = settings.auto_absent_enabled && 
                    settings.shift1_absent_marking === '09:00:00' &&
                    settings.shift2_absent_marking === '14:00:00';

    if (allGood) {
      console.log('✅ AUTO-MARKER IS PROPERLY CONFIGURED!\n');
      console.log('   The system will automatically mark students absent:');
      console.log('   • Every hour (when server is running)');
      console.log('   • After 9:00 AM for Shift 1 students');
      console.log('   • After 2:00 PM for Shift 2 students');
      console.log('   • Only on school days');
      console.log('   • Even if biometric device is offline\n');
    } else {
      console.log('⚠️  CONFIGURATION ISSUES DETECTED!\n');
      if (!settings.auto_absent_enabled) {
        console.log('   ❌ Auto-absent is disabled');
      }
      if (settings.shift1_absent_marking !== '09:00:00') {
        console.log(`   ⚠️  Shift 1 time is ${settings.shift1_absent_marking} (should be 09:00:00)`);
      }
      if (settings.shift2_absent_marking !== '14:00:00') {
        console.log(`   ⚠️  Shift 2 time is ${settings.shift2_absent_marking} (should be 14:00:00)`);
      }
      console.log('');
    }

    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

verifySetup();
