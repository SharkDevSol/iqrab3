const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management2',
  password: '12345678',
  port: 5432,
});

async function testGuardianEndpoint() {
  try {
    console.log('Simulating guardian list endpoint...\n');
    
    // Get all class tables
    const tablesResult = await pool.query(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = $1', 
      ['classes_schema']
    );
    
    const classes = tablesResult.rows.map(row => row.table_name);
    console.log('Found classes:', classes.length);
    
    const guardiansMap = new Map();
    
    for (const className of classes) {
      try {
        // Check columns
        const columnsCheck = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'classes_schema' 
            AND table_name = $1 
            AND column_name IN ('guardian_name', 'guardian_phone', 'guardian_username', 'guardian_password', 'is_active')
        `, [className]);
        
        const columnNames = columnsCheck.rows.map(r => r.column_name);
        const hasGuardianColumns = columnNames.filter(c => c.startsWith('guardian')).length >= 3;
        const hasIsActive = columnNames.includes('is_active');
        
        if (!hasGuardianColumns) {
          console.log(`Skipping ${className}: Missing guardian columns`);
          continue;
        }
        
        // Build query with conditional is_active filter
        const whereClause = hasIsActive 
          ? `WHERE guardian_name IS NOT NULL AND guardian_name != '' AND (is_active = TRUE OR is_active IS NULL)`
          : `WHERE guardian_name IS NOT NULL AND guardian_name != ''`;
        
        const result = await pool.query(`
          SELECT 
            guardian_name,
            guardian_phone,
            guardian_relation,
            guardian_username,
            guardian_password,
            student_name,
            school_id,
            class_id
          FROM classes_schema."${className}"
          ${whereClause}
        `);
        
        console.log(`${className}: Found ${result.rows.length} students with guardians (has_is_active: ${hasIsActive})`);
        
        for (const row of result.rows) {
          const key = row.guardian_phone || row.guardian_name;
          
          if (guardiansMap.has(key)) {
            const guardian = guardiansMap.get(key);
            guardian.students.push({
              student_name: row.student_name,
              class: className,
              school_id: row.school_id,
              class_id: row.class_id
            });
          } else {
            guardiansMap.set(key, {
              id: key,
              guardian_name: row.guardian_name,
              guardian_phone: row.guardian_phone || '',
              guardian_relation: row.guardian_relation || '',
              guardian_username: row.guardian_username || '',
              guardian_password: row.guardian_password || '',
              students: [{
                student_name: row.student_name,
                class: className,
                school_id: row.school_id,
                class_id: row.class_id
              }]
            });
          }
        }
      } catch (err) {
        console.error(`Error with ${className}:`, err.message);
      }
    }
    
    const guardians = Array.from(guardiansMap.values());
    console.log(`\nTotal unique guardians: ${guardians.length}`);
    
    guardians.forEach(g => {
      console.log(`\n- ${g.guardian_name} (${g.guardian_phone})`);
      console.log(`  Username: ${g.guardian_username}`);
      console.log(`  Students: ${g.students.map(s => s.student_name).join(', ')}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

testGuardianEndpoint();
