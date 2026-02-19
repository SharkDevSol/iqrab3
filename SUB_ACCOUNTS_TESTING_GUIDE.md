# Sub-Accounts Testing Guide

## Quick Test Checklist

### ✅ Test 1: Primary Admin Access
**Steps:**
1. Log in as primary admin (from `admin_users` table)
2. Check navigation sidebar

**Expected Result:**
- ✅ See ALL navigation items
- ✅ Can access ALL pages
- ✅ No "Access Denied" messages

**Console Check:**
```javascript
localStorage.getItem('userType')        // Should be: 'admin'
localStorage.getItem('userPermissions') // Should be: null
```

---

### ✅ Test 2: Sub-Account with Permissions
**Steps:**
1. As primary admin, create a sub-account
2. Assign permissions: "Register Student", "View Students", "Dashboard"
3. Log out
4. Log in as the sub-account

**Expected Result:**
- ✅ See ONLY 3 navigation items:
  - Dashboard
  - Register Student
  - View Students
- ✅ Can access these 3 pages
- ✅ Attempting to access other pages shows "Access Denied"

**Console Check:**
```javascript
localStorage.getItem('userType')        // Should be: 'sub-account'
JSON.parse(localStorage.getItem('userPermissions'))
// Should be: ['register_student', 'list_students', 'dashboard']
```

---

### ✅ Test 3: Sub-Account with NO Permissions
**Steps:**
1. As primary admin, create a sub-account
2. DO NOT select any permissions (leave all unchecked)
3. Save the account
4. Log out
5. Log in as the sub-account

**Expected Result:**
- ✅ See NO navigation items (empty sidebar)
- ✅ Only home page accessible
- ✅ Attempting to access any page shows "Access Denied"

**Console Check:**
```javascript
localStorage.getItem('userType')        // Should be: 'sub-account'
JSON.parse(localStorage.getItem('userPermissions'))
// Should be: []
```

---

### ✅ Test 4: Sub-Accounts Table Display
**Steps:**
1. Log in as primary admin
2. Navigate to Sub-Accounts page
3. Create 10+ sub-accounts with various permissions

**Expected Result:**
- ✅ ALL accounts visible in table
- ✅ No accounts cut off or hidden
- ✅ Table scrolls horizontally on small screens
- ✅ All rows fully visible

---

### ✅ Test 5: Permission Updates
**Steps:**
1. Log in as primary admin
2. Edit a sub-account
3. Add new permissions
4. Save
5. Log in as that sub-account (in different browser/incognito)

**Expected Result:**
- ✅ New permissions immediately available
- ✅ New navigation items appear
- ✅ Can access newly permitted pages

---

### ✅ Test 6: Account Status Toggle
**Steps:**
1. Log in as primary admin
2. Create and activate a sub-account
3. Log in as sub-account (keep session open)
4. In another browser, log in as admin
5. Deactivate the sub-account
6. Try to use the sub-account session

**Expected Result:**
- ✅ Existing session continues until token expires
- ✅ New login attempts fail with "Account is disabled"
- ✅ Can reactivate and login again

---

## Browser Console Debugging

### Check Current User Info
```javascript
// User type
console.log('User Type:', localStorage.getItem('userType'));

// Permissions
const perms = localStorage.getItem('userPermissions');
console.log('Permissions:', perms ? JSON.parse(perms) : 'None');

// Auth token
console.log('Has Token:', !!localStorage.getItem('authToken'));

// Login status
console.log('Is Logged In:', localStorage.getItem('isLoggedIn'));
```

### Check Navigation Filtering
```javascript
// Get stored values
const userType = localStorage.getItem('userType');
const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');

console.log('User Type:', userType);
console.log('Permissions:', permissions);
console.log('Permission Count:', permissions.length);

// Check if specific permission exists
const hasRegisterStudent = permissions.includes('register_student');
console.log('Can Register Student:', hasRegisterStudent);
```

### Check Path Permission
```javascript
// Check if current path is permitted
const currentPath = window.location.pathname;
const userType = localStorage.getItem('userType');
const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');

console.log('Current Path:', currentPath);
console.log('User Type:', userType);
console.log('Permissions:', permissions);

// For sub-accounts, check if path is in permitted paths
if (userType === 'sub-account') {
  // This would need the permission utility imported
  console.log('Path should be checked against permissions');
}
```

---

## Common Issues & Solutions

### Issue: Sub-account sees no navigation items
**Possible Causes:**
1. No permissions assigned
2. Permissions not saved correctly
3. Login didn't store permissions

**Debug:**
```javascript
// Check if permissions are stored
const perms = localStorage.getItem('userPermissions');
console.log('Stored Permissions:', perms);

// If null or empty, permissions weren't assigned or stored
```

**Solution:**
- Edit sub-account and assign permissions
- Log out and log in again

---

### Issue: Sub-account sees all navigation items
**Possible Causes:**
1. Logged in as primary admin by mistake
2. Code not updated (old version)

**Debug:**
```javascript
// Check user type
console.log('User Type:', localStorage.getItem('userType'));
// Should be 'sub-account', not 'admin'
```

**Solution:**
- Verify logged in as correct user
- Clear cache and reload
- Verify code changes deployed

---

### Issue: "Access Denied" on permitted page
**Possible Causes:**
1. Permission path mismatch
2. Permissions not loaded correctly

**Debug:**
```javascript
// Check current path
console.log('Current Path:', window.location.pathname);

// Check permissions
const perms = JSON.parse(localStorage.getItem('userPermissions') || '[]');
console.log('Permissions:', perms);

// Check if permission exists for this path
// (Would need to check adminPermissions.js mapping)
```

**Solution:**
- Verify permission key matches the path
- Check `adminPermissions.js` for correct path mapping
- Re-assign permissions if needed

---

### Issue: Table shows only some accounts
**Possible Causes:**
1. CSS overflow issue (should be fixed)
2. Search filter active
3. Database query issue

**Debug:**
```javascript
// Check if search is active
const searchInput = document.querySelector('input[type="text"]');
console.log('Search Value:', searchInput?.value);

// Check table rows
const rows = document.querySelectorAll('table tbody tr');
console.log('Visible Rows:', rows.length);
```

**Solution:**
- Clear search filter
- Check browser console for errors
- Verify CSS fix applied

---

## API Testing with cURL

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "userType": "admin",
    "permissions": []
  }
}
```

### Test Sub-Account Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"subaccount1","password":"password123"}'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "subaccount1",
    "userType": "sub-account",
    "permissions": ["register_student", "list_students"]
  }
}
```

### Get All Sub-Accounts
```bash
curl -X GET http://localhost:5000/api/admin/sub-accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "is_active": true,
      "permissions": ["register_student", "list_students"],
      "permissionCount": 2
    }
  ]
}
```

---

## Performance Testing

### Load Test: Many Sub-Accounts
1. Create 100+ sub-accounts
2. Navigate to sub-accounts page
3. Measure load time

**Expected:**
- ✅ Page loads in < 2 seconds
- ✅ All accounts visible
- ✅ Search works instantly
- ✅ No lag when scrolling

### Load Test: Many Permissions
1. Create sub-account with ALL permissions
2. Log in as that sub-account
3. Check navigation rendering

**Expected:**
- ✅ All permitted items appear
- ✅ Navigation renders in < 500ms
- ✅ No performance issues

---

## Security Testing

### Test 1: Direct URL Access
**Steps:**
1. Log in as sub-account with limited permissions
2. Try to access non-permitted page by typing URL directly

**Expected:**
- ✅ Shows "Access Denied" message
- ✅ Cannot access page content
- ✅ Redirects or blocks access

### Test 2: Token Manipulation
**Steps:**
1. Log in as sub-account
2. Open browser console
3. Try to modify permissions in localStorage
4. Reload page

**Expected:**
- ✅ Backend still enforces correct permissions
- ✅ API calls fail if permissions don't match token
- ✅ Cannot escalate privileges

### Test 3: Disabled Account
**Steps:**
1. Log in as sub-account
2. Admin disables the account
3. Try to make API calls

**Expected:**
- ✅ Existing session works until token expires
- ✅ New login attempts fail
- ✅ Cannot re-enable own account

---

## Automated Test Script

```javascript
// Run in browser console after logging in

async function testSubAccountPermissions() {
  const userType = localStorage.getItem('userType');
  const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
  
  console.log('=== Sub-Account Permission Test ===');
  console.log('User Type:', userType);
  console.log('Permissions:', permissions);
  console.log('Permission Count:', permissions.length);
  
  if (userType === 'admin') {
    console.log('✅ PRIMARY ADMIN - Full access');
    return;
  }
  
  if (userType === 'sub-account') {
    if (permissions.length === 0) {
      console.log('⚠️ SUB-ACCOUNT with NO permissions');
      console.log('Expected: No navigation items visible');
    } else {
      console.log('✅ SUB-ACCOUNT with permissions');
      console.log('Expected: Only permitted items visible');
      console.log('Permitted paths:');
      permissions.forEach(perm => {
        console.log(`  - ${perm}`);
      });
    }
  }
  
  // Check navigation items
  const navItems = document.querySelectorAll('nav a, nav button');
  console.log(`\nVisible Navigation Items: ${navItems.length}`);
  
  console.log('=== Test Complete ===');
}

// Run the test
testSubAccountPermissions();
```

---

## Conclusion

Use this guide to thoroughly test the sub-accounts system. All tests should pass for the system to be considered working correctly.

**Critical Tests:**
1. ✅ Primary admin sees everything
2. ✅ Sub-account with permissions sees only permitted items
3. ✅ Sub-account without permissions sees nothing
4. ✅ Direct URL access is blocked for non-permitted pages
5. ✅ All sub-accounts display in management table
