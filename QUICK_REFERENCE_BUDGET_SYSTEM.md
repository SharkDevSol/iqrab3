# 📋 Quick Reference - Budget System

## How to Use the Budget System

### 1. Create a Budget
```
Navigate: Finance → Budget Management
Click: + Add Budget
Fill:
  - Budget Name: "IT Department Budget 2026"
  - Department: "IT"
  - Fiscal Year: "2026"
  - Amount: 50000
  - Description: (optional)
Click: Save Budget
```

### 2. Create Budget-Linked Expense
```
Navigate: Finance → Expense Management
Click: + Add Expense
Select: Category = "Budget"
Select: Budget from dropdown
Fill:
  - Description: "New laptops"
  - Amount: 5000
  - Expense Date: (today)
  - Requested By: (select staff)
  - Payment Method: (select method)
Click: Create Expense
```

### 3. Approve Expense
```
Navigate: Finance → Expense Approval
Find: Your expense in PENDING tab
Click: ✅ Approve
Confirm: Yes
```

### 4. Mark as Paid
```
Navigate: Finance → Expense Management
Click: "Approved (Unpaid)" card (blue)
Find: Your expense
Click: 💵 (Mark as Paid)
Confirm: Yes
```

### 5. View Updated Budget
```
Navigate: Finance → Budget Management
Find: Your budget card
See: Updated spent amount and utilization
Check: Summary cards at top
```

---

## Summary Cards Explained

### 📊 Total Budgets (Purple)
- **Shows**: Count of all budgets
- **Amount**: Total allocated across all budgets
- **Use**: Overview of budget portfolio

### 💸 Total Spent (Pink)
- **Shows**: Total spent across all budgets
- **Percentage**: Average utilization
- **Use**: Track overall spending

### 💰 Total Remaining (Blue)
- **Shows**: Total remaining budget
- **Percentage**: Available budget
- **Use**: See available funds

### 🟢 Healthy Budgets (Green)
- **Shows**: Count of budgets < 70% utilized
- **Status**: Good standing
- **Use**: Track healthy budgets

### 🟠 Warning Budgets (Orange)
- **Shows**: Count of budgets 70-90% utilized
- **Status**: Monitor closely
- **Use**: Identify budgets needing attention

### 🔴 Critical Budgets (Red)
- **Shows**: Count of budgets > 90% utilized
- **Status**: Immediate attention
- **Use**: Alert for near-exhausted budgets

---

## Budget Health Colors

### 🟢 Green (< 70%)
- **Status**: Healthy
- **Action**: Continue normal operations
- **Example**: $30,000 spent of $50,000 (60%)

### 🟠 Orange (70-90%)
- **Status**: Warning
- **Action**: Monitor closely, plan carefully
- **Example**: $40,000 spent of $50,000 (80%)

### 🔴 Red (> 90%)
- **Status**: Critical
- **Action**: Immediate attention, stop spending
- **Example**: $48,000 spent of $50,000 (96%)

---

## Common Tasks

### Check Budget Status
```
1. Go to Budget Management
2. Look at summary cards
3. Check individual budget cards
4. Review utilization progress bars
```

### Find Budget-Linked Expenses
```
1. Go to Expense Management
2. Click on an expense
3. View Details
4. Look for "💰 Linked Budget" section
```

### Monitor Budget Health
```
1. Check summary cards regularly
2. Watch for warning/critical counts
3. Review individual budget utilization
4. Take action on critical budgets
```

### Create Monthly Budget Report
```
1. Screenshot summary cards
2. Note key metrics:
   - Total allocated
   - Total spent
   - Average utilization
   - Health distribution
3. Review budget cards for details
4. Identify trends and issues
```

---

## Formulas

### Utilization Percentage
```
(Spent Amount / Total Budget) × 100
Example: ($30,000 / $50,000) × 100 = 60%
```

### Remaining Budget
```
Total Budget - Spent Amount
Example: $50,000 - $30,000 = $20,000
```

### Average Utilization
```
(Total Spent / Total Allocated) × 100
Example: ($73,000 / $100,000) × 100 = 73%
```

---

## API Endpoints

### Budgets
```
GET    /api/finance/budgets              List all budgets
POST   /api/finance/budgets              Create budget
PUT    /api/finance/budgets/:id          Update budget
DELETE /api/finance/budgets/:id          Delete budget
GET    /api/finance/budgets/summary/stats Get statistics
```

### Expenses (Budget-Related)
```
POST   /api/finance/expenses             Create expense (with budgetId)
PUT    /api/finance/expenses/:id/mark-paid  Mark paid (updates budget)
```

---

## Troubleshooting

### Budget not updating after expense payment
- Refresh Budget Management page
- Check expense status is PAID
- Verify expense has budget_id
- Check browser console for errors

### Budget dropdown not showing
- Make sure "Budget" category is selected
- Check if budgets exist
- Refresh the page

### Wrong utilization calculation
- Verify spent_amount in database
- Check if multiple expenses linked
- Refresh the page

### Summary cards not appearing
- Create at least one budget
- Refresh the page
- Check browser console

---

## Best Practices

### Budget Creation
- Use clear, descriptive names
- Include department and year
- Set realistic amounts
- Add descriptions for context

### Expense Management
- Link expenses to budgets when applicable
- Use descriptive expense descriptions
- Approve expenses promptly
- Mark as paid only when actually paid

### Budget Monitoring
- Check summary cards daily
- Review warning budgets weekly
- Address critical budgets immediately
- Plan for next fiscal year early

### Financial Planning
- Keep budgets under 70% utilization
- Plan for unexpected expenses
- Review and adjust quarterly
- Document budget decisions

---

## Quick Stats

### Budget Number Format
```
BDG-YYYY-XXXX
Example: BDG-2026-0001
```

### Expense Number Format
```
EXP-YYYY-XXXXXX
Example: EXP-2026-000001
```

### Status Flow
```
Budget: DRAFT → APPROVED
Expense: PENDING → APPROVED → PAID
```

---

## Contact & Support

For issues or questions:
1. Check documentation files
2. Review test guides
3. Check browser console
4. Verify backend server is running
5. Check database connections

---

**Quick Tip**: Use the summary cards as your daily dashboard - they give you everything you need to know about your budget health at a glance! 📊
