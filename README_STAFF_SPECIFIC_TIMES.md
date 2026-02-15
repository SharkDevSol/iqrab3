# 📖 README: Staff-Specific Time Settings

## 🎯 Overview

The **Staff-Specific Time Settings** feature allows you to configure custom work hours for individual staff members that override the global attendance time settings. This is essential for managing staff with different schedules such as night shifts, part-time workers, or flexible arrangements.

---

## ✨ Features

- ✅ Configure custom work hours for individual staff
- ✅ Override global attendance time settings
- ✅ Support for night shifts, part-time, and flexible schedules
- ✅ Color-coded time badges for visual clarity
- ✅ Easy-to-use modal interface
- ✅ Staff selection from all types (Teachers, Administrative, Supportive)
- ✅ Optional notes for each configuration
- ✅ Delete functionality with confirmation
- ✅ Responsive design for all devices

---

## 📍 Quick Access

**Navigation**: HR Module → Attendance → Time Settings → Scroll Down

**Look For**: "👤 Staff-Specific Time Settings" section

**Button**: Green "➕ Add Staff-Specific Time" button

---

## 🚀 Quick Start

### 1. Navigate to Time Settings
```
Home → HR → Attendance → Time Settings
```

### 2. Scroll Down
Scroll past the global settings to find the staff-specific section.

### 3. Add Staff-Specific Time
1. Click "➕ Add Staff-Specific Time"
2. Select staff member
3. Configure times and thresholds
4. Add optional note
5. Click "💾 Save"

### 4. Verify
Check that the entry appears in the table with color-coded badges.

---

## 📚 Documentation Files

### Getting Started:
- **START_HERE_STAFF_SPECIFIC_TIMES.md** - Quick start guide (2 minutes)
- **WHERE_TO_FIND_STAFF_SPECIFIC_TIMES.md** - Navigation and visual guide

### Complete Documentation:
- **STAFF_SPECIFIC_TIME_SETTINGS_COMPLETE.md** - Full feature documentation
- **TASK_10_STAFF_SPECIFIC_TIMES_COMPLETE.md** - Implementation details

### Testing:
- **QUICK_TEST_STAFF_SPECIFIC_TIMES.md** - Step-by-step testing guide

### Summary:
- **FINAL_TASK_10_SUMMARY.md** - Complete summary and overview
- **CONVERSATION_CONTINUATION_TASK_10_SUMMARY.md** - Context and history

---

## 🎨 Visual Guide

### Color Coding:
- 🟢 **Green Badge**: Check-in time (when staff should arrive)
- 🟠 **Orange Badge**: Late threshold (when staff is marked late)
- 🌸 **Pink Badge**: Check-out time (when staff should leave)
- 🔵 **Blue Badge**: Staff type (Teachers, Administrative, Supportive)

### UI Components:
1. **Section Header**: Title and description
2. **Add Button**: Green button to open modal
3. **Empty State**: Friendly message when no data
4. **Table**: List of all staff-specific times
5. **Modal**: Form to add/update staff-specific time
6. **Delete Button**: Red button to remove entry

---

## 💡 Use Cases

### Night Shift Worker
```yaml
Staff: Security Guard
Check-In: 20:00 (8 PM)
Late Threshold: 20:15
Check-Out: 04:00 (4 AM)
Minimum Hours: 8
Notes: "Night shift security"
```

### Part-Time Staff
```yaml
Staff: Part-Time Teacher
Check-In: 09:00
Late Threshold: 09:15
Check-Out: 13:00
Minimum Hours: 4
Half Day Threshold: 2
Notes: "Morning classes only"
```

### Flexible Schedule
```yaml
Staff: Manager
Check-In: 10:00
Late Threshold: 10:30
Check-Out: 18:00
Minimum Hours: 7.5
Grace Period: 30 minutes
Notes: "Flexible schedule approved"
```

---

## 🔧 Technical Details

### Backend:
- **File**: `backend/routes/hr/attendance.js`
- **Endpoints**: 4 new REST API endpoints
- **Database**: `hr_staff_specific_times` table
- **Features**: CRUD operations with UPSERT

### Frontend:
- **File**: `APP/src/PAGE/HR/AttendanceTimeSettings.jsx`
- **Components**: Modal, table, empty state
- **Features**: Staff selection, form validation, color-coded badges

### Database Schema:
```sql
CREATE TABLE hr_staff_specific_times (
  id UUID PRIMARY KEY,
  staff_id VARCHAR(255) UNIQUE,
  staff_name VARCHAR(255),
  staff_type VARCHAR(255),
  check_in_time TIME,
  check_out_time TIME,
  late_threshold TIME,
  minimum_work_hours DECIMAL(4,2),
  half_day_threshold DECIMAL(4,2),
  grace_period_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

---

## 📊 API Endpoints

### 1. Get All Staff-Specific Times
```
GET /api/hr/attendance/staff-specific-times
Authorization: Bearer {token}
```

### 2. Create/Update Staff-Specific Time
```
POST /api/hr/attendance/staff-specific-times
Authorization: Bearer {token}
Body: {
  staffId, staffName, staffType,
  checkInTime, checkOutTime, lateThreshold,
  minimumWorkHours, halfDayThreshold,
  gracePeriodMinutes, notes
}
```

### 3. Delete Staff-Specific Time
```
DELETE /api/hr/attendance/staff-specific-times/:id
Authorization: Bearer {token}
```

### 4. Get Time Settings for Staff
```
GET /api/hr/attendance/staff-time-settings/:staffId
Authorization: Bearer {token}
```

---

## ✅ Testing

### Quick Test (5 minutes):
1. Navigate to Time Settings
2. Scroll to Staff-Specific section
3. Click "Add Staff-Specific Time"
4. Select staff and configure times
5. Save and verify entry appears
6. Delete entry and verify removal

### Detailed Testing:
See **QUICK_TEST_STAFF_SPECIFIC_TIMES.md** for 10 comprehensive test scenarios.

---

## 🐛 Troubleshooting

### Can't find the section?
- Verify you're on **Time Settings** page
- **Scroll down** past global settings
- Look for "👤 Staff-Specific Time Settings" header

### Staff dropdown is empty?
- Check if staff data exists
- Verify backend server is running
- Check browser console for errors

### Save button doesn't work?
- Fill all required fields
- Check browser console
- Verify backend connection

### Entry doesn't appear?
- Check for success alert
- Refresh the page
- Check Network tab for API response

---

## 🎯 Best Practices

### When to Use:
- ✅ Night shift workers with different hours
- ✅ Part-time staff with reduced schedules
- ✅ Flexible schedules for specific roles
- ✅ Different departments with varying hours

### When NOT to Use:
- ❌ Temporary schedule changes (use leave management instead)
- ❌ One-time exceptions (use attendance notes instead)
- ❌ Entire department changes (update global settings instead)

### Tips:
- 💡 Add descriptive notes for each configuration
- 💡 Review and update settings regularly
- 💡 Test attendance marking after adding settings
- 💡 Keep global settings as the default for most staff

---

## 📈 Statistics

| Metric | Value |
|--------|-------|
| Backend Lines | ~200 |
| Frontend Lines | ~400 |
| Total Lines | ~600 |
| API Endpoints | 4 |
| Database Tables | 1 |
| UI Components | 3 |
| Documentation Files | 7 |
| Test Scenarios | 10 |

---

## 🔄 How It Works

### Priority System:
1. **Staff-Specific Settings** (highest priority)
   - If staff has specific time setting, use it
   - Overrides global settings completely

2. **Global Settings** (fallback)
   - If no staff-specific setting, use global
   - Applies to all staff without specific config

### Attendance Marking:
```
Check Staff ID
  ↓
Query staff-specific times
  ↓
Found? → Use staff-specific times
  ↓
Not Found? → Use global settings
  ↓
Calculate status (PRESENT, LATE, HALF_DAY, ABSENT)
```

---

## 🎓 Learning Resources

### For Users:
1. **START_HERE_STAFF_SPECIFIC_TIMES.md** - Quick start (2 min)
2. **WHERE_TO_FIND_STAFF_SPECIFIC_TIMES.md** - Navigation guide
3. **QUICK_TEST_STAFF_SPECIFIC_TIMES.md** - Testing guide

### For Developers:
1. **STAFF_SPECIFIC_TIME_SETTINGS_COMPLETE.md** - Technical docs
2. **TASK_10_STAFF_SPECIFIC_TIMES_COMPLETE.md** - Implementation details
3. **CONVERSATION_CONTINUATION_TASK_10_SUMMARY.md** - Context

### For Managers:
1. **FINAL_TASK_10_SUMMARY.md** - Executive summary
2. **README_STAFF_SPECIFIC_TIMES.md** - This file

---

## 🎉 Success Criteria

The feature is working correctly if:

- ✅ Can navigate to staff-specific times section
- ✅ Can add staff-specific time settings
- ✅ Can view all staff-specific times in table
- ✅ Can delete staff-specific times
- ✅ Staff dropdown shows all staff members
- ✅ Color-coded badges display correctly
- ✅ Empty state shows when no data
- ✅ Loading states work properly
- ✅ Success/error alerts display
- ✅ Modal opens and closes correctly
- ✅ Form validation prevents errors
- ✅ Responsive on all devices

---

## 📞 Support

### Need Help?
1. Check the documentation files listed above
2. Review the troubleshooting section
3. Check browser console for errors
4. Verify backend server is running

### Common Issues:
- **Can't find section**: Scroll down on Time Settings page
- **Empty dropdown**: Check if staff data exists
- **Save fails**: Fill all required fields
- **Entry missing**: Refresh page and check console

---

## 🚀 Next Steps

### For Users:
1. Test the feature with the quick start guide
2. Add staff-specific times for your staff
3. Verify attendance marking uses correct settings

### For Developers:
1. Review the implementation details
2. Test all API endpoints
3. Verify database operations
4. Check responsive design

### For Managers:
1. Review the feature documentation
2. Plan rollout to users
3. Train staff on usage
4. Monitor adoption and feedback

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 9, 2026 | Initial release |

---

## 📄 License

This feature is part of the HR Attendance Management System.

---

## 🙏 Acknowledgments

- Implemented as part of Task 10
- Continuation from previous HR attendance tasks
- Built with React, Node.js, PostgreSQL

---

## 📧 Contact

For questions or issues, please refer to the documentation files or check the browser console for error messages.

---

**Quick Access**: HR → Attendance → Time Settings → Scroll Down → "👤 Staff-Specific Time Settings"

**Status**: ✅ COMPLETE AND READY TO USE

**Last Updated**: February 9, 2026
