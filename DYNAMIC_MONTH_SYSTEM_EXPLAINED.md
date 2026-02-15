# Dynamic Month System - How It Works

## Overview
The financial reports system is fully dynamic and automatically adjusts based on the current Ethiopian calendar month. As each new month unlocks, the system automatically includes those invoices in the balance calculations.

## How It Works

### 1. Current Month Detection

**Ethiopian Calendar Integration**:
- System uses `getCurrentEthiopianMonth()` utility function
- Automatically detects current Ethiopian month (1-13)
- Updates every minute to stay in sync
- No manual configuration needed

**Example**:
```javascript
// If today is in Tir (5th month)
currentEthiopianMonth = 5

// System will include months 1-5 in calculations:
// Meskerem, Tikimt, Hidar, Tahsas, Tir
```

### 2. Unlocked Months Calculation

**Backend Logic** (`financeMonthlyPaymentViewRoutes.js`):
```javascript
// Filter invoices to only include unlocked months
const unlockedInvoices = payingStudentInvoices.filter(inv => {
  const monthNumber = inv.metadata?.monthNumber || 0;
  return monthNumber <= currentEthiopianMonth; // Only months up to current
});

// Calculate totals from unlocked invoices only
const unlockedTotalAmount = unlockedInvoices.reduce((sum, inv) => 
  sum + parseFloat(inv.totalAmount), 0
);
```

**What This Means**:
- Month 1 (Meskerem): Always unlocked
- Month 2 (Tikimt): Unlocked when Ethiopian calendar reaches month 2
- Month 3 (Hidar): Unlocked when Ethiopian calendar reaches month 3
- ... and so on
- Month 13 (Pagume): Unlocked when Ethiopian calendar reaches month 13

### 3. Automatic Updates

**When New Month Starts**:
1. Ethiopian calendar advances to new month
2. System detects month change (checks every minute)
3. Overview data automatically refreshes
4. New month's invoices added to calculations
5. Financial reports update automatically

**Frontend Auto-Refresh**:
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    const currentMonth = getCurrentEthiopianMonth();
    const newMonth = currentMonth.month;
    
    // If month changed, refresh overview
    if (newMonth !== currentEthiopianMonth) {
      console.log(`Month changed from ${currentEthiopianMonth} to ${newMonth}`);
      setCurrentEthiopianMonth(newMonth);
      fetchOverview(); // Refresh data
    }
  }, 60000); // Check every minute
}, [currentEthiopianMonth]);
```

### 4. Financial Reports Display

**Current Month Indicator**:
- Purple banner at top of reports modal
- Shows current Ethiopian month name
- Lists all unlocked months included in calculations
- Example: "Showing unlocked months 1-5 (Meskerem, Tikimt, Hidar, Tahsas, Tir)"

**Card Labels**:
- "Total Expected (Unlocked)" - Shows it's only unlocked months
- Subtitle: "Birr (Months 1-5, Paying Students Only)"
- Clear indication of what's included

### 5. Example Scenarios

#### Scenario 1: Beginning of Year (Month 1)
```
Current Month: Meskerem (1)
Unlocked Months: 1
Invoices Included: Only Meskerem invoices
Total Expected: 1 month × students × monthly fee
```

#### Scenario 2: Mid-Year (Month 5)
```
Current Month: Tir (5)
Unlocked Months: 1, 2, 3, 4, 5
Invoices Included: Meskerem through Tir
Total Expected: 5 months × students × monthly fee
```

#### Scenario 3: End of Year (Month 12)
```
Current Month: Nehase (12)
Unlocked Months: 1-12
Invoices Included: All regular months
Total Expected: 12 months × students × monthly fee
```

#### Scenario 4: New Month Just Started
```
Yesterday: Tahsas (4) - 4 months unlocked
Today: Tir (5) - 5 months unlocked
System automatically:
1. Detects month change
2. Refreshes overview
3. Adds Tir invoices to calculations
4. Updates all totals
```

## Data Flow

### Step 1: Page Load
```
1. Get current Ethiopian month from calendar
2. Send to backend: GET /overview?currentMonth=5
3. Backend filters invoices: monthNumber <= 5
4. Backend calculates totals from filtered invoices
5. Frontend displays totals
```

### Step 2: Month Changes
```
1. System detects new month (auto-check every minute)
2. Triggers overview refresh
3. Backend recalculates with new month filter
4. Frontend updates display
5. New month's invoices now included
```

### Step 3: User Views Reports
```
1. User clicks "View Financial Reports"
2. Modal shows current month indicator
3. Displays totals for unlocked months only
4. Shows class breakdown with same filtering
5. All calculations consistent
```

## Calculations Explained

### Total Expected (Unlocked)
```
For each class:
  1. Get all active students
  2. Exclude exempt students
  3. Get their invoices
  4. Filter: monthNumber <= currentMonth
  5. Sum: invoice.totalAmount

Total = Sum of all classes
```

### Total Paid
```
For each unlocked invoice:
  Sum: invoice.paidAmount

Total Paid = Sum across all unlocked invoices
```

### Total Pending
```
Total Pending = Total Expected - Total Paid
```

### Collection Rate
```
Collection Rate = (Total Paid / Total Expected) × 100
```

## Key Features

### 1. Automatic Month Detection
- No manual month selection needed
- System knows current month automatically
- Updates in real-time

### 2. Dynamic Calculations
- Totals adjust as months unlock
- No need to reconfigure
- Always accurate

### 3. Clear Communication
- Reports show which months are included
- Current month clearly displayed
- No confusion about what's counted

### 4. Consistent Filtering
- Same logic across all views
- Overview, class details, student details
- All use current month filter

## Example: Month Transition

### Before (Tahsas - Month 4)
```
Current Month: 4
Unlocked Months: Meskerem, Tikimt, Hidar, Tahsas
Total Expected: 7 students × 10,100 Birr × 4 months = 282,800 Birr
Total Paid: 50,000 Birr
Total Pending: 232,800 Birr
Collection Rate: 17.7%
```

### After (Tir - Month 5)
```
Current Month: 5
Unlocked Months: Meskerem, Tikimt, Hidar, Tahsas, Tir
Total Expected: 7 students × 10,100 Birr × 5 months = 353,500 Birr
Total Paid: 50,000 Birr (same, no new payments yet)
Total Pending: 303,500 Birr (increased by 1 month)
Collection Rate: 14.1% (decreased, more expected now)
```

**What Happened**:
- New month (Tir) unlocked automatically
- System added Tir invoices to calculations
- Total Expected increased by 70,700 Birr (1 month for 7 students)
- Total Pending increased accordingly
- Collection Rate adjusted (same paid amount, higher expected)

## Benefits

### For School Administration
- Always see current financial status
- No manual updates needed
- Accurate month-by-month tracking
- Clear visibility of unlocked vs locked months

### For Financial Planning
- Know exactly what's expected up to current month
- Track collection rates accurately
- Plan for upcoming months
- Identify payment delays early

### For Reporting
- Reports always current
- No confusion about time periods
- Clear documentation of included months
- Consistent across all views

## Technical Details

### Backend Filtering
```javascript
// In overview endpoint
const currentEthiopianMonth = parseInt(req.query.currentMonth) || 5;

// Filter invoices
const unlockedInvoices = payingStudentInvoices.filter(inv => {
  const monthNumber = inv.metadata?.monthNumber || 0;
  return monthNumber <= currentEthiopianMonth;
});
```

### Frontend Display
```javascript
// Show current month
<h3>Current Ethiopian Month: {ethiopianMonths[currentEthiopianMonth - 1]}</h3>

// Show included months
<p>Showing unlocked months 1-{currentEthiopianMonth}</p>

// Display totals
<p>{overview.summary.unlockedTotalAmount.toFixed(2)} Birr</p>
<p>(Months 1-{currentEthiopianMonth}, Paying Students Only)</p>
```

## Troubleshooting

### If Totals Seem Wrong
1. Check current Ethiopian month in reports modal
2. Verify it matches actual calendar
3. Check console logs for calculation details
4. Ensure invoices have correct monthNumber metadata

### If Month Not Updating
1. System checks every minute
2. Wait up to 60 seconds for auto-update
3. Or refresh page manually
4. Check browser console for errors

### If New Month Not Included
1. Verify invoices exist for new month
2. Check invoice metadata has monthNumber
3. Ensure students are active (not deactivated)
4. Ensure students are not exempt (if they should pay)

## Status
✅ **ACTIVE** - System is fully dynamic and automatically adjusts to current Ethiopian month
