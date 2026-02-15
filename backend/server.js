const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config();

// Security middleware imports
const { securityHeaders, httpsRedirect, preventParamPollution, xssProtection, suspiciousActivityLogger } = require('./middleware/security');
const { apiLimiter, loginLimiter } = require('./middleware/rateLimiter');
const { sanitizeInputs } = require('./middleware/inputValidation');

// Route imports
const studentRoutes = require('./routes/studentRoutes');
const studentListRoutes = require('./routes/studentListRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const viewStudentAttendanceRoutes = require('./routes/viewStudentAttendanceRoutes');
const studentFaultsRoutes = require('./routes/studentFaultsRoutes');
const markListRoutes = require('./routes/markListRoutes');
const evaluationRoutes = require('./routes/evaluations');
const staffRoutes = require('./routes/staffRoutes');
const postRoutes = require('./routes/postRoutes');
const chatRoutes = require('./routes/chatRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const schoolSetupRoutes = require('./routes/schoolSetupRoutes');
const task6Routes = require('./routes/task6Routes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const guardianListRoutes = require('./routes/guardianListRoutes');
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
const classTeacherRoutes = require('./routes/classTeacherRoutes');
const adminAttendanceRoutes = require('./routes/adminAttendanceRoutes');
const classCommunicationRoutes = require('./routes/classCommunicationRoutes');
const guardianAttendanceRoutes = require('./routes/guardianAttendanceRoutes');
const evaluationBookRoutes = require('./routes/evaluationBookRoutes');
const subAccountRoutes = require('./routes/subAccountRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const financeReportsRoutes = require('./routes/finance/dashboardReports');
const inventoryReportsRoutes = require('./routes/inventory/dashboardReports');
const hrReportsRoutes = require('./routes/hr/dashboardReports');
const hrRoutes = require('./routes/hr');
const assetReportsRoutes = require('./routes/assets/dashboardReports');
const financeAccountRoutes = require('./routes/financeAccountRoutes');
const financeExpenseRoutes = require('./routes/simpleExpenseRoutes');
const financeBudgetRoutes = require('./routes/simpleBudgetRoutes');
const simpleFeeManagementRoutes = require('./routes/simpleFeeManagement');
const simpleFeePaymentsRoutes = require('./routes/simpleFeePayments');
const financeFeeStructureRoutes = require('./routes/financeFeeStructureRoutes');
const financeDiscountRoutes = require('./routes/financeDiscountRoutes');
const financeScholarshipRoutes = require('./routes/financeScholarshipRoutes');
const financeLateFeeRoutes = require('./routes/financeLateFeeRoutes');
const financeLateFeeApplicationRoutes = require('./routes/financeLateFeeApplicationRoutes');
const financeInvoiceRoutes = require('./routes/financeInvoiceRoutes');
const financePaymentRoutes = require('./routes/financePaymentRoutes');
const financeMonthlyPaymentRoutes = require('./routes/financeMonthlyPaymentRoutes');
const financeMonthlyPaymentViewRoutes = require('./routes/financeMonthlyPaymentViewRoutes');
const financeSimpleInvoiceRoutes = require('./routes/financeSimpleInvoiceRoutes');
const financeProgressiveInvoiceRoutes = require('./routes/financeProgressiveInvoiceRoutes');
const financeClassStudentRoutes = require('./routes/financeClassStudentRoutes');
const staffAttendanceRoutes = require('./routes/staffAttendanceRoutes');
const machineAttendanceRoutes = require('./routes/machineAttendance');
const machineWebhookRoutes = require('./routes/machineWebhook');
const settingsRoutes = require('./routes/settingsRoutes');
const academicStudentAttendanceRoutes = require('./routes/academic/studentAttendance');
const shiftSettingsRoutes = require('./routes/shiftSettings');

const app = express();

// Create HTTP or HTTPS server based on environment
let server;
if (process.env.NODE_ENV === 'production' && process.env.HTTPS_ENABLED === 'true') {
  // HTTPS configuration for production
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || './ssl/private.key'),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || './ssl/certificate.crt')
  };
  server = https.createServer(sslOptions, app);
  console.log('HTTPS server created');
} else {
  server = http.createServer(app);
  console.log('HTTP server created (development mode)');
}
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true
  }
});
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('✅ Socket.IO client connected:', socket.id);
  console.log('   Total connected clients:', io.engine.clientsCount);
  
  // Handle ping to keep connection alive
  socket.on('ping', (data) => {
    console.log('📡 Ping received from:', socket.id);
    socket.emit('pong', { timestamp: Date.now() });
  });
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room (socket: ${socket.id})`);
    // Log all rooms this socket is in
    console.log(`Socket ${socket.id} is now in rooms:`, Array.from(socket.rooms));
  });
  
  // ==================== CHAT EVENTS ====================
  
  // Join a conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });
  
  // Leave a conversation room
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });
  
  // Send message (broadcast to conversation room)
  socket.on('send_message', (data) => {
    const { conversationId, message } = data;
    console.log(`Message sent to conversation ${conversationId}`);
    // Broadcast to all users in this conversation except sender
    socket.to(`conversation_${conversationId}`).emit('new_message', message);
  });
  
  // Typing indicator
  socket.on('typing_start', (data) => {
    const { conversationId, userId, userName } = data;
    socket.to(`conversation_${conversationId}`).emit('user_typing', { userId, userName });
  });
  
  socket.on('typing_stop', (data) => {
    const { conversationId, userId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_stopped_typing', { userId });
  });
  
  // Mark messages as read
  socket.on('mark_read', (data) => {
    const { conversationId, userId } = data;
    socket.to(`conversation_${conversationId}`).emit('messages_read', { userId, conversationId });
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Socket.IO client disconnected:', socket.id);
    console.log('   Remaining clients:', io.engine.clientsCount);
  });
});

// ===========================================
// SECURITY MIDDLEWARE (Order matters!)
// ===========================================

// 1. HTTPS redirect (production only)
app.use(httpsRedirect);

// 2. Security headers (helmet)
app.use(securityHeaders);

// 3. CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.) in development
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,POST,PUT,DELETE,PATCH',
  credentials: true,
  maxAge: 86400 // Cache preflight for 24 hours
}));

// 4. Rate limiting - apply to all API routes
app.use('/api/', apiLimiter);

// 5. Apply stricter rate limiting to login routes
app.use('/api/admin/login', loginLimiter);
app.use('/api/staff/login', loginLimiter);

// 6. Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Input sanitization
app.use(sanitizeInputs);

// 8. Prevent parameter pollution
app.use(preventParamPollution);

// 9. XSS protection for JSON responses
app.use(xssProtection);

// 10. Log suspicious activity
app.use(suspiciousActivityLogger);

// ===========================================
// STATIC FILES
// ===========================================
// Serve static files - support both uppercase and lowercase paths
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));
app.use('/Uploads/posts', express.static(path.join(__dirname, 'Uploads/posts')));
app.use('/uploads/posts', express.static(path.join(__dirname, 'Uploads/posts')));
app.use('/uploads/branding', express.static(path.join(__dirname, 'uploads/branding')));

// Test route to check if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test route to broadcast attendance event (for debugging)
app.get('/api/test-attendance', (req, res) => {
  console.log('🧪 Test attendance endpoint called');
  
  const testAttendance = {
    userId: 999,
    name: 'Test User',
    time: new Date().toISOString(),
    mode: 3, // Face ID
    inout: 0 // Check In
  };
  
  console.log('📤 Broadcasting test attendance:', testAttendance);
  io.emit('new-attendance', testAttendance);
  console.log(`✅ Broadcasted to ${io.engine.clientsCount} connected clients`);
  
  res.json({ 
    success: true, 
    message: 'Test attendance broadcasted',
    data: testAttendance,
    connectedClients: io.engine.clientsCount
  });
});

// Routes - IMPORTANT: Remove duplicate '/dashboard' from the path
app.use('/api/students', studentRoutes);
app.use('/api/student-list', studentListRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/view-attendance', viewStudentAttendanceRoutes);
app.use('/api/faults', studentFaultsRoutes);
app.use('/api/mark-list', markListRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes); 
app.use('/api/schedule', scheduleRoutes);
app.use('/api/school-setup', schoolSetupRoutes);
app.use('/api/task6', task6Routes);
app.use('/api/dashboard', dashboardRoutes); // This is CORRECT - dashboardRoutes will have routes like '/stats'
app.use('/api/admin', adminRoutes);
app.use('/api/guardian-list', guardianListRoutes);
app.use('/api/student-attendance', studentAttendanceRoutes);
app.use('/api/class-teacher', classTeacherRoutes);
app.use('/api/admin-attendance', adminAttendanceRoutes);
app.use('/api/class-communication', classCommunicationRoutes);
app.use('/api/guardian-attendance', guardianAttendanceRoutes);
app.use('/api/evaluation-book', evaluationBookRoutes);
app.use('/api/admin/sub-accounts', subAccountRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reports/finance', financeReportsRoutes);
app.use('/api/reports/inventory', inventoryReportsRoutes);
app.use('/api/reports/hr', hrReportsRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/hr/shift-settings', shiftSettingsRoutes);
app.use('/api/reports/assets', assetReportsRoutes);
app.use('/api/finance/accounts', financeAccountRoutes);
app.use('/api/finance/expenses', financeExpenseRoutes);
app.use('/api/finance/budgets', financeBudgetRoutes);
app.use('/api/simple-fees', simpleFeeManagementRoutes); // Simple fee management without Prisma
app.use('/api/fee-payments', simpleFeePaymentsRoutes); // Simple fee payment tracking
app.use('/api/finance/fee-structures', financeFeeStructureRoutes);
app.use('/api/finance/discounts', financeDiscountRoutes);
app.use('/api/finance/scholarships', financeScholarshipRoutes);
app.use('/api/finance/late-fee-rules', financeLateFeeRoutes);
app.use('/api/finance', financeLateFeeApplicationRoutes);
app.use('/api/finance/invoices', financeInvoiceRoutes);
app.use('/api/finance/payments', financePaymentRoutes);
app.use('/api/finance/monthly-payments', financeMonthlyPaymentRoutes);
app.use('/api/finance/monthly-payments-view', financeMonthlyPaymentViewRoutes);
app.use('/api/finance/simple-invoices', financeSimpleInvoiceRoutes);
app.use('/api/finance/progressive-invoices', financeProgressiveInvoiceRoutes);
app.use('/api/finance', financeClassStudentRoutes);
app.use('/api/staff-attendance', staffAttendanceRoutes);
app.use('/api/machine-attendance', machineAttendanceRoutes);
app.use('/api/machine-webhook', machineWebhookRoutes);
app.use('/api/usb-attendance', require('./routes/usbAttendanceImport'));
app.use('/api/settings', settingsRoutes);
app.use('/api/academic/student-attendance', academicStudentAttendanceRoutes);

// ===========================================
// AI06 WEBSOCKET SERVICE
// ===========================================
// AI06 WEBSOCKET SERVICE
// ===========================================
const AI06WebSocketService = require('./services/ai06WebSocketService');
const ai06Service = new AI06WebSocketService(7788);

// Start AI06 service with Socket.IO for real-time updates
ai06Service.start(io);

// Make AI06 service accessible to routes
app.set('ai06Service', ai06Service);

// ===========================================
// ATTENDANCE AUTO-MARKER SERVICE
// ===========================================
const attendanceAutoMarker = require('./services/attendanceAutoMarker');
attendanceAutoMarker.start();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard endpoints available at:`);
  console.log(`  http://localhost:${PORT}/api/dashboard/stats`);
  console.log(`  http://localhost:${PORT}/api/dashboard/recent-faults`);
  console.log(`  http://localhost:${PORT}/api/dashboard/top-offenders`);
  
  console.log('\n🤖 Machine Webhook Ready:');
  console.log(`   Listening for AI06 machine at: http://10.22.134.159:${PORT}/api/machine-webhook`);
  console.log('   Machine should push data directly to this endpoint');
  
  console.log('\n🔌 AI06 WebSocket Server Ready:');
  console.log(`   Listening on port 7788 for AI06 device`);
  console.log(`   Configure AI06 device with:`);
  console.log(`   - Server IP: YOUR_LOCAL_IP (e.g., 192.168.1.100)`);
  console.log(`   - Server Port: 7788`);
  console.log(`   - Server Reg: YES`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

