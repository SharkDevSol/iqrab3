#!/usr/bin/env node

/**
 * AI06 WebSocket Service Health Check
 * 
 * This script verifies that the AI06 WebSocket service is properly configured
 * and will start correctly. Run this before starting the server to catch issues early.
 * 
 * Usage: node check-ai06-service.js
 */

require('dotenv').config();
const net = require('net');

console.log('\n🔍 AI06 WebSocket Service Health Check\n');
console.log('=' .repeat(60));

// Check 1: Environment Configuration
console.log('\n1️⃣  Checking Environment Configuration...');
const AI06_ENABLED = process.env.AI06_WEBSOCKET_ENABLED !== 'false';
const AI06_PORT = process.env.AI06_WEBSOCKET_PORT || 7788;
const AI06_DEVICE_IP = process.env.AI06_DEVICE_IP;
const AI06_DEVICE_PORT = process.env.AI06_DEVICE_PORT || 80;

console.log(`   AI06_WEBSOCKET_ENABLED: ${AI06_ENABLED ? '✅ true' : '❌ false'}`);
console.log(`   AI06_WEBSOCKET_PORT: ${AI06_PORT}`);
console.log(`   AI06_DEVICE_IP: ${AI06_DEVICE_IP || '⚠️  Not set'}`);
console.log(`   AI06_DEVICE_PORT: ${AI06_DEVICE_PORT}`);

if (!AI06_ENABLED) {
  console.log('\n❌ CRITICAL ERROR: AI06 WebSocket Service is DISABLED!');
  console.log('   Fix: Set AI06_WEBSOCKET_ENABLED=true in backend/.env');
  process.exit(1);
}

// Check 2: Port Availability
console.log('\n2️⃣  Checking Port Availability...');
const server = net.createServer();

server.once('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`   ⚠️  Port ${AI06_PORT} is already in use`);
    console.log('   This is OK if your server is already running');
    console.log('   Otherwise, check for conflicting processes:');
    console.log(`   Windows: netstat -ano | findstr :${AI06_PORT}`);
    console.log(`   Linux/Mac: lsof -i :${AI06_PORT}`);
  } else {
    console.log(`   ❌ Port check failed: ${err.message}`);
  }
  server.close();
  checkServiceFile();
});

server.once('listening', () => {
  console.log(`   ✅ Port ${AI06_PORT} is available`);
  server.close();
  checkServiceFile();
});

server.listen(AI06_PORT);

// Check 3: Service File Exists
function checkServiceFile() {
  console.log('\n3️⃣  Checking Service File...');
  const fs = require('fs');
  const path = require('path');
  
  const servicePath = path.join(__dirname, 'services', 'ai06WebSocketService.js');
  
  if (fs.existsSync(servicePath)) {
    console.log('   ✅ ai06WebSocketService.js found');
    
    // Check if service is properly imported in server.js
    const serverPath = path.join(__dirname, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes('AI06WebSocketService') && 
        !serverContent.includes('// const AI06WebSocketService')) {
      console.log('   ✅ Service is imported in server.js');
    } else {
      console.log('   ❌ Service is NOT properly imported in server.js');
      console.log('   Check backend/server.js around line 348');
    }
  } else {
    console.log('   ❌ ai06WebSocketService.js NOT FOUND');
    console.log(`   Expected location: ${servicePath}`);
  }
  
  printSummary();
}

// Print Summary
function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('\n📋 Summary\n');
  
  if (AI06_ENABLED) {
    console.log('✅ AI06 WebSocket Service is ENABLED');
    console.log(`✅ Will listen on port ${AI06_PORT}`);
    console.log('\n🚀 Ready to start server!');
    console.log('\nNext steps:');
    console.log('   1. Start server: node server.js');
    console.log('   2. Check connection status in dashboard');
    console.log('   3. Configure AI06 device with:');
    console.log(`      - Server IP: YOUR_LOCAL_IP`);
    console.log(`      - Server Port: ${AI06_PORT}`);
    console.log('      - Protocol: WebSocket');
  } else {
    console.log('❌ AI06 WebSocket Service is DISABLED');
    console.log('\n⚠️  Devices will NOT be able to connect!');
    console.log('\nFix:');
    console.log('   1. Open backend/.env');
    console.log('   2. Set AI06_WEBSOCKET_ENABLED=true');
    console.log('   3. Run this check again');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}
