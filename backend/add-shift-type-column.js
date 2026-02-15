const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Parse DATABASE_URL or use individual variables
let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL
  };
} else {
  poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(poolConfig);

async function runMigration() {
  console.log('========================================');
  console.log('  Adding shift_type Column');
  console.log('========================================\n');
  
  console.log(`Connection: ${process.env.DATABASE_URL ? 'Using DATABASE_URL' : 'Using individual credentials'}\n`);

  try {
    const sqlPath = path.join(__dirname, 'database', 'add_shift_type_column.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running migration...\n');
    await pool.query(sql);
    
    console.log('========================================');
    console.log('  Migration completed successfully!');
    console.log('========================================\n');
    console.log('What was added:');
    console.log('- shift_type column to hr_ethiopian_attendance table');
    console.log('- Updated unique constraint to include shift_type');
    console.log('- This allows dual-shift staff to have 2 attendance records per day\n');
    
  } catch (error) {
    console.error('========================================');
    console.error('  Migration failed!');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('\nDetails:', error);
  } finally {
    await pool.end();
  }
}

runMigration();
