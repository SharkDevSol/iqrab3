const pool = require('./config/db');

async function checkSchema() {
  try {
    console.log('Checking database schema...\n');
    
    // Check sync_locks table
    const syncLocksSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'sync_locks'
      ORDER BY ordinal_position
    `);
    
    console.log('sync_locks table columns:');
    syncLocksSchema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Check device_user_buffer table
    const bufferSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'device_user_buffer'
      ORDER BY ordinal_position
    `);
    
    console.log('\ndevice_user_buffer table columns:');
    bufferSchema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
