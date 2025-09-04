param([string]$Action = "optimize")

# VS Code Performance Optimizer
Write-Host "VS Code Performance Optimizer" -ForegroundColor Cyan

$SETTINGS_PATH = "$env:APPDATA\Code\User\settings.json"
$BACKUP_PATH = "$env:APPDATA\Code\User\settings.backup.json"

function Backup-Settings {
    if (Test-Path $SETTINGS_PATH) {
        Copy-Item $SETTINGS_PATH $BACKUP_PATH
        Write-Host "Settings backed up" -ForegroundColor Green
        return $true
    }
    return $false
}

function Optimize-VSCodeSettings {
    Write-Host "Optimizing VS Code settings..." -ForegroundColor Yellow
    
    # Backup first
    Backup-Settings
    
    # Performance settings
    $settings = @{
        "files.watcherExclude" = @{
            "**/node_modules/**" = $true
            "**/.git/objects/**" = $true
            "**/dist/**" = $true
            "**/build/**" = $true
            "**/.next/**" = $true
            "**/coverage/**" = $true
        }
        "search.maxResults" = 20000
        "files.maxConcurrentWatches" = 100000
        "typescript.suggest.autoImports" = $false
        "typescript.updateImportsOnFileMove.enabled" = "never"
        "editor.quickSuggestions" = @{
            "other" = $true
            "comments" = $false
            "strings" = $true
        }
        "github.copilot.enable" = @{
            "*" = $true
            "yaml" = $true
            "plaintext" = $false
            "markdown" = $true
        }
        "terminal.integrated.rendererType" = "auto"
        "extensions.autoUpdate" = $false
        "workbench.enableExperiments" = $false
        "git.autofetch" = $true
    }
    
    # Read existing settings
    $existing = @{}
    if (Test-Path $SETTINGS_PATH) {
        try {
            $content = Get-Content $SETTINGS_PATH -Raw
            $existing = $content | ConvertFrom-Json -AsHashtable
        }
        catch {
            Write-Host "Cannot read existing settings, creating new..." -ForegroundColor Yellow
        }
    }
    
    # Merge settings
    foreach ($key in $settings.Keys) {
        $existing[$key] = $settings[$key]
    }
    
    # Save optimized settings
    try {
        $existing | ConvertTo-Json -Depth 10 | Out-File $SETTINGS_PATH -Encoding UTF8
        Write-Host "VS Code settings optimized successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to save settings" -ForegroundColor Red
    }
}

function Restore-Settings {
    if (Test-Path $BACKUP_PATH) {
        Copy-Item $BACKUP_PATH $SETTINGS_PATH
        Write-Host "Settings restored from backup" -ForegroundColor Green
    } else {
        Write-Host "No backup found" -ForegroundColor Red
    }
}

function Show-Tips {
    Write-Host ""
    Write-Host "VS Code Performance Tips:" -ForegroundColor Cyan
    Write-Host "1. Disable unused extensions" -ForegroundColor White
    Write-Host "2. Use .gitignore to exclude unnecessary files" -ForegroundColor White
    Write-Host "3. Limit TypeScript auto-imports" -ForegroundColor White
    Write-Host "4. Increase search result limits for large projects" -ForegroundColor White
    Write-Host "5. Use workspace-specific settings" -ForegroundColor White
}

switch ($Action) {
    "optimize" {
        Optimize-VSCodeSettings
        Show-Tips
    }
    "restore" {
        Restore-Settings
    }
    "backup" {
        if (Backup-Settings) {
            Write-Host "Settings backed up to: $BACKUP_PATH" -ForegroundColor Green
        } else {
            Write-Host "No settings file found" -ForegroundColor Red
        }
    }
    "tips" {
        Show-Tips
    }
    default {
        Write-Host "Usage: .\vscode-simple.ps1 [optimize|restore|backup|tips]" -ForegroundColor Yellow
    }
}
