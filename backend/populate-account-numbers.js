const pool = require('./config/db');

async function populateAccountNumbers() {
  try {
    console.log('🔧 Populating account numbers for staff...\n');
    
    // Get all staff from teachers table
    const staff = await pool.query(`
      SELECT global_staff_id, name 
      FROM staff_teachers.teachers 
      ORDER BY global_staff_id
    `);
    
    console.log(`Found ${staff.rows.length} staff members\n`);
    
    // Update each with a simple account number
    for (const s of staff.rows) {
      const accountNumber = `ACC-${String(s.global_staff_id).padStart(4, '0')}`;
      
      await pool.query(`
        UPDATE staff_teachers.teachers 
        SET account_number = $1 
        WHERE global_staff_id = $2
      `, [accountNumber, s.global_staff_id]);
      
      console.log(`✅ ${s.name} (ID: ${s.global_staff_id}) -> ${accountNumber}`);
    }
    
    console.log(`\n✅ Updated ${staff.rows.length} staff with account numbers!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

populateAccountNumbers();
