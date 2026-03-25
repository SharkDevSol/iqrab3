@echo off
echo ========================================
echo Adding G.S Subject and Class Mappings
echo ========================================
echo.

REM Set PostgreSQL connection details
set PGHOST=localhost
set PGPORT=5432
set PGDATABASE=skoolific_db
set PGUSER=postgres

REM Prompt for password
set /p PGPASSWORD="Enter PostgreSQL password: "

echo.
echo Executing SQL script...
echo.

REM Execute the SQL script
psql -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDATABASE% -f ADD_GS_SUBJECT.sql

echo.
echo ========================================
echo Script execution completed!
echo ========================================
echo.
pause
