const pool = require('./config/db');

async function markAbsentForDays() {
  try {
    console.log('🔍 Marking absent for Ethiopian days 4/6 and 5/6...\n');
    
    const ethYear = 2018;
    const ethMonth = 6;
    const daysToMark = [4, 5]; // Wed and Thu according to UI
    
    // Get all staff
    let allStaff = [];
    const staffSchemas = [
      { schema: 'staff_teachers', type: 'Teachers' },
      { schema: 'staff_administrative_staff', type: 'Administrative Staff' },
      { schema: 'staff_supportive_staff', type: 'Supportive Staff' }
    ];

    for (const { schema, type } of staffSchemas) {
      try {
        const tablesResult = await pool.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = $1 
            AND table_type = 'BASE TABLE'
        `, [schema]);

        for (const tableRow of tablesResult.rows) {
          const tableName = tableRow.table_name;
          
          try {
            const staffResult = await pool.query(`
              SELECT machine_id, name, global_staff_id
              FROM "${schema}"."${tableName}"
            `);

            staffResult.rows.forEach(staff => {
              const staffId = staff.machine_id || staff.global_staff_id || staff.name;
              const name = staff.name;
              
              if (staffId && name) {
                allStaff.push({ staffId, name });
              }
            });
          } catch (err) {
            // Skip tables that don't exist or have errors
          }
        }
      } catch (err) {
        // Skip schemas that don't exist
      }
    }
    
    console.log(`👥 Found ${allStaff.length} staff members\n`);
    
    // Check what Gregorian dates these Ethiopian dates correspond to
    function gregorianToEthiopian(date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      let ethYear = year - 8;
      let ethMonth, ethDay;
      
      if (month >= 9) {
        if (month === 9 && day < 11) {
          ethYear = year - 9;
          ethMonth = 13;
          ethDay = day + 25;
        } else {
          ethMonth = month - 8;
          ethDay = day - 10;
          if (ethDay <= 0) {
            ethDay += 30;
            ethMonth -= 1;
          }
        }
      } else {
        ethMonth = month + 4;
        ethDay = day - 7;
        
        if (ethDay <= 0) {
          ethDay += 30;
          ethMonth -= 1;
        }
      }
      
      return { year: ethYear, month: ethMonth, day: ethDay };
    }
    
    // Find which Gregorian dates correspond to Ethiopian 4/6 and 5/6
    console.log('📅 Finding Gregorian dates for Ethiopian 4/6 and 5/6...\n');
    
    for (let i = -40; i <= 0; i++) {
      const checkDate = new Date();
      checkDate.setDate(checkDate.getDate() + i);
      const ethDate = gregorianToEthiopian(checkDate);
      
      if (ethDate.year === ethYear && ethDate.month === ethMonth && daysToMark.includes(ethDate.day)) {
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][checkDate.getDay()];
        console.log(`Ethiopian ${ethDate.day}/${ethDate.month}/${ethDate.year} = ${checkDate.toDateString()} (${dayName})`);
      }
    }
    
    console.log('\n🔍 Checking existing attendance records...\n');
    
    for (const ethDay of daysToMark) {
      const existingRecords = await pool.query(`
        SELECT COUNT(*) as count
        FROM hr_ethiopian_attendance
        WHERE ethiopian_year = $1
          AND ethiopian_month = $2
          AND ethiopian_day = $3
      `, [ethYear, ethMonth, ethDay]);
      
      console.log(`Day ${ethDay}/6/2018: ${existingRecords.rows[0].count} existing records`);
    }
    
    console.log('\n📝 Marking absent for days 4/6 and 5/6...\n');
    
    let markedCount = 0;
    
    for (const ethDay of daysToMark) {
      for (const staff of allStaff) {
        // Check if record already exists
        const existingRecord = await pool.query(`
          SELECT * FROM hr_ethiopian_attendance
          WHERE (staff_id = $1 OR LOWER(staff_name) = LOWER($2))
            AND ethiopian_year = $3
            AND ethiopian_month = $4
            AND ethiopian_day = $5
        `, [staff.staffId, staff.name, ethYear, ethMonth, ethDay]);
        
        if (existingRecord.rows.length === 0) {
          await pool.query(`
            INSERT INTO hr_ethiopian_attendance
            (staff_id, staff_name, ethiopian_year, ethiopian_month, ethiopian_day, status, check_in, shift_type)
            VALUES ($1, $2, $3, $4, $5, 'ABSENT', '00:00', 'shift1')
          `, [staff.staffId, staff.name, ethYear, ethMonth, ethDay]);
          
          markedCount++;
        }
      }
    }
    
    console.log(`✅ Marked ${markedCount} staff as ABSENT for days 4/6 and 5/6`);
    
    // Verify
    console.log('\n📊 Verification:\n');
    
    for (const ethDay of daysToMark) {
      const records = await pool.query(`
        SELECT COUNT(*) as count
        FROM hr_ethiopian_attendance
        WHERE ethiopian_year = $1
          AND ethiopian_month = $2
          AND ethiopian_day = $3
          AND status = 'ABSENT'
      `, [ethYear, ethMonth, ethDay]);
      
      console.log(`Day ${ethDay}/6/2018: ${records.rows[0].count} absent records`);
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

markAbsentForDays();
