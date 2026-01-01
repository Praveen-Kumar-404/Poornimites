$root = "d:\Projects\Poornimites"
$files = Get-ChildItem -Path "$root" -Recurse -Filter *.html

foreach ($file in $files) {
    if ($file.FullName -like "*node_modules*" -or $file.FullName -like "*.git*") { continue }

    # Calculate depth relative to root
    # Root: d:\Projects\Poornimites (Depth 0)
    # File: d:\Projects\Poornimites\index.html (Depth 0)
    # File: d:\Projects\Poornimites\pages\site\about.html (Depth 2: pages, site)
    
    $relPath = $file.FullName.Substring($root.Length + 1)
    $parts = $relPath.Split('\')
    $depth = $parts.Count - 1
    
    # Calculate needed prefix (e.g. "../../")
    $prefix = ""
    for ($i = 0; $i -lt $depth; $i++) { $prefix += "../" }
    
    $content = Get-Content $file.FullName -Raw
    
    # 1. Fix Assets links
    # Pattern: look for href="...assets/" or src="...assets/"
    # We strip existing ../ prefixes and apply the correct one.
    $newContent = $content -replace '(["''])(?:(?:\.\./)*)assets/', ('$1' + $prefix + 'assets/')
    
    # 2. Fix Index link (Home)
    $newContent = $newContent -replace '(["''])(?:(?:\.\./)*)index.html(["''])', ('$1' + $prefix + 'index.html$2')
    
    if ($content -ne $newContent) {
        $newContent | Set-Content -Path $file.FullName -NoNewline
        Write-Host "Fixed depth for $($file.Name) (Depth $depth)"
    }
}
Write-Host "Depth fix complete."
