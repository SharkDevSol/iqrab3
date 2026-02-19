const { Pool } = require('./backend/node_modules/pg');
require('./backend/node_modules/dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testSubjectMapping() {
  try {
    console.log('🔍 Checking A-somali subject mapping...\n');
    
    // Check if subject exists
    const subjectCheck = await pool.query(
      "SELECT * FROM subjects_of_school_schema.subjects WHERE subject_name ILIKE '%somali%'"
    );
    console.log('📚 Subjects with "somali":', subjectCheck.rows);
    
    // Check mappings
    const mappingCheck = await pool.query(
      "SELECT * FROM subjects_of_school_schema.subject_class_mappings WHERE subject_name ILIKE '%somali%'"
    );
    console.log('\n🔗 Mappings for somali subjects:', mappingCheck.rows);
    
    // Check all mappings for KG1B
    const kg1bMappings = await pool.query(
      "SELECT * FROM subjects_of_school_schema.subject_class_mappings WHERE class_name = 'KG1B'"
    );
    console.log('\n📋 All mappings for KG1B:', kg1bMappings.rows);
    
    // Check schedule_schema.school_config table
    console.log('\n🏫 Checking schedule_schema.school_config table...');
    const schemaCheck = await pool.query(
      "SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'schedule_schema'"
    );
    console.log('Schedule schema exists:', schemaCheck.rows.length > 0);
    
    if (schemaCheck.rows.length > 0) {
      const tableCheck = await pool.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema = 'schedule_schema' AND table_name = 'school_config'"
      );
      console.log('school_config table exists:', tableCheck.rows.length > 0);
      
      if (tableCheck.rows.length > 0) {
        const configData = await pool.query('SELECT * FROM schedule_schema.school_config');
        console.log('Config data:', configData.rows);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testSubjectMapping();
