# 🚀 Automatic Database Migration System

## What Problem Does This Solve?

Before, when you deployed to a new device or VPS, you had to manually run SQL scripts like:
- `ADD_WEEKEND_DAYS_COLUMN.sql`
- `ADD_MACHINE_ID_COLUMN.sql`
- `ADD_SHIFT_COLUMNS.sql`
- etc.

**Now**: All database changes happen automatically when you start the server! 🎉

## How It Works

```
1. Upload code to new device/VPS
2. Run: npm install
3. Run: npm start
4. ✅ Database automatically updated!
```

## What Happens When Server Starts

```
📦 Checking for pending database migrations...

📋 Found 5 pending migration(s)

🔄 Running migration: 001_add_weekend_days
✅ Migration 001_add_weekend_days completed successfully

🔄 Running migration: 002_add_machine_id
✅ Migration 002_add_machine_id completed successfully

... (continues for all pending migrations)

✅ All pending migrations completed successfully!

Server running on port 5000
```

## Current Migrations

All these run automatically:

1. ✅ **Weekend Days** - Adds weekend configuration
2. ✅ **Machine ID** - Adds AI06 device integration
3. ✅ **Shift Columns** - Adds staff shift support
4. ✅ **Is Active** - Adds sub-account activation
5. ✅ **Student Shifts** - Adds student shift support

## Deployment Steps

### New VPS Deployment
```bash
# 1. Upload your code
scp -r SCHOOLS/ user@vps-ip:/path/to/app

# 2. SSH into VPS
ssh user@vps-ip

# 3. Navigate to backend
cd /path/to/app/backend

# 4. Install dependencies
npm install

# 5. Configure database
nano .env
# Set DATABASE_URL=postgresql://user:pass@localhost/dbname

# 6. Start server (migrations run automatically!)
npm start
```

### New Development Machine
```bash
# 1. Clone repository
git clone <your-repo>

# 2. Install dependencies
cd backend
npm install

# 3. Configure .env
# Set DATABASE_URL

# 4. Start server (migrations run automatically!)
npm start
```

## Manual Migration Commands

If you need to manage migrations manually:

```bash
cd backend/migrations

# Check status
node migrate.js status

# Run pending migrations
node migrate.js up

# Rollback last migration
node migrate.js down
```

## Adding New Migrations

When you need to add a new database change:

1. Create file: `backend/migrations/006_your_change.js`

```javascript
module.exports = {
  name: '006_your_change',
  description: 'What this migration does',
  
  async up(pool) {
    await pool.query(`
      ALTER TABLE your_table 
      ADD COLUMN new_column VARCHAR(255)
    `);
    console.log('✅ Migration 006: Applied');
  },

  async down(pool) {
    await pool.query(`
      ALTER TABLE your_table 
      DROP COLUMN IF EXISTS new_column
    `);
    console.log('✅ Migration 006: Rolled back');
  }
};
```

2. Restart server - migration runs automatically!

## Benefits

✅ **No Manual Scripts** - Forget about .bat and .sql files
✅ **Works Everywhere** - Windows, Linux, VPS, Docker
✅ **Team Friendly** - Everyone gets same database schema
✅ **Version Controlled** - Migrations tracked in Git
✅ **Safe** - Won't run twice, uses IF NOT EXISTS
✅ **Automatic** - Just start the server!

## Migration Tracking

The system creates a `schema_migrations` table:

```sql
SELECT * FROM schema_migrations;
```

Output:
```
id | name                    | description                          | executed_at
---+-------------------------+--------------------------------------+-------------------
1  | 001_add_weekend_days    | Add weekend_days column...          | 2025-02-17 10:30:00
2  | 002_add_machine_id      | Add machine_id column...            | 2025-02-17 10:30:01
3  | 003_add_shift_columns   | Add shift_id and shift-related...   | 2025-02-17 10:30:02
```

## Troubleshooting

### "Migration failed" error
- Check database connection in `.env`
- Verify database user has ALTER TABLE permissions
- Check server console for detailed error

### Want to re-run all migrations (dev only)
```sql
DROP TABLE schema_migrations;
```
Then restart server.

### Check what migrations ran
```bash
cd backend/migrations
node migrate.js status
```

## Old Scripts (No Longer Needed)

You can now delete these files (migrations handle them):
- ❌ `ADD_WEEKEND_DAYS_COLUMN.sql`
- ❌ `ADD_WEEKEND_SUPPORT.bat`
- ❌ `ADD_MACHINE_ID_COLUMN.bat`
- ❌ `ADD_MACHINE_ID_SIMPLE.bat`
- ❌ `ADD_SHIFT_COLUMNS.bat`
- ❌ `ADD_IS_ACTIVE_COLUMN.sql`
- ❌ `ADD_STUDENT_SHIFT_SUPPORT.bat`

All these are now handled by the automatic migration system!

## Summary

**Before**: 😫 Manual SQL scripts on every new deployment
**After**: 😎 Just start the server, everything updates automatically!

No more forgetting to run scripts. No more database inconsistencies. Just deploy and go! 🚀
