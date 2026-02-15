# 🗑️ Clear All Attendance Data

## 🎯 Purpose

Delete all attendance records to start fresh for testing.

## ⚡ Quick Method

**Double-click this file:**
```
DELETE_ALL_ATTENDANCE.bat
```

This will:
1. Ask for confirmation
2. Delete all attendance records
3. Show success message

## 🔧 Manual Method

**Run this command:**
```bash
cd backend
node scripts/delete-all-attendance.js
```

## 📊 What Gets Deleted

- ✅ All attendance records from `staff_attendance_ethiopian` table
- ✅ All check-in/check-out times
- ✅ All attendance statuses (Present, Absent, Late, etc.)

## 🛡️ What's NOT Deleted

- ✅ Staff data (names, departments, etc.)
- ✅ Machine ID mappings
- ✅ Time settings
- ✅ Any other data

## 🧪 After Deletion

1. **Refresh the attendance page:**
   ```
   http://localhost:5173/hr/attendance
   ```

2. **You should see:**
   - Empty attendance grid
   - All cells showing "-"
   - Monthly summary showing 0 for all stats

3. **Now you can test:**
   - Mark attendance manually
   - Test bulk marking
   - Test check-in/check-out
   - Test with AI06 device scans

## ⚠️ Warning

**This action cannot be undone!**

All attendance records will be permanently deleted. Make sure you want to do this before running the script.

## 📝 Use Cases

### Use Case 1: Fresh Testing
- Delete old test data
- Start with clean slate
- Test new features

### Use Case 2: New Month
- Clear previous month's data
- Start tracking new month
- Reset statistics

### Use Case 3: Troubleshooting
- Remove corrupted data
- Fix duplicate records
- Reset after errors

## 🎯 Quick Test Flow

1. **Delete all attendance:**
   ```
   DELETE_ALL_ATTENDANCE.bat
   ```

2. **Refresh attendance page**
   - Should see empty grid

3. **Mark some attendance**
   - Click on a cell
   - Enter check-in time
   - Save

4. **Verify it appears**
   - Cell should show "P" badge
   - Time should display

5. **Test AI06 device**
   - Scan face on device
   - Should create new attendance record
   - Should appear in grid

## ✅ Success Indicators

After running the script, you should see:

```
✅ Deleted all attendance records
📊 Total records deleted: X

✅ ATTENDANCE DATA CLEARED!

📋 You can now test with a clean slate:
   1. Go to HR → Attendance System
   2. All cells should be empty
   3. Mark attendance to test
```

## 🔄 To Restore Data

If you need to restore attendance data:
1. You'll need to mark attendance again manually
2. Or import from backup (if you have one)
3. Or let staff scan on AI06 device to create new records

## 📞 Need Help?

If you encounter any errors:
1. Check backend console for error messages
2. Verify database connection
3. Make sure backend is running
4. Check if table exists

---

**Ready to clear attendance data?** Run `DELETE_ALL_ATTENDANCE.bat`
