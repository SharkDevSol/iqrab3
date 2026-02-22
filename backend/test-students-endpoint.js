// Test the students endpoint
const pool = require('./config/db');

async function testStudentsEndpoint() {
  const className = 'KG1B';
  
  try {
    console.log(`📥 Testing students endpoint for: ${className}\n`);
    
    const validTableName = /^[a-zA-Z0-9_]+$/.test(className);
    console.log(`✓ Valid table name: ${validTableName}`);
    
    // Try to query the table
    try {
      const result = await pool.query(`
        SELECT school_id, class_id, student_name, age, gender, image_student
        FROM classes_schema."${className}"
        WHERE is_active = TRUE OR is_active IS NULL
        ORDER BY LOWER(student_name) ASC
      `);
      
      console.log(`✅ Found ${result.rows.length} students in ${className}`);
      console.log('\nStudent data:');
      console.log(JSON.stringify(result.rows, null, 2));
      
    } catch (tableError) {
      console.error(`❌ Error querying table ${className}:`, tableError.message);
      console.error('Full error:', tableError);
      
      // Try to find similar table names
      const similarTables = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'classes_schema' 
        AND LOWER(table_name) = LOWER($1)
      `, [className]);
      
      if (similarTables.rows.length > 0) {
        const actualTableName = similarTables.rows[0].table_name;
        console.log(`💡 Found similar table: ${actualTableName}`);
        
        const result = await pool.query(`
          SELECT school_id, class_id, student_name, age, gender, image_student
          FROM classes_schema."${actualTableName}"
          WHERE is_active = TRUE OR is_active IS NULL
          ORDER BY LOWER(student_name) ASC
        `);
        
        console.log(`✅ Found ${result.rows.length} students in ${actualTableName}`);
        console.log('\nStudent data:');
        console.log(JSON.stringify(result.rows, null, 2));
      } else {
        console.log('❌ No similar table found');
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

testStudentsEndpoint();
