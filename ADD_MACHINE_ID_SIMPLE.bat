@echo off
echo Adding machine_id column to staff tables...
echo.

REM Get database connection details from .env file
for /f "tokens=1,2 delims==" %%a in ('type backend\.env ^| findstr DATABASE_URL') do set %%a=%%b

echo Connecting to database...
echo.

REM Create a temporary SQL file
echo -- Add machine_id to supportive staff > temp_add_machine_id.sql
echo ALTER TABLE staff_supportive_staff."supportive" ADD COLUMN IF NOT EXISTS machine_id VARCHAR(50) UNIQUE; >> temp_add_machine_id.sql
echo. >> temp_add_machine_id.sql
echo -- Add machine_id to administrative staff >> temp_add_machine_id.sql
echo ALTER TABLE staff_administrative_staff."administrative" ADD COLUMN IF NOT EXISTS machine_id VARCHAR(50) UNIQUE; >> temp_add_machine_id.sql
echo. >> temp_add_machine_id.sql
echo -- Verify >> temp_add_machine_id.sql
echo SELECT table_schema, table_name, column_name FROM information_schema.columns WHERE column_name = 'machine_id' AND table_schema LIKE 'staff%%'; >> temp_add_machine_id.sql

echo SQL commands created in temp_add_machine_id.sql
echo.
echo Please run this file in your PostgreSQL database client (pgAdmin, DBeaver, etc.)
echo.
echo OR use psql command:
echo psql "%DATABASE_URL%" -f temp_add_machine_id.sql
echo.
pause
