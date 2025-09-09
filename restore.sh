#!/bin/bash

# 🔄 RESTORE SCRIPT - ครูหนึ่งรถสวย Complete Backup
# Created: September 10, 2025
# Purpose: Restore to complete production-ready state

echo "🚀 Starting Restore Process..."
echo "📍 Target: Complete Production-Ready State"
echo "📅 Date: September 10, 2025"
echo ""

# Change to project directory
cd "c:\project davelopper\chiangmaiusedcar-setup" || exit 1

echo "📂 Current directory: $(pwd)"
echo ""

# Method selection
echo "🔄 Choose restore method:"
echo "1) Hard Reset to commit 544414b (Recommended)"
echo "2) Reset to tag backup-complete-v1.0"
echo "3) Create new branch from backup point"
echo "4) Emergency nuclear restore"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🔄 Performing hard reset to commit 544414b..."
        git reset --hard 544414b
        ;;
    2) 
        echo "🔄 Resetting to tag backup-complete-v1.0..."
        git reset --hard backup-complete-v1.0
        ;;
    3)
        echo "🌿 Creating new branch from backup point..."
        git checkout -b restore-$(date +%Y%m%d-%H%M) 544414b
        ;;
    4)
        echo "🔥 NUCLEAR RESTORE - Cleaning everything..."
        git reset --hard 544414b
        git clean -fd
        rm -rf node_modules .next
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📦 Installing dependencies..."
pnpm install

if [ $choice -eq 4 ]; then
    echo "🏗️ Building project..."
    pnpm build
fi

echo ""
echo "🧪 Testing development server..."
echo "🌐 Starting on http://localhost:3000"
echo ""
echo "✅ RESTORE COMPLETE!"
echo ""
echo "🔍 Verify these work:"
echo "   - Homepage with car listings"
echo "   - Car detail pages"
echo "   - Contact forms"
echo "   - PWA install prompt"
echo "   - All navigation"
echo ""
echo "🚀 Run 'pnpm dev' to start development server"
