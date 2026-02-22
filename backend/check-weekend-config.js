const pool = require('./config/db');

async function checkWeekendConfig() {
  try {
    console.log('🔍 Checking weekend configuration...\n');
    
    // Check current weekend days setting
    const result = await pool.query(`
      SELECT weekend_days, absent_threshold_time, max_checkout_hours
      FROM hr_attendance_time_settings
      LIMIT 1
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ No settings found');
      return;
    }
    
    const settings = result.rows[0];
    console.log('📋 Current Settings:');
    console.log(`   Weekend Days: ${settings.weekend_days || '[]'} (${settings.weekend_days?.length || 0} days)`);
    
    if (settings.weekend_days && settings.weekend_days.length > 0) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const weekendNames = settings.weekend_days.map(d => dayNames[d]).join(', ');
      console.log(`   Weekend Day Names: ${weekendNames}`);
    } else {
      console.log('   ⚠️  No weekend days configured!');
    }
    
    console.log(`   Absent Threshold: ${settings.absent_threshold_time}`);
    console.log(`   Max Checkout Hours: ${settings.max_checkout_hours}`);
    
    // Check if there are absent records on weekend days
    console.log('\n🔍 Checking for absent records on weekends...');
    
    const ethiopianDate = gregorianToEthiopian(new Date());
    console.log(`   Current Ethiopian Date: ${ethiopianDate.month}/${ethiopianDate.day}/${ethiopianDate.year}`);
    
    // Get all absent records for current month
    const absentRecords = await pool.query(`
      SELECT 
        ethiopian_day,
        COUNT(*) as absent_count
      FROM hr_ethiopian_attendance
      WHERE ethiopian_year = $1
        AND ethiopian_month = $2
        AND status = 'ABSENT'
      GROUP BY ethiopian_day
      ORDER BY ethiopian_day
    `, [ethiopianDate.year, ethiopianDate.month]);
    
    console.log(`\n📊 Absent records by day (Month ${ethiopianDate.month}/${ethiopianDate.year}):`);
    for (const record of absentRecords.rows) {
      // Convert Ethiopian date back to Gregorian to check day of week
      const gregDate = ethiopianToGregorian(ethiopianDate.year, ethiopianDate.month, record.ethiopian_day);
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][gregDate.getDay()];
      const isWeekend = settings.weekend_days?.includes(gregDate.getDay()) ? '🏖️ WEEKEND' : '';
      console.log(`   Day ${record.ethiopian_day}: ${record.absent_count} absent ${isWeekend} (${dayName})`);
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

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

checkWeekendConfig();
