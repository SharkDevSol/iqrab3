# Staff Attendance System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you set up and start using the staff attendance system immediately.

---

## Prerequisites

- ✅ Node.js installed
- ✅ PostgreSQL database running
- ✅ React development environment
- ✅ Backend server configured

---

## Installation Steps

### 1. Database Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Run the SQL schema
psql -U your_username -d your_database -f database/staff_attendance_schema.sql
```

**Verify Installation**:
```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'staff_attendance%';

-- Should return:
-- staff_attendance
-- staff_attendance_pending
-- staff_attendance_logs
```

### 2. Backend Setup (1 minute)

The route is already added to `server.js`. Just restart your server:

```bash
# In backend directory
npm start
```

**Test the API**:
```bash
curl http://localhost:5000/api/staff-attendance/status/TEST001
```

### 3. Frontend Setup (2 minutes)

Add routes to your main routing file (e.g., `App.jsx`):

```javascript
import { StaffAttendanceSystem, AttendanceRecords } from './PAGE/StaffAttendanceSystem';

// Inside your Routes component:
<Route path="/staff-attendance" element={<StaffAttendanceSystem />} />
<Route path="/attendance-records" element={<AttendanceRecords />} />
```

**Start the frontend**:
```bash
# In APP directory
npm run dev
```

---

## First Use

### For Staff Members

1. **Login** to your account
2. **Navigate** to `/staff-attendance`
3. **Click "Clock In"**
   - Teachers: Click "Confirm Arrival" after Step 1
   - General Staff: Done immediately
4. **Click "Clock Out"** when leaving

### For Administrators

1. **Navigate** to `/attendance-records`
2. **Apply filters** (date range, role, staff ID)
3. **View records** or switch to Summary tab
4. **Export CSV** for reports

---

## Testing the System

### Test Teacher Flow

```bash
# Step 1: Clock in
curl -X POST http://localhost:5000/api/staff-attendance/clock-in/step1 \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "T001",
    "role": "Teacher",
    "name": "John Doe"
  }'

# Response will include pendingId

# Step 2: Confirm arrival (use pendingId from Step 1)
curl -X POST http://localhost:5000/api/staff-attendance/clock-in/step2 \
  -H "Content-Type: application/json" \
  -d '{
    "pendingId": 1,
    "staffId": "T001"
  }'
```

### Test General Staff Flow

```bash
# Clock in (single step)
curl -X POST http://localhost:5000/api/staff-attendance/clock-in/step1 \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "GS001",
    "role": "General Staff",
    "name": "Jane Smith"
  }'
```

### Test Clock Out

```bash
curl -X POST http://localhost:5000/api/staff-attendance/clock-out \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "T001"
  }'
```

---

## Common Issues & Solutions

### Issue: "Cannot find module 'staffAttendanceRoutes'"
**Solution**: Ensure the file exists at `backend/routes/staffAttendanceRoutes.js`

### Issue: Database connection error
**Solution**: Check your `.env` file has correct `DATABASE_URL`

### Issue: CORS error in browser
**Solution**: Verify `http://localhost:5173` is in allowed origins in `server.js`

### Issue: Teacher verification expires
**Solution**: Complete Step 2 within 10 minutes of Step 1

---

## Understanding the Logic

### Teacher (Two-Step Verification)

```
User Action          | System Response
---------------------|----------------------------------
Click "Clock In"     | → Capture Step 1 timestamp
                     | → Save to pending table
                     | → Show "Confirm Arrival" button
                     |
Click "Confirm"      | → Capture Step 2 timestamp
                     | → Create final attendance record
                     | → Mark as "verified"
                     | → Complete pending record
```

### General Staff (Single-Step)

```
User Action          | System Response
---------------------|----------------------------------
Click "Clock In"     | → Capture timestamp
                     | → Create attendance record
                     | → Mark as "single_step"
                     | → Show confirmation
```

---

## Key Features at a Glance

| Feature | Teachers | General Staff |
|---------|----------|---------------|
| Clock In Steps | 2 | 1 |
| Verification | Required | Not required |
| Timestamps Recorded | 2 (Step 1 & 2) | 1 |
| Status | "verified" | "single_step" |
| Clock Out | Same process | Same process |

---

## Data Flow Diagram

```
┌─────────────┐
│   Staff     │
│   Member    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Is Role = "Teacher"?               │
└──────┬──────────────────────┬───────┘
       │ YES                  │ NO
       ▼                      ▼
┌──────────────┐      ┌──────────────┐
│  Step 1:     │      │  Single Step │
│  Timestamp 1 │      │  Timestamp   │
└──────┬───────┘      └──────┬───────┘
       │                     │
       ▼                     │
┌──────────────┐             │
│  Step 2:     │             │
│  Timestamp 2 │             │
└──────┬───────┘             │
       │                     │
       └──────────┬──────────┘
                  ▼
         ┌────────────────┐
         │   Attendance   │
         │     Record     │
         └────────────────┘
```

---

## Sample Data

After testing, your database should have records like:

```sql
SELECT * FROM staff_attendance;

 id | staff_id | staff_name  |     role      |    date    |      time_in        |      time_out       | verification_status
----+----------+-------------+---------------+------------+---------------------+---------------------+--------------------
  1 | T001     | John Doe    | Teacher       | 2026-01-29 | 2026-01-29 08:00:00 | 2026-01-29 16:30:00 | verified
  2 | GS001    | Jane Smith  | General Staff | 2026-01-29 | 2026-01-29 08:15:00 | 2026-01-29 17:00:00 | single_step
```

---

## Next Steps

1. ✅ **Customize**: Adjust UI colors and branding
2. ✅ **Integrate**: Connect with your existing staff management
3. ✅ **Train**: Educate staff on the two-step process
4. ✅ **Monitor**: Review attendance data regularly
5. ✅ **Expand**: Add features like leave integration

---

## Quick Reference

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/staff-attendance/clock-in/step1` | POST | Initial clock in |
| `/api/staff-attendance/clock-in/step2` | POST | Teacher confirmation |
| `/api/staff-attendance/clock-out` | POST | Clock out |
| `/api/staff-attendance/status/:staffId` | GET | Check today's status |
| `/api/staff-attendance/records` | GET | Get attendance records |
| `/api/staff-attendance/summary` | GET | Get summary report |

### Frontend Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/staff-attendance` | StaffAttendanceSystem | All Staff |
| `/attendance-records` | AttendanceRecords | Administrators |

---

## Support & Documentation

- 📖 **Full Documentation**: `STAFF_ATTENDANCE_SYSTEM.md`
- 📊 **Excel Template**: `STAFF_ATTENDANCE_EXCEL_TEMPLATE.md`
- 🐛 **Issues**: Check database logs and browser console
- 💡 **Tips**: Review the "How It Works" section in the UI

---

## Success Checklist

- [ ] Database tables created
- [ ] Backend route added and server restarted
- [ ] Frontend routes configured
- [ ] Test teacher flow (2-step)
- [ ] Test general staff flow (1-step)
- [ ] Test clock out
- [ ] View records in admin panel
- [ ] Export CSV report
- [ ] Train staff members
- [ ] Monitor first week of usage

---

## Congratulations! 🎉

Your staff attendance system is now ready to use. Staff members can start clocking in/out, and administrators can monitor attendance in real-time.

For detailed information, refer to the complete documentation in `STAFF_ATTENDANCE_SYSTEM.md`.
