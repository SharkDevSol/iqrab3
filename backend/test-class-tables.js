// Quick script to check class tables
const pool = require('./config/db');

async function checkClassTables() {
  try {
    console.log('🔍 Checking class tables in classes_schema...\n');
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);
    
    console.log(`Found ${result.rows.length} class tables:\n`);
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    // Check if KG1B exists (case-insensitive)
    console.log('\n🔍 Searching for KG1B (case-insensitive)...\n');
    const kg1b = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      AND LOWER(table_name) = LOWER('KG1B')
    `);
    
    if (kg1b.rows.length > 0) {
      console.log(`✅ Found: ${kg1b.rows[0].table_name}`);
      
      // Try to query it
      const students = await pool.query(`
        SELECT COUNT(*) as count
        FROM classes_schema."${kg1b.rows[0].table_name}"
      `);
      console.log(`   Students in table: ${students.rows[0].count}`);
    } else {
      console.log('❌ No table found matching KG1B');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkClassTables();
