// Create HR Staff Attendance Table
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'school_management',
  password: '12345678',
  port: 5432,
});

async function createAttendanceTable() {
  console.log('\n📋 CREATING HR STAFF ATTENDANCE TABLE\n');
  
  try {
    // Create the table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hr_staff_attendance (
        id SERIAL PRIMARY KEY,
        staff_id INTEGER NOT NULL,
        staff_name VARCHAR(255) NOT NULL,
        machine_id VARCHAR(50),
        eth_year INTEGER NOT NULL,
        eth_month INTEGER NOT NULL,
        eth_day INTEGER NOT NULL,
        check_in_time TIME,
        check_out_time TIME,
        status VARCHAR(50) DEFAULT 'present',
        work_hours DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(staff_id, eth_year, eth_month, eth_day)
      )
    `);
    
    console.log('✅ Table hr_staff_attendance created successfully!');
    
    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_staff_attendance_staff_id 
      ON hr_staff_attendance(staff_id)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_staff_attendance_date 
      ON hr_staff_attendance(eth_year, eth_month, eth_day)
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_staff_attendance_machine_id 
      ON hr_staff_attendance(machine_id)
    `);
    
    console.log('✅ Indexes created successfully!');
    
    // Verify table structure
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'hr_staff_attendance'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 Table Structure:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    
    console.log('\n✅ Setup complete! You can now record attendance.');
    console.log('💡 Next: Scan on the machine and check the attendance page');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createAttendanceTable();
