#!/bin/bash

# =========================================
# 🚀 Vercel Deployment Script
# =========================================

echo "🔧 Building production version..."

# ตรวจสอบว่ามี next build หรือไม่
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx not found. Please install Node.js"
    exit 1
fi

# Build production
echo "📦 Running production build..."
npm run build

# ตรวจสอบ build success
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Ready for Vercel deployment"
    echo ""
    echo "Next steps:"
    echo "1. Run: vercel --prod"
    echo "2. Configure domain: chiangmaiusedcar.com"
    echo "3. Set environment variables from vercel.json"
else
    echo "❌ Build failed! Please check errors above."
    exit 1
fi
