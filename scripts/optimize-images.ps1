# Optimize Hero Banner และ Logo Images
# ใช้ .NET System.Drawing สำหรับ resize images

Write-Host "🚀 Starting image optimization..." -ForegroundColor Green

# Load System.Drawing
Add-Type -AssemblyName System.Drawing

function Optimize-Image {
    param(
        [string]$InputPath,
        [string]$OutputPath,
        [int]$MaxWidth,
        [int]$Quality = 85
    )
    
    if (-not (Test-Path $InputPath)) {
        Write-Host "❌ File not found: $InputPath" -ForegroundColor Red
        return
    }

    Write-Host "`n📸 Processing: $($InputPath | Split-Path -Leaf)" -ForegroundColor Cyan
    
    $originalSize = (Get-Item $InputPath).Length / 1KB
    Write-Host "   Original: $([math]::Round($originalSize, 2)) KB" -ForegroundColor Gray

    try {
        # Load image
        $img = [System.Drawing.Image]::FromFile($InputPath)
        
        # Calculate new dimensions
        $ratio = $img.Width / $img.Height
        $newWidth = [Math]::Min($MaxWidth, $img.Width)
        $newHeight = [int]($newWidth / $ratio)
        
        # Create new bitmap
        $newImg = New-Object System.Drawing.Bitmap $newWidth, $newHeight
        $graphics = [System.Drawing.Graphics]::FromImage($newImg)
        
        # Set high quality rendering
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        # Draw resized image
        $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        # Save
        $newImg.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Cleanup
        $graphics.Dispose()
        $newImg.Dispose()
        $img.Dispose()
        
        $newSize = (Get-Item $OutputPath).Length / 1KB
        $saved = $originalSize - $newSize
        Write-Host "   ✅ Optimized: $newWidth x $newHeight ($([math]::Round($newSize, 2)) KB)" -ForegroundColor Green
        Write-Host "   💾 Saved: $([math]::Round($saved, 2)) KB" -ForegroundColor Yellow
        
    } catch {
        Write-Host "   ❌ Error: $_" -ForegroundColor Red
    }
}

# Paths
$heroPath = "public/herobanner/cnxcar.webp"
$logoPath = "public/logo/logo_main.webp"

# Optimize hero banner (max 1400px width)
if (Test-Path $heroPath) {
    Optimize-Image -InputPath $heroPath -OutputPath "public/herobanner/cnxcar_optimized.webp" -MaxWidth 1400 -Quality 85
} else {
    Write-Host "⚠️  Hero banner not found at: $heroPath" -ForegroundColor Yellow
}

# Optimize logo (max 128px for 2x DPI)
if (Test-Path $logoPath) {
    Optimize-Image -InputPath $logoPath -OutputPath "public/logo/logo_main_optimized.webp" -MaxWidth 128 -Quality 90
} else {
    Write-Host "⚠️  Logo not found at: $logoPath" -ForegroundColor Yellow
}

Write-Host "`n✨ Image optimization complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Backup original files if needed" -ForegroundColor Gray
Write-Host "2. Replace original files with optimized versions" -ForegroundColor Gray
Write-Host "3. Test the website to ensure images load correctly" -ForegroundColor Gray
Write-Host "4. Check PageSpeed Insights for improvement" -ForegroundColor Gray
