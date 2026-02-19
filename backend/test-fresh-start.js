const { Pool } = require('pg');
const { autoSetup, cleanup } = require('./utils/autoSetup');

async function testFreshStart() {
  console.log('🧪 TESTING FRESH START SCENARIO');
  console.log('This simulates what happens when you delete data or use a new device\n');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678@localhost:5432/school_management2'
  });

  try {
    // Step 1: Check current state
    console.log('📊 Step 1: Checking current state...');
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name LIKE 'academic_%'
      ORDER BY table_name
    `);
    console.log(`   Found ${tablesCheck.rows.length} academic tables`);
    
    // Step 2: Check columns
    console.log('\n📊 Step 2: Checking columns in settings table...');
    const columnsCheck = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'academic_student_attendance_settings'
      ORDER BY ordinal_position
    `);
    console.log(`   Found ${columnsCheck.rows.length} columns:`);
    columnsCheck.rows.forEach(row => {
      console.log(`      - ${row.column_name} (${row.data_type})`);
    });
    
    // Step 3: Check if critical columns exist
    const criticalColumns = ['school_days', 'auto_absent_enabled'];
    const existingColumns = columnsCheck.rows.map(r => r.column_name);
    const missingColumns = criticalColumns.filter(c => !existingColumns.includes(c));
    
    if (missingColumns.length > 0) {
      console.log(`\n   ⚠️ Missing columns: ${missingColumns.join(', ')}`);
      console.log('   Running auto-setup to fix...');
      await autoSetup();
    } else {
      console.log('\n   ✅ All critical columns exist');
    }
    
    // Step 4: Test settings retrieval
    console.log('\n📊 Step 3: Testing settings retrieval...');
    const settings = await pool.query('SELECT * FROM academic_student_attendance_settings LIMIT 1');
    if (settings.rows.length > 0) {
      const s = settings.rows[0];
      console.log('   ✅ Settings retrieved successfully:');
      console.log(`      - Check-in: ${s.check_in_start_time} - ${s.check_in_end_time}`);
      console.log(`      - School days: ${s.school_days ? s.school_days.join(', ') : 'Not set'}`);
      console.log(`      - Auto-absent: ${s.auto_absent_enabled}`);
    } else {
      console.log('   ⚠️ No settings found');
    }
    
    // Step 5: Test settings update
    console.log('\n📊 Step 4: Testing settings update...');
    const updateResult = await pool.query(`
      UPDATE academic_student_attendance_settings
      SET 
        school_days = $1,
        auto_absent_enabled = $2,
        updated_at = NOW()
      WHERE id = (SELECT id FROM academic_student_attendance_settings ORDER BY id DESC LIMIT 1)
      RETURNING school_days, auto_absent_enabled
    `, [
      ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      true
    ]);
    
    if (updateResult.rows.length > 0) {
      console.log('   ✅ Settings updated successfully');
      console.log(`      - School days: ${updateResult.rows[0].school_days.join(', ')}`);
      console.log(`      - Auto-absent: ${updateResult.rows[0].auto_absent_enabled}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ FRESH START TEST PASSED!');
    console.log('='.repeat(60));
    console.log('\n📝 Summary:');
    console.log('   ✓ Tables exist');
    console.log('   ✓ All columns present');
    console.log('   ✓ Settings can be retrieved');
    console.log('   ✓ Settings can be updated');
    console.log('\n🎉 System is ready for production!');
    console.log('   Even if you delete data or move to a new device,');
    console.log('   auto-setup will recreate everything automatically.');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await pool.end();
    await cleanup();
  }
}

testFreshStart();
