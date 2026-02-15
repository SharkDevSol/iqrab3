/**
 * Test Script: Manually emit attendance event via Socket.IO
 * 
 * This script connects to the running server and emits a test attendance event
 * Use this to test if the Live Attendance Monitor receives events correctly
 */

const io = require('socket.io-client');

console.log('🔌 Connecting to Socket.IO server...');

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to server! Socket ID:', socket.id);
  
  // Wait 1 second then emit test event
  setTimeout(() => {
    console.log('\n📤 Emitting test attendance event...');
    
    const testAttendance = {
      userId: 999,
      name: 'Test User',
      time: new Date().toISOString(),
      mode: 3, // Face ID
      inout: 0 // Check In
    };
    
    socket.emit('new-attendance', testAttendance);
    console.log('✅ Test event sent:', testAttendance);
    
    console.log('\n⏳ Waiting 2 seconds for response...');
    setTimeout(() => {
      console.log('✅ Test complete! Check the Live Attendance Monitor page.');
      socket.disconnect();
      process.exit(0);
    }, 2000);
  }, 1000);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error.message);
  console.log('\n💡 Make sure the backend server is running:');
  console.log('   cd backend');
  console.log('   node server.js');
  process.exit(1);
});

socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected:', reason);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Disconnecting...');
  socket.disconnect();
  process.exit(0);
});
