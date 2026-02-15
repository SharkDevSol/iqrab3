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
  console.log('  Adding Shift Assignment Columns');
  console.log('========================================\n');
  
  console.log(`Connection: ${process.env.DATABASE_URL ? 'Using DATABASE_URL' : 'Using individual credentials'}\n`);

  try {
    const sqlPath = path.join(__dirname, 'database', 'add_shift_columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running migration...\n');
    await pool.query(sql);
    
    console.log('========================================');
    console.log('  Migration completed successfully!');
    console.log('========================================\n');
    console.log('What was added:');
    console.log('- shift_assignment column to all staff tables');
    console.log('- shift_time_settings table for Shift 1 and Shift 2');
    console.log('- shift_type column to attendance tables\n');
    console.log('Next steps:');
    console.log('1. Restart your backend server');
    console.log('2. Access Shift Time Settings page to configure times');
    console.log('3. Assign staff to shifts in Staff Shift Assignment page\n');
    
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
