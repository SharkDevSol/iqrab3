# 🧪 Test Budget Management - Quick Guide

## ✅ Backend Status
- Server running on port 5000
- Budget routes registered at `/api/finance/budgets`
- Database table initialized
- Authentication configured

## 📍 How to Access

1. **Login to your app** (use staff credentials)
2. **Navigate to**: Finance Section → Budget Management
3. You should see the Budget Management page

## 🧪 Test Steps

### Step 1: Create Your First Budget
1. Click the **"+ Add Budget"** button (top right)
2. Fill in the form:
   ```
   Budget Name: IT Department Budget 2026
   Department: IT
   Fiscal Year: 2026
   Amount: 50000
   Description: Annual IT infrastructure and software budget
   ```
3. Click **"Save Budget"**
4. You should see a success alert

### Step 2: Verify Budget Card
After creation, you should see a card displaying:
- **Budget Number**: BDG-2026-0001 (auto-generated)
- **Name**: IT Department Budget 2026
- **Status Badge**: APPROVED (green)
- **Department**: IT
- **Period**: 2026
- **Budget**: $50,000.00
- **Spent**: $0.00
- **Remaining**: $50,000.00
- **Utilization Progress Bar**: 0% (green)

### Step 3: Create More Budgets
Create a few more to test the grid layout:

**Budget 2:**
```
Name: HR Department Budget 2026
Department: HR
Fiscal Year: 2026
Amount: 30000
Description: Recruitment and training budget
```

**Budget 3:**
```
Name: Marketing Budget 2026
Department: Marketing
Fiscal Year: 2026
Amount: 75000
Description: Digital marketing and campaigns
```

### Step 4: Test Edit Function
1. Click **"✏️ Edit"** on any budget card
2. Change the amount (e.g., from 50000 to 55000)
3. Update the description
4. Click **"Save Budget"**
5. Verify the card updates with new values

### Step 5: Test Utilization Colors
To see the color-coded progress bars, you need to update spent amounts.

**Option A: Using Database (if you have access)**
```sql
-- Update spent amount to see different colors
UPDATE budgets SET spent_amount = 30000 WHERE budget_number = 'BDG-2026-0001';  -- 60% = Green
UPDATE budgets SET spent_amount = 40000 WHERE budget_number = 'BDG-2026-0002';  -- 80% = Orange  
UPDATE budgets SET spent_amount = 48000 WHERE budget_number = 'BDG-2026-0003';  -- 96% = Red
```

**Option B: Using API (with curl or Postman)**
```bash
# Get your auth token from localStorage (authToken)
# Then update spent_amount:

curl -X PUT http://localhost:5000/api/finance/budgets/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"spentAmount": 30000}'
```

After updating, refresh the page to see:
- **Green bar**: < 70% utilization (healthy)
- **Orange bar**: 70-90% utilization (warning)
- **Red bar**: > 90% utilization (critical)

## 🎨 What You Should See

### Budget Card Layout
```
┌─────────────────────────────────────┐
│ IT Department Budget 2026  [APPROVED]│
├─────────────────────────────────────┤
│ Department: IT                      │
│ Period: 2026                        │
│ Budget: $50,000.00                  │
│ Spent: $30,000.00                   │
│ Remaining: $20,000.00               │
│                                     │
│ Utilization              60.0%      │
│ ████████████░░░░░░░░░░              │
│                                     │
│ [✏️ Edit]  [📊 Details]             │
└─────────────────────────────────────┘
```

### Grid Layout
Budgets display in a responsive grid:
- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

## 🔍 Troubleshooting

### Issue: "Failed to fetch budgets"
**Solution**: Check that:
1. Backend server is running (port 5000)
2. You're logged in (authToken in localStorage)
3. Network tab shows 200 response

### Issue: "Authorization failed"
**Solution**: 
1. Check localStorage for `authToken`
2. Try logging out and back in
3. Verify token is being sent in request headers

### Issue: Budget not appearing after creation
**Solution**:
1. Check browser console for errors
2. Verify the API response was successful
3. Try refreshing the page

### Issue: Can't see utilization colors
**Solution**:
1. Spent amount must be > 0 to see colors
2. Update spent_amount via database or API
3. Refresh the page after updating

## 📊 Expected API Responses

### Successful Creation
```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": 1,
    "budgetNumber": "BDG-2026-0001",
    "name": "IT Department Budget 2026",
    "department": "IT",
    "fiscalYear": "2026",
    "amount": "50000.00",
    "spentAmount": "0.00",
    "description": "Annual IT infrastructure budget",
    "status": "APPROVED",
    "createdAt": "2026-02-06T..."
  }
}
```

### Successful List
```json
{
  "success": true,
  "data": [
    { /* budget 1 */ },
    { /* budget 2 */ },
    { /* budget 3 */ }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 3,
    "totalPages": 1
  }
}
```

## ✅ Success Criteria

You've successfully tested Budget Management if:
- [x] Can create new budgets
- [x] Budget numbers auto-generate (BDG-YYYY-XXXX)
- [x] Budgets display in grid cards
- [x] Can edit existing budgets
- [x] Utilization percentage calculates correctly
- [x] Progress bars display with correct colors
- [x] All budget details show properly

## 🎉 Next Steps

Once Budget Management is working:
1. Consider linking expenses to budgets
2. Add budget reports and analytics
3. Implement budget alerts
4. Create budget templates

---

**Ready to test!** Open your app and navigate to Budget Management.
