# 🎯 AI06 ATTENDANCE MACHINE - COMPLETE INTEGRATION GUIDE

## 📋 OVERVIEW

Your AI06 biometric attendance machine will integrate with your school ERP system using:
- **Protocol**: WebSocket + JSON
- **Port**: 7788
- **Features**: Real-time attendance, voice alerts, payment status checking
- **Voice Support**: ✅ YES - Custom messages based on payment status

---

## 🔧 STEP 1: CONFIGURE AI06 DEVICE

On the AI06 machine menu, configure these settings:

```
MENU → Comm set → Ethernet → DHCP: YES
MENU → Comm set → Server → server reg: YES  
MENU → Comm set → Server → usedomain: NO
MENU → Comm set → Server → server IP: [YOUR_VPS_IP]
MENU → Comm set → Server → server Port: 7788
MENU → Comm set → Server → Server approval: NO
```

**Replace `[YOUR_VPS_IP]` with your Hostinger VPS IP address after purchase.**

---

## 🚀 STEP 2: INSTALL ON VPS

### **A. Install Dependencies**

```bash
cd /var/www/school-erp/backend
npm install ws
```

### **B. Update server.js**

Add this code after line 100 in `backend/server.js`:

```javascript
// AI06 WebSocket Service
const AI06WebSocketService = require('./services/ai06WebSocketService');
const ai06Service = new AI06WebSocketService(7788);

// Start AI06 service after Socket.IO is initialized
ai06Service.start(io);

console.log('✅ AI06 WebSocket Service started on port 7788');
```

### **C. Open Firewall Port**

```bash
# Allow AI06 device to connect
sudo ufw allow 7788/tcp
sudo ufw reload
```

### **D. Restart Backend**

```bash
pm2 restart school-erp-backend
pm2 logs
```

---

## 📊 STEP 3: HOW IT WORKS

### **Real-Time Flow:**

```
1. Student scans fingerprint on AI06 (0ms)
   ↓
2. AI06 verifies fingerprint (100-500ms)
   ↓
3. AI06 sends attendance log to VPS via WebSocket (220ms)
   ↓
4. VPS receives log and checks payment status in database (50ms)
   ↓
5. VPS determines voice message based on balance (10ms)
   ↓
6. VPS sends voice command back to AI06 (220ms)
   ↓
7. AI06 plays voice message through speaker (500ms)
   ↓
8. Dashboard updates in real-time via Socket.IO (10ms)
   ↓
Total: ~1 second from scan to voice!
```

---

## 🔊 STEP 4: VOICE MESSAGES

### **Automatic Voice Alerts Based on Payment Status:**

| Payment Status | Balance | Days Overdue | Voice Message |
|----------------|---------|--------------|---------------|
| **PAID** | 0 Birr | 0 | "Welcome [Name]. Thank you for your payment." |
| **SMALL_BALANCE** | < 1000 Birr | 0 | "Welcome [Name]. You have a small balance remaining." |
| **BALANCE_DUE** | > 1000 Birr | 0 | "[Name], please visit the finance office." |
| **LATE** | > 0 Birr | 1-30 days | "[Name], your payment is late. See finance office." |
| **OVERDUE** | > 0 Birr | > 30 days | "[Name], URGENT: Payment overdue. See finance immediately." |

### **Customize Messages:**

Edit `backend/services/ai06WebSocketService.js`, line 180:

```javascript
getVoiceMessage(paymentStatus, name) {
  const messages = {
    'PAID': `Welcome ${name}. Thank you!`,
    'SMALL_BALANCE': `${name}, small balance remaining`,
    'BALANCE_DUE': `${name}, visit finance office`,
    'LATE': `${name}, payment is late`,
    'OVERDUE': `${name}, URGENT payment overdue`
  };
  
  return messages[paymentStatus.status] || `Welcome ${name}`;
}
```

### **Amharic Support:**

```javascript
getVoiceMessage(paymentStatus, name) {
  const messages = {
    'PAID': `እንኳን ደህና መጡ ${name}. አመሰግናለሁ።`,
    'SMALL_BALANCE': `${name}, ትንሽ ቀሪ ክፍያ አለዎት።`,
    'BALANCE_DUE': `${name}, የፋይናንስ ቢሮውን ይጎብኙ።`,
    'LATE': `${name}, ክፍያዎ ዘግይቷል።`,
    'OVERDUE': `${name}, አስቸኳይ: ክፍያ ጊዜው አልፎበታል።`
  };
  
  return messages[paymentStatus.status] || `እንኳን ደህና መጡ ${name}`;
}
```

---

## 📱 STEP 5: REAL-TIME DASHBOARD

### **Frontend Integration:**

Add this to your React dashboard component:

```javascript
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

function AttendanceDashboard() {
  const [recentAttendance, setRecentAttendance] = useState([]);
  
  useEffect(() => {
    const socket = io('http://your-vps-ip:5000');
    
    socket.on('new-attendance', (data) => {
      console.log('New attendance:', data);
      
      // Add to recent list
      setRecentAttendance(prev => [data, ...prev].slice(0, 10));
      
      // Show notification
      showNotification(`${data.name} checked in at ${data.time}`);
    });
    
    return () => socket.disconnect();
  }, []);
  
  return (
    <div>
      <h2>Live Attendance</h2>
      <ul>
        {recentAttendance.map((att, i) => (
          <li key={i}>
            {att.name} - {att.time} - {att.type}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🎯 STEP 6: TESTING

### **A. Check if AI06 is Connected:**

```bash
# On your VPS
pm2 logs school-erp-backend

# You should see:
# "📱 New device connected from [AI06_IP]"
# "✅ Device registered: [SERIAL_NUMBER]"
```

### **B. Test Attendance Scan:**

1. Scan a fingerprint on AI06 machine
2. Check VPS logs:
   ```bash
   pm2 logs
   ```
3. You should see:
   ```
   📊 Received 1 attendance logs
   ✅ Attendance logged: [Student Name] at [Time]
   ```
4. Voice should play on AI06 speaker
5. Dashboard should update in real-time

### **C. Test Payment Status:**

1. Create a student with unpaid invoice
2. Scan their fingerprint
3. AI06 should play: "Please visit finance office"
4. Pay the invoice
5. Scan again
6. AI06 should play: "Welcome. Thank you for your payment."

---

## 🔧 STEP 7: ADVANCED FEATURES

### **A. Send Users to AI06 Device:**

```javascript
// API endpoint to sync users to device
app.post('/api/ai06/sync-users', async (req, res) => {
  const students = await prisma.student.findMany();
  
  for (const student of students) {
    const command = {
      cmd: 'setuserinfo',
      enrollid: student.id,
      name: student.name,
      backupnum: 0, // Fingerprint index
      admin: 0,
      record: '' // Fingerprint data (if available)
    };
    
    ai06Service.sendCommand('DEVICE_SN', command);
  }
  
  res.json({ success: true });
});
```

### **B. Get Attendance Logs:**

```javascript
// API endpoint to fetch logs from device
app.get('/api/ai06/get-logs', async (req, res) => {
  const command = {
    cmd: 'getnewlog',
    stn: true
  };
  
  ai06Service.sendCommand('DEVICE_SN', command);
  
  res.json({ success: true, message: 'Fetching logs...' });
});
```

### **C. Open Door Remotely:**

```javascript
// API endpoint to open door
app.post('/api/ai06/open-door', async (req, res) => {
  const command = {
    cmd: 'opendoor'
  };
  
  ai06Service.sendCommand('DEVICE_SN', command);
  
  res.json({ success: true });
});
```

---

## 📊 STEP 8: MONITORING

### **Check Connected Devices:**

```javascript
// API endpoint
app.get('/api/ai06/devices', (req, res) => {
  const devices = ai06Service.getConnectedDevices();
  res.json({ devices });
});
```

### **Device Status Dashboard:**

```javascript
// React component
function DeviceStatus() {
  const [devices, setDevices] = useState([]);
  
  useEffect(() => {
    fetch('/api/ai06/devices')
      .then(res => res.json())
      .then(data => setDevices(data.devices));
  }, []);
  
  return (
    <div>
      <h3>Connected Devices</h3>
      {devices.length === 0 ? (
        <p>No devices connected</p>
      ) : (
        <ul>
          {devices.map(sn => (
            <li key={sn}>✅ Device: {sn}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## ⚠️ TROUBLESHOOTING

### **Problem: Device Not Connecting**

**Solution:**
1. Check VPS firewall:
   ```bash
   sudo ufw status
   # Should show: 7788/tcp ALLOW
   ```
2. Check if service is running:
   ```bash
   pm2 logs school-erp-backend
   # Should show: "AI06 WebSocket Server started on port 7788"
   ```
3. Verify AI06 settings:
   - Server IP = Your VPS IP
   - Server Port = 7788
   - Server Reg = YES

### **Problem: Voice Not Playing**

**Solution:**
1. Check AI06 volume settings (MENU → System → Volume)
2. Verify voice message is being sent:
   ```bash
   pm2 logs
   # Should show: voice: "Welcome [Name]..."
   ```
3. Test with simple message:
   ```javascript
   voice: "Test message"
   ```

### **Problem: Attendance Not Saving**

**Solution:**
1. Check if user exists in database:
   ```bash
   node backend/scripts/check-students-db.js
   ```
2. Check logs for errors:
   ```bash
   pm2 logs --err
   ```
3. Verify database connection in `.env`

---

## 🎯 FINAL CHECKLIST

- ✅ AI06 device configured with VPS IP and port 7788
- ✅ WebSocket service installed (`npm install ws`)
- ✅ AI06 service integrated in server.js
- ✅ Firewall port 7788 opened
- ✅ Backend restarted (`pm2 restart`)
- ✅ Device connected (check logs)
- ✅ Test fingerprint scan works
- ✅ Voice messages playing correctly
- ✅ Dashboard updates in real-time
- ✅ Payment status checking works

---

## 📞 SUPPORT

If you need help:
1. Check logs: `pm2 logs school-erp-backend`
2. Check device connection: Look for "Device registered" message
3. Test with simple scan and verify voice plays
4. Contact AI06 vendor for device-specific issues

---

## 🎉 SUCCESS!

Your AI06 attendance machine is now fully integrated with:
- ✅ Real-time attendance logging
- ✅ Automatic voice alerts based on payment status
- ✅ Live dashboard updates
- ✅ WebSocket communication
- ✅ Payment status checking
- ✅ Custom voice messages

**Students with late payments will hear a reminder every time they scan their fingerprint!** 🔊
