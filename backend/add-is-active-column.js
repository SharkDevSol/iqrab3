const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

async function addIsActiveColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Finding all class tables in classes_schema...');
    
    // Get all tables in classes_schema
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows;
    console.log(`📊 Found ${tables.length} class tables`);
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const table of tables) {
      const tableName = table.table_name;
      
      try {
        // Check if column already exists
        const columnCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name = 'is_active'
        `, [tableName]);
        
        if (columnCheck.rows.length > 0) {
          console.log(`⏭️  Skipping ${tableName} - column already exists`);
          skipCount++;
          continue;
        }
        
        // Add the column
        await client.query(`
          ALTER TABLE classes_schema."${tableName}" 
          ADD COLUMN is_active BOOLEAN DEFAULT TRUE
        `);
        
        console.log(`✅ Added is_active column to ${tableName}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error adding column to ${tableName}:`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Successfully added: ${successCount}`);
    console.log(`   ⏭️  Already existed: ${skipCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📋 Total tables: ${tables.length}`);
    
    // Now add to staff tables
    console.log('\n🔍 Finding all staff tables...');
    
    const staffSchemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name LIKE 'staff_%'
    `);
    
    let staffSuccessCount = 0;
    let staffSkipCount = 0;
    let staffErrorCount = 0;
    let staffTotalTables = 0;
    
    for (const schema of staffSchemasResult.rows) {
      const schemaName = schema.schema_name;
      
      // Get all tables in this staff schema
      const staffTablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = $1 
          AND table_name != 'staff_counter'
        ORDER BY table_name
      `, [schemaName]);
      
      for (const table of staffTablesResult.rows) {
        const tableName = table.table_name;
        staffTotalTables++;
        
        try {
          // Check if column already exists
          const columnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = $1 
              AND table_name = $2 
              AND column_name = 'is_active'
          `, [schemaName, tableName]);
          
          if (columnCheck.rows.length > 0) {
            console.log(`⏭️  Skipping ${schemaName}.${tableName} - column already exists`);
            staffSkipCount++;
            continue;
          }
          
          // Add the column
          await client.query(`
            ALTER TABLE "${schemaName}"."${tableName}" 
            ADD COLUMN is_active BOOLEAN DEFAULT TRUE
          `);
          
          console.log(`✅ Added is_active column to ${schemaName}.${tableName}`);
          staffSuccessCount++;
          
        } catch (error) {
          console.error(`❌ Error adding column to ${schemaName}.${tableName}:`, error.message);
          staffErrorCount++;
        }
      }
    }
    
    console.log('\n📊 Staff Tables Summary:');
    console.log(`   ✅ Successfully added: ${staffSuccessCount}`);
    console.log(`   ⏭️  Already existed: ${staffSkipCount}`);
    console.log(`   ❌ Errors: ${staffErrorCount}`);
    console.log(`   📋 Total staff tables: ${staffTotalTables}`);
    
    console.log('\n✅ Migration complete!');
    console.log('🔄 Please restart your backend server now.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the migration
addIsActiveColumn();
