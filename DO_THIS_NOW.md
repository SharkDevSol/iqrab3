# DO THIS NOW - Quick Fix

## The 500 Error Fix (3 Steps)

### Step 1: Stop Backend Server
In the terminal where server is running:
```
Press: Ctrl + C
```

### Step 2: Start Server Again
```bash
cd backend
node server.js
```

### Step 3: Try Creating Fee Structure
1. Refresh browser (F5)
2. Go to Finance → Monthly Payment Settings
3. Click "+ Add Class Fee"
4. Select class, enter 1300, **CHECK ETHIOPIAN MONTHS**
5. Click "Add Class Fee"

**Should work now!** ✅

---

## OR Use Quick Restart

Double-click: **`RESTART_BACKEND.bat`**

Then try creating fee structure again.

---

## What to Expect

After creating fee structure, you should see:
```
✅ Class fee structure added successfully!

Payments will be generated for 10 months.
```

Then click **"Generate All Months"** to create all invoices at once!

---

## If Still Not Working

Check backend console for error message and read:
- `FIX_500_ERROR_QUICK.md`
- `COMPLETE_FIX_SUMMARY.md`
