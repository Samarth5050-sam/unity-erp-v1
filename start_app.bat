@echo off
echo Starting Unity ERP...

echo Clearing old network ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000 "') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173 "') do taskkill /F /PID %%a >nul 2>&1

echo Starting Backend on port 5000...
start "Unity Backend" cmd /k "cd backend && npm run dev"

echo Starting Frontend on port 5173...
start "Unity Frontend" cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Frontend will be available at http://localhost:5173
echo Backend will be available at http://localhost:5000

