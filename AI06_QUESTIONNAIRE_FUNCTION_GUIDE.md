# 📋 AI Face Questionnaire Function Guide

## 📍 Location

The AI face questionnaire function files are located in:

```
backend/AI face questionnaire function/
├── AI face-How to setup attendance status.pdf
├── attendance status selection.mp4
└── questionnaire.xls
```

---

## 🎯 What is the Questionnaire Function?

The **questionnaire function** is a feature of the AI06/AiFace biometric device that allows you to configure **re-verification rules** for attendance. This helps prevent duplicate check-ins and controls how often staff can scan their face for attendance.

---

## ⚙️ Configuration Parameters

Based on the WhatsApp message from SANA, here are the key settings:

### 1. **Minimum Time Interval (Re-verify Time)**
- **Purpose:** Set the minimum time between consecutive face scans
- **Default:** 300 seconds (5 minutes)
- **Recommended:** 300 seconds (5 minutes) or more
- **What it does:** Prevents the same person from checking in/out multiple times within this period

### 2. **Menu Settings**
- Access device menu to configure questionnaire rules
- Navigate to attendance settings section

### 3. **Shift Configuration**
- Define work shifts (morning, afternoon, evening)
- Set shift start and end times
- Configure which shifts apply to which staff

### 4. **Attendance Rules (Re-verify Rules)**
- **Rule Type:** Time-based verification
- **Interval:** 300 seconds (5 minutes minimum)
- **Purpose:** Prevent accidental duplicate scans

---

## 📖 How to Use the Questionnaire Function

### Step 1: Access Device Menu
1. On the AI06 device, press **Menu**
2. Navigate to **Attendance Settings** or **Verification Settings**
3. Look for **Questionnaire** or **Re-verify Time** option

### Step 2: Set Re-verify Time
1. Select **Re-verify Time** or **Minimum Interval**
2. Set value to **300** (seconds) = 5 minutes
3. This means:
   - If Khalid scans at 08:00 AM
   - He cannot scan again until 08:05 AM
   - Any scan within 5 minutes will be ignored

### Step 3: Configure Shift Rules
1. Go to **Shift Settings**
2. Define shifts:
   - **Morning Shift:** 07:00 - 12:00
   - **Afternoon Shift:** 12:00 - 17:00
   - **Evening Shift:** 17:00 - 22:00
3. Save settings

### Step 4: Set Attendance Rules
1. Navigate to **Attendance Rules**
2. Enable **Re-verify Protection**
3. Set **Minimum Interval:** 300 seconds
4. Save and exit

---

## 📁 Available Resources

### 1. **AI face-How to setup attendance status.pdf**
- **Location:** `backend/AI face questionnaire function/`
- **Content:** Step-by-step guide with screenshots
- **Purpose:** Visual guide for configuring attendance status on device

### 2. **attendance status selection.mp4**
- **Location:** `backend/AI face questionnaire function/`
- **Content:** Video tutorial showing device configuration
- **Purpose:** Watch how to navigate device menu and set up rules

### 3. **questionnaire.xls**
- **Location:** `backend/AI face questionnaire function/`
- **Content:** Excel file with questionnaire templates
- **Purpose:** Pre-configured settings you can reference

---

## 🔧 Integration with Your System

### Current System Behavior:
Your backend (`ai06WebSocketService.js`) currently:
1. ✅ Receives all face scans from device
2. ✅ Saves to database immediately
3. ✅ Uses time settings for LATE/PRESENT status
4. ❌ Does NOT filter duplicate scans within 5 minutes

### Recommended Enhancement:

Add duplicate scan prevention in `ai06WebSocketService.js`:

```javascript
// Add this to the class
constructor(port = 7788) {
  this.port = port;
  this.wss = null;
  this.devices = new Map();
  this.io = null;
  this.recentScans = new Map(); // Track recent scans
  this.reVerifyInterval = 300000; // 5 minutes in milliseconds
}

// Add this method
isRecentScan(machineId, scanTime) {
  const key = `${machineId}`;
  const lastScan = this.recentScans.get(key);
  
  if (!lastScan) {
    this.recentScans.set(key, scanTime);
    return false;
  }
  
  const timeDiff = new Date(scanTime) - new Date(lastScan);
  
  if (timeDiff < this.reVerifyInterval) {
    console.log(`⚠️ Duplicate scan detected for Machine ID ${machineId}`);
    console.log(`   Last scan: ${lastScan}`);
    console.log(`   Current scan: ${scanTime}`);
    console.log(`   Time difference: ${Math.floor(timeDiff / 1000)} seconds`);
    return true; // This is a duplicate
  }
  
  // Update last scan time
  this.recentScans.set(key, scanTime);
  return false;
}

// Modify handleAttendanceLog method
async handleAttendanceLog(ws, message) {
  const { count, logindex, record } = message;
  
  console.log(`📊 Received ${count} attendance logs`);
  
  for (const log of record) {
    const { enrollid, time, mode, inout, event, image } = log;
    
    // Check for duplicate scan (within 5 minutes)
    if (this.isRecentScan(enrollid, time)) {
      console.log(`⏭️ Skipping duplicate scan for user ${enrollid}`);
      
      // Still acknowledge to device
      const response = {
        ret: 'sendlog',
        result: true,
        cloudtime: new Date().toISOString(),
        access: 1,
        message: 'Duplicate scan ignored (within 5 minutes)'
      };
      ws.send(JSON.stringify(response));
      continue; // Skip saving to database
    }
    
    // ... rest of your existing code
  }
}
```

---

## 🎯 Practical Example

### Scenario: Khalid's Morning Routine

**Without Re-verify Protection:**
- 08:00:00 - Khalid scans → Check-in recorded
- 08:00:30 - Khalid accidentally scans again → Check-out recorded ❌
- 08:01:00 - Khalid scans again → Check-in recorded ❌
- Result: Multiple incorrect records

**With Re-verify Protection (300 seconds):**
- 08:00:00 - Khalid scans → Check-in recorded ✅
- 08:00:30 - Khalid accidentally scans → **IGNORED** ✅
- 08:01:00 - Khalid scans again → **IGNORED** ✅
- 08:05:01 - Khalid can scan again (if needed for check-out)
- Result: Only one correct record

---

## 📊 Configuration Summary

| Setting | Value | Purpose |
|---------|-------|---------|
| **Re-verify Time** | 300 seconds (5 min) | Prevent duplicate scans |
| **Menu Access** | Device Menu → Attendance | Configure rules |
| **Shift Rules** | Morning/Afternoon/Evening | Define work periods |
| **Attendance Rules** | Time-based verification | Control scan frequency |

---

## 🚀 Quick Setup Steps

1. **On AI06 Device:**
   - Menu → Attendance Settings
   - Set Re-verify Time: 300 seconds
   - Enable Re-verify Protection
   - Save settings

2. **In Your Backend (Optional):**
   - Add duplicate scan detection code
   - Set `reVerifyInterval = 300000` (5 minutes)
   - Filter scans within interval

3. **Test:**
   - Scan face at 08:00:00
   - Try scanning again at 08:01:00 → Should be ignored
   - Wait until 08:05:01 → Should work

---

## 📚 Additional Resources

### View the Files:
```bash
# Navigate to the folder
cd "backend/AI face questionnaire function"

# View PDF (Windows)
start "AI face-How to setup attendance status.pdf"

# Watch video (Windows)
start "attendance status selection.mp4"

# Open Excel file (Windows)
start questionnaire.xls
```

### Device Documentation:
- **Protocol PDF:** `backend/websocket+json protocol3.0.pdf`
- **HTTP Protocol:** `backend/http or https+json protocol3.0.pdf`
- **Device Menu Settings:** `backend/c#cloud sdk-2512/Device Menu Settings.txt`

---

## ⚠️ Important Notes

1. **Device-Side vs Server-Side:**
   - Device can enforce re-verify time (recommended)
   - Server can also filter duplicates (backup protection)
   - Best practice: Enable both

2. **Check-in vs Check-out:**
   - Re-verify time applies to ALL scans
   - If you need separate check-in/check-out, configure device mode
   - See: Device Menu → Attendance Mode

3. **Time Synchronization:**
   - Ensure device time matches server time
   - Use NTP or manual time sync
   - Check: Device Menu → System → Date/Time

4. **Current System:**
   - Your system already has time settings integration ✅
   - Re-verify protection is NOT yet implemented ⚠️
   - Add the code above to enable it

---

## 🎓 Summary

The **questionnaire function** is essentially a **re-verification time setting** that prevents duplicate attendance scans within a specified interval (recommended: 300 seconds / 5 minutes).

**Key Benefits:**
- ✅ Prevents accidental duplicate check-ins
- ✅ Reduces database clutter
- ✅ Ensures accurate attendance records
- ✅ Protects against rapid re-scanning

**How to Enable:**
1. Configure on device (Menu → Attendance → Re-verify Time: 300)
2. Optionally add server-side filtering (code provided above)
3. Test with actual face scans

**Files to Reference:**
- PDF guide with screenshots
- Video tutorial showing device navigation
- Excel template with settings

---

## 📞 Need Help?

If you need assistance:
1. Watch the video: `attendance status selection.mp4`
2. Read the PDF: `AI face-How to setup attendance status.pdf`
3. Check the Excel: `questionnaire.xls`
4. Contact AI06 support: +86 159 8941 6189 (SANA)

---

**Status:** Documentation Complete ✅  
**Location:** `backend/AI face questionnaire function/`  
**Next Step:** Configure device re-verify time to 300 seconds
