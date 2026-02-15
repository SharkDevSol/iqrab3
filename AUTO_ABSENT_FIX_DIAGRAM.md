# Auto Absent Marking - Visual Flow

## Before Fix ❌

```
┌─────────────────────────────────────────────────────────────┐
│ Attendance System Page (Yekatit 2018)                      │
├─────────────────────────────────────────────────────────────┤
│ Staff Name    │ 1/6 │ 2/6 │ 3/6 │ 4/6 │ 5/6 │ 6/6 │ 7/6 │
├───────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Ahmed         │  -  │  -  │  -  │  -  │  -  │  -  │  -  │
│ Bilal         │  -  │  -  │  -  │  -  │  -  │  -  │  -  │
│ Chaltu        │  -  │  -  │  -  │  -  │  -  │  -  │  -  │
│ Faxe          │  -  │  -  │  -  │  -  │  -  │  -  │  -  │
└───────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

Problem: Empty cells show "-" instead of "A" (Absent)
```

## After Fix ✅

```
┌─────────────────────────────────────────────────────────────┐
│ Attendance System Page (Yekatit 2018)                      │
├─────────────────────────────────────────────────────────────┤
│ Staff Name    │ 1/6 │ 2/6 │ 3/6 │ 4/6 │ 5/6 │ 6/6 │ 7/6 │
├───────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Ahmed         │  A  │  A  │  A  │  A  │  A  │  A  │  A  │
│ Bilal         │  A  │  A  │  A  │  A  │  A  │  A  │  A  │
│ Chaltu        │  A  │  A  │  A  │  A  │  A  │  A  │  A  │
│ Faxe          │  A  │  A  │  A  │  A  │  A  │  A  │  A  │
│ Khalid (S1)   │  A  │  A  │ L+H │  P  │  A  │  A  │  A  │
│ Khalid (S2)   │  A  │  A  │  P  │  A  │  A  │  A  │  A  │
│ Mumu (S1)     │  P  │  A  │  A  │  A  │  A  │  A  │  A  │
│ Mumu (S2)     │  P  │  A  │  A  │  A  │  A  │  A  │  A  │
└───────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

Legend:
  A = Absent (Red)
  P = Present (Green)
  L = Late (Orange)
  H = Half Day (Blue)
  L+H = Late + Half Day (Red-Orange)
```

## Auto-Marker Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTO-MARKER SERVICE                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  Runs Every 60 Seconds (1 minute)    │
        └───────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │  Check Current Time                   │
        │  Is it after 3:00 PM?                 │
        └───────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
               NO                      YES
                │                       │
                ▼                       ▼
        ┌──────────────┐      ┌──────────────────────┐
        │ Skip Absent  │      │ Query All Staff      │
        │ Marking      │      │ from Staff Tables    │
        └──────────────┘      └──────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ For Each Staff:               │
                        │ - Teachers                    │
                        │ - Administrative Staff        │
                        │ - Supportive Staff            │
                        └───────────────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ Check Shift Assignment:       │
                        │ - shift1: 1 record per day    │
                        │ - shift2: 1 record per day    │
                        │ - both: 2 records per day     │
                        └───────────────────────────────┘
                                        │
                                        ▼
                        ┌───────────────────────────────┐
                        │ Check Past 30 Days            │
                        │ For Each Day:                 │
                        │   Does attendance exist?      │
                        └───────────────────────────────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
                       YES                             NO
                        │                               │
                        ▼                               ▼
                ┌──────────────┐            ┌──────────────────┐
                │ Skip (Already│            │ INSERT ABSENT    │
                │ Has Record)  │            │ Record           │
                └──────────────┘            └──────────────────┘
                                                      │
                                                      ▼
                                        ┌──────────────────────┐
                                        │ ✅ Marked as ABSENT  │
                                        └──────────────────────┘
```

## Database Schema Changes

### Before Fix:
```sql
CREATE TABLE hr_ethiopian_attendance (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(255),
  staff_name VARCHAR(255),
  ethiopian_year INTEGER,
  ethiopian_month INTEGER,
  ethiopian_day INTEGER,
  check_in TIME,
  check_out TIME,
  status VARCHAR(50),
  -- ❌ No shift_type column
  UNIQUE(staff_id, ethiopian_year, ethiopian_month, ethiopian_day)
  -- ❌ Constraint doesn't support multiple shifts per day
);
```

### After Fix:
```sql
CREATE TABLE hr_ethiopian_attendance (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(255),
  staff_name VARCHAR(255),
  ethiopian_year INTEGER,
  ethiopian_month INTEGER,
  ethiopian_day INTEGER,
  check_in TIME,
  check_out TIME,
  status VARCHAR(50),
  shift_type VARCHAR(20),  -- ✅ Added shift support
  UNIQUE(staff_id, ethiopian_year, ethiopian_month, ethiopian_day, shift_type)
  -- ✅ Constraint now supports multiple shifts per day
);
```

## Staff Query Changes

### Before Fix:
```sql
-- ❌ Only gets staff with machine_id
SELECT machine_id, full_name
FROM staff_teachers
WHERE machine_id IS NOT NULL
```

### After Fix:
```sql
-- ✅ Gets ALL staff, uses fallback IDs
SELECT 
  COALESCE(machine_id, global_staff_id, full_name) as staff_id,
  full_name,
  shift_assignment
FROM staff_teachers
-- No WHERE clause - includes everyone!
```

## Shift Assignment Logic

```
Staff with shift_assignment = 'shift1':
┌─────────────────────────────────────┐
│ Day 1: 1 record (shift1)            │
│ Day 2: 1 record (shift1)            │
│ Day 3: 1 record (shift1)            │
└─────────────────────────────────────┘

Staff with shift_assignment = 'shift2':
┌─────────────────────────────────────┐
│ Day 1: 1 record (shift2)            │
│ Day 2: 1 record (shift2)            │
│ Day 3: 1 record (shift2)            │
└─────────────────────────────────────┘

Staff with shift_assignment = 'both':
┌─────────────────────────────────────┐
│ Day 1: 2 records (shift1 + shift2)  │
│ Day 2: 2 records (shift1 + shift2)  │
│ Day 3: 2 records (shift1 + shift2)  │
└─────────────────────────────────────┘
```

## Timeline

```
Time: 00:00 ─────────────────────────────────────────────────────> 23:59
      │                                    │
      │                                    │
      │                                    ▼
      │                            15:00 (3:00 PM)
      │                            Absent Threshold
      │                                    │
      ▼                                    ▼
Auto-marker runs                   Auto-marker runs
but skips absent marking           AND marks absent staff
(too early)                        (past threshold)
```

## Fix Application Flow

```
1. Run Script
   │
   ▼
2. Apply Database Migration
   │
   ├─> Drop old constraint
   ├─> Add shift_type column
   ├─> Create new constraint
   └─> Update existing records
   │
   ▼
3. Restart Backend Server
   │
   ├─> Stop old process
   └─> Start new process
   │
   ▼
4. Auto-Marker Starts
   │
   └─> Runs every 60 seconds
   │
   ▼
5. After 3:00 PM
   │
   └─> Marks all absent staff
   │
   ▼
6. ✅ Fix Complete!
```

## Summary

| Feature | Before | After |
|---------|--------|-------|
| Staff Coverage | Only with machine_id | ALL staff |
| Shift Support | Single shift only | Both shifts supported |
| Lookback Period | 7 days | 30 days |
| Empty Cells | Show "-" | Show "A" (Absent) |
| Database Constraint | No shift support | Shift-aware |
| Manual Trigger | Not available | Available via API |

