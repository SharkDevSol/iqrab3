# Fix Finance Permissions - 403 Error

## Problem
You're getting a 403 Forbidden error when accessing `/api/finance/fee-structures` because your user role doesn't have the required finance permissions.

## Quick Fix Options

### Option 1: Login as Admin/Director (Recommended)
The easiest solution is to login with an admin or director account, which already has finance permissions.

**Roles with Finance Access:**
- `director` → Maps to SCHOOL_ADMINISTRATOR
- `admin` → Maps to SCHOOL_ADMINISTRATOR  
- `sub-account` → Maps to SCHOOL_ADMINISTRATOR
- `super_admin` → Full access to everything

### Option 2: Add Your Role to Finance Permissions

If you need to give finance access to other roles (like teachers or staff), update the backend:

**File**: `backend/middleware/financeAuth.js`

Find the `ROLE_PERMISSIONS` object and add your role:

```javascript
// Add this to ROLE_PERMISSIONS
teacher: 'SCHOOL_ADMINISTRATOR', // Give teachers admin finance access
// OR
staff: 'FINANCE_OFFICER', // Give staff finance officer access
```

### Option 3: Temporary Bypass for Development

**⚠️ ONLY FOR DEVELOPMENT - NOT FOR PRODUCTION**

You can temporarily bypass permission checks:

**File**: `backend/routes/financeFeeStructureRoutes.js`

Change line 13 from:
```javascript
router.get('/', authenticateToken, requirePermission(FINANCE_PERMISSIONS.FEE_STRUCTURES_VIEW), async (req, res) => {
```

To:
```javascript
router.get('/', authenticateToken, async (req, res) => {
```

Do this for all routes in the file (POST, PUT, DELETE).

## Recommended Solution

**Use Option 1** - Login as an admin or director user.

### How to Check Your Current Role

Add this to your frontend to see your current role:

```javascript
// In any component
console.log('Current user:', localStorage.getItem('token'));
// Decode the JWT token to see your role
```

Or check the backend logs when you make a request - it will show:
```
Access denied: User X (role: teacher) attempted fee_structures:view
```

## Create an Admin User

If you don't have an admin user, create one:

### Option A: Using Prisma Studio
```bash
cd backend
npx prisma studio
```

Then:
1. Open the `User` table
2. Find your user
3. Change `role` to `director` or `admin`
4. Save

### Option B: Using SQL
```sql
-- Update your user to admin
UPDATE "User" 
SET role = 'director' 
WHERE username = 'your_username';
```

### Option C: Create a new admin user
Run this script:

**File**: `backend/scripts/create-admin-user.js`
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createAdminUser() {
  const admin = await prisma.user.create({
    data: {
      name: 'Finance Admin',
      username: 'finance_admin',
      role: 'director',
      // Add other required fields
    }
  });
  
  console.log('Admin user created:', admin);
}

createAdminUser();
```

Run it:
```bash
cd backend
node scripts/create-admin-user.js
```

## Verify Your Access

After fixing, test by:

1. **Login with admin account**
2. **Navigate to Finance → Fee Management**
3. **Check browser console** - should see successful API calls
4. **Check backend logs** - should NOT see "Access denied" messages

## Current Role Mappings

```
director        → SCHOOL_ADMINISTRATOR (Full finance access)
admin           → SCHOOL_ADMINISTRATOR (Full finance access)
sub-account     → SCHOOL_ADMINISTRATOR (Full finance access)
super_admin     → Full access to everything
teacher         → No finance access (null)
guardian        → No finance access (null)
staff           → No finance access (null)
student         → No finance access (null)
```

## What Each Role Can Do

### SCHOOL_ADMINISTRATOR (director, admin)
✅ View/Create/Update/Delete fee structures
✅ View/Create invoices
✅ View/Create payments
✅ Approve refunds
✅ View reports
✅ Manage workflows

### FINANCE_OFFICER
✅ Full access to fee structures
✅ Create/Update invoices
✅ Record payments
✅ Manage expenses
✅ View reports

### AUDITOR
✅ View-only access to all financial records
✅ Export reports
✅ View audit logs

## Next Steps

1. **Identify your current role** (check backend logs)
2. **Choose a fix option** (Option 1 recommended)
3. **Apply the fix**
4. **Test access** to Finance → Fee Management
5. **Verify** you can see fee structures

## Still Having Issues?

If you still get 403 errors after trying these fixes:

1. **Clear browser cache and localStorage**
2. **Logout and login again**
3. **Check backend logs** for the exact error
4. **Verify token is valid** (not expired)
5. **Check database** - ensure user role is correct

## Security Note

⚠️ **Important**: Only give finance permissions to trusted users. Finance access allows:
- Creating and modifying fees
- Generating invoices
- Recording payments
- Viewing financial reports
- Managing budgets

Keep these permissions restricted to authorized personnel only!
