# 🔧 Remaining Issues to Fix

## 1. Account Numbers Not Displaying ⚠️

### Current Status:
- Backend code updated to fetch account numbers from Teacher/AdministrativeStaff/SupportiveStaff tables
- Code should log: `👤 Staff Name (ID: X) - Account: XXX`
- But payroll still shows "N/A"

### To Test:
1. Click "Generate Payroll" button again (regenerate the report)
2. Check backend logs for account number messages
3. If still N/A, check if staff have `account_number` field in their tables

### Possible Causes:
- Staff tables don't have `account_number` column
- Account numbers are NULL in the database
- Staff IDs in salary table don't match `global_staff_id` in staff tables

### Debug Steps:
Run this query to check if account numbers exist:
```sql
SELECT global_staff_id, full_name, account_number 
FROM "Teacher" 
WHERE global_staff_id IN (1, 2, 3, 6, 7);
```

---

## 2. Edit Salary Creating Duplicates ❌

### Problem:
- Clicking "Edit Salary" creates a new salary record instead of updating
- Results in duplicate salaries for the same staff

### Root Cause:
- Frontend Edit Salary modal might be calling POST `/api/hr/salary/complete-salaries` instead of PUT
- Or the modal is not passing the salary ID to update

### Solution Needed:
1. Check which API endpoint the Edit Salary modal calls
2. Ensure it calls PUT `/api/hr/salary/complete-salaries/:id` with the salary ID
3. Or update the backend to handle updates properly

### Files to Check:
- Frontend: `APP/src/PAGE/HR/components/AddSalaryCompleteModal.jsx` or similar
- Backend: `backend/routes/hr/salaryManagement.js` - PUT endpoint

---

## 3. Leave Management Page Status ✅

### Fixed:
- Only shows registered staff from Teacher/AdministrativeStaff/SupportiveStaff tables
- Filters out unregistered machine logs
- Filters out students

### To Test:
- Go to Leave & Permission Management page
- Should only show registered staff with attendance issues

---

## Quick Fixes Applied Today:

✅ Allowances table - Added `allowance_type` column
✅ Allowances INSERT - Changed to use `allowance_name` column
✅ Leave Management - Filter by registered staff only
✅ Payroll - Updated account number fetching logic

---

## Next Steps:

1. **Test Account Numbers:**
   - Regenerate payroll
   - Check backend logs
   - Verify staff tables have account_number column

2. **Fix Edit Salary:**
   - Find the Edit Salary modal component
   - Check which API it calls
   - Update to use PUT instead of POST
   - Pass salary ID for updates

3. **Verify All Fixes:**
   - Test allowances (should work now)
   - Test leave management (should show only registered staff)
   - Test payroll generation (should show account numbers after regeneration)
