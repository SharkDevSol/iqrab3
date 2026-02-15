# 🧪 Quick Test: Leave Request System

## ⚡ 5-Minute Test

### Step 1: Grant Leave
1. Go to **Leave & Permission Management**
2. Click **🏖️ Grant Leave** button (blue, in header)
3. **VERIFY:** Modal opens with form

### Step 2: Fill Form
1. **Select Staff:** Choose "John Doe (Teachers)"
2. **Leave Reason:** Choose "Sick Leave"
3. **Start Date:** 
   - Month: Meskerem
   - Day: 15
   - Year: 2018
4. **Number of Days:** Enter 5
5. **VERIFY:** Summary box shows all details correctly

### Step 3: Submit
1. Click **🏖️ Grant Leave** button
2. **VERIFY:**
   - ✅ Success message appears
   - ✅ Modal closes
   - ✅ Message says "5 day(s) marked as LEAVE"

### Step 4: Check Attendance
1. Go to **HR Attendance System**
2. Select **Meskerem 2018**
3. Find **John Doe** row
4. **VERIFY:**
   - ✅ Days 15-19 show purple background
   - ✅ Badge shows "V" (for Vacation/Leave)
   - ✅ All 5 days marked consecutively

### Step 5: Try to Edit Leave
1. Click on **Day 15** (leave day)
2. **VERIFY:**
   - ✅ Modal shows "🏖️ Leave Day" title
   - ✅ Purple box shows "ON LEAVE"
   - ✅ Shows "Leave: Sick Leave"
   - ✅ Orange warning box explains cannot edit
   - ✅ No check-in/check-out fields
   - ✅ Only "Close" button

### Step 6: Verify No Deduction
1. Go to **HR Salary Management**
2. Click **View Details** on John Doe
3. Scroll to **Attendance-Based Deductions**
4. **VERIFY:**
   - ✅ Leave days (15-19) do NOT appear
   - ✅ Total deduction excludes leave days

---

## 🎯 Expected Results

### Leave Request Modal
```
┌──────────────────────────────────────┐
│ 🏖️ Grant Leave Permission      [×]  │
├──────────────────────────────────────┤
│ [Blue Info Box]                      │
│                                      │
│ Select Staff Member *                │
│ [John Doe (Teachers)          ▼]    │
│                                      │
│ Leave Reason *                       │
│ [Sick Leave                   ▼]    │
│                                      │
│ Leave Start Date *                   │
│ [Meskerem ▼] [Day 15 ▼] [2018]     │
│                                      │
│ Number of Days *                     │
│ [5                            ]      │
│                                      │
│ [Summary Box]                        │
│ Staff: John Doe                      │
│ Reason: Sick Leave                   │
│ Start: Day 15, Meskerem 2018        │
│ Duration: 5 day(s)                   │
│                                      │
│        [Cancel] [🏖️ Grant Leave]     │
└──────────────────────────────────────┘
```

### Attendance Calendar
```
Staff    | Day 14 | Day 15 | Day 16 | Day 17 | Day 18 | Day 19 | Day 20
---------|--------|--------|--------|--------|--------|--------|--------
John Doe |   -    | 🏖️ V   | 🏖️ V   | 🏖️ V   | 🏖️ V   | 🏖️ V   |   -
         |        | Purple | Purple | Purple | Purple | Purple |
```

### Leave Day Modal
```
┌──────────────────────────────────┐
│ 🏖️ Leave Day              [×]   │
├──────────────────────────────────┤
│ Staff: John Doe                  │
│ Department: Teachers             │
│ Date: Day 15, Meskerem 2018     │
│                                  │
│ [Purple Box]                     │
│ 🏖️ ON LEAVE                      │
│ Leave: Sick Leave                │
│                                  │
│ [Orange Warning]                 │
│ ℹ️ Leave days cannot be edited   │
│                                  │
│              [Close]             │
└──────────────────────────────────┘
```

---

## ✅ Success Indicators

- ✅ Grant Leave button visible
- ✅ Modal opens and closes smoothly
- ✅ All form fields work correctly
- ✅ Summary updates in real-time
- ✅ Success message after submission
- ✅ Leave days appear in attendance (purple)
- ✅ "V" badge shows on leave days
- ✅ Leave modal shows when clicking leave day
- ✅ Cannot edit leave days
- ✅ No deduction for leave days

---

## 🧪 Advanced Tests

### Test 1: Month Transition
```
Start: Day 29, Meskerem 2018
Days: 4

Expected:
- Meskerem Day 29: LEAVE
- Meskerem Day 30: LEAVE
- Tikimt Day 1: LEAVE
- Tikimt Day 2: LEAVE
```

### Test 2: Long Leave
```
Start: Day 1, Tir 2018
Days: 30

Expected:
- All 30 days of Tir marked as LEAVE
- All show purple in attendance
```

### Test 3: Multiple Staff
```
Grant leave to 3 different staff
Same dates, different reasons

Expected:
- All 3 staff show leave on same days
- Each has their own reason
- All protected from editing
```

---

## ❌ Common Issues

### Issue: Staff not in dropdown
**Solution:** Add staff to HR Salary Management first

### Issue: Leave not showing
**Solution:** Check you're viewing the correct month

### Issue: Can edit leave day
**Solution:** Verify status is "LEAVE" in database

### Issue: Deduction still applied
**Solution:** Check deduction calculation excludes LEAVE

---

## 🔍 Quick Debug

### Check Database
```sql
-- View all leave records
SELECT * FROM hr_ethiopian_attendance 
WHERE status = 'LEAVE';

-- Check specific staff
SELECT * FROM hr_ethiopian_attendance 
WHERE staff_name = 'John Doe' 
AND status = 'LEAVE';
```

### Check Browser Console
```
Should see:
✅ Leave granted successfully
✅ 5 attendance records marked
✅ Modal closed
```

---

**Test Duration:** ~5 minutes
**Priority:** High - Core feature
**Status:** Ready to test
