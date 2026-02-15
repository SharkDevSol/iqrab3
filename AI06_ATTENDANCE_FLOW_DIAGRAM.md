# 🔄 AI06 Attendance System - Complete Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI06 BIOMETRIC DEVICE                       │
│                    (Face ID Scanner)                            │
│                                                                 │
│  User scans face → Device recognizes → Sends log via WebSocket │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ WebSocket (Port 7788)
                             │ JSON Protocol
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER (Node.js)                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AI06 WebSocket Service                                  │  │
│  │  (backend/services/ai06WebSocketService.js)              │  │
│  │                                                           │  │
│  │  1. Receives log: { enrollid: 1, name: "ahmed", ... }   │  │
│  │  2. Maps Machine ID → Staff Name (1 → ahmed)            │  │
│  │  3. Converts Gregorian → Ethiopian Date                 │  │
│  │  4. Determines Status (PRESENT/LATE)                    │  │
│  │  5. Saves to Database                                   │  │
│  │  6. Broadcasts via Socket.IO                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                   │
│                             ├─────────────┐                     │
│                             ▼             ▼                     │
│                    ┌─────────────┐  ┌──────────┐               │
│                    │  PostgreSQL │  │ Socket.IO│               │
│                    │  Database   │  │ Broadcast│               │
│                    └─────────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────────────┘
                             │             │
                             │             │ Real-time
                             │             │ WebSocket
                             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React App)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Attendance System Page                                  │  │
│  │  (APP/src/PAGE/HR/AttendanceSystem.jsx)                  │  │
│  │                                                           │  │
│  │  1. User selects Ethiopian Month/Year                    │  │
│  │  2. Fetches attendance from API                          │  │
│  │  3. Displays in calendar grid                            │  │
│  │  4. Shows Machine ID, Status, Times                      │  │
│  │  5. Receives real-time updates via Socket.IO            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow (Step by Step)

### 1️⃣ Face Scan on Device
```
AI06 Device
  ↓
User: Ahmed scans face
  ↓
Device recognizes: enrollid = 1
  ↓
Sends WebSocket message:
{
  "cmd": "sendlog",
  "count": 1,
  "record": [{
    "enrollid": 1,
    "name": "ahmed",
    "time": "2026-02-10 08:30:15",
    "mode": 8,
    "inout": 0
  }]
}
```

### 2️⃣ Backend Processing
```
Backend receives message
  ↓
AI06 Service processes:
  - Machine ID: 1
  - Staff Name: ahmed (from mapping)
  - Scan Time: 2026-02-10 08:30:15
  ↓
Convert to Ethiopian Date:
  - Gregorian: Feb 10, 2026
  - Ethiopian: Yekatit 20, 2018
  ↓
Determine Status:
  - Check-in: 08:30:15
  - Late Threshold: 08:15
  - Status: LATE (after 08:15)
  ↓
Save to Database:
  INSERT INTO hr_ethiopian_attendance
  (staff_id, staff_name, ethiopian_year, 
   ethiopian_month, ethiopian_day, 
   check_in, status)
  VALUES ('1', 'ahmed', 2018, 6, 20, 
          '08:30:15', 'LATE')
  ↓
Broadcast via Socket.IO:
  io.emit('new-attendance', {
    userId: 1,
    name: 'ahmed',
    time: '2026-02-10 08:30:15',
    mode: 8,
    inout: 0
  })
```

### 3️⃣ Frontend Display
```
User opens Attendance System page
  ↓
Selects: Yekatit (Month 6), Year 2018
  ↓
Frontend fetches:
  GET /api/hr/attendance/ethiopian-month
      ?ethMonth=6&ethYear=2018
  ↓
Backend returns:
  [{
    staff_id: "1",
    staff_name: "ahmed",
    ethiopian_year: 2018,
    ethiopian_month: 6,
    ethiopian_day: 20,
    check_in: "08:30:15",
    status: "LATE"
  }]
  ↓
Frontend displays:
  - Row: Ahmed
  - Machine ID: 1 (blue badge)
  - Day 20 column: L (orange badge)
  - Time: 08:30:15
```

---

## Database Schema

### Table: `hr_ethiopian_attendance`
```sql
CREATE TABLE hr_ethiopian_attendance (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(255) NOT NULL,
  staff_name VARCHAR(255) NOT NULL,
  ethiopian_year INTEGER NOT NULL,
  ethiopian_month INTEGER NOT NULL,
  ethiopian_day INTEGER NOT NULL,
  check_in TIME NOT NULL,
  check_out TIME,
  working_hours DECIMAL(5, 2),
  status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(staff_id, ethiopian_year, ethiopian_month, ethiopian_day)
);
```

### Sample Data
```sql
id                                   | staff_id | staff_name | ethiopian_year | ethiopian_month | ethiopian_day | check_in | check_out | status  | created_at
-------------------------------------|----------|------------|----------------|-----------------|---------------|----------|-----------|---------|------------------
a1b2c3d4-e5f6-7890-abcd-ef1234567890 | 1        | ahmed      | 2018           | 6               | 20            | 08:30:15 | NULL      | LATE    | 2026-02-10 08:30:15
```

---

## Machine ID Mapping

### Hardcoded in Backend
```javascript
const staffMapping = {
  1: 'ahmed',
  2: 'bilal',
  3: 'chaltu',
  4: 'faxe',
  5: 'adam',
  6: 'ebsa',
  7: 'yusuf'
};
```

### Displayed in Frontend
```javascript
const machineIdMapping = {
  'adam': 5,
  'ahmed': 1,
  'bilal': 2,
  'chaltu': 3,
  'faxe': 4,
  'ebsa': 6,
  'yusuf': 7
};
```

---

## Ethiopian Calendar Conversion

### Logic (Same in Backend and Frontend)
```javascript
// Today: February 10, 2026
const year = 2026;
const month = 2;  // February
const day = 10;

// Calculate Ethiopian date
let ethYear = year - 8;        // 2026 - 8 = 2018
let ethMonth = month + 4;      // 2 + 4 = 6 (Yekatit)
let ethDay = day + 10;         // 10 + 10 = 20

// Adjust for overflow
if (ethMonth > 13) {
  ethMonth -= 13;
  ethYear += 1;
}

if (ethDay > 30) {
  ethDay -= 30;
  ethMonth += 1;
}

// Result: Yekatit 20, 2018
```

---

## Status Determination

### Rules
```javascript
// Get check-in time
const checkInTime = "08:30:15";
const [hour, minute] = checkInTime.split(':').map(Number);
const checkInMinutes = hour * 60 + minute;  // 510 minutes

// Get late threshold (default: 08:15)
const lateThreshold = "08:15";
const [thresholdHour, thresholdMin] = lateThreshold.split(':').map(Number);
const lateThresholdMinutes = thresholdHour * 60 + thresholdMin;  // 495 minutes

// Determine status
let status = 'PRESENT';
if (checkInMinutes > lateThresholdMinutes) {
  status = 'LATE';  // 510 > 495 → LATE
}
```

### Status Types
- **PRESENT** - Checked in on time (before 08:15)
- **LATE** - Checked in after late threshold (after 08:15)
- **ABSENT** - No check-in recorded
- **HALF_DAY** - Working hours less than threshold (< 4 hours)
- **LEAVE** - Approved leave request

---

## Real-Time Updates

### Socket.IO Flow
```
Backend (AI06 Service)
  ↓
io.emit('new-attendance', data)
  ↓
All connected clients receive event
  ↓
Frontend (Attendance System)
  ↓
Updates UI in real-time
  ↓
Shows notification/animation
```

---

## API Endpoints

### Get Attendance for Ethiopian Month
```
GET /api/hr/attendance/ethiopian-month
    ?ethMonth=6&ethYear=2018

Response:
{
  "success": true,
  "data": [
    {
      "id": "...",
      "staff_id": "1",
      "staff_name": "ahmed",
      "ethiopian_year": 2018,
      "ethiopian_month": 6,
      "ethiopian_day": 20,
      "check_in": "08:30:15",
      "check_out": null,
      "status": "LATE",
      "created_at": "2026-02-10T08:30:15.000Z"
    }
  ]
}
```

### Mark Attendance (Manual)
```
POST /api/hr/attendance/ethiopian

Body:
{
  "staffId": "1",
  "staffName": "ahmed",
  "ethMonth": 6,
  "ethYear": 2018,
  "ethDay": 20,
  "checkIn": "08:30:15",
  "checkOut": null
}

Response:
{
  "success": true,
  "data": { ... },
  "message": "Attendance marked successfully"
}
```

---

## Testing Scenarios

### Scenario 1: On-Time Check-In
```
Scan Time: 08:00:00
Late Threshold: 08:15:00
Expected Status: PRESENT ✅
Badge Color: Green
Badge Text: P
```

### Scenario 2: Late Check-In
```
Scan Time: 08:30:00
Late Threshold: 08:15:00
Expected Status: LATE ⚠️
Badge Color: Orange
Badge Text: L
```

### Scenario 3: Check-Out
```
First Scan: 08:00:00 (Check-in)
Second Scan: 17:00:00 (Check-out)
Working Hours: 9.0 hours
Expected Status: PRESENT ✅
```

### Scenario 4: Half Day
```
Check-in: 08:00:00
Check-out: 11:30:00
Working Hours: 3.5 hours
Half Day Threshold: 4.0 hours
Expected Status: HALF_DAY 🔵
Badge Color: Blue
Badge Text: H
```

---

## Troubleshooting Flow

```
Problem: Attendance not showing
  ↓
Check 1: Is backend running?
  ├─ Yes → Continue
  └─ No → Run: npm run dev
  ↓
Check 2: Is AI06 service started?
  ├─ Yes → Continue
  └─ No → Check port 7788
  ↓
Check 3: Is device connected?
  ├─ Yes → Continue
  └─ No → Check device IP/network
  ↓
Check 4: Did face scan succeed?
  ├─ Yes → Continue
  └─ No → Re-enroll face
  ↓
Check 5: Is data in database?
  ├─ Yes → Continue
  └─ No → Check backend logs
  ↓
Check 6: Correct month/year selected?
  ├─ Yes → Should see data!
  └─ No → Select correct month/year
```

---

**Last Updated:** February 10, 2026
**Status:** Complete and Working
