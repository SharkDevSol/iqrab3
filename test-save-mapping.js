const { Pool } = require('./backend/node_modules/pg');
require('./backend/node_modules/dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function testSaveMapping() {
  const client = await pool.connect();
  try {
    console.log('🧪 Testing A-somali mapping save...\n');
    
    // Check if A-somali subject exists
    const subjectCheck = await client.query(
      'SELECT subject_name FROM subjects_of_school_schema.subjects WHERE subject_name = $1',
      ['A-somali']
    );
    console.log('✅ A-somali exists:', subjectCheck.rows.length > 0);
    
    // Check if KG1B class exists
    const classCheck = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'classes_schema' AND table_name = $1`,
      ['KG1B']
    );
    console.log('✅ KG1B class exists:', classCheck.rows.length > 0);
    
    // Try to insert the mapping
    console.log('\n📝 Attempting to insert A-somali -> KG1B mapping...');
    const insertResult = await client.query(
      'INSERT INTO subjects_of_school_schema.subject_class_mappings (class_name, subject_name) VALUES ($1, $2) ON CONFLICT (subject_name, class_name) DO NOTHING RETURNING *',
      ['KG1B', 'A-somali']
    );
    
    if (insertResult.rows.length > 0) {
      console.log('✅ Mapping inserted successfully:', insertResult.rows[0]);
    } else {
      console.log('⚠️ Mapping already exists or was not inserted');
    }
    
    // Verify the mapping exists
    const verifyResult = await client.query(
      'SELECT * FROM subjects_of_school_schema.subject_class_mappings WHERE subject_name = $1 AND class_name = $2',
      ['A-somali', 'KG1B']
    );
    console.log('\n🔍 Verification - A-somali mapping to KG1B:', verifyResult.rows);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Details:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

testSaveMapping();
