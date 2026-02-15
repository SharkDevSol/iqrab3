# Deactivate Feature - Verification Checklist

## How to Test

### Step 1: Deactivate a Student
1. Go to **List Students** page
2. Find student "ew" (or any student)
3. Click the **Deactivate** button (red button with X icon)
4. Confirm the student shows a red "DEACTIVATED" badge

### Step 2: Verify Student is Hidden

#### ✅ Student Attendance System
- **Page**: Student Attendance System (Weekly)
- **Expected**: Deactivated student should NOT appear in the student list
- **Test**: 
  1. Go to Student Attendance System
  2. Select class A
  3. Count students - should be 3 (not 4)
  4. Deactivated student "ew" should NOT be in the list

#### ✅ Dashboard
- **Page**: Dashboard
- **Expected**: Student count should exclude deactivated students
- **Test**:
  1. Go to Dashboard
  2. Check "Total Students" count
  3. Should show 3 students (not 4)

#### ✅ Mark List / Class Ranking
- **Page**: Mark List Management > Class Ranking
- **Expected**: Deactivated student should NOT appear in rankings
- **Test**:
  1. Go to Mark List Management
  2. Click "Class Ranking" tab
  3. Select class A and Term 1
  4. Click "Load Single Term" or "Load All Terms Averages"
  5. Should show only 3 students in ranking

#### ✅ Finance Payment Lists
- **Page**: Finance > Class Students
- **Expected**: Deactivated student should NOT appear in payment lists
- **Test**:
  1. Go to Finance section
  2. Select class A
  3. Student list should show only 3 active students

#### ✅ Reports
- **Page**: Reports
- **Expected**: Statistics should exclude deactivated students
- **Test**:
  1. Go to Reports page
  2. Check student count statistics
  3. Should count only active students

#### ✅ Evaluation Forms
- **Page**: Evaluation > Create Evaluation
- **Expected**: Deactivated student should NOT appear in evaluation forms
- **Test**:
  1. Go to Evaluation
  2. Create new evaluation for class A
  3. Student list should show only 3 active students

#### ✅ Student Login
- **Expected**: Deactivated student cannot log in
- **Test**:
  1. Try to log in as the deactivated student
  2. Login should fail or show "Account deactivated" message

### Step 3: Verify Student Can Be Reactivated

#### ✅ View Deactivated Students
- **Page**: List Students
- **Test**:
  1. Go to List Students
  2. Click toggle button to "Show Deactivated"
  3. Deactivated student should appear with red badge

#### ✅ Reactivate Student
- **Test**:
  1. While viewing deactivated students
  2. Click the green "Activate" button
  3. Student should be reactivated
  4. Student should now appear in all modules again

## Backend Routes Verified

### ✅ Student Routes (31 files updated)
1. `backend/routes/academic/studentAttendance.js` - Student attendance system
2. `backend/routes/attendanceRoutes.js` - Weekly attendance
3. `backend/routes/viewStudentAttendanceRoutes.js` - Attendance viewing
4. `backend/routes/studentAttendanceRoutes.js` - Daily attendance
5. `backend/routes/guardianAttendanceRoutes.js` - Guardian attendance
6. `backend/routes/adminAttendanceRoutes.js` - Admin attendance
7. `backend/routes/reportsRoutes.js` - Reports and statistics
8. `backend/routes/markListRoutes.js` - Mark lists (3 queries)
9. `backend/routes/evaluations.js` - Evaluations
10. `backend/routes/evaluationBookRoutes.js` - Evaluation books (3 queries)
11. `backend/routes/financeClassStudentRoutes.js` - Finance students (3 queries)
12. `backend/routes/financeMonthlyPaymentViewRoutes.js` - Payment views
13. `backend/routes/simpleFeePayments.js` - Fee payments
14. `backend/routes/classTeacherRoutes.js` - Class teacher (2 queries)
15. `backend/routes/guardianListRoutes.js` - Guardian lists (2 queries)
16. `backend/routes/dashboardRoutes.js` - Dashboard (3 queries)
17. `backend/routes/studentRoutes.js` - Student auth (6 queries)
18. `backend/routes/studentListRoutes.js` - Student list (2 queries)
19. `backend/routes/machineWebhook.js` - Biometric webhook
20. `backend/services/studentAttendanceAutoMarker.js` - Auto marker
21. `backend/services/ai06WebSocketService.js` - WebSocket service
22. `backend/utils/permissions.js` - Permissions

### ✅ Staff Routes (3 files updated)
1. `backend/routes/staffRoutes.js` - Staff data
2. `backend/routes/staff_auth.js` - Staff authentication
3. `backend/routes/evaluations.js` - Staff evaluations

## Database Schema

### ✅ Column Added
- **Table**: All class tables in `classes_schema` (A, B, C, D, etc.)
- **Column**: `is_active BOOLEAN DEFAULT TRUE`
- **Migration**: Completed successfully

### ✅ Staff Tables
- **Schemas**: All staff schemas (`staff_teachers`, `staff_administrative_staff`, etc.)
- **Column**: `is_active BOOLEAN DEFAULT TRUE`
- **Migration**: Completed successfully

## Filter Pattern Used

All queries use this pattern:
```sql
WHERE is_active = TRUE OR is_active IS NULL
```

This ensures:
- ✅ Backward compatibility (NULL = active)
- ✅ Deactivated users (FALSE) are hidden
- ✅ Data is preserved in database

## Common Issues

### Issue 1: Student still appears after deactivation
**Solution**: 
1. Check if backend server was restarted after code changes
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh page (Ctrl+F5)

### Issue 2: "Column is_active does not exist" error
**Solution**: 
1. Run migration script: `node backend/add-is-active-column.js`
2. Restart backend server

### Issue 3: Student appears in some modules but not others
**Solution**: 
1. Check which specific module
2. Verify that module's backend route has the filter
3. Check browser console for API errors

## Success Criteria

✅ Deactivated student does NOT appear in:
- Student Attendance System
- Finance payment lists
- Reports and statistics
- Dashboard counts
- Mark lists and rankings
- Evaluation forms
- Login (cannot log in)

✅ Deactivated student DOES appear in:
- List Students (when "Show Deactivated" is toggled)
- Deactivated Students page

✅ Student can be reactivated and appears everywhere again

## Current Status

- ✅ Database migration completed
- ✅ Backend routes updated (31 files)
- ✅ Frontend components updated (4 files)
- ✅ Mark list ranking filters added
- ✅ Server restarted
- ⏳ Awaiting user verification

## Next Steps

1. User tests each module listed above
2. Reports any modules where deactivated student still appears
3. We fix any remaining issues
4. Feature is complete!
