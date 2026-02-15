const pool = require('./config/db');

async function fixAllowancesTable() {
  try {
    console.log('🔧 Fixing hr_allowances table...');
    
    // Check if allowance_type column exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'hr_allowances' 
        AND column_name = 'allowance_type'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('➕ Adding allowance_type column...');
      await pool.query(`
        ALTER TABLE hr_allowances 
        ADD COLUMN IF NOT EXISTS allowance_type VARCHAR(100)
      `);
      console.log('✅ allowance_type column added');
    } else {
      console.log('✅ allowance_type column already exists');
    }
    
    // Show current table structure
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'hr_allowances'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current hr_allowances table structure:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    console.log('\n✅ Table fix complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing table:', error);
    process.exit(1);
  }
}

fixAllowancesTable();
