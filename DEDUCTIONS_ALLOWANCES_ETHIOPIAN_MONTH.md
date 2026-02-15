# ✅ Deductions & Allowances - Ethiopian Month System

## 🎯 What Changed

### 1. Deductions - Only Credit & Pension
- **Removed**: Tax, Service
- **Kept**: Credit, Pension
- These are the only two deduction types now

### 2. Ethiopian Month-Based System
- Deductions and Allowances are now **monthly**
- Uses **Ethiopian calendar** months
- Automatically calculates first and last day of the current Ethiopian month
- Each deduction/allowance is for **ONE MONTH ONLY**

### 3. Automatic Date Calculation
- System automatically detects current Ethiopian month (e.g., "Tir 2017")
- Calculates period: First day to last day of that month
- No manual date entry needed!

## 📅 How It Works

### Example: Adding Deduction in Tir Month

**When you click "Add Deduction":**
```
┌─────────────────────────────────────────────┐
│ Add Deduction - John Doe                    │
├─────────────────────────────────────────────┤
│ 📅 Ethiopian Month: Tir 2017                │
│    Period: 2025-01-01 to 2025-01-31         │
├─────────────────────────────────────────────┤
│ Deduction Type: [Credit ▼]                  │
│ Amount: [500]                                │
│                                              │
│ [Cancel] [Add Deduction]                    │
└─────────────────────────────────────────────┘
```

**Result:**
- Deduction is saved for **Tir 2017 only**
- Will be applied to salary calculation for that month
- Next month (Yekatit), you need to add a new deduction if needed

## 🗄️ Database Changes

### hr_deductions Table
```sql
- id (UUID)
- staff_id (VARCHAR)
- staff_name (VARCHAR)
- deduction_type (VARCHAR) - 'credit' or 'pension'
- amount (DECIMAL)
- ethiopian_month (VARCHAR) - e.g., 'Tir'
- ethiopian_year (INTEGER) - e.g., 2017
- start_date (DATE) - First day of month
- end_date (DATE) - Last day of month
- created_at (TIMESTAMPTZ)
```

### hr_allowances Table
```sql
- id (UUID)
- staff_id (VARCHAR)
- staff_name (VARCHAR)
- allowance_name (VARCHAR) - Custom name
- amount (DECIMAL)
- ethiopian_month (VARCHAR) - e.g., 'Tir'
- ethiopian_year (INTEGER) - e.g., 2017
- start_date (DATE) - First day of month
- end_date (DATE) - Last day of month
- created_at (TIMESTAMPTZ)
```

## 📊 Deductions & Allowances List View

### Deductions Tab
Shows:
- Staff Name
- Deduction Type (Credit/Pension)
- Amount
- **Ethiopian Month** (e.g., "Tir 2017")
- **Period** (e.g., "2025-01-01 to 2025-01-31")
- Delete button

### Allowances Tab
Shows:
- Staff Name
- Allowance Name
- Amount
- **Ethiopian Month** (e.g., "Tir 2017")
- **Period** (e.g., "2025-01-01 to 2025-01-31")
- Delete button

## 💰 Net Salary Calculation (Future)

For a given month, the net salary will be calculated as:

```
Net Salary = Base Salary 
           - Tax (from salary record)
           - Deductions (for this month)
           + Allowances (for this month)
```

**Example for Tir 2017:**
```
Base Salary:     $5,000
Tax:            -$  500
Credit:         -$  200  (Tir deduction)
Pension:        -$  300  (Tir deduction)
Housing Allow:  +$  800  (Tir allowance)
Transport Allow:+$  400  (Tir allowance)
─────────────────────────
Net Salary:      $5,200
```

## 🎨 Visual Features

### Ethiopian Month Info Box
Green box at the top of the modal showing:
- 📅 Current Ethiopian month and year
- Date range (first to last day)

### Color Coding
- **Deductions**: Red badges
- **Allowances**: Green badges
- **Ethiopian Month Info**: Green gradient box

## 🔄 Monthly Workflow

### Month 1 (Tir):
1. Add deductions for Tir
2. Add allowances for Tir
3. Calculate salary for Tir

### Month 2 (Yekatit):
1. Add NEW deductions for Yekatit (if needed)
2. Add NEW allowances for Yekatit (if needed)
3. Calculate salary for Yekatit

**Note**: Deductions/Allowances from Tir don't carry over to Yekatit!

## 📁 Files Created/Modified

### New Files:
1. **APP/src/utils/ethiopianCalendar.js**
   - Ethiopian calendar utilities
   - Month name conversion
   - Date range calculation

### Modified Files:
1. **APP/src/PAGE/HR/components/AddDeductionModal.jsx**
   - Removed Tax and Service types
   - Added Ethiopian month display
   - Sends month info to backend

2. **APP/src/PAGE/HR/components/AddAllowanceModal.jsx**
   - Added Ethiopian month display
   - Sends month info to backend

3. **backend/routes/hr/salaryManagement.js**
   - Updated deductions endpoint to save month info
   - Updated allowances endpoint to save month info
   - Updated database schema

4. **APP/src/PAGE/HR/SalaryManagement.jsx**
   - Updated deductions list to show Ethiopian month
   - Updated allowances list to show Ethiopian month

5. **APP/src/PAGE/HR/SalaryManagement.css**
   - Added `.ethiopian-month-info` styles

## ✨ Benefits

1. **Clear Monthly Tracking**: Know exactly which month each deduction/allowance is for
2. **No Confusion**: Each month is separate, no carryover
3. **Ethiopian Calendar**: Uses familiar Ethiopian month names
4. **Automatic Dates**: No manual date entry needed
5. **Accurate Calculations**: Net salary calculated per month with correct deductions/allowances

## 🚀 Ready to Test!

1. Go to Salary Management
2. Click "Deductions" or "Allowances" button for a staff member
3. See the Ethiopian month info at the top
4. Select deduction type (Credit or Pension only)
5. Enter amount
6. Submit
7. See the entry with Ethiopian month in the list!

## Ethiopian Months Reference

1. Meskerem (መስከረም)
2. Tikimt (ጥቅምት)
3. Hidar (ኅዳር)
4. Tahsas (ታኅሣሥ)
5. Tir (ጥር)
6. Yekatit (የካቲት)
7. Megabit (መጋቢት)
8. Miazia (ሚያዝያ)
9. Ginbot (ግንቦት)
10. Sene (ሰኔ)
11. Hamle (ሐምሌ)
12. Nehase (ነሐሴ)
13. Pagume (ጳጉሜን) - 5-6 days

The system automatically detects which month you're in!
