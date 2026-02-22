const db = require('./config/db');

async function checkStudentId() {
  try {
    // Check what's in the KG1B class table
    const result = await db.query(`
      SELECT id, school_id, student_name, class 
      FROM classes_schema."KG1B" 
      WHERE guardian_username = 'abdurhmanahmed_4386'
    `);
    
    console.log('KG1B Students for guardian abdurhmanahmed_4386:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    if (result.rows.length > 0) {
      const student = result.rows[0];
      console.log('\n--- ID Conversion Test ---');
      console.log('id field:', student.id);
      console.log('school_id field:', student.school_id);
      
      // Current conversion (using id)
      const idNum = parseInt(student.id);
      const currentFormat = `00000000-0000-0000-${String(idNum).padStart(4, '0')}-${String(idNum).padStart(12, '0')}`;
      console.log('Current UUID (from id):', currentFormat);
      
      // Try school_id conversion
      const schoolIdNum = parseInt(student.school_id);
      const schoolIdFormat = `00000000-0000-0000-${String(schoolIdNum).padStart(4, '0')}-${String(schoolIdNum).padStart(12, '0')}`;
      console.log('UUID from school_id:', schoolIdFormat);
      
      // The correct UUID from admin panel
      console.log('Expected UUID:', '00000000-0000-0000-0041-000000000001');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.end();
  }
}

checkStudentId();
