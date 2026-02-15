// Clear All Attendance Data
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management',
  password: '12345678',
  port: 5432,
});

async function clearAttendanceData() {
  console.log('\n⚠️  CLEAR ALL ATTENDANCE DATA\n');
  console.log('=' .repeat(60));
  console.log('⚠️  WARNING: This will delete ALL attendance records!');
  console.log('=' .repeat(60));
  
  try {
    // Count records before deletion
    console.log('\n📊 Checking current data...\n');
    
    const ethiopianCount = await pool.query('SELECT COUNT(*) FROM hr_ethiopian_attendance');
    const staffCount = await pool.query('SELECT COUNT(*) FROM hr_staff_attendance');
    
    console.log(`   hr_ethiopian_attendance: ${ethiopianCount.rows[0].count} records`);
    console.log(`   hr_staff_attendance: ${staffCount.rows[0].count} records`);
    
    const totalRecords = parseInt(ethiopianCount.rows[0].count) + parseInt(staffCount.rows[0].count);
    
    if (totalRecords === 0) {
      console.log('\n✅ No attendance records found. Nothing to delete.');
      return;
    }
    
    console.log(`\n   Total: ${totalRecords} records will be deleted`);
    console.log('\n🗑️  Deleting all attendance records...\n');
    
    // Delete from both tables
    await pool.query('DELETE FROM hr_ethiopian_attendance');
    console.log('   ✅ Cleared hr_ethiopian_attendance');
    
    await pool.query('DELETE FROM hr_staff_attendance');
    console.log('   ✅ Cleared hr_staff_attendance');
    
    // Verify deletion
    const verifyEthiopian = await pool.query('SELECT COUNT(*) FROM hr_ethiopian_attendance');
    const verifyStaff = await pool.query('SELECT COUNT(*) FROM hr_staff_attendance');
    
    console.log('\n📊 Verification:');
    console.log(`   hr_ethiopian_attendance: ${verifyEthiopian.rows[0].count} records`);
    console.log(`   hr_staff_attendance: ${verifyStaff.rows[0].count} records`);
    
    console.log('\n✅ All attendance data has been cleared!');
    console.log('💡 You can now start fresh with new attendance records.');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
    console.log('\n' + '='.repeat(60));
  }
}

clearAttendanceData();
