/**
 * Quick Fix Script - Creates hr_attendance_deduction_settings table
 * 
 * This script will:
 * 1. Try to connect to the database using environment variables
 * 2. Create the missing table
 * 3. Insert default deduction settings
 * 
 * Usage: node scripts/quick-fix-table.js
 */

const { Pool } = require('pg');
require('dotenv').config();

// Try multiple connection methods
const connectionConfigs = [
  // Method 1: Using individual env vars
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'school_management10',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  },
  // Method 2: Using DATABASE_URL
  process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : null,
  // Method 3: Default local connection
  {
    host: 'localhost',
    port: 5432,
    database: 'school_management10',
    user: 'postgres',
    password: 'postgres123'
  }
].filter(Boolean);

const createTableSQL = `
CREATE TABLE IF NOT EXISTS hr_attendance_deduction_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_type VARCHAR(255) NOT NULL,
  deduction_type VARCHAR(50) NOT NULL,
  deduction_amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_type, deduction_type)
);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_staff_type 
  ON hr_attendance_deduction_settings(staff_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_type 
  ON hr_attendance_deduction_settings(deduction_type);

CREATE INDEX IF NOT EXISTS idx_hr_attendance_deduction_active 
  ON hr_attendance_deduction_settings(is_active);

INSERT INTO hr_attendance_deduction_settings 
  (staff_type, deduction_type, deduction_amount, description, is_active)
VALUES 
  ('Teacher', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Teacher', 'Absent', 200.00, 'Deduction for absence', true),
  ('Teacher', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Administrative', 'Late', 50.00, 'Deduction for late arrival', true),
  ('Administrative', 'Absent', 200.00, 'Deduction for absence', true),
  ('Administrative', 'Half-Day', 100.00, 'Deduction for half-day absence', true),
  ('Support Staff', 'Late', 30.00, 'Deduction for late arrival', true),
  ('Support Staff', 'Absent', 150.00, 'Deduction for absence', true),
  ('Support Staff', 'Half-Day', 75.00, 'Deduction for half-day absence', true),
  ('Management', 'Late', 75.00, 'Deduction for late arrival', true),
  ('Management', 'Absent', 250.00, 'Deduction for absence', true),
  ('Management', 'Half-Day', 125.00, 'Deduction for half-day absence', true)
ON CONFLICT (staff_type, deduction_type) DO NOTHING;
`;

async function tryConnection(config, index) {
  console.log(`\n🔄 Attempting connection method ${index + 1}...`);
  console.log(`   Database: ${config.database || 'from connection string'}`);
  console.log(`   Host: ${config.host || 'from connection string'}`);
  
  const pool = new Pool(config);
  
  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully!');
    
    console.log('\n🔄 Creating table and inserting data...');
    await client.query(createTableSQL);
    console.log('✅ Table created successfully!');
    
    const result = await client.query('SELECT COUNT(*) as count FROM hr_attendance_deduction_settings');
    console.log(`✅ Total deduction settings: ${result.rows[0].count}`);
    
    const settings = await client.query(`
      SELECT staff_type, deduction_type, deduction_amount, is_active
      FROM hr_attendance_deduction_settings
      ORDER BY staff_type, deduction_type
    `);
    
    console.log('\n📋 Current Deduction Settings:');
    console.table(settings.rows);
    
    client.release();
    await pool.end();
    
    return true;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}`);
    await pool.end();
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Quick Fix Script...');
  console.log('📝 This will create the hr_attendance_deduction_settings table\n');
  
  for (let i = 0; i < connectionConfigs.length; i++) {
    const success = await tryConnection(connectionConfigs[i], i);
    if (success) {
      console.log('\n✅ ✅ ✅ SUCCESS! Table created and populated! ✅ ✅ ✅');
      console.log('\n📌 Next steps:');
      console.log('   1. Restart your backend server');
      console.log('   2. Refresh your browser');
      console.log('   3. The error should be resolved!\n');
      process.exit(0);
    }
  }
  
  console.log('\n❌ All connection attempts failed.');
  console.log('\n📌 Manual fix required:');
  console.log('   1. Open your PostgreSQL client (pgAdmin, DBeaver, etc.)');
  console.log('   2. Connect to database: school_management10');
  console.log('   3. Run the SQL file: backend/database/FIX_MISSING_TABLE.sql');
  console.log('   4. Or follow instructions in: backend/FIX_DATABASE_ERROR.md\n');
  process.exit(1);
}

main();
