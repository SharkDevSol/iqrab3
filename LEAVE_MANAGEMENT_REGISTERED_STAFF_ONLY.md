# Leave Management - Registered Staff Only

## ✅ How It Works

The Leave Management page **ONLY shows attendance issues for staff who are registered** in the system.

### Registration Check

The system checks these three staff tables:
1. `Teacher` table
2. `AdministrativeStaff` table  
3. `SupportiveStaff` table

Only staff with a `global_staff_id` in one of these tables will appear in the Leave Management page.

---

## 🔍 Why You Might See "0 Total Issues"

If you see 0 total issues, it could be because:

1. **No attendance issues exist** for the selected month/year
2. **Staff with issues are not registered** in the staff tables
3. **Staff ID mismatch** between attendance records and staff registration

---

## 🛠️ How to Check

### Step 1: Run the Diagnostic Script

```bash
CHECK_REGISTERED_STAFF_ATTENDANCE.bat
```

This will show you:
- How many staff are registered in each table
- How many attendance issues exist (LATE, ABSENT, HALF_DAY)
- Which attendance records match registered staff
- Sample registered staff IDs

### Step 2: Check Browser Console

Open the Leave Management page and check the browser console (F12). You'll see:

```
📋 Fetching attendance issues for Yekatit 2018, filter: PENDING
✅ Received 5 attendance issues
📊 Issues breakdown: { total: 5, pending: 3, approved: 1, rejected: 1 }
```

### Step 3: Check Backend Logs

Look at your backend terminal. You'll see:

```
📋 Found 15 registered staff members
👥 Registered staff IDs: ['STAFF001', 'STAFF002', ...]
📋 Querying attendance issues for 15 registered staff
✅ Query returned 5 attendance issues
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Staff Not Registered

**Problem:** Attendance records exist but staff are not in the staff tables.

**Solution:** Register the staff members:
1. Go to "Create/Register" → "Register Staff"
2. Add the staff member with their correct `global_staff_id`
3. The staff ID in attendance must match the `global_staff_id` in the staff table

### Issue 2: Staff ID Mismatch

**Problem:** Staff are registered but their IDs don't match attendance records.

**Solution:** 
1. Check the staff ID format in attendance: `SELECT DISTINCT staff_id FROM hr_ethiopian_attendance LIMIT 10;`
2. Check the staff ID format in registration: `SELECT global_staff_id FROM "Teacher" LIMIT 10;`
3. Ensure they match exactly (case-sensitive)

### Issue 3: No Attendance Issues

**Problem:** No LATE, ABSENT, or HALF_DAY records exist.

**Solution:** This is normal if:
- All staff are on time
- No attendance has been recorded yet
- You're looking at a future month

---

## 📊 What Gets Displayed

### Attendance Issues Tab
Shows registered staff with:
- **LATE** - Checked in after the allowed time
- **ABSENT** - No check-in recorded
- **HALF_DAY** - Checked out early

### Leave Records Tab
Shows registered staff with:
- **LEAVE** status - Granted leave (no deduction)

---

## 🎯 Summary Cards Explained

1. **Total Issues** - Count of LATE/ABSENT/HALF_DAY for registered staff
2. **Pending** - Issues awaiting approval/rejection
3. **Approved** - Issues approved (no deduction)
4. **Rejected** - Issues rejected (deduction applied)
5. **Total Deductions** - Sum of all deductions for rejected issues
6. **Staff on Leave** - Count of registered staff currently on leave
7. **Total Leave Days** - Sum of all leave days granted this month
8. **My Approvals** - Total approvals you've made (all time)
9. **My Rejections** - Total rejections you've made (all time)

---

## 💡 Tips

1. **Always check the selected month/year** - Make sure you're looking at the right period
2. **Use the diagnostic script** - Run `CHECK_REGISTERED_STAFF_ATTENDANCE.bat` to verify data
3. **Check browser console** - Look for error messages or data counts
4. **Verify staff registration** - Ensure staff are properly registered with correct IDs
5. **Test with known data** - Create a test attendance issue for a registered staff member

---

## 🔐 Security Note

This filtering ensures that:
- Only legitimate, registered staff appear in the system
- Unauthorized or test data is automatically excluded
- HR can only manage attendance for official staff members

---

## 📞 Need Help?

If you're still seeing 0 issues but expect to see data:

1. Run `CHECK_REGISTERED_STAFF_ATTENDANCE.bat`
2. Check the output for mismatches
3. Verify staff registration in the staff tables
4. Check browser console for error messages
5. Review backend logs for query results
