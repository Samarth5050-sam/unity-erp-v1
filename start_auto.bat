@echo off
echo Starting Unity ERP (Automatic Setup)...

echo Clearing old network ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /F /PID %%a >nul 2>&1

echo Starting Backend (SQLite)...
start "Unity Backend" cmd /k "cd backend && npm run dev"

echo Waiting for Backend to initialize...
timeout /t 5

echo Starting Frontend (Network Exposed)...
start "Unity Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Frontend: http://localhost:5173 (and on network)
echo Backend: http://localhost:5000
