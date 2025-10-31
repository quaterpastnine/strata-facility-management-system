@echo off
cls
echo.
echo ========================================
echo    VERCEL PRODUCTION BUILD CHECK
echo ========================================
echo.

echo [Step 1/2] TypeScript Check...
call npx tsc --noEmit

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] TypeScript compilation failed
    pause
    exit /b 1
)

echo [OK] TypeScript check passed
echo.
echo [Step 2/2] Next.js Production Build...
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Build failed - see errors above
    pause
    exit /b 1
)

echo.
echo ========================================
echo    BUILD SUCCESSFUL!
echo ========================================
echo.
echo Your app is ready for Vercel deployment!
echo.
echo Deploy options:
echo 1. Push to GitHub (auto-deploy if connected)
echo 2. Run: vercel --prod
echo 3. Drag .next folder to Vercel dashboard
echo.
pause
