# 🖨️ Test Receipt Printing Now!

## Quick Test Steps

### 1. Make Sure Backend is Running
```bash
cd backend
npm run dev
```
Wait for: `HTTP server created (development mode)`

### 2. Open the App
- Navigate to: **Finance → Monthly Payments**
- Select any class (e.g., "Class A")
- Select a student who has paid at least one month

### 3. Look for the Print Button
- In the invoice table, find the "Print" column
- You'll see 🖨️ Print button for invoices that have been paid
- If you don't see any, you need to record a payment first

### 4. Click the Print Button
When you click 🖨️:
1. **Look at bottom-right corner** - You should see a small receipt preview with a red border
2. **A new window will open** after 0.5 seconds
3. **Print dialog will appear** automatically
4. **The receipt should be visible** in the print preview (NOT blank!)

## What You Should See

### In the Debug Box (Bottom-Right Corner)
```
┌─────────────────────────────┐
│ [School Logo]               │
│ School Name                 │
│ Cash Receipt Voucher        │
│ Receipt #: 000001           │
│ Date: February 5, 2026      │
│                             │
│ From: Student Name          │
│ Purpose: Monthly Tuition    │
│ Amount in Words: ...        │
│ Amount: 1000.00 Birr        │
│                             │
│ Cashier: School Cashier     │
└─────────────────────────────┘
DEBUG MODE: Receipt #000001 ready
```

### In the Print Window
- Same receipt but full size
- All styles applied
- Ready to print or save as PDF

## If You See a Blank Print Preview

### Check These:
1. **Open Browser Console** (F12)
   - Look for error messages
   - Check for "Component ref not found" or similar errors

2. **Verify Receipt Data**
   - Does the debug box show the receipt?
   - Is all data filled in?
   - Is the student name showing (not "Unknown")?

3. **Check Backend Logs**
   - Any errors when fetching school branding?
   - Any errors with receipt number endpoints?

## Common Issues & Solutions

### Issue: No Print Button Visible
**Solution**: The invoice must have `paidAmount > 0`. Record a payment first.

### Issue: "Unknown" Student Name
**Solution**: Student names come from the class details. Make sure you selected a class first.

### Issue: Popup Blocked
**Solution**: Allow popups for localhost in your browser settings.

### Issue: Receipt Number Shows "NaN"
**Solution**: Backend receipt counter endpoint might not be working. Check backend logs.

### Issue: No School Logo
**Solution**: This is optional. Logo comes from Settings → Branding. It's OK if missing.

## After Successful Test

Once printing works:
1. ✅ Print multiple receipts to test numbering (000001, 000002, 000003...)
2. ✅ Verify receipt counter persists (check `backend/uploads/receipt-counter.json`)
3. ✅ Test with different students and amounts
4. ✅ Save a receipt as PDF to verify formatting

Then we can:
- Remove debug mode (hide the red box)
- Clean up console logs
- Mark Task 14 as complete!

## Need Help?

If it's still not working:
1. Share the browser console errors
2. Share the backend terminal output
3. Take a screenshot of what you see
4. Let me know which step fails

---

**Ready to test?** Click that 🖨️ button and let me know what happens!
