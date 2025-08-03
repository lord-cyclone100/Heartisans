@echo off
echo Testing Google OAuth endpoints...
echo.
echo 1. Starting backend server in background...
cd /d "c:\Users\faizan\Desktop\Heartisans1\backend"
start "Backend Server" cmd /k "npm start"
echo.
echo 2. Waiting for server to start...
timeout /t 5 /nobreak > nul
echo.
echo 3. Testing endpoints...
echo.
echo Testing /api/auth/google endpoint:
curl -i http://localhost:5000/api/auth/google
echo.
echo.
echo 4. Testing health check:
curl -i http://localhost:5000/
echo.
echo.
echo If you see redirect responses above, the backend is working correctly!
echo Now you can test the Google OAuth button in your browser.
echo.
pause
