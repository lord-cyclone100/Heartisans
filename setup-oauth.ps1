# Heartisans Google OAuth Setup Script
Write-Host "===========================================" -ForegroundColor Green
Write-Host "    Heartisans Google OAuth Setup" -ForegroundColor Green  
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# Change to backend directory
Write-Host "Installing required packages for Google OAuth..." -ForegroundColor Yellow
Set-Location "c:\Users\faizan\Desktop\Heartisans1\backend"

# Install packages
try {
    npm install passport passport-google-oauth20 express-session
    Write-Host "Packages installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Error: Failed to install packages" -ForegroundColor Red
    Write-Host "Please run the command manually: npm install passport passport-google-oauth20 express-session" -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "         Setup Instructions" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "1. Configure Google Cloud Console:" -ForegroundColor Yellow
Write-Host "   - Go to: https://console.cloud.google.com/" -ForegroundColor White
Write-Host "   - Add redirect URI: http://localhost:5000/api/auth/google/callback" -ForegroundColor White
Write-Host ""
Write-Host "2. Update your backend/.env file with your Google credentials" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Start the servers:" -ForegroundColor Yellow
Write-Host "   Backend: cd backend; npm start" -ForegroundColor White
Write-Host "   Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "===========================================" -ForegroundColor Green
Write-Host "         Fixed Issues" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Google Auth button is now visible on Login and Signup pages" -ForegroundColor Green
Write-Host "✓ Socket.IO connection errors are now handled gracefully" -ForegroundColor Green
Write-Host "✓ Backend OAuth endpoints are properly configured" -ForegroundColor Green
Write-Host "✓ Passport.js configuration recreated" -ForegroundColor Green
Write-Host ""

$choice = Read-Host "Do you want to start the backend server now? (y/n)"
if ($choice -eq "y" -or $choice -eq "Y") {
    Write-Host "Starting backend server..." -ForegroundColor Yellow
    npm start
} else {
    Write-Host "You can start the backend server manually with: npm start" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
}
