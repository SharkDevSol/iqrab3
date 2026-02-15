# 📋 Staff Attendance Integration Plan

## 🎯 Goal
Connect AI06 machine with staff attendance system to track who logs in and if they're on time or late.

## 📊 System Flow

```
1. Admin assigns Machine ID to each staff
   ↓
2. Staff enrolls face on AI06 device using their Machine ID
   ↓
3. Staff scans face daily
   ↓
4. AI06 sends: {userId: 1, name: "ahmed", time: "08:30:00"}
   ↓
5. System matches Machine ID → Staff Record
   ↓
6. System checks time settings (e.g., work starts at 08:00)
   ↓
7. System determines: On Time or Late
   ↓
8. System saves to database and displays on attendance page
```

## 🔧 Implementation Steps

### Step 1: Add Machine ID to Staff Records
- Add `machineId` field to staff database
- Display in List Staff page
- Allow admin to assign/edit Machine ID

### Step 2: Create Time Settings
- Set work start time (e.g., 08:00 AM)
- Set late threshold (e.g., 15 minutes grace period)
- Set work end time (e.g., 05:00 PM)

### Step 3: Save Attendance to Database
- Create `staff_attendance` table
- Save: staffId, machineId, scanTime, status (on-time/late), date

### Step 4: Create Attendance Display Page
- Show today's attendance
- Display: Staff Name, Machine ID, Time, Status (On Time/Late)
- Filter by date, status, staff type

### Step 5: AI06 Integration
- Match machine userId → staff machineId
- Calculate if late based on time settings
- Save to database
- Broadcast to live monitor

## 📁 Files to Create/Modify

### Backend
1. `backend/prisma/schema.prisma` - Add machineId to Staff model
2. `backend/routes/staffMachineMapping.js` - Assign Machine IDs
3. `backend/routes/staffAttendanceLog.js` - Save attendance logs
4. `backend/services/ai06WebSocketService.js` - Enhanced to save attendance

### Frontend
1. `APP/src/PAGE/List/ListStaff/ListStaff.jsx` - Show Machine ID
2. `APP/src/PAGE/HR/AttendanceSystem.jsx` - Display attendance logs
3. `APP/src/PAGE/HR/AttendanceTimeSettings.jsx` - Configure time settings

## 🎯 Example

**Staff:** Ahmed
**Employee Number:** EMP001
**Machine ID:** 1

**Time Settings:**
- Work Start: 08:00 AM
- Late After: 08:15 AM

**Scenario 1:** Ahmed scans at 07:55 AM
- Status: ✅ On Time (Early)

**Scenario 2:** Ahmed scans at 08:10 AM
- Status: ✅ On Time (Within grace period)

**Scenario 3:** Ahmed scans at 08:30 AM
- Status: ❌ Late (15 minutes late)

## 📊 Database Schema

```sql
-- Add to Staff table
ALTER TABLE "Staff" ADD COLUMN "machineId" INTEGER UNIQUE;

-- Create attendance log table
CREATE TABLE "StaffAttendanceLog" (
  id UUID PRIMARY KEY,
  staffId UUID REFERENCES "Staff"(id),
  machineId INTEGER,
  scanTime TIMESTAMPTZ,
  date DATE,
  status VARCHAR(20), -- 'ON_TIME', 'LATE', 'EARLY'
  minutesLate INTEGER,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚀 Next Steps

1. ✅ Add machineId field to database
2. ✅ Create API endpoints for machine ID management
3. ✅ Update List Staff page to show Machine ID
4. ✅ Create time settings page
5. ✅ Enhance AI06 service to save attendance
6. ✅ Create attendance display page

Let's start implementing!
