# Auto-Setup System Documentation

## Overview

The system now includes an **automatic setup** that runs every time the backend server starts. This ensures that all required database tables and default accounts are created automatically, even after deleting data or starting fresh.

## What Gets Auto-Setup

### 1. Prisma Database Migrations
- Automatically checks if Prisma tables exist
- If tables are missing, attempts to run migrations automatically
- Creates all finance module tables (Account, FeeStructure, Invoice, Payment, etc.)

### 2. Default Accounts
- Creates 4 essential accounts if they don't exist:
  - **1000 - Cash and Bank** (ASSET)
  - **2000 - Accounts Receivable** (LIABILITY)
  - **4000 - Tuition Fee Income** (INCOME)
  - **5000 - Operating Expenses** (EXPENSE)

### 3. Student Attendance Tables
- Creates student attendance system tables if they don't exist:
  - **academic_student_attendance_settings** - Time settings for attendance
  - **academic_class_shift_assignment** - Class to shift mapping
  - **academic_student_attendance** - Attendance records
- Inserts default time settings:
  - Shift 1: 07:00-08:30 (Late: 08:00, Absent: 09:00)
  - Shift 2: 12:00-13:30 (Late: 13:00, Absent: 14:00)

## How It Works

### Server Startup Flow

```
1. Server starts
   ↓
2. Auto-setup runs
   ↓
3. Check Prisma migrations
   ↓
4. Run migrations if needed
   ↓
5. Create default accounts
   ↓
6. Server ready to accept requests
```

### Files Involved

- **`backend/utils/autoSetup.js`** - Main auto-setup logic
- **`backend/server.js`** - Integrated into server startup
- **`backend/scripts/setup-default-accounts.js`** - Original manual setup script (still available)

## Usage

### Automatic (Recommended)

Just start your server normally:

```bash
cd backend
npm start
```

The auto-setup will run automatically and you'll see:

```
🔧 Running auto-setup...
   ✓ Default accounts already exist
   ✓ Prisma migrations are up to date
✅ Auto-setup completed successfully!

Server running on port 5000
```

### Manual (If Needed)

If you want to run setup manually:

```bash
cd backend
node scripts/setup-default-accounts.js
```

Or test the auto-setup:

```bash
cd backend
node test-auto-setup.js
```

## Benefits

### ✅ No More Manual Setup
- No need to remember to run setup scripts
- Works automatically after database reset
- Works on fresh installations

### ✅ Idempotent
- Safe to run multiple times
- Only creates what's missing
- Won't duplicate existing data

### ✅ Self-Healing
- Detects missing tables
- Attempts to fix automatically
- Provides clear error messages if manual intervention needed

## What Happens on Fresh Start

### Scenario 1: Fresh Database (No Tables)

```
🔧 Running auto-setup...
   ⚠️ Prisma tables not found - attempting to run migrations...
   📝 Running: npx prisma migrate deploy
   ✓ Migrations applied successfully
   📝 Creating default accounts...
      ✓ Created account: 1000 - Cash and Bank
      ✓ Created account: 2000 - Accounts Receivable
      ✓ Created account: 4000 - Tuition Fee Income
      ✓ Created account: 5000 - Operating Expenses
   ✓ Default accounts setup complete
✅ Auto-setup completed successfully!
```

### Scenario 2: Tables Exist, Accounts Missing

```
🔧 Running auto-setup...
   ✓ Prisma migrations are up to date
   📝 Creating default accounts...
      ✓ Created account: 4000 - Tuition Fee Income
   ✓ Default accounts setup complete
✅ Auto-setup completed successfully!
```

### Scenario 3: Everything Already Setup

```
🔧 Running auto-setup...
   ✓ Default accounts already exist
   ✓ Prisma migrations are up to date
✅ Auto-setup completed successfully!
```

## Troubleshooting

### If Auto-Setup Fails

The server will still start, but you'll see a warning:

```
⚠️ Auto-setup encountered an error: [error message]
   Server will continue, but some features may require manual setup
```

**Solution:** Run migrations manually:

```bash
cd backend
npx prisma migrate deploy
```

### If Migrations Fail

You might see:

```
⚠️ Could not run migrations automatically
📝 Please run manually: cd backend && npx prisma migrate deploy
```

**Solution:** Follow the instructions and run the command manually.

### If Accounts Already Exist

This is normal and expected:

```
✓ Default accounts already exist
```

No action needed - the system detected existing accounts and skipped creation.

## For Developers

### Adding New Auto-Setup Tasks

Edit `backend/utils/autoSetup.js` and add your setup function:

```javascript
async function autoSetup() {
  try {
    console.log('\n🔧 Running auto-setup...');

    await setupDefaultAccounts();
    await ensurePrismaMigrations();
    
    // Add your new setup task here
    await setupYourNewFeature();

    console.log('✅ Auto-setup completed successfully!\n');
  } catch (error) {
    console.error('⚠️ Auto-setup encountered an error:', error.message);
  }
}
```

### Testing Auto-Setup

```bash
cd backend
node test-auto-setup.js
```

## Summary

The auto-setup system ensures your application is always ready to run, even after:
- Deleting the database
- Fresh installation
- Database migrations
- Server restarts

**You never need to manually run setup scripts again!** 🎉
