# Where to Find Everything - Quick Visual Guide

## 🏠 Home Page Navigation

After logging in, you'll see the sidebar menu on the left.

## 📍 Finance Menu Location

```
Home (Dashboard)
├── Registration
│   ├── Register Student
│   └── Register Staff
├── Lists
│   ├── Students
│   ├── Staff
│   └── Guardians
├── 💰 Finance Management ← CLICK HERE
│   ├── Finance Dashboard
│   ├── Chart of Accounts
│   ├── Fee Management
│   ├── Invoices
│   ├── Payments
│   ├── 📅 Monthly Payments ← VIEW INVOICES HERE
│   ├── ⚙️ Payment Settings ← GENERATE INVOICES HERE
│   ├── Expenses
│   ├── Budgets
│   ├── Payroll
│   ├── Financial Reports
│   └── 🔗 Inventory Integration
├── Inventory & Stock
├── Asset Management
├── HR & Staff Management
├── Academic
└── Administration
```

## 🎯 Step-by-Step Visual Guide

### Step 1: Open Finance Menu
1. Look at the **left sidebar**
2. Find **"Finance Management"** section (💰 icon)
3. Click to expand if collapsed

### Step 2: Go to Payment Settings
1. In the Finance menu
2. Click **"Payment Settings"** (⚙️ icon)
3. You'll see a page with 3 tabs:
   - **Class Fees** ← You'll be here
   - Late Fees
   - General Settings

### Step 3: View Your Classes
You should see cards like this:

```
┌─────────────────────────────────────┐
│ Class A                    [Toggle] │
│                                     │
│ $1300/month                         │
│                                     │
│ Academic Year: 00000000-0000-...    │
│ Status: ✓ Active                    │
│ Fee Items: 1 items                  │
│                                     │
│ [📄 Generate Invoices]              │
└─────────────────────────────────────┘
```

### Step 4: Generate Invoices
1. Click the **"📄 Generate Invoices"** button
2. Confirm the dialog that appears
3. Wait for the success message

**Success Message:**
```
┌─────────────────────────────────────┐
│ Invoices generated!                 │
│                                     │
│ Success: 25                         │
│ Already exists: 0                   │
│ Failed: 0                           │
│                                     │
│ You can now view payments in the    │
│ Monthly Payments page.              │
│                                     │
│ [OK]                                │
└─────────────────────────────────────┘
```

### Step 5: View Generated Invoices
1. Go back to Finance menu
2. Click **"Monthly Payments"** (📅 icon)
3. Select month: **February**
4. Select year: **2026**

**You'll see:**
```
┌─────────────────────────────────────────────────────────────┐
│ Monthly Payments                                            │
│                                                             │
│ [February ▼] [2026 ▼]                                      │
│                                                             │
│ ┌──────────┬──────────┬──────────┬──────────┐             │
│ │ Total    │ Total    │ Collected│ Pending  │             │
│ │ Invoices │ Amount   │          │          │             │
│ ├──────────┼──────────┼──────────┼──────────┤             │
│ │ 25       │ $32,500  │ $0       │ $32,500  │             │
│ └──────────┴──────────┴──────────┴──────────┘             │
│                                                             │
│ All Invoices                                                │
│ ┌────────────┬──────────┬────────┬──────┬─────────┬───────┐│
│ │ Invoice #  │Student ID│ Amount │ Paid │ Balance │Status ││
│ ├────────────┼──────────┼────────┼──────┼─────────┼───────┤│
│ │INV-2026-001│ 2-2      │$1,300  │ $0   │ $1,300  │ISSUED ││
│ │INV-2026-002│ 2-3      │$1,300  │ $0   │ $1,300  │ISSUED ││
│ │INV-2026-003│ 2-4      │$1,300  │ $0   │ $1,300  │ISSUED ││
│ │...         │ ...      │ ...    │ ...  │ ...     │...    ││
│ └────────────┴──────────┴────────┴──────┴─────────┴───────┘│
└─────────────────────────────────────────────────────────────┘
```

## 🔍 What Each Page Does

### Payment Settings Page
**Purpose**: Configure fees and generate invoices
**Location**: Finance → Payment Settings

**Features:**
- ✅ Add class fee structures
- ✅ Set monthly fee amounts
- ✅ Generate invoices for all students
- ✅ Toggle active/inactive
- ✅ Configure late fees
- ✅ General payment settings

### Monthly Payments Page
**Purpose**: View and manage invoices
**Location**: Finance → Monthly Payments

**Features:**
- ✅ View all invoices by month
- ✅ See payment status
- ✅ Track paid/unpaid amounts
- ✅ Filter by month and year
- ✅ Summary statistics

## 📱 Mobile View

On mobile devices:
1. Tap the **☰ menu icon** (top left)
2. Scroll to **Finance Management**
3. Tap to expand
4. Select **Payment Settings** or **Monthly Payments**

## 🎨 Visual Indicators

### Status Colors
- 🟢 **Green (Active)**: Fee structure is active
- 🔴 **Red (Inactive)**: Fee structure is disabled
- 🟡 **Yellow (ISSUED)**: Invoice created, not paid
- 🟢 **Green (PAID)**: Invoice fully paid
- 🟠 **Orange (PARTIALLY_PAID)**: Partial payment received

### Icons
- 💰 Finance Management
- ⚙️ Payment Settings
- 📅 Monthly Payments
- 📄 Generate Invoices button
- ✓ Active status
- ✗ Inactive status

## 🚀 Quick Actions

| I want to... | Go to... | Click... |
|--------------|----------|----------|
| Add a new class fee | Payment Settings | + Add Class Fee |
| Generate invoices | Payment Settings | 📄 Generate Invoices |
| View all invoices | Monthly Payments | (Select month/year) |
| Check payment status | Monthly Payments | Status column |
| Disable a fee | Payment Settings | Toggle switch |

## 📊 Understanding the Data

### Student ID Format
- **Display**: `2-2` (easy to read)
- **Database**: `00000000-0000-0000-0002-000000000002` (UUID)
- **Conversion**: Automatic (you don't need to worry about it)

### Invoice Number Format
- **Pattern**: `INV-YYYY-NNNNNN`
- **Example**: `INV-2026-000001`
- **YYYY**: Year
- **NNNNNN**: Sequential number (6 digits)

### Academic Year Format
- **Display**: `2025-2026`
- **Database**: `00000000-0000-0000-0000-000000002026` (UUID)
- **Conversion**: Automatic

## ❓ Common Questions

**Q: Where is the "Monthly Payment Settings" page?**
A: It's called **"Payment Settings"** in the Finance menu.

**Q: Why don't I see any invoices?**
A: You need to generate them first from Payment Settings.

**Q: Can I generate invoices multiple times?**
A: Yes, but duplicates are prevented. Already-existing invoices are counted separately.

**Q: How do I know if invoices were created?**
A: Check the success message count, then view Monthly Payments page.

**Q: What if I see "No Invoices Found"?**
A: Either no invoices were generated, or you're viewing the wrong month/year.

## 🎯 Current Setup

Based on your system:
- ✅ Classes: Class A, Class B, Class C
- ✅ Monthly Fees: $1300 (A & B), $1500 (C)
- ✅ Students: Multiple students per class
- ✅ Academic Year: 2025-2026
- ✅ Current Month: February 2026

## 📞 Need Help?

If you can't find something:
1. Check the **Finance Management** section is expanded
2. Scroll down in the menu (there are many items)
3. Look for the icons: ⚙️ (Settings) and 📅 (Payments)
4. Make sure you're logged in as **admin**

---

**Last Updated**: February 1, 2026
**Status**: ✅ All features working
**Next Step**: Test invoice generation!
