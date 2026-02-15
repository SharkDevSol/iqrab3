# Monthly Payments - Deactivated Students Fix

## Problem
The monthly payments overview page (`/finance/monthly-payments`) was showing incorrect totals that included deactivated students.

### Symptoms
- Frontend displayed: 7 students (correct), but 115,500 Birr (incorrect)
- Expected: 7 students × 10,100 Birr = 70,700 Birr
- The extra 45,500 Birr was from 1 deactivated student (ID: 8-3)

## Root Cause
The overview endpoint (`GET /api/finance/monthly-payments-view/overview`) was fetching ALL invoices without filtering by active students, while the class detail endpoint was already correctly filtering.

## Solution Implemented

### Overview Endpoint Fix
Updated `backend/routes/financeMonthlyPaymentViewRoutes.js` to filter invoices by active students:

1. For each fee structure (class), query the class table to get active student IDs:
   ```sql
   SELECT school_id, class_id
   FROM classes_schema."ClassName"
   WHERE is_active = TRUE OR is_active IS NULL
   ```

2. Build student ID set in UUID format:
   - Format: `00000000-0000-0000-{schoolId}-{classId}`
   - Example: `00000000-0000-0000-0001-000000000001`

3. Filter all invoices to only include those for active students:
   ```javascript
   const invoices = allInvoices.filter(inv => activeStudentIds.has(inv.studentId));
   ```

4. Recalculate all statistics based on filtered invoices:
   - `totalStudents` - Count of unique active students
   - `totalAmount` - Sum of all invoice amounts for active students
   - `totalPaid` - Sum of all paid amounts for active students
   - `totalPending` - Difference between total and paid

### Error Handling
Added backward compatibility: if the query fails (e.g., class table doesn't exist), the endpoint includes all students to prevent breaking the system.

## Verification

### Debug Script Results
Created `backend/debug-monthly-payments.js` to verify calculations:

```
Active Students: 7
- khalid abdurhman (1-1): 10,100 Birr unlocked
- halima yusuf (2-2): 10,100 Birr unlocked
- kalid abdulamid (9-4): 10,100 Birr unlocked
- ayub khalif (10-5): 10,100 Birr unlocked
- ahmed mame (18-6): 10,100 Birr unlocked
- mume ahmed (19-7): 10,100 Birr unlocked
- musab khalif (25-8): 10,100 Birr unlocked

Deactivated Student (excluded):
- Unknown (8-3): 10,100 Birr unlocked

Total Unlocked Amount: 70,700 Birr ✅
Total Unlocked Paid: 6,900 Birr
Total Unlocked Pending: 63,800 Birr
```

## Files Modified
- `backend/routes/financeMonthlyPaymentViewRoutes.js` - Overview endpoint (lines 150-250)

## Related Changes
The class detail endpoint (`GET /api/finance/monthly-payments-view/class/:className`) was already correctly filtering deactivated students in a previous update.

## Testing
1. Navigate to `/finance/monthly-payments` (overview page)
2. Verify the totals match: 7 students, 70,700 Birr unlocked total
3. Click on a class to view details
4. Verify student list only shows active students
5. Verify calculations are consistent between overview and detail pages

## Impact
- Deactivated students are now completely hidden from monthly payments overview
- Financial reports show accurate totals for active students only
- Data for deactivated students is preserved in the database
- Users can reactivate students at any time to restore their invoices
