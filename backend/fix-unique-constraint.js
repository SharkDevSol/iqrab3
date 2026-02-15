const { Pool } = require('pg');
require('dotenv').config();

let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = { connectionString: process.env.DATABASE_URL };
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

async function fixConstraint() {
  console.log('========================================');
  console.log('  Fixing Unique Constraint');
  console.log('========================================\n');

  try {
    // Get all unique constraints on the table
    const constraints = await pool.query(`
      SELECT conname 
      FROM pg_constraint 
      WHERE conrelid = 'hr_ethiopian_attendance'::regclass 
      AND contype = 'u'
    `);

    console.log('Found constraints:', constraints.rows);

    // Drop all old unique constraints
    for (const row of constraints.rows) {
      if (row.conname !== 'hr_ethiopian_attendance_unique_with_shift') {
        console.log(`Dropping constraint: ${row.conname}`);
        await pool.query(`ALTER TABLE hr_ethiopian_attendance DROP CONSTRAINT IF EXISTS "${row.conname}"`);
      }
    }

    // Add the new constraint if it doesn't exist
    const newConstraintExists = constraints.rows.some(r => r.conname === 'hr_ethiopian_attendance_unique_with_shift');
    
    if (!newConstraintExists) {
      console.log('Adding new unique constraint with shift_type...');
      await pool.query(`
        ALTER TABLE hr_ethiopian_attendance 
        ADD CONSTRAINT hr_ethiopian_attendance_unique_with_shift 
        UNIQUE (staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type)
      `);
      console.log('✅ New constraint added');
    } else {
      console.log('✅ New constraint already exists');
    }

    console.log('\n========================================');
    console.log('  Constraint fixed successfully!');
    console.log('========================================\n');
    
  } catch (error) {
    console.error('========================================');
    console.error('  Failed to fix constraint!');
    console.error('========================================');
    console.error('Error:', error.message);
    console.error('\nDetails:', error);
  } finally {
    await pool.end();
  }
}

fixConstraint();
