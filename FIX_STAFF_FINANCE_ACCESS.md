# Fix Staff Finance Access

## Problem
Your system has two user systems:
1. **Prisma Users** (used by finance permissions) - Empty
2. **Staff Users** (what you're using) - Has users

The finance module checks for Prisma User roles, but you're logged in as a staff user.

## Solution: Update Finance Auth to Support Staff Users

Update the finance authentication middleware to recognize staff users.

### Step 1: Update financeAuth.js

**File**: `backend/middleware/financeAuth.js`

Add this function after the `hasPermission` function (around line 200):

```javascript
/**
 * Check if user has a specific permission (supports both Prisma and staff users)
 * @param {Object} user - User object with role property
 * @param {string} permission - Permission to check
 * @returns {boolean} - True if user has permission
 */
function hasPermission(user, permission) {
  if (!user) {
    return false;
  }

  // Super Admin has all permissions
  if (user.isSuperAdmin || user.role === 'super_admin') {
    return true;
  }

  // Support staff users - check userType and staffType
  let userRole = user.role;
  
  // If user is from staff_users table
  if (user.userType === 'staff' && user.staffType) {
    // Map staff types to finance roles
    const staffTypeMapping = {
      'director': 'director',
      'admin': 'admin',
      'vice_director': 'admin',
      'accountant': 'director', // Give accountants full finance access
      'finance_officer': 'director', // Give finance officers full access
      'teacher': 'teacher',
      'staff': 'staff'
    };
    
    userRole = staffTypeMapping[user.staffType.toLowerCase()] || user.staffType;
  }

  // Check if role exists in ROLE_PERMISSIONS
  if (!Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, userRole)) {
    return false;
  }

  // Map existing role to finance role if needed
  let financeRole = userRole;
  if (ROLE_PERMISSIONS[userRole] === null) {
    return false;
  }
  if (typeof ROLE_PERMISSIONS[userRole] === 'string') {
    financeRole = ROLE_PERMISSIONS[userRole];
  }

  // Check if financeRole exists in ROLE_PERMISSIONS
  if (!Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, financeRole)) {
    return false;
  }

  const permissions = ROLE_PERMISSIONS[financeRole];
  if (!permissions || !Array.isArray(permissions)) {
    return false;
  }

  return permissions.includes(permission);
}
```

### Step 2: Check Your Staff Type

Run this to see your staff type:

```bash
cd backend
node -e "const pool = require('./config/db'); pool.query('SELECT global_staff_id, username, staff_type, class_name FROM staff_users').then(r => { console.log(r.rows); process.exit(); });"
```

### Step 3: Update Your Staff Type to Admin

If your staff_type is not 'director' or 'admin', update it:

```sql
-- Connect to your database and run:
UPDATE staff_users 
SET staff_type = 'director' 
WHERE username = 'your_username';
```

Or create a script:

**File**: `backend/scripts/make-staff-admin.js`

```javascript
const pool = require('../config/db');

async function makeStaffAdmin() {
  const username = process.argv[2];
  
  if (!username) {
    console.log('Usage: node scripts/make-staff-admin.js <username>');
    return;
  }

  try {
    // Check current user
    const current = await pool.query(
      'SELECT * FROM staff_users WHERE username = $1',
      [username]
    );

    if (current.rows.length === 0) {
      console.log(`User ${username} not found`);
      return;
    }

    console.log('Current user:', current.rows[0]);

    // Update to director
    await pool.query(
      'UPDATE staff_users SET staff_type = $1 WHERE username = $2',
      ['director', username]
    );

    console.log(`✅ ${username} is now a director with finance access!`);
    console.log('Logout and login again to apply changes.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

makeStaffAdmin();
```

Run it:
```bash
cd backend
node scripts/make-staff-admin.js your_username
```

## Quick Alternative: Bypass for Development

**⚠️ DEVELOPMENT ONLY**

Temporarily allow all authenticated users:

**File**: `backend/middleware/financeAuth.js`

Change the `requirePermission` function to:

```javascript
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'AUTHENTICATION_ERROR',
        message: 'Authentication required',
      });
    }

    // TEMPORARY: Allow all authenticated users (REMOVE IN PRODUCTION)
    console.log(`⚠️  DEV MODE: Allowing ${req.user.username} access to ${permission}`);
    return next();

    // Original permission check (commented out for dev)
    // if (!hasPermission(req.user, permission)) {
    //   return res.status(403).json({
    //     error: 'AUTHORIZATION_ERROR',
    //     message: 'Insufficient permissions',
    //   });
    // }
    // next();
  };
}
```

## Recommended Solution

1. **Update financeAuth.js** to support staff users (Step 1 above)
2. **Make your staff user an admin** (Step 3 above)
3. **Logout and login again**
4. **Test access** to Finance → Fee Management

This properly integrates staff authentication with finance permissions!
