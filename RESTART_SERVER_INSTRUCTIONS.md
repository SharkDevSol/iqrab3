# Server Restart Instructions

## The Issue
The backend code has been updated to fix the 500 error, but the changes won't take effect until the server is restarted.

## Current Error
```
GET http://localhost:5000/api/guardian-attendance/student/C/week_2025_12_15/4 500 (Internal Server Error)
```

This happens because:
1. Class "C" doesn't have an attendance schema (`class_C_weekly_attendance`)
2. The old code was throwing errors instead of returning empty arrays
3. The new code handles this gracefully but needs to be loaded

## How to Restart the Server

### Option 1: Stop and Start (Recommended)
1. Find the terminal/command prompt running the backend server
2. Press `Ctrl+C` to stop the server
3. Run: `node server.js` or `npm start` (depending on your setup)
4. Wait for "Server running on port 5000" message

### Option 2: Using nodemon (if installed)
If you're using nodemon, it should auto-restart. If not:
1. Stop the current server (`Ctrl+C`)
2. Run: `nodemon server.js`

### Option 3: Using PM2 (if installed)
```bash
pm2 restart server
```

## After Restart

The guardian attendance page should now:
- ✅ Show "No attendance data" instead of errors
- ✅ Display empty state with friendly message
- ✅ Allow switching between wards without crashes
- ✅ Work for classes with attendance data
- ✅ Gracefully handle classes without attendance data

## Verify the Fix

1. Navigate to Guardian Profile → Attendance tab
2. You should see one of these:
   - **If attendance exists**: Weekly attendance grid with P/A/L indicators
   - **If no attendance**: "No attendance periods found" message (not an error)

## What Was Fixed

### Backend Changes (`backend/routes/guardianAttendanceRoutes.js`)
- Added schema existence check
- Added class table existence check
- Return empty arrays instead of 404/500 errors
- Better error logging for debugging

### Frontend Changes (`APP/src/COMPONENTS/GuardianProfile.jsx`)
- Fixed infinite loop by removing `toast` from dependencies
- Better error handling
- Graceful empty states

## Troubleshooting

### Still Getting 500 Error?
- Make sure you restarted the backend server
- Check the terminal for error messages
- Verify the file was saved: `backend/routes/guardianAttendanceRoutes.js`

### Empty State Showing But Should Have Data?
- Check if attendance schema exists for the class
- Run this SQL to verify:
  ```sql
  SELECT schema_name 
  FROM information_schema.schemata 
  WHERE schema_name LIKE 'class_%_weekly_attendance';
  ```

### Need to Create Attendance Schema?
If you want to set up attendance for class "C":
1. Use the attendance setup scripts
2. Or contact the system administrator
3. The schema should be named: `class_C_weekly_attendance`

## Quick Test

After restarting, test with this URL in your browser:
```
http://localhost:5000/api/guardian-attendance/tables/C
```

**Expected Response**: `[]` (empty array, not an error)

---

**Status**: Waiting for server restart
**Priority**: High
**Action Required**: Restart backend server
