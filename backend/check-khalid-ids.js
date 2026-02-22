const db = require('./config/db');

async function checkKhalidIds() {
  try {
    const result = await db.query(`
      SELECT id, school_id, class_id, student_name, guardian_username
      FROM classes_schema."KG1B"
      WHERE student_name LIKE '%khalid%'
    `);
    
    console.log('Student data:');
    console.log(JSON.stringify(result.rows, null, 2));
    
    if (result.rows.length > 0) {
      const student = result.rows[0];
      console.log('\n\nPossible UUID formats:');
      console.log(`Based on id (${student.id}): 00000000-0000-0000-${String(student.id).padStart(4, '0')}-${String(student.id).padStart(12, '0')}`);
      console.log(`Based on school_id (${student.school_id}): 00000000-0000-0000-${String(student.school_id).padStart(4, '0')}-${String(student.school_id).padStart(12, '0')}`);
      console.log(`Based on class_id (${student.class_id}): 00000000-0000-0000-${String(student.class_id).padStart(4, '0')}-${String(student.class_id).padStart(12, '0')}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await db.end();
  }
}

checkKhalidIds();
