# 🧪 Test Budget-Expense Integration - Step by Step

## Prerequisites
✅ Backend server running on port 5000
✅ Logged in to the application
✅ Access to Finance section

## Test Flow

### STEP 1: Create a Test Budget 💰

1. Navigate to: **Finance → Budget Management**
2. Click **"+ Add Budget"**
3. Fill in the form:
   ```
   Budget Name: IT Department Budget 2026
   Department: IT
   Fiscal Year: 2026
   Amount: 50000
   Description: Annual IT infrastructure budget
   ```
4. Click **"Save Budget"**
5. **Verify**: You see a budget card with:
   - Budget Number: BDG-2026-0001
   - Spent: $0.00
   - Remaining: $50,000.00
   - Utilization: 0% (green bar)

---

### STEP 2: Create a Budget-Linked Expense 📝

1. Navigate to: **Finance → Expense Management**
2. Click **"+ Add Expense"**
3. Select **"Budget"** from Category dropdown
4. **Notice**: A new "Select Budget" dropdown appears!
5. Select your budget from the dropdown:
   ```
   IT Department Budget 2026 - IT (2026) - $50,000.00 (Remaining: $50,000.00)
   ```
6. Fill in the rest:
   ```
   Description: New laptops for IT department
   Amount: 5000
   Expense Date: (today's date)
   Requested By: (select a staff member)
   Vendor Name: Dell Technologies
   Payment Method: Bank Transfer
   ```
7. Click **"Create Expense"**
8. **Verify**: Expense appears in table with status PENDING

---

### STEP 3: Approve the Expense ✅

1. Navigate to: **Finance → Expense Approval**
2. Find your expense in the PENDING tab
3. Click **"✅ Approve"** button
4. Confirm the approval
5. **Verify**: Expense disappears from Expense Approval page

---

### STEP 4: Mark Expense as Paid 💵

1. Go back to: **Finance → Expense Management**
2. Click the **"Approved (Unpaid)"** summary card (blue card)
3. Find your expense in the filtered list
4. Click **"💵"** (Mark as Paid) button
5. Confirm: "Are you sure you want to mark this expense as paid?"
6. Click **OK**
7. **Verify**: 
   - Success message appears
   - Expense status changes to PAID
   - Expense moves to PAID tab

---

### STEP 5: Verify Budget Update 🎯

1. Navigate to: **Finance → Budget Management**
2. Find your "IT Department Budget 2026" card
3. **Check the updated values**:
   ```
   Budget: $50,000.00
   Spent: $5,000.00  ← Was $0.00 before!
   Remaining: $45,000.00  ← Was $50,000.00 before!
   Utilization: 10.0%  ← Was 0% before!
   ```
4. **Verify**: Progress bar shows 10% filled (green color)

---

### STEP 6: View Expense Details with Budget Info 👁️

1. Go back to: **Finance → Expense Management**
2. Click PAID tab
3. Find your expense
4. Click **"👁️"** (View Details) button
5. **Verify the details modal shows**:
   - Expense number and amount
   - Status: PAID
   - **New section**: "💰 Linked Budget" with:
     - Budget: IT Department Budget 2026
     - Department: IT
     - Fiscal Year: 2026
     - Budget Number: BDG-2026-0001
     - Budget Status: $5,000.00 / $50,000.00 spent

---

## Test Multiple Expenses

### Create and Pay More Expenses

**Expense 2:**
```
Category: Budget
Budget: IT Department Budget 2026
Description: Software licenses for development team
Amount: 3000
```

**Expense 3:**
```
Category: Budget
Budget: IT Department Budget 2026
Description: Network equipment upgrade
Amount: 2000
```

After approving and paying both:
- Go to Budget Management
- Check IT Department Budget:
  ```
  Spent: $10,000.00 (5000 + 3000 + 2000)
  Remaining: $40,000.00
  Utilization: 20.0%
  ```

---

## Test Budget Utilization Colors

Create and pay more expenses to see color changes:

### Green (< 70%)
```
Total Paid: $30,000 out of $50,000
Utilization: 60%
Color: 🟢 Green
```

### Orange (70-90%)
```
Total Paid: $40,000 out of $50,000
Utilization: 80%
Color: 🟠 Orange
```

### Red (> 90%)
```
Total Paid: $48,000 out of $50,000
Utilization: 96%
Color: 🔴 Red
```

---

## Test Non-Budget Expenses

Create an expense with a different category:

1. Click "+ Add Expense"
2. Select **"Supplies"** (not Budget)
3. **Verify**: No budget dropdown appears
4. Fill in details and create
5. Approve and pay the expense
6. **Verify**: No budget is affected

---

## Expected Results Summary

### ✅ What Should Work

1. **Budget dropdown appears** only when "Budget" category is selected
2. **Budget dropdown shows** all available budgets with details
3. **Expense creation** stores the budget_id
4. **Approval workflow** works normally (no changes)
5. **Mark as Paid** updates both expense and budget
6. **Budget utilization** updates automatically
7. **Progress bar** shows correct percentage and color
8. **Expense details** shows linked budget information
9. **Multiple expenses** can link to same budget
10. **Non-budget expenses** work as before (no budget link)

### ❌ What Should NOT Happen

1. Budget dropdown should NOT appear for non-Budget categories
2. Expense should NOT be created if Budget category but no budget selected
3. Budget should NOT update when expense is only APPROVED (must be PAID)
4. Budget should NOT update for REJECTED expenses
5. Budget should NOT update for non-budget category expenses

---

## Troubleshooting

### Issue: Budget dropdown not appearing
**Solution**: Make sure you selected "Budget" as the category

### Issue: No budgets in dropdown
**Solution**: Create a budget first in Budget Management

### Issue: Budget not updating after payment
**Solution**: 
1. Check browser console for errors
2. Verify expense has budgetId in database
3. Check backend logs for transaction errors
4. Refresh Budget Management page

### Issue: Wrong utilization percentage
**Solution**:
1. Check if multiple expenses are linked to same budget
2. Verify spent_amount in database
3. Calculation: (spent_amount / amount) * 100

---

## Database Verification (Optional)

If you have database access, verify the data:

### Check Expense
```sql
SELECT id, expense_number, category, amount, budget_id, status 
FROM expenses 
WHERE category = 'BUDGET';
```

### Check Budget
```sql
SELECT id, budget_number, name, amount, spent_amount 
FROM budgets 
WHERE id = 1;
```

### Verify Link
```sql
SELECT 
  e.expense_number,
  e.amount as expense_amount,
  e.status,
  b.budget_number,
  b.name as budget_name,
  b.spent_amount
FROM expenses e
JOIN budgets b ON e.budget_id = b.id
WHERE e.category = 'BUDGET';
```

---

## Success Criteria

✅ Budget dropdown appears when Budget category selected
✅ Can select budget from dropdown
✅ Expense created with budget link
✅ Expense can be approved normally
✅ When marked as paid, budget updates automatically
✅ Budget utilization shows correct percentage
✅ Progress bar color changes based on utilization
✅ Expense details shows budget information
✅ Multiple expenses can link to same budget
✅ Non-budget expenses work independently

---

**All tests passing?** Congratulations! The Budget-Expense integration is working perfectly! 🎉
