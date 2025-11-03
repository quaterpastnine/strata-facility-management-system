@echo off
echo.
echo ========================================
echo    VERCEL FORCE DEPLOYMENT
echo ========================================
echo.

echo Checking git status...
git status

echo.
echo Creating cache-busting commit...
git add .
git commit --allow-empty -m "Force Vercel rebuild - cache clear"
git push origin main

echo.
echo ========================================
echo Deployment triggered!
echo.
echo Now do the following:
echo 1. Go to https://vercel.com/dashboard
echo 2. Watch the build logs
echo 3. If still showing old version:
echo    - Click project Settings
echo    - Go to Environment Variables  
echo    - Add CACHE_VERSION = %date%_%time%
echo    - Redeploy without cache
echo ========================================
pause
