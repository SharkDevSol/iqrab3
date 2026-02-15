const pool = require('./config/db');

async function findStaffTables() {
  try {
    console.log('🔍 Finding all tables that might contain staff data...\n');
    
    const result = await pool.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
        AND (
          table_name ILIKE '%staff%' 
          OR table_name ILIKE '%teacher%'
          OR table_name ILIKE '%admin%'
          OR table_name ILIKE '%support%'
        )
      ORDER BY table_schema, table_name
    `);
    
    console.log(`Found ${result.rows.length} tables:\n`);
    result.rows.forEach(row => {
      console.log(`  📋 ${row.table_schema}.${row.table_name}`);
    });
    
    // Check staff_users table
    console.log('\n🔍 Checking staff_users table...');
    const staffUsers = await pool.query(`
      SELECT * FROM staff_users LIMIT 3
    `).catch(err => {
      console.log('❌ Error:', err.message);
      return { rows: [] };
    });
    
    if (staffUsers.rows.length > 0) {
      console.log('Sample staff_users data:');
      staffUsers.rows.forEach(r => {
        console.log(`  - ${r.full_name} (ID: ${r.global_staff_id}) - Type: ${r.staff_type}, Class: ${r.class_name}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

findStaffTables();
