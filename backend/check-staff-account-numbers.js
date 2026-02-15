const pool = require('./config/db');

async function checkAccountNumbers() {
  try {
    console.log('🔍 Checking if staff tables have account_number column...\n');
    
    // Check Teacher table
    console.log('📋 Teacher table:');
    const teacherColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Teacher'
      ORDER BY ordinal_position
    `);
    console.log('Columns:', teacherColumns.rows.map(r => r.column_name).join(', '));
    
    const teacherSample = await pool.query(`SELECT global_staff_id, full_name, account_number FROM "Teacher" LIMIT 3`).catch(err => {
      console.log('❌ Error:', err.message);
      return { rows: [] };
    });
    if (teacherSample.rows.length > 0) {
      console.log('Sample data:');
      teacherSample.rows.forEach(r => console.log(`  - ${r.full_name} (ID: ${r.global_staff_id}) - Account: ${r.account_number || 'NULL'}`));
    }
    
    console.log('\n📋 AdministrativeStaff table:');
    const adminColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'AdministrativeStaff'
      ORDER BY ordinal_position
    `);
    console.log('Columns:', adminColumns.rows.map(r => r.column_name).join(', '));
    
    const adminSample = await pool.query(`SELECT global_staff_id, full_name, account_number FROM "AdministrativeStaff" LIMIT 3`).catch(err => {
      console.log('❌ Error:', err.message);
      return { rows: [] };
    });
    if (adminSample.rows.length > 0) {
      console.log('Sample data:');
      adminSample.rows.forEach(r => console.log(`  - ${r.full_name} (ID: ${r.global_staff_id}) - Account: ${r.account_number || 'NULL'}`));
    }
    
    console.log('\n📋 SupportiveStaff table:');
    const supportColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'SupportiveStaff'
      ORDER BY ordinal_position
    `);
    console.log('Columns:', supportColumns.rows.map(r => r.column_name).join(', '));
    
    const supportSample = await pool.query(`SELECT global_staff_id, full_name, account_number FROM "SupportiveStaff" LIMIT 3`).catch(err => {
      console.log('❌ Error:', err.message);
      return { rows: [] };
    });
    if (supportSample.rows.length > 0) {
      console.log('Sample data:');
      supportSample.rows.forEach(r => console.log(`  - ${r.full_name} (ID: ${r.global_staff_id}) - Account: ${r.account_number || 'NULL'}`));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAccountNumbers();
