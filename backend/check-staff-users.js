const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function checkStaffUsers() {
  try {
    console.log('\n📊 STAFF_USERS TABLE COLUMNS:\n');
    
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'staff_users'
      ORDER BY ordinal_position
    `);
    
    console.log('Columns:');
    columns.rows.forEach(c => console.log(`  - ${c.column_name}`));
    
    console.log('\n📊 STAFF WITH MACHINE IDS:\n');
    
    const result = await pool.query(`
      SELECT * 
      FROM staff_users 
      WHERE machine_id IS NOT NULL
      LIMIT 5
    `);
    
    console.log(`Found ${result.rows.length} staff with machine IDs:\n`);
    
    result.rows.forEach(s => {
      console.log(`  Staff:`, s);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkStaffUsers();
