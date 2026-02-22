const pool = require('./config/db');

async function checkAbsentRecords() {
  try {
    console.log('🔍 Checking absent records for days 4/6 and 5/6...\n');
    
    const ethYear = 2018;
    const ethMonth = 6;
    
    // Check records for days 4 and 5
    for (const ethDay of [4, 5]) {
      console.log(`\n📅 Day ${ethDay}/6/2018:\n`);
      
      const records = await pool.query(`
        SELECT 
          staff_id,
          staff_name,
          status,
          check_in,
          shift_type
        FROM hr_ethiopian_attendance
        WHERE ethiopian_year = $1
          AND ethiopian_month = $2
          AND ethiopian_day = $3
        ORDER BY staff_name
      `, [ethYear, ethMonth, ethDay]);
      
      console.log(`Total records: ${records.rows.length}\n`);
      
      if (records.rows.length > 0) {
        console.log('Staff with records:');
        records.rows.forEach((record, index) => {
          console.log(`${index + 1}. ${record.staff_name} (ID: ${record.staff_id}) - ${record.status} - Shift: ${record.shift_type || 'N/A'}`);
        });
      } else {
        console.log('❌ No records found!');
      }
    }
    
    // Check which staff are missing records
    console.log('\n\n🔍 Checking for staff without records...\n');
    
    // Get all staff
    const allStaff = await pool.query(`
      SELECT DISTINCT staff_name
      FROM hr_ethiopian_attendance
      WHERE ethiopian_year = 2018
        AND ethiopian_month = 6
      ORDER BY staff_name
    `);
    
    console.log(`Total unique staff in month 6: ${allStaff.rows.length}\n`);
    
    for (const ethDay of [4, 5]) {
      const staffWithRecords = await pool.query(`
        SELECT DISTINCT staff_name
        FROM hr_ethiopian_attendance
        WHERE ethiopian_year = $1
          AND ethiopian_month = $2
          AND ethiopian_day = $3
      `, [ethYear, ethMonth, ethDay]);
      
      const staffNamesWithRecords = new Set(staffWithRecords.rows.map(r => r.staff_name.toLowerCase()));
      
      console.log(`\nDay ${ethDay}/6/2018 - Staff WITHOUT records:`);
      
      let missingCount = 0;
      allStaff.rows.forEach(staff => {
        if (!staffNamesWithRecords.has(staff.staff_name.toLowerCase())) {
          console.log(`  ❌ ${staff.staff_name}`);
          missingCount++;
        }
      });
      
      if (missingCount === 0) {
        console.log('  ✅ All staff have records!');
      } else {
        console.log(`\n  Total missing: ${missingCount} staff`);
      }
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkAbsentRecords();
