# Auto-Marker Logic - Visual Guide

## How It Decides When to Mark Absent

```
┌─────────────────────────────────────────────────────────────┐
│  FOR EACH DAY (from start of year to today)                │
└─────────────────────────────────────────────────────────────┘
                          ↓
         ┌────────────────────────────────┐
         │  Is this a school day?         │
         │  (Monday-Friday by default)    │
         └────────────────────────────────┘
                   ↓ YES          ↓ NO
                   ↓              └──→ SKIP DAY
                   ↓
    ┌──────────────────────────────────────┐
    │  FOR EACH STUDENT                    │
    └──────────────────────────────────────┘
                   ↓
    ┌──────────────────────────────────────┐
    │  Does student have attendance        │
    │  record for this day?                │
    └──────────────────────────────────────┘
         ↓ YES                    ↓ NO
         └──→ SKIP STUDENT        ↓
                                  ↓
              ┌───────────────────────────────┐
              │  Is this day TODAY?           │
              └───────────────────────────────┘
                   ↓ NO              ↓ YES
                   ↓                 ↓
         ┌─────────────────┐   ┌──────────────────────────┐
         │  PAST DAY        │   │  Check Current Time      │
         │  Mark ABSENT ✅  │   └──────────────────────────┘
         └─────────────────┘              ↓
                                          ↓
                        ┌─────────────────────────────────────┐
                        │  Get absent marking time for        │
                        │  student's shift:                   │
                        │  - Shift 1: 09:00 AM                │
                        │  - Shift 2: 02:00 PM (14:00)        │
                        └─────────────────────────────────────┘
                                          ↓
                        ┌─────────────────────────────────────┐
                        │  Current Time >= Absent Time?       │
                        └─────────────────────────────────────┘
                             ↓ YES              ↓ NO
                             ↓                  ↓
                   ┌─────────────────┐   ┌──────────────────┐
                   │  Mark ABSENT ✅  │   │  SKIP (too early)│
                   └─────────────────┘   └──────────────────┘
```

## Examples

### Scenario 1: Current Time = 02:43 AM (Thursday)

```
Processing: Thursday (TODAY)
Current Time: 02:43 AM

Student: Ahmed (Shift 1)
├─ Has attendance record? NO
├─ Is today? YES
├─ Absent marking time: 09:00 AM
├─ 02:43 < 09:00? YES
└─ Result: SKIP (too early) ⏭️

Student: Fatima (Shift 2)
├─ Has attendance record? NO
├─ Is today? YES
├─ Absent marking time: 02:00 PM (14:00)
├─ 02:43 < 14:00? YES
└─ Result: SKIP (too early) ⏭️

Summary: 0 marked, 156 skipped
```

### Scenario 2: Current Time = 09:30 AM (Thursday)

```
Processing: Thursday (TODAY)
Current Time: 09:30 AM

Student: Ahmed (Shift 1)
├─ Has attendance record? NO
├─ Is today? YES
├─ Absent marking time: 09:00 AM
├─ 09:30 >= 09:00? YES
└─ Result: MARK ABSENT ✅

Student: Fatima (Shift 2)
├─ Has attendance record? NO
├─ Is today? YES
├─ Absent marking time: 02:00 PM (14:00)
├─ 09:30 < 14:00? YES
└─ Result: SKIP (too early) ⏭️

Summary: 78 marked (Shift 1), 78 skipped (Shift 2)
```

### Scenario 3: Current Time = 02:30 PM (Thursday)

```
Processing: Thursday (TODAY)
Current Time: 02:30 PM (14:30)

Student: Ahmed (Shift 1)
├─ Has attendance record? YES (marked at 09:30 AM)
└─ Result: SKIP (already has record) ⏭️

Student: Fatima (Shift 2)
├─ Has attendance record? NO
├─ Is today? YES
├─ Absent marking time: 02:00 PM (14:00)
├─ 14:30 >= 14:00? YES
└─ Result: MARK ABSENT ✅

Summary: 78 marked (Shift 2), 78 skipped (Shift 1 already marked)
```

### Scenario 4: Processing Yesterday

```
Processing: Wednesday (YESTERDAY)
Current Time: 02:43 AM (doesn't matter for past days)

Student: Ahmed (Shift 1)
├─ Has attendance record? NO
├─ Is today? NO (it's yesterday)
└─ Result: MARK ABSENT ✅ (past day, always mark)

Student: Fatima (Shift 2)
├─ Has attendance record? NO
├─ Is today? NO (it's yesterday)
└─ Result: MARK ABSENT ✅ (past day, always mark)

Summary: All students without records marked absent
```

## Time Comparison Logic

```javascript
// Current time
const now = new Date();
const currentTime = "02:43"; // HH:MM format

// Absent marking times
const shift1AbsentTime = "09:00"; // 9:00 AM
const shift2AbsentTime = "14:00"; // 2:00 PM

// Comparisons (string comparison works for HH:MM format)
"02:43" < "09:00"  // true  → too early for Shift 1
"02:43" < "14:00"  // true  → too early for Shift 2
"09:30" >= "09:00" // true  → mark Shift 1 absent
"14:30" >= "14:00" // true  → mark Shift 2 absent
```

## Key Rules

1. **Past Days**: Always mark absent (no time check needed)
2. **Today**: Only mark if current time >= absent marking time
3. **Future Days**: Never processed
4. **Shift-Specific**: Each student checked against their shift's time
5. **Already Marked**: Skip if attendance record exists
6. **Non-School Days**: Skip (e.g., weekends)

## Configuration

Settings in `academic_student_attendance_settings`:

```
shift1_absent_marking = '09:00:00'  → 9:00 AM
shift2_absent_marking = '14:00:00'  → 2:00 PM
school_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
auto_absent_enabled = TRUE
```

## Auto-Marker Schedule

```
Server Starts → Auto-marker starts immediately
                ↓
                Runs every 1 hour
                ↓
┌───────────────────────────────────────┐
│  02:00 AM → Check (skip today)        │
│  03:00 AM → Check (skip today)        │
│  ...                                  │
│  09:00 AM → Check (mark Shift 1)      │
│  10:00 AM → Check (already marked)    │
│  ...                                  │
│  14:00 PM → Check (mark Shift 2)      │
│  15:00 PM → Check (already marked)    │
└───────────────────────────────────────┘
```

## Summary

The auto-marker is now **smart** and **time-aware**:
- ✅ Marks past days immediately
- ✅ Waits for absent marking time before marking today
- ✅ Respects shift-specific times
- ✅ Runs every hour to catch students as soon as time passes
- ✅ Never marks too early

This ensures students are only marked absent AFTER the configured absent marking time! 🎯
