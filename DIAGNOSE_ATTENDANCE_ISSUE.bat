@echo off
echo ========================================
echo   ATTENDANCE DIAGNOSTIC TOOL
echo ========================================
echo.

cd backend

echo [1/4] Checking attendance records in database...
echo.
node -e "const { Pool } = require('pg'); require('dotenv').config(); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT staff_id, staff_name, ethiopian_year, ethiopian_month, ethiopian_day, check_in, status FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 ORDER BY ethiopian_day, staff_id').then(result => { console.log('ATTENDANCE RECORDS:'); console.log('=================='); if (result.rows.length === 0) { console.log('❌ NO RECORDS FOUND'); } else { result.rows.forEach(r => { console.log('Staff ID:', r.staff_id, '| Name:', r.staff_name, '| Date:', r.ethiopian_month + '/' + r.ethiopian_day + '/' + r.ethiopian_year, '| Status:', r.status); }); } console.log('Total:', result.rows.length, 'records'); console.log(''); return pool.query('SELECT staff_id, full_name FROM teachers WHERE LOWER(full_name) LIKE LOWER(%%ahmed%%)'); }).then(result => { console.log('[2/4] Checking Ahmed in teachers table...'); console.log('=========================================='); if (result.rows.length === 0) { console.log('❌ Ahmed NOT FOUND in teachers'); } else { result.rows.forEach(r => { console.log('✅ Found: Staff ID:', r.staff_id, '| Name:', r.full_name); }); } console.log(''); process.exit(0); }).catch(err => { console.error('Error:', err.message); process.exit(1); });"

echo.
echo [3/4] Open your browser and go to Attendance System page
echo [4/4] Press F12 and check console for these logs:
echo      - "📡 Fetching attendance for:"
echo      - "✅ Fetched attendance records:"
echo      - "📄 All records:"
echo      - "👥 Loaded staff:"
echo      - "📄 All staff IDs:"
echo      - "🔍 Day 3 - Looking for attendance:"
echo.
echo ========================================
echo   COMMON ISSUES:
echo ========================================
echo.
echo ISSUE 1: No attendance records in database
echo   → Backend didn't save (check backend console)
echo   → Staff not found in database
echo.
echo ISSUE 2: Staff ID mismatch
echo   → Attendance has staff_id: "1"
echo   → But Ahmed's actual staff_id is: "ahmed_001"
echo   → They don't match = no display
echo.
echo ISSUE 3: Frontend not fetching data
echo   → Check browser console for errors
echo   → Check authentication token
echo.
echo ========================================
echo.
pause
