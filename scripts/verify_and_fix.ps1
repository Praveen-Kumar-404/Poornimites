$root = "d:\Projects\Poornimites"
$files = Get-ChildItem -Path "$root" -Recurse -Filter *.html
$log = @()

function Get-RelativePath($from, $to) {
    $fromPath = $from -replace '\\', '/'
    $toPath = $to -replace '\\', '/'
    
    # Calculate relative path manually or via .NET URI
    $fromUri = [Uri]$fromPath
    $toUri = [Uri]$toPath
    $items = $fromUri.MakeRelativeUri($toUri).ToString()
    return $items -replace '%20', ' '
}

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }
    
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    $fileDir = $file.DirectoryName
    
    # Regex to find links: href="X" or src="X"
    $matches = [regex]::Matches($content, '(href|src)=["'']([^"''#]+)["'']')
    
    foreach ($m in $matches) {
        $link = $m.Groups[2].Value
        if ($link -match "^http" -or $link -match "^mailto:" -or $link -match "^data:") { continue }
        
        # Resolve target
        $targetPath = $null
        try {
            if ($link -match "^/") {
                $targetPath = Join-Path $root $link.Substring(1)
            } else {
                $targetPath = Join-Path $fileDir $link
            }
            $targetPath = [System.IO.Path]::GetFullPath($targetPath)
        } catch { continue }
        
        if (-not (Test-Path $targetPath)) {
            # BROKEN LINK FOUND!
            # Try to find the file.
            $filename = [System.IO.Path]::GetFileName($link)
            
            # Search strategies:
            # 1. Is it an asset? Check assets/...
            # 2. Is it a page? Check pages/...
            
            $candidates = Get-ChildItem -Path $root -Recurse -Filter $filename -ErrorAction SilentlyContinue
            
            if ($candidates) {
                # Pick best candidate (simplistic: first one that is not in .git)
                $best = $candidates | Where-Object { $_.FullName -notmatch "\\.git\\" -and $_.FullName -notmatch "node_modules" } | Select-Object -First 1
                
                if ($best) {
                    # Calculate new relative link
                    # We need path from $fileDir to $best.FullName
                    
                    # PowerShell doesn't have a reliable MakeRelativeUri for paths without protocol, hacked via Uri
                    # Let's use a simpler depth calculation for assets if known.
                    
                    # Or use DotNet:
                    $folderUri = new-object Uri($fileDir + "\")
                    $targetUri = new-object Uri($best.FullName)
                    $newLink = $folderUri.MakeRelativeUri($targetUri).ToString()
                    # Fix slashes
                    $newLink = $newLink -replace '%20', ' '
                    
                    # Apply replacement
                    # Be careful to replace only this specific instance or all identical broken ones
                    # Using replace string
                    $content = $content.Replace($link, $newLink)
                    
                    $log += "FIXED: $($file.Name): $link -> $newLink"
                } else {
                    $log += "MISSING: $($file.Name): $link (File not found in project)"
                }
            } else {
                $log += "MISSING: $($file.Name): $link (File not found in project)"
            }
        }
    }
    
    if ($content -ne $originalContent) {
        $content | Set-Content -Path $file.FullName -NoNewline
    }
}

$log | Out-File "$root\verification_log.txt"
Write-Host "Verification complete. Log saved to verification_log.txt"
