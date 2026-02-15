# 📍 Where to Find Deductions, Allowances, and Staff Retention

## Step-by-Step Guide

### 1. Open Salary Management Page
- Go to **Home Page**
- Click on **"💰 Salary Management"** link

### 2. You'll See Tab Navigation at the Top

```
┌─────────────────────────────────────────────────────────────┐
│  HR & Staff Salary Management                               │
│  Manage staff salaries, deductions, allowances, and         │
│  retention benefits                                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 💰 Salaries  │ 📉 Deductions│ 📈 Allowances│ 🎯 Staff     │
│   (active)   │              │              │   Retention  │
└──────────────┴──────────────┴──────────────┴──────────────┘
     ↑              ↑              ↑              ↑
   Click         Click          Click          Click
   here          here           here           here
```

### 3. What Each Tab Shows

#### 💰 Salaries Tab (Default)
- Shows all staff salaries
- Displays: Staff Name, Staff Type, Base Salary, Tax Amount, Net Salary, Account, Date
- Button: **"➕ Add Salary"**

#### 📉 Deductions Tab
- Shows all deductions (Tax, Pension, Service, Credit)
- Displays: Staff Name, Deduction Type, Amount, Date Added, Actions
- Button: **"➕ Add Deduction"**
- Each row has a **"🗑️ Delete"** button

#### 📈 Allowances Tab
- Shows all allowances (Housing, Transport, etc.)
- Displays: Staff Name, Allowance Name, Amount, Date Added, Actions
- Button: **"➕ Add Allowance"**
- Each row has a **"🗑️ Delete"** button

#### 🎯 Staff Retention Tab
- Shows all retention benefits (Tuition Waivers, Merit Pay)
- Displays: Staff Name, Retention Type, Amount, Date Added, Actions
- Button: **"➕ Add Retention Benefit"**
- Each row has a **"🗑️ Delete"** button

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [💰 Salaries] [📉 Deductions] [📈 Allowances] [🎯 Staff   │
│                                                  Retention] │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                                    [➕ Add Deduction] │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Staff Name │ Deduction Type │ Amount │ Date │ Actions│  │
│  ├────────────┼────────────────┼────────┼──────┼────────┤  │
│  │ John Doe   │ Tax            │ $500   │ Today│ 🗑️ Del │  │
│  │ Jane Smith │ Pension        │ $300   │ Today│ 🗑️ Del │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## How to Add Items

### Add Deduction:
1. Click **"📉 Deductions"** tab
2. Click **"➕ Add Deduction"** button (top right)
3. Modal opens with form:
   - Select Staff Type
   - Select Staff Name
   - Choose Deduction Type (Tax/Pension/Service/Credit)
   - Enter Amount
   - Click "Add Deduction"

### Add Allowance:
1. Click **"📈 Allowances"** tab
2. Click **"➕ Add Allowance"** button (top right)
3. Modal opens with form:
   - Select Staff Type
   - Select Staff Name
   - Enter Allowance Name (e.g., "Housing", "Transport")
   - Enter Amount
   - Click "Add Allowance"

### Add Staff Retention:
1. Click **"🎯 Staff Retention"** tab
2. Click **"➕ Add Retention Benefit"** button (top right)
3. Modal opens with form:
   - Select Staff Type
   - Select Staff Name
   - Choose Retention Type (Tuition Waiver/Merit Pay)
   - Enter Amount
   - Click "Add Retention Benefit"

## Tab Colors

- **Active Tab**: Purple/Blue color with underline
- **Inactive Tabs**: Gray color
- **Hover**: Light background appears

## Quick Access

```
Home Page → 💰 Salary Management → Click Tab at Top
                                    ↓
                    ┌───────────────┴───────────────┐
                    ↓               ↓               ↓
              📉 Deductions   📈 Allowances   🎯 Staff Retention
```

## If You Don't See the Tabs

Make sure:
1. ✅ Backend server is running (`npm run dev` in backend folder)
2. ✅ Frontend is running (`npm run dev` in APP folder)
3. ✅ You're logged in
4. ✅ You refreshed the page after the update

## Screenshot Description

When you open the page, you should see:
- **Top**: Page title "HR & Staff Salary Management"
- **Below title**: Four tabs in a row (Salaries, Deductions, Allowances, Staff Retention)
- **Below tabs**: Add button on the right side
- **Main area**: Table showing data for the selected tab

The tabs are **always visible** at the top of the page, just below the page title!
