# How to Login as Admin (Not Staff)

## Problem
You're getting "Access denied: Only administrators can manage sub-accounts" because you're logged in as a **staff member**, not as an **admin**.

## Solution: Login as Admin

### Step 1: Logout from Current Account
1. Click logout button in your app
2. Or clear browser data:
   - Press F12 (DevTools)
   - Go to Console tab
   - Run: `localStorage.clear()`
   - Refresh page

### Step 2: Login as Admin
Use the **admin login page** (not staff login):

**URL**: `http://localhost:3000/login` (or your admin login page)

**Credentials**:
- Username: `admin`
- Password: `admin123`

### Step 3: Verify You're Logged in as Admin
After login, check the browser console (F12):
```javascript
// Check what's stored
console.log('User Type:', localStorage.getItem('userType'));
console.log('Admin User:', localStorage.getItem('adminUser'));

// Should show:
// User Type: admin
// Admin User: {"id":1,"username":"admin",...}
```

### Step 4: Access Sub-Accounts Page
Now navigate to: `http://localhost:3000/admin/sub-accounts`

Should work without 403 error! ✅

## Understanding the Difference

### Staff Login vs Admin Login

| Feature | Staff Login | Admin Login |
|---------|-------------|-------------|
| URL | `/staff/login` or staff portal | `/login` or admin portal |
| User Type | `staff` or `teacher` | `admin` |
| Database Table | `staff` table | `admin_users` table |
| Can Manage Sub-Accounts | ❌ NO | ✅ YES |
| Can Access Finance | ✅ YES (if permitted) | ✅ YES |
| Can Access Attendance | ✅ YES | ✅ YES |

### How to Tell Which Account You're Using

**Check localStorage**:
```javascript
// In browser console (F12)
localStorage.getItem('userType')

// If returns 'staff' or 'teacher' → You're logged in as staff
// If returns 'admin' → You're logged in as admin
```

**Check the token**:
```javascript
// In browser console
const token = localStorage.getItem('authToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);

// Staff token has:
// { id: <staffId>, role: 'teacher' or 'staff', userType: 'staff' }

// Admin token has:
// { id: 1, role: 'admin', userType: 'admin' }
```

## Common Mistakes

### Mistake 1: Using Staff Login for Admin Features
❌ Staff login → Try to access sub-accounts → 403 Error

✅ Admin login → Access sub-accounts → Works!

### Mistake 2: Wrong Login Page
Some apps have multiple login pages:
- `/login` - Admin login
- `/staff/login` - Staff login
- `/student/login` - Student login

Make sure you're using the **admin login page**.

### Mistake 3: Expecting Staff to Manage Sub-Accounts
Staff members (teachers, etc.) cannot manage sub-accounts. Only primary admins can.

## Creating Additional Admin Users

If you need more admin users (not sub-accounts):

```sql
-- Connect to PostgreSQL
psql -U postgres -d school_management

-- Create new admin user
INSERT INTO admin_users (username, password_hash, name, email, role)
VALUES (
  'admin2',
  '$2b$10$YourHashedPasswordHere',
  'Second Admin',
  'admin2@school.com',
  'admin'
);

-- Or use bcrypt to hash password in Node.js:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('yourpassword', 10);
```

## Quick Test

### Test if you're logged in as admin:
```bash
# Get your current token
# (From browser console: localStorage.getItem('authToken'))

# Test the sub-accounts endpoint
curl -X GET http://localhost:5000/api/admin/sub-accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# If you're logged in as admin:
# Response: 200 OK with sub-accounts list

# If you're logged in as staff:
# Response: 403 Forbidden
# Error: "Only administrators can manage sub-accounts"
```

## Summary

1. **Logout** from current account
2. **Login as admin** (username: `admin`, password: `admin123`)
3. **Verify** you're logged in as admin (check localStorage)
4. **Access** sub-accounts page → Should work! ✅

---

**Remember**: Staff members cannot manage sub-accounts. You must login as an admin!
