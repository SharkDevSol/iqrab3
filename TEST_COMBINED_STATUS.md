# 🧪 Quick Test - Combined Status (LATE + HALF_DAY)

## ⚡ 2-Minute Test

### Step 1: Restart Backend
```bash
cd backend
npm run dev
```

---

### Step 2: Test LATE + HALF_DAY

#### Scan 1 (Check-In - Late):
1. Scan fingerprint at **08:30** (or any time after 08:15)
2. Backend console shows:
   ```
   ✅ First scan of the day → CHECK-IN: 08:30
   Status: LATE
   ```

#### Scan 2 (Check-Out - Early):
1. Scan fingerprint at **12:00** (less than 4 hours later)
2. Backend console shows:
   ```
   ✅ Second scan of the day → CHECK-OUT: 12:00
   Working hours: 3.5 hours
   Status: LATE + HALF_DAY
   ```

---

### Step 3: Check Frontend

1. Open: `http://localhost:5173`
2. Go to: **HR → Attendance System**
3. Select: **Yekatit 2018**
4. Find Khalid's row → Day 3

**You should see:**
```
┌─────────────┐
│     L+H     │  ← Red-Orange badge (combined status!)
│    08:30    │  ← Check-in time
│    12:00    │  ← Check-out time
└─────────────┘
```

---

## ✅ Test Cases

### Case 1: LATE only (Full Day)
```
Check-in:  08:30 (late)
Check-out: 17:00 (8.5 hours)
Expected:  L badge (orange)
```

### Case 2: LATE + HALF_DAY (Combined)
```
Check-in:  08:30 (late)
Check-out: 12:00 (3.5 hours)
Expected:  L+H badge (red-orange)
```

### Case 3: HALF_DAY only
```
Check-in:  08:00 (on time)
Check-out: 11:30 (3.5 hours)
Expected:  H badge (blue)
```

### Case 4: PRESENT (Full Day)
```
Check-in:  08:00 (on time)
Check-out: 17:00 (9 hours)
Expected:  P badge (green)
```

---

## 🎨 Color Guide

| Badge | Color | Status |
|-------|-------|--------|
| P | 🟢 Green | Present |
| L | 🟠 Orange | Late |
| H | 🔵 Blue | Half Day |
| **L+H** | 🔴 Red-Orange | **Late + Half Day** |
| A | 🔴 Red | Absent |
| V | 🟣 Purple | Leave |

---

## 📊 Monthly Summary

After testing, check the monthly summary at the top:

```
Present:          15
Absent:            2
Late:              5
Half Day:          3
Late + Half Day:   1  ← Should show your test!
On Leave:          1
```

---

## 🔧 Adjust Thresholds

If you want to change when status is calculated:

### Late Threshold (default: 08:15):
```sql
UPDATE hr_attendance_time_settings 
SET late_threshold = '08:30';
```

### Half Day Threshold (default: 4.0 hours):
```sql
UPDATE hr_attendance_time_settings 
SET half_day_threshold = 5.0;
```

---

## 🐛 Troubleshooting

### Issue: Status shows "LATE" instead of "LATE + HALF_DAY"
**Cause:** Working hours >= 4.0 hours
**Solution:** Check-out earlier (less than 4 hours after check-in)

### Issue: Status shows "HALF_DAY" instead of "LATE + HALF_DAY"
**Cause:** Check-in was on time (before 08:15)
**Solution:** Check-in after 08:15 to trigger LATE status

### Issue: Badge shows "L" instead of "L+H"
**Cause:** Frontend not updated
**Solution:** Hard refresh browser (Ctrl+Shift+R)

---

## 📝 Expected Console Output

### First Scan (Check-In):
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 08:30:24" }
👤 Processing attendance for user ID: 100
✅ First scan of the day → CHECK-IN: 08:30:24
Status: LATE (Late threshold: 08:15)
✅ Attendance saved to database
```

### Second Scan (Check-Out):
```
📨 Received: { "enrollid": "100", "time": "2026-02-10 12:00:15" }
👤 Processing attendance for user ID: 100
✅ Second scan of the day → CHECK-OUT: 12:00:15
Working hours: 3.5 hours (threshold: 4.0)
Status: LATE + HALF_DAY (combined)
✅ Attendance saved to database
```

---

## ✅ Success Criteria

- [x] First scan creates LATE status
- [x] Second scan calculates working hours
- [x] Status updates to "LATE + HALF_DAY"
- [x] Badge shows "L+H" in red-orange
- [x] Monthly summary counts combined status
- [x] Legend shows new status type

---

## 🎉 Feature Complete!

The combined status feature is working if you see:
- **L+H** badge for late arrival + early departure
- **Red-orange color** (different from regular LATE)
- **Separate count** in monthly summary
- **Both times** displayed in table

**Ready for production!** 🚀

---

## 📞 Quick Commands

### Clear test data:
```bash
cd backend
node clear-attendance-data.js
```

### Check records:
```bash
cd backend
node check-attendance-records.js
```

### Restart server:
```bash
cd backend
npm run dev
```

---

**Test the combined status now!** ✅
