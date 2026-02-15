/**
 * Simple AI06 Connection Test
 * Tests basic connection between AI06 device and server
 */

const WebSocket = require('ws');

const SERVER_URL = 'ws://localhost:7788';
const DEVICE_SN = 'TEST-AI06-001';

console.log('🔌 AI06 Simple Connection Test\n');
console.log('Connecting to:', SERVER_URL);
console.log('Device SN:', DEVICE_SN);
console.log('─────────────────────────────────\n');

const ws = new WebSocket(SERVER_URL);

ws.on('open', () => {
  console.log('✅ CONNECTED to server!\n');
  
  // Step 1: Register device
  setTimeout(() => {
    console.log('📤 Step 1: Sending device registration...');
    const regMessage = {
      cmd: 'reg',
      sn: DEVICE_SN,
      devinfo: {
        modelname: 'AI06',
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
  }, 500);
  
  // Step 2: Send attendance log
  setTimeout(() => {
    console.log('\n📤 Step 2: Sending attendance log (simulating fingerprint scan)...');
    const attendanceLog = {
      cmd: 'sendlog',
      count: '1',
      logindex: '1',
      record: [
        {
          enrollid: 1,
          time: new Date().toISOString(),
          mode: 0, // fingerprint
          inout: 0, // check-in
          event: 0
        }
      ]
    };
    ws.send(JSON.stringify(attendanceLog));
  }, 2000);
  
  // Close after 5 seconds
  setTimeout(() => {
    console.log('\n✅ Test completed successfully!');
    console.log('─────────────────────────────────');
    console.log('Connection Status: WORKING ✓');
    ws.close();
  }, 4000);
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  
  if (message.ret === 'reg') {
    console.log('✅ Registration successful!');
    console.log('   Server time:', message.cloudtime);
  }
  
  if (message.ret === 'sendlog') {
    console.log('✅ Attendance log acknowledged!');
    console.log('   Message:', message.message);
  }
});

ws.on('close', () => {
  console.log('\n👋 Disconnected from server');
  process.exit(0);
});

ws.on('error', (error) => {
  console.error('\n❌ CONNECTION FAILED!');
  console.error('Error:', error.message);
  console.log('\n💡 Troubleshooting:');
  console.log('   1. Make sure backend server is running: npm start');
  console.log('   2. Check if port 7788 is available');
  console.log('   3. Look for "AI06 WebSocket Server Ready" in backend logs');
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Test interrupted');
  ws.close();
});
