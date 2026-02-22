const pool = require('./config/db');

async function verifyTable() {
  try {
    console.log('🔍 Verifying Ethiopian Attendance Table...\n');
    
    // Check if table exists
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'hr_ethiopian_attendance'
      )
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('❌ Table does not exist!');
      console.log('Run: node reset-ethiopian-attendance-table.js\n');
      process.exit(1);
    }
    
    console.log('✅ Table exists\n');
    
    // Get all columns
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'hr_ethiopian_attendance'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Table Columns:');
    const requiredColumns = [
      'id', 'staff_id', 'staff_name', 'ethiopian_year', 'ethiopian_month', 
      'ethiopian_day', 'check_in', 'check_out', 'working_hours', 'status', 
      'shift_type', 'notes', 'created_at', 'updated_at'
    ];
    
    const existingColumns = columns.rows.map(c => c.column_name);
    
    requiredColumns.forEach(col => {
      if (existingColumns.includes(col)) {
        const colInfo = columns.rows.find(c => c.column_name === col);
        console.log(`   ✅ ${col} (${colInfo.data_type})`);
      } else {
        console.log(`   ❌ ${col} - MISSING!`);
      }
    });
    
    // Check constraints
    console.log('\n📋 Constraints:');
    const constraints = await pool.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_schema = 'public'
      AND table_name = 'hr_ethiopian_attendance'
    `);
    
    constraints.rows.forEach(c => {
      console.log(`   ✅ ${c.constraint_name} (${c.constraint_type})`);
    });
    
    // Check indexes
    console.log('\n📋 Indexes:');
    const indexes = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename = 'hr_ethiopian_attendance'
    `);
    
    indexes.rows.forEach(i => {
      console.log(`   ✅ ${i.indexname}`);
    });
    
    // Count records
    const count = await pool.query('SELECT COUNT(*) FROM hr_ethiopian_attendance');
    console.log(`\n📊 Total Records: ${count.rows[0].count}`);
    
    console.log('\n✅ Table verification complete!');
    console.log('The table is ready to use.\n');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyTable();
