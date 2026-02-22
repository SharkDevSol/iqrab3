@echo off
echo ========================================
echo   Your IP Address
echo ========================================
echo.
ipconfig | findstr /i "IPv4"
echo.
echo Look for the IP under "Wireless LAN adapter Wi-Fi"
echo It should look like: 192.168.x.x
echo.
echo Use this IP on your phone!
echo.
pause
