# Fix 404 Error - Backend Routes Not Loaded

## The Problem

You're getting a 404 error because the backend server hasn't loaded the new HR salary routes yet.

```
GET http://localhost:5000/api/hr/salary/staff?status=ACTIVE 404 (Not Found)
```

## The Solution

You need to **restart your backend server** to load the new routes.

## Step-by-Step Fix

### 1. Stop the Backend Server

In your terminal where the backend is running, press:
```
Ctrl + C
```

### 2. Restart the Backend Server

```bash
cd backend
npm start
```

### 3. Wait for Server to Start

You should see:
```
Server running on port 5000
```

### 4. Refresh Your Browser

Press `Ctrl + F5` (or `Cmd + Shift + R` on Mac)

### 5. Test Again

Navigate to: **HR & Staff Management → 💰 Salary Management**

## Why This Happens

When you add new routes to the backend:
1. The code is updated in the files
2. But the running server doesn't know about them
3. You need to restart the server to load the new routes

## What Should Happen After Restart

✅ The 404 error should disappear
✅ You'll see a different error about database tables not existing
✅ This is expected! It means the routes are working

## Next Error You'll See

After restarting, you'll likely see:
```
Error: Table 'Staff' does not exist
```

This is **GOOD NEWS**! It means:
- ✅ Backend routes are working
- ✅ API is accessible
- ⏳ You just need to setup the database

## Complete Setup Steps

### Step 1: Restart Backend (Do This Now!)
```bash
cd backend
# Press Ctrl+C to stop
npm start
```

### Step 2: Update Database Schema

Open `backend/prisma/schema.prisma` and add the content from `backend/prisma/schema-hr-salary.prisma` at the end of the file.

### Step 3: Run Migration
```bash
cd backend
npx prisma migrate dev --name add_hr_salary_management
npx prisma generate
```

### Step 4: Setup Default Data
```bash
node backend/scripts/setup-hr-salary-defaults.js
```

### Step 5: Restart Backend Again
```bash
npm start
```

### Step 6: Test
Navigate to the salary management page and it should work!

## Quick Test

After restarting the backend, open your browser console and check:

**Before Restart:**
```
404 (Not Found) - Route doesn't exist
```

**After Restart (before database setup):**
```
500 (Internal Server Error) - Table doesn't exist
```

**After Database Setup:**
```
200 (OK) - Everything works!
```

## Troubleshooting

### Issue: Still getting 404 after restart
**Solution:**
- Make sure you saved `backend/server.js`
- Check if `backend/routes/hr/index.js` exists
- Check if `backend/routes/hr/salaryManagement.js` exists
- Look at backend console for any startup errors

### Issue: Backend won't start
**Solution:**
- Check for syntax errors in the files
- Make sure all files are saved
- Check backend console for error messages

### Issue: Different port number
**Solution:**
- Check your `.env` file for PORT setting
- Update the API_URL in frontend if needed

## Files That Need to Exist

Make sure these files exist:

```
backend/
├── server.js (updated with HR routes)
├── routes/
│   └── hr/
│       ├── index.js
│       └── salaryManagement.js
```

## Verification

To verify the routes are loaded, check your backend console when it starts. You should see:
```
Server running on port 5000
```

And no errors about missing files or routes.

## Summary

**Right Now:**
1. Stop backend (Ctrl+C)
2. Start backend (npm start)
3. Refresh browser
4. Check if error changes from 404 to 500

**Next:**
1. Setup database schema
2. Run migration
3. Setup default data
4. Everything works!

---

**Do this first: Restart your backend server!** 🔄

Then follow the complete setup in `START_HERE_HR_SALARY.md`
