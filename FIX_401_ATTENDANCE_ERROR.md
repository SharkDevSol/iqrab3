# 🔧 Fix 401 Unauthorized Error - Attendance System

## Problem
Getting `401 (Unauthorized)` error when accessing attendance API:
```
GET http://localhost:5000/api/hr/attendance/ethiopian-month?ethMonth=6&ethYear=2018 401 (Unauthorized)
```

## Root Cause
The authentication token is either:
1. **Missing** - User not logged in
2. **Expired** - Token has passed its expiration time
3. **Invalid** - Token format is incorrect

## Quick Fix Steps

### Step 1: Check Token Status
Open `CHECK_TOKEN_DEBUG.html` in your browser to diagnose:
```
file:///C:/Users/hp/Desktop/SCHOOLS (2)/SCHOOLS/CHECK_TOKEN_DEBUG.html
```

This will show you:
- ✅ If token exists
- ⏰ If token is expired
- 🧪 Test the API call directly

### Step 2: Solutions Based on Diagnosis

#### If Token is Missing:
**You need to log in again**
1. Go to your login page
2. Enter credentials
3. Token will be stored automatically

#### If Token is Expired:
**Clear and re-login**
1. Click "Clear Token" in the debug page
2. Go to login page
3. Log in again with credentials

#### If Token Exists but Still 401:
**Backend authentication issue**

Check the backend route protection:

```javascript
// backend/routes/hr.js
// Make sure the attendance route has proper auth middleware

router.get('/attendance/ethiopian-month', 
  auth,  // ← This middleware should be here
  async (req, res) => {
    // ... route handler
  }
);
```

### Step 3: Verify Backend Auth Middleware

Check `backend/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = auth;
```

### Step 4: Check JWT_SECRET

Make sure `backend/.env` has:
```env
JWT_SECRET=your-secret-key-here
```

## Common Issues & Solutions

### Issue 1: Token Not Being Sent
**Check the frontend code:**
```javascript
// AttendanceSystem.jsx line 38
const token = localStorage.getItem('authToken') || localStorage.getItem('token');

const response = await axios.get(
  `${API_URL}/api/hr/attendance/ethiopian-month?ethMonth=${selectedEthMonth}&ethYear=${selectedEthYear}`,
  { headers: { 'Authorization': `Bearer ${token}` } }  // ← Token must be here
);
```

### Issue 2: Wrong Token Key
The app uses `authToken` but some old code might use `token`:
```javascript
// Login.jsx stores as 'authToken'
localStorage.setItem('authToken', token);

// Make sure all API calls use the same key
const token = localStorage.getItem('authToken');
```

### Issue 3: CORS Issues
If you see CORS errors along with 401:
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:5173',  // Your frontend URL
  credentials: true
}));
```

## Testing the Fix

### Test 1: Manual API Call
Use the debug page to test the API directly with your token.

### Test 2: Browser Console
Open DevTools Console and run:
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('authToken'));

// Test API call
fetch('http://localhost:5000/api/hr/attendance/ethiopian-month?ethMonth=6&ethYear=2018', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  }
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

### Test 3: Network Tab
1. Open DevTools → Network tab
2. Reload the attendance page
3. Find the attendance API call
4. Check the **Request Headers** section
5. Verify `Authorization: Bearer <token>` is present

## Prevention

### Auto-Redirect on 401
Add this to your axios interceptor:

```javascript
// APP/src/utils/api.js or similar
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Quick Commands

### Check if backend is running:
```bash
curl http://localhost:5000/api/health
```

### Restart backend:
```bash
cd backend
npm start
```

### Check backend logs:
Look for authentication errors in the terminal where backend is running.

## Still Not Working?

1. **Clear browser cache and localStorage**
   - DevTools → Application → Local Storage → Clear All
   - Hard refresh: Ctrl+Shift+R

2. **Check backend logs**
   - Look for JWT verification errors
   - Check if JWT_SECRET is loaded

3. **Verify user role**
   - Some routes might require specific roles
   - Check if your user has the right permissions

4. **Test with Postman**
   - Get a fresh token from login
   - Test the attendance endpoint directly
   - This isolates frontend vs backend issues

## Need Help?

If still getting 401 after all these steps:
1. Share the output from `CHECK_TOKEN_DEBUG.html`
2. Share backend console logs
3. Share the Network tab screenshot showing the failed request
