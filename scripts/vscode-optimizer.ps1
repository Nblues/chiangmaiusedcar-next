# VS Code Settings Optimizer for Better Performance
# ปรับปรุงการตั้งค่า VS Code เพื่อประสิทธิภาพที่ดีขึ้น
# Created: August 27, 2025

param([string]$Action = "optimize")

$VSCODE_SETTINGS_PATH = "$env:APPDATA\Code\User\settings.json"
$BACKUP_PATH = "$env:APPDATA\Code\User\settings.backup.json"

function Backup-VSCodeSettings {
    if (Test-Path $VSCODE_SETTINGS_PATH) {
        Copy-Item $VSCODE_SETTINGS_PATH $BACKUP_PATH
        Write-Host "✅ VS Code settings backed up" -ForegroundColor Green
        return $true
    }
    return $false
}

function Optimize-VSCodeSettings {
    Write-Host "⚙️ Optimizing VS Code settings for better performance..." -ForegroundColor Cyan
    
    # สร้าง backup ก่อน
    Backup-VSCodeSettings
    
    # การตั้งค่าที่เหมาะสมสำหรับการพัฒนา
    $optimizedSettings = @{
        # Memory & Performance
        "files.watcherExclude" = @{
            "**/.git/objects/**" = $true
            "**/.git/subtree-cache/**" = $true
            "**/node_modules/**" = $true
            "**/tmp/**" = $true
            "**/dist/**" = $true
            "**/build/**" = $true
            "**/.next/**" = $true
            "**/.nuxt/**" = $true
            "**/coverage/**" = $true
        }
        
        # File watching optimization
        "files.maxConcurrentWatches" = 100000
        "search.maxResults" = 20000
        
        # TypeScript performance
        "typescript.preferences.includePackageJsonAutoImports" = "off"
        "typescript.suggest.autoImports" = $false
        "typescript.updateImportsOnFileMove.enabled" = "never"
        
        # JavaScript performance  
        "js/ts.implicitProjectConfig.checkJs" = $false
        
        # Copilot optimization
        "github.copilot.enable" = @{
            "*" = $true
            "yaml" = $true
            "plaintext" = $false
            "markdown" = $true
        }
        "github.copilot.advanced" = @{
            "secret_key" = "github-copilot"
            "length" = 500
            "temperature" = ""
            "top_p" = ""
            "stop" = @("</|endoftext|>")
        }
        
        # Editor performance
        "editor.quickSuggestions" = @{
            "other" = $true
            "comments" = $false
            "strings" = $true
        }
        "editor.suggestOnTriggerCharacters" = $true
        "editor.acceptSuggestionOnEnter" = "smart"
        "editor.tabCompletion" = "on"
        
        # Terminal optimization
        "terminal.integrated.rendererType" = "auto"
        "terminal.integrated.fastScrollSensitivity" = 5
        
        # Extension optimization
        "extensions.autoUpdate" = $false
        "extensions.autoCheckUpdates" = $false
        
        # Workbench optimization
        "workbench.enableExperiments" = $false
        "workbench.settings.enableNaturalLanguageSearch" = $false
        
        # Git optimization
        "git.enabled" = $true
        "git.autoRepositoryDetection" = "subFolders"
        "git.fetchOnPull" = $true
        "git.autofetch" = $true
        
        # Language specific
        "emmet.includeLanguages" = @{
            "javascript" = "javascriptreact"
            "typescript" = "typescriptreact"
        }
    }
    
    # อ่านการตั้งค่าปัจจุบัน
    $currentSettings = @{}
    if (Test-Path $VSCODE_SETTINGS_PATH) {
        try {
            $currentSettings = Get-Content $VSCODE_SETTINGS_PATH | ConvertFrom-Json -AsHashtable
        }
        catch {
            Write-Host "⚠️ Cannot read current settings, creating new..." -ForegroundColor Yellow
        }
    }
    
    # ผสานการตั้งค่า
    foreach ($key in $optimizedSettings.Keys) {
        $currentSettings[$key] = $optimizedSettings[$key]
    }
    
    # บันทึกการตั้งค่าใหม่
    try {
        $currentSettings | ConvertTo-Json -Depth 10 | Out-File $VSCODE_SETTINGS_PATH -Encoding UTF8
        Write-Host "✅ VS Code settings optimized successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to save settings: $($_.Exception.Message)" -ForegroundColor Red
    }
}

function Restore-VSCodeSettings {
    if (Test-Path $BACKUP_PATH) {
        Copy-Item $BACKUP_PATH $VSCODE_SETTINGS_PATH
        Write-Host "✅ VS Code settings restored from backup" -ForegroundColor Green
    } else {
        Write-Host "❌ No backup found" -ForegroundColor Red
    }
}

function Show-VSCodePerformanceTips {
    Write-Host "`n💡 VS Code Performance Tips:" -ForegroundColor Cyan
    Write-Host "1. ปิด extensions ที่ไม่จำเป็น" -ForegroundColor White
    Write-Host "2. ใช้ .gitignore เพื่อไม่ให้ watch ไฟล์ที่ไม่ต้องการ" -ForegroundColor White
    Write-Host "3. ปิด TypeScript auto-imports หากไม่จำเป็น" -ForegroundColor White
    Write-Host "4. ใช้ search.maxResults เพื่อจำกัดผลการค้นหา" -ForegroundColor White
    Write-Host "5. ปรับ files.maxConcurrentWatches สำหรับโปรเจคใหญ่" -ForegroundColor White
    Write-Host "6. ใช้ workspace-specific settings สำหรับโปรเจคเฉพาะ" -ForegroundColor White
}

switch ($Action) {
    "optimize" {
        Optimize-VSCodeSettings
        Show-VSCodePerformanceTips
    }
    "restore" {
        Restore-VSCodeSettings
    }
    "backup" {
        if (Backup-VSCodeSettings) {
            Write-Host "✅ Settings backed up to: $BACKUP_PATH" -ForegroundColor Green
        } else {
            Write-Host "❌ No settings file found to backup" -ForegroundColor Red
        }
    }
    "tips" {
        Show-VSCodePerformanceTips
    }
    default {
        Write-Host "Usage: .\vscode-optimizer.ps1 [optimize|restore|backup|tips]" -ForegroundColor Yellow
    }
}
