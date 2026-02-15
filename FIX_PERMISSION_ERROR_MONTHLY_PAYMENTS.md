# Fix: 403 Permission Error on Monthly Payment Settings

## Problem
When accessing the Monthly Payment Settings page, you're getting 403 (Forbidden) errors on these endpoints:
- `/api/finance/accounts/tree`
- `/api/finance/classes`
- `/api/finance/fee-structures`

Error message: `Access denied: AUTHORIZATION_ERROR`

## Root Cause
The finance endpoints require specific permissions that are checked by the `financeAuth.js` middleware. The user needs to be logged in with a role that has finance permissions.

## What Was Fixed

### 1. Added Super Admin Support
- Super admins now automatically have all finance permissions
- API keys are also supported for cross-system authentication

### 2. Added Sub-Account Role Support
- Sub-accounts now get SCHOOL_ADMINISTRATOR permissions
- This allows sub-accounts to access finance features

### 3. Improved Error Logging
- Better error messages that show the user's role and required permission
- Helpful hints in the error response

### 4. Role Mapping Updated
The following roles now have finance access:
- `admin` → SCHOOL_ADMINISTRATOR (full finance access)
- `director` → SCHOOL_ADMINISTRATOR (full finance access)
- `sub-account` → SCHOOL_ADMINISTRATOR (full finance access)
- `super_admin` → SCHOOL_ADMINISTRATOR (full finance access)

## How to Test

### Step 1: Restart the Backend Server
```bash
cd backend
node server.js
```

Or if you have the restart script:
```powershell
.\backend\restart-server.ps1
```

### Step 2: Check Your Login
Make sure you're logged in as an **admin** user, not as a staff member.

**To check your current role:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.getItem('adminUser')`
4. You should see a user object with `"role": "admin"`

**If you're logged in as staff:**
- Staff users (teachers, general staff) don't have finance access by default
- You need to log out and log in as an admin

### Step 3: Login as Admin
1. Go to: `http://localhost:5173/login`
2. Click on "Admin Login"
3. Use admin credentials:
   - Username: `admin`
   - Password: `admin123` (or your custom admin password)

### Step 4: Access Monthly Payment Settings
1. Navigate to Finance → Monthly Payment Settings
2. The page should now load without 403 errors
3. You should see:
   - Class Fees tab
   - Late Fees tab
   - General Settings tab

## Troubleshooting

### Still Getting 403 Errors?

**Check the backend console logs:**
The server now logs detailed information when access is denied:
```
Access denied: User <id> (role: <role>, userType: <type>) attempted <permission>
User object: { ... }
```

**Common Issues:**

1. **Logged in as staff instead of admin**
   - Solution: Log out and log in as admin

2. **Token expired**
   - Solution: Log out and log in again

3. **Wrong user type**
   - Check: `localStorage.getItem('userType')` should be `'admin'`
   - If it's `'staff'`, you need to log in as admin

4. **No token in request**
   - Check: `localStorage.getItem('authToken')` should have a value
   - If empty, log in again

### Verify Your Token
Open browser console and run:
```javascript
// Check if you have a token
console.log('Token:', localStorage.getItem('authToken'));

// Check your user type
console.log('User Type:', localStorage.getItem('userType'));

// Check your user data
console.log('Admin User:', JSON.parse(localStorage.getItem('adminUser') || '{}'));
```

### Test the API Directly
You can test if the API is working with curl:
```bash
# Replace YOUR_TOKEN with your actual token from localStorage
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/finance/classes
```

## What Permissions Are Required?

The Monthly Payment Settings page requires these permissions:
- `FEE_STRUCTURES_VIEW` - To view fee structures
- `FEE_STRUCTURES_CREATE` - To create new fee structures
- `FEE_STRUCTURES_UPDATE` - To update fee structures
- `FEE_STRUCTURES_DELETE` - To delete fee structures
- `LATE_FEES_MANAGE` - To manage late fee rules
- `ACCOUNTS_VIEW` - To view chart of accounts

All these permissions are included in the `SCHOOL_ADMINISTRATOR` role, which is assigned to:
- admin
- director
- sub-account
- super_admin

## Next Steps

After fixing the permission issue, you can:
1. Add class fee structures
2. Configure late fee rules
3. Generate monthly invoices for students
4. Track payment progress

## Need Help?

If you're still having issues:
1. Check the backend console for detailed error logs
2. Verify you're logged in as an admin (not staff)
3. Make sure the backend server is running
4. Clear browser cache and localStorage, then log in again
