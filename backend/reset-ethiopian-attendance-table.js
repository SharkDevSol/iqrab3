const pool = require('./config/db');

/**
 * Reset Ethiopian Attendance Table
 * WARNING: This will delete all existing attendance data!
 * Only use if the table structure is corrupted.
 */

async function resetEthiopianAttendanceTable() {
  const client = await pool.connect();
  
  try {
    console.log('⚠️  WARNING: This will DELETE all Ethiopian attendance data!');
    console.log('Press Ctrl+C within 5 seconds to cancel...\n');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('🔧 Resetting Ethiopian Attendance Table...\n');
    
    await client.query('BEGIN');
    
    // Drop the table if it exists
    console.log('🗑️  Dropping old table...');
    await client.query('DROP TABLE IF EXISTS hr_ethiopian_attendance CASCADE');
    console.log('✅ Old table dropped\n');
    
    // Create the table with correct structure
    console.log('📋 Creating new table with correct structure...');
    await client.query(`
      CREATE TABLE hr_ethiopian_attendance (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        staff_id VARCHAR(255) NOT NULL,
        staff_name VARCHAR(255) NOT NULL,
        department_name VARCHAR(255),
        ethiopian_year INTEGER NOT NULL,
        ethiopian_month INTEGER NOT NULL,
        ethiopian_day INTEGER NOT NULL,
        check_in TIME NOT NULL,
        check_out TIME,
        working_hours DECIMAL(5, 2),
        status VARCHAR(50) NOT NULL DEFAULT 'PRESENT',
        shift_type VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT hr_ethiopian_attendance_unique_record 
        UNIQUE (staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type)
      )
    `);
    console.log('✅ New table created\n');
    
    // Add indexes for performance
    console.log('📊 Creating indexes...');
    await client.query(`
      CREATE INDEX idx_hr_ethiopian_attendance_staff 
      ON hr_ethiopian_attendance(staff_id)
    `);
    await client.query(`
      CREATE INDEX idx_hr_ethiopian_attendance_date 
      ON hr_ethiopian_attendance(ethiopian_year, ethiopian_month, ethiopian_day)
    `);
    await client.query(`
      CREATE INDEX idx_hr_ethiopian_attendance_status 
      ON hr_ethiopian_attendance(status)
    `);
    console.log('✅ Indexes created\n');
    
    // Add comments
    console.log('📝 Adding documentation...');
    await client.query(`
      COMMENT ON TABLE hr_ethiopian_attendance IS 
      'Staff attendance records using Ethiopian calendar'
    `);
    await client.query(`
      COMMENT ON COLUMN hr_ethiopian_attendance.shift_type IS 
      'For staff working multiple shifts (shift1, shift2, or both)'
    `);
    console.log('✅ Documentation added\n');
    
    await client.query('COMMIT');
    
    // Verify the structure
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'hr_ethiopian_attendance'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Final table structure:');
    columns.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const def = col.column_default ? ` DEFAULT ${col.column_default.substring(0, 30)}...` : '';
      console.log(`   ✓ ${col.column_name}: ${col.data_type} ${nullable}${def}`);
    });
    
    console.log('\n✅ Ethiopian attendance table reset successfully!');
    console.log('⚠️  Note: All previous attendance data has been deleted.');
    console.log('📌 The auto-marker will repopulate absent records automatically.\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error resetting table:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetEthiopianAttendanceTable()
  .then(() => {
    console.log('✅ Reset complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  });
