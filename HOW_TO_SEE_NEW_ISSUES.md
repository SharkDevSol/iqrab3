# How to See H, L+H, and NCO Issues in Leave Management

## ✅ Configuration Complete

The system is already configured to show these issues:
- **H** (HALF_DAY) - ⏱️ Half Day
- **L+H** (LATE_HALF_DAY) - 🕐 Late + Half Day  
- **NCO** (NO_CHECKOUT) - 🚪 No Check-Out

---

## 🔄 Step 1: Restart Backend

The backend code has been updated. Restart it:

```bash
cd backend
npm start
```

Or press `Ctrl+C` in the backend terminal and run `npm start` again.

---

## 🔍 Step 2: Check If Records Exist

Run this script to see if you have any H, L+H, or NCO records:

```bash
CHECK_NEW_ISSUE_TYPES.bat
```

This will show:
- All attendance statuses in your database
- Count of HALF_DAY records
- Count of LATE_HALF_DAY records
- Count of NO_CHECKOUT records

---

## 📊 What You'll See

### If Records Exist:
The Leave Management page will show them like this:

| Staff Name | Issue Type | Icon | Color |
|------------|-----------|------|-------|
| John | Half Day | ⏱️ HALF DAY | Blue |
| Mary | Late + Half Day | 🕐 LATE + HALF DAY | Purple |
| Peter | No Check-Out | 🚪 NO CHECK-OUT | Orange |

### If No Records Exist:
You won't see these issues because there are no attendance records with these statuses yet.

---

## 🎯 How These Statuses Get Created

These statuses are created by:

### 1. Auto Marker System
The auto marker can create these statuses based on:
- **HALF_DAY**: Staff checked out before the minimum required time
- **LATE_HALF_DAY**: Staff arrived late AND left early
- **NO_CHECKOUT**: Staff checked in but never checked out

### 2. Manual Entry
You can manually mark attendance with these statuses in the attendance system.

### 3. Machine Import
If using attendance machines, these statuses can be assigned based on check-in/out times.

---

## 🧪 Test It

### Option 1: Check Current Data
```bash
CHECK_NEW_ISSUE_TYPES.bat
```

### Option 2: Create Test Records
If you want to test, you can manually create a test record:

```sql
INSERT INTO hr_ethiopian_attendance (
  staff_id, 
  staff_name, 
  department_name,
  ethiopian_day, 
  ethiopian_month, 
  ethiopian_year,
  status,
  check_in,
  check_out
) VALUES (
  'TEST001',
  'Test Staff',
  'Teachers',
  4,
  6,
  2018,
  'LATE_HALF_DAY',
  '08:30:00',
  '12:00:00'
);
```

Then refresh the Leave Management page.

---

## 📋 Current Status Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Backend Query | ✅ Updated | Includes all 5 statuses |
| Frontend Display | ✅ Updated | Shows icons and colors |
| Deduction Settings | ✅ Updated | Can create rules |
| Leave Management | ✅ Ready | Will show when records exist |

---

## 🔧 Troubleshooting

### Issue: Not seeing H, L+H, or NCO in Leave Management

**Possible Causes:**
1. Backend not restarted
2. No attendance records with these statuses
3. Looking at wrong month/year

**Solutions:**
1. Restart backend server
2. Run `CHECK_NEW_ISSUE_TYPES.bat` to verify records exist
3. Check the selected month/year in Leave Management
4. Verify attendance records have the correct status values

### Issue: Seeing "undefined" or blank issue types

**Cause:** Frontend not updated or browser cache

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart frontend dev server

---

## ✨ Summary

The system is **ready to display** H, L+H, and NCO issues. They will appear automatically in the Leave Management page when:

1. ✅ Backend is restarted (loads new code)
2. ✅ Attendance records exist with these statuses
3. ✅ You're viewing the correct month/year

Run `CHECK_NEW_ISSUE_TYPES.bat` to see if you have any records with these statuses!
