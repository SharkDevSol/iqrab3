# Quick: Delete All Monthly Payment Data

## ⚠️ WARNING: This CANNOT be undone!

## Quick Command

```bash
cd backend
node scripts/delete-all-monthly-payment-data.js --confirm
```

## What Gets Deleted
- Fee structures (class monthly fees)
- Late fee rules
- All invoices
- All payments
- Discounts & scholarships

## What Stays
- Chart of accounts
- Student data
- Class data
- Staff data

## If It Fails

Try the SQL version:
```bash
node scripts/delete-all-monthly-payment-data-sql.js --confirm
```

## Backup First (Recommended)

```bash
pg_dump -U your_username -d your_database_name > backup.sql
```

## Restore Backup

```bash
psql -U your_username -d your_database_name < backup.sql
```

---

**Read full guide**: `DELETE_MONTHLY_PAYMENT_DATA_GUIDE.md`
