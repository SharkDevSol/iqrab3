@echo off
echo ========================================
echo Testing Student Attendance System
echo ========================================
echo.

echo Step 1: Checking if database table exists...
node -e "const pool = require('./backend/config/db'); pool.query('SELECT COUNT(*) FROM academic_student_attendance').then(r => console.log('✅ Table exists with', r.rows[0].count, 'records')).catch(e => console.log('❌ Error:', e.message)).finally(() => process.exit())"
echo.

echo Step 2: Testing API endpoint - Get Classes...
curl -s http://localhost:5000/api/academic/student-attendance/classes
echo.
echo.

echo Step 3: Testing API endpoint - Get Students...
curl -s "http://localhost:5000/api/academic/student-attendance/students"
echo.
echo.

echo ========================================
echo Test Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Add StudentAttendanceSystem page to your navigation
echo 2. Register students with smachine_id
echo 3. Test the weekly view
echo.
pause
