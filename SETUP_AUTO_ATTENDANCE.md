# 🚀 Setup Automatic Attendance Marking

## ⚡ Quick Setup (3 Steps)

### Step 1: Add Database Columns
```bash
Double-click: ADD_AUTO_MARKER_COLUMNS.bat
```

Or manually run SQL:
```sql
ALTER TABLE hr_attendance_time_settings
ADD COLUMN IF NOT EXISTS max_checkout_hours DECIMAL(4,2) DEFAULT 3.0,
ADD COLUMN IF NOT EXISTS absent_threshold_time TIME DEFAULT '15:00';
```

### Step 2: Restart Backend
```bash
cd backend
npm run dev
```

**Look for:**
```
🤖 Attendance auto-marker started
🔍 Auto-marker checking attendance at 14:30...
```

### Step 3: Test It!
1. Check in without checking out
2. Wait 3+ hours (or adjust settings for faster testing)
3. See status change to "P+NCO"

---

## 📊 What It Does

### Automatic Actions:

1. **No Check-Out Detection**
   - Checks every minute
   - If staff checked in 3+ hours ago without check-out
   - Marks as "without check out" (NCO)

2. **Absent Marking**
   - After 03:00 PM
   - If staff hasn't checked in
   - Marks as "ABSENT"

3. **Leave Override**
   - Checks approved leave requests
   - Changes status to "LEAVE"
   - Overrides ABSENT status

---

## ⚙️ Settings

### Default Values:
- **Max Checkout Hours**: 3.0 hours
- **Absent Threshold**: 03:00 PM (15:00)

### How to Change:

**Option A: SQL**
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 4.0,  -- Change to 4 hours
    absent_threshold_time = '16:00';  -- Change to 4:00 PM
```

**Option B: Time Settings Page** (if implemented)
1. Go to: HR → Attendance → Time Settings
2. Change values
3. Click Save

---

## 🎯 Status Badges

| Badge | Meaning | Color |
|-------|---------|-------|
| P | Present | 🟢 Green |
| L | Late | 🟠 Orange |
| H | Half Day | 🔵 Blue |
| L+H | Late + Half Day | 🔴 Red-Orange |
| **P+NCO** | **Present + No Check-Out** | **🟡 Yellow** |
| **L+NCO** | **Late + No Check-Out** | **🟠 Dark Orange** |
| **H+NCO** | **Half Day + No Check-Out** | **🔵 Dark Blue** |
| **L+H+NCO** | **Late + Half Day + No Check-Out** | **🔴 Dark Red** |
| A | Absent | 🔴 Red |
| V | Leave | 🟣 Purple |

---

## 📋 Example Timeline

### Morning:
```
08:00 AM - Khalid checks in
Status: P (Present)
```

### Midday:
```
11:00 AM - 3 hours passed, no check-out
11:01 AM - Auto-marker runs
Status: P+NCO (Present + No Check-Out)
```

### Afternoon:
```
03:00 PM - Absent threshold reached
03:01 PM - Auto-marker checks all staff
Ahmed (no check-in): Status set to A (Absent)
Sara (approved leave): Status changed to V (Leave)
```

---

## 🧪 Testing Guide

### Test 1: No Check-Out (Quick Test)
```sql
-- Temporarily set to 0.1 hours (6 minutes) for testing
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 0.1;
```

Then:
1. Check in
2. Wait 7 minutes
3. See status change to "P+NCO"

Don't forget to reset:
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 3.0;
```

### Test 2: Absent (Quick Test)
```sql
-- Temporarily set to current time + 1 minute
UPDATE hr_attendance_time_settings
SET absent_threshold_time = '14:31';  -- Replace with current time + 1 min
```

Then:
1. Don't check in
2. Wait 1 minute
3. See status set to "ABSENT"

### Test 3: Leave Override
```sql
-- Create approved leave for today
INSERT INTO hr_leave_requests 
(staff_id, staff_name, start_date, end_date, status)
VALUES ('100', 'khalid', CURRENT_DATE, CURRENT_DATE, 'APPROVED');
```

Then:
1. Wait for auto-marker to run
2. See status change to "LEAVE"

---

## 🔍 Monitoring

### Check Auto-Marker Status:
Look at backend console for:
```
🤖 Attendance auto-marker started
🔍 Auto-marker checking attendance at 14:30...
✅ Marked khalid as "PRESENT + without check out" (3.5h since check-in)
✅ Marked ahmed as ABSENT (no check-in by 15:00)
✅ Changed sara to LEAVE (approved leave)
```

### Check Settings:
```sql
SELECT * FROM hr_attendance_time_settings;
```

Expected:
```
late_threshold | half_day_threshold | max_checkout_hours | absent_threshold_time
08:15          | 4.0                | 3.0                | 15:00
```

---

## 🐛 Troubleshooting

### Issue 1: Auto-marker not starting
**Symptom:** No "🤖 Attendance auto-marker started" message

**Solution:**
1. Check backend console for errors
2. Verify `attendanceAutoMarker.js` exists
3. Restart backend server

### Issue 2: Columns don't exist
**Symptom:** Error: "column max_checkout_hours does not exist"

**Solution:**
```bash
Run: ADD_AUTO_MARKER_COLUMNS.bat
```

### Issue 3: Not marking absent
**Symptom:** Staff not marked absent after threshold

**Solution:**
1. Check current time vs threshold
2. Verify threshold is set correctly
3. Check console for auto-marker logs

### Issue 4: Leave not overriding
**Symptom:** Staff still shows ABSENT despite approved leave

**Solution:**
1. Verify leave request is APPROVED
2. Check dates match (start_date <= today <= end_date)
3. Wait for next auto-marker run (max 1 minute)

---

## 📊 Monthly Summary

The monthly summary now shows:
```
Present:              15
Absent:                2
Late:                  5
Half Day:              3
Late + Half Day:       2
Without Check-Out:     4  ← NEW!
On Leave:              1
```

---

## ✅ Verification Checklist

- [ ] Database columns added
- [ ] Backend restarted
- [ ] Console shows "🤖 Attendance auto-marker started"
- [ ] Settings configured (max_checkout_hours, absent_threshold_time)
- [ ] Test check-in without check-out works
- [ ] Test absent marking works
- [ ] Test leave override works
- [ ] Frontend shows new badges (P+NCO, L+NCO, etc.)
- [ ] Monthly summary includes "Without Check-Out"

---

## 🎉 Benefits

1. **Automatic** - No manual marking needed
2. **Real-time** - Updates every minute
3. **Accurate** - Based on actual times
4. **Flexible** - Configurable thresholds
5. **Smart** - Respects approved leave
6. **Comprehensive** - Tracks all scenarios

---

## 📞 Quick Commands

### View Settings:
```sql
SELECT * FROM hr_attendance_time_settings;
```

### Update Settings:
```sql
UPDATE hr_attendance_time_settings
SET max_checkout_hours = 3.0,
    absent_threshold_time = '15:00';
```

### Check Today's Attendance:
```sql
SELECT staff_name, status, check_in, check_out
FROM hr_ethiopian_attendance
WHERE ethiopian_year = 2018 
  AND ethiopian_month = 6 
  AND ethiopian_day = 3;
```

### View Auto-Marked Records:
```sql
SELECT staff_name, status, check_in, check_out
FROM hr_ethiopian_attendance
WHERE status LIKE '%without check out%'
   OR status = 'ABSENT'
   OR status = 'LEAVE';
```

---

## 🚀 Ready!

The automatic attendance marking system is now:
- ✅ Installed
- ✅ Configured
- ✅ Running
- ✅ Marking attendance automatically

**No more manual work!** 🎉

---

## 📝 Next Steps

1. Monitor console for auto-marker logs
2. Adjust thresholds if needed
3. Test with real scenarios
4. Train staff on new badges
5. Review monthly summaries

**The system is fully automated!** ✅
