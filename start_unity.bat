@echo off
setlocal enabledelayedexpansion
title Unity ERP - Big Bang Launcher
echo ===================================================
echo      UNITY ERP - PREMIUM LAUNCHER v2.0
echo ===================================================
echo [1/3] Verifying Environment...

:: Check for node specifically in node_modules or common paths
set NODE_EXE=node
%NODE_EXE% -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [CRITICAL] Node.js not found in PATH. 
    echo Please ensure Node.js is installed.
    pause
    exit /b
)

echo [2/3] Preparing Servers...
:: Find local vite executable
set VITE_BIN=frontend\node_modules\.bin\vite.cmd
if not exist "!VITE_BIN!" (
    echo [DEBUG] Local Vite not found. Attempting install...
    cd frontend && call npm install && cd ..
)

echo [DEBUG] Clearing old network ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /F /PID %%a >nul 2>&1

:: Find local backend dev command
set BACKEND_ENTRY=backend\server.js

echo [3/3] Launching Unity ERP...

:: Start Backend
start "Unity Backend" cmd /k "echo Launching Backend... && cd backend && node server.js || (echo. && echo [FAIL] Backend Crashed. && pause)"

:: Start Frontend (using direct path to avoid PATH issues)
start "Unity Frontend" cmd /k "echo Launching UI... && cd frontend && node_modules\.bin\vite --host 0.0.0.0 --port 5173 || (echo. && echo [FAIL] UI Renderer Crashed. && pause)"

echo.
echo ===================================================
echo      UNITY ERP IS STARTING...
echo ===================================================
echo      Dashboard: http://127.0.0.1:5173
echo      Alternative: http://0.0.0.0:5173
echo.
echo      [INFO] Two black windows should be open now.
echo      If the browser shows "Refused to connect",
echo      check the "Unity Frontend" window for errors.
echo ===================================================
echo.
timeout /t 5 >nul
start http://127.0.0.1:5173

echo Launcher finished. Keep the other windows open.
pause
