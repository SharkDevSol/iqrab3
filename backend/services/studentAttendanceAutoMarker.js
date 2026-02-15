const pool = require('../config/db');
const { getCurrentEthiopianDate, getEthiopianDayOfWeek } = require('../utils/ethiopianCalendar');

// Calculate week number from day
const getWeekNumber = (day) => {
  return Math.ceil(day / 7);
};

// Get all students from all class tables with their shift assignments
const getAllStudents = async () => {
  try {
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);

    let allStudents = [];

    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      
      // Get shift assignment for this class
      const shiftResult = await pool.query(`
        SELECT shift_number 
        FROM academic_class_shift_assignment 
        WHERE class_name = $1
      `, [tableName]);
      
      const shiftNumber = shiftResult.rows.length > 0 ? shiftResult.rows[0].shift_number : 1;
      
      const studentsResult = await pool.query(`
        SELECT 
          CAST(school_id AS VARCHAR) as student_id,
          student_name,
          smachine_id,
          '${tableName}' as class_name,
          ${shiftNumber} as shift_number
        FROM classes_schema."${tableName}"
        WHERE smachine_id IS NOT NULL
          AND (is_active = TRUE OR is_active IS NULL)
        ORDER BY student_name
      `);

      allStudents = allStudents.concat(studentsResult.rows);
    }

    return allStudents;
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

// Main auto-marker function - marks all past school days without records
async function markAbsentStudents() {
  console.log('\n========================================');
  console.log('🤖 Student Attendance Auto-Marker');
  console.log('========================================\n');

  try {
    // Get settings
    const settingsResult = await pool.query(
      'SELECT * FROM academic_student_attendance_settings ORDER BY id DESC LIMIT 1'
    );

    if (settingsResult.rows.length === 0) {
      console.log('⚠️  No settings found. Please configure attendance settings first.');
      return { success: false, message: 'No settings found' };
    }

    const settings = settingsResult.rows[0];

    // Check if auto-absent is enabled
    if (!settings.auto_absent_enabled) {
      console.log('ℹ️  Auto-absent marking is disabled in settings.');
      return { success: false, message: 'Auto-absent disabled' };
    }

    // Get current Ethiopian date
    const currentDate = getCurrentEthiopianDate();
    console.log(`📅 Current Date: ${currentDate.year}/${currentDate.month}/${currentDate.day}`);

    // Get all students
    const students = await getAllStudents();
    console.log(`👥 Total students: ${students.length}\n`);

    let totalMarked = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const daysProcessed = [];

    // Process all days from start of year until today (inclusive)
    for (let month = 1; month <= currentDate.month; month++) {
      const daysInMonth = month === 13 ? 5 : 30; // Pagume has 5 days, others have 30
      const maxDay = month === currentDate.month ? currentDate.day : daysInMonth; // Include today

      for (let day = 1; day <= maxDay; day++) {
        const dayOfWeek = getEthiopianDayOfWeek(currentDate.year, month, day);
        
        // Skip if not a school day
        if (!settings.school_days.includes(dayOfWeek)) {
          continue;
        }

        const weekNumber = getWeekNumber(day);
        let dayMarked = 0;
        let daySkipped = 0;
        let dayErrors = 0;

        // Process each student for this day
        for (const student of students) {
          try {
            // Check if student already has attendance record for this day
            const existingRecord = await pool.query(`
              SELECT * FROM academic_student_attendance
              WHERE student_id = $1 
                AND class_name = $2 
                AND ethiopian_year = $3 
                AND ethiopian_month = $4 
                AND ethiopian_day = $5
            `, [student.student_id, student.class_name, currentDate.year, month, day]);

            if (existingRecord.rows.length > 0) {
              // Student already has a record
              daySkipped++;
              continue;
            }

            // Get the appropriate absent marking time based on shift
            const absentMarkingTime = student.shift_number === 2 
              ? settings.shift2_absent_marking 
              : settings.shift1_absent_marking;

            // Mark student as ABSENT
            await pool.query(`
              INSERT INTO academic_student_attendance (
                student_id, student_name, class_name, smachine_id,
                ethiopian_year, ethiopian_month, ethiopian_day,
                day_of_week, week_number, check_in_time, status, notes, shift_number
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            `, [
              student.student_id,
              student.student_name,
              student.class_name,
              student.smachine_id,
              currentDate.year,
              month,
              day,
              dayOfWeek,
              weekNumber,
              absentMarkingTime,
              'ABSENT',
              'Auto-marked absent by system',
              student.shift_number
            ]);

            dayMarked++;

          } catch (error) {
            dayErrors++;
            console.error(`❌ Error marking ${student.student_name} for ${month}/${day}:`, error.message);
          }
        }

        if (dayMarked > 0 || dayErrors > 0) {
          console.log(`📅 ${currentDate.year}/${month}/${day} (${dayOfWeek}): Marked ${dayMarked}, Skipped ${daySkipped}, Errors ${dayErrors}`);
          daysProcessed.push({ month, day, dayOfWeek, marked: dayMarked });
        }

        totalMarked += dayMarked;
        totalSkipped += daySkipped;
        totalErrors += dayErrors;
      }
    }

    console.log('\n========================================');
    console.log('📊 Summary:');
    console.log(`   Days Processed: ${daysProcessed.length}`);
    console.log(`   Total Students: ${students.length}`);
    console.log(`   Total Marked Absent: ${totalMarked}`);
    console.log(`   Total Already Marked: ${totalSkipped}`);
    console.log(`   Total Errors: ${totalErrors}`);
    console.log('========================================\n');

    return {
      success: true,
      message: 'Auto-marking complete',
      stats: {
        daysProcessed: daysProcessed.length,
        totalStudents: students.length,
        marked: totalMarked,
        skipped: totalSkipped,
        errors: totalErrors
      }
    };

  } catch (error) {
    console.error('❌ Auto-marker error:', error);
    return { success: false, message: error.message };
  }
}

// Export for use in scheduled jobs or manual triggers
module.exports = {
  markAbsentStudents
};

// If run directly (node studentAttendanceAutoMarker.js)
if (require.main === module) {
  markAbsentStudents()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}
