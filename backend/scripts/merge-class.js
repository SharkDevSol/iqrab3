// Script to move students from one class to another and delete source class
const db = require('../config/db');

const SOURCE_CLASS = '8B'; // class to move FROM
const TARGET_CLASS = '8';  // class to move TO

async function mergeClasses() {
  try {
    // 1. Show students in both classes
    const [sourceSt] = await db.promise().query('SELECT student_id, student_name, class FROM students WHERE class = ?', [SOURCE_CLASS]);
    const [targetSt] = await db.promise().query('SELECT student_id, student_name, class FROM students WHERE class = ?', [TARGET_CLASS]);
    
    console.log(`\n${SOURCE_CLASS} students (${sourceSt.length}):`, sourceSt.map(s => s.student_name));
    console.log(`\n${TARGET_CLASS} students (${targetSt.length}):`, targetSt.map(s => s.student_name));

    // 2. Move students from SOURCE to TARGET
    const [result] = await db.promise().query(
      'UPDATE students SET class = ? WHERE class = ?',
      [TARGET_CLASS, SOURCE_CLASS]
    );
    console.log(`\nMoved ${result.affectedRows} students from ${SOURCE_CLASS} to ${TARGET_CLASS}`);

    // 3. Verify
    const [verify] = await db.promise().query('SELECT student_id, student_name FROM students WHERE class = ?', [TARGET_CLASS]);
    console.log(`\n${TARGET_CLASS} now has ${verify.length} students:`, verify.map(s => s.student_name));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

mergeClasses();
