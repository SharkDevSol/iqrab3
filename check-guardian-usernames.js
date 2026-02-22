const { Pool } = require('pg');
require('dotenv').config({ path: './backend/.env' });

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management2',
  password: process.env.DB_PASSWORD,  // SECURITY: Use .env file
  port: process.env.DB_PORT || 5432,
});

async function checkGuardianUsernames() {
  try {
    console.log('========================================');
    console.log('Checking Guardian Usernames');
    console.log('========================================\n');
    
    const query = `
      SELECT student_name, school_id, class, guardian_phone, guardian_username 
      FROM classes_schema."KG1B" 
      WHERE guardian_phone = '0936311768'
      
      UNION ALL
      
      SELECT student_name, school_id, class, guardian_phone, guardian_username 
      FROM classes_schema."KG2A" 
      WHERE guardian_phone = '0936311768'
      
      UNION ALL
      
      SELECT student_name, school_id, class, guardian_phone, guardian_username 
      FROM classes_schema."GRADE2" 
      WHERE guardian_phone = '0936311768'
    `;
    
    const result = await pool.query(query);
    
    console.log('Students with phone 0936311768:\n');
    console.table(result.rows);
    
    // Check if all have same username
    const usernames = [...new Set(result.rows.map(r => r.guardian_username))];
    
    console.log('\n========================================');
    if (usernames.length === 1) {
      console.log('✓ All students have the SAME guardian_username:', usernames[0]);
      console.log('✓ Payments tab should work correctly!');
    } else {
      console.log('✗ PROBLEM FOUND: Students have DIFFERENT guardian_usernames:');
      usernames.forEach(u => console.log('  -', u));
      console.log('\nThis is why payments tab only shows 1 student!');
      console.log('Run: node fix-guardian-usernames.js to fix this issue');
    }
    console.log('========================================\n');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkGuardianUsernames();
