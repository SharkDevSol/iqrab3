const { Pool } = require('pg');
const pool = require('./config/db'); // Use the same config as server

async function checkLNCOStaff() {
  try {
    console.log('========================================');
    console.log('Finding L+NCO Staff Details');
    console.log('========================================\n');

    // 1. Get all L+NCO records
    console.log('1. All L+NCO records in Yekatit 2018:');
    const lncoRecords = await pool.query(`
      SELECT staff_id, staff_name, ethiopian_day, check_in, check_out, status 
      FROM hr_ethiopian_attendance 
      WHERE status = 'L+NCO' 
        AND ethiopian_month = 6 
        AND ethiopian_year = 2018 
      ORDER BY ethiopian_day
    `);
    
    if (lncoRecords.rows.length === 0) {
      console.log('❌ No L+NCO records found!');
    } else {
      console.table(lncoRecords.rows);
    }

    console.log('\n2. Checking if these staff are registered:');
    const registeredIds = ['6', '3', '100', '101', '2', '5', '105', '4'];
    console.log('Registered IDs:', registeredIds.join(', '));
    console.log('');

    lncoRecords.rows.forEach(record => {
      const isRegistered = registeredIds.includes(String(record.staff_id));
      console.log(`${record.staff_name} (ID: ${record.staff_id}) - ${isRegistered ? '✅ REGISTERED' : '❌ NOT REGISTERED'}`);
    });

    console.log('\n3. All attendance statuses for registered staff:');
    const allStatuses = await pool.query(`
      SELECT DISTINCT status, COUNT(*) as count
      FROM hr_ethiopian_attendance 
      WHERE ethiopian_month = 6 
        AND ethiopian_year = 2018
        AND staff_id = ANY($1)
      GROUP BY status
      ORDER BY count DESC
    `, [registeredIds]);
    
    console.table(allStatuses.rows);

    console.log('\n4. Checking if L+NCO is in the query:');
    const testQuery = await pool.query(`
      SELECT COUNT(*) as count
      FROM hr_ethiopian_attendance 
      WHERE ethiopian_month = 6 
        AND ethiopian_year = 2018
        AND status IN ('LATE', 'ABSENT', 'HALF_DAY', 'LATE_HALF_DAY', 'NO_CHECKOUT', 'L+NCO', 'L+H', 'H', 'NCO', 'LATE + HALF_DAY')
        AND staff_id = ANY($1)
    `, [registeredIds]);
    
    console.log(`Total issues (including L+NCO): ${testQuery.rows[0].count}`);

    console.log('\n========================================');
    console.log('Analysis Complete!');
    console.log('========================================');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkLNCOStaff();
