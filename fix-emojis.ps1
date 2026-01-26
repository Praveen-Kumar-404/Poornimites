# PowerShell script to fix emoji encoding issues
param(
    [string]$Path = "."
)

Write-Host "===========================================`n" -ForegroundColor Cyan
Write-Host "  Emoji Fix Tool for HTML Files`n" -ForegroundColor Green
Write-Host "===========================================`n" -ForegroundColor Cyan

# Get all HTML files recursively
$htmlFiles = Get-ChildItem -Path $Path -Filter "*.html" -Recurse -File

Write-Host "Found $($htmlFiles.Count) HTML files to scan...`n" -ForegroundColor Yellow

$filesFixed = 0
$totalReplacements = 0

foreach ($file in $htmlFiles) {
    # Read with UTF-8 encoding
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    
    if (-not $content) {
        continue
    }
    
    # Check if file contains ??
    if ($content -contains '??') {
        $originalContent = $content
        $fileReplacements = 0
        
        # Common emoji replacements
        $content = $content -replace '<h1>�� Unit Converter</h1>', '<h1>🔄 Unit Converter</h1>'
        $content = $content -replace '<h2>�� Personal Planner</h2>', '<h2>📅 Personal Planner</h2>'
        $content = $content -replace '<h2>�� PDF Toolkit</h2>', '<h2>📄 PDF Toolkit</h2>'
        $content = $content -replace '<h2>�� Notes Workspace</h2>', '<h2>📝 Notes Workspace</h2>'
        $content = $content -replace '<h2>�� Developer Suite</h2>', '<h2>💻 Developer Suite</h2>'
        $content = $content -replace '<h2>�� Calculator</h2>', '<h2>🧮 Calculator</h2>'
        $content = $content -replace '<h2>�� GPA Calc</h2>', '<h2>📊 GPA Calc</h2>'
        $content = $content -replace '<h2>�� Universal Conv\.</h2>', '<h2>🔄 Universal Conv.</h2>'
        $content = $content -replace '<h2>�� Pomodoro</h2>', '<h2>⏰ Pomodoro</h2>'
        $content = $content -replace '<h2>��� Campus Map</h2>', '<h2>🗺️ Campus Map</h2>'
        $content = $content -replace '<h2>�� Bus Routes</h2>', '<h2>🚌 Bus Routes</h2>'
        $content = $content -replace 'Made with �� by Students', 'Made with ❤️ by Students'
        $content = $content -replace '�� Copy Result', '📋 Copy Result'
        
        # Count how many were fixed
        if ($content -ne $originalContent) {
            # Write back with UTF-8 BOM
            $utf8 = New-Object System.Text.UTF8Encoding $true
            [System.IO.File]::WriteAllText($file.FullName, $content, $utf8)
            
            $filesFixed++
            Write-Host "✅ Fixed: $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`n===========================================`n" -ForegroundColor Cyan
Write-Host "Summary:" -ForegroundColor Yellow
Write-Host "  Files modified: $filesFixed" -ForegroundColor Green
Write-Host "`n===========================================`n" -ForegroundColor Cyan

# Show files that still have ??
Write-Host "Checking for remaining issues...`n" -ForegroundColor Yellow

$remainingIssues = @()
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8 -ErrorAction SilentlyContinue
    if ($content -and ($content -match '\?\?')) {
        $count = ([regex]::Matches($content, '\?\?')).Count
        $remainingIssues += @{File = $file.Name; Count = $count; Path = $file.FullName}
    }  
}

if ($remainingIssues.Count -gt 0) {
    Write-Host "⚠️ Files with remaining �� patterns:`n" -ForegroundColor Magenta
    foreach ($issue in $remainingIssues) {
        Write-Host "  - $($issue.File): $($issue.Count) occurrences" -ForegroundColor Red
        Write-Host "    Path: $($issue.Path)" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ All emojis fixed successfully!" -ForegroundColor Green
}
