const pool = require('./config/db');

async function addAccountNumberColumn() {
  try {
    console.log('🔧 Adding account_number column to staff tables...\n');
    
    // Add to staff_teachers.teachers
    try {
      await pool.query(`
        ALTER TABLE staff_teachers.teachers 
        ADD COLUMN IF NOT EXISTS account_number VARCHAR(100)
      `);
      console.log('✅ Added account_number to staff_teachers.teachers');
    } catch (err) {
      console.log('⚠️ staff_teachers.teachers:', err.message);
    }
    
    // Add to other staff tables if they exist
    const tables = [
      'staff_administrative.administrative',
      'staff_supportive.supportive',
      'administrative_staff.staff',
      'supportive_staff.staff'
    ];
    
    for (const table of tables) {
      try {
        await pool.query(`
          ALTER TABLE ${table} 
          ADD COLUMN IF NOT EXISTS account_number VARCHAR(100)
        `);
        console.log(`✅ Added account_number to ${table}`);
      } catch (err) {
        console.log(`⚠️ ${table}: ${err.message}`);
      }
    }
    
    console.log('\n✅ Account number columns added!');
    console.log('\n📝 Next step: Update staff records with their account numbers');
    console.log('Example:');
    console.log('  UPDATE staff_teachers.teachers SET account_number = \'ACC-001\' WHERE global_staff_id = 1;');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addAccountNumberColumn();
