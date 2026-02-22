# Troubleshooting: Payments Tab Not Visible

## Quick Checklist

The payments tab has been added to the guardian profile. If you can't see it, follow these steps:

### 1. Restart the Development Server

The frontend needs to be restarted to pick up the changes:

```bash
# In the APP directory
npm run dev
# or
yarn dev
```

### 2. Restart the Backend Server

The backend also needs to be restarted to load the new route:

```bash
# In the backend directory
npm start
# or
node server.js
```

### 3. Clear Browser Cache

Sometimes the browser caches the old version:
- Press `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
- Or open DevTools (F12) and right-click the refresh button, select "Empty Cache and Hard Reload"

### 4. Check the Browser Console

Open the browser console (F12) and look for any errors:
- Red error messages might indicate missing dependencies
- Check the Network tab to see if API calls are failing

### 5. Verify the Tab is in the Navigation

The payments tab should appear in the bottom navigation bar with these tabs:
1. Profile
2. Marks
3. Posts (centered)
4. **Payments** ← This is the new tab
5. Eval Book
6. Attendance
7. Messages
8. Settings

### 6. Check the Icon

The payments tab uses the `FiDollarSign` icon from `react-icons/fi`. If you see a blank space where the icon should be, you might need to install the package:

```bash
cd APP
npm install react-icons
```

### 7. Navigate to Guardian Profile

Make sure you're on the correct page:
```
http://localhost:5173/app/guardian/[username]
```

Replace `[username]` with an actual guardian username from your database.

### 8. Check Bottom Navigation Component

The tab uses the `BottomNavigation` component from `./mobile`. Verify this component is working by checking if other tabs are visible.

## What Should You See?

When the payments tab is working correctly:

1. **Tab Icon**: A dollar sign icon in the bottom navigation
2. **Tab Label**: "Payments"
3. **When Clicked**: 
   - Shows "Monthly Payments" title
   - If there are unpaid invoices: Red notification banner
   - Payment summary card with statistics
   - List of monthly payment cards for each invoice

## Testing the Backend

Test if the backend route is working:

```bash
# Replace 'testuser' with an actual guardian username
curl http://localhost:5000/api/guardian-payments/testuser
```

You should get a JSON response with payment data.

## Common Issues

### Issue 1: Tab Not Showing
**Solution**: Restart both frontend and backend servers

### Issue 2: Tab Shows But No Data
**Solution**: 
- Check if the guardian has wards in the database
- Check if there are invoices for those wards
- Check browser console for API errors

### Issue 3: Icon Not Showing
**Solution**: 
```bash
cd APP
npm install react-icons
npm run dev
```

### Issue 4: API Error 500
**Solution**: 
- Check if Prisma is properly configured
- Check if the database connection is working
- Check backend console for error messages

## Verification Steps

1. ✅ Check `APP/src/COMPONENTS/GuardianProfile.jsx` has the payments tab in `navItems`
2. ✅ Check `renderPaymentsTab()` function exists
3. ✅ Check `case 'payments':` is in `renderContent()` switch
4. ✅ Check `backend/routes/guardianPayments.js` exists
5. ✅ Check `backend/server.js` has the route registered
6. ✅ Check CSS styles in `GuardianProfile.module.css`

All these are already in place! Just restart your servers.

## Still Not Working?

If you've tried all the above and still can't see the tab:

1. Check if you're logged in as a guardian (not admin or teacher)
2. Verify the guardian has wards assigned
3. Check the browser's responsive mode (mobile view)
4. Try a different browser
5. Check if there are any JavaScript errors in the console

## Need More Help?

Share:
1. Browser console errors (if any)
2. Backend server logs
3. Screenshot of the guardian profile page
4. The URL you're accessing
