# Attendance Tab Replacement Instructions

## File to Edit
`APP/src/COMPONENTS/StaffProfile.jsx`

## What to Do

1. **Find the function** `renderAttendanceTab` (around line 1921)

2. **Replace the ENTIRE function** from:
```javascript
const renderAttendanceTab = () => (
  <div className={styles.attendanceContainer}>
    ... (all the old attendance code)
  </div>
);
```

3. **With this NEW simple function**:
```javascript
const renderAttendanceTab = () => {
  // Return the new Student Attendance System with pre-selected class
  return <StudentAttendanceSystem preSelectedClass={assignedClass} />;
};
```

4. **Make sure the import is added** at the top of the file (I already added it):
```javascript
import StudentAttendanceSystem from '../PAGE/Academic/StudentAttendanceSystem';
```

## Result
This will replace the old purple attendance interface with the new modern student attendance system that automatically uses the teacher's assigned class.

## To Apply Manually
1. Open `APP/src/COMPONENTS/StaffProfile.jsx`
2. Search for `const renderAttendanceTab`
3. Delete everything from `const renderAttendanceTab = () => (` until the closing `);` before `const renderEvalBookTab`
4. Replace with the 3-line function above
5. Save the file
6. Refresh your browser with Ctrl+Shift+R
