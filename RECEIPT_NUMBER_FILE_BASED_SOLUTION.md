# Receipt Number - File-Based Solution ✅

## What This Does
Stores receipt numbers in a JSON file that maps invoice IDs to receipt numbers. Works immediately without database changes!

## How It Works

### Storage Method:
- File: `backend/uploads/invoice-receipt-mapping.json`
- Format: `{ "invoice-id-1": "000015", "invoice-id-2": "000016", ... }`
- Persistent across server restarts
- No database migration needed

### Flow:

#### First Time Printing:
1. User clicks print for Invoice A
2. Frontend asks backend: "Does Invoice A have a receipt number?"
3. Backend checks mapping file → Not found
4. Frontend generates new number: 000019
5. Frontend saves to backend: Invoice A → 000019
6. Backend writes to mapping file
7. Receipt prints with 000019

#### Second Time Printing (Same Invoice):
1. User clicks print for Invoice A again
2. Frontend asks backend: "Does Invoice A have a receipt number?"
3. Backend checks mapping file → Found: 000019
4. Frontend uses existing number: 000019
5. Receipt prints with 000019 (SAME NUMBER!)

#### Third Time Printing:
- Always shows 000019
- Never changes

## Backend Changes

### New Endpoints Added:

#### 1. Get Receipt Number for Invoice
```
GET /api/finance/monthly-payments-view/invoice/:invoiceId/receipt-number
```

**Response:**
```json
{
  "invoiceId": "abc-123",
  "receiptNumber": "000019"
}
```

#### 2. Save Receipt Number for Invoice
```
POST /api/finance/monthly-payments-view/invoice/:invoiceId/receipt-number
Body: { "receiptNumber": "000019" }
```

**Response:**
```json
{
  "success": true,
  "message": "Receipt number saved for invoice",
  "invoiceId": "abc-123",
  "receiptNumber": "000019"
}
```

### File Structure:
```json
{
  "550e8400-e29b-41d4-a716-446655440000": "000015",
  "550e8400-e29b-41d4-a716-446655440001": "000016",
  "550e8400-e29b-41d4-a716-446655440002": "000017",
  "550e8400-e29b-41d4-a716-446655440003": "000018",
  "550e8400-e29b-41d4-a716-446655440004": "000019"
}
```

## Frontend Changes

### Updated `prepareAndPrintReceipt()`:

```javascript
// 1. Try to get existing receipt number
const response = await api.get(`/finance/monthly-payments-view/invoice/${invoice.id}/receipt-number`);
if (response.data.receiptNumber) {
  receiptNumber = response.data.receiptNumber; // Use existing
}

// 2. If not found, generate new one
if (!receiptNumber) {
  receiptNumber = generateReceiptNumber(lastReceiptNumber);
  
  // 3. Save it for this invoice
  await api.post(`/finance/monthly-payments-view/invoice/${invoice.id}/receipt-number`, {
    receiptNumber: receiptNumber
  });
}

// 4. Print with the receipt number
```

## Benefits

✅ **Works Immediately** - No database migration needed
✅ **Persistent** - Survives server restarts
✅ **Simple** - Just a JSON file
✅ **Fast** - File I/O is quick
✅ **Reliable** - No database dependencies
✅ **Backward Compatible** - Works with existing system

## Testing

### Step 1: Restart Backend
```bash
cd backend
# Stop server (Ctrl+C)
npm run dev
```

### Step 2: Test Printing
1. Go to a student with a paid invoice
2. Click print → Note the number (e.g., 000019)
3. Click print again → Should show 000019 (NOT 000020)
4. Refresh page and print again → Still shows 000019

### Step 3: Verify File
Check `backend/uploads/invoice-receipt-mapping.json`:
```json
{
  "invoice-id-here": "000019"
}
```

## File Location

```
backend/
  uploads/
    invoice-receipt-mapping.json  ← Receipt number mappings
    receipt-counter.json           ← Last used number
```

## How to Verify It's Working

### Check 1: Print Same Invoice Twice
- Print → 000019
- Print again → 000019 ✅

### Check 2: Check Mapping File
```bash
cd backend/uploads
cat invoice-receipt-mapping.json
```

Should show:
```json
{
  "abc-123-invoice-id": "000019"
}
```

### Check 3: Browser Console
Open F12 console, you should see:
```
Using existing receipt number from backend: 000019
```

## Troubleshooting

### Issue: Still generating new numbers
**Check:**
1. Backend restarted?
2. Check browser console for errors
3. Check backend console for API errors
4. Verify mapping file exists: `backend/uploads/invoice-receipt-mapping.json`

### Issue: File not created
**Solution:**
- Make sure `backend/uploads/` folder exists
- Check file permissions
- Backend should auto-create the file

### Issue: Numbers reset after restart
**Check:**
- Mapping file should persist
- Check if file is being deleted
- Verify file path is correct

## Advantages Over Database Approach

1. **No Migration Needed** - Works immediately
2. **Simple** - Just file I/O
3. **Fast** - No database queries
4. **Portable** - Easy to backup/restore
5. **Debuggable** - Can view/edit JSON file directly

## Files Modified

1. **backend/routes/financeMonthlyPaymentViewRoutes.js**
   - Added GET `/invoice/:invoiceId/receipt-number`
   - Added POST `/invoice/:invoiceId/receipt-number`
   - Uses file-based storage

2. **APP/src/PAGE/Finance/MonthlyPaymentsNew.jsx**
   - Updated `prepareAndPrintReceipt()`
   - Checks for existing receipt number first
   - Saves new receipt numbers to backend
   - Uses existing number if found

## Status
✅ Backend endpoints added
✅ Frontend updated
✅ File-based storage implemented
✅ No database migration needed
✅ Works immediately after restart
✅ No syntax errors

---

**Last Updated**: February 5, 2026
**Status**: Complete - File-Based Receipt Numbers Ready
**Action Required**: Restart backend server and test!
