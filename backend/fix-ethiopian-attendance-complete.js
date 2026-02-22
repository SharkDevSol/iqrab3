const pool = require('./config/db');

/**
 * Complete Fix for Ethiopian Attendance Table
 * Ensures all required columns exist
 */

async function fixEthiopianAttendanceComplete() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Complete Fix for Ethiopian Attendance Table...\n');
    
    await client.query('BEGIN');
    
    // Check if table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hr_ethiopian_attendance'
      )
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('⚠️  Table does not exist, creating it...');
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
          UNIQUE(staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type)
        )
      `);
      console.log('✅ Table created\n');
    } else {
      console.log('✅ Table exists\n');
      
      // Add missing columns
      const requiredColumns = [
        { name: 'check_in', type: 'TIME', nullable: false, default: "'08:00'" },
        { name: 'check_out', type: 'TIME', nullable: true, default: null },
        { name: 'working_hours', type: 'DECIMAL(5, 2)', nullable: true, default: null },
        { name: 'shift_type', type: 'VARCHAR(20)', nullable: true, default: null }
      ];
      
      for (const col of requiredColumns) {
        const exists = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'hr_ethiopian_attendance' 
          AND column_name = $1
        `, [col.name]);
        
        if (exists.rows.length === 0) {
          console.log(`⚠️  Column ${col.name} is missing, adding it...`);
          
          let alterQuery = `ALTER TABLE hr_ethiopian_attendance ADD COLUMN ${col.name} ${col.type}`;
          
          if (!col.nullable) {
            if (col.default) {
              alterQuery += ` DEFAULT ${col.default}`;
            }
            alterQuery += ` NOT NULL`;
          }
          
          await client.query(alterQuery);
          console.log(`✅ Column ${col.name} added`);
        } else {
          console.log(`✅ Column ${col.name} exists`);
        }
      }
      
      console.log('');
      
      // Update unique constraint
      console.log('🔧 Updating unique constraint...');
      
      // Drop all old constraints
      await client.query(`
        ALTER TABLE hr_ethiopian_attendance 
        DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_staff_id_ethiopian_year_ethiopian_mo_key
      `);
      
      await client.query(`
        ALTER TABLE hr_ethiopian_attendance 
        DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_staff_id_ethiopian_year_key
      `);
      
      await client.query(`
        ALTER TABLE hr_ethiopian_attendance 
        DROP CONSTRAINT IF EXISTS hr_ethiopian_attendance_unique_record
      `);
      
      // Add new constraint
      await client.query(`
        ALTER TABLE hr_ethiopian_attendance 
        ADD CONSTRAINT hr_ethiopian_attendance_unique_record 
        UNIQUE (staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type)
      `);
      
      console.log('✅ Unique constraint updated\n');
    }
    
    await client.query('COMMIT');
    
    // Verify the fix
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
      const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`   - ${col.column_name}: ${col.data_type} ${nullable}${def}`);
    });
    
    console.log('\n✅ Ethiopian attendance table is now complete!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixEthiopianAttendanceComplete()
  .then(() => {
    console.log('\n✅ Complete fix successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  });
