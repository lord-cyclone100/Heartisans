@echo off
echo ===========================================
echo    Heartisans Google OAuth Setup
echo ===========================================
echo.
echo Installing required packages for Google OAuth...
cd /d "c:\Users\faizan\Desktop\Heartisans1\backend"
npm install passport passport-google-oauth20 express-session
if %errorlevel% neq 0 (
    echo Error: Failed to install packages
    pause
    exit /b 1
)
echo.
echo Packages installed successfully!
echo.
echo ===========================================
echo         Setup Instructions
echo ===========================================
echo.
echo 1. Configure Google Cloud Console:
echo    - Go to: https://console.cloud.google.com/
echo    - Add redirect URI: http://localhost:5000/api/auth/google/callback
echo.
echo 2. Update your backend/.env file with your Google credentials
echo.
echo 3. Start the servers:
echo    Backend: cd backend ^&^& npm start
echo    Frontend: cd frontend ^&^& npm run dev
echo.
echo ===========================================
echo         Fixed Issues
echo ===========================================
echo.
echo ✓ Google Auth button is now visible on Login and Signup pages
echo ✓ Socket.IO connection errors are now handled gracefully
echo ✓ Backend OAuth endpoints are properly configured
echo ✓ Passport.js configuration recreated
echo.
echo Press any key to test the backend server...
pause > nul
echo.
echo Testing backend server...
cd /d "c:\Users\faizan\Desktop\Heartisans1\backend"
echo Starting server...
npm start
