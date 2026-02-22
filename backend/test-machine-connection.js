// Test Machine Connection - Comprehensive Check
const WebSocket = require('ws');
const net = require('net');

console.log('🔍 ATTENDANCE MACHINE CONNECTION CHECKER\n');
console.log('=' .repeat(60));

// Configuration
const MACHINE_IP = '192.168.1.2';
const WEBSOCKET_PORT = 7788;
const TCP_PORT = 4370;

// Test 1: Check if machine is reachable (ping-like)
async function testTCPConnection() {
  console.log('\n📡 Test 1: TCP Connection Test');
  console.log(`   Trying to connect to ${MACHINE_IP}:${TCP_PORT}...`);
  
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      console.log('   ❌ TCP Connection: TIMEOUT (5 seconds)');
      console.log('   → Machine might be offline or IP is wrong');
      resolve(false);
    }, 5000);

    socket.connect(TCP_PORT, MACHINE_IP, () => {
      clearTimeout(timeout);
      console.log('   ✅ TCP Connection: SUCCESS');
      console.log(`   → Machine is reachable at ${MACHINE_IP}:${TCP_PORT}`);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', (err) => {
      clearTimeout(timeout);
      console.log('   ❌ TCP Connection: FAILED');
      console.log(`   → Error: ${err.message}`);
      resolve(false);
    });
  });
}

// Test 2: Check WebSocket connection
async function testWebSocketConnection() {
  console.log('\n🔌 Test 2: WebSocket Connection Test');
  console.log(`   Connecting to ws://${MACHINE_IP}:${WEBSOCKET_PORT}...`);
  
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://${MACHINE_IP}:${WEBSOCKET_PORT}`);
    
    const timeout = setTimeout(() => {
      ws.close();
      console.log('   ❌ WebSocket Connection: TIMEOUT (10 seconds)');
      console.log('   → WebSocket port might be closed or wrong');
      resolve(false);
    }, 10000);

    ws.on('open', () => {
      clearTimeout(timeout);
      console.log('   ✅ WebSocket Connection: SUCCESS');
      console.log(`   → Connected to ws://${MACHINE_IP}:${WEBSOCKET_PORT}`);
      
      // Try to send a ping
      try {
        ws.send(JSON.stringify({ cmd: 'ping' }));
        console.log('   📤 Sent ping command to machine');
      } catch (err) {
        console.log('   ⚠️  Could not send ping:', err.message);
      }
      
      setTimeout(() => {
        ws.close();
        resolve(true);
      }, 2000);
    });

    ws.on('message', (data) => {
      console.log('   📥 Received message from machine:');
      try {
        const parsed = JSON.parse(data);
        console.log('   ', JSON.stringify(parsed, null, 2));
      } catch {
        console.log('   ', data.toString());
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      console.log('   ❌ WebSocket Connection: FAILED');
      console.log(`   → Error: ${err.message}`);
      resolve(false);
    });

    ws.on('close', () => {
      console.log('   🔌 WebSocket connection closed');
    });
  });
}

// Test 3: Check if service is running
async function checkServiceStatus() {
  console.log('\n⚙️  Test 3: Service Status Check');
  
  try {
    const AI06Service = require('./services/ai06WebSocketService');
    const service = AI06Service.getInstance();
    
    if (service.isConnected) {
      console.log('   ✅ AI06 Service: CONNECTED');
      console.log(`   → Service is actively connected to the machine`);
      return true;
    } else {
      console.log('   ⚠️  AI06 Service: NOT CONNECTED');
      console.log('   → Service exists but not connected to machine');
      return false;
    }
  } catch (err) {
    console.log('   ❌ AI06 Service: ERROR');
    console.log(`   → Error: ${err.message}`);
    return false;
  }
}

// Test 4: Network diagnostics
async function networkDiagnostics() {
  console.log('\n🌐 Test 4: Network Diagnostics');
  
  const os = require('os');
  const interfaces = os.networkInterfaces();
  
  console.log('   Your computer\'s network interfaces:');
  for (const [name, addrs] of Object.entries(interfaces)) {
    for (const addr of addrs) {
      if (addr.family === 'IPv4' && !addr.internal) {
        console.log(`   → ${name}: ${addr.address}`);
      }
    }
  }
  
  console.log(`\n   Machine IP: ${MACHINE_IP}`);
  console.log('   ℹ️  Make sure your computer and machine are on the same network');
}

// Main test runner
async function runAllTests() {
  console.log('\n🚀 Starting connection tests...\n');
  
  const tcpResult = await testTCPConnection();
  const wsResult = await testWebSocketConnection();
  const serviceResult = await checkServiceStatus();
  await networkDiagnostics();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`TCP Connection:       ${tcpResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`WebSocket Connection: ${wsResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Service Status:       ${serviceResult ? '✅ CONNECTED' : '⚠️  NOT CONNECTED'}`);
  
  console.log('\n💡 RECOMMENDATIONS:');
  
  if (!tcpResult && !wsResult) {
    console.log('❌ Machine is not reachable');
    console.log('   1. Check if machine is powered on');
    console.log('   2. Verify IP address is correct (current: ' + MACHINE_IP + ')');
    console.log('   3. Make sure machine and server are on same network');
    console.log('   4. Check firewall settings');
  } else if (tcpResult && !wsResult) {
    console.log('⚠️  Machine is reachable but WebSocket connection failed');
    console.log('   1. Check if WebSocket port 7788 is correct');
    console.log('   2. Verify machine WebSocket service is enabled');
    console.log('   3. Try restarting the machine');
  } else if (wsResult && !serviceResult) {
    console.log('⚠️  Connection works but service is not connected');
    console.log('   1. Restart your backend server');
    console.log('   2. Check server.js for AI06 service initialization');
    console.log('   3. Check backend logs for connection errors');
  } else if (tcpResult && wsResult && serviceResult) {
    console.log('✅ Everything looks good!');
    console.log('   → Machine is connected and service is running');
    console.log('   → Attendance should be syncing automatically');
  }
  
  console.log('\n📝 NEXT STEPS:');
  console.log('   1. If connection fails, check machine IP in backend/.env');
  console.log('   2. Restart backend: npm run dev (in backend folder)');
  console.log('   3. Check backend console for real-time connection logs');
  console.log('   4. Test attendance by scanning on the machine');
  
  console.log('\n' + '='.repeat(60));
  process.exit(0);
}

// Run tests
runAllTests().catch(err => {
  console.error('\n❌ Test runner error:', err);
  process.exit(1);
});
