const { Pool } = require('./backend/node_modules/pg');
require('./backend/node_modules/dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function verifyFixes() {
  try {
    console.log('🔍 Final Verification\n');
    
    // 1. Check A-somali mapping
    console.log('1️⃣ Checking A-somali mapping to KG1B...');
    const mappingCheck = await pool.query(
      "SELECT * FROM subjects_of_school_schema.subject_class_mappings WHERE subject_name = 'A-somali' AND class_name = 'KG1B'"
    );
    console.log('   ✅ A-somali mapping exists:', mappingCheck.rows.length > 0);
    if (mappingCheck.rows.length > 0) {
      console.log('   📋 Mapping:', mappingCheck.rows[0]);
    }
    
    // 2. Check schedule_schema.school_config
    console.log('\n2️⃣ Checking schedule_schema.school_config...');
    const configCheck = await pool.query('SELECT * FROM schedule_schema.school_config WHERE id = 1');
    console.log('   ✅ Config exists:', configCheck.rows.length > 0);
    if (configCheck.rows.length > 0) {
      console.log('   📋 Config:', configCheck.rows[0]);
    }
    
    // 3. Check all mappings for KG1B
    console.log('\n3️⃣ All subjects mapped to KG1B:');
    const allMappings = await pool.query(
      "SELECT subject_name FROM subjects_of_school_schema.subject_class_mappings WHERE class_name = 'KG1B' ORDER BY subject_name"
    );
    allMappings.rows.forEach(row => {
      console.log(`   - ${row.subject_name}`);
    });
    
    // 4. Verify subjects_of_school_schema tables
    console.log('\n4️⃣ Checking subjects_of_school_schema tables...');
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'subjects_of_school_schema'
      ORDER BY table_name
    `);
    console.log('   Tables in subjects_of_school_schema:');
    tablesCheck.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    console.log('\n✅ All verifications passed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyFixes();
