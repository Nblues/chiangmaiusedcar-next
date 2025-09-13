$districts = @(
    @{name='สันกำแพง'; file='san-kamphaeng'},
    @{name='สันทราย'; file='san-sai'},
    @{name='สันพระเนตร'; file='san-pa-tong'}, 
    @{name='สารภี'; file='saraphi'},
    @{name='อมก่อย'; file='omkoi'},
    @{name='เมืองเชียงใหม่'; file='mueang-chiangmai'}
)

foreach ($district in $districts) {
    $fileName = "c:\project davelopper\chiangmaiusedcar-setup\pages\cars\chiangmai\$($district.file)-new.jsx"
    Copy-Item "c:\project davelopper\chiangmaiusedcar-setup\district-template.jsx" $fileName
    
    # Read content
    $content = Get-Content $fileName -Raw
    
    # Replace placeholders
    $content = $content -replace 'DISTRICT_NAME_HERE', $district.name
    $content = $content -replace 'PAGE_TITLE_HERE', "รถมือสอง$($district.name) เชียงใหม่ - ครูหนึ่งรถสวย"
    $content = $content -replace 'PAGE_DESCRIPTION_HERE', "รถมือสอง$($district.name) เชียงใหม่ ครูหนึ่งรถสวย คุณภาพดี ราคาดี ตรวจสภาพครบถ้วน รับประกัน 1 ปี ส่งรถถึงบ้าน โทร 094-064-9018"
    $content = $content -replace 'URL_HERE', "/cars/chiangmai/$($district.file)"
    
    # Write back
    Set-Content $fileName $content -Encoding UTF8
    
    Write-Host "Created: $($district.file).jsx for $($district.name)"
}