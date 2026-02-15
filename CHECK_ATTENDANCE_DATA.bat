@echo off
echo ========================================
echo   CHECKING ATTENDANCE DATA
echo ========================================
echo.
echo This will show what's actually in the database...
echo.

cd backend

echo Running database query...
echo.

node -e "const { Pool } = require('pg'); require('dotenv').config(); const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query('SELECT staff_id, staff_name, ethiopian_year, ethiopian_month, ethiopian_day, check_in, status FROM hr_ethiopian_attendance WHERE ethiopian_month = 6 AND ethiopian_year = 2018 ORDER BY ethiopian_day, staff_id').then(result => { console.log('========================================'); console.log('ATTENDANCE RECORDS IN DATABASE:'); console.log('========================================'); if (result.rows.length === 0) { console.log('NO RECORDS FOUND!'); console.log(''); console.log('This means:'); console.log('1. Backend did not save the attendance'); console.log('2. Or wrong month/year selected'); console.log('3. Or staff verification failed'); } else { result.rows.forEach(r => { console.log(''); console.log('Staff ID:', r.staff_id); console.log('Staff Name:', r.staff_name); console.log('Date:', r.ethiopian_month + '/' + r.ethiopian_day + '/' + r.ethiopian_year); console.log('Check-in:', r.check_in); console.log('Status:', r.status); console.log('---'); }); } console.log('========================================'); console.log('Total Records:', result.rows.length); console.log('========================================'); pool.end(); }).catch(err => { console.error('Error:', err.message); });"

echo.
echo.
echo Press any key to close...
pause >nul
