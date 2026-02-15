# 🧪 QUICK TEST: Payroll System

## ⚡ Quick Test Steps

### Prerequisites
1. Backend server running on port 5000
2. Frontend running on port 5173
3. Logged in with valid authentication token

---

## 📋 Test Scenario

### Step 1: Prepare Salary Data
Go to **Salary Management** and ensure you have:
- ✅ At least one staff member with base salary
- ✅ (Optional) Some allowances added
- ✅ (Optional) Some deductions added

**Example Data:**
- Staff: John Doe (Teacher)
- Base Salary: 10,000 Birr
- Allowance: Transport - 1,000 Birr (Yekatit 2018)
- Deduction: Tax - 500 Birr (Yekatit 2018)

---

### Step 2: Navigate to Payroll System
```
Home → HR Management → Payroll System
```

You should see:
- Empty state with "No Payroll Generated Yet"
- "📊 Generate Payroll" button

---

### Step 3: Generate Payroll

1. **Click** "📊 Generate Payroll" button
2. **Modal opens** with:
   - Ethiopian Month dropdown
   - Ethiopian Year input
   - Info note
   - Cancel and Generate buttons

3. **Select:**
   - Month: Yekatit (6)
   - Year: 2018

4. **Click** "📊 Generate"

5. **Wait** for loading (should be quick)

---

### Step 4: Verify Results

#### Summary Cards (Should Display):
1. **Period Card** (Purple)
   - Shows: "Yekatit 2018"

2. **Staff Count Card** (Pink)
   - Shows: Number of staff (e.g., "10")

3. **Total Gross Card** (Blue)
   - Shows: Sum of all gross salaries
   - Format: "150,000.00 Birr"

4. **Total Deductions Card** (Orange)
   - Shows: Sum of all deductions
   - Format: "15,000.00 Birr"

5. **Total Net Salary Card** (Green)
   - Shows: Sum of all net salaries
   - Format: "135,000.00 Birr"

#### Payroll Table (Should Display):
- Header row with column names
- One row per staff member
- Columns:
  - No. (1, 2, 3...)
  - Staff Name
  - Staff Type (badge)
  - Account Number
  - Base Salary
  - Allowances (green, +)
  - Gross Salary (blue)
  - Deductions (red, -)
  - Net Salary (green, bold)
- Footer row with totals

---

### Step 5: Test Excel Export

1. **Click** "📥 Export to Excel" button
2. **Wait** for "Exporting..." message
3. **File downloads** automatically
   - Filename: `Payroll_6_2018.xlsx`
4. **Open file** in Excel/LibreOffice
5. **Verify:**
   - All data present
   - Columns properly formatted
   - Numbers display correctly
   - Currency shows "Birr"

---

## ✅ Expected Results

### Calculation Example:
```
Staff: John Doe
Base Salary:      10,000.00 Birr
+ Allowances:      1,000.00 Birr
= Gross Salary:   11,000.00 Birr
- Deductions:        500.00 Birr
= Net Salary:     10,500.00 Birr
```

### Visual Checks:
- ✅ All cards have gradient backgrounds
- ✅ Numbers are properly formatted (2 decimals)
- ✅ Colors are correct (green/blue/red)
- ✅ Table is responsive and scrollable
- ✅ Footer totals match card totals
- ✅ Export button is visible and clickable

---

## 🐛 Common Issues & Solutions

### Issue 1: "No salary records found"
**Solution:** Add salaries in Salary Management first

### Issue 2: 403 Forbidden Error
**Solution:** 
- Check authentication token
- Re-login if needed
- Verify token is being sent in headers

### Issue 3: 404 Not Found Error
**Solution:**
- Ensure backend server is running
- Check route is registered in `backend/routes/hr/index.js`
- Verify API URL is correct

### Issue 4: Empty Allowances/Deductions
**Solution:**
- This is normal if no allowances/deductions added
- Values will show as 0.00
- Net salary = Base salary in this case

### Issue 5: Account Number shows "N/A"
**Solution:**
- Account number comes from staff schema tables
- If not set, shows "N/A"
- This is expected behavior

---

## 🔍 Console Checks

### Backend Console Should Show:
```
📊 Generating payroll for Ethiopian month Yekatit (6)/2018
✅ Generated payroll for 10 staff members
```

### Frontend Console Should Show:
```
📊 Generating payroll for Ethiopian month 6/2018
```

### No Errors Should Appear:
- ❌ No "relation does not exist" errors
- ❌ No "undefined" errors
- ❌ No authentication errors

---

## 📊 Test Data Verification

### Check Database Tables:
```sql
-- Check salaries
SELECT * FROM hr_complete_salaries WHERE is_active = true;

-- Check allowances for Yekatit 2018
SELECT * FROM hr_allowances 
WHERE ethiopian_month = 'Yekatit' AND ethiopian_year = 2018;

-- Check deductions for Yekatit 2018
SELECT * FROM hr_deductions 
WHERE ethiopian_month = 'Yekatit' AND ethiopian_year = 2018;
```

---

## 🎯 Success Criteria

Test is successful if:
1. ✅ Payroll generates without errors
2. ✅ All 5 summary cards display correct totals
3. ✅ Payroll table shows all staff members
4. ✅ Calculations are mathematically correct
5. ✅ Excel export downloads successfully
6. ✅ Excel file contains all data
7. ✅ No console errors
8. ✅ UI is responsive and looks good

---

## 🚀 Quick Test Command

If you want to test the backend directly:

```bash
# Test payroll generation
curl -X POST http://localhost:5000/api/hr/payroll/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"ethMonth": 6, "ethYear": 2018}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "month": 6,
    "month_name": "Yekatit",
    "year": 2018,
    "staff_count": 10,
    "total_gross": 150000.00,
    "total_deductions": 15000.00,
    "total_net": 135000.00,
    "payroll": [...]
  }
}
```

---

**Test Duration**: ~2 minutes
**Difficulty**: Easy
**Status**: Ready to test
