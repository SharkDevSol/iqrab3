# 🚨 Quick Fix: 403 Forbidden Error

## Problem
Getting `403 Forbidden` when accessing Finance → Fee Management

## ⚡ Quick Solution (2 Steps)

### Step 1: Check Your User Role
```bash
cd backend
node scripts/check-user-role.js
```

This will show:
- All users in your system
- Which users have finance access
- Your current role

### Step 2: Make Yourself Admin

If you don't have finance access, run:

```bash
node scripts/make-user-admin.js YOUR_USER_ID
```

Replace `YOUR_USER_ID` with your actual user ID from Step 1.

### Step 3: Logout and Login Again

1. Logout from the application
2. Login again
3. Navigate to Finance → Fee Management
4. ✅ Should work now!

## Example

```bash
# Step 1: Check users
cd backend
node scripts/check-user-role.js

# Output shows:
# 1. John Doe
#    Username: john
#    Role: teacher
#    Finance Access: ❌ NO FINANCE ACCESS
#    ID: 123e4567-e89b-12d3-a456-426614174000

# Step 2: Make John an admin
node scripts/make-user-admin.js 123e4567-e89b-12d3-a456-426614174000

# Output:
# ✅ User updated successfully!
# New Role: director
# ✅ This user now has full finance access!

# Step 3: Logout and login as John
# Now you have access!
```

## Alternative: Login as Existing Admin

If you already have an admin user, just login with that account instead.

The `check-user-role.js` script will show you which users are admins.

## Roles with Finance Access

✅ **director** - Full finance access
✅ **admin** - Full finance access  
✅ **sub-account** - Full finance access
✅ **super_admin** - Full access to everything

❌ **teacher** - No finance access
❌ **guardian** - No finance access
❌ **staff** - No finance access
❌ **student** - No finance access

## Still Not Working?

1. **Clear browser cache**
2. **Clear localStorage**: Open browser console and run:
   ```javascript
   localStorage.clear();
   ```
3. **Restart backend server**
4. **Login again**

## Need Help?

Check `FIX_FINANCE_PERMISSIONS.md` for detailed troubleshooting.
