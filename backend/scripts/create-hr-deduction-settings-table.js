const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'school_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD
});

async function createTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Creating hr_attendance_deduction_settings table...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../database/create_hr_attendance_deduction_settings.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await client.query(sql);
    
    console.log('✅ Table created successfully!');
    
    // Verify the table exists
    const result = await client.query(`
      SELECT COUNT(*) as count 
      FROM hr_attendance_deduction_settings
    `);
    
    console.log(`📊 Total deduction settings: ${result.rows[0].count}`);
    
    // Show the settings
    const settings = await client.query(`
      SELECT staff_type, deduction_type, deduction_amount, is_active
      FROM hr_attendance_deduction_settings
      ORDER BY staff_type, deduction_type
    `);
    
    console.log('\n📋 Current Deduction Settings:');
    console.table(settings.rows);
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
createTable()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
