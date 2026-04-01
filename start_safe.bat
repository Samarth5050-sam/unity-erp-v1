@echo off
setlocal
title Unity ERP Launcher

echo ===================================================
echo      Starting Unity ERP (Safe Mode)
echo ===================================================

:: Check for Node.js
echo.
echo [1/5] Checking Environment...
node -v >node_version.txt
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)
set /p NODE_VER=<node_version.txt
echo    Detected Node.js %NODE_VER%
del node_version.txt

:: Check for Busy Ports (5000 and 5173)
echo.
echo [2/5] Checking Port Availability...
netstat -ano | findstr :5000 >nul
if %errorlevel% equ 0 (
    echo [FIXING] Port 5000 is occupied. Attempting to clear the network port...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /F /PID %%a >nul 2>&1
)

netstat -ano | findstr :5173 >nul
if %errorlevel% equ 0 (
    echo [FIXING] Port 5173 is occupied. Attempting to clear the network port...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /F /PID %%a >nul 2>&1
)

:: Backend
echo.
echo [3/5] Starting Backend Server...
if not exist "backend\node_modules" (
    echo    [DEBUG] Missing node_modules. Installing backend dependencies...
    cd backend && call npm install && cd ..
)
start "Unity Backend" cmd /k "echo Starting Backend... && cd backend && npm run dev || (echo. && echo [CRITICAL] Backend failed to start. && pause)"

:: Frontend
echo.
echo [4/5] Starting Frontend Server...
if not exist "frontend\node_modules" (
    echo    [DEBUG] Missing node_modules. Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)
start "Unity Frontend" cmd /k "echo Starting Frontend... && cd frontend && npm run dev || (echo. && echo [CRITICAL] Frontend failed to start. && pause)"

:: Open Browser and Show Info
echo.
echo [5/5] Finalizing Access...
timeout /t 5 >nul

:: Detect IP (Simple Windows method)
for /f "tokens=4" %%a in ('route print ^| findstr 0.0.0.0 ^| findstr /v "255.255.255.255"') do set "LOCAL_IP=%%a"

echo.
echo ===================================================
echo      Unity ERP Status Check
echo ===================================================
echo      Primary Link (UI): http://127.0.0.1:5173
echo      Secondary Link:    http://localhost:5173
echo      Network Access:    http://%LOCAL_IP%:5173
echo.
echo      [DIAGNOSTIC] If the browser shows "Refused to connect":
echo      - Keep the "Unity Frontend" command window open.
echo      - If it closed, check for errors in that window.
echo ===================================================
echo.
start http://127.0.0.1:5173

echo Press any key to close this launcher.
echo (Servers will continue running in their own windows)
pause >nul
