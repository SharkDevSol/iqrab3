/**
 * AI06 Device Simulator
 * This script simulates an AI06 biometric device connecting to the server
 * Use this to test the integration before connecting the real device
 */

const WebSocket = require('ws');

// Configuration
const SERVER_URL = 'ws://localhost:7788';
const DEVICE_SN = 'TEST-AI06-001'; // Simulated device serial number

console.log('🤖 AI06 Device Simulator Starting...\n');

// Connect to server
const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('✅ Connected to server');
  
  // Send device registration
  setTimeout(() => {
    console.log('\n📤 Sending device registration...');
    const regMessage = {
      cmd: 'reg',
      sn: DEVICE_SN,
      devinfo: {
        modelname: 'AI06-TEST',
        usersize: 3000,
        fpsize: 3000,
        cardsize: 3000,
        pwdsize: 3000,
        logsize: 100000,
        useduser: 10,
        usedfp: 15,
        usedcard: 5,
        usedpwd: 8,
        usedlog: 50,
        usednewlog: 5,
        fpalgo: 'v10',
        firmware: '1.0.0',
        time: new Date().toISOString()
      }
    };
    ws.send(JSON.stringify(regMessage));
  }, 1000);
  
  // Simulate attendance log after 3 seconds
  setTimeout(() => {
    console.log('\n📤 Simulating fingerprint scan...');
    const attendanceLog = {
      cmd: 'sendlog',
      count: '1',
      logindex: '1',
      record: [
        {
          enrollid: 1, // Student/Staff ID (must exist in your database)
          time: new Date().toISOString(),
          mode: 0, // 0=fingerprint, 1=password, 2=card
          inout: 0, // 0=check-in, 1=check-out
          event: 0 // 0=normal
        }
      ]
    };
    ws.send(JSON.stringify(attendanceLog));
  }, 3000);
  
  // Simulate another scan with different user after 6 seconds
  setTimeout(() => {
    console.log('\n📤 Simulating another fingerprint scan...');
    const attendanceLog = {
      cmd: 'sendlog',
      count: '1',
      logindex: '2',
      record: [
        {
          enrollid: 2, // Different student
          time: new Date().toISOString(),
          mode: 0,
          inout: 0,
          event: 0
        }
      ]
    };
    ws.send(JSON.stringify(attendanceLog));
  }, 6000);
});

ws.on('message', (data) => {
  console.log('\n📥 Received from server:');
  try {
    const message = JSON.parse(data.toString());
    console.log(JSON.stringify(message, null, 2));
    
    // If we received a voice command, show it prominently
    if (message.voice) {
      console.log('\n🔊 VOICE MESSAGE TO PLAY:');
      console.log(`   "${message.voice}"`);
    }
  } catch (error) {
    console.log(data.toString());
  }
});

ws.on('close', () => {
  console.log('\n❌ Disconnected from server');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('\n❌ WebSocket error:', error.message);
  console.log('\n💡 Make sure the backend server is running:');
  console.log('   cd backend && npm start');
  process.exit(1);
});

// Keep the script running
console.log('📡 Connecting to server...');
console.log(`   Server: ${SERVER_URL}`);
console.log(`   Device SN: ${DEVICE_SN}\n`);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down simulator...');
  ws.close();
});
