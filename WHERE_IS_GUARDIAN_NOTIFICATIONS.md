# Where to Find Guardian Notifications Tab

## Location in Navigation Menu

The Guardian Notifications tab is located in the **Administration** section of the sidebar menu.

### Navigation Path:
```
Sidebar Menu
  └── Administration (section with gear icon)
      ├── Communication
      ├── 📬 Guardian Notifications ← HERE!
      ├── Class Teachers
      ├── Eval Book Assignments
      ├── Settings
      └── Sub Accounts
```

## Visual Location

1. **Open the sidebar** (if collapsed, click the menu icon)
2. **Scroll down** to the "Administration" section
3. Look for the **bell icon (🔔)** with text "Guardian Notifications"
4. It appears **right after "Communication"**

## Icon

The menu item has a **bell icon (🔔)** to distinguish it from other items.

## If You Don't See It

### Check 1: Are you logged in as Admin?
- Only admin users can see this tab
- Sub-accounts need specific permissions
- Check your user type in localStorage: `localStorage.getItem('userType')`

### Check 2: Is the frontend running?
```bash
cd APP
npm run dev
```

### Check 3: Clear browser cache
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)
- Or clear cache in browser settings

### Check 4: Check browser console
- Press `F12` to open developer tools
- Look for any errors in the Console tab
- Check if the route is registered

### Check 5: Try direct URL
Navigate directly to:
```
http://localhost:5173/guardian-notifications
```
(Replace 5173 with your frontend port if different)

## Troubleshooting Steps

### Step 1: Verify the route exists
Open browser console and type:
```javascript
console.log(window.location.pathname);
```

### Step 2: Check if you're logged in
```javascript
console.log(localStorage.getItem('token'));
console.log(localStorage.getItem('userType'));
```

### Step 3: Restart frontend
```bash
# Stop the frontend (Ctrl+C)
cd APP
npm run dev
```

### Step 4: Check the navigation items
In browser console:
```javascript
// This will show all navigation items
console.log('Navigation items loaded');
```

## What the Tab Looks Like

When you click on "Guardian Notifications", you should see:

1. **Header**: "📬 Guardian Notifications"
2. **System Status Card**: Shows if service is running
3. **Scheduled Notifications**: Two gradient cards (purple and pink)
4. **Manual Triggers**: Buttons to send reports now
5. **Test Email**: Input field to test email configuration
6. **Preview**: Dropdown to select guardian and preview emails
7. **Setup Instructions**: Step-by-step guide

## Screenshot Description

```
┌─────────────────────────────────────┐
│ Sidebar                             │
├─────────────────────────────────────┤
│ 🏠 Dashboard                        │
│ 📚 Academic                         │
│ 💰 Finance                          │
│ 👥 HR & Staff                       │
│ 📦 Inventory                        │
│ 🔧 Assets                           │
│ 📋 Tasks                            │
│                                     │
│ ⚙️ Administration                   │
│   💬 Communication                  │
│   🔔 Guardian Notifications ← HERE! │
│   👨‍🏫 Class Teachers                 │
│   📝 Eval Book Assignments          │
│   ⚙️ Settings                       │
│   👥 Sub Accounts                   │
└─────────────────────────────────────┘
```

## Files Modified

1. `APP/src/App.jsx` - Added route
2. `APP/src/PAGE/Home.jsx` - Added menu item
3. `APP/src/PAGE/Communication/GuardianNotifications.jsx` - Component
4. `APP/src/PAGE/Communication/GuardianNotifications.module.css` - Styles

## Quick Test

1. Login to admin panel
2. Look at the sidebar
3. Find "Administration" section
4. Click "Guardian Notifications" (with bell icon)
5. You should see the notification management page

## Still Can't Find It?

Try this in browser console:
```javascript
// Check if route is registered
fetch('http://localhost:5173/guardian-notifications')
  .then(() => console.log('✅ Route exists'))
  .catch(() => console.log('❌ Route not found'));
```

Or manually navigate:
```
http://localhost:5173/guardian-notifications
```

If you see a 404 or blank page, the frontend might need to be restarted.

---

**Expected Result**: You should see a beautiful page with gradient cards, buttons, and forms for managing guardian notifications.

**If still not visible**: Share a screenshot of your sidebar menu and I'll help debug!
