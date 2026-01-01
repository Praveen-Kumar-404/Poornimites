const fs = require('fs');
const path = require('path');

const rootDir = __dirname.replace(/scripts$/, ''); // Assuming script is in /scripts
console.log(`Root Dir: ${rootDir}`);

// 1. Define File Moves (Old Path -> New Path)
// Paths are relative to project root.
const moves = {
    // Auth
    'auth.html': 'pages/auth/login.html',
    'signup.html': 'pages/auth/signup.html',

    // Dashboards
    'dashboard-student.html': 'pages/dashboards/student.html',
    'dashboard-teacher.html': 'pages/dashboards/teacher.html',
    'admin-dashboard.html': 'pages/dashboards/admin.html',
    'dashboard-moderator.html': 'pages/dashboards/moderator.html',
    'dashboard-student-assignments.html': 'pages/dashboards/dashboard-student-assignments.html',
    'dashboard-student-certificates.html': 'pages/dashboards/dashboard-student-certificates.html',
    'dashboard-student-courses.html': 'pages/dashboards/dashboard-student-courses.html',

    // Apps
    'chat.html': 'pages/apps/chat/index.html',
    'games.html': 'pages/apps/games/index.html',
    'break-zone.html': 'pages/apps/break-zone.html',
    // Note: pages/chat/* -> pages/apps/chat/* (Implicit)
    // Note: pages/games/* -> pages/apps/games/* (Implicit)
    // Note: pages/planner/* -> pages/apps/planner/* (Implicit content)
    'pages/planner/index.html': 'pages/apps/planner/index.html',

    // Tools
    'tools.html': 'pages/tools/index.html',
    // Note: pages/toolkit/* -> pages/tools/* (Implicit)

    // Resources
    'notes.html': 'pages/resources/notes.html',
    'career.html': 'pages/resources/career.html',
    'faculty-details.html': 'pages/resources/faculty-details.html',
    'library-search.html': 'pages/tools/library-search.html', // Leftover? Check where it went. content of toolkit -> tools.

    // Community
    'community.html': 'pages/community/index.html',
    'clubs.html': 'pages/community/clubs.html',
    'event-hub.html': 'pages/community/event-hub.html',
    'student-bazar.html': 'pages/community/student-bazar.html',

    // User
    'profile.html': 'pages/user/profile.html',

    // Site
    'about.html': 'pages/site/about.html',
    'privacy.html': 'pages/site/privacy.html',
    'credits.html': 'pages/site/credits.html',
    'faq.html': 'pages/site/faq.html',
    'roadmap.html': 'pages/site/roadmap.html',
    'sitemap.html': 'pages/site/sitemap.html',

    // Root (No change)
    'index.html': 'index.html',
};

// Helper to determine original path
function getOriginalPath(currentPath) {
    // Check explicit moves reverse lookup
    for (const [oldP, newP] of Object.entries(moves)) {
        if (path.normalize(newP) === path.normalize(currentPath)) return oldP;
    }

    // Heuristic for Implicit Moves

    // Toolkit -> Tools
    // pages/tools/X -> pages/toolkit/X
    if (currentPath.startsWith('pages/tools/') && currentPath !== 'pages/tools/index.html') {
        const basename = path.basename(currentPath);
        return `pages/toolkit/${basename}`;
    }

    // Apps folders
    if (currentPath.startsWith('pages/apps/chat/') && currentPath !== 'pages/apps/chat/index.html') {
        const sub = currentPath.substring('pages/apps/chat/'.length);
        // Was pages/chat/sub ? No, 'pages/chat' was root chat folder content?
        // Actually, list_dir earlier showed 'pages/chat' had content.
        // So pages/chat/X -> pages/apps/chat/X
        return `pages/chat/${sub}`;
    }
    if (currentPath.startsWith('pages/apps/games/') && currentPath !== 'pages/apps/games/index.html') {
        const sub = currentPath.substring('pages/apps/games/'.length);
        return `pages/games/${sub}`;
    }
    if (currentPath.startsWith('pages/apps/planner/') && currentPath !== 'pages/apps/planner/index.html') {
        // pages/planner/X -> pages/apps/planner/X
        const sub = currentPath.substring('pages/apps/planner/'.length);
        return `pages/planner/${sub}`;
    }

    // If no match, assume it didn't move
    return currentPath;
}

// Helper to resolve a link from an old context to the new file path
function getNewTarget(oldSourcePath, link) {
    if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:')) return link;

    // Resolve absolute-ish paths (but they are likely relative)
    // If link starts with /, it's root relative.
    let oldTargetAbs = '';
    if (link.startsWith('/')) {
        oldTargetAbs = link.substring(1);
    } else {
        oldTargetAbs = path.join(path.dirname(oldSourcePath), link).replace(/\\/g, '/');
    }

    // Normalize
    // Remove ./
    // Solve ../
    // We can use path.resolve logic but rooted at some virtual root.
    // Easier: use path.join but be careful not to go above root.
    // Actually, simple path.join works for relative logic.

    // Find where this oldTarget went
    // First, exact match in moves
    for (const [oldP, newP] of Object.entries(moves)) {
        if (path.normalize(oldP) === path.normalize(oldTargetAbs)) return newP;
    }

    // Implicit rules

    // CSS Planner
    if (oldTargetAbs.startsWith('assets/css/planner/')) {
        return 'assets/css/apps/planner/' + path.basename(oldTargetAbs);
    }
    // JS Games
    if (oldTargetAbs.startsWith('assets/js/games/')) {
        return 'assets/js/apps/games/' + path.basename(oldTargetAbs);
    }

    if (oldTargetAbs.startsWith('pages/toolkit/')) {
        return 'pages/tools/' + path.basename(oldTargetAbs);
    }
    if (oldTargetAbs.startsWith('pages/chat/')) {
        return 'pages/apps/chat/' + oldTargetAbs.substring('pages/chat/'.length);
    }
    if (oldTargetAbs.startsWith('pages/games/')) {
        return 'pages/apps/games/' + oldTargetAbs.substring('pages/games/'.length);
    }
    if (oldTargetAbs.startsWith('pages/planner/')) {
        return 'pages/apps/planner/' + oldTargetAbs.substring('pages/planner/'.length);
    }

    // Assets?
    if (oldTargetAbs.startsWith('assets/')) {
        return oldTargetAbs; // Didn't move
    }

    // Fallback: assume target didn't move
    return oldTargetAbs;
}

function processFile(filePath) {
    const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
    const originalPath = getOriginalPath(relativePath);

    if (!originalPath) {
        console.warn(`Could not determine original path for ${relativePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Regex to find href, src, url, AND import
    // Captures: 1=Attribute (href="|src="), 2=Quote, 3=Link, 4=Quote
    // AND: import ... from (quote)(link)(quote)
    const regex = /(href=|src=|url\(|from\s+|import\s+)(["'])([^"']*?)\2/g;

    const newContent = content.replace(regex, (match, prefix, quote, link) => {
        // Ignore special links
        if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('data:')) return match;

        // SKIP if it's a library import (no . or /)
        if (prefix.trim() === 'from' || prefix.trim() === 'import') {
            if (!link.startsWith('.') && !link.startsWith('/')) return match;
        }

        // 1. Resolve link relative to ORIGINAL path
        const oldTarget = path.join(path.dirname(originalPath), link).replace(/\\/g, '/');

        // 2. Find NEW location of target
        let newTarget = getNewTarget(originalPath, link);

        // Fix for specific known missing targets or issues?
        // e.g. if newTarget is 'tools.html' -> 'pages/tools/index.html' (handled by getNewTarget/moves)

        // 3. Calculate relative path from CURRENT file to NEW target
        let newLink = path.relative(path.dirname(relativePath), newTarget).replace(/\\/g, '/');

        if (newLink === '') newLink = path.basename(newTarget); // same file?

        // 4. Update
        if (newLink !== link) {
            // console.log(`[${relativePath}] ${link} -> ${newLink} (Target: ${newTarget})`);
            return `${prefix}${quote}${newLink}${quote}`;
        }
        return match;
    });

    if (newContent !== content) {
        console.log(`Updated ${relativePath}`);
        fs.writeFileSync(filePath, newContent);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === '.git' || file === 'node_modules') continue;
            walkDir(fullPath);
        } else if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}

// Run
walkDir(rootDir);
