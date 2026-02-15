# 🚀 Setup Guide: Staff Attendance Machine Integration

## 📋 Overview

This guide will help you integrate the AI06 biometric device with your staff attendance system.

## ✅ Step 1: Run Database Setup

```bash
cd backend
node scripts/setup-staff-attendance-machine.js
```

This will:
- Add `machineId` field to Staff table
- Create `StaffAttendanceLog` table
- Create `AttendanceTimeSetting` table
- Set default work hours (08:00 - 17:00, 15 min grace period)

## ✅ Step 2: Add Routes to Server

Add these lines to `backend/server.js`:

```javascript
// Add at the top with other route imports
const staffMachineMappingRoutes = require('./routes/staffMachineMapping');
const staffAttendanceLogRoutes = require('./routes/staffAttendanceLog');
const attendanceTimeSettingsRoutes = require('./routes/attendanceTimeSettings');

// Add with other app.use() statements
app.use('/api/staff-machine', staffMachineMappingRoutes);
app.use('/api/staff-attendance', staffAttendanceLogRoutes);
app.use('/api/attendance-time-settings', attendanceTimeSettingsRoutes);
```

## ✅ Step 3: Assign Machine IDs to Staff

### In List Staff Page:
1. Go to: `http://localhost:5173/list-staff`
2. You'll see a new "Machine ID" column
3. Click "Assign ID" for each staff member
4. System will suggest next available ID (1, 2, 3, etc.)

### Example:
- Ahmed → Machine ID: 1
- Sara → Machine ID: 2
- Mohamed → Machine ID: 3

## ✅ Step 4: Add Users to AI06 Device

### On the AI06 Device:
1. Go to: **MENU → User Management → Add User**
2. Enter Machine ID (e.g., 1 for Ahmed)
3. Enter Name (e.g., "Ahmed")
4. Enroll face
5. Save

Repeat for all staff members.

## ✅ Step 5: Configure Time Settings

### Option A: Use Default Settings
- Work Start: 08:00 AM
- Late After: 08:15 AM (15 min grace)
- Work End: 05:00 PM

### Option B: Customize Settings
1. Go to: `http://localhost:5173/hr/attendance-time-settings`
2. Click "Edit Settings"
3. Set your work hours
4. Set late threshold
5. Save

## ✅ Step 6: Test the System

### Test Flow:
1. Staff scans face on AI06 device
2. Device sends: `{userId: 1, name: "ahmed", time: "08:05:00"}`
3. System matches Machine ID 1 → Ahmed
4. System checks time: 08:05 is before 08:15 → **ON TIME** ✅
5. System saves to database
6. System displays on attendance page

### View Attendance:
```
http://localhost:5173/hr/attendance
```

You'll see:
- Staff name
- Machine ID
- Scan time
- Status (On Time / Late)
- Minutes late (if applicable)

## 📊 API Endpoints

### Machine ID Management
```
GET    /api/staff-machine/staff-machine-ids
POST   /api/staff-machine/assign-machine-id
GET    /api/staff-machine/staff-by-machine-id/:machineId
GET    /api/staff-machine/next-machine-id
```

### Attendance Logs
```
GET    /api/staff-attendance/logs
GET    /api/staff-attendance/today
GET    /api/staff-attendance/summary
GET    /api/staff-attendance/staff/:staffId/history
```

### Time Settings
```
GET    /api/attendance-time-settings/active
GET    /api/attendance-time-settings/all
POST   /api/attendance-time-settings/create
PUT    /api/attendance-time-settings/update/:id
DELETE /api/attendance-time-settings/delete/:id
```

## 🎯 How It Works

### 1. Staff Scans Face
```
AI06 Device → Backend (port 7788)
Data: {userId: 1, name: "ahmed", time: "08:30:00"}
```

### 2. System Looks Up Staff
```
Machine ID 1 → Staff Record (Ahmed)
```

### 3. System Checks Time
```
Scan Time: 08:30
Work Start: 08:00
Late Threshold: 08:15
Result: LATE (15 minutes late)
```

### 4. System Saves Log
```
StaffAttendanceLog:
- staffId: ahmed-uuid
- machineId: 1
- scanTime: 2026-02-10 08:30:00
- status: LATE
- minutesLate: 15
```

### 5. System Displays
```
Attendance Page shows:
Ahmed | ID: 1 | 08:30 AM | ❌ Late (15 min)
```

## 🎨 Features

### For Admins:
- ✅ Assign Machine IDs to staff
- ✅ View today's attendance
- ✅ See who's late
- ✅ See who's absent
- ✅ Export attendance reports
- ✅ Configure work hours

### For Staff:
- ✅ Scan face to log attendance
- ✅ View their attendance history
- ✅ See if they're on time or late

### Automatic:
- ✅ Real-time attendance tracking
- ✅ Automatic late detection
- ✅ Daily attendance summary
- ✅ Absent staff detection

## 📝 Example Scenarios

### Scenario 1: On Time
- **Staff:** Ahmed (Machine ID: 1)
- **Scan Time:** 07:55 AM
- **Work Start:** 08:00 AM
- **Result:** ✅ ON TIME (Early by 5 minutes)

### Scenario 2: Within Grace Period
- **Staff:** Sara (Machine ID: 2)
- **Scan Time:** 08:10 AM
- **Work Start:** 08:00 AM
- **Late Threshold:** 08:15 AM
- **Result:** ✅ ON TIME (Within grace period)

### Scenario 3: Late
- **Staff:** Mohamed (Machine ID: 3)
- **Scan Time:** 08:30 AM
- **Work Start:** 08:00 AM
- **Late Threshold:** 08:15 AM
- **Result:** ❌ LATE (15 minutes late)

## 🔧 Troubleshooting

### Issue: Machine ID not showing in List Staff
**Solution:** Run the setup script and restart backend

### Issue: Attendance not saving
**Solution:** Check backend logs for errors, verify database connection

### Issue: Wrong time calculation
**Solution:** Check time settings in Attendance Time Settings page

### Issue: Staff not found by Machine ID
**Solution:** Verify Machine ID is assigned in List Staff page

## 🎉 Success Indicators

- ✅ Machine IDs visible in List Staff page
- ✅ Staff can scan face on AI06 device
- ✅ Attendance logs appear in real-time
- ✅ On-time/late status calculated correctly
- ✅ Today's attendance shows all scans
- ✅ Absent staff list is accurate

## 📞 Next Steps

Once setup is complete:
1. Train staff to scan their faces daily
2. Monitor attendance from the dashboard
3. Generate monthly reports
4. Set up notifications for late arrivals (optional)
5. Integrate with payroll system (optional)

---

**Need help?** Check the implementation files or ask for assistance!
