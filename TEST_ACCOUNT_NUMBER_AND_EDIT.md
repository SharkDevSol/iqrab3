# Account Number Display and Edit Salary Fix

## Issues Fixed

### 1. Rate Limiter (429 Errors)
**Problem**: Rate limiter was blocking requests with 100 requests per 15 minutes
**Solution**: 
- Increased limit to 1000 requests per 15 minutes
- Added skip condition for localhost during development
- File: `backend/middleware/rateLimiter.js`

### 2. Edit Salary Creating Duplicates
**Problem**: Clicking "Edit Salary" was creating new records instead of updating
**Root Causes**:
- Field name mismatch: Backend returns `staffId` (camelCase) but frontend was checking `staff_id` (snake_case)
- Modal form data initialization was using wrong field names (`account_id`, `base_salary` instead of `accountId`, `baseSalary`)

**Solutions**:
- Fixed `SalaryManagement.jsx` line 217: Changed `s.staff_id` to `s.staffId`
- Fixed `AddSalaryCompleteModal.jsx` lines 15-17: Changed to use camelCase field names
  - `existingSalary?.accountId` instead of `existingSalary?.account_id`
  - `existingSalary?.accountName` instead of `existingSalary?.account_name`
  - `existingSalary?.baseSalary` instead of `existingSalary?.base_salary`

### 3. Account Number Display
**Backend is working correctly** - logs show account numbers are being fetched:
```
👤 Ahmed (ID: 1) - Account: ACC-0001
```

The issue is frontend caching old JavaScript files.

## Next Steps

### 1. Restart Backend
```bash
cd backend
node server.js
```

### 2. Hard Refresh Browser
Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac) to clear cached JavaScript files.

### 3. Test Edit Salary
1. Go to HR > Salary Management
2. Find a staff member with existing salary
3. Click "✏️ Edit Salary" button
4. Modal should show:
   - Title: "Edit Salary - [Staff Name]"
   - Pre-filled account number
   - Pre-filled base salary
   - Button text: "Update Salary"
5. Change the salary amount
6. Click "Update Salary"
7. Verify it updates the existing record (not creates new one)

### 4. Test Account Number Display
1. Go to HR > Payroll
2. Generate payroll for current month
3. Account Number column should show "ACC-0001", "ACC-0002", etc.
4. Go to HR > Salary Management
5. Account numbers should display in the salary list

## Technical Details

### Backend Endpoints Working
- `GET /api/hr/salary/all-salaries` - Returns salaries with camelCase fields
- `PUT /api/hr/salary/update-complete/:id` - Updates existing salary
- `POST /api/hr/salary/add-complete` - Creates new salary

### Data Structure
Backend returns:
```javascript
{
  id: "uuid",
  staffId: "1",
  staffName: "Ahmed",
  staffType: "Teachers",
  accountName: "ACC-0001",
  baseSalary: 5000,
  taxAmount: 0,
  netSalary: 5000
}
```

### Files Modified
1. `backend/middleware/rateLimiter.js` - Fixed rate limiting
2. `APP/src/PAGE/HR/SalaryManagement.jsx` - Fixed field name (staff_id → staffId)
3. `APP/src/PAGE/HR/components/AddSalaryCompleteModal.jsx` - Fixed form initialization field names

## Expected Behavior After Fix

### Add Salary (New Staff)
- Modal title: "Add Salary - [Staff Name]"
- Empty form fields
- Button: "Add Salary"
- Creates new record in database

### Edit Salary (Existing Staff)
- Modal title: "Edit Salary - [Staff Name]"
- Pre-filled with current values
- Button: "Update Salary"
- Updates existing record (no duplicates)

### Account Numbers
- Display in Payroll report
- Display in Salary Management list
- Show as "ACC-0001", "ACC-0002", etc.
