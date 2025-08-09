# 🧪 Vercel Auto-Deployment Test Script (PowerShell)
# ใช้สำหรับทดสอบว่าระบบ auto-deploy ทำงานได้หรือไม่

Write-Host "🚀 Testing Vercel Auto-Deployment..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# สร้าง timestamp
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

# สร้างไฟล์ test
$testFile = "test-deployment-$timestamp.txt"
$content = @"
// Auto-deployment test - $timestamp
Test executed at: $(Get-Date)
Platform: Windows PowerShell
"@

$content | Out-File -FilePath $testFile -Encoding UTF8

# Git operations
Write-Host "📝 Adding test file..." -ForegroundColor Yellow
git add $testFile

Write-Host "💾 Creating commit..." -ForegroundColor Yellow
git commit -m "test: auto-deployment verification - $timestamp"

Write-Host "🌐 Pushing to main branch..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "✅ Test commit pushed to main branch!" -ForegroundColor Green
Write-Host "📊 Check Vercel Dashboard for deployment status:" -ForegroundColor Cyan
Write-Host "   https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Monitor deployment progress:" -ForegroundColor Cyan
Write-Host "   1. Go to your project in Vercel Dashboard" -ForegroundColor White
Write-Host "   2. Click on 'Deployments' tab" -ForegroundColor White
Write-Host "   3. Watch for new deployment with message:" -ForegroundColor White
Write-Host "      'test: auto-deployment verification - $timestamp'" -ForegroundColor Gray
Write-Host ""
Write-Host "⏱️  Expected deployment time: 2-3 minutes" -ForegroundColor Magenta
Write-Host "🌐 Check website: https://chiangmaiusedcar.com" -ForegroundColor Cyan

# Cleanup old test files (เก็บแค่ 5 ไฟล์ล่าสุด)
Write-Host ""
Write-Host "🧹 Cleaning up old test files..." -ForegroundColor Yellow

$oldTestFiles = Get-ChildItem -Name "test-deployment-*.txt" | Sort-Object CreationTime -Descending | Select-Object -Skip 5

if ($oldTestFiles) {
    $oldTestFiles | ForEach-Object { Remove-Item $_ -Force }
    Write-Host "✅ Cleaned up $($oldTestFiles.Count) old test files" -ForegroundColor Green
} else {
    Write-Host "✅ No old test files to clean up" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Auto-deployment test completed!" -ForegroundColor Green
Write-Host "Check Vercel Dashboard in 30 seconds for deployment status" -ForegroundColor White
