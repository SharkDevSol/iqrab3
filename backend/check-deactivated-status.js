const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'school_management',
  password: process.env.DB_PASSWORD || '12345678',
  port: process.env.DB_PORT || 5432,
});

async function checkDeactivatedStatus() {
  try {
    console.log('🔍 Checking deactivated students in all classes...\n');
    
    // Get all class tables
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'classes_schema'
      ORDER BY table_name
    `);
    
    for (const table of tablesResult.rows) {
      const className = table.table_name;
      
      // Check if is_active column exists
      const columnCheck = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'classes_schema' 
          AND table_name = $1 
          AND column_name = 'is_active'
      `, [className]);
      
      if (columnCheck.rows.length === 0) {
        console.log(`⚠️  Class ${className}: is_active column does NOT exist`);
        continue;
      }
      
      // Get all students with their active status
      const studentsResult = await pool.query(`
        SELECT student_name, school_id, class_id, is_active
        FROM classes_schema."${className}"
        ORDER BY student_name
      `);
      
      console.log(`\n📋 Class ${className}:`);
      console.log(`   Total students: ${studentsResult.rows.length}`);
      
      const activeStudents = studentsResult.rows.filter(s => s.is_active === true || s.is_active === null);
      const deactivatedStudents = studentsResult.rows.filter(s => s.is_active === false);
      
      console.log(`   ✅ Active: ${activeStudents.length}`);
      console.log(`   ❌ Deactivated: ${deactivatedStudents.length}`);
      
      if (deactivatedStudents.length > 0) {
        console.log(`\n   Deactivated students:`);
        deactivatedStudents.forEach(s => {
          console.log(`      - ${s.student_name} (ID: ${s.school_id}-${s.class_id})`);
        });
      }
      
      if (activeStudents.length > 0) {
        console.log(`\n   Active students:`);
        activeStudents.forEach(s => {
          console.log(`      - ${s.student_name} (ID: ${s.school_id}-${s.class_id})`);
        });
      }
    }
    
    console.log('\n✅ Check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkDeactivatedStatus();
