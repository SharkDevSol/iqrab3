const pool = require('./config/db');

async function checkTeachersSchema() {
  try {
    console.log('🔍 Checking teachers schema tables...\n');
    
    // Check staff_teachers.teachers
    console.log('📋 staff_teachers.teachers:');
    const columns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'staff_teachers' AND table_name = 'teachers'
      ORDER BY ordinal_position
    `);
    console.log('Columns:', columns.rows.map(r => r.column_name).join(', '));
    
    const sample = await pool.query(`
      SELECT * FROM staff_teachers.teachers LIMIT 3
    `);
    
    if (sample.rows.length > 0) {
      console.log('\nSample data:');
      sample.rows.forEach((r, i) => {
        console.log(`\nRecord ${i + 1}:`);
        Object.keys(r).forEach(key => {
          if (r[key] !== null) {
            console.log(`  ${key}: ${r[key]}`);
          }
        });
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTeachersSchema();
