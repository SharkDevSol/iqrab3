# 🧪 Test Time Settings Integration

## ⚡ Quick Test (3 minutes)

### Step 1: Set Global Settings

**Option A: Using SQL**
```sql
-- Check if settings exist
SELECT * FROM hr_attendance_time_settings;

-- If empty, insert default:
INSERT INTO hr_attendance_time_settings 
(late_threshold, half_day_threshold)
VALUES ('08:15', 4.0);

-- If exists, update:
UPDATE hr_attendance_time_settings 
SET late_threshold = '08:15', 
    half_day_threshold = 4.0;
```

**Option B: Using Time Settings Page**
1. Open: `http://localhost:5173`
2. Go to: **HR → Attendance → Time Settings**
3. Set:
   - Late Threshold: `08:15`
   - Half Day Threshold: `4.0` hours
4. Click **Save**

---

### Step 2: Restart Backend
```bash
cd backend
npm run dev
```

**Wait for:**
```
🔌 AI06 WebSocket Server started on port 7788
```

---

### Step 3: Test Global Settings

**Test A: Late Detection**
```
1. Scan at 08:30 (late)
2. Check console:
   ⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
   ✅ First scan of the day → CHECK-IN: 08:30
   Status: LATE

3. Expected: Status = LATE (because 08:30 > 08:15)
```

**Test B: On Time Detection**
```
1. Clear data: node clear-attendance-data.js
2. Scan at 08:00 (on time)
3. Check console:
   ⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
   ✅ First scan of the day → CHECK-IN: 08:00
   Status: PRESENT

4. Expected: Status = PRESENT (because 08:00 < 08:15)
```

---

### Step 4: Test Staff-Specific Settings

**Add Custom Settings for Khalid:**
```sql
INSERT INTO hr_staff_specific_times 
(staff_id, staff_name, late_threshold, half_day_threshold)
VALUES ('100', 'khalid', '09:00', 5.0);
```

**Restart Backend:**
```bash
cd backend
npm run dev
```

**Test Custom Settings:**
```
1. Clear data: node clear-attendance-data.js
2. Scan at 08:30 (would be late with global, but not with custom)
3. Check console:
   ⚙️ Using staff-specific time settings for Machine ID 100
   ✅ First scan of the day → CHECK-IN: 08:30
   Status: PRESENT

4. Expected: Status = PRESENT (because 08:30 < 09:00 custom threshold)
```

---

### Step 5: Test Half Day Threshold

**Test A: Half Day (< 4 hours)**
```
1. Clear data
2. Scan at 08:00 (check-in)
3. Scan at 11:30 (check-out - 3.5 hours)
4. Check console:
   Working hours: 3.5 hours (threshold: 4.0)
   Status: HALF_DAY

5. Expected: Status = HALF_DAY
```

**Test B: Full Day (>= 4 hours)**
```
1. Clear data
2. Scan at 08:00 (check-in)
3. Scan at 13:00 (check-out - 5 hours)
4. Check console:
   Working hours: 5.0 hours (threshold: 4.0)
   Status: PRESENT

5. Expected: Status = PRESENT
```

---

## ✅ Success Criteria

### Global Settings Test:
- [x] Console shows "Using global time settings"
- [x] Late threshold from database is used
- [x] Half day threshold from database is used
- [x] Status calculated correctly

### Staff-Specific Settings Test:
- [x] Console shows "Using staff-specific time settings"
- [x] Custom late threshold is used
- [x] Custom half day threshold is used
- [x] Overrides global settings

### Combined Status Test:
- [x] LATE + full day = "LATE"
- [x] LATE + half day = "L+H"
- [x] On time + half day = "HALF DAY"
- [x] On time + full day = "PRESENT"

---

## 🔍 Console Output Examples

### Using Global Settings:
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 08:30:24" }
👤 Processing attendance for user ID: 100
⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
✅ First scan of the day → CHECK-IN: 08:30:24
Status: LATE (Late threshold: 08:15)
✅ Attendance saved to database
```

### Using Staff-Specific Settings:
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 08:30:24" }
👤 Processing attendance for user ID: 100
⚙️ Using staff-specific time settings for Machine ID 100
✅ First scan of the day → CHECK-IN: 08:30:24
Status: PRESENT (Late threshold: 09:00)
✅ Attendance saved to database
```

### Half Day Detection:
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 11:30:15" }
👤 Processing attendance for user ID: 100
⚙️ Using global time settings (Late: 08:15, Half Day: 4.0h)
✅ Second scan of the day → CHECK-OUT: 11:30:15
Working hours: 3.5 hours (threshold: 4.0)
Status: HALF_DAY
✅ Attendance saved to database
```

---

## 🐛 Troubleshooting

### Issue 1: Still using old threshold
**Cause:** Backend not restarted
**Solution:** 
```bash
cd backend
npm run dev
```

### Issue 2: Settings not found
**Cause:** Database table empty
**Solution:**
```sql
INSERT INTO hr_attendance_time_settings 
(late_threshold, half_day_threshold)
VALUES ('08:15', 4.0);
```

### Issue 3: Staff-specific not working
**Cause:** staff_id doesn't match machine_id
**Solution:**
```sql
-- Check machine_id
SELECT global_staff_id, name, machine_id 
FROM supportive_staff 
WHERE name = 'khalid';

-- Use machine_id in staff_specific_times
INSERT INTO hr_staff_specific_times 
(staff_id, staff_name, late_threshold, half_day_threshold)
VALUES ('100', 'khalid', '09:00', 5.0);
-- staff_id must match machine_id!
```

---

## 📊 Test Matrix

| Test | Check-In | Check-Out | Global Late | Staff Late | Expected Status |
|------|----------|-----------|-------------|------------|-----------------|
| 1 | 08:00 | 17:00 | 08:15 | - | PRESENT |
| 2 | 08:30 | 17:00 | 08:15 | - | LATE |
| 3 | 08:00 | 11:30 | 08:15 | - | HALF DAY |
| 4 | 08:30 | 12:00 | 08:15 | - | L+H |
| 5 | 08:30 | 17:00 | 08:15 | 09:00 | PRESENT (uses staff) |
| 6 | 08:45 | 17:00 | 08:15 | 09:00 | LATE (uses staff) |

---

## 🚀 Quick Commands

### View Settings:
```sql
-- Global
SELECT * FROM hr_attendance_time_settings;

-- Staff-specific
SELECT * FROM hr_staff_specific_times;
```

### Update Settings:
```sql
-- Global
UPDATE hr_attendance_time_settings 
SET late_threshold = '08:30', half_day_threshold = 5.0;

-- Staff-specific
UPDATE hr_staff_specific_times 
SET late_threshold = '09:00', half_day_threshold = 6.0
WHERE staff_id = '100';
```

### Clear Test Data:
```bash
cd backend
node clear-attendance-data.js
```

---

## 🎯 Expected Behavior

1. **First Priority:** Staff-specific settings (if exist)
2. **Second Priority:** Global settings (if exist)
3. **Last Resort:** Hardcoded defaults (08:15, 4.0h)

**Console always shows which settings are being used!**

---

## 🎉 Test Complete!

If you see:
- ✅ Console logs showing settings source
- ✅ Correct thresholds being used
- ✅ Status calculated based on database settings
- ✅ Staff-specific overriding global

**Then time settings integration is working perfectly!** 🚀

---

## 📞 Need Help?

1. Check console for settings logs
2. Verify database tables have data
3. Restart backend after changes
4. Use SQL queries to verify settings
5. Check machine_id matches staff_id

**Settings are now fully database-driven!** ✅
