const { Pool } = require('pg');
const p = new Pool({ user: 'skoolific_user', host: 'localhost', database: 'school_management2', password: 'Skoolific2024Pass', port: 5432 });
async function run() {
  try {
    // Simulate exactly what /api/faults/classes does
    const schemaCheck = await p.query(`SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'school_schema_points' AND table_name = 'classes')`);
    console.log('schema exists:', schemaCheck.rows[0].exists);
    if (schemaCheck.rows[0].exists) {
      const result = await p.query(`SELECT class_names FROM school_schema_points.classes WHERE id = 1`);
      console.log('class_names:', JSON.stringify(result.rows[0]?.class_names));
    }
    // Simulate /api/faults/reports
    const tablesResult = await p.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'class_students_fault'`);
    console.log('fault tables:', JSON.stringify(tablesResult.rows));
  } catch(e) { console.error('ERROR:', e.message, e.stack); }
  p.end();
}
run();
