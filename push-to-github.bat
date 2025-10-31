@echo off
echo.
echo ========================================
echo    GITHUB PUSH SCRIPT
echo ========================================
echo.

REM Initialize git if needed
echo Initializing git repository...
git init

REM Add all files
echo.
echo Adding all files to git...
git add .

REM Commit
echo.
echo Committing changes...
git commit -m "Production-ready Strata Facility Management System with comment system, TypeScript fixes, and Vercel config"

REM Add remote (user needs to update this)
echo.
echo ========================================
echo IMPORTANT: Update the repository URL!
echo ========================================
echo.
echo Edit this file and replace YOUR_GITHUB_USERNAME with your actual GitHub username
echo.
REM git remote add origin https://github.com/YOUR_GITHUB_USERNAME/strata-facility-management-system.git

REM Push to GitHub
echo.
echo Ready to push. Run these commands:
echo.
echo 1. Add your remote:
echo    git remote add origin https://github.com/YOUR_USERNAME/strata-facility-management-system.git
echo.
echo 2. Push to GitHub:
echo    git branch -M main
echo    git push -u origin main
echo.
pause
