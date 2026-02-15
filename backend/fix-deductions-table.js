const pool = require('./config/db');

async function fixDeductionsTable() {
  try {
    console.log('🔧 Fixing hr_deductions table...');
    
    // Check if deduction_type column exists
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'hr_deductions' 
        AND column_name = 'deduction_type'
    `);
    
    if (checkColumn.rows.length === 0) {
      console.log('➕ Adding deduction_type column...');
      await pool.query(`
        ALTER TABLE hr_deductions 
        ADD COLUMN IF NOT EXISTS deduction_type VARCHAR(100)
      `);
      console.log('✅ deduction_type column added');
    } else {
      console.log('✅ deduction_type column already exists');
    }
    
    // Show current table structure
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'hr_deductions'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Current hr_deductions table structure:');
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

fixDeductionsTable();
