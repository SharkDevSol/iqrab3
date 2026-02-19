const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/school_management2'
});

async function runMigration() {
  try {
    console.log('Adding Ethiopian calendar columns to attendance table...\n');
    
    const sqlPath = path.join(__dirname, 'database/add_ethiopian_calendar_columns.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully!');
    console.log('\nColumns added:');
    console.log('  - ethiopian_year (INTEGER)');
    console.log('  - ethiopian_month (INTEGER)');
    console.log('  - ethiopian_day (INTEGER)');
    console.log('  - week_number (INTEGER)');
    console.log('  - student_name (VARCHAR)');
    
    // Verify the columns exist
    const result = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'academic_student_attendance'
        AND column_name IN ('ethiopian_year', 'ethiopian_month', 'ethiopian_day', 'week_number', 'student_name')
      ORDER BY column_name
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
