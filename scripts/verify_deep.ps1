$root = "d:\Projects\Poornimites"
$logFile = "$root\verify_log.txt"
$htmlFiles = Get-ChildItem -Path "$root" -Recurse -Filter *.html
$jsFiles = Get-ChildItem -Path "$root" -Recurse -Filter *.js
$errors = @()

function Resolve-PathAbsolute($baseDir, $relativePath) {
    if ($relativePath.StartsWith("/")) {
        return Join-Path $root $relativePath.Substring(1)
    }
    $path = Join-Path $baseDir $relativePath
    try {
        return [System.IO.Path]::GetFullPath($path)
    } catch {
        return $null
    }
}

"Starting Verification..." | Out-File $logFile

foreach ($file in $htmlFiles) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }
    try {
        $content = Get-Content $file.FullName -Raw
        $matches = [regex]::Matches($content, '<script[^>]+src=["'']([^"''#]+)["'']')
        foreach ($m in $matches) {
            $link = $m.Groups[1].Value
            if ($link -match "^http") { continue }
            $absPath = Resolve-PathAbsolute $file.DirectoryName $link
            if (-not $absPath -or -not (Test-Path $absPath)) {
                "HTML BROKEN: $($file.Name) -> $link (in $($file.FullName))" | Out-File $logFile -Append
            }
        }
    } catch {
        "ERROR reading $($file.Name): $_" | Out-File $logFile -Append
    }
}

foreach ($file in $jsFiles) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }
    try {
        $content = Get-Content $file.FullName -Raw
        $matches = [regex]::Matches($content, '(?:import|export)\s+(?:.*?from\s+)?["'']([^"''\r\n]+)["'']')
        foreach ($m in $matches) {
            $link = $m.Groups[1].Value
            if ($link -notmatch "^\." -and $link -notmatch "^/") { continue }
            $absPath = Resolve-PathAbsolute $file.DirectoryName $link
            if (-not $absPath -or -not (Test-Path $absPath)) {
                "JS BROKEN: $($file.Name) -> $link (in $($file.FullName))" | Out-File $logFile -Append
            }
        }
    } catch {
        "ERROR reading $($file.Name): $_" | Out-File $logFile -Append
    }
}

"Verification Complete." | Out-File $logFile -Append
