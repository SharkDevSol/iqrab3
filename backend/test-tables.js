const pool = require('./config/db');

async function checkTables() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('shift_time_settings', 'hr_attendance_time_settings')
    `);
    
    console.log('Existing tabl