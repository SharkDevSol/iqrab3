const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkAllAttendance() {
  try {
    console.log('\n📊 ALL ATTENDANCE RECORDS:\n');
    
    const result = await pool.query(`
      SELECT staff_id, staff_name, ethiopian_day, ethiopian_month, ethiopian_year, 
             status, check_in, check_out, created_at
      FROM hr_ethiopian_attendance
      ORDER BY created_at DESC
      LIMIT 20
    `);
    
    console.log(`Found ${result.rows.length} records:\n`);
    
    result.rows.forEach(r => {
      console.log(`Staff: ${r.staff_name} (ID: ${r.staff_id})`);
      console.log(`  Date: ${r.ethiopian_month}/${r.ethiopian_day}/${r.ethiopian_year}`);
      console.log(`  Status: ${r.status}`);
      console.log(`  Check-in: ${r.check_in || 'null'}, Check-out: ${r.check_out || 'null'}`);
      console.log(`  Created: ${r.created_at}`);
      console.log('');
    });
    
    console.log('\n📋 UNIQUE STAFF IDS:\n');
    
    const uniqueStaff = await pool.query(`
      SELECT DISTINCT staff_id, staff_name
      FROM hr_ethiopian_attendance
      WHERE staff_id IS NOT NULL
      GROUP BY staff_id, staff_name
    `);
    
    console.log(`Found ${uniqueStaff.rows.length} unique staff:\n`);
    uniqueStaff.rows.forEach(s => {
      console.log(`  - ${s.staff_name} (ID: ${s.staff_id})`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAllAttendance();
