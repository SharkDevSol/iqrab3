# Staff Attendance System Documentation

## Overview

A comprehensive staff attendance tracking system with role-based verification logic. The system distinguishes between **Teachers** (requiring two-step verification) and **General Staff** (single-step sign-in), ensuring secure and accurate time tracking.

---

## System Architecture

### Components

1. **Frontend (React)**
   - `StaffAttendanceSystem.jsx` - Main attendance interface for staff
   - `AttendanceRecords.jsx` - Admin view for records and reports
   - CSS Modules for styling

2. **Backend (Node.js/Express)**
   - `staffAttendanceRoutes.js` - API endpoints for attendance operations
   - PostgreSQL database for data storage

3. **Database**
   - `staff_attendance` - Main attendance records
   - `staff_attendance_pending` - Temporary storage for teacher verification
   - `staff_attendance_logs` - Audit trail

---

## User Roles

### 1. Teacher
- **Verification Type**: Two-Step
- **Process**:
  1. **Step 1**: Click "Clock In" → System captures first timestamp
  2. **Step 2**: Click "Confirm Arrival" → System captures second timestamp
  3. Both timestamps are recorded for verification
  4. Status marked as "verified"

### 2. General Staff
- **Verification Type**: Single-Step
- **Process**:
  1. Click "Clock In" → Immediate attendance record created
  2. Single timestamp captured
  3. Status marked as "single_step"

---

## Features

### For Staff Members

#### Clock In
- **Teachers**: Two-step verification process
  - Step 1: Initial timestamp capture
  - Step 2: Confirmation timestamp (within 10 minutes)
  - Both timestamps stored for audit
  
- **General Staff**: Single-step process
  - Immediate attendance record creation
  - Single timestamp capture

#### Clock Out
- Available for all staff who have clocked in
- Records departure time
- Calculates total hours worked

#### Real-Time Status
- Live clock display
- Current attendance status
- Pending verification alerts (for teachers)
- Today's attendance summary

### For Administrators

#### Attendance Records View
- **Filters**:
  - Staff ID
  - Date range (start/end)
  - Role (Teacher, General Staff, etc.)
  
- **Display**:
  - Staff details
  - Clock in/out times
  - Hours worked
  - Verification status

#### Summary Reports
- Total days worked
- Complete vs incomplete days
- Average hours per staff member
- Role-based grouping

#### Export Functionality
- CSV export for records
- CSV export for summary reports
- Date-stamped file names

---

## Database Schema

### staff_attendance
```sql
CREATE TABLE staff_attendance (
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time_in TIMESTAMP NOT NULL,
    time_out TIMESTAMP,
    step1_timestamp TIMESTAMP,      -- Teacher: First confirmation
    step2_timestamp TIMESTAMP,      -- Teacher: Second confirmation
    verification_status VARCHAR(20), -- 'single_step' or 'verified'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, date)
);
```

### staff_attendance_pending
```sql
CREATE TABLE staff_attendance_pending (
    id SERIAL PRIMARY KEY,
    staff_id VARCHAR(50) NOT NULL,
    staff_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    step1_timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'pending_step2',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes')
);
```

### staff_attendance_logs
```sql
CREATE TABLE staff_attendance_logs (
    id SERIAL PRIMARY KEY,
    attendance_id INTEGER REFERENCES staff_attendance(id),
    action VARCHAR(50) NOT NULL,
    performed_by VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);
```

---

## API Endpoints

### POST /api/staff-attendance/clock-in/step1
**Description**: Initial clock-in (Step 1 for teachers, complete for general staff)

**Request Body**:
```json
{
  "staffId": "T001",
  "role": "Teacher",
  "name": "John Doe"
}
```

**Response (Teacher)**:
```json
{
  "success": true,
  "requiresStep2": true,
  "pendingId": 123,
  "step1Timestamp": "2026-01-29T08:00:00Z",
  "message": "Step 1 complete. Please confirm arrival."
}
```

**Response (General Staff)**:
```json
{
  "success": true,
  "requiresStep2": false,
  "attendance": { /* attendance record */ },
  "message": "Clocked in successfully"
}
```

---

### POST /api/staff-attendance/clock-in/step2
**Description**: Teacher confirmation (Step 2)

**Request Body**:
```json
{
  "pendingId": 123,
  "staffId": "T001"
}
```

**Response**:
```json
{
  "success": true,
  "attendance": { /* complete attendance record */ },
  "message": "Teacher attendance verified and recorded"
}
```

---

### POST /api/staff-attendance/clock-out
**Description**: Clock out for all staff

**Request Body**:
```json
{
  "staffId": "T001"
}
```

**Response**:
```json
{
  "success": true,
  "attendance": { /* updated attendance record */ },
  "message": "Clocked out successfully"
}
```

---

### GET /api/staff-attendance/status/:staffId
**Description**: Get today's attendance status

**Response**:
```json
{
  "hasClockIn": true,
  "hasClockOut": false,
  "hasPendingVerification": false,
  "attendance": { /* attendance record */ },
  "pending": null
}
```

---

### GET /api/staff-attendance/records
**Description**: Get attendance records with filters

**Query Parameters**:
- `staffId` (optional)
- `startDate` (optional)
- `endDate` (optional)
- `role` (optional)

**Response**:
```json
{
  "success": true,
  "records": [ /* array of attendance records */ ],
  "count": 25
}
```

---

### GET /api/staff-attendance/summary
**Description**: Get attendance summary/report

**Query Parameters**:
- `startDate` (optional)
- `endDate` (optional)
- `role` (optional)

**Response**:
```json
{
  "success": true,
  "summary": [
    {
      "staff_id": "T001",
      "staff_name": "John Doe",
      "role": "Teacher",
      "total_days": 20,
      "complete_days": 18,
      "incomplete_days": 2,
      "avg_hours": "7.5"
    }
  ]
}
```

---

## Logic Flow

### Teacher Arrival (Two-Step Verification)

```
1. Teacher clicks "Clock In"
   ↓
2. System captures Step 1 timestamp
   ↓
3. Record saved to staff_attendance_pending
   ↓
4. UI shows "Confirm Arrival" button
   ↓
5. Teacher clicks "Confirm Arrival"
   ↓
6. System captures Step 2 timestamp
   ↓
7. Final record created in staff_attendance
   - time_in = Step 2 timestamp
   - step1_timestamp = Step 1 timestamp
   - step2_timestamp = Step 2 timestamp
   - verification_status = 'verified'
   ↓
8. Pending record marked as 'completed'
```

### General Staff Arrival (Single-Step)

```
1. Staff clicks "Clock In"
   ↓
2. System captures timestamp
   ↓
3. Record immediately created in staff_attendance
   - time_in = current timestamp
   - verification_status = 'single_step'
   ↓
4. Confirmation message displayed
```

### Departure (All Staff)

```
1. Staff clicks "Clock Out"
   ↓
2. System finds today's attendance record
   ↓
3. Updates time_out field
   ↓
4. Calculates hours worked
   ↓
5. Confirmation message displayed
```

---

## Security Features

1. **Two-Step Verification for Teachers**
   - Prevents accidental or fraudulent clock-ins
   - Both timestamps recorded for audit trail
   - 10-minute expiration on pending verifications

2. **Unique Constraint**
   - One attendance record per staff per day
   - Prevents duplicate entries

3. **Audit Logging**
   - All clock-in/out actions logged
   - Timestamp and user tracking
   - JSONB details for flexibility

4. **Role-Based Access**
   - Staff can only manage their own attendance
   - Admins can view all records
   - Export functionality for authorized users

---

## Installation & Setup

### 1. Database Setup

```bash
# Run the SQL schema
psql -U your_user -d your_database -f backend/database/staff_attendance_schema.sql
```

### 2. Backend Setup

```javascript
// In backend/server.js, add the route
const staffAttendanceRoutes = require('./routes/staffAttendanceRoutes');
app.use('/api/staff-attendance', staffAttendanceRoutes);
```

### 3. Frontend Integration

```javascript
// In your routing file (e.g., App.jsx)
import { StaffAttendanceSystem, AttendanceRecords } from './PAGE/StaffAttendanceSystem';

// Add routes
<Route path="/staff-attendance" element={<StaffAttendanceSystem />} />
<Route path="/attendance-records" element={<AttendanceRecords />} />
```

---

## Usage Examples

### Staff Member Usage

1. **Morning Arrival**:
   - Open attendance system
   - Click "Clock In"
   - (Teachers only) Click "Confirm Arrival"
   - See confirmation message

2. **End of Day**:
   - Open attendance system
   - Click "Clock Out"
   - See hours worked summary

### Administrator Usage

1. **View Daily Records**:
   - Open Attendance Records
   - Select date range
   - Apply filters
   - Review attendance data

2. **Generate Report**:
   - Switch to "Summary Report" tab
   - Select date range and role
   - Click "Export CSV"
   - Open file in Excel/Sheets

---

## Data Output Format

### Attendance Log Entry

```json
{
  "id": 1,
  "staff_id": "T001",
  "staff_name": "John Doe",
  "role": "Teacher",
  "date": "2026-01-29",
  "time_in": "2026-01-29T08:00:00Z",
  "time_out": "2026-01-29T16:30:00Z",
  "step1_timestamp": "2026-01-29T07:59:45Z",
  "step2_timestamp": "2026-01-29T08:00:00Z",
  "verification_status": "verified",
  "notes": null,
  "created_at": "2026-01-29T08:00:00Z",
  "updated_at": "2026-01-29T16:30:00Z"
}
```

### CSV Export Format

**Records Export**:
```csv
Staff ID,Name,Role,Date,Time In,Time Out,Hours,Verification
T001,John Doe,Teacher,2026-01-29,08:00:00,16:30:00,8.50,verified
GS001,Jane Smith,General Staff,2026-01-29,08:15:00,17:00:00,8.75,single_step
```

**Summary Export**:
```csv
Staff ID,Name,Role,Total Days,Complete Days,Incomplete Days,Avg Hours
T001,John Doe,Teacher,20,18,2,7.50
GS001,Jane Smith,General Staff,22,22,0,8.25
```

---

## Troubleshooting

### Issue: Teacher verification expires
**Solution**: Pending verifications expire after 10 minutes. Staff must complete Step 2 within this timeframe or restart the process.

### Issue: Cannot clock out
**Solution**: Ensure there's an active clock-in for today. Check the status endpoint to verify.

### Issue: Duplicate entry error
**Solution**: Only one attendance record per staff per day is allowed. Use clock-out to update existing record.

---

## Future Enhancements

1. **Biometric Integration**: Fingerprint or facial recognition
2. **Geolocation**: Verify staff is on campus
3. **Mobile App**: Native iOS/Android apps
4. **Notifications**: SMS/Email alerts for missed clock-ins
5. **Leave Integration**: Connect with leave management system
6. **Shift Management**: Support for multiple shifts
7. **Overtime Tracking**: Automatic overtime calculation
8. **Dashboard Analytics**: Visual charts and graphs

---

## Support

For issues or questions:
- Check the API documentation
- Review database logs
- Contact system administrator
- Submit bug reports with detailed logs

---

## License

Internal use only. All rights reserved.
