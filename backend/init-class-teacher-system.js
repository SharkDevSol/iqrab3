const pool = require('./config/db');

/**
 * Class Teacher Assignment System Initialization
 * This script ensures the class teacher system is properly set up in the database
 * and will persist across device changes and data migrations.
 */

async function initializeClassTeacherSystem() {
  const client = await pool.connect();
  
  try {
    console.log('🏫 Initializing Class Teacher Assignment System...\n');
    
    await client.query('BEGIN');
    
    // Step 1: Create schema if not exists
    console.log('1️⃣ Creating school_schema_points schema...');
    await client.query('CREATE SCHEMA IF NOT EXISTS school_schema_points');
    console.log('✅ Schema created/verified\n');
    
    // Step 2: Create class_teachers table
    console.log('2️⃣ Creating class_teachers table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS school_schema_points.class_teachers (
        id SERIAL PRIMARY KEY,
        global_staff_id INTEGER NOT NULL,
        teacher_name VARCHAR(100) NOT NULL,
        assigned_class VARCHAR(100) NOT NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(assigned_class)
      )
    `);
    console.log('✅ class_teachers table created/verified\n');
    
    // Step 3: Add indexes for performance
    console.log('3️⃣ Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_class_teachers_staff_id 
      ON school_schema_points.class_teachers(global_staff_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_class_teachers_class 
      ON school_schema_points.class_teachers(assigned_class)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_class_teachers_active 
      ON school_schema_points.class_teachers(is_active)
    `);
    console.log('✅ Indexes created\n');
    
    // Step 4: Add trigger for updated_at
    console.log('4️⃣ Creating update trigger...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_class_teacher_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_update_class_teacher_timestamp 
      ON school_schema_points.class_teachers
    `);
    
    await client.query(`
      CREATE TRIGGER trigger_update_class_teacher_timestamp
      BEFORE UPDATE ON school_schema_points.class_teachers
      FOR EACH ROW
      EXECUTE FUNCTION update_class_teacher_timestamp();
    `);
    console.log('✅ Update trigger created\n');
    
    // Step 5: Add comments for documentation
    console.log('5️⃣ Adding table documentation...');
    await client.query(`
      COMMENT ON TABLE school_schema_points.class_teachers IS 
      'Stores class teacher assignments - each class can have one assigned teacher who manages attendance and class activities'
    `);
    await client.query(`
      COMMENT ON COLUMN school_schema_points.class_teachers.global_staff_id IS 
      'References the teacher''s global staff ID from the teachers table'
    `);
    await client.query(`
      COMMENT ON COLUMN school_schema_points.class_teachers.assigned_class IS 
      'The class name this teacher is responsible for (must be unique)'
    `);
    await client.query(`
      COMMENT ON COLUMN school_schema_points.class_teachers.is_active IS 
      'Soft delete flag - false means the assignment has been removed'
    `);
    console.log('✅ Documentation added\n');
    
    // Step 6: Check current assignments
    console.log('6️⃣ Checking existing assignments...');
    const assignmentsResult = await client.query(`
      SELECT COUNT(*) as count FROM school_schema_points.class_teachers WHERE is_active = true
    `);
    const assignmentCount = parseInt(assignmentsResult.rows[0].count);
    console.log(`✅ Found ${assignmentCount} active class teacher assignment(s)\n`);
    
    // Step 7: Verify teachers table exists
    console.log('7️⃣ Verifying teachers table...');
    const teachersCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'school_schema_points' 
        AND table_name = 'teachers'
      )
    `);
    
    if (teachersCheck.rows[0].exists) {
      const teachersCount = await client.query(`
        SELECT COUNT(*) as count FROM school_schema_points.teachers WHERE role = 'Teacher'
      `);
      console.log(`✅ Teachers table exists with ${teachersCount.rows[0].count} teacher(s)\n`);
    } else {
      console.log('⚠️  Teachers table not found - will be created by Task 6\n');
    }
    
    // Step 8: Verify classes table exists
    console.log('8️⃣ Verifying classes table...');
    const classesCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'school_schema_points' 
        AND table_name = 'classes'
      )
    `);
    
    if (classesCheck.rows[0].exists) {
      const classesResult = await client.query(`
        SELECT class_names FROM school_schema_points.classes WHERE id = 1
      `);
      if (classesResult.rows.length > 0 && classesResult.rows[0].class_names) {
        console.log(`✅ Classes table exists with ${classesResult.rows[0].class_names.length} class(es)\n`);
      } else {
        console.log('⚠️  Classes table exists but no classes defined yet\n');
      }
    } else {
      console.log('⚠️  Classes table not found - will be created by Task 5\n');
    }
    
    await client.query('COMMIT');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ Class Teacher Assignment System Initialized Successfully!');
    console.log('═══════════════════════════════════════════════════════\n');
    
    console.log('📋 System Summary:');
    console.log(`   • Schema: school_schema_points`);
    console.log(`   • Table: class_teachers`);
    console.log(`   • Active Assignments: ${assignmentCount}`);
    console.log(`   • Indexes: 3 (staff_id, class, active)`);
    console.log(`   • Triggers: 1 (auto-update timestamp)`);
    console.log('');
    console.log('🔒 Data Persistence:');
    console.log('   ✅ Survives device changes');
    console.log('   ✅ Survives database restarts');
    console.log('   ✅ Soft delete (data never lost)');
    console.log('   ✅ Indexed for fast queries');
    console.log('   ✅ Auto-timestamps on updates');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Ensure Task 5 (Classes) is completed');
    console.log('   2. Ensure Task 6 (Teachers) is completed');
    console.log('   3. Access Class Teacher Assignment page');
    console.log('   4. Assign teachers to classes');
    console.log('');
    console.log('📍 API Endpoints Available:');
    console.log('   GET    /api/class-teacher/teachers');
    console.log('   GET    /api/class-teacher/classes');
    console.log('   GET    /api/class-teacher/assignments');
    console.log('   POST   /api/class-teacher/assign');
    console.log('   DELETE /api/class-teacher/unassign/:className');
    console.log('   GET    /api/class-teacher/check/:globalStaffId');
    console.log('');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing Class Teacher system:', error);
    console.error('Details:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run initialization
initializeClassTeacherSystem()
  .then(() => {
    console.log('✅ Initialization complete - system ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  });
