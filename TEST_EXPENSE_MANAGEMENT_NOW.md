# 🧪 Test Expense Management System - Quick Guide

## ✅ System Status

- ✅ Backend server running on port 5000
- ✅ Database tables created
- ✅ All endpoints tested and working
- ✅ Staff endpoint returning 6 staff members
- ✅ Test expense created: EXP-2026-000001

---

## 🚀 Quick Test Steps

### Step 1: Start Frontend (if not running)
```bash
cd APP
npm run dev
```

The frontend should start on: `http://localhost:5173`

### Step 2: Login
Use any staff account with finance access:
- **Username**: `bilal915`
- **Password**: `M8P45i68`

### Step 3: Navigate to Expense Management
1. Click on **Finance** in the sidebar
2. Click on **Expense Management**

### Step 4: Test the Features

#### A. View Existing Expenses
- You should see 1 test expense: `EXP-2026-000001`
- Status: PENDING
- Amount: $100.50
- Category: SUPPLIES

#### B. Filter Expenses
- Click on different status tabs: ALL, DRAFT, PENDING, APPROVED, etc.
- Toggle "📦 Inventory Expenses Only" checkbox

#### C. Create New Expense
1. Click **"+ Add Expense"** button
2. Fill in the form:
   ```
   Category: SUPPLIES
   Description: Test office supplies purchase
   Amount: 250.00
   Expense Date: (today's date)
   Requested By: (select from dropdown)
   Vendor Name: ABC Supplies
   Payment Method: CASH
   ```
3. Click **"Create Expense"**
4. You should see success message
5. New expense appears in the table with auto-generated number

#### D. View Expense Details
- Click the 👁️ (eye) button on any expense
- Modal should show all expense details

---

## 🔍 What to Check

### ✅ Staff Dropdown Working
- When creating expense, "Requested By" dropdown should show all staff
- Should see names like: Ahmed, Bilal, Faxe, Obsa, Yusuf, Chaltu

### ✅ Expense Number Auto-Generated
- Format: `EXP-2026-XXXXXX`
- Sequential numbering
- Unique for each expense

### ✅ Status Badge Colors
- DRAFT: Gray
- PENDING: Orange
- APPROVED: Green
- REJECTED: Red
- PAID: Blue

### ✅ Inventory Source Badge
- Manual expenses: "Manual" in gray
- Inventory expenses: "📦 Inventory" in blue

---

## 🐛 Troubleshooting

### Issue: Cannot see Expense Management page
**Solution**: 
1. Make sure you're logged in as staff with finance access
2. Check if Finance menu is visible in sidebar
3. Try refreshing the page

### Issue: Staff dropdown is empty
**Solution**: 
1. Check browser console for errors
2. Verify backend is running: `http://localhost:5000/api/health`
3. Test staff endpoint: Run `node backend/test-expense-endpoints.js`

### Issue: Cannot create expense
**Solution**:
1. Check all required fields are filled
2. Open browser console (F12) to see error messages
3. Verify authentication token exists in localStorage

### Issue: 404 errors in console
**Solution**: ✅ Already fixed! If you still see them:
1. Restart backend: `powershell -ExecutionPolicy Bypass -File backend/kill-port-5000.ps1`
2. Then: `cd backend && npm run dev`

---

## 📊 Expected Results

After testing, you should have:
- ✅ At least 2 expenses in the system
- ✅ Different expense numbers (EXP-2026-000001, EXP-2026-000002)
- ✅ Expenses showing in the table
- ✅ Filters working correctly
- ✅ Modal showing expense details
- ✅ Staff dropdown populated

---

## 🎯 Next Actions

### If Everything Works:
1. ✅ Start using the system for real expenses
2. ✅ Train staff on how to create expenses
3. ✅ Set up approval workflow (optional)

### If You Find Issues:
1. Check browser console (F12) for errors
2. Check backend logs in terminal
3. Run test script: `node backend/test-expense-endpoints.js`
4. Report specific error messages

---

## 📝 Quick Reference

### API Endpoints
- **GET** `/api/staff` - Get all staff
- **GET** `/api/finance/expenses` - Get expenses
- **POST** `/api/finance/expenses` - Create expense
- **PUT** `/api/finance/expenses/:id` - Update expense
- **DELETE** `/api/finance/expenses/:id` - Delete expense

### Test Command
```bash
node backend/test-expense-endpoints.js
```

### Backend Status
```bash
# Check if running
curl http://localhost:5000/api/health

# Should return: {"status":"OK","message":"Server is running"}
```

---

## 🎉 Success Criteria

You'll know it's working when:
- ✅ You can login successfully
- ✅ Expense Management page loads
- ✅ Staff dropdown shows names
- ✅ You can create a new expense
- ✅ Expense appears in table immediately
- ✅ Expense number is auto-generated
- ✅ Filters work correctly
- ✅ Modal shows expense details

---

**Ready to test? Start with Step 1 above!** 🚀

**Last Updated**: February 6, 2026
