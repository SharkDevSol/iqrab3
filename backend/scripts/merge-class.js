const db = require('../config/db');

const SOURCE_CLASS = '8B';
const TARGET_CLASS = '8';

async function mergeClasses() {
  try {
    const src = await db.query('SELECT student_id, student_name FROM students WHERE class = $1', [SOURCE_CLASS]);
    const tgt = await db.query('SELECT student_id, student_name FROM students WHERE class = $1', [TARGET_CLASS]);

    console.log(`\n${SOURCE_CLASS} (${src.rows.length}):`, src.rows.map(s => s.student_name));
    console.log(`${TARGET_CLASS} (${tgt.rows.length}):`, tgt.rows.map(s => s.student_name));

    const result = await db.query('UPDATE students SET class = $1 WHERE class = $2', [TARGET_CLASS, SOURCE_CLASS]);
    console.log(`\nMoved ${result.rowCount} students from ${SOURCE_CLASS} → ${TARGET_CLASS}`);

    const verify = await db.query('SELECT student_name FROM students WHERE class = $1 ORDER BY student_name', [TARGET_CLASS]);
    console.log(`\n${TARGET_CLASS} now has ${verify.rows.length} students:`, verify.rows.map(s => s.student_name));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

mergeClasses();
