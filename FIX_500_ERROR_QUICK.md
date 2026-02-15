# Fix 500 Error - Quick Guide

## The Problem

Getting 500 (Internal Server Error) when trying to add a class fee structure.

## The Cause

The database schema was updated (added `description` field), but the server is still using the old Prisma client.

## The Solution (3 Steps)

### Step 1: Stop the Backend Server

In the terminal where the server is running, press:
```
Ctrl + C
```

### Step 2: Start the Server Again

```bash
cd backend
node server.js
```

### Step 3: Try Again

1. Refresh your browser (F5)
2. Go to **Finance → Monthly Payment Settings**
3. Click **"+ Add Class Fee"**
4. Fill in the form with Ethiopian months selected
5. Click **"Add Class Fee"**

Should work now! ✅

## Quick Restart (Windows)

Just double-click: **`RESTART_BACKEND.bat`**

This will:
1. Stop all Node processes
2. Start the backend server in a new window
3. Done!

## Still Getting 500 Error?

### Check Backend Console

Look at the backend server console for the actual error message. It will tell you what's wrong.

### Common Issues:

1. **"Unknown field: description"**
   - Solution: Server not restarted properly
   - Fix: Kill all node processes and restart

2. **"Cannot connect to database"**
   - Solution: PostgreSQL not running
   - Fix: Start PostgreSQL service

3. **"Prisma Client not found"**
   - Solution: Prisma client not generated
   - Fix: Run `npx prisma generate` (with server stopped)

## Manual Prisma Client Regeneration

If restarting doesn't work:

1. **Stop the server** (Ctrl+C)
2. **Kill all Node processes**:
   ```powershell
   taskkill /F /IM node.exe
   ```
3. **Regenerate Prisma client**:
   ```bash
   cd backend
   npx prisma generate
   ```
4. **Start server**:
   ```bash
   node server.js
   ```

## Verify Database Migration

Check if the migration was applied:

```bash
cd backend
npx prisma migrate status
```

Should show:
```
Database schema is up to date!
```

## Test the Fix

After restarting, test by creating a fee structure:

```
Class: C
Monthly Fee: 1300
Months: Select 10 Ethiopian months
Description: Test fee structure
```

Click "Add Class Fee"

Expected result:
```
✅ Class fee structure added successfully!

Payments will be generated for 10 months.
```

## If Nothing Works

1. **Delete all fee structures**:
   ```bash
   node backend/scripts/delete-invalid-fee-structures.js
   ```

2. **Restart everything**:
   - Stop backend server
   - Stop PostgreSQL
   - Start PostgreSQL
   - Start backend server

3. **Try creating fee structure again**

## Need More Help?

Check these files:
- `FIX_APPLIED_DESCRIPTION_FIELD.md` - Full explanation
- `RESTART_AFTER_SCHEMA_CHANGE.md` - Detailed restart guide
- Backend console - Shows actual error messages

## Summary

**Quick Fix:**
1. Stop server (Ctrl+C)
2. Start server (`node backend/server.js`)
3. Try again

**Or just double-click:** `RESTART_BACKEND.bat`
