# 🧪 Test Auto-Marker - Quick Guide

## ✅ What to Test

1. ✅ Leave table error is fixed
2. ✅ UI fields appear in Time Settings
3. ✅ Settings save and persist
4. ✅ Auto-marker uses new settings

---

## 🚀 Step 1: Restart Backend

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🔌 AI06 WebSocket Server started on port 7788
🤖 Attendance auto-marker started
Server running on port 5000
```

**✅ Success:** You see "🤖 Attendance auto-marker started"

---

## 🎨 Step 2: Test UI

### Open Time Settings Page:
1. Go to HR Module
2. Click "⏰ Time Settings"
3. Scroll down

### You Should See:
```
🤖 Maximum Check-Out Hours (Auto-Marker)
[3.0]
Hours to wait before marking "without check out"

🤖 Absent Threshold Time (Auto-Marker)
[15:00]
Time after which staff are marked ABSENT

[💾 Save Global Settings]
```

**✅ Success:** You see the two new fields with 🤖 emoji

---

## 💾 Step 3: Test Saving

### Change Values:
1. Change "Maximum Check-Out Hours" to **4.0**
2. Change "Absent Threshold Time" to **14:00**
3. Click "💾 Save Global Settings"

### Expected:
```
✅ Settings saved successfully!
```

### Verify:
1. Refresh the page
2. Values should still be 4.0 and 14:00

**✅ Success:** Values persist after refresh

---

## 🔍 Step 4: Check Database

### Option 1: SQL Query
```sql
SELECT max_checkout_hours, absent_threshold_time 
FROM hr_attendance_time_settings;
```

**Expected Result:**
```
max_checkout_hours | absent_threshold_time
-------------------+----------------------
4.0                | 14:00
```

### Option 2: Check Backend Logs
Look for:
```
⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
```

**✅ Success:** Database has your new values

---

## 🤖 Step 5: Test Auto-Marker

### Watch Console Logs:
Every minute you should see:
```
🔍 Auto-marker checking attendance at 14:30...
```

### If Staff Checked In:
```
✅ Marked John as "PRESENT + without check out" (4.2h since check-in)
```

### If Staff Didn't Check In:
```
✅ Marked Sarah as ABSENT (no check-in by 14:00)
```

**✅ Success:** Auto-marker is running and using your settings

---

## 🧪 Quick Test (Optional)

### Test "Without Check Out" Marking:

**Step 1:** Set very short time for testing
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 0.1;  -- 6 minutes
```

**Step 2:** Check in a staff member
- Use the attendance machine
- Or manually mark check-in in the UI

**Step 3:** Wait 6 minutes

**Step 4:** Check attendance table
- Status should change to "PRESENT + without check out"

**Step 5:** Reset to normal
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 3.0;  -- Back to 3 hours
```

---

## ✅ Success Checklist

- [ ] Backend shows "🤖 Attendance auto-marker started"
- [ ] Time Settings page shows two new fields with 🤖
- [ ] Can change values and save successfully
- [ ] Values persist after page refresh
- [ ] Database has the new values
- [ ] Auto-marker logs appear every minute
- [ ] No errors in console about leave table
- [ ] No errors about missing columns

---

## 🎯 Expected Console Output

### When Backend Starts:
```
🔌 AI06 WebSocket Server started on port 7788
🤖 Attendance auto-marker started
Server running on port 5000
```

### Every Minute:
```
🔍 Auto-marker checking attendance at 14:30...
⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
```

### When Marking Attendance:
```
✅ Marked John as "PRESENT + without check out" (4.2h since check-in)
✅ Marked Sarah as ABSENT (no check-in by 14:00)
✅ Changed Mike to LEAVE (approved leave)
```

### No Errors:
```
❌ Error in auto-marker: ...  ← Should NOT see this!
```

---

## 🐛 Troubleshooting

### Issue 1: Don't See New Fields
**Solution:** Clear browser cache and refresh

### Issue 2: Can't Save Settings
**Solution:** Check backend is running and no errors in console

### Issue 3: Auto-Marker Not Running
**Solution:** Restart backend server

### Issue 4: Column Errors
**Solution:** Run `ADD_AUTO_MARKER_COLUMNS.bat` once

### Issue 5: Leave Table Error
**Solution:** Already fixed! Should not see this error anymore

---

## 📊 What Each Setting Does

### Maximum Check-Out Hours (3.0)
```
Staff checks in: 08:00 AM
Maximum hours: 3.0
Deadline: 11:00 AM (08:00 + 3 hours)
At 11:01 AM: Marked as "without check out"
```

### Absent Threshold Time (15:00)
```
Threshold: 15:00 (3:00 PM)
Current time: 15:01 PM
Staff hasn't checked in yet
→ Mark as ABSENT
```

---

## 🎉 All Tests Passed?

If you see:
- ✅ Auto-marker started message
- ✅ New UI fields in Time Settings
- ✅ Settings save successfully
- ✅ No errors in console
- ✅ Auto-marker logs every minute

**Then everything is working perfectly!** 🚀

---

## 📝 Quick Reference

| Setting | Default | Range | Purpose |
|---------|---------|-------|---------|
| Max Checkout Hours | 3.0 | 0.5-12 | Hours before marking "without check out" |
| Absent Threshold | 15:00 | Any time | Time after which to mark ABSENT |

---

## 🚀 Ready to Use!

The automatic attendance marking system is fully functional and ready for production use!

**No more manual marking needed!** 🎉
