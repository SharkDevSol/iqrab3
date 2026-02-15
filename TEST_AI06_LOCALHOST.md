# 🧪 TEST AI06 INTEGRATION ON LOCALHOST

## 📋 PREREQUISITES

- ✅ Backend server running
- ✅ Database with at least 2 students/staff
- ✅ `ws` package installed (`npm install ws`)

---

## 🚀 STEP 1: START BACKEND SERVER

Open Terminal 1:

```bash
cd backend
npm start
```

**You should see:**
```
Server running on port 5000
🔌 AI06 WebSocket Server Ready:
   Listening on port 7788 for AI06 device
```

---

## 🤖 STEP 2: RUN DEVICE SIMULATOR

Open Terminal 2:

```bash
cd backend
node test-ai06-device.js
```

**You should see:**
```
🤖 AI06 Device Simulator Starting...
📡 Connecting to server...
✅ Connected to server

📤 Sending device registration...
📥 Received from server:
{
  "ret": "reg",
  "result": true,
  "cloudtime": "2024-01-15T10:30:00.000Z"
}

📤 Simulating fingerprint scan...
📥 Received from server:
{
  "ret": "sendlog",
  "result": true,
  "cloudtime": "2024-01-15T10:30:03.000Z",
  "access": 1,
  "voice": "Welcome John Doe. Thank you for your payment.",
  "message": "Welcome John Doe. Thank you for your payment."
}

🔊 VOICE MESSAGE TO PLAY:
   "Welcome John Doe. Thank you for your payment."
```

---

## 📊 STEP 3: CHECK BACKEND LOGS

In Terminal 1 (backend), you should see:

```
📱 New device connected from ::ffff:127.0.0.1
📨 Received: {
  "cmd": "reg",
  "sn": "TEST-AI06-001",
  ...
}
✅ Device registered: TEST-AI06-001

📨 Received: {
  "cmd": "sendlog",
  "count": "1",
  ...
}
📊 Received 1 attendance logs
✅ Attendance logged: John Doe at 2024-01-15T10:30:03.000Z
```

---

## 🎯 STEP 4: TEST DIFFERENT PAYMENT STATUSES

### **A. Test Student with NO Balance (Paid)**

1. Make sure student ID 1 has no unpaid invoices
2. Run simulator: `node test-ai06-device.js`
3. Expected voice: **"Welcome [Name]. Thank you for your payment."**

### **B. Test Student with Small Balance (<1000 Birr)**

1. Create invoice for student ID 1 with 500 Birr unpaid
2. Run simulator
3. Expected voice: **"Welcome [Name]. You have a small balance remaining."**

### **C. Test Student with Large Balance (>1000 Birr)**

1. Create invoice for student ID 1 with 2000 Birr unpaid
2. Run simulator
3. Expected voice: **"[Name], please visit the finance office."**

### **D. Test Student with Overdue Payment (>30 days)**

1. Create invoice for student ID 1 with due date 40 days ago
2. Run simulator
3. Expected voice: **"[Name], URGENT: Payment overdue. See finance immediately."**

---

## 🔧 STEP 5: CUSTOMIZE VOICE MESSAGES

Edit `backend/services/ai06WebSocketService.js` line 180:

```javascript
getVoiceMessage(paymentStatus, name) {
  const messages = {
    'PAID': `Welcome ${name}!`,
    'SMALL_BALANCE': `${name}, you have a small balance`,
    'BALANCE_DUE': `${name}, please visit finance`,
    'LATE': `${name}, payment is late`,
    'OVERDUE': `${name}, URGENT payment overdue`
  };
  
  return messages[paymentStatus.status] || `Welcome ${name}`;
}
```

**Restart backend:**
```bash
# In Terminal 1, press Ctrl+C
npm start
```

**Test again:**
```bash
# In Terminal 2
node test-ai06-device.js
```

---

## 📱 STEP 6: TEST REAL-TIME DASHBOARD

### **A. Create Test Dashboard Page**

Create `APP/src/PAGE/AI06TestDashboard.jsx`:

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function AI06TestDashboard() {
  const [attendance, setAttendance] = useState([]);
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    const socket = io('http://localhost:5000');
    
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      setConnected(true);
    });
    
    socket.on('new-attendance', (data) => {
      console.log('📊 New attendance:', data);
      setAttendance(prev => [data, ...prev].slice(0, 10));
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('New Attendance', {
          body: `${data.name} checked in at ${new Date(data.time).toLocaleTimeString()}`
        });
      }
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Disconnected');
      setConnected(false);
    });
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>🔌 AI06 Live Attendance Dashboard</h1>
      
      <div style={{ 
        padding: '10px', 
        background: connected ? '#d4edda' : '#f8d7da',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        {connected ? '✅ Connected to server' : '❌ Disconnected'}
      </div>
      
      <h2>Recent Attendance (Live)</h2>
      
      {attendance.length === 0 ? (
        <p>Waiting for attendance scans...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Time</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Type</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((att, i) => (
              <tr key={i} style={{ 
                background: i === 0 ? '#ffffcc' : 'white',
                animation: i === 0 ? 'highlight 2s' : 'none'
              }}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {new Date(att.time).toLocaleTimeString()}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {att.name}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {att.type}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  {att.userId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      <style>{`
        @keyframes highlight {
          0% { background: #90EE90; }
          100% { background: white; }
        }
      `}</style>
    </div>
  );
}

export default AI06TestDashboard;
```

### **B. Test Dashboard**

1. Start frontend: `cd APP && npm run dev`
2. Navigate to the test dashboard page
3. Run device simulator: `node backend/test-ai06-device.js`
4. Watch the dashboard update in real-time!

---

## ✅ SUCCESS CHECKLIST

- [ ] Backend starts without errors
- [ ] AI06 WebSocket Server shows "Listening on port 7788"
- [ ] Device simulator connects successfully
- [ ] Device registration works
- [ ] Attendance logs are received
- [ ] Voice messages are generated based on payment status
- [ ] Attendance is saved to database
- [ ] Dashboard updates in real-time
- [ ] Different payment statuses show different messages

---

## 🔧 TROUBLESHOOTING

### **Problem: "EADDRINUSE: address already in use :::7788"**

**Solution:**
```bash
# Kill process using port 7788
netstat -ano | findstr :7788
taskkill /PID <PID> /F

# Or use different port in server.js:
const ai06Service = new AI06WebSocketService(7789);
```

### **Problem: "Cannot find module 'ws'"**

**Solution:**
```bash
cd backend
npm install ws
```

### **Problem: "User not found" in logs**

**Solution:**
```bash
# Check if students exist
cd backend
node scripts/check-students-db.js

# Or create test students in your database
```

### **Problem: Voice message is empty**

**Solution:**
- Check if student has invoices in database
- Check payment status calculation in logs
- Verify `getVoiceMessage()` function is working

---

## 📊 EXPECTED OUTPUT

### **Terminal 1 (Backend):**
```
Server running on port 5000
🔌 AI06 WebSocket Server Ready:
   Listening on port 7788 for AI06 device

📱 New device connected from ::ffff:127.0.0.1
✅ Device registered: TEST-AI06-001
Model: AI06-TEST
Users: 10/3000
Logs: 50/100000

📊 Received 1 attendance logs
✅ Attendance logged: John Doe at 2024-01-15T10:30:03.000Z
```

### **Terminal 2 (Simulator):**
```
🤖 AI06 Device Simulator Starting...
✅ Connected to server

📤 Sending device registration...
📥 Received from server:
{
  "ret": "reg",
  "result": true,
  "cloudtime": "2024-01-15T10:30:00.000Z"
}

📤 Simulating fingerprint scan...
📥 Received from server:
{
  "ret": "sendlog",
  "result": true,
  "access": 1,
  "voice": "Welcome John Doe. Thank you for your payment."
}

🔊 VOICE MESSAGE TO PLAY:
   "Welcome John Doe. Thank you for your payment."
```

---

## 🎉 NEXT STEPS

Once localhost testing is successful:

1. ✅ Configure real AI06 device with your computer's local IP
2. ✅ Test with real fingerprint scans
3. ✅ Deploy to VPS
4. ✅ Configure AI06 with VPS IP
5. ✅ Go live!

---

## 💡 TIPS

- Use `enrollid: 1` and `enrollid: 2` in simulator to test different students
- Create invoices with different amounts and due dates to test all voice messages
- Watch both terminal windows to see the full communication flow
- Check database to verify attendance is being saved
- Test dashboard in multiple browser tabs to see real-time sync

**Ready to test? Start with Step 1!** 🚀
