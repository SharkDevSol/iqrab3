# Automatic Staff Attendance Setup

## 🎯 Overview

The staff attendance system now **automatically creates attendance profiles** when new staff members are added to the system. No manual setup required!

---

## ✨ What Happens Automatically

### When Adding New Staff

When you create a new staff member through the system:

1. **Staff Record Created** → Basic staff information saved
2. **User Account Created** → Login credentials generated
3. **Attendance Profile Created** ✨ **NEW** → Attendance system initialized
4. **Schedule Added** (for teachers) → Teaching schedule configured

The attendance profile is created automatically in the background with:
- Staff ID
- Staff Name
- Role (Teacher or General Staff)
- Active status

---

## 🚀 One-Time Setup (For Existing System)

If you already have staff in your system, run this one-time setup:

### Option 1: Automated Script (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the setup script
node scripts/setup-staff-attendance.js
```

This script will:
- ✅ Create all database tables
- ✅ Create indexes for performance
- ✅ Create triggers for logging
- ✅ Create views for reporting
- ✅ Migrate all existing staff automatically
- ✅ Verify the setup

### Option 2: Manual SQL

```bash
# Run the SQL schema
psql -U your_username -d your_database -f backend/database/staff_attendance_schema.sql

# Then migrate existing staff via API
curl -X POST http://localhost:5000/api/staff-attendance/migrate-existing-staff
```

### Option 3: Via API (After Server Start)

```bash
# Start your backend server
cd backend
npm start

# In another terminal, run migration
curl -X POST http://localhost:5000/api/staff-attendance/migrate-existing-staff
```

---

## 📋 How It Works

### For New Staff Members

```
User Creates Staff
       ↓
┌──────────────────────────────────────┐
│  Backend: /api/staff/add-staff       │
├──────────────────────────────────────┤
│  1. Insert staff record              │
│  2. Create user account              │
│  3. Create attendance profile ✨     │ ← AUTOMATIC
│  4. Add to schedule (if teacher)     │
└──────────────────────────────────────┘
       ↓
Staff Can Immediately Use Attendance System
```

### Database Flow

```sql
-- When staff is added, this happens automatically:
INSERT INTO staff_attendance_profiles 
(staff_id, staff_name, role, created_at)
VALUES ('T001', 'John Doe', 'Teacher', CURRENT_TIMESTAMP)
ON CONFLICT (staff_id) DO NOTHING;
```

---

## 🔍 Verification

### Check if Setup is Complete

```bash
# Check tables exist
psql -U your_user -d your_db -c "\dt staff_attendance*"

# Check staff profiles
psql -U your_user -d your_db -c "SELECT COUNT(*) FROM staff_attendance_profiles;"

# Check a specific staff member
psql -U your_user -d your_db -c "SELECT * FROM staff_attendance_profiles WHERE staff_id = 'T001';"
```

### Via API

```bash
# Get staff profile
curl http://localhost:5000/api/staff-attendance/profile/T001

# Check migration status
curl -X POST http://localhost:5000/api/staff-attendance/migrate-existing-staff
```

---

## 📊 Database Tables

### staff_attendance_profiles (Auto-created)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| staff_id | VARCHAR(50) | Unique staff identifier |
| staff_name | VARCHAR(255) | Staff member name |
| role | VARCHAR(50) | Teacher or General Staff |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | When profile was created |
| updated_at | TIMESTAMP | Last update time |

### staff_attendance (Daily records)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| staff_id | VARCHAR(50) | Staff identifier |
| staff_name | VARCHAR(255) | Staff name |
| role | VARCHAR(50) | Role type |
| date | DATE | Attendance date |
| time_in | TIMESTAMP | Clock in time |
| time_out | TIMESTAMP | Clock out time |
| step1_timestamp | TIMESTAMP | Teacher verification step 1 |
| step2_timestamp | TIMESTAMP | Teacher verification step 2 |
| verification_status | VARCHAR(20) | Verification type |

---

## 🎨 User Experience

### For Staff Members

1. **First Time**:
   - Profile automatically created when added to system
   - Can immediately access `/staff/my-attendance`
   - No setup or registration needed

2. **Daily Use**:
   - Login to system
   - Navigate to "My Attendance"
   - Clock in/out as normal

### For Administrators

1. **Adding New Staff**:
   - Use existing staff creation form
   - Attendance profile created automatically
   - No additional steps needed

2. **Viewing Records**:
   - Navigate to "Attendance Records"
   - See all staff attendance data
   - Export reports as needed

---

## 🔧 Configuration

### Customize Role Detection

The system automatically determines the role based on:

```javascript
// In staffRoutes.js
const attendanceRole = formData.role || 
                      (staffType === 'Teachers' ? 'Teacher' : 'General Staff');
```

You can customize this logic in `backend/routes/staffRoutes.js` around line 1100.

### Disable Auto-Creation

If you want to disable automatic profile creation:

```javascript
// In staffRoutes.js, comment out this section:
/*
// ---- INITIALIZE ATTENDANCE PROFILE (NEW) ----
let attendanceError = null;
if (formData.name && globalStaffId) {
  // ... profile creation code
}
*/
```

---

## 🐛 Troubleshooting

### Profile Not Created for New Staff

**Check**:
1. Database connection is working
2. `staff_attendance_profiles` table exists
3. Backend logs for errors

**Solution**:
```bash
# Check backend logs
tail -f backend/logs/server.log

# Manually create profile
curl -X POST http://localhost:5000/api/staff-attendance/migrate-existing-staff
```

### Existing Staff Can't Access Attendance

**Problem**: Staff added before attendance system was set up

**Solution**: Run migration
```bash
node backend/scripts/setup-staff-attendance.js
```

### Duplicate Profile Error

**Problem**: Profile already exists

**Solution**: This is normal! The system uses `ON CONFLICT DO NOTHING` to prevent duplicates.

---

## 📈 Migration Statistics

After running the setup script, you'll see:

```
🚀 Starting Staff Attendance System Setup...

📋 Step 1: Creating database tables...
  ✓ staff_attendance table created
  ✓ staff_attendance_profiles table created
  ✓ staff_attendance_pending table created
  ✓ staff_attendance_logs table created

📊 Step 2: Creating indexes...
  ✓ All indexes created

⚙️  Step 3: Creating triggers and functions...
  ✓ Triggers created

👁️  Step 4: Creating views...
  ✓ daily_attendance_summary view created
  ✓ staff_attendance_history view created

👥 Step 5: Migrating existing staff...
  ✓ Migrated: John Doe (Teacher)
  ✓ Migrated: Jane Smith (General Staff)
  
  📊 Migration Summary:
     • Migrated: 25 staff members
     • Skipped: 0 (already existed)

✅ Step 6: Verifying setup...
  ✓ Found 4 attendance tables:
     • staff_attendance
     • staff_attendance_logs
     • staff_attendance_pending
     • staff_attendance_profiles
  ✓ Total staff profiles: 25

🎉 Setup completed successfully!
```

---

## 🔐 Security

### Automatic Profile Creation

- Only creates profiles for staff with valid `global_staff_id` and `name`
- Uses database transactions to ensure data consistency
- Prevents duplicates with `ON CONFLICT DO NOTHING`
- Logs all creation attempts

### Data Privacy

- Attendance profiles only store: ID, Name, Role
- No sensitive information in profiles
- Actual attendance records stored separately
- Full audit trail in `staff_attendance_logs`

---

## 📚 API Endpoints

### Get Staff Profile

```bash
GET /api/staff-attendance/profile/:staffId

Response:
{
  "success": true,
  "profile": {
    "id": 1,
    "staff_id": "T001",
    "staff_name": "John Doe",
    "role": "Teacher",
    "is_active": true,
    "created_at": "2026-01-29T08:00:00Z"
  }
}
```

### Migrate Existing Staff

```bash
POST /api/staff-attendance/migrate-existing-staff

Response:
{
  "success": true,
  "message": "Migration completed. 25 staff profiles created.",
  "migratedCount": 25,
  "errors": []
}
```

---

## ✅ Checklist

- [ ] Run setup script: `node backend/scripts/setup-staff-attendance.js`
- [ ] Verify tables created: Check database
- [ ] Restart backend server
- [ ] Test with new staff creation
- [ ] Verify existing staff can access attendance
- [ ] Check admin can view records

---

## 🎉 Summary

**The attendance system now works automatically!**

- ✅ New staff → Attendance profile created automatically
- ✅ Existing staff → One-time migration script
- ✅ No manual setup required
- ✅ Works immediately after staff creation

Just run the setup script once, and you're done! All future staff additions will automatically include attendance profiles.

---

## 📞 Support

If you encounter issues:

1. Check backend logs
2. Verify database connection
3. Run setup script again
4. Check API endpoints are working
5. Review error messages in console

For detailed documentation, see:
- `STAFF_ATTENDANCE_SYSTEM.md` - Complete system documentation
- `STAFF_ATTENDANCE_QUICK_START.md` - Quick start guide
- `WHERE_TO_FIND_ATTENDANCE.md` - Navigation guide
