# 🔧 Fix Auto-Marker Error

## ❌ Error You're Seeing

```
❌ Error in auto-marker: error: column "max_checkout_hours" does not exist
```

## ✅ Solution (2 Steps)

### Step 1: Add Database Columns

**Option A: Double-click the batch file**
```
Double-click: ADD_AUTO_MARKER_COLUMNS.bat
```

**Option B: Run manually**
```bash
cd backend
node add-auto-marker-columns.js
```

**You should see:**
```
🔧 Adding auto-marker columns...
✅ Columns added successfully!

📊 Current settings:
  Late Threshold: 08:15
  Half Day Threshold: 4
  Max Checkout Hours: 3
  Absent Threshold Time: 15:00

🎉 Setup complete! Now restart the backend server.
```

### Step 2: Restart Backend

```bash
cd backend
npm run dev
```

**You should now see:**
```
🤖 Attendance auto-marker started
🔍 Auto-marker checking attendance at 14:30...
```

**No more errors!** ✅

---

## 🎯 What This Does

Adds two new columns to `hr_attendance_time_settings` table:

1. **max_checkout_hours** (DECIMAL)
   - Default: 3.0 hours
   - How long to wait before marking "without check out"

2. **absent_threshold_time** (TIME)
   - Default: 15:00 (03:00 PM)
   - Time after which staff are marked absent

---

## 🧪 Verify It Worked

### Check Database:
```sql
SELECT * FROM hr_attendance_time_settings;
```

**Expected columns:**
- late_threshold
- half_day_threshold
- max_checkout_hours ← NEW!
- absent_threshold_time ← NEW!

---

## 🚀 After Setup

The auto-marker will now:
- ✅ Run every minute
- ✅ Mark "without check out" after 3 hours
- ✅ Mark "ABSENT" after 03:00 PM
- ✅ Override with "LEAVE" if approved

---

## 📞 Still Having Issues?

### Issue: Script doesn't run
**Solution:** Make sure you're in the backend folder
```bash
cd backend
node add-auto-marker-columns.js
```

### Issue: Database connection error
**Solution:** Check .env file has DATABASE_URL
```
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

### Issue: Permission denied
**Solution:** Run as administrator or check database permissions

---

## ✅ Success Checklist

- [ ] Ran ADD_AUTO_MARKER_COLUMNS.bat
- [ ] Saw "✅ Columns added successfully!"
- [ ] Restarted backend server
- [ ] Saw "🤖 Attendance auto-marker started"
- [ ] No more errors in console

---

**Once columns are added, the auto-marker will work perfectly!** 🎉
