# Visual Guide: Progressive Monthly Payments

## 🎨 User Interface Changes

### 1. Add Class Fee Form - NEW MONTH SELECTION

```
┌─────────────────────────────────────────────────┐
│  Add Class Fee Structure                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Class Name *                                   │
│  [Select a Class ▼]                            │
│                                                 │
│  Monthly Fee Amount *                           │
│  [1300                ]                         │
│                                                 │
│  Select Months for Payment *                    │
│  ┌──────────────────────────────────────────┐  │
│  │ ☐ January    ☐ February   ☐ March       │  │
│  │ ☐ April      ☐ May        ☐ June        │  │
│  │ ☐ July       ☐ August     ☑ September   │  │
│  │ ☑ October    ☑ November   ☑ December    │  │
│  │ ☑ January    ☑ February   ☑ March       │  │
│  │ ☑ April      ☑ May        ☑ June        │  │
│  └──────────────────────────────────────────┘  │
│  10 month(s) selected                           │
│                                                 │
│  Description                                    │
│  [Monthly tuition fee                      ]    │
│                                                 │
│  [Add Class Fee]  [Cancel]                     │
└─────────────────────────────────────────────────┘
```

### 2. Fee Structure Card - SHOWS SELECTED MONTHS

```
┌─────────────────────────────────────────────────┐
│  Class A                          [Toggle] [🗑️] │
├─────────────────────────────────────────────────┤
│                                                 │
│  $1300/month                                    │
│                                                 │
│  Academic Year: 00000000-0000-0000-0000-...    │
│  Status: ✓ Active                               │
│  Payment Months: 10 months                      │
│  Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr,       │
│  May, Jun                                       │
│                                                 │
│  [📄 Generate Next Month]                       │
└─────────────────────────────────────────────────┘
```

### 3. Generate Invoices Confirmation

```
┌─────────────────────────────────────────────────┐
│  Generate invoices for Class A?                 │
│                                                 │
│  This will create invoices for month 1 of 10   │
│  (September).                                   │
│                                                 │
│  All students in this class will receive an     │
│  invoice.                                       │
│                                                 │
│  [OK]  [Cancel]                                 │
└─────────────────────────────────────────────────┘
```

### 4. Success Message

```
┌─────────────────────────────────────────────────┐
│  ✅ Invoices generated successfully!            │
│                                                 │
│  Month: September (1 of 10)                     │
│  Success: 25 invoices created                   │
│                                                 │
│  📅 Next: Click "Generate Invoices" again to    │
│  create invoices for month 2                    │
│                                                 │
│  [OK]                                           │
└─────────────────────────────────────────────────┘
```

## 📊 System Flow Diagram

```
START
  │
  ├─► Delete Old Data (Optional)
  │   └─► Run: node scripts/delete-all-finance-data.js
  │
  ├─► Create Class Fee
  │   ├─► Select Class: "Class A"
  │   ├─► Enter Fee: $1300
  │   ├─► Select Months: ☑ Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr, May, Jun
  │   └─► Click "Add Class Fee"
  │
  ├─► Generate Month 1 (September)
  │   ├─► Click "Generate Next Month"
  │   ├─► System creates 25 invoices (one per student)
  │   └─► Students see: "Sep 2026 - Monthly tuition fee - Class A"
  │
  ├─► Students Pay September
  │   ├─► Go to Monthly Payments
  │   ├─► Click "Pay This Month"
  │   └─► Record payment: $1300
  │
  ├─► Generate Month 2 (October)
  │   ├─► Click "Generate Next Month"
  │   ├─► System creates 25 invoices
  │   └─► Students see: "Oct 2026 - Monthly tuition fee - Class A"
  │
  ├─► Continue for Months 3-10
  │   └─► Repeat generation process monthly
  │
  └─► END (All 10 months generated)
```

## 🗓️ Timeline Example

### Academic Year: September 2026 - June 2027

```
Month 1: SEPTEMBER 2026
├─► Generate invoices: Sep 1, 2026
├─► Due date: Sep 30, 2026
├─► Students pay: $1300
└─► Status: ✅ Paid

Month 2: OCTOBER 2026
├─► Generate invoices: Oct 1, 2026
├─► Due date: Oct 31, 2026
├─► Students pay: $1300
└─► Status: ✅ Paid

Month 3: NOVEMBER 2026
├─► Generate invoices: Nov 1, 2026
├─► Due date: Nov 30, 2026
├─► Students pay: $1300
└─► Status: ⏳ Pending

Month 4: DECEMBER 2026
├─► Generate invoices: Dec 1, 2026
├─► Due date: Dec 31, 2026
├─► Students pay: $1300
└─► Status: ⏳ Pending

...continue for remaining months...

Month 10: JUNE 2027
├─► Generate invoices: Jun 1, 2027
├─► Due date: Jun 30, 2027
├─► Students pay: $1300
└─► Status: ⏳ Pending

TOTAL: 10 months × $1300 = $13,000 per student
```

## 💳 Payment Scenarios

### Scenario 1: Pay One Month at a Time
```
Student Dashboard:
┌─────────────────────────────────────────────────┐
│  September 2026 Invoice                         │
│  Amount: $1300                                  │
│  Status: ISSUED                                 │
│  [💳 Pay This Month]                            │
└─────────────────────────────────────────────────┘

After Payment:
┌─────────────────────────────────────────────────┐
│  September 2026 Invoice                         │
│  Amount: $1300                                  │
│  Status: ✅ PAID                                │
└─────────────────────────────────────────────────┘
```

### Scenario 2: Pay Multiple Months
```
Student Dashboard:
┌─────────────────────────────────────────────────┐
│  September 2026 Invoice - $1300 - ISSUED       │
│  October 2026 Invoice - $1300 - ISSUED         │
│  November 2026 Invoice - $1300 - ISSUED        │
│                                                 │
│  [📅 Pay Multiple Months]                       │
└─────────────────────────────────────────────────┘

Payment Modal:
┌─────────────────────────────────────────────────┐
│  Select Invoices to Pay                         │
│  ☑ September 2026 - $1300                       │
│  ☑ October 2026 - $1300                         │
│  ☑ November 2026 - $1300                        │
│                                                 │
│  Total: $3900 (3 months)                        │
│  [Pay Now]                                      │
└─────────────────────────────────────────────────┘
```

## 📈 Progress Tracking

### Administrator View
```
Payment Settings → Class Fees

┌─────────────────────────────────────────────────┐
│  Class A                                        │
│  $1300/month                                    │
│  Payment Months: 10 months                      │
│  Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr,       │
│  May, Jun                                       │
│                                                 │
│  Progress: 3 of 10 months generated             │
│  [📄 Generate Next Month]                       │
└─────────────────────────────────────────────────┘
```

### Monthly Payments View
```
Finance → Monthly Payments

┌─────────────────────────────────────────────────┐
│  Class A - September 2026                       │
│  25 students                                    │
│  Paid: 20 students ($26,000)                    │
│  Pending: 5 students ($6,500)                   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Class A - October 2026                         │
│  25 students                                    │
│  Paid: 15 students ($19,500)                    │
│  Pending: 10 students ($13,000)                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Class A - November 2026                        │
│  25 students                                    │
│  Paid: 5 students ($6,500)                      │
│  Pending: 20 students ($26,000)                 │
└─────────────────────────────────────────────────┘
```

## 🎯 Key Visual Elements

### Month Selection Grid
```
✅ Selected Month (Blue border, checked)
☐ Unselected Month (Gray border, unchecked)

Hover Effect: Border turns blue
Click: Toggle selection
```

### Fee Structure Card
```
Header: Class name + Toggle + Delete button
Body: 
  - Monthly fee amount (large)
  - Academic year
  - Status badge
  - Payment months list (small text)
Footer: Generate button
```

### Generate Button States
```
Normal: "📄 Generate Next Month" (Blue)
Loading: "⏳ Generating..." (Gray, disabled)
Complete: "✅ All Months Generated" (Green, disabled)
```

## 🔄 State Transitions

```
Fee Structure States:
┌─────────────┐
│   Created   │ → No invoices generated yet
└──────┬──────┘
       │ Click "Generate Next Month"
       ▼
┌─────────────┐
│  Month 1/10 │ → September invoices created
└──────┬──────┘
       │ Click "Generate Next Month"
       ▼
┌─────────────┐
│  Month 2/10 │ → October invoices created
└──────┬──────┘
       │ Continue...
       ▼
┌─────────────┐
│ Month 10/10 │ → All months generated
└─────────────┘
```

## 📱 Responsive Design

### Desktop View
```
Month Grid: 3 columns × 4 rows
Fee Cards: 3 cards per row
```

### Mobile View
```
Month Grid: 2 columns × 6 rows
Fee Cards: 1 card per row (stacked)
```

## 🎨 Color Scheme

```
Primary Blue: #3498db (Buttons, active states)
Success Green: #48bb78 (Paid status)
Warning Orange: #ed8936 (Pending status)
Danger Red: #f56565 (Overdue status)
Gray: #7f8c8d (Inactive, disabled)
```

This visual guide helps you understand exactly how the progressive monthly payment system looks and works!
