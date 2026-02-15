# Delete Monthly Payment Data - Summary

## What Was Created

I've created scripts to safely delete all monthly payment data from your database.

### Files Created

1. **`backend/scripts/delete-all-monthly-payment-data.js`**
   - Prisma-based deletion script
   - Uses transactions for safety
   - Deletes data in correct order to avoid foreign key issues

2. **`backend/scripts/delete-all-monthly-payment-data-sql.js`**
   - Direct SQL deletion script
   - Backup option if Prisma has issues
   - Same functionality, different approach

3. **`DELETE_MONTHLY_PAYMENT_DATA_GUIDE.md`**
   - Detailed guide with step-by-step instructions
   - Troubleshooting section
   - Backup and restore instructions

4. **`DELETE_PAYMENT_DATA_QUICK.md`**
   - Quick reference card
   - Essential commands only
   - For experienced users

## How to Use

### Quick Start (3 Steps)

1. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

2. **Run the deletion script**:
   ```bash
   node scripts/delete-all-monthly-payment-data.js --confirm
   ```

3. **Done!** All monthly payment data is deleted.

### What Gets Deleted

The script removes:
- ✅ All fee structures (class monthly fees)
- ✅ All late fee rules
- ✅ All invoices and invoice items
- ✅ All payments and payment allocations
- ✅ All discounts
- ✅ All scholarships

### What Stays Safe

The script preserves:
- ✅ Chart of accounts (you can reuse these)
- ✅ Academic years
- ✅ Student data
- ✅ Class data
- ✅ Staff data
- ✅ All other system data

## Safety Features

1. **Requires --confirm flag**: Won't delete without explicit confirmation
2. **Transaction-based**: All deletions succeed or fail together (no partial deletion)
3. **Correct order**: Deletes in proper order to avoid foreign key errors
4. **Detailed logging**: Shows exactly what was deleted
5. **Preserves core data**: Keeps accounts, students, classes intact

## Example Output

When you run the script, you'll see:

```
🗑️  Starting deletion of all monthly payment data...

1️⃣  Deleting payment allocations...
   ✓ Deleted 45 payment allocations

2️⃣  Deleting payments...
   ✓ Deleted 23 payments

3️⃣  Deleting invoice items...
   ✓ Deleted 120 invoice items

4️⃣  Deleting invoices...
   ✓ Deleted 60 invoices

5️⃣  Deleting fee structure items...
   ✓ Deleted 12 fee structure items

6️⃣  Deleting fee structures...
   ✓ Deleted 4 fee structures

7️⃣  Deleting late fee rules...
   ✓ Deleted 2 late fee rules

8️⃣  Deleting discounts...
   ✓ Deleted 5 discounts

9️⃣  Deleting scholarships...
   ✓ Deleted 3 scholarships

✅ All monthly payment data has been deleted successfully!

📊 Summary:
   - Payment allocations: 45 deleted
   - Payments: 23 deleted
   - Invoice items: 120 deleted
   - Invoices: 60 deleted
   - Fee structure items: 12 deleted
   - Fee structures: 4 deleted
   - Late fee rules: 2 deleted
   - Discounts: 5 deleted
   - Scholarships: 3 deleted

💡 Note: Chart of accounts and academic years were NOT deleted.
   You can reuse them for new payment settings.
```

## Common Use Cases

### 1. Start Fresh
You want to completely reset the monthly payment system and start over with new configurations.

### 2. Testing
You've been testing the system and want to clear all test data before going live.

### 3. Reconfiguration
You need to change the entire fee structure and it's easier to delete and recreate than to update.

### 4. Data Cleanup
You have incorrect or duplicate data that needs to be removed.

## After Deletion

Once data is deleted, you can:

1. **Set up new fee structures**:
   - Go to Finance → Monthly Payment Settings
   - Click "+ Add Class Fee"
   - Select classes and configure fees

2. **Add late fee rules** (optional):
   - Go to Late Fees tab
   - Click "+ Add Late Fee Rule"
   - Configure grace periods and penalties

3. **Generate invoices**:
   - After setting up fee structures
   - Click "Generate Next Month" for each class
   - Invoices will be created for all students

## Troubleshooting

### Issue: "Cannot delete because of foreign key constraint"

**Solution**: The script handles this automatically by deleting in the correct order. If you still get this error, try the SQL version:
```bash
node scripts/delete-all-monthly-payment-data-sql.js --confirm
```

### Issue: "Prisma Client not found"

**Solution**: Generate Prisma client:
```bash
cd backend
npx prisma generate
```

### Issue: "Database connection failed"

**Solution**: Check your `.env` file and make sure PostgreSQL is running.

## Backup Recommendation

Before deleting, create a backup:

```bash
# PostgreSQL backup
pg_dump -U your_username -d your_database_name > backup_before_delete.sql

# To restore later if needed
psql -U your_username -d your_database_name < backup_before_delete.sql
```

## Commands Reference

```bash
# Preview what will be deleted (safe, no actual deletion)
node backend/scripts/delete-all-monthly-payment-data.js

# Actually delete all data (requires confirmation)
node backend/scripts/delete-all-monthly-payment-data.js --confirm

# Alternative SQL version
node backend/scripts/delete-all-monthly-payment-data-sql.js --confirm
```

## Important Notes

1. **Stop the backend server** before running the script
2. **Make a backup** if you might need to restore
3. **Use --confirm flag** to actually delete (safety feature)
4. **Check the output** to verify what was deleted
5. **Chart of accounts are preserved** - you can reuse them

## Next Steps

After deletion:
1. Restart your backend server
2. Log in as admin
3. Go to Finance → Monthly Payment Settings
4. Set up new fee structures
5. Generate invoices for students

## Files to Read

- **Quick reference**: `DELETE_PAYMENT_DATA_QUICK.md`
- **Detailed guide**: `DELETE_MONTHLY_PAYMENT_DATA_GUIDE.md`
- **This summary**: `DELETE_MONTHLY_PAYMENT_DATA_SUMMARY.md`

## Need Help?

If you encounter issues:
1. Read the detailed guide: `DELETE_MONTHLY_PAYMENT_DATA_GUIDE.md`
2. Check the error message in console
3. Try the SQL version if Prisma version fails
4. Make sure database connection is working
