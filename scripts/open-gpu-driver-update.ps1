$ErrorActionPreference = 'Stop'

Write-Host 'Opening Windows Update…'
Start-Process 'ms-settings:windowsupdate'
Start-Sleep -Milliseconds 500

Write-Host 'Opening Device Manager (Display adapters)…'
Start-Process 'devmgmt.msc'

Write-Host ''
Write-Host 'Tip: In Device Manager -> Display adapters -> right click your GPU -> Update driver'
Write-Host 'Also check Optional updates in Windows Update (often contains driver updates).'
