# ⚡ Fix Attendance Error - QUICK GUIDE

## Error You're Seeing:
```
Error: column "check_in" of relation "hr_ethiopian_attendance" does not exist
```

---

## ⚡ QUICKEST FIX (30 seconds):

### Step 1: Drop the old table

**Double-click this file:**
```
DROP_ATTENDANCE_TABLE.bat
```

### Step 2: Restart backend server

Press `Ctrl+C` in your backend terminal, then run:
```
npm start
```

### Step 3: Try again

Go to HR → Attendance System and try bulk marking.

**Done!** ✅

---

## Why This Works:

The old table has the wrong structure. When you drop it and restart the server, it will automatically create a new table with the correct structure (check_in, check_out, working_hours columns).

---

## Alternative (If you want to keep old data):

Run this instead:
```
MIGRATE_ATTENDANCE_TABLE.bat
```

This will backup and migrate your old attendance records.

---

## Still Having Issues?

1. **Did you restart the backend?** (Most common mistake!)
2. Check if the backend is running without errors
3. Make sure you can connect to the database
4. Try refreshing your browser

---

**Quick Action**: `DROP_ATTENDANCE_TABLE.bat` → Restart Backend → Try Again
