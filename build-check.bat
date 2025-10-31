@echo off
echo.
echo =====================================
echo   Production Build Check for Vercel
echo =====================================
echo.

echo [1/3] TypeScript Compilation Check...
echo --------------------------------------
call npx tsc --noEmit --pretty

if %errorlevel% neq 0 (
    echo.
    echo [X] TypeScript compilation failed
    echo     Fix the errors above before deploying
    exit /b 1
) else (
    echo [OK] TypeScript compilation successful
)

echo.
echo [2/3] Running Production Build...
echo ---------------------------------
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [X] Production build failed
    echo     Check errors above
    exit /b 1
) else (
    echo.
    echo [OK] Production build successful!
)

echo.
echo [3/3] Deployment Ready Status
echo ------------------------------
echo [OK] TypeScript: No errors
echo [OK] Build: Success
echo [OK] Ready for Vercel deployment
echo.
echo Next Steps:
echo -----------
echo 1. Commit changes: git add . && git commit -m "Fixed TypeScript errors"
echo 2. Push to GitHub: git push
echo 3. Deploy: vercel --prod
echo.
echo Or deploy directly from Vercel dashboard after pushing to GitHub
echo.
