# Staff Attendance System - Quick Reference Card

## 🚀 Setup (One Time)

```bash
cd backend
npm run setup:attendance
npm start
```

## 📍 Access Points

| User | URL | Menu Item |
|------|-----|-----------|
| Staff | `/staff/my-attendance` | "My Attendance" |
| Admin | `/attendance-records` | "Attendance Records" |

## 🔑 Key Features

- ✅ **Automatic**: Profiles created when staff is added
- ✅ **Two-Step**: Teachers get verification
- ✅ **Single-Step**: General staff get quick access
- ✅ **Reports**: Admin can export CSV

## 👥 User Flows

### Teacher
```
Clock In (Step 1) → Confirm Arrival (Step 2) → Clock Out
```

### General Staff
```
Clock In → Clock Out
```

### Admin
```
Attendance Records → Filter → Export CSV
```

## 🛠️ API Endpoints

```
POST /api/staff-attendance/clock-in/step1
POST /api/staff-attendance/clock-in/step2
POST /api/staff-attendance/clock-out
GET  /api/staff-attendance/status/:staffId
GET  /api/staff-attendance/records
GET  /api/staff-attendance/summary
```

## 📊 Database Tables

- `staff_attendance_profiles` - Staff profiles (auto-created)
- `staff_attendance` - Daily records
- `staff_attendance_pending` - Teacher verification
- `staff_attendance_logs` - Audit trail

## ✅ Verification

```bash
# Check tables
psql -U user -d db -c "\dt staff_attendance*"

# Check profiles
psql -U user -d db -c "SELECT COUNT(*) FROM staff_attendance_profiles;"

# Test API
curl http://localhost:5000/api/staff-attendance/profile/T001
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Setup fails | Check database connection |
| No profiles | Run `npm run setup:attendance` |
| Can't access | Check staff has profile |
| Verification expires | Complete within 10 minutes |

## 📚 Documentation

- `SETUP_COMPLETE.md` - This guide
- `STAFF_ATTENDANCE_SYSTEM.md` - Full docs
- `WHERE_TO_FIND_ATTENDANCE.md` - Navigation

## 🎯 Summary

**Setup**: One command
**Maintenance**: Zero
**Per Staff**: Automatic

```bash
npm run setup:attendance
```

Done! 🎉
