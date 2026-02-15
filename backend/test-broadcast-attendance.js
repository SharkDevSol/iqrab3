/**
 * Test Script: Broadcast attendance event from server
 * 
 * This simulates what happens when AI06 device sends attendance
 * Run this while the Live Attendance Monitor page is open
 */

const http = require('http');
const { Server } = require('socket.io');

// Create a simple HTTP server
const server = http.createServer();

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Start server on port 5001 (different from main server)
const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🔌 Test Socket.IO server running on port ${PORT}`);
  console.log('\n📝 Instructions:');
  console.log('1. Open Live Attendance Monitor page');
  console.log('2. Change connection URL to: http://localhost:5001');
  console.log('3. Press Enter to broadcast test event\n');
  
  // Wait for user input
  process.stdin.on('data', () => {
    console.log('\n📤 Broadcasting test attendance event...');
    
    const testAttendance = {
      userId: 999,
      name: 'Test User',
      time: new Date().toISOString(),
      mode: 3, // Face ID
      inout: 0 // Check In
    };
    
    io.emit('new-attendance', testAttendance);
    console.log('✅ Event broadcasted:', testAttendance);
    console.log(`📊 Sent to ${io.engine.clientsCount} connected clients\n`);
    console.log('Press Enter to send another, or Ctrl+C to exit\n');
  });
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  server.close();
  process.exit(0);
});
