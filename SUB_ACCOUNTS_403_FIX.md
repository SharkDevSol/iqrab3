# Sub-Accounts 403 Error Fix

## Problem
Users were getting a 403 Forbidden error when trying to access `/api/admin/sub-accounts`:
```
GET http://localhost:5000/api/admin/sub-accounts 403 (Forbidden)
Access denied: Insufficient permissions
```

## Root Cause
The middleware in `backend/routes/subAccountRoutes.js` was checking for BOTH:
- `req.user.role === 'admin'` 
- `req.user.userType === 'admin'`

However, JWT tokens created before the `userType` field was added to the login response didn't include this field, causing the authorization check to fail.

## Solution Applied

### 1. Updated Authorization Middleware (backend/routes/subAccountRoutes.js)
Added backward compatibility to handle tokens without `userType`:

```javascript
// BEFORE (strict check)
if (req.user.role === 'admin' && req.user.userType === 'admin') {
  return next();
}

// AFTER (backward compatible)
if (req.user.role === 'admin' && (req.user.userType === 'admin' || req.user.userType === undefined)) {
  return next();
}
```

### 2. Added Detailed Logging
The middleware now logs:
- User object
- Role value
- UserType value
- Reason for access denial

This helps diagnose authorization issues quickly.

## How This Works Across Devices

### Token-Based Authentication
The fix works across all devices because:

1. **JWT tokens are self-contained**: They include all user information (id, role, userType)
2. **Tokens are device-independent**: Same token works on any device
3. **Backward compatibility**: Old tokens (without userType) still work

### When User Logs In
```javascript
// backend/routes/adminRoutes.js - Login endpoint
const token = jwt.sign(
  { 
    id: admin.id, 
    username: admin.username, 
    role: admin.role,
    userType: 'admin'  // ← This field is now included
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### Token Storage
```javascript
// APP/src/PAGE/Login/Login.jsx
localStorage.setItem('authToken', token);
localStorage.setItem('userType', user.userType || 'admin');
```

## Testing the Fix

### 1. With Existing Token (Old Token Without userType)
```bash
# Should work due to backward compatibility
curl -X GET http://localhost:5000/api/admin/sub-accounts \
  -H "Authorization: Bearer OLD_TOKEN_HERE"
```

### 2. With New Token (Has userType)
```bash
# Should work normally
curl -X GET http://localhost:5000/api/admin/sub-accounts \
  -H "Authorization: Bearer NEW_TOKEN_HERE"
```

### 3. After Logout/Login
```bash
# New token will have userType field
# Should work perfectly
```

## Preventing Future Issues

### 1. Always Include userType in JWT
Ensure all login endpoints include `userType` in the JWT payload:

**Primary Admin Login** (`/api/admin/login`):
```javascript
const token = jwt.sign(
  { 
    id: admin.id, 
    username: admin.username, 
    role: admin.role,
    userType: 'admin'  // ← Required
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Sub-Account Login** (`/api/admin/sub-account-login`):
```javascript
const token = jwt.sign(
  { 
    id: subAccount.id, 
    username: subAccount.username, 
    role: 'sub-account',
    userType: 'sub-account',  // ← Required
    permissions: subAccount.permissions
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);
```

### 2. Use Backward-Compatible Checks
When adding new fields to JWT tokens, always check for undefined:

```javascript
// Good - backward compatible
if (req.user.role === 'admin' && (req.user.userType === 'admin' || req.user.userType === undefined)) {
  // Allow access
}

// Bad - breaks old tokens
if (req.user.role === 'admin' && req.user.userType === 'admin') {
  // Old tokens without userType will fail
}
```

### 3. Token Refresh Strategy
Consider implementing token refresh to ensure users get updated tokens:

```javascript
// Option 1: Force re-login after major updates
if (!req.user.userType && req.user.role === 'admin') {
  // Log warning but allow access
  console.warn('User has old token format, consider forcing re-login');
}

// Option 2: Automatic token refresh
// Issue new token with updated fields on next request
```

## Verification Steps

1. **Check Backend Logs**: Look for authorization check logs
   ```
   🔐 Sub-Account Route Authorization Check
   User: { id: 1, username: 'admin', role: 'admin', userType: 'admin' }
   Role: admin
   UserType: admin
   ✅ Primary admin access granted
   ```

2. **Test API Endpoint**:
   ```bash
   # Should return 200 with sub-accounts list
   curl -X GET http://localhost:5000/api/admin/sub-accounts \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

3. **Test in Browser**:
   - Open DevTools → Network tab
   - Navigate to Admin Sub-Accounts page
   - Check request status (should be 200, not 403)

## Common Issues

### Issue: Still Getting 403 After Fix
**Solution**: Log out and log back in to get a fresh token with `userType` field

### Issue: Works on One Device But Not Another
**Solution**: 
1. Clear localStorage on the failing device
2. Log in again to get a fresh token
3. Verify token is being sent in Authorization header

### Issue: Sub-Account Can Access Management Page
**Solution**: Check that sub-account login sets `userType: 'sub-account'` correctly

## Files Modified
- `backend/routes/subAccountRoutes.js` - Updated authorization middleware
- Added detailed logging for debugging

## Date Fixed
February 21, 2026
