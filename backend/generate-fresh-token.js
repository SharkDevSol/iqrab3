/**
 * Generate Fresh JWT Token for Testing
 * 
 * This script generates a valid JWT token using the current JWT_SECRET
 * Use this token to test the password change endpoint
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const pool = require('./config/db');

const JWT_SECRET = process.env.JWT_SECRET;

async function generateToken() {
  try {
    console.log('\n🔑 Generating Fresh JWT Token\n');
    console.log('='.repeat(60));

    // Check JWT_SECRET
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET is not properly configured!');
      console.error('Please check your backend/.env file');
      process.exit(1);
    }

    // Get first admin user
    const result = await pool.query(
      'SELECT id, username, role FROM admin_users LIMIT 1'
    );

    if (result.rows.length === 0) {
      console.error('❌ No admin users found in database!');
      console.error('Please create an admin user first');
      process.exit(1);
    }

    const admin = result.rows[0];
    
    // Generate token
    const token = jwt.sign(
      { 
        id: admin.id, 
        username: admin.username, 
        role: admin.role,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('\n✅ Token generated successfully!\n');
    console.log('User Details:');
    console.log(`  ID: ${admin.id}`);
    console.log(`  Username: ${admin.username}`);
    console.log(`  Role: ${admin.role}`);
    console.log('\n' + '-'.repeat(60));
    console.log('\n🎫 Your JWT Token:\n');
    console.log(token);
    console.log('\n' + '-'.repeat(60));
    console.log('\n📋 How to use:');
    console.log('1. Copy the token above');
    console.log('2. In your API client (Postman/Insomnia), add header:');
    console.log('   Authorization: Bearer <paste-token-here>');
    console.log('\n3. Test password change:');
    console.log('   POST http://localhost:5000/api/admin/change-password');
    console.log('   Body: {');
    console.log(`     "username": "${admin.username}",`);
    console.log('     "currentPassword": "your-current-password",');
    console.log('     "newPassword": "your-new-password"');
    console.log('   }');
    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

generateToken();
