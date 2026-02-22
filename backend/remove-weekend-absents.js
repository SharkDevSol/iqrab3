const pool = require('./config/db');

async function removeWeekendAbsents() {
  try {
    console.log('🧹 Removing absent records from weekend days...\n');
    
    // Get weekend days configuration
    const settingsResult = await pool.query(`
      SELECT weekend_days FROM hr_attendance_time_settings LIMIT 1
    `);
    
    if (settingsResult.rows.length === 0 || !settingsResult.rows[0].weekend_days) {
      console.log('❌ No weekend days configured. Please configure weekend days first.');
      await pool.end();
      return;
    }
    
    const weekendDays = settingsResult.rows[0].weekend_days;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekendNames = weekendDays.map(d => dayNames[d]).join(', ');
    
    console.log(`📋 Weekend Days Configured: ${weekendNames} (${weekendDays.join(', ')})`);
    console.log('');
    
    // Get all absent records
    const absentRecords = await pool.query(`
      SELECT 
        id,
        staff_id,
        staff_name,
        ethiopian_year,
        ethiopian_month,
        ethiopian_day,
        status
      FROM hr_ethiopian_attendance
      WHERE status = 'ABSENT'
      ORDER BY ethiopian_year, ethiopian_month, ethiopian_day
    `);
    
    console.log(`📊 Found ${absentRecords.rows.length} absent records`);
    console.log('🔍 Checking which ones are on weekends...\n');
    
    let deletedCount = 0;
    const recordsToDelete = [];
    
    for (const record of absentRecords.rows) {
      // Convert Ethiopian date to Gregorian to check day of week
      const gregDate = ethiopianToGregorian(
        record.ethiopian_year,
        record.ethiopian_month,
        record.ethiopian_day
      );
      
      const dayOfWeek = gregDate.getDay();
      const dayName = dayNames[dayOfWeek];
      
      if (weekendDays.includes(dayOfWeek)) {
        recordsToDelete.push(record.id);
        console.log(`   🏖️  ${record.staff_name} - ${record.ethiopian_month}/${record.ethiopian_day}/${record.ethiopian_year} (${dayName})`);
      }
    }
    
    if (recordsToDelete.length === 0) {
      console.log('✅ No absent records found on weekend days!');
      await pool.end();
      return;
    }
    
    console.log(`\n📝 Found ${recordsToDelete.length} absent records on weekends`);
    console.log('🗑️  Deleting...\n');
    
    // Delete records
    const deleteResult = await pool.query(`
      DELETE FROM hr_ethiopian_attendance
      WHERE id = ANY($1)
    `, [recordsToDelete]);
    
    console.log(`✅ Deleted ${deleteResult.rowCount} absent records from weekend days`);
    
    // Show summary
    console.log('\n📊 Summary:');
    console.log(`   Total absent records checked: ${absentRecords.rows.length}`);
    console.log(`   Weekend absent records deleted: ${deleteResult.rowCount}`);
    console.log(`   Remaining absent records: ${absentRecords.rows.length - deleteResult.rowCount}`);
    
    console.log('\n✅ Weekend absent records removed successfully!');
    console.log('💡 The auto-marker will now skip weekends when marking absent staff.');
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

function ethiopianToGregorian(ethYear, ethMonth, ethDay) {
  let year = ethYear + 8;
  let month, day;
  
  if (ethMonth <= 4) {
    month = ethMonth + 8;
    day = ethDay + 7;
    
    if (day > 30) {
      day -= 30;
      month += 1;
    }
  } else {
    month = ethMonth - 4;
    day = ethDay + 10;
    
    if (day > 30) {
      day -= 30;
      month += 1;
    }
  }
  
  return new Date(year, month - 1, day);
}

removeWeekendAbsents();
