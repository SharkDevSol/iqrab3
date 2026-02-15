const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

async function addIsFreeColumn() {
  const client = await pool.connect();
  
  try {
    console.log('\n🔧 Adding is_free column to class tables...\n');

    // List of class tables
    const classes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    for (const className of classes) {
      try {
        // Check if column already exists
        const checkQuery = `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name = 'is_free'
        `;
        
        const checkResult = await client.query(checkQuery, [className]);

        if (checkResult.rows.length > 0) {
          console.log(`✓ Class ${className}: is_free column already exists`);
          continue;
        }

        // Add is_free column (BOOLEAN, default FALSE)
        const alterQuery = `
          ALTER TABLE classes_schema."${className}"
          ADD COLUMN is_free BOOLEAN DEFAULT FALSE
        `;
        
        await client.query(alterQuery);
        console.log(`✓ Class ${className}: Added is_free column`);

      } catch (error) {
        if (error.code === '42P01') {
          console.log(`⚠ Class ${className}: Table does not exist, skipping...`);
        } else {
          console.error(`✗ Class ${className}: Error - ${error.message}`);
        }
      }
    }

    console.log('\n✅ Migration complete!\n');
    console.log('Students can now be marked as "learning for free" (scholarship/exempted)');
    console.log('Default value: FALSE (all students are paying unless marked otherwise)\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addIsFreeColumn();
