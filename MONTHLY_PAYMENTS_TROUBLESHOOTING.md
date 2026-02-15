# Monthly Payments Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: 403 Forbidden Error ❌

**Error Message:**
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
Access denied: AUTHORIZATION_ERROR
```

**Cause:** Your user role doesn't have the required permissions.

**Solution:**

1. **Restart the backend server** (permissions were just updated):
   ```bash
   cd backend
   npm start
   ```

2. **Clear browser cache and refresh**:
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"
   - Or just press `Ctrl + F5` for hard refresh

3. **Log out and log back in**:
   - This refreshes your permissions
   - Go to Settings → Logout
   - Log back in

**Verification:**
- Navigate to Finance Management → Monthly Payments
- Should load without 403 error

---

### Issue 2: No Classes Showing 📋

**Symptom:** Dashboard loads but shows "No classes showing" or empty.

**Cause:** No invoices have been generated for the selected month.

**Solution:**

1. **Run the setup script first** (one-time):
   ```bash
   cd backend
   node scripts/setup-monthly-payments.js
   ```

2. **Generate invoices for students**:
   ```javascript
   POST /api/finance/invoices/generate
   {
     "studentIds": ["student-1", "student-2"],
     "feeStructureId": "fee-structure-id",
     "academicYearId": "academic-year-id",
     "dueDate": "2026-02-28",
     "campusId": "campus-id"
   }
   ```

3. **Select the correct month/year**:
   - Make sure you're viewing the month where invoices exist
   - Try current month first

---

### Issue 3: Can't Find Monthly Payments in Menu 🔍

**Symptom:** Don't see "Monthly Payments" option in Finance menu.

**Solution:**

1. **Expand Finance Management section**:
   - Click on "Finance Management" to expand
   - Look for 📅 Monthly Payments

2. **Refresh the page**:
   - Press `F5` or `Ctrl + F5`

3. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Clear cache and reload

4. **Check if frontend is running**:
   ```bash
   cd APP
   npm run dev
   ```

5. **Try direct URL**:
   ```
   http://localhost:5173/finance/monthly-payments
   ```

---

### Issue 4: Backend Not Running 🔴

**Symptom:** Can't connect to API, network errors.

**Solution:**

1. **Check if backend is running**:
   - Look for terminal with "Server running on port 5000"

2. **Start the backend**:
   ```bash
   cd backend
   npm start
   ```

3. **If port is busy**:
   ```bash
   npx kill-port 5000
   npm start
   ```

4. **Check for errors**:
   - Look at terminal output for error messages
   - Common issues: Database not connected, missing .env file

---

### Issue 5: Frontend Not Running 🔴

**Symptom:** Can't access http://localhost:5173

**Solution:**

1. **Start the frontend**:
   ```bash
   cd APP
   npm run dev
   ```

2. **Check the port**:
   - Should show: "Local: http://localhost:5173"
   - If different port, use that URL

3. **If port is busy**:
   ```bash
   npx kill-port 5173
   npm run dev
   ```

---

### Issue 6: Payment Recording Fails ❌

**Symptom:** Error when trying to record a payment.

**Possible Causes & Solutions:**

**A. Amount exceeds balance**
- Check the invoice balance
- Enter amount ≤ remaining balance

**B. Invalid invoice ID**
- Make sure invoice exists
- Check invoice hasn't been cancelled

**C. Missing campus ID**
- Update the frontend code to use correct campus ID
- Check your campus configuration

**D. Permission denied**
- Make sure you have `PAYMENTS_CREATE` permission
- Restart backend server
- Log out and log back in

---

### Issue 7: Data Not Updating 🔄

**Symptom:** Made changes but don't see them reflected.

**Solution:**

1. **Refresh the page**:
   - Click the month/year selector again
   - Or press `F5`

2. **Check browser console**:
   - Press `F12`
   - Look for errors in Console tab

3. **Verify API is working**:
   - Open Network tab in DevTools (F12)
   - Refresh page
   - Check if API calls are successful (200 status)

---

### Issue 8: Wrong Fee Amounts 💰

**Symptom:** Showing incorrect monthly fee amounts.

**Solution:**

1. **Check fee structures**:
   ```javascript
   GET /api/finance/fee-structures
   ```

2. **Update fee structure**:
   ```javascript
   PUT /api/finance/fee-structures/:id
   {
     "items": [{
       "amount": 1300  // Correct amount
     }]
   }
   ```

3. **Regenerate invoices** if needed

---

### Issue 9: Database Connection Error 🗄️

**Symptom:** Backend shows database connection errors.

**Solution:**

1. **Check .env file** in backend folder:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   ```

2. **Verify PostgreSQL is running**:
   - Check if database service is started

3. **Test connection**:
   ```bash
   cd backend
   npx prisma db pull
   ```

---

### Issue 10: Module Not Found Error 📦

**Symptom:** Error: Cannot find module 'MonthlyPayments'

**Solution:**

1. **Check file exists**:
   ```
   APP/src/PAGE/Finance/MonthlyPayments.jsx
   ```

2. **Reinstall dependencies**:
   ```bash
   cd APP
   npm install
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Backend server is running (`npm start` in backend folder)
- [ ] Frontend server is running (`npm run dev` in APP folder)
- [ ] Database is connected (check backend terminal)
- [ ] Logged in as director or admin
- [ ] Browser cache cleared (Ctrl + F5)
- [ ] Setup script has been run
- [ ] Invoices have been generated
- [ ] Correct month/year selected

---

## Debug Commands

### Check Backend Status
```bash
cd backend
npm start
# Should show: "Server running on port 5000"
```

### Check Frontend Status
```bash
cd APP
npm run dev
# Should show: "Local: http://localhost:5173"
```

### Check Database Connection
```bash
cd backend
npx prisma studio
# Opens database browser
```

### Check Permissions
In browser console (F12):
```javascript
localStorage.getItem('userType')
// Should return: "director" or similar
```

### Test API Directly
```bash
curl http://localhost:5000/api/finance/monthly-payments/overview?month=2&year=2026
```

---

## Error Messages Explained

### "AUTHORIZATION_ERROR"
- **Meaning**: You don't have permission
- **Fix**: Restart backend, log out/in

### "VALIDATION_ERROR"
- **Meaning**: Invalid data sent to API
- **Fix**: Check form inputs, required fields

### "NOT_FOUND"
- **Meaning**: Invoice or resource doesn't exist
- **Fix**: Check IDs, generate invoices

### "SYSTEM_ERROR"
- **Meaning**: Server error
- **Fix**: Check backend terminal for details

### "Network Error"
- **Meaning**: Can't reach backend
- **Fix**: Start backend server

---

## Getting Help

### 1. Check Browser Console
- Press `F12`
- Go to Console tab
- Look for red error messages
- Copy error text

### 2. Check Backend Terminal
- Look at terminal where backend is running
- Check for error messages
- Copy error stack trace

### 3. Check Network Tab
- Press `F12`
- Go to Network tab
- Refresh page
- Click on failed requests
- Check Response tab

### 4. Documentation
- `MONTHLY_PAYMENT_TRACKING_GUIDE.md` - Complete guide
- `MONTHLY_PAYMENT_QUICK_START.md` - Quick start
- `FIX_PERMISSION_ERROR.md` - Permission issues

---

## Still Having Issues?

### Collect This Information:

1. **Error message** (exact text)
2. **Browser console** output (F12 → Console)
3. **Backend terminal** output
4. **Steps to reproduce** the issue
5. **Your user role** (director, teacher, etc.)
6. **What you were trying to do**

### Then:

1. Check the documentation files
2. Search for similar error in guides
3. Try the solutions listed above
4. Contact system administrator with collected info

---

## Prevention Tips

### Daily
- ✅ Keep backend and frontend running
- ✅ Don't close terminal windows
- ✅ Save work frequently

### Weekly
- ✅ Clear browser cache
- ✅ Restart servers
- ✅ Check for updates

### Monthly
- ✅ Generate invoices on time
- ✅ Backup database
- ✅ Review error logs

---

**Most Common Fix**: Restart backend server and refresh browser! 🔄

```bash
cd backend
npm start
```

Then: `Ctrl + F5` in browser

---

**Last Updated**: February 2026
