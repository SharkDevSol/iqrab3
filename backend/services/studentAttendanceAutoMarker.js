const pool = require('../config/db');
const { getCurrentEthiopianDate, getEthiopianDayOfWeek } = require('../utils/ethiopianCalendar');

// Calculate week number from day
const getWeekNumber = (day) => {
  return Math.ceil(day / 7);
};

// Convert Ethiopian date to Gregorian date
const ethiopianToGregorian = (ethYear, ethMonth, ethDay) => {
  // Ethiopian New Year (Meskerem 1) = September 11 (or Sept 12 in leap years)
  const gregYear = ethYear + 7;
  
  // Check if it's a leap year in Gregorian calendar
  const isGregorianLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  
  // Ethiopian New Year offset (Sept 11 or Sept 12)
  const ethNewYearDay = isGregorianLeapYear(gregYear) ? 12 : 11;
  
  // Calculate total days from Ethiopian New Year
  let totalDays = 0;
  
  // Add days from complete months
  for (let m = 1; m < ethMonth; m++) {
    if (m <= 12) {
      totalDays += 30; // First 12 months have 30 days each
    } else {
      // Pagume (13th month) has 5 or 6 days
      totalDays += isGregorianLeapYear(gregYear + 1) ? 6 : 5;
    }
  }
  
  // Add days in current month
  totalDays += ethDay - 1; // -1 because Meskerem 1 = day 0
  
  // Create date starting from Ethiopian New Year
  const ethNewYear = new Date(gregYear, 8, ethNewYearDay); // Month 8 = September
  
  // Add the total days
  const gregorianDate = new Date(ethNewYear);
  gregorianDate.setDate(ethNewYear.getDate() + totalDays);
  
  return gregorianDate;
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
      
      // Check if is_active column exists
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'classes_schema' 
          AND table_name = $1 
          AND column_name = 'is_active'
      `, [tableName]);
      
      const hasIsActive = columnCheck.rows.length > 0;
      const whereClause = hasIsActive ? 'WHERE (is_active = TRUE OR is_active IS NULL)' : '';
      
      const studentsResult = await pool.query(`
        SELECT 
          CAST(school_id AS VARCHAR) as student_id,
          student_name,
          smachine_id,
          '${tableName}' as class_name,
          ${shiftNumber} as shift_number
        FROM classes_schema."${tableName}"
        ${whereClause}
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
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    console.log(`📅 Current Date: ${currentDate.year}/${currentDate.month}/${currentDate.day}`);
    console.log(`🕐 Current Time: ${currentTime}`);

    // Get all students
    const students = await getAllStudents();
    console.log(`👥 Total students: ${students.length}\n`);

    let totalMarked = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const daysProcessed = [];

    // Process all days from start of year until today
    for (let month = 1; month <= currentDate.month; month++) {
      const daysInMonth = month === 13 ? 5 : 30; // Pagume has 5 days, others have 30
      const maxDay = month === currentDate.month ? currentDate.day : daysInMonth;

      for (let day = 1; day <= maxDay; day++) {
        const dayOfWeek = getEthiopianDayOfWeek(currentDate.year, month, day);
        
        // Skip if not a school day
        if (!settings.school_days.includes(dayOfWeek)) {
          continue;
        }

        // Check if this is today
        const isToday = (month === currentDate.month && day === currentDate.day);

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

            // If this is TODAY, only mark absent if current time is past the absent marking time
            if (isToday) {
              const absentTimeOnly = absentMarkingTime.substring(0, 5); // HH:MM
              
              if (currentTime < absentTimeOnly) {
                // Too early to mark this student absent
                daySkipped++;
                continue;
              }
            }

            // Convert Ethiopian date to Gregorian for the date column
            const gregorianDate = ethiopianToGregorian(currentDate.year, month, day);

            // Mark student as ABSENT
            await pool.query(`
              INSERT INTO academic_student_attendance (
                student_id, student_name, class_name, smachine_id,
                date, ethiopian_year, ethiopian_month, ethiopian_day,
                day_of_week, week_number, check_in_time, status, notes, shift_number
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            `, [
              student.student_id,
              student.student_name,
              student.class_name,
              student.smachine_id,
              gregorianDate,
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

// Auto-marker class with scheduling
class StudentAttendanceAutoMarker {
  constructor() {
    this.isRunning = false;
    this.interval = null;
  }

  // Start the auto-marker (runs every hour)
  start() {
    if (this.isRunning) {
      console.log('⚠️ Student attendance auto-marker is already running');
      return;
    }

    this.isRunning = true;
    console.log('🤖 Student attendance auto-marker started');
    console.log('   ⏰ Will run every hour');
    console.log('   📅 Marks students absent after 9:00 AM (Shift 1) or 2:00 PM (Shift 2)');

    // Run immediately on startup (with error handling)
    this.runSafely();

    // Then run every hour (3600000 ms)
    this.interval = setInterval(() => {
      this.runSafely();
    }, 3600000); // 1 hour
  }

  // Run with error handling and recovery
  async runSafely() {
    try {
      console.log('\n⏰ [Auto-Marker] Running scheduled check...');
      await markAbsentStudents();
    } catch (error) {
      console.error('❌ [Auto-Marker] Error during execution:', error.message);
      console.error('   Will retry in next cycle (1 hour)');
      // Don't stop the interval - just log the error and continue
    }
  }

  // Stop the auto-marker
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.isRunning = false;
      console.log('🛑 Student attendance auto-marker stopped');
    }
  }

  // Manual trigger
  async markNow() {
    return await markAbsentStudents();
  }
}

// Export singleton instance
const autoMarkerInstance = new StudentAttendanceAutoMarker();

module.exports = {
  markAbsentStudents,
  autoMarker: autoMarkerInstance
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
