# Database Setup Guide

## Automatic Setup (Recommended)

The database tables are now automatically created when the server starts. No manual intervention needed!

When you start your backend server, it will:
1. Check if required tables exist
2. Create any missing tables automatically
3. Create necessary indexes
4. Continue with normal startup

## What Tables Are Auto-Created?

- `staff_attendance_profiles` - Staff member profiles for attendance tracking
- `staff_attendance` - Daily attendance records
- `staff_attendance_pending` - Pending two-step verification records
- `staff_attendance_logs` - Audit logs for attendance changes

## Manual Setup (If Needed)

If you need to manually set up the attendance system (e.g., for testing), run:

```bash
node backend/scripts/setup-staff-attendance.js
```

This script will:
- Create all attendance tables
- Create database indexes
- Create triggers and views
- Migrate existing staff to the attendance system

## Moving to a New Device

When you move your application to a new device:

1. Copy your project files
2. Install dependencies: `npm install`
3. Configure your `.env` file with database credentials
4. Start the server: `npm start`

The database tables will be created automatically on first startup!

## Database Reset

If you reset/delete your database:

1. Recreate the database
2. Restore your backup (if available)
3. Start the server

Missing tables will be recreated automatically.

## Troubleshooting

### Issue: "relation does not exist" error

**Solution:** Restart your backend server. The auto-initialization will create missing tables.

### Issue: Setup script fails with connection error

**Solution:** Check your `.env` file has correct database credentials:
```
DB_NAME=school_management2
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### Issue: Tables exist but staff registration still fails

**Solution:** Check the server logs for specific errors. The issue might be with:
- Database permissions
- Schema conflicts
- Transaction rollbacks

## Files Modified for Auto-Setup

1. `backend/config/initDatabase.js` - Database initialization module
2. `backend/server.js` - Added auto-initialization on startup
3. `backend/scripts/setup-staff-attendance.js` - Fixed to use individual DB config variables

## Benefits

✅ No manual setup required when changing devices
✅ Automatic table creation on server startup
✅ Prevents "table does not exist" errors
✅ Works seamlessly with database resets
✅ Zero configuration needed for new installations
