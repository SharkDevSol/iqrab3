# 🔧 Fix "Unknown" Student Names - Step by Step

## Current Status

✅ Student records created in database
✅ Backend code updated to fetch names
✅ Frontend code updated to display names
✅ Backend server restarted

## Why You Still See "Unknown"

The issue is likely one of these:

1. **Browser cache** - Old data is cached
2. **Frontend not refreshed** - Need to rebuild/restart
3. **Authentication** - Need to be logged in

## Solution: Follow These Steps

### Step 1: Clear Browser Cache & Refresh

**Option A: Hard Refresh**
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

**Option B: Clear Cache Completely**
1. Press F12 to open DevTools
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Step 2: Check Browser Console for Errors

1. Press F12 to open DevTools
2. Go to "Console" tab
3. Look for any red errors
4. Take a screenshot if you see errors

### Step 3: Check Network Tab

1. Press F12 to open DevTools
2. Go to "Network" tab
3. Navigate to: Finance → Monthly Payments → Select a class
4. Look for the API call to `/api/finance/monthly-payments-view/class/C`
5. Click on it and check the "Response" tab
6. Verify if `studentName` field exists in the response

**Expected Response:**
```json
{
  "students": [
    {
      "studentId": "00000000-0000-0000-0004-000000000001",
      "studentName": "Student 0001",  ← Should be here!
      "totalAmount": 6200,
      ...
    }
  ]
}
```

### Step 4: Restart Frontend (If Needed)

If you're running the frontend in development mode:

```bash
# Stop the frontend (Ctrl+C in the terminal)
# Then restart:
cd APP
npm run dev
```

### Step 5: Verify Database Has Names

Run this to confirm:
```bash
cd backend
node scripts/check-student-names.js
```

Should show:
```
✅ All invoice student IDs have matching Student records!
📋 Sample of students with names:
   00000000-0000-0000-0006-000000000003 → Student 0003
   00000000-0000-0000-0005-000000000002 → Student 0002
   00000000-0000-0000-0004-000000000001 → Student 0001
```

## Troubleshooting

### Issue 1: Still Shows "Unknown" After Refresh

**Check if backend is returning names:**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh the page
4. Find the API call to `/class/C`
5. Check the Response

**If response has `studentName`:** Frontend issue
- Clear browser cache completely
- Restart frontend dev server

**If response doesn't have `studentName`:** Backend issue
- Restart backend server
- Check backend logs for errors

### Issue 2: API Returns 401/403 Error

**Solution:** Make sure you're logged in
1. Log out
2. Log back in
3. Try again

### Issue 3: Backend Not Running

**Check if backend is running:**
```bash
# Windows
netstat -ano | findstr :5000

# Should show a process using port 5000
```

**Restart backend:**
```bash
cd backend
.\kill-port-5000.ps1
node server.js
```

## Quick Test Commands

### 1. Check Database
```bash
cd backend
node scripts/check-student-names.js
```

### 2. Check Backend Server
```bash
# Check if running on port 5000
curl http://localhost:5000/health
# or open in browser: http://localhost:5000
```

### 3. Check API Response (with auth)
Open browser DevTools → Network tab → Check API responses

## Expected Result

After following these steps, you should see:

**Main Student List:**
```
┌────────────┬──────────────┬──────────┐
│ Student ID │ Student Name │ Amount   │
├────────────┼──────────────┼──────────┤
│ ...0001    │ Student 0001 │ 6200.00  │
│ ...0002    │ Student 0002 │ 6200.00  │
│ ...0003    │ Student 0003 │ 6200.00  │
└────────────┴──────────────┴──────────┘
```

**Card Details Modal:**
```
┌────────────┬──────────────┬──────────┐
│ Student ID │ Student Name │ Amount   │
├────────────┼──────────────┼──────────┤
│ ...0002    │ Student 0002 │ 6200.00  │
│ ...0003    │ Student 0003 │ 6200.00  │
└────────────┴──────────────┴──────────┘
```

## Still Not Working?

### Debug Checklist:

1. ✅ Backend server is running (port 5000)
2. ✅ Database has student records (check-student-names.js)
3. ✅ Browser cache cleared (Ctrl+Shift+R)
4. ✅ Logged into the application
5. ✅ No errors in browser console (F12)
6. ✅ API response includes `studentName` field

### Get Help:

If still not working, provide:
1. Screenshot of browser console (F12 → Console tab)
2. Screenshot of Network tab showing API response
3. Output of `node scripts/check-student-names.js`
4. Backend server logs

## Summary

The most common fix is:
1. **Hard refresh browser** (Ctrl+Shift+R)
2. **Check you're logged in**
3. **Verify backend is running**

Try these first before anything else!
