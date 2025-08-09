#!/bin/bash

# 🧪 Vercel Auto-Deployment Test Script
# ใช้สำหรับทดสอบว่าระบบ auto-deploy ทำงานได้หรือไม่

echo "🚀 Testing Vercel Auto-Deployment..."
echo "======================================"

# สร้าง timestamp
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

# สร้างไฟล์ test
echo "// Auto-deployment test - $TIMESTAMP" > "test-deployment-$TIMESTAMP.txt"
echo "Test executed at: $(date)" >> "test-deployment-$TIMESTAMP.txt"

# Git operations
echo "📝 Adding test file..."
git add "test-deployment-$TIMESTAMP.txt"

echo "💾 Creating commit..."
git commit -m "test: auto-deployment verification - $TIMESTAMP"

echo "🌐 Pushing to main branch..."
git push origin main

echo ""
echo "✅ Test commit pushed to main branch!"
echo "📊 Check Vercel Dashboard for deployment status:"
echo "   https://vercel.com/dashboard"
echo ""
echo "🔍 Monitor deployment progress:"
echo "   1. Go to your project in Vercel Dashboard"
echo "   2. Click on 'Deployments' tab"
echo "   3. Watch for new deployment with message:"
echo "      'test: auto-deployment verification - $TIMESTAMP'"
echo ""
echo "⏱️  Expected deployment time: 2-3 minutes"
echo "🌐 Check website: https://chiangmaiusedcar.com"

# Cleanup old test files (เก็บแค่ 5 ไฟล์ล่าสุด)
echo ""
echo "🧹 Cleaning up old test files..."
ls -t test-deployment-*.txt 2>/dev/null | tail -n +6 | xargs -r rm
echo "✅ Cleanup completed"
