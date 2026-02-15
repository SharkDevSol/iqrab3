const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function addColumns() {
  try {
    console.log('🔧 Adding auto-marker columns...');

    // Add columns
    await pool.query(`
      ALTER TABLE hr_attendance_time_settings
      ADD COLUMN IF NOT EXISTS max_checkout_hours DECIMAL(4,2) DEFAULT 3.0,
      ADD COLUMN IF NOT EXISTS absent_threshold_time TIME DEFAULT '15:00'
    `);

    console.log('✅ Columns added successfully!');

    // Verify
    const result = await pool.query(`
      SELECT 
        late_threshold,
        half_day_threshold,
        max_checkout_hours,
        absent_threshold_time
      FROM hr_attendance_time_settings
      LIMIT 1
    `);

    if (result.rows.length > 0) {
      console.log('\n📊 Current settings:');
      console.log('  Late Threshold:', result.rows[0].late_threshold);
      console.log('  Half Day Threshold:', result.rows[0].half_day_threshold);
      console.log('  Max Checkout Hours:', result.rows[0].max_checkout_hours);
      console.log('  Absent Threshold Time:', result.rows[0].absent_threshold_time);
    } else {
      console.log('\n⚠️ No settings found. Creating default settings...');
      await pool.query(`
        INSERT INTO hr_attendance_time_settings 
        (late_threshold, half_day_threshold, max_checkout_hours, absent_threshold_time)
        VALUES ('08:15', 4.0, 3.0, '15:00')
      `);
      console.log('✅ Default settings created!');
    }

    console.log('\n🎉 Setup complete! Now restart the backend server.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

addColumns();
