const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management2',
  password: '12345678',
  port: 5432,
});

async function fixGuardianUsernames() {
  try {
    console.log('========================================');
    console.log('Fixing Guardian Usernames');
    console.log('========================================\n');
    
    // First, check current state
    console.log('BEFORE FIX:\n');
    const beforeQuery = `
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
    
    const beforeResult = await pool.query(beforeQuery);
    console.table(beforeResult.rows);
    
    // Apply the fix
    console.log('\nApplying fix...\n');
    
    // Update KG2A
    console.log('Updating KG2A (obsa yusuf)...');
    await pool.query(`
      UPDATE classes_schema."KG2A"
      SET 
        guardian_username = 'abdurhmanahmed_4386',
        guardian_password = (
          SELECT guardian_password 
          FROM classes_schema."KG1B" 
          WHERE guardian_phone = '0936311768' 
          LIMIT 1
        )
      WHERE guardian_phone = '0936311768'
    `);
    console.log('✓ KG2A updated');
    
    // Update GRADE2
    console.log('Updating GRADE2 (halima yusuf)...');
    await pool.query(`
      UPDATE classes_schema."GRADE2"
      SET 
        guardian_username = 'abdurhmanahmed_4386',
        guardian_password = (
          SELECT guardian_password 
          FROM classes_schema."KG1B" 
          WHERE guardian_phone = '0936311768' 
          LIMIT 1
        )
      WHERE guardian_phone = '0936311768'
    `);
    console.log('✓ GRADE2 updated');
    
    // Verify the fix
    console.log('\nAFTER FIX:\n');
    const afterResult = await pool.query(beforeQuery);
    console.table(afterResult.rows);
    
    // Check if all have same username now
    const usernames = [...new Set(afterResult.rows.map(r => r.guardian_username))];
    
    console.log('\n========================================');
    if (usernames.length === 1) {
      console.log('✓ SUCCESS! All students now have the SAME guardian_username:', usernames[0]);
      console.log('\nNext steps:');
      console.log('1. Restart your backend server');
      console.log('2. Refresh the guardian app');
      console.log('3. Check the payments tab - all 3 students should appear!');
    } else {
      console.log('✗ Something went wrong. Students still have different usernames.');
    }
    console.log('========================================\n');
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

fixGuardianUsernames();
