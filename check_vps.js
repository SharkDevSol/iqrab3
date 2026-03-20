const { Pool } = require('pg');
const p = new Pool({ user: 'skoolific_user', host: 'localhost', database: 'school_management2', password: 'Skoolific2024Pass', port: 5432 });
async function run() {
  try {
    const r1 = await p.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'school_schema_points' LIMIT 5");
    console.log('school_schema_points tables:', JSON.stringify(r1.rows));
    const r2 = await p.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'class_students_fault' LIMIT 5");
    console.log('class_students_fault tables:', JSON.stringify(r2.rows));
    const r3 = await p.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema = 'classes_schema' LIMIT 5");
    console.log('classes_schema tables:', JSON.stringify(r3.rows));
  } catch(e) { console.error('ERROR:', e.message); }
  p.end();
}
run();
