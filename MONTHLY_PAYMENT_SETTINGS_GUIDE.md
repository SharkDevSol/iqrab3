# Monthly Payment Settings Guide

## Overview

The **Monthly Payment Settings** page allows you to configure all aspects of your monthly payment system including:

- Class monthly fees
- Late fee rules
- Payment methods
- Invoice settings
- Notifications

## How to Access

### Navigation Path:
```
Finance Management → Payment Settings
```

### Direct URL:
```
http://localhost:5173/finance/monthly-payment-settings
```

## Features

### 1. Class Fees Tab

Configure monthly fees for each class.

#### View Class Fees
- See all configured class fees
- View monthly amount for each class
- Check active/inactive status
- See number of invoices generated

#### Add New Class Fee

1. Click **"+ Add Class Fee"** button
2. Fill in the form:
   - **Class Name**: e.g., "Class A", "Grade 1", etc.
   - **Monthly Fee Amount**: e.g., 1300
   - **Description**: Optional description
3. Click **"Add Class Fee"**

#### Toggle Active/Inactive

Use the toggle switch on each class card to:
- **Activate** a class fee (green)
- **Deactivate** a class fee (gray)

When inactive, the fee structure won't be used for new invoices.

---

### 2. Late Fees Tab

Configure automatic late fee rules.

#### View Late Fee Rules
- See all configured late fee rules
- Check grace periods
- View penalty types and values
- Monitor active/inactive status

#### Add New Late Fee Rule

1. Click **"+ Add Late Fee Rule"** button
2. Fill in the form:
   - **Rule Name**: e.g., "Standard Late Fee"
   - **Grace Period**: Number of days before late fee applies (e.g., 5)
   - **Penalty Type**: 
     - Fixed Amount (e.g., $50)
     - Percentage (e.g., 5%)
   - **Penalty Value**: The amount or percentage
3. Click **"Add Late Fee Rule"**

#### Example Late Fee Rules

**Rule 1: Standard Late Fee**
- Grace Period: 5 days
- Type: Fixed Amount
- Value: $50
- Result: After 5 days past due date, add $50 late fee

**Rule 2: Percentage Late Fee**
- Grace Period: 7 days
- Type: Percentage
- Value: 5%
- Result: After 7 days, add 5% of invoice amount as late fee

---

### 3. General Settings Tab

Configure system-wide payment settings.

#### Payment Methods

Enable/disable payment methods:
- ☑ Cash
- ☑ Bank Transfer
- ☑ Mobile Money
- ☑ Online Payment

#### Invoice Settings

- **Default Due Date**: Days from issue date (e.g., 30 days)
- **Invoice Prefix**: Prefix for invoice numbers (e.g., "INV-")

#### Notifications

Configure automatic notifications:
- ☑ Send payment reminders
- ☑ Send payment confirmations
- ☐ Send overdue notifications

---

## Step-by-Step Guides

### How to Set Up Monthly Fees for All Classes

**Step 1: Go to Settings**
```
Finance Management → Payment Settings
```

**Step 2: Click "Class Fees" Tab**

**Step 3: Add Each Class**

For Class A ($1300/month):
1. Click "+ Add Class Fee"
2. Class Name: "Class A"
3. Monthly Fee: 1300
4. Description: "Monthly tuition for Class A"
5. Click "Add Class Fee"

For Class B ($1300/month):
1. Click "+ Add Class Fee"
2. Class Name: "Class B"
3. Monthly Fee: 1300
4. Description: "Monthly tuition for Class B"
5. Click "Add Class Fee"

For Class C ($1500/month):
1. Click "+ Add Class Fee"
2. Class Name: "Class C"
3. Monthly Fee: 1500
4. Description: "Monthly tuition for Class C"
5. Click "Add Class Fee"

**Step 4: Verify**
- You should see 3 class cards
- Each showing the correct monthly fee
- All should be active (green toggle)

---

### How to Set Up Late Fees

**Step 1: Go to Late Fees Tab**

**Step 2: Add Late Fee Rule**

Example: $50 late fee after 5 days
1. Click "+ Add Late Fee Rule"
2. Rule Name: "Standard Late Fee"
3. Grace Period: 5
4. Penalty Type: "Fixed Amount"
5. Penalty Value: 50
6. Click "Add Late Fee Rule"

**Step 3: Activate the Rule**
- Make sure the toggle is ON (green)

---

### How to Change a Class Fee Amount

**Option 1: Deactivate Old, Add New**
1. Toggle OFF the old fee structure
2. Add a new fee structure with the new amount
3. Generate new invoices using the new structure

**Option 2: Update Existing** (if no invoices generated yet)
1. Contact system administrator
2. Update via API or database

---

## Visual Guide

### Class Fees Tab

```
┌─────────────────────────────────────────────────────┐
│ Class Monthly Fees              [+ Add Class Fee]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │ Class A      [ON]│  │ Class B      [ON]│       │
│  │ $1300/month      │  │ $1300/month      │       │
│  │ Academic Year:   │  │ Academic Year:   │       │
│  │ 2026-2027        │  │ 2026-2027        │       │
│  │ Status: ✓ Active │  │ Status: ✓ Active │       │
│  │ Students: 50     │  │ Students: 50     │       │
│  └──────────────────┘  └──────────────────┘       │
│                                                     │
│  ┌──────────────────┐                              │
│  │ Class C      [ON]│                              │
│  │ $1500/month      │                              │
│  │ Academic Year:   │                              │
│  │ 2026-2027        │                              │
│  │ Status: ✓ Active │                              │
│  │ Students: 50     │                              │
│  └──────────────────┘                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Late Fees Tab

```
┌─────────────────────────────────────────────────────┐
│ Late Fee Rules              [+ Add Late Fee Rule]   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Rule Name         Grace  Type      Value   Status  │
│ ───────────────── ─────  ────────  ──────  ──────  │
│ Standard Late Fee 5 days Fixed     $50     Active  │
│ Percentage Fee    7 days Percent   5%      Active  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Best Practices

### 1. Set Up Before Generating Invoices
- Configure all class fees first
- Set up late fee rules
- Then generate monthly invoices

### 2. Use Descriptive Names
- Class names should be clear (e.g., "Grade 1 Section A")
- Late fee rule names should explain the rule

### 3. Test with One Class First
- Add one class fee
- Generate test invoices
- Verify everything works
- Then add remaining classes

### 4. Review Late Fee Rules
- Make sure grace periods are reasonable
- Test late fee calculations
- Adjust as needed

### 5. Keep Old Structures
- Don't delete old fee structures
- Instead, deactivate them
- Maintains historical data

---

## Common Tasks

### Task 1: Add a New Class
```
1. Go to Payment Settings
2. Click "Class Fees" tab
3. Click "+ Add Class Fee"
4. Enter class name and monthly fee
5. Click "Add Class Fee"
```

### Task 2: Change Monthly Fee Amount
```
1. Deactivate old fee structure (toggle OFF)
2. Add new fee structure with new amount
3. Use new structure for future invoices
```

### Task 3: Set Up Late Fees
```
1. Go to "Late Fees" tab
2. Click "+ Add Late Fee Rule"
3. Set grace period and penalty
4. Activate the rule
```

### Task 4: Disable Late Fees Temporarily
```
1. Go to "Late Fees" tab
2. Toggle OFF the late fee rule
3. Late fees won't be applied
4. Toggle ON to re-enable
```

---

## Troubleshooting

### Can't Add Class Fee
- Check all required fields are filled
- Make sure monthly fee is a positive number
- Verify you have permission

### Late Fee Not Applying
- Check if late fee rule is active (toggle ON)
- Verify grace period has passed
- Check if rule applies to the fee category

### Can't See Settings Page
- Check menu: Finance Management → Payment Settings
- Verify you have admin/director role
- Try direct URL: `/finance/monthly-payment-settings`

---

## API Integration

The settings page uses these API endpoints:

### Fee Structures
```
GET    /api/finance/fee-structures
POST   /api/finance/fee-structures
PUT    /api/finance/fee-structures/:id
```

### Late Fee Rules
```
GET    /api/finance/late-fee-rules
POST   /api/finance/late-fee-rules
PUT    /api/finance/late-fee-rules/:id
```

---

## Summary

✅ **Class Fees Tab**: Configure monthly fees for each class
✅ **Late Fees Tab**: Set up automatic late fee rules
✅ **General Settings**: Configure payment methods and notifications
✅ **Easy Toggle**: Activate/deactivate fees with one click
✅ **Visual Cards**: See all settings at a glance

---

**Quick Access**: Finance Management → Payment Settings

**Start by setting up your class fees, then configure late fees!** 🎉
