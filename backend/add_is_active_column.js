const { Pool } = require('pg');
require('dotenv').config({ path: './.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addIsActiveColumn() {
  const client = await pool.connect();
  
  try {
    console.log('========================================');
    console.log('Adding is_active Column to All Staff Tables');
    console.log('========================================\n');

    // Get all staff schemas
    const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'staff_%'
      ORDER BY schema_name
    `);

    console.log(`Found ${schemasResult.rows.length} staff schemas\n`);

    let totalTables = 0;
    
    // For each staff schema, get all tables and add is_active column
    for (const schemaRow of schemasResult.rows) {
      const schemaName = schemaRow.schema_name;
      console.log(`Processing schema: ${schemaName}`);
      
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 
        AND table_name != 'staff_counter'
        ORDER BY table_name
      `, [schemaName]);

      for (const tableRow of tablesResult.rows) {
        const tableName = tableRow.table_name;
        try {
          await client.query(`
            ALTER TABLE "${schemaName}"."${tableName}" 
            ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE
          `);
          console.log(`  ✓ Added is_active to: ${schemaName}.${tableName}`);
          totalTables++;
        } catch (error) {
          console.error(`  ✗ Error adding column to ${schemaName}.${tableName}:`, error.message);
        }
      }
    }
    
    console.log(`\nTotal tables updated: ${totalTables}`);

    // Verify the column was added
    console.log('\n========================================');
    console.log('Verification:');
    console.log('========================================\n');
    
    const verifyResult = await client.query(`
      SELECT table_schema, table_name, column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_schema LIKE 'staff_%'
        AND column_name = 'is_active'
      ORDER BY table_schema, table_name
    `);

    console.log(`is_active column exists in ${verifyResult.rows.length} tables:\n`);
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.table_schema}.${row.table_name}: ${row.data_type} (default: ${row.column_default})`);
    });

    console.log('\n========================================');
    console.log('SUCCESS: is_active column added!');
    console.log('========================================');

  } catch (error) {
    console.error('\n========================================');
    console.error('ERROR:', error.message);
    console.error('========================================');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addIsActiveColumn().catch(console.error);
