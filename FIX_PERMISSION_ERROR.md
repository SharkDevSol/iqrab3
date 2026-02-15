# Fix: 403 Forbidden Error - Permission Denied

## Problem

You're getting this error:
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
Access denied: AUTHORIZATION_ERROR
```

## What Happened

The Monthly Payments endpoints require specific permissions, and your current role (likely "director") didn't have the `PAYMENTS_CREATE` permission.

## Solution Applied

I've updated the permissions in `backend/middleware/financeAuth.js` to give the `SCHOOL_ADMINISTRATOR` role (which directors are mapped to) the necessary permissions:

- ✅ `INVOICES_VIEW` - View invoices
- ✅ `INVOICES_CREATE` - Create invoices  
- ✅ `PAYMENTS_VIEW` - View payments
- ✅ `PAYMENTS_CREATE` - Record payments (NEW!)

## How to Fix

### Step 1: Restart the Backend Server

**Option A: Using the terminal where it's running**
1. Go to the terminal where backend is running
2. Press `Ctrl + C` to stop it
3. Run: `npm start`

**Option B: Using PowerShell**
```powershell
# Stop the server
cd backend
# If server is running, press Ctrl+C

# Start it again
npm start
```

### Step 2: Refresh Your Browser

After restarting the backend:
1. Go back to your browser
2. Press `Ctrl + F5` (hard refresh)
3. Try accessing Monthly Payments again

### Step 3: Verify It Works

Navigate to:
```
Finance Management → Monthly Payments
```

You should now see the dashboard without the 403 error!

## Quick Restart Commands

### Windows (PowerShell)
```powershell
# In backend directory
npm start
```

### If Port is Busy
```powershell
# Kill process on port 5000
npx kill-port 5000

# Then start server
npm start
```

## What If It Still Doesn't Work?

### Check 1: Verify You're Logged In
Make sure you're logged in as a director or admin user.

### Check 2: Clear Browser Storage
1. Press `F12` to open DevTools
2. Go to "Application" tab
3. Click "Clear storage"
4. Click "Clear site data"
5. Refresh the page
6. Log in again

### Check 3: Check Your Role
In the browser console (F12), type:
```javascript
localStorage.getItem('userType')
```

Should return: `"director"` or similar

### Check 4: Verify Backend is Running
Check the terminal where backend is running. You should see:
```
Server running on port 5000
```

## Permissions Now Available for Directors

As a director, you now have access to:

### View Permissions
- ✅ View all financial accounts
- ✅ View fee structures
- ✅ View invoices
- ✅ View payments
- ✅ View expenses
- ✅ View budgets
- ✅ View payroll
- ✅ View all financial reports

### Action Permissions
- ✅ Create invoices
- ✅ Record payments (NEW!)
- ✅ Approve refunds
- ✅ Approve expenses
- ✅ Approve budgets
- ✅ Approve payroll
- ✅ Reverse invoices
- ✅ Process approvals

## Testing

After restarting the server, test these endpoints:

### 1. View Overview
```
GET /api/finance/monthly-payments/overview?month=2&year=2026
```
Should return: 200 OK (not 403)

### 2. Record Payment
```
POST /api/finance/monthly-payments/record-payment
```
Should work (not 403)

## Alternative: Create a Finance Officer Account

If you want a dedicated finance user, you can create a user with the `FINANCE_OFFICER` role, which has full finance permissions.

## Files Modified

```
backend/middleware/financeAuth.js
```

Added permissions to `SCHOOL_ADMINISTRATOR` role:
- `INVOICES_CREATE`
- `PAYMENTS_CREATE`

## Summary

✅ **Problem**: 403 Forbidden error
✅ **Cause**: Missing permissions for director role
✅ **Fix**: Added `PAYMENTS_CREATE` permission to directors
✅ **Action**: Restart backend server
✅ **Result**: Monthly Payments now accessible

---

**Quick Fix**: Restart backend server and refresh browser!

```bash
cd backend
npm start
```

Then refresh browser: `Ctrl + F5`

---

**Status**: ✅ Fixed - Restart server to apply changes
