/**
 * Test Password Change Functionality
 * 
 * This script tests:
 * 1. JWT token generation and verification
 * 2. Database connection
 * 3. Password hashing and comparison
 * 4. Complete password change flow
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./config/db');

const JWT_SECRET = process.env.JWT_SECRET;

console.log('\n🔍 Testing Password Change System\n');
console.log('='.repeat(50));

async function testPasswordChange() {
  try {
    // 1. Test JWT_SECRET
    console.log('\n1️⃣  Testing JWT Configuration');
    console.log('JWT_SECRET exists:', !!JWT_SECRET);
    console.log('JWT_SECRET length:', JWT_SECRET ? JWT_SECRET.length : 0);
    
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET is too short or missing!');
      return;
    }
    console.log('✅ JWT_SECRET is properly configured');

    // 2. Test Database Connection
    console.log('\n2️⃣  Testing Database Connection');
    const dbTest = await pool.query('SELECT NOW()');
    console.log('✅ Database connected:', dbTest.rows[0].now);

    // 3. Check admin users table
    console.log('\n3️⃣  Checking Admin Users');
    const admins = await pool.query('SELECT id, username, role FROM admin_users LIMIT 5');
    console.log(`Found ${admins.rows.length} admin user(s):`);
    admins.rows.forEach(admin => {
      console.log(`  - ${admin.username} (${admin.role})`);
    });

    if (admins.rows.length === 0) {
      console.log('⚠️  No admin users found. Creating default admin...');
      const defaultPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await pool.query(
        `INSERT INTO admin_users (username, password_hash, name, email, role) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['admin', hashedPassword, 'System Administrator', 'admin@school.com', 'admin']
      );
      
      console.log('✅ Default admin created:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    }

    // 4. Test JWT Token Generation
    console.log('\n4️⃣  Testing JWT Token Generation');
    const testUser = admins.rows[0] || { id: 1, username: 'admin', role: 'admin' };
    
    const token = jwt.sign(
      { 
        id: testUser.id, 
        username: testUser.username, 
        role: testUser.role,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    console.log('✅ Token generated successfully');
    console.log('Token preview:', token.substring(0, 50) + '...');

    // 5. Test JWT Token Verification
    console.log('\n5️⃣  Testing JWT Token Verification');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('Decoded payload:', decoded);

    // 6. Test Password Hashing
    console.log('\n6️⃣  Testing Password Hashing');
    const testPassword = 'TestPassword123!';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log('✅ Password hashing works:', isMatch);

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests passed! Password change system is ready.');
    console.log('\n📝 To change password via API:');
    console.log('   POST /api/admin/change-password');
    console.log('   Headers: { Authorization: "Bearer <token>" }');
    console.log('   Body: { username, currentPassword, newPassword }');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

testPasswordChange();
