const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function listTables() {
  try {
    console.log('\n📊 ALL TABLES IN DATABASE:\n');
    
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log(`Found ${result.rows.length} tables:\n`);
    
    result.rows.forEach(r => {
      console.log(`  - ${r.table_name}`);
    });
    
    console.log('\n📋 TABLES WITH "staff" OR "teacher" IN NAME:\n');
    
    const staffTables = result.rows.filter(r => 
      r.table_name.toLowerCase().includes('staff') || 
      r.table_name.toLowerCase().includes('teacher')
    );
    
    staffTables.forEach(r => {
      console.log(`  ✅ ${r.table_name}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

listTables();
