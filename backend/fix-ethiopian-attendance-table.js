const pool = require('./config/db');

/**
 * Fix Ethiopian Attendance Table
 * Adds missing shift_type column to existing table
 */

async function fixEthiopianAttendanceTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing Ethiopian Attendance Table...\n');
    
    // Check if table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hr_ethiopian_attendance'
      )
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('⚠️  Table hr_ethiopian_attendance does not exist yet');
      console.log('✅ It will be created automatically on first use\n');
      return;
    }
    
    console.log('✅ Table hr_ethiopian_attendance exists\n');
    
    // Check if shift_type column exists
    const columnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'hr_ethiopian_attendance' 
      AND column_name = 'shift_type'
    `);
    
    if (columnExists.rows.length > 0) {
      console.log('✅ shift_type column already exists\n');
    } else {
      console.log('⚠️  shift_type column is missing, adding it...');
      
      // Add shift_type column
      await client.query(`
        ALTER TABLE hr_ethiopian_attendance 
        ADD COLUMN shift_type VARCHAR(20)
      `);
      
      console.log('✅ shift_type column added successfully\n');
    }
    
    // Drop old unique constraint if it exists
    console.log('🔧 Updating unique constraint...');
    await client.query(`
      ALTER TABLE hr_ethiopian_attendance 
      DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_staff_id_ethiopian_year_ethiopian_mo_key
    `);
    
    await client.query(`
      ALTER TABLE hr_ethiopian_attendance 
      DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_staff_id_ethiopian_year_key
    `);
    
    // Add new unique constraint with shift_type
    await client.query(`
      ALTER TABLE hr_ethiopian_attendance 
      DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_unique_record
    `);
    
    await client.query(`
      ALTER TABLE hr_ethiopian_attendance 
      ADD CONSTRAINT hr_ethiopian_attendance_unique_record 
      UNIQUE (staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type)
    `);
    
    console.log('✅ Unique constraint updated\n');
    
    // Verify the fix
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'hr_ethiopian_attendance'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current table structure:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    
    console.log('\n✅ Ethiopian attendance table fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing table:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixEthiopianAttendanceTable()
  .then(() => {
    console.log('\n✅ Fix complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  });
