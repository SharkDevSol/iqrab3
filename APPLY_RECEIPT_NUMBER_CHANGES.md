# Apply Receipt Number Changes - Quick Guide

## What This Does
Makes receipt numbers permanent - once assigned to a paid invoice, they never change when reprinted.

## Quick Setup (3 Steps)

### Step 1: Apply Database Migration
```bash
cd backend
npx prisma migrate deploy
```

**Expected Output:**
```
Applying migration `20260205214454_add_receipt_number_to_invoice`
The following migration(s) have been applied:
migrations/
  └─ 20260205214454_add_receipt_number_to_invoice/
    └─ migration.sql
✔ Generated Prisma Client
```

### Step 2: Restart Backend Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

**Expected Output:**
```
HTTP server created (development mode)
Server running on port 5000
```

### Step 3: Test It
1. Go to Finance → Monthly Payments
2. Select a class and student
3. Find a paid invoice (paidAmount > 0)
4. Click 🖨️ Print button
5. Note the receipt number (e.g., 000005)
6. Click print again
7. **Verify**: Same receipt number appears!

## That's It!

Receipt numbers are now permanent. Each paid invoice keeps its receipt number forever.

## Verify It's Working

### Test 1: Print Same Invoice Twice
- Print receipt → Note number (e.g., 000005)
- Print again → Should show 000005 (not 000006)
- ✅ Working if numbers match

### Test 2: Check Database
```bash
cd backend
npx prisma studio
```
- Open Invoice table
- Find a PAID invoice
- Check receiptNumber field
- Should have value like: RCP-2026-000005

### Test 3: Different Invoices
- Print receipt for Invoice A → Gets 000005
- Print receipt for Invoice B → Gets 000006
- Print receipt for Invoice A again → Still shows 000005
- ✅ Working if A keeps 000005

## If Something Goes Wrong

### Migration Fails
```bash
cd backend
npx prisma migrate reset
npx prisma migrate deploy
```

### Receipt Number Not Saving
- Check backend console for errors
- Verify migration was applied
- Restart backend server

### Still Generating New Numbers
- Clear browser cache
- Refresh the page
- Check if invoice.receiptNumber exists in API response

## Need Help?
Check the detailed guide: `PERMANENT_RECEIPT_NUMBERS.md`

---

**Quick Summary**: Run migration → Restart server → Test printing → Done!
