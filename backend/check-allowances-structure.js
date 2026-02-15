const pool = require('./config/db');

async function checkStructure() {
  try {
    console.log('🔍 Checking hr_allowances table structure...\n');
    
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'hr_allowances'
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Current columns:');
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Check if there's data
    const count = await pool.query(`SELECT COUNT(*) FROM hr_allowances`);
    console.log(`\n📊 Total records: ${count.rows[0].count}`);
    
    // Show sample data if exists
    if (parseInt(count.rows[0].count) > 0) {
      const sample = await pool.query(`SELECT * FROM hr_allowances LIMIT 3`);
      console.log('\n📝 Sample records:');
      sample.rows.forEach((row, i) => {
        console.log(`\nRecord ${i + 1}:`);
        Object.keys(row).forEach(key => {
          console.log(`  ${key}: ${row[key]}`);
        });
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkStructure();
