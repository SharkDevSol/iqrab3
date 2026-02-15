@echo off
echo ========================================
echo KILLING PROCESS ON PORT 7788
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -File backend\kill-port-7788.ps1

echo.
echo Done!
echo.
pause
