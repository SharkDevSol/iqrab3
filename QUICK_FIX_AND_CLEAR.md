# ⚡ Quick Fix: Clear Attendance Data

## 🎯 Two Issues Fixed

1. ✅ **Table name issue** - Script now handles different table names
2. ✅ **Port 7788 in use** - Batch file now kills old processes first

## 🚀 Run This Now

**Double-click:**
```
DELETE_ALL_ATTENDANCE.bat
```

This will:
1. Kill any running Node processes (frees port 7788)
2. Delete all attendance data
3. Show success message

## 📊 What Happens

The script will:
- ✅ Try to delete from `staff_attendance_ethiopian` table
- ✅ Try to delete from `StaffAttendanceLog` table
- ✅ Skip tables that don't exist (no error)
- ✅ Show how many records were deleted

## 🧪 After Running

1. **Restart backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Refresh attendance page:**
   ```
   http://localhost:5173/hr/attendance
   ```

3. **You should see:**
   - Empty attendance grid
   - All cells showing "-"
   - Monthly summary: 0 for all stats

## ✅ Success Output

You should see something like:
```
📋 Checking for attendance tables...
✅ Deleted 26 records from staff_attendance_ethiopian
ℹ️  Table StaffAttendanceLog does not exist (skipping)

✅ ATTENDANCE DATA CLEARED!

📋 You can now test with a clean slate:
   1. Go to HR → Attendance System
   2. All cells should be empty
   3. Mark attendance to test
```

## 🔧 If Port 7788 Still In Use

If you still get the port error, manually kill Node:
```bash
taskkill /F /IM node.exe
```

Then restart backend:
```bash
cd backend
npm run dev
```

## 📝 Files Updated

- ✅ `backend/scripts/delete-all-attendance.js` - Fixed table name handling
- ✅ `DELETE_ALL_ATTENDANCE.bat` - Added process killing

**Ready to clear the data?** Run `DELETE_ALL_ATTENDANCE.bat` now! 🚀
