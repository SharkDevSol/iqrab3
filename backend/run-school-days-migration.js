const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/school_management2'
});

async function runMigration() {
  try {
    console.log('Adding school_days and auto_absent_enabled columns...\n');
    
    const sqlPath = path.join(__dirname, 'database/add_school_days_columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('\nColumns added:');
    console.log('  - school_days (TEXT[])');
    console.log('  - auto_absent_enabled (BOOLEAN)');
    
    // Verify the columns exist
    const result = await pool.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'academic_student_attendance_settings'
        AND column_name IN ('school_days', 'auto_absent_enabled')
    `);
    
    console.log('\nVerification:');
    result.rows.forEach(row => {
      console.log(`  ✓ ${row.column_name} (${row.data_type})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

runMigration();
