/**
 * Quick Fix for JWT Token Issues
 * 
 * This script will:
 * 1. Verify JWT_SECRET is properly configured
 * 2. Test database connection
 * 3. List all admin users
 * 4. Generate a fresh token for immediate testing
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('./config/db');
const readline = require('readline');

const JWT_SECRET = process.env.JWT_SECRET;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function quickFix() {
  console.log('\n🔧 JWT Quick Fix Tool\n');
  console.log('='.repeat(70));

  try {
    // 1. Check JWT_SECRET
    console.log('\n1️⃣  Checking JWT_SECRET...');
    if (!JWT_SECRET || JWT_SECRET.length < 32) {
      console.error('❌ JWT_SECRET is missing or too short!');
      console.error('   Current length:', JWT_SECRET ? JWT_SECRET.length : 0);
      console.error('\n   Fix: Add this to your backend/.env file:');
      const newSecret = require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
      console.error(`   JWT_SECRET="${newSecret}"`);
      process.exit(1);
    }
    console.log('✅ JWT_SECRET is configured (length:', JWT_SECRET.length, ')');

    // 2. Test database
    console.log('\n2️⃣  Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');

    // 3. List admin users
    console.log('\n3️⃣  Finding admin users...');
    const result = await pool.query(
      'SELECT id, username, name, email, role, created_at FROM admin_users ORDER BY created_at'
    );

    if (result.rows.length === 0) {
      console.log('⚠️  No admin users found!');
      const createAdmin = await question('\nWould you like to create a default admin? (yes/no): ');
      
      if (createAdmin.toLowerCase() === 'yes' || createAdmin.toLowerCase() === 'y') {
        const username = await question('Enter username (default: admin): ') || 'admin';
        const password = await question('Enter password (default: admin123): ') || 'admin123';
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const insertResult = await pool.query(
          `INSERT INTO admin_users (username, password_hash, name, email, role) 
           VALUES ($1, $2, $3, $4, $5) RETURNING id, username`,
          [username, hashedPassword, 'System Administrator', 'admin@school.com', 'admin']
        );
        
        console.log('\n✅ Admin user created successfully!');
        console.log('   Username:', username);
        console.log('   Password:', password);
        console.log('   ID:', insertResult.rows[0].id);
        
        result.rows.push(insertResult.rows[0]);
      } else {
        console.log('\n❌ Cannot proceed without admin users');
        process.exit(1);
      }
    } else {
      console.log(`\n✅ Found ${result.rows.length} admin user(s):\n`);
      result.rows.forEach((admin, index) => {
        console.log(`   ${index + 1}. ${admin.username} (${admin.role})`);
        console.log(`      Name: ${admin.name}`);
        console.log(`      Email: ${admin.email}`);
        console.log(`      Created: ${admin.created_at}`);
        console.log('');
      });
    }

    // 4. Generate token
    console.log('4️⃣  Generating fresh JWT token...\n');
    
    let selectedAdmin;
    if (result.rows.length === 1) {
      selectedAdmin = result.rows[0];
      console.log(`Using admin: ${selectedAdmin.username}`);
    } else {
      const choice = await question(`Select admin (1-${result.rows.length}): `);
      const index = parseInt(choice) - 1;
      if (index >= 0 && index < result.rows.length) {
        selectedAdmin = result.rows[index];
      } else {
        console.error('Invalid selection');
        process.exit(1);
      }
    }

    const token = jwt.sign(
      { 
        id: selectedAdmin.id, 
        username: selectedAdmin.username, 
        role: selectedAdmin.role,
        userType: 'admin'
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('\n' + '='.repeat(70));
    console.log('\n✅ SUCCESS! Your fresh JWT token:\n');
    console.log(token);
    console.log('\n' + '='.repeat(70));
    
    console.log('\n📋 How to use this token:\n');
    console.log('1. CLEAR YOUR BROWSER STORAGE:');
    console.log('   - Open DevTools (F12)');
    console.log('   - Go to Application > Local Storage');
    console.log('   - Delete: authToken, adminUser, isLoggedIn, userType');
    console.log('   - OR just logout and login again\n');
    
    console.log('2. FOR API TESTING (Postman/Insomnia):');
    console.log('   Header: Authorization: Bearer <paste-token-above>');
    console.log('   POST http://localhost:5000/api/admin/change-password');
    console.log('   Body: {');
    console.log(`     "username": "${selectedAdmin.username}",`);
    console.log('     "currentPassword": "your-current-password",');
    console.log('     "newPassword": "your-new-password"');
    console.log('   }\n');
    
    console.log('3. FOR PRODUCTION/VPS:');
    console.log('   - Ensure JWT_SECRET in .env matches this one');
    console.log('   - Restart your backend server');
    console.log('   - Clear browser storage and re-login');
    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack trace:', error.stack);
  } finally {
    rl.close();
    await pool.end();
  }
}

quickFix();
