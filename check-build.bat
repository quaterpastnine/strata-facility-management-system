@echo off
echo 🔍 Starting Production Build Check for Vercel...
echo ==================================
echo.

echo 📝 Checking TypeScript compilation...
call npx tsc --noEmit --pretty

if %errorlevel% neq 0 (
    echo ❌ TypeScript compilation failed - fix errors above
    exit /b 1
) else (
    echo ✅ TypeScript compilation successful
)

echo.
echo 🏗️  Running production build...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Production build failed - check errors above
    exit /b 1
) else (
    echo ✅ Production build successful!
    echo.
    echo 🚀 Ready for Vercel deployment!
    echo.
    echo Next steps:
    echo 1. Commit all changes: git add . ^&^& git commit -m "Ready for production"
    echo 2. Push to GitHub: git push
    echo 3. Deploy to Vercel: vercel --prod
)
