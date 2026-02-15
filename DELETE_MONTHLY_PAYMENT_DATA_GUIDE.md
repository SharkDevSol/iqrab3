# Delete All Monthly Payment Data

## ⚠️ WARNING
This will permanently delete ALL monthly payment data from your database. This action **CANNOT be undone**!

## What Will Be Deleted

The script will remove:
- ✓ All fee structures (class monthly fees)
- ✓ All late fee rules
- ✓ All invoices and invoice items
- ✓ All payments and payment allocations
- ✓ All discounts
- ✓ All scholarships

## What Will NOT Be Deleted

The script will keep:
- ✓ Chart of accounts (you can reuse these)
- ✓ Academic years
- ✓ Student data
- ✓ Class data
- ✓ Staff data

## How to Delete

### Option 1: Using Prisma (Recommended)

```bash
cd backend
node scripts/delete-all-monthly-payment-data.js --confirm
```

### Option 2: Using Direct SQL (If Prisma has issues)

```bash
cd backend
node scripts/delete-all-monthly-payment-data-sql.js --confirm
```

## Step-by-Step Instructions

### Step 1: Backup Your Database (Recommended)

Before deleting, create a backup:

```bash
# PostgreSQL backup command
pg_dump -U your_username -d your_database_name > backup_before_delete.sql
```

### Step 2: Run the Deletion Script

**Without --confirm flag (Safe - shows what will be deleted):**
```bash
cd backend
node scripts/delete-all-monthly-payment-data.js
```

This will show you what will be deleted but won't actually delete anything.

**With --confirm flag (Actually deletes):**
```bash
cd backend
node scripts/delete-all-monthly-payment-data.js --confirm
```

This will actually delete all the data.

### Step 3: Verify Deletion

After running the script, you should see output like:

```
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

## After Deletion

After deleting all monthly payment data, you can:

1. **Start Fresh**: Set up new fee structures from scratch
2. **Reconfigure**: Add new class fees with different settings
3. **Test**: Use the clean slate to test new configurations

## Troubleshooting

### Error: "Cannot delete because of foreign key constraint"

This means there are dependencies. The script handles this by deleting in the correct order:
1. Payment allocations (depends on payments)
2. Payments (depends on invoices)
3. Invoice items (depends on invoices)
4. Invoices (depends on fee structures)
5. Fee structure items (depends on fee structures)
6. Fee structures
7. Late fee rules
8. Discounts
9. Scholarships

If you still get this error, use the SQL version:
```bash
node scripts/delete-all-monthly-payment-data-sql.js --confirm
```

### Error: "Prisma Client not found"

Run:
```bash
cd backend
npm install
npx prisma generate
```

Then try again.

### Error: "Database connection failed"

Make sure:
1. PostgreSQL is running
2. Your `.env` file has correct database credentials
3. The database exists

## Restore from Backup

If you made a backup and want to restore:

```bash
# PostgreSQL restore command
psql -U your_username -d your_database_name < backup_before_delete.sql
```

## Quick Commands Reference

```bash
# See what will be deleted (safe, no actual deletion)
node backend/scripts/delete-all-monthly-payment-data.js

# Actually delete (with confirmation)
node backend/scripts/delete-all-monthly-payment-data.js --confirm

# Use SQL version if Prisma has issues
node backend/scripts/delete-all-monthly-payment-data-sql.js --confirm
```

## Need Help?

If you encounter any issues:
1. Check the error message in the console
2. Make sure the backend server is NOT running (stop it first)
3. Verify your database connection in `.env`
4. Try the SQL version if Prisma version fails

## After Deletion - Next Steps

Once data is deleted, you can:

1. **Set up new fee structures**:
   - Go to Finance → Monthly Payment Settings
   - Click "+ Add Class Fee"
   - Configure your new fee structures

2. **Configure late fees** (optional):
   - Go to Late Fees tab
   - Click "+ Add Late Fee Rule"

3. **Generate new invoices**:
   - After setting up fee structures
   - Click "Generate Next Month" for each class

## Safety Features

The script includes safety features:
- ✓ Requires `--confirm` flag to actually delete
- ✓ Uses database transactions (all-or-nothing)
- ✓ Shows detailed summary of what was deleted
- ✓ Preserves important data (accounts, academic years, students)

## Example Usage

```bash
# Step 1: Check what will be deleted (safe)
cd backend
node scripts/delete-all-monthly-payment-data.js

# Output shows:
# ⚠️  WARNING: This will delete ALL monthly payment data!
# ❌ Deletion cancelled.
# To proceed with deletion, run:
#    node backend/scripts/delete-all-monthly-payment-data.js --confirm

# Step 2: Actually delete (if you're sure)
node scripts/delete-all-monthly-payment-data.js --confirm

# Output shows:
# 🗑️  Starting deletion of all monthly payment data...
# 1️⃣  Deleting payment allocations...
#    ✓ Deleted 45 payment allocations
# ... (continues for all data types)
# ✅ All monthly payment data has been deleted successfully!
```
