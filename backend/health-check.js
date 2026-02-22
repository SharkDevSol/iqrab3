const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function healthCheck() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   ATTENDANCE SYSTEM HEALTH CHECK                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const issues = [];
  const warnings = [];

  try {
    // 1. Database Connection
    console.log('1️⃣  Database Connection...');
    try {
      await pool.query('SELECT 1');
      console.log('   ✅ Database connected\n');
    } catch (err) {
      console.log('   ❌ Database connection failed\n');
      issues.push('Database connection failed');
    }

    // 2. Settings Check
    console.log('2️⃣  Settings Check...');
    const settingsResult = await pool.query(`
      SELECT * FROM academic_student_attendance_settings 
      ORDER BY id DESC LIMIT 1
    `);

    if (settingsResult.rows.length === 0) {
      console.log('   ❌ No settings found\n');
      issues.push('No attendance settings configured');
    } else {
      const settings = settingsResult.rows[0];
      
      if (!settings.auto_absent_enabled) {
        console.log('   ⚠️  Auto-absent is DISABLED\n');
        warnings.push('Auto-absent marking is disabled');
      } else {
        console.log('   ✅ Auto-absent enabled\n');
      }

      if (settings.shift1_absent_marking !== '09:00:00') {
        console.log(`   ⚠️  Shift 1 time is ${settings.shift1_absent_marking} (expected 09:00:00)\n`);
        warnings.push('Shift 1 absent marking time is not standard');
      }

      if (settings.shift2_absent_marking !== '14:00:00') {
        console.log(`   ⚠️  Shift 2 time is ${settings.shift2_absent_marking} (expected 14:00:00)\n`);
        warnings.push('Shift 2 absent marking time is not standard');
      }
    }

    // 3. Students Check
    console.log('3️⃣  Students Check...');
    const classesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);

    if (classesResult.rows.length === 0) {
      console.log('   ⚠️  No class tables found\n');
      warnings.push('No student classes configured');
    } else {
      let totalStudents = 0;
      for (const row of classesResult.rows) {
        const className = row.table_name;
        const countResult = await pool.query(`
          SELECT COUNT(*) as count FROM classes_schema."${className}"
        `);
        totalStudents += parseInt(countResult.rows[0].count);
      }
      console.log(`   ✅ ${classesResult.rows.length} classes, ${totalStudents} students\n`);
    }

    // 4. Today's Attendance
    console.log('4️⃣  Today\'s Attendance...');
    const { getCurrentEthiopianDate } = require('./utils/ethiopianCalendar');
    const currentDate = getCurrentEthiopianDate();

    const todayResult = await pool.query(`
      SELECT COUNT(*) as count
      FROM academic_student_attendance
      WHERE ethiopian_year = $1
        AND ethiopian_month = $2
        AND ethiopian_day = $3
    `, [currentDate.year, currentDate.month, currentDate.day]);

    const todayCount = parseInt(todayResult.rows[0].count);
    if (todayCount === 0) {
      console.log('   ⚠️  No attendance records for today yet\n');
      warnings.push('No attendance marked for today');
    } else {
      console.log(`   ✅ ${todayCount} attendance records for today\n`);
    }

    // 5. Guardian API Check
    console.log('5️⃣  Guardian API Check...');
    try {
      const guardianRoutes = require('./routes/guardianStudentAttendance');
      console.log('   ✅ Guardian attendance API loaded\n');
    } catch (err) {
      console.log('   ❌ Guardian attendance API not found\n');
      issues.push('Guardian attendance API not configured');
    }

    // 6. Auto-Marker Check
    console.log('6️⃣  Auto-Marker Check...');
    try {
      const { autoMarker } = require('./services/studentAttendanceAutoMarker');
      if (autoMarker.isRunning) {
        console.log('   ✅ Auto-marker is running\n');
      } else {
        console.log('   ⚠️  Auto-marker is not running\n');
        warnings.push('Auto-marker service is not active');
      }
    } catch (err) {
      console.log('   ❌ Auto-marker service not found\n');
      issues.push('Auto-marker service not configured');
    }

    // Summary
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║   HEALTH CHECK SUMMARY                                 ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ ALL SYSTEMS OPERATIONAL!\n');
      console.log('   The attendance system is fully functional and automated.\n');
    } else {
      if (issues.length > 0) {
        console.log('❌ CRITICAL ISSUES:\n');
        issues.forEach((issue, i) => {
          console.log(`   ${i + 1}. ${issue}`);
        });
        console.log('');
      }

      if (warnings.length > 0) {
        console.log('⚠️  WARNINGS:\n');
        warnings.forEach((warning, i) => {
          console.log(`   ${i + 1}. ${warning}`);
        });
        console.log('');
      }
    }

    console.log('═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  } finally {
    await pool.end();
  }
}

healthCheck();
