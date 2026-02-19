const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management2',
  password: '12345678',
  port: 5432,
});

async function testGuardianQuery() {
  try {
    console.log('Testing guardian query...\n');
    
    // Get all class tables
    const tablesResult = await pool.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1', 
      ['classes_schema']
    );
    
    const classes = tablesResult.rows.map(row => row.table_name);
    console.log('Found classes:', classes);
    console.log('');
    
    // Check KG1A specifically
    console.log('Checking KG1A table...');
    
    // First check columns
    const columnsCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'classes_schema' 
        AND table_name = 'KG1A'
      ORDER BY ordinal_position
    `);
    
    console.log('KG1A columns:', columnsCheck.rows.map(r => r.column_name).join(', '));
    console.log('');
    
    // Check for guardian columns
    const guardianColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'classes_schema' 
        AND table_name = 'KG1A'
        AND column_name IN ('guardian_name', 'guardian_phone', 'guardian_username', 'guardian_password')
    `);
    
    console.log('Guardian columns found:', guardianColumns.rows.map(r => r.column_name).join(', '));
    console.log('Has enough guardian columns:', guardianColumns.rows.length >= 3);
    console.log('');
    
    // Query students with guardians (without is_active filter first)
    const result = await pool.query(`
      SELECT 
        student_name,
        guardian_name,
        guardian_phone,
        guardian_relation,
        guardian_username
      FROM classes_schema."KG1A"
      WHERE guardian_name IS NOT NULL AND guardian_name != ''
    `);
    
    console.log(`Found ${result.rows.length} students with guardians in KG1A:`);
    result.rows.forEach(row => {
      console.log(`  - ${row.student_name}: guardian=${row.guardian_name}, phone=${row.guardian_phone}`);
    });
    console.log('');
    
    // Check if is_active column exists
    const hasIsActive = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'classes_schema' 
        AND table_name = 'KG1A'
        AND column_name = 'is_active'
    `);
    
    console.log('Has is_active column:', hasIsActive.rows.length > 0);
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testGuardianQuery();
