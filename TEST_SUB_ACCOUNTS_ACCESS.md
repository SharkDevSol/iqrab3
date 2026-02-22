# Testing Sub-Accounts Access

## Quick Test Steps

### 1. Ensure Backend is Running
```bash
# Check if backend is running on port 5000
curl http://localhost:5000/api/health
# Expected: {"status":"OK","message":"Server is running"}
```

### 2. Test Admin Login
```bash
# Login as primary admin
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Expected response includes:
# - token: "eyJhbGciOiJIUzI1NiIs..."
# - user.role: "admin"
# - user.userType: "admin"
```

### 3. Test Sub-Accounts Access
```bash
# Use the token from step 2
curl -X GET http://localhost:5000/api/admin/sub-accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: 200 OK with list of sub-accounts
# {"success":true,"data":[...]}
```

## Browser Testing

### Step 1: Open Browser DevTools
1. Press F12 to open DevTools
2. Go to Network tab
3. Clear any existing logs

### Step 2: Login
1. Navigate to login page
2. Enter admin credentials
3. Check Network tab for `/api/admin/login` request
4. Verify response includes `userType: "admin"`

### Step 3: Access Sub-Accounts Page
1. Navigate to Admin Sub-Accounts page
2. Check Network tab for `/api/admin/sub-accounts` request
3. Verify:
   - Request has `Authorization: Bearer ...` header
   - Response status is 200 (not 403)
   - Response contains sub-accounts data

### Step 4: Check Console Logs
1. Open Console tab in DevTools
2. Look for any errors
3. Backend console should show:
   ```
   🔐 Sub-Account Route Authorization Check
   User: { id: 1, username: 'admin', role: 'admin', userType: 'admin' }
   Role: admin
   UserType: admin
   ✅ Primary admin access granted
   ```

## Troubleshooting

### Problem: ERR_CONNECTION_REFUSED
**Cause**: Backend server is not running

**Solution**:
```bash
cd backend
npm run dev
# or
npm start
```

### Problem: 403 Forbidden
**Cause**: Old token without `userType` field (should be fixed now)

**Solution**:
1. Log out
2. Clear browser localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Log in again
4. Try accessing sub-accounts page

### Problem: 401 Unauthorized
**Cause**: Token expired or invalid

**Solution**:
1. Log out and log in again
2. Check token expiration (default: 24 hours)

### Problem: Network Error
**Cause**: Backend not running or wrong URL

**Solution**:
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check frontend API URL in `APP/src/utils/api.js`
3. Ensure CORS is enabled in backend

## Verification Checklist

- [ ] Backend server is running on port 5000
- [ ] Health check endpoint responds: `/api/health`
- [ ] Admin login works and returns token with `userType`
- [ ] Token is stored in localStorage as `authToken`
- [ ] Sub-accounts endpoint returns 200 (not 403)
- [ ] Backend logs show "✅ Primary admin access granted"
- [ ] Frontend displays sub-accounts list (or empty state)

## Cross-Device Testing

### Device 1 (Original)
1. Login and access sub-accounts page
2. Verify it works

### Device 2 (New Device)
1. Login with same credentials
2. Access sub-accounts page
3. Should work immediately (no 403 error)

### After Data Deletion
1. Clear browser data (localStorage, cookies)
2. Login again
3. Access sub-accounts page
4. Should work (backward compatibility ensures this)

## Expected Backend Logs

### Successful Access
```
🔐 Auth Middleware - Request: GET /api/admin/sub-accounts
Auth header present: true
Token present: true
Token length: 180
Token preview: eyJhbGciOiJIUzI1NiIs...
✅ JWT verified, user: { id: 1, username: 'admin', role: 'admin', userType: 'admin' }

🔐 Sub-Account Route Authorization Check
User: { id: 1, username: 'admin', role: 'admin', userType: 'admin' }
Role: admin
UserType: admin
✅ Primary admin access granted
```

### Denied Access (Sub-Account Trying to Access)
```
🔐 Sub-Account Route Authorization Check
User: { id: 2, username: 'subadmin', role: 'sub-account', userType: 'sub-account' }
Role: sub-account
UserType: sub-account
❌ Sub-account trying to access sub-account management
```

## Date Created
February 21, 2026
