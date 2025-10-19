#!/bin/bash

# Deploy Script with Admin Security
# สคริปต์ deploy ที่มีระบบความปลอดภัย Admin

echo "🚀 Starting deployment with Admin security..."

# 1. Build the project
echo "📦 Building project..."
pnpm build

# 2. Check if admin routes are protected
echo "🔒 Checking admin security..."

# Check robots.txt
if grep -q "Disallow: /admin" public/robots.txt; then
    echo "✅ robots.txt: Admin blocked"
else
    echo "❌ robots.txt: Admin NOT blocked"
    exit 1
fi

# Check middleware exists
if [ -f "middleware.js" ]; then
    echo "✅ Middleware: Security middleware found"
else
    echo "❌ Middleware: Security middleware missing"
    exit 1
fi

# 3. Deploy to Vercel (example)
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed!"
echo ""
echo "🔐 Admin Access Information:"
echo "URL: https://your-domain.vercel.app/admin"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "⚠️  IMPORTANT: Change the password immediately after deployment!"
echo "📖 Read ADMIN_ACCESS_GUIDE.md for more details"