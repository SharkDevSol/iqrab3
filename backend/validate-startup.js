#!/usr/bin/env node

/**
 * Startup Validation Script
 * 
 * This script runs automatically before server starts to ensure
 * critical services (like AI06 WebSocket) are properly configured.
 * 
 * Add to package.json:
 * "scripts": {
 *   "prestart": "node validate-startup.js",
 *   "start": "node server.js"
 * }
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('\n🔍 Running Pre-Start Validation...\n');

let hasErrors = false;
let hasWarnings = false;

// Validation 1: AI06 WebSocket Service
console.log('1️⃣  AI06 WebSocket Service');
const AI06_ENABLED = process.env.AI06_WEBSOCKET_ENABLED !== 'false';

if (!AI06_ENABLED) {
  console.log('   ❌ CRITICAL: AI06 WebSocket Service is DISABLED');
  console.log('   → Fix: Set AI06_WEBSOCKET_ENABLED=true in .env');
  hasErrors = true;
} else {
  console.log('   ✅ Enabled');
  
  // Check if service file exists
  const servicePath = path.join(__dirname, 'services', 'ai06WebSocketService.js');
  if (!fs.existsSync(servicePath)) {
    console.log('   ❌ CRITICAL: ai06WebSocketService.js not found');
    hasErrors = true;
  }
  
  // Check if properly imported in server.js
  const serverPath = path.join(__dirname, 'server.js');
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (serverContent.includes('// const AI06WebSocketService') ||
      serverContent.includes('// ai06Service.start')) {
    console.log('   ❌ CRITICAL: AI06 service is commented out in server.js');
    console.log('   → Fix: Uncomment AI06 WebSocket Service code (line ~348)');
    hasErrors = true;
  }
}

// Validation 2: Database Configuration
console.log('\n2️⃣  Database Configuration');
if (!process.env.DATABASE_URL) {
  console.log('   ⚠️  WARNING: DATABASE_URL not set');
  hasWarnings = true;
} else {
  console.log('   ✅ Configured');
}

// Validation 3: Required Directories
console.log('\n3️⃣  Required Directories');
const requiredDirs = [
  'services',
  'routes',
  'config',
  'Uploads'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    console.log(`   ⚠️  WARNING: ${dir}/ directory not found`);
    hasWarnings = true;
  }
});

if (requiredDirs.every(dir => fs.existsSync(path.join(__dirname, dir)))) {
  console.log('   ✅ All present');
}

// Validation 4: Port Configuration
console.log('\n4️⃣  Port Configuration');
const AI06_PORT = process.env.AI06_WEBSOCKET_PORT || 7788;
const SERVER_PORT = process.env.PORT || 5000;

if (AI06_PORT === SERVER_PORT) {
  console.log('   ❌ CRITICAL: AI06 port conflicts with server port');
  hasErrors = true;
} else {
  console.log(`   ✅ Server: ${SERVER_PORT}, AI06: ${AI06_PORT}`);
}

// Print Summary
console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ VALIDATION FAILED - Cannot start server');
  console.log('\nCritical issues must be fixed before starting.');
  console.log('See errors above for details.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  VALIDATION PASSED WITH WARNINGS');
  console.log('\nServer can start, but some features may not work correctly.');
  console.log('Review warnings above.\n');
  process.exit(0);
} else {
  console.log('\n✅ VALIDATION PASSED');
  console.log('\nAll critical services are properly configured.');
  console.log('Server is ready to start.\n');
  process.exit(0);
}
