const pool = require('./config/db');

async function initializeTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Initializing attendance tables...');
    
    // Create shift_time_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS shift_time_settings (
        id SERIAL PRIMARY KEY,
        shift_name VARCHAR(20) NOT NULL UNIQUE CHECK (shift_name IN ('shift1', 'shift2')),
        check_in_time TIME NOT NULL DEFAULT '08:00',
        check_out_time TIME NOT NULL DEFAULT '17:00',
        late_threshold TIME NOT NULL DEFAULT '08:15',
        minimum_work_hours DECIMAL(4,2) NOT NULL DEFAULT 8.0,
        half_day_threshold DECIMAL(4,2) NOT NULL DEFAULT 4.0,
        grace_period_minutes INTEGER NOT NULL DEFAULT 15,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ shift_time_settings table created/verified');
    
    // Insert default shift times
    await client.query(`
      INSERT INTO shift_time_settings (shift_name, check_in_time, check_out_time, late_threshold)
      VALUES 
        ('shift1', '08:00', '17:00', '08:15'),
        ('shift2', '14:00', '22:00', '14:15')
      ON CONFLICT (shift_name) DO NOTHING
    `);
    console.log('✅ Default shift settings inserted');
    
    // Create hr_attendance_time_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS hr_attendance_time_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        standard_check_in TIME NOT NULL DEFAULT '08:00',
        late_threshold TIME NOT NULL DEFAULT '08:15',
        standard_check_out TIME NOT NULL DEFAULT '17:00',
        minimum_work_hours DECIMAL(4, 2) NOT NULL DEFAULT 8.0,
        half_day_threshold DECIMAL(4, 2) NOT NULL DEFAULT 4.0,
        grace_period_minutes INTEGER NOT NULL DEFAULT 15,
        max_checkout_hours DECIMAL(4, 2) DEFAULT 3.0,
        absent_threshold_time TIME DEFAULT '15:00',
        weekend_days INTEGER[] DEFAULT ARRAY[]::INTEGER[],
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ hr_attendance_time_settings table created/verified');
    
    // Insert default global settings if not exists
    const existingSettings = await client.query('SELECT id FROM hr_attendance_time_settings LIMIT 1');
    if (existingSettings.rows.length === 0) {
      await client.query(`
        INSERT INTO hr_attendance_time_settings 
        (standard_check_in, late_threshold, standard_check_out, minimum_work_hours, half_day_threshold, grace_period_minutes)
        VALUES ('08:00', '08:15', '17:00', 8.0, 4.0, 15)
      `);
      console.log('✅ Default global settings inserted');
    } else {
      console.log('✅ Global settings already exist');
    }
    
    console.log('✅ All tables initialized successfully!');
    
  } catch (error) {
    console.error('❌ Error initializing tables:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initializeTables()
  .then(() => {
    console.log('✅ Initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  });
