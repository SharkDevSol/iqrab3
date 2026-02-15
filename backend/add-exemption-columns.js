const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

async function addExemptionColumns() {
  const client = await pool.connect();
  
  try {
    console.log('\n🔧 Adding exemption type and reason columns to class tables...\n');

    const classes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (const className of classes) {
      try {
        // Check if exemption_type column exists
        const checkType = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name = 'exemption_type'
        `, [className]);

        if (checkType.rows.length === 0) {
          await client.query(`
            ALTER TABLE classes_schema."${className}"
            ADD COLUMN exemption_type VARCHAR(50) DEFAULT NULL
          `);
          console.log(`✓ Class ${className}: Added exemption_type column`);
        } else {
          console.log(`✓ Class ${className}: exemption_type column already exists`);
        }

        // Check if exemption_reason column exists
        const checkReason = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name = 'exemption_reason'
        `, [className]);

        if (checkReason.rows.length === 0) {
          await client.query(`
            ALTER TABLE classes_schema."${className}"
            ADD COLUMN exemption_reason TEXT DEFAULT NULL
          `);
          console.log(`✓ Class ${className}: Added exemption_reason column`);
        } else {
          console.log(`✓ Class ${className}: exemption_reason column already exists`);
        }

      } catch (error) {
        if (error.code === '42P01') {
          console.log(`⚠ Class ${className}: Table does not exist, skipping...`);
        } else {
          console.error(`✗ Class ${className}: Error - ${error.message}`);
        }
      }
    }

    console.log('\n✅ Migration complete!\n');
    console.log('Exemption types available:');
    console.log('  - Scholarship: Full or partial scholarship');
    console.log('  - Orphan: Orphan student exemption');
    console.log('  - Staff Child: Child of school staff');
    console.log('  - Financial Hardship: Family financial difficulties');
    console.log('  - Other: Other reasons (specify in reason field)\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addExemptionColumns();
