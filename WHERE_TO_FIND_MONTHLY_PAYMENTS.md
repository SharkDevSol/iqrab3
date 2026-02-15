# Where to Find Monthly Payments

## 📍 Location in Your Application

The Monthly Payments feature has been added to your Finance module!

### How to Access:

1. **Login to your application**
2. **Look at the left sidebar menu**
3. **Find "Finance Management" section**
4. **Click to expand it** (if not already expanded)
5. **Click on "Monthly Payments"** (it has a calendar icon 📅)

### Navigation Path:
```
Home → Finance Management → Monthly Payments
```

### Direct URL:
```
http://localhost:5173/finance/monthly-payments
```

## 📋 Menu Structure

Your Finance menu now looks like this:

```
💰 Finance Management
  ├─ 📊 Finance Dashboard
  ├─ 💾 Chart of Accounts
  ├─ 💵 Fee Management
  ├─ 📄 Invoices
  ├─ 💰 Payments
  ├─ 📅 Monthly Payments  ← NEW! Click here
  ├─ 📈 Expenses
  ├─ 📊 Budgets
  ├─ 👥 Payroll
  ├─ 📄 Financial Reports
  └─ 📦 Inventory Integration
```

## 🎯 What You'll See

When you click on "Monthly Payments", you'll see:

1. **Month and Year Selector** at the top
2. **Summary Cards** showing:
   - Total Students
   - Paid Students (green)
   - Unpaid Students (red)
   - Partial Payments (yellow)
   - Total Collected
   - Total Pending

3. **Class Cards** showing each class:
   - Class name
   - Monthly fee amount
   - Number of students
   - Payment statistics
   - Click any class to see details

## 🚀 Quick Test

To test if it's working:

1. Navigate to **Finance Management → Monthly Payments**
2. Select current month and year
3. You should see the dashboard (even if empty)
4. If you see "No classes showing", that means you need to generate invoices first

## 🔧 If You Don't See It

### Check 1: Make sure the server is running
```bash
cd backend
npm start
```

### Check 2: Make sure the frontend is running
```bash
cd APP
npm run dev
```

### Check 3: Refresh your browser
Press `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

### Check 4: Check browser console
Press `F12` and look for any errors

## 📱 Mobile Access

On mobile devices:
1. Tap the **menu icon** (☰) at the top
2. Scroll to **Finance Management**
3. Tap to expand
4. Tap **Monthly Payments**

## 🎨 Visual Guide

```
┌─────────────────────────────────────────┐
│  ☰ Menu                    [Profile] ▼  │
├─────────────────────────────────────────┤
│                                         │
│  🏠 Dashboard                           │
│                                         │
│  👤 Registration                    ▼   │
│                                         │
│  📋 Lists                           ▼   │
│                                         │
│  💰 Finance Management              ▼   │  ← Click here
│    ├─ 📊 Finance Dashboard             │
│    ├─ 💾 Chart of Accounts             │
│    ├─ 💵 Fee Management                │
│    ├─ 📄 Invoices                      │
│    ├─ 💰 Payments                      │
│    ├─ 📅 Monthly Payments  ← HERE!     │  ← Then click here
│    ├─ 📈 Expenses                      │
│    ├─ 📊 Budgets                       │
│    ├─ 👥 Payroll                       │
│    ├─ 📄 Financial Reports             │
│    └─ 📦 Inventory Integration         │
│                                         │
│  📦 Inventory & Stock               ▼   │
│                                         │
│  🏢 Asset Management                ▼   │
│                                         │
│  👥 HR & Staff                      ▼   │
│                                         │
└─────────────────────────────────────────┘
```

## ✅ Confirmation

You'll know you're in the right place when you see:

- **Page Title**: "Monthly Payment Tracking"
- **Month/Year Selectors** at the top
- **Summary cards** with colorful statistics
- **Class cards** below (if invoices exist)

## 🆘 Still Can't Find It?

If you still can't see the Monthly Payments option:

1. **Clear browser cache**: `Ctrl + Shift + Delete`
2. **Restart the development server**:
   ```bash
   # Stop the server (Ctrl + C)
   # Start it again
   npm run dev
   ```
3. **Check if you're logged in** with the correct permissions
4. **Try a different browser** (Chrome, Firefox, Edge)

## 📞 Need Help?

If you're still having trouble:
1. Check the browser console for errors (F12)
2. Check the terminal where your app is running for errors
3. Make sure both backend and frontend are running
4. Verify you're accessing the correct URL

---

**Quick Access URL**: `http://localhost:5173/finance/monthly-payments`

**Menu Path**: Finance Management → Monthly Payments

**Icon**: 📅 Calendar icon

---

That's it! You should now be able to access the Monthly Payments feature! 🎉
