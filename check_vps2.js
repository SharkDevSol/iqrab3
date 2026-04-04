const { Pool } = require('pg');
const p = new Pool({ user: 'skoolific_user', host: 'localhost', database: 'school_management2', password: 'Skoolific2024Pass', port: 5432 });
async function run() {
  try {
    const r1 = await p.query('SELECT * FROM school_schema_points.classes LIMIT 3');
    console.log('classes rows:', JSON.stringify(r1.rows));
    const r2 = await p.query("SELECT column_name FROM information_schema.columns WHERE table_schema='school_schema_points' AND table_name='classes'");
    console.log('classes columns:', JSON.stringify(r2.rows));
  } catch(e) { console.error('ERROR:', e.message); }
  p.end();
}
run();
