# 🎯 Combined Status Feature - LATE + HALF_DAY

## ✅ What's New

The attendance system now shows **combined statuses** when multiple conditions apply!

---

## 📊 Status Logic

### Check-In (First Scan):
```
IF check-in time > late threshold (08:15)
THEN status = "LATE"
ELSE status = "PRESENT"
```

### Check-Out (Second Scan):
```
IF was LATE on check-in:
  ├─ Calculate working hours
  ├─ IF working hours < 4.0 hours
  │  └─ status = "LATE + HALF_DAY"  ← COMBINED!
  └─ ELSE
     └─ status = "LATE"  ← Keep LATE

IF was PRESENT on check-in:
  ├─ Calculate working hours
  ├─ IF working hours < 4.0 hours
  │  └─ status = "HALF_DAY"
  └─ ELSE
     └─ status = "PRESENT"  ← Keep PRESENT
```

---

## 🎨 Visual Display

### Status Badges:

| Status | Badge | Color | Meaning |
|--------|-------|-------|---------|
| PRESENT | **P** | 🟢 Green | On time, full day |
| LATE | **L** | 🟠 Orange | Late arrival, full day |
| HALF_DAY | **H** | 🔵 Blue | On time, left early |
| **LATE + HALF_DAY** | **L+H** | 🔴 Red-Orange | Late arrival AND left early |
| ABSENT | **A** | 🔴 Red | Did not attend |
| LEAVE | **V** | 🟣 Purple | On approved leave |

---

## 📝 Example Scenarios

### Scenario 1: Late but Full Day
```
Check-in:  08:30 (Late - after 08:15)
Check-out: 17:00 (8.5 hours worked)
Status:    LATE

Display:
┌─────────────┐
│      L      │  ← Orange badge
│    08:30    │
│    17:00    │
└─────────────┘
```

### Scenario 2: Late AND Half Day
```
Check-in:  08:30 (Late - after 08:15)
Check-out: 12:00 (3.5 hours worked - less than 4 hours)
Status:    LATE + HALF_DAY

Display:
┌─────────────┐
│     L+H     │  ← Red-Orange badge
│    08:30    │
│    12:00    │
└─────────────┘
```

### Scenario 3: On Time but Half Day
```
Check-in:  08:00 (On time)
Check-out: 11:30 (3.5 hours worked - less than 4 hours)
Status:    HALF_DAY

Display:
┌─────────────┐
│      H      │  ← Blue badge
│    08:00    │
│    11:30    │
└─────────────┘
```

### Scenario 4: On Time and Full Day
```
Check-in:  08:00 (On time)
Check-out: 17:00 (9 hours worked)
Status:    PRESENT

Display:
┌─────────────┐
│      P      │  ← Green badge
│    08:00    │
│    17:00    │
└─────────────┘
```

---

## 🔧 Settings

### Time Thresholds:
- **Late Threshold:** 08:15 (configurable)
- **Half Day Threshold:** 4.0 hours (configurable)

### How to Change:
1. Go to **HR → Attendance Settings**
2. Adjust thresholds as needed
3. Changes apply to future attendance records

---

## 📊 Monthly Summary

The monthly summary now includes a separate count for combined status:

```
┌─────────────────────────────────────────────┐
│  Present:          15                       │
│  Absent:            2                       │
│  Late:              5                       │
│  Half Day:          3                       │
│  Late + Half Day:   2  ← NEW!              │
│  On Leave:          1                       │
└─────────────────────────────────────────────┘
```

---

## 🧪 How to Test

### Test Case 1: Late + Full Day
1. Scan at 08:30 (late)
2. Scan at 17:00 (check-out after 8+ hours)
3. **Expected:** Status = "LATE" (orange badge)

### Test Case 2: Late + Half Day
1. Scan at 08:30 (late)
2. Scan at 12:00 (check-out after 3.5 hours)
3. **Expected:** Status = "LATE + HALF_DAY" (red-orange badge with "L+H")

### Test Case 3: On Time + Half Day
1. Scan at 08:00 (on time)
2. Scan at 11:30 (check-out after 3.5 hours)
3. **Expected:** Status = "HALF_DAY" (blue badge)

---

## 🔍 Backend Logic

### Code Flow:
```javascript
// On check-out scan:
if (existingRecord.rows[0].check_in && checkOutTime) {
  // Calculate working hours
  const workingHours = (outMinutes - inMinutes) / 60;
  
  // Check if half day
  if (workingHours < halfDayThreshold) {
    isHalfDay = true;
  }
}

// Combine statuses
if (isLate && isHalfDay) {
  status = 'LATE + HALF_DAY';
} else if (isLate) {
  status = 'LATE';
} else if (isHalfDay) {
  status = 'HALF_DAY';
}
```

---

## 📈 Benefits

1. **More Accurate Tracking**: Shows both late arrival AND early departure
2. **Better Reporting**: Separate count for combined violations
3. **Fair Deductions**: Can apply different deduction rates for combined status
4. **Clear Visibility**: Staff and managers see exact attendance issues

---

## 💰 Salary Deductions

You can configure different deduction amounts for each status:

| Status | Suggested Deduction |
|--------|---------------------|
| LATE | 50 Birr |
| HALF_DAY | 100 Birr |
| **LATE + HALF_DAY** | 150 Birr (or 200 Birr for double penalty) |
| ABSENT | 300 Birr |

Configure in: **HR → Attendance → Deduction Settings**

---

## 🎯 Key Points

✅ Status is calculated on **check-in** (LATE or PRESENT)  
✅ Status is **updated on check-out** if half day detected  
✅ Combined status shows **both violations**  
✅ Color coding makes it **easy to spot** issues  
✅ Monthly summary tracks **all status types**  

---

## 🚀 Ready to Use!

The combined status feature is now active! Just:
1. Restart backend server (if running)
2. Scan fingerprint twice (check-in and check-out)
3. See the combined status if both conditions apply

**Example:**
- Arrive at 08:30 (late)
- Leave at 12:00 (half day)
- See "L+H" badge in red-orange color!

---

## 📞 Support

If you need to adjust thresholds:
- Late threshold: Default 08:15
- Half day threshold: Default 4.0 hours

Both can be changed in Attendance Settings page.

**Feature is fully implemented and ready!** ✅
