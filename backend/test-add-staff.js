const pool = require('./config/db');

async function testAddStaff() {
  const client = await pool.connect();
  
  try {
    console.log('Starting transaction...');
    await client.query('BEGIN');
    
    // Get next staff_id
    const maxResult = await client.query(`
      SELECT COALESCE(MAX(staff_id), 0) as max_staff_id 
      FROM staff_teachers.teachers
    `);
    const nextStaffId = maxResult.rows[0].max_staff_id + 1;
    console.log(`Next staff_id: ${nextStaffId}`);
    
    // Get next global_staff_id
    const globalResult = await client.query(
      "UPDATE staff_counter SET count = count + 1 WHERE id = 1 RETURNING count"
    );
    const globalStaffId = globalResult.rows[0].count;
    console.log(`Next global_staff_id: ${globalStaffId}`);
    
    // Insert test staff
    console.log('Inserting test staff...');
    await client.query(`
      INSERT INTO staff_teachers.teachers 
      (global_staff_id, staff_id, name, gender, role, staff_enrollment_type, staff_work_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [globalStaffId, nextStaffId, 'TEST STAFF', 'Male', 'Teacher', 'Permanent', 'Full time']);
    
    console.log('Staff inserted successfully');
    
    // Update staff IDs
    console.log('Updating staff IDs...');
    const staff = await client.query(`
      SELECT id FROM staff_teachers.teachers ORDER BY LOWER(name) ASC
    `);
    
    for (let i = 0; i < staff.rows.length; i++) {
      await client.query(
        `UPDATE staff_teachers.teachers SET staff_id = $1 WHERE id = $2`,
        [i + 1, staff.rows[i].id]
      );
    }
    console.log(`Updated ${staff.rows.length} staff IDs`);
    
    // Commit
    console.log('Committing transaction...');
    await client.query('COMMIT');
    console.log('✅ Transaction committed successfully!');
    
    // Verify
    const verifyResult = await pool.query(`
      SELECT COUNT(*) as total FROM staff_teachers.teachers
    `);
    console.log(`\nTotal staff in database: ${verifyResult.rows[0].total}`);
    
    const testStaff = await pool.query(`
      SELECT * FROM staff_teachers.teachers WHERE name = 'TEST STAFF'
    `);
    
    if (testStaff.rows.length > 0) {
      console.log('✅ TEST STAFF found in database:');
      console.log(`   Staff ID: ${testStaff.rows[0].staff_id}`);
      console.log(`   Global ID: ${testStaff.rows[0].global_staff_id}`);
    } else {
      console.log('❌ TEST STAFF not found in database');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    await client.query('ROLLBACK');
    console.log('Transaction rolled back');
  } finally {
    client.release();
    process.exit(0);
  }
}

testAddStaff();
