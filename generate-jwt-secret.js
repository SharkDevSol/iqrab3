#!/usr/bin/env node

/**
 * Generate a secure JWT secret for production use
 * Run: node generate-jwt-secret.js
 */

const crypto = require('crypto');

// Generate a random 64-character hex string
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('\n========================================');
console.log('🔐 Secure JWT Secret Generated');
console.log('========================================\n');
console.log('Copy this to your backend/.env file:\n');
console.log(`JWT_SECRET="${jwtSecret}"\n`);
console.log('========================================\n');
console.log('⚠️  IMPORTANT:');
console.log('- Keep this secret safe');
console.log('- Never commit it to version control');
console.log('- Use different secrets for dev/prod');
console.log('- Changing this will invalidate all tokens\n');
