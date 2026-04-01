@echo off
title Unity ERP System
color 0B
echo ===================================================
echo               UNITY ERP SYSTEM
echo ===================================================
echo.
echo Starting up all services... Please wait...

:: Kill any existing background processes blocking ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /F /PID %%a >nul 2>&1

:: Start backend in a completely minimized process
echo [1/2] Starting Database Server...
start "Unity Backend" /min cmd /c "cd backend && node server.js"

:: Start frontend in a completely minimized process
echo [2/2] Starting User Interface...
start "Unity UI" /min cmd /c "cd frontend && npm run dev"

echo.
echo System started successfully!
echo Opening dashboard in your default browser...
timeout /t 4 /nobreak >nul
start http://localhost:5173

echo.
echo ===================================================
echo  READY!
echo  You can safely close this window when done.
echo ===================================================
timeout /t 3 >nul
exit
