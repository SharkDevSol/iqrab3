/**
 * Environment Validation Script
 * 
 * Run this before starting the server to ensure all required
 * environment variables are properly configured
 */

require('dotenv').config();
const crypto = require('crypto');

console.log('\n🔍 Validating Environment Configuration\n');
console.log('='.repeat(70));

let hasErrors = false;
let hasWarnings = false;

// 1. Check JWT_SECRET
console.log('\n1️⃣  JWT Configuration');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set!');
  console.error('   Add this to backend/.env:');
  const newSecret = crypto.randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  console.error(`   JWT_SECRET="${newSecret}"`);
  hasErrors = true;
} else if (JWT_SECRET.length < 32) {
  console.error('❌ JWT_SECRET is too short (minimum 32 characters)');
  console.error('   Current length:', JWT_SECRET.length);
  const newSecret = crypto.randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  console.error(`   Use this: JWT_SECRET="${newSecret}"`);
  hasErrors = true;
} else {
  console.log('✅ JWT_SECRET is configured');
  console.log('   Length:', JWT_SECRET.length, 'characters');
  
  // Check for weak secrets
  const weakSecrets = ['secret', 'password', 'admin', '12345', 'test'];
  const lowerSecret = JWT_SECRET.toLowerCase();
  
  for (const weak of weakSecrets) {
    if (lowerSecret.includes(weak)) {
      console.warn('⚠️  WARNING: JWT_SECRET contains common word "' + weak + '"');
      hasWarnings = true;
    }
  }
}

// 2. Check Database Configuration
console.log('\n2️⃣  Database Configuration');
const requiredDbVars = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'];
let dbConfigured = true;

for (const varName of requiredDbVars) {
  if (!process.env[varName]) {
    console.error(`❌ ${varName} is not set`);
    dbConfigured = false;
    hasErrors = true;
  }
}

if (dbConfigured) {
  console.log('✅ Database configuration complete');
  console.log('   Host:', process.env.DB_HOST);
  console.log('   Port:', process.env.DB_PORT);
  console.log('   Database:', process.env.DB_NAME);
  console.log('   User:', process.env.DB_USER);
}

// 3. Check JWT Expiration
console.log('\n3️⃣  JWT Expiration');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
console.log('✅ JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

// 4. Check Node Environment
console.log('\n4️⃣  Node Environment');
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log('   NODE_ENV:', NODE_ENV);

if (NODE_ENV === 'production') {
  console.log('✅ Production mode');
  
  // Additional production checks
  if (JWT_SECRET.length < 48) {
    console.warn('⚠️  WARNING: For production, JWT_SECRET should be at least 48 characters');
    hasWarnings = true;
  }
  
  if (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1') {
    console.log('   Database is on localhost (this is fine for single-server setup)');
  }
} else {
  console.log('   Development mode');
}

// 5. Security Recommendations
console.log('\n5️⃣  Security Recommendations');

if (NODE_ENV === 'production') {
  const recommendations = [];
  
  if (!process.env.HTTPS_ENABLED || process.env.HTTPS_ENABLED !== 'true') {
    recommendations.push('Enable HTTPS (HTTPS_ENABLED=true)');
  }
  
  if (recommendations.length > 0) {
    console.log('⚠️  Consider these for production:');
    recommendations.forEach(rec => console.log('   -', rec));
    hasWarnings = true;
  } else {
    console.log('✅ Security settings look good');
  }
} else {
  console.log('   (Security checks apply to production only)');
}

// Summary
console.log('\n' + '='.repeat(70));

if (hasErrors) {
  console.error('\n❌ VALIDATION FAILED - Fix the errors above before starting the server\n');
  process.exit(1);
} else if (hasWarnings) {
  console.warn('\n⚠️  VALIDATION PASSED WITH WARNINGS - Review warnings above\n');
  console.log('Press Ctrl+C to abort, or the server will start in 3 seconds...');
  setTimeout(() => {
    console.log('✅ Starting server...\n');
    process.exit(0);
  }, 3000);
} else {
  console.log('\n✅ ALL CHECKS PASSED - Environment is properly configured\n');
  process.exit(0);
}
