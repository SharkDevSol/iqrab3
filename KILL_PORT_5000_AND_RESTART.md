# 🔴 Port 5000 Already in Use - Quick Fix

## The Problem

```
Error: listen EADDRINUSE: address already in use :::5000
```

You have another instance of the backend server already running on port 5000.

## Quick Fix (Choose One Method)

### Method 1: Use the Kill Script (Easiest)

You already have a script for this!

```powershell
cd backend
.\kill-port-5000.ps1
```

Then start the server:
```powershell
npm start
```

### Method 2: Manual Kill (If script doesn't work)

```powershell
# Find the process using port 5000
netstat -ano | findstr :5000

# You'll see something like:
# TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    12345

# Kill the process (replace 12345 with the actual PID)
taskkill /PID 12345 /F

# Then start the server
npm start
```

### Method 3: Kill All Node Processes (Nuclear Option)

```powershell
cd backend
.\kill-all-node.ps1
```

Then start the server:
```powershell
npm start
```

## Step-by-Step

### 1. Stop Current Terminal

In the terminal where you just ran `npm run dev`, press:
```
Ctrl + C
```

### 2. Kill the Old Process

Run the kill script:
```powershell
.\kill-port-5000.ps1
```

### 3. Start Fresh

```powershell
npm start
```

### 4. Verify It's Running

You should see:
```
Server running on port 5000
Dashboard endpoints available at:
  http://localhost:5000/api/dashboard/stats
```

## Why This Happens

When you:
1. Start the server with `npm start`
2. Close the terminal without stopping the server (Ctrl+C)
3. Try to start it again

The old process is still running in the background, holding port 5000.

## Prevention

Always stop the server properly:
1. Press `Ctrl + C` in the terminal
2. Wait for it to stop completely
3. Then close the terminal or start again

## Verification

After killing and restarting, check if it's working:

```powershell
# In a new terminal or PowerShell
curl http://localhost:5000/api/health
```

You should get a response (not an error).

## If Scripts Don't Work

### Find and Kill Manually:

```powershell
# Step 1: Find the process
netstat -ano | findstr :5000

# Step 2: Note the PID (last number)
# Example output: TCP  0.0.0.0:5000  0.0.0.0:0  LISTENING  12345
#                                                           ^^^^^ This is the PID

# Step 3: Kill it
taskkill /PID 12345 /F

# Step 4: Verify it's gone
netstat -ano | findstr :5000
# Should return nothing

# Step 5: Start server
npm start
```

## Common Scenarios

### Scenario 1: Multiple Terminals
You opened multiple terminals and started the server in each.

**Fix:** Close all terminals, use the kill script, start fresh.

### Scenario 2: Background Process
Server is running in the background from a previous session.

**Fix:** Use `kill-all-node.ps1` to kill all Node processes.

### Scenario 3: Different Port
You want to use a different port temporarily.

**Fix:** Edit `.env` file:
```
PORT=5001
```

Then start the server. Don't forget to update frontend API_URL!

## Quick Commands Reference

```powershell
# Kill port 5000
.\kill-port-5000.ps1

# Kill all Node processes
.\kill-all-node.ps1

# Start server
npm start

# Start with nodemon (auto-restart on changes)
npm run dev

# Check if port is in use
netstat -ano | findstr :5000

# Check server health
curl http://localhost:5000/api/health
```

## After Fixing

Once the server starts successfully:

1. ✅ You should see "Server running on port 5000"
2. ✅ No error messages
3. ✅ Refresh your browser
4. ✅ Test the salary management page

## Summary

**Right Now:**
1. Press `Ctrl + C` in the terminal
2. Run `.\kill-port-5000.ps1`
3. Run `npm start`
4. Wait for "Server running on port 5000"
5. Refresh browser

**Then:**
- Test the salary management page
- You should see a 500 error about database tables (good progress!)
- Follow database setup instructions

---

**Do this now: Kill the old process and restart!** 🔄
