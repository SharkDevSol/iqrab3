@echo off
echo ============================================
echo Update Machine IP in Database
echo From: 192.168.1.201
echo To:   192.168.1.2
echo ============================================
echo.

echo Running SQL update script...
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d school_management2 -f UPDATE_MACHINE_IP_SAFE.sql

echo.
echo ============================================
echo Update Complete!
echo ============================================
echo.
echo This script is safe to run multiple times.
echo It will only update records that exist.
echo.
echo Press any key to exit...
pause >nul
