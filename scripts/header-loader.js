document.addEventListener("DOMContentLoaded", function () {
  const placeholder = document.getElementById("header-placeholder");
  if (placeholder) {
    const scriptTag = document.querySelector('script[src*="header-loader.js"]');
    let rootPath = "";
    if (scriptTag) {
      const src = scriptTag.getAttribute("src");
      if (src.indexOf("scripts/header-loader.js") !== -1) {
        rootPath = src.split("scripts/header-loader.js")[0];
      }
    }

    // Check authentication status
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || 'Student';

    // Build header with profile section (always visible)
    const profileSection = isLoggedIn ? `
        <div class="profile-dropdown-container">
          <button class="profile-trigger" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu">
            <span class="user-name">${userName}</span>
            <span class="profile-icon">👤</span>
          </button>
          <div class="profile-dropdown" role="menu" hidden>
            <a href="/pages/user/profile.html" role="menuitem">Profile</a>
            <a href="/pages/dashboards/student.html" role="menuitem">Dashboard</a>
            <a href="/pages/user/settings.html" role="menuitem">Settings</a>
            <button class="logout-btn" role="menuitem">Logout</button>
          </div>
        </div>
    ` : `
        <button id="google-login-btn" class="profile-icon-link" aria-label="Login with Google">👤</button>
    `;

    const headerHTML = `
    <nav class="navbar">
      <div class="logo">
        <a href="/index.html">Poornimites</a>
      </div>

      <div class="nav-links">
        <a href="/index.html">Home</a>
        <a href="/pages/tools/tools.html">Tools</a>
        <a href="/pages/resources/notes.html">Notes</a>
        <a href="/pages/community/index.html">Lounge</a>
      </div>

      <div class="nav-icons">
        <span class="icon">🔔</span>
        ${profileSection}
      </div>
    </nav>
    `;

    placeholder.innerHTML = headerHTML;

    const currentPath = window.location.pathname;
    const navLinks = placeholder.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      let linkPath = link.getAttribute("href");

      if (window.location.protocol === 'file:') {
        if (linkPath.startsWith('/')) {
          const relativePath = rootPath + linkPath.substring(1);
          link.setAttribute('href', relativePath);
          linkPath = relativePath;
        }
      }

      if (currentPath.endsWith(linkPath) ||
        (linkPath.endsWith("index.html") && currentPath.endsWith("/")) ||
        currentPath.includes(linkPath.replace(/^\.\.\//, ''))) {
        link.classList.add("active");
      }
    });

    // Profile dropdown functionality (only if logged in)
    const profileBtn = placeholder.querySelector('.profile-trigger');
    const dropdown = placeholder.querySelector('.profile-dropdown');

    if (!profileBtn || !dropdown) return;

    const dropdownLinks = dropdown.querySelectorAll('a[role="menuitem"]');

    function openDropdown() {
      dropdown.hidden = false;
      profileBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      dropdown.hidden = true;
      profileBtn.setAttribute('aria-expanded', 'false');
    }

    // Click to toggle
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Keyboard support
    profileBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          closeDropdown();
        } else {
          openDropdown();
        }
      }
    });

    // Click outside to close
    document.addEventListener('click', () => {
      closeDropdown();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileBtn.getAttribute('aria-expanded') === 'true') {
        closeDropdown();
      }
    });

    // Fix links for file:// protocol
    if (window.location.protocol === 'file:') {
      dropdownLinks.forEach(link => {
        let linkPath = link.getAttribute('href');
        if (linkPath.startsWith('/')) {
          const relativePath = rootPath + linkPath.substring(1);
          link.setAttribute('href', relativePath);
        }
      });
    }

    // Logout button handler
    const logoutBtn = dropdown.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        window.location.href = rootPath + 'index.html';
      });
    }

    // Google login button handler (when not logged in)
    const googleLoginBtn = placeholder.querySelector('#google-login-btn');
    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Dynamically import Supabase if available
        try {
          const { supabase } = await import('/assets/js/core/supabase-init.js');

          const redirectUrl = window.location.href;
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                hd: 'poornima.edu.in'
              }
            }
          });

          if (error) {
            console.error('Google sign-in error:', error);
            alert('Failed to initiate Google sign-in: ' + error.message);
          }
        } catch (error) {
          console.error('Failed to load Supabase or initiate login:', error);
          alert('Authentication system unavailable. Please try again later.');
        }
      });
    }
  }
});

