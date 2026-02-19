# Finance Module Setup Instructions

## Problem
The finance endpoints are returning 500 errors because the Prisma database tables don't exist yet.

Error: `The table 'school_comms.LateFeeRule' does not exist in the current database.`

## Solution

You need to run Prisma migrations to create all the finance tables in your database.

### Steps:

1. **Stop your backend server** (if running)

2. **Run Prisma migrations:**
   ```bash
   cd backend
   npx prisma migrate deploy
   ```

   This will create all the necessary tables:
   - Account (Chart of Accounts)
   - FeeStructure & FeeStructureItem
   - Discount & Scholarship
   - LateFeeRule
   - Invoice & InvoiceItem
   - Payment & PaymentAllocation
   - Refund
   - Expense & ExpenseAttachment
   - Vendor
   - Budget & BudgetLine
   - And many more...

3. **If migrate deploy doesn't work, try:**
   ```bash
   npx prisma migrate dev
   ```

4. **Verify the tables were created:**
   ```bash
   node test-finance-endpoints.js
   ```

5. **Start your backend server**

6. **Test the finance endpoints** - they should now work!

## What This Will Fix

- ✓ GET /api/finance/late-fee-rules?isActive=true
- ✓ GET /api/finance/monthly-payments-view/overview?currentMonth=6
- ✓ All other finance module endpoints

## Note

The migrations are already created in `backend/prisma/migrations/`, you just need to apply them to your database.
