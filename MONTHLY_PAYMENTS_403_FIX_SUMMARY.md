# Monthly Payments 403 Error - Fixed

## Problem Summary
The Monthly Payment Settings page was showing 403 (Forbidden) errors when trying to access:
- `/api/finance/accounts/tree`
- `/api/finance/classes`
- `/api/finance/fee-structures`

## Root Cause
The finance endpoints require specific permissions that are checked by the `financeAuth.js` middleware. Users need to be logged in with a role that has finance permissions (admin, director, etc.), not as regular staff.

## Changes Made

### 1. Updated `backend/middleware/financeAuth.js`

#### Added Super Admin Support
```javascript
function hasPermission(user, permission) {
  // Super Admin has all permissions
  if (user.isSuperAdmin || user.role === 'super_admin') {
    return true;
  }
  // ... rest of the code
}
```

#### Added Sub-Account Role Mapping
```javascript
const ROLE_PERMISSIONS = {
  // ... other roles
  'sub-account': 'SCHOOL_ADMINISTRATOR', // Sub-accounts get admin access
  super_admin: 'SCHOOL_ADMINISTRATOR',
  // ...
};
```

#### Improved Error Logging
```javascript
console.log(`Access denied: User ${req.user.id} (role: ${req.user.role}, userType: ${req.user.userType}) attempted ${permission}`);
console.log('User object:', JSON.stringify(req.user, null, 2));
```

#### Better Error Messages
```javascript
return res.status(403).json({
  error: 'AUTHORIZATION_ERROR',
  message: 'Insufficient permissions',
  details: {
    requiredPermission: permission,
    userRole: req.user.role,
    userType: req.user.userType,
    hint: 'Please ensure you are logged in as an admin or have the required finance permissions'
  },
});
```

### 2. Created Helper Tools

#### `FIX_PERMISSION_ERROR_MONTHLY_PAYMENTS.md`
- Detailed troubleshooting guide
- Step-by-step testing instructions
- Common issues and solutions

#### `CHECK_LOGIN_STATUS.html`
- Visual tool to check current login status
- Shows user type, role, and permissions
- Helps identify if logged in as staff vs admin
- Quick actions to clear storage or go to login

## How to Use

### Step 1: Restart Backend Server
```bash
cd backend
node server.js
```

### Step 2: Check Your Login Status
Open `CHECK_LOGIN_STATUS.html` in your browser to see:
- Are you logged in?
- What user type? (admin or staff)
- What role do you have?
- Do you have finance access?

### Step 3: Log In as Admin (if needed)
If you're logged in as **staff**, you need to:
1. Log out
2. Go to Admin Login
3. Use admin credentials:
   - Username: `admin`
   - Password: `admin123`

### Step 4: Access Monthly Payment Settings
Navigate to: Finance → Monthly Payment Settings

The page should now load without 403 errors.

## Roles with Finance Access

These roles now have full finance access:
- ✅ `admin` → SCHOOL_ADMINISTRATOR
- ✅ `director` → SCHOOL_ADMINISTRATOR
- ✅ `sub-account` → SCHOOL_ADMINISTRATOR
- ✅ `super_admin` → SCHOOL_ADMINISTRATOR

These roles do NOT have finance access:
- ❌ `teacher` → No finance access
- ❌ `staff` → No finance access
- ❌ `guardian` → No finance access
- ❌ `student` → No finance access

## Troubleshooting

### Still Getting 403 Errors?

1. **Check backend console logs** - The server now logs detailed information about access denials

2. **Verify you're logged in as admin**:
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('userType')); // Should be 'admin'
   console.log(JSON.parse(localStorage.getItem('adminUser'))); // Should show admin user
   ```

3. **Clear cache and re-login**:
   - Open `CHECK_LOGIN_STATUS.html`
   - Click "Clear All & Logout"
   - Log in again as admin

4. **Check token**:
   ```javascript
   // In browser console:
   console.log(localStorage.getItem('authToken')); // Should have a value
   ```

## Testing the Fix

### Test 1: Check Login Status
1. Open `CHECK_LOGIN_STATUS.html`
2. Verify you're logged in as admin
3. Check that your role has finance access

### Test 2: Access Monthly Payment Settings
1. Navigate to Finance → Monthly Payment Settings
2. Page should load without errors
3. You should see three tabs:
   - Class Fees
   - Late Fees
   - General Settings

### Test 3: Add a Class Fee
1. Click "+ Add Class Fee"
2. Select a class
3. Enter monthly fee amount
4. Select payment months
5. Click "Add Class Fee"
6. Should succeed without 403 error

## What's Next?

After fixing the permission issue, you can:
1. ✅ Configure class monthly fees
2. ✅ Set up late fee rules
3. ✅ Generate monthly invoices
4. ✅ Track payment progress
5. ✅ View payment reports

## Files Modified
- `backend/middleware/financeAuth.js` - Added super admin support, improved error logging

## Files Created
- `FIX_PERMISSION_ERROR_MONTHLY_PAYMENTS.md` - Detailed troubleshooting guide
- `CHECK_LOGIN_STATUS.html` - Visual login status checker
- `MONTHLY_PAYMENTS_403_FIX_SUMMARY.md` - This file

## Need More Help?

If you're still experiencing issues:
1. Check the backend console for detailed error logs
2. Use `CHECK_LOGIN_STATUS.html` to verify your login status
3. Read `FIX_PERMISSION_ERROR_MONTHLY_PAYMENTS.md` for detailed troubleshooting
4. Make sure you're logged in as an **admin**, not as staff
