# 🔍 Salary Data Not Saving - Debug Guide

## Quick Check

Run this command to check if data is in the database:

```bash
cd backend
node scripts/check-salary-data.js
```

This will show:
- If the table exists
- How many salaries are saved
- Details of all saved salaries

## What I Fixed

### 1. Added Logging
- **Frontend**: Console logs when submitting salary
- **Backend**: Console logs when receiving and saving salary
- Check browser console (F12) and backend terminal for logs

### 2. Added Staff List Refresh
- After saving salary, the staff list now refreshes automatically
- This ensures the button changes from "Add Salary" to "Edit Salary"

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Click "Add Salary" for a staff member
4. Fill the form and submit
5. Look for these logs:
   - `💰 Submitting salary data:` - Shows what's being sent
   - `✅ Salary save response:` - Shows server response
   - `❌ Error saving salary:` - Shows if there's an error

### Step 2: Check Backend Terminal
Look for these logs in your backend terminal:
- `💰 Received salary data:` - Shows what backend received
- `✅ Salary saved successfully:` - Shows saved data
- `❌ Error adding complete salary:` - Shows if there's an error

### Step 3: Check Database
Run the check script:
```bash
cd backend
node scripts/check-salary-data.js
```

## Common Issues & Solutions

### Issue 1: "Success" message but data not showing
**Cause**: Page not refreshing after save
**Solution**: ✅ Fixed - Added `fetchAllStaff()` call after save

### Issue 2: Staff Type is empty/undefined
**Cause**: Staff type not passed correctly when pre-selected
**Check**: Look at browser console log for `staffType` value
**Solution**: Make sure staff object has `staffType` property

### Issue 3: Database error
**Cause**: Database connection or table creation issue
**Check**: Backend terminal for error messages
**Solution**: Check database connection in `.env` file

### Issue 4: Authentication error
**Cause**: Token expired or invalid
**Check**: Browser console for 401/403 errors
**Solution**: Log out and log back in

## Test Procedure

1. **Open Salary Management page**
2. **Open browser console (F12)**
3. **Open backend terminal**
4. **Click "Add Salary" for a staff member**
5. **Fill the form**:
   - Account Number: "5100"
   - Base Salary: "5000"
   - Tax Amount: "500" (or leave empty)
6. **Click "Add Salary" button**
7. **Check logs**:
   - Browser console should show: `💰 Submitting salary data:`
   - Backend terminal should show: `💰 Received salary data:`
   - Backend terminal should show: `✅ Salary saved successfully:`
   - Browser should show alert: "Salary added successfully!"
8. **Check if button changed**:
   - Should now show "✏️ Edit Salary" instead of "➕ Add Salary"
   - Should show "📉 Deductions" and "📈 Allowances" buttons
9. **Run database check**:
   ```bash
   cd backend
   node scripts/check-salary-data.js
   ```

## What to Send Me

If it's still not working, send me:

1. **Browser Console Logs** (copy the logs after submitting)
2. **Backend Terminal Logs** (copy the logs after submitting)
3. **Database Check Output** (output from check-salary-data.js)
4. **Screenshot** of the form before submitting

## Expected Behavior

### Before Adding Salary:
```
Staff: John Doe
Salary Status: ✗ No Salary
Button: ➕ Add Salary
```

### After Adding Salary:
```
Staff: John Doe
Salary Status: ✓ Salary Added
                Base: $5000
                Net: $4500
Buttons: ✏️ Edit Salary
         📉 Deductions
         📈 Allowances
```

## Quick Fix Commands

### Restart Backend:
```bash
cd backend
# Kill any running node processes
taskkill /F /IM node.exe
# Start backend
npm run dev
```

### Clear Browser Cache:
- Press Ctrl+Shift+Delete
- Clear cached images and files
- Refresh page (Ctrl+F5)

### Check Database Connection:
```bash
cd backend
node -e "const pool = require('./config/db'); pool.query('SELECT NOW()').then(r => console.log('✅ DB Connected:', r.rows[0])).catch(e => console.error('❌ DB Error:', e));"
```

## Files Modified

1. **APP/src/PAGE/HR/components/AddSalaryCompleteModal.jsx**
   - Added console logs for debugging
   
2. **backend/routes/hr/salaryManagement.js**
   - Added console logs for debugging
   
3. **APP/src/PAGE/HR/SalaryManagement.jsx**
   - Added `fetchAllStaff()` call after saving salary

4. **backend/scripts/check-salary-data.js**
   - New script to check database contents
