# 🧪 Test Expense Approval System - Quick Guide

## ✅ System Ready

- ✅ Backend updated with new endpoints
- ✅ Database columns added (approved_at, rejected_at, paid_at, etc.)
- ✅ 4 new pages created
- ✅ Routes registered in App.jsx

---

## 🚀 Quick Test Steps

### Test 1: Approve Workflow

1. **Create Test Expense**
   - Go to: `/finance/expenses`
   - Click **"+ Add Expense"**
   - Fill in:
     ```
     Category: SUPPLIES
     Description: Test office supplies
     Amount: 150.00
     Expense Date: Today
     Requested By: (select any staff)
     Payment Method: CASH
     ```
   - Click **"Create Expense"**

2. **Approve the Expense**
   - Go to: `/finance/expense-approval`
   - You should see your expense in the table
   - Click the ✅ button
   - Confirm approval
   - Expense should disappear from this page

3. **Mark as Paid**
   - Go to: `/finance/expense-paid-unpaid`
   - Click **"UNPAID"** tab
   - You should see your approved expense
   - Click the 💵 button
   - Confirm payment
   - Expense should move to **"PAID"** tab

4. **Verify Timeline**
   - In PAID tab, click 👁️ on the expense
   - Check the timeline shows:
     - ✅ Created date
     - ✅ Expense date
     - ✅ Approved date
     - ✅ Paid date

---

### Test 2: Reject Workflow

1. **Create Another Expense**
   - Go to: `/finance/expenses`
   - Create another test expense:
     ```
     Category: MARKETING
     Description: Test marketing campaign
     Amount: 500.00
     ```

2. **Reject the Expense**
   - Go to: `/finance/expense-approval`
   - Find your new expense
   - Click the ❌ button
   - Enter rejection reason:
     ```
     Budget exceeded for this month
     ```
   - Click **"Reject Expense"**

3. **View Rejected Expense**
   - Go to: `/finance/expense-rejected`
   - You should see your rejected expense
   - Rejection reason should be visible in table
   - Click 👁️ to see full details
   - Rejection reason should be prominently displayed

---

## 🔍 What to Check

### Expense Approval Page
- ✅ Shows only PENDING expenses
- ✅ Approve button (✅) works
- ✅ Reject button (❌) opens modal
- ✅ Rejection reason is required
- ✅ View details (👁️) shows all info
- ✅ Counter shows correct number of pending

### Paid/Unpaid Page
- ✅ UNPAID tab shows APPROVED expenses
- ✅ PAID tab shows PAID expenses
- ✅ Total amount calculated correctly
- ✅ Mark as paid (💵) button works
- ✅ Timeline in details modal shows all dates
- ✅ Can't mark PENDING as paid (only APPROVED)

### Rejected Page
- ✅ Shows all REJECTED expenses
- ✅ Rejection reason visible in table
- ✅ Details modal shows rejection reason prominently
- ✅ Timeline shows created and rejected dates

---

## 📊 Expected Results

After testing, you should have:

1. **At least 1 PAID expense** with:
   - Created date
   - Approved date
   - Paid date
   - All visible in timeline

2. **At least 1 REJECTED expense** with:
   - Created date
   - Rejected date
   - Rejection reason

3. **Working navigation** between all 4 pages:
   - Expense Management
   - Expense Approval
   - Paid/Unpaid Expenses
   - Rejected Expenses

---

## 🎨 Visual Checks

### Colors
- PENDING: Orange
- APPROVED: Green
- REJECTED: Red
- PAID: Blue

### Icons
- 👁️ View Details (all pages)
- ✅ Approve (approval page)
- ❌ Reject (approval page)
- 💵 Mark as Paid (paid/unpaid page)

### Modals
- Beautiful gradient headers
- Color-coded timeline
- All dates formatted correctly
- Rejection reason prominently displayed (rejected page)

---

## 🐛 Troubleshooting

### Issue: Can't see Expense Approval page
**Solution**: 
- Check if route is added in App.jsx
- Verify you're logged in with finance access
- Try: `http://localhost:5173/finance/expense-approval`

### Issue: Approve button doesn't work
**Solution**:
- Check browser console for errors
- Verify backend is running on port 5000
- Check authentication token in localStorage

### Issue: Can't mark as paid
**Solution**:
- Expense must be APPROVED first
- Check expense status in database
- Only approved expenses can be marked as paid

### Issue: Dates not showing
**Solution**:
- Check if database columns were added
- Restart backend server
- Check browser console for errors

---

## 📝 Test Checklist

- [ ] Create expense successfully
- [ ] See expense in Approval page
- [ ] Approve expense
- [ ] See approved expense in Unpaid tab
- [ ] Mark expense as paid
- [ ] See expense in Paid tab
- [ ] View details modal with timeline
- [ ] Create another expense
- [ ] Reject expense with reason
- [ ] See rejected expense in Rejected page
- [ ] View rejection reason in details

---

## 🎯 Success Criteria

✅ All 4 pages load without errors
✅ Can approve expenses
✅ Can reject expenses with reasons
✅ Can mark approved expenses as paid
✅ Timeline shows all dates correctly
✅ Rejection reasons are displayed
✅ Totals calculate correctly
✅ Modals show complete information

---

## 🔗 Quick Links

- Expense Management: `http://localhost:5173/finance/expenses`
- Expense Approval: `http://localhost:5173/finance/expense-approval`
- Paid/Unpaid: `http://localhost:5173/finance/expense-paid-unpaid`
- Rejected: `http://localhost:5173/finance/expense-rejected`

---

## 💡 Tips

1. **Test in Order**: Follow Test 1 then Test 2 for best results
2. **Check Timeline**: Always verify dates in details modal
3. **Use Different Amounts**: Makes it easier to track expenses
4. **Read Rejection Reasons**: Make sure they're stored and displayed
5. **Check Both Tabs**: In Paid/Unpaid page, verify both tabs work

---

**Ready to test? Start with Test 1!** 🚀

**Last Updated**: February 6, 2026
