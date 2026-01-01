$root = "d:\Projects\Poornimites"
$files = Get-ChildItem -Path "$root\pages" -Recurse -Filter *.html
$index = Get-Item "$root\index.html"
$files = $files + $index

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw
        $newContent = $content
        $newContent = $newContent.Replace('assets/css/style.css', 'assets/css/core/style.css')
        $newContent = $newContent.Replace('assets/css/header.css', 'assets/css/core/header.css')
        $newContent = $newContent.Replace('assets/css/footer.css', 'assets/css/core/footer.css')
        $newContent = $newContent.Replace('assets/css/bento-grid.css', 'assets/css/core/bento-grid.css')
        $newContent = $newContent.Replace('assets/css/neumorphism.css', 'assets/css/core/neumorphism.css')
        $newContent = $newContent.Replace('assets/css/sub-page.css', 'assets/css/core/sub-page.css')
        $newContent = $newContent.Replace('assets/css/auth.css', 'assets/css/modules/auth/auth.css')
        $newContent = $newContent.Replace('assets/css/dashboard.css', 'assets/css/modules/dashboards/dashboard.css')
        $newContent = $newContent.Replace('assets/css/profile.css', 'assets/css/modules/user/profile.css')
        $newContent = $newContent.Replace('assets/css/toolkit.css', 'assets/css/modules/tools/toolkit.css')
        $newContent = $newContent.Replace('assets/css/career.css', 'assets/css/modules/resources/career.css')
        $newContent = $newContent.Replace('assets/css/faculty-details.css', 'assets/css/modules/resources/faculty-details.css')
        $newContent = $newContent.Replace('assets/css/clubs.css', 'assets/css/modules/community/clubs.css')
        $newContent = $newContent.Replace('assets/css/event-hub.css', 'assets/css/modules/community/event-hub.css')
        $newContent = $newContent.Replace('assets/css/student-bazaar.css', 'assets/css/modules/community/student-bazaar.css')
        $newContent = $newContent.Replace('assets/css/student-lounge.css', 'assets/css/modules/community/student-lounge.css')
        $newContent = $newContent.Replace('assets/css/chat.css', 'assets/css/apps/chat/chat.css')
        $newContent = $newContent.Replace('assets/css/chat-layout.css', 'assets/css/apps/chat/chat-layout.css')
        $newContent = $newContent.Replace('assets/css/chat-theme.css', 'assets/css/apps/chat/chat-theme.css')
        $newContent = $newContent.Replace('assets/css/games.css', 'assets/css/apps/games/games.css')
        $newContent = $newContent.Replace('assets/css/game-animations.css', 'assets/css/apps/games/game-animations.css')
        $newContent = $newContent.Replace('assets/js/main.js', 'assets/js/core/main.js')
        $newContent = $newContent.Replace('assets/js/supabase-init.js', 'assets/js/core/supabase-init.js')
        $newContent = $newContent.Replace('assets/js/auth.js', 'assets/js/modules/auth/auth.js')
        $newContent = $newContent.Replace('assets/js/auth-handler.js', 'assets/js/modules/auth/auth-handler.js')
        $newContent = $newContent.Replace('assets/js/dashboard.js', 'assets/js/modules/dashboards/dashboard.js')
        $newContent = $newContent.Replace('assets/js/profile.js', 'assets/js/modules/user/profile.js')
        $newContent = $newContent.Replace('assets/js/toolkit-common.js', 'assets/js/modules/tools/toolkit-common.js')
        $newContent = $newContent.Replace('assets/js/career.js', 'assets/js/modules/resources/career.js')
        $newContent = $newContent.Replace('assets/js/clubs.js', 'assets/js/modules/community/clubs.js')
        $newContent = $newContent.Replace('assets/js/event-hub.js', 'assets/js/modules/community/event-hub.js')
        $newContent = $newContent.Replace('assets/js/student-bazaar.js', 'assets/js/modules/community/student-bazaar.js')
        $newContent = $newContent.Replace('assets/js/student-lounge.js', 'assets/js/modules/community/student-lounge.js')
        $newContent = $newContent.Replace('assets/js/game-hub.js', 'assets/js/apps/games/game-hub.js')

        if ($content -ne $newContent) {
            $newContent | Set-Content -Path $file.FullName -NoNewline
            Write-Host "Updated $($file.Name)"
        }
    } catch {
        Write-Host "Error processing $($file.Name): $_"
    }
}
Write-Host "Done"
