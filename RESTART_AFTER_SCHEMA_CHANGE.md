# How to Restart After Schema Change

## The Issue

After adding the `description` field to the database, the Prisma client needs to be regenerated. However, if the server is running, you'll get a file lock error.

## Solution: Restart the Server

### Step 1: Stop the Backend Server

If the server is running, stop it:
- Press **Ctrl+C** in the terminal where the server is running

### Step 2: Start the Server Again

```bash
cd backend
node server.js
```

**That's it!** The server will automatically use the updated schema.

## Alternative: If Server Won't Stop

If you can't stop the server normally:

### Windows:
```powershell
# Kill all Node processes
taskkill /F /IM node.exe

# Or use the kill script
.\backend\kill-all-node.ps1
```

Then start the server again:
```bash
cd backend
node server.js
```

## Verify It's Working

After restarting, try creating a fee structure again:

1. Go to **Finance → Monthly Payment Settings**
2. Click **"+ Add Class Fee"**
3. Fill in the form with Ethiopian months selected
4. Click **"Add Class Fee"**

Should work now! ✅

## If Still Getting 500 Error

Check the backend console for the actual error message. It will show you what's wrong.

Common issues:
- Server not restarted
- Prisma client not regenerated
- Database connection issue

## Quick Fix Script

Create a file `restart-backend.bat`:

```batch
@echo off
echo Stopping Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting backend server...
cd backend
node server.js
```

Then just double-click it to restart!
