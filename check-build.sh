#!/bin/bash

# Production Build Check Script for Vercel Deployment
# This script checks for common issues before deploying to Vercel

echo "🔍 Starting Production Build Check..."
echo "=================================="

# Check 1: TypeScript Compilation
echo "📝 Checking TypeScript compilation..."
npx tsc --noEmit --pretty

if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript compilation failed - fix errors above"
    exit 1
fi

# Check 2: ESLint
echo ""
echo "🔍 Running ESLint..."
npm run lint

if [ $? -eq 0 ]; then
    echo "✅ ESLint check passed"
else
    echo "⚠️  ESLint warnings/errors found"
fi

# Check 3: Production Build
echo ""
echo "🏗️  Running production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Production build successful!"
    echo ""
    echo "📊 Build Output Summary:"
    echo "------------------------"
    
    # Check .next directory for build output
    if [ -d ".next" ]; then
        echo "✅ .next directory created"
        
        # Check for static pages
        if [ -d ".next/static" ]; then
            echo "✅ Static assets generated"
        fi
        
        # Check for server pages
        if [ -d ".next/server" ]; then
            echo "✅ Server pages generated"
        fi
    fi
    
    echo ""
    echo "🚀 Ready for Vercel deployment!"
else
    echo "❌ Production build failed - check errors above"
    exit 1
fi
