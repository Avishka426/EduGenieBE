@echo off
echo ========================================
echo    EduGenie Backend Server Starter
echo ========================================
echo.
echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

echo.
echo Building TypeScript...
npm run build

if %errorlevel% neq 0 (
    echo.
    echo ❌ Build failed! Check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo.
echo 🎯 TypeScript compilation completed without errors!
echo 📦 All dependencies are properly configured!
echo.
echo Starting development server...
echo.
echo 🚀 Server will start on http://localhost:3000
echo 📊 Health check: http://localhost:3000/health
echo 📖 API docs: http://localhost:3000/api
echo.
echo ⚡ Ready for development! The server will auto-restart on file changes.
echo 🛑 Press Ctrl+C to stop the server
echo.
npm run dev
