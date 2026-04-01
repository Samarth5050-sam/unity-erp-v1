@echo ON
title Unity ERP Diagnostic Tool
echo ===================================================
echo      Unity ERP Diagnostic Tool
echo ===================================================
echo.

echo [1] Checking Backend (Port 5000)...
netstat -ano | findstr :5000 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] Backend is listening on port 5000.
) else (
    echo [ERROR] Backend is NOT running or not listening on port 5000.
)

echo.
echo [2] Checking Frontend (Port 5173)...
netstat -ano | findstr :5173 | findstr LISTENING >nul
if %errorlevel% equ 0 (
    echo [OK] Frontend is listening on port 5173.
) else (
    echo [ERROR] Frontend is NOT running or not listening on port 5173.
    echo         This is why you see "Connection Refused".
)

echo.
echo [3] Connectivity Check...
ping -n 1 127.0.0.1 >nul
if %errorlevel% equ 0 (
    echo [OK] Localhost (127.0.0.1) is reachable.
) else (
    echo [ERROR] Cannot reach 127.0.0.1. Check your network adapter.
)

echo.
echo ===================================================
echo If you see [ERROR], please run start_safe.bat 
echo and check the "Unity Frontend" window for errors.
echo ===================================================
pause
