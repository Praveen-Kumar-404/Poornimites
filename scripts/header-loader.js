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

    // --- NEW: Inject Auth Listener Module ---
    // This ensures auth state is monitored globally and local storage is kept in sync.
    const authScript = document.createElement('script');
    authScript.type = 'module';
    authScript.src = rootPath + 'assets/js/modules/auth/auth-listener.js';
    document.head.appendChild(authScript);
    // ----------------------------------------

    // Function to render the header content
    function renderHeader(user) {
      const isLoggedIn = !!user || localStorage.getItem('isLoggedIn') === 'true';
      // Prefer live user data, fallback to storage
      const userName = (user?.user_metadata?.full_name || user?.user_metadata?.display_name)
        || localStorage.getItem('userName')
        || 'Student';

      // Build Profile Section
      const profileSection = isLoggedIn ? `
            <div class="profile-dropdown-container">
            <button class="profile-trigger" aria-haspopup="menu" aria-expanded="false" aria-label="Account menu">
                <span class="user-name">${userName}</span>
                <span class="profile-icon">👤</span>
            </button>
            <div class="profile-dropdown" role="menu" hidden>
                <a href="${rootPath}pages/user/profile.html" role="menuitem">Profile</a>
                <a href="${rootPath}pages/dashboards/student.html" role="menuitem">Dashboard</a>
                <a href="${rootPath}pages/user/settings.html" role="menuitem">Settings</a>
                <button class="logout-btn" role="menuitem">Logout</button>
            </div>
            </div>
        ` : `
            <button id="google-login-btn" class="profile-icon-link" aria-label="Login with Google">
            <span class="profile-icon">👤</span>
            <span class="login-text">Login</span>
            </button>
        `;

      const headerHTML = `
        <nav class="navbar">
        <div class="logo">
            <a href="${rootPath}index.html">Poornimites</a>
        </div>

        <div class="nav-links">
            <a href="${rootPath}index.html">Home</a>
            <a href="${rootPath}pages/tools/tools.html">Tools</a>
            <a href="${rootPath}pages/resources/notes.html">Notes</a>
            <a href="${rootPath}pages/community/index.html">Lounge</a>
        </div>

        <div class="nav-icons">
            <span class="icon">🔔</span>
            ${profileSection}
        </div>
        </nav>
        
        <!-- Development Notice -->
        <div class="dev-notice">
          <div class="dev-notice-content">
            ⚠️ <strong>Site Under Development:</strong> This site is currently in development. Some features may not work as intended.
          </div>
        </div>
        `;

      placeholder.innerHTML = headerHTML;

      // Re-attach all event listeners (navigation, dropdown, login)
      attachEventListeners(rootPath);
    }

    // Function to attach all event listeners after render
    function attachEventListeners(rootPath) {
      // 1. Navigation Highlighting
      const currentPath = window.location.pathname;
      const navLinks = placeholder.querySelectorAll(".nav-links a");

      navLinks.forEach((link) => {
        let linkPath = link.getAttribute("href");
        // Fix file protocol paths
        if (window.location.protocol === 'file:') {
          // If it's absolute from root (starts with /), and we have a rootPath
          // But simplified: the renderHeader uses rootPath prefix, so hrefs are likely relative or correct already.
          // Just check for active state.
          // NOTE: If we used rootPath in renderHeader, linkPath is already relative.
        }

        // Simple active state check
        if (currentPath.endsWith(linkPath) ||
          (linkPath.endsWith('index.html') && currentPath.endsWith('/'))) {
          link.classList.add("active");
        }
      });

      // 2. Profile Dropdown Logic
      const profileBtn = placeholder.querySelector('.profile-trigger');
      const dropdown = placeholder.querySelector('.profile-dropdown');

      if (profileBtn && dropdown) {
        function openDropdown() {
          dropdown.hidden = false;
          profileBtn.setAttribute('aria-expanded', 'true');
        }
        function closeDropdown() {
          dropdown.hidden = true;
          profileBtn.setAttribute('aria-expanded', 'false');
        }

        profileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isExpanded = profileBtn.getAttribute('aria-expanded') === 'true';
          isExpanded ? closeDropdown() : openDropdown();
        });

        document.addEventListener('click', () => closeDropdown());

        // Logout
        const logoutBtn = dropdown.querySelector('.logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', async () => {
            // Use global supabase client if available, or just clear local storage
            const sb = window.__SUPABASE_CLIENT__;
            if (sb) {
              await sb.auth.signOut();
              // The auth-listener will catch this and trigger update, 
              // but we might want to reload to be sure.
            }
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            window.location.href = rootPath + 'index.html';
          });
        }
      }

      // 3. Login Button Logic
      const googleLoginBtn = placeholder.querySelector('#google-login-btn');
      if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const loginText = googleLoginBtn.querySelector('.login-text');
          const originalText = loginText ? loginText.textContent : 'Login';
          if (loginText) loginText.textContent = 'Logging in...';

          try {
            // Wait for Supabase to be available (injected by auth-listener)
            // We can poll or just check window.__SUPABASE_CLIENT__
            let sb = window.__SUPABASE_CLIENT__;

            if (!sb) {
              // Fallback: wait a bit or load it manually? 
              // Since we injected auth-listener, it should be ready or initializing.
              // Let's simplified load if missing (just in case auth-listener failed or is slow)
              console.log("Supabase client not ready, waiting...");
              await new Promise(r => setTimeout(r, 500));
              sb = window.__SUPABASE_CLIENT__;
            }

            if (!sb) throw new Error("Authentication system not initialized. Please refresh.");

            const { error } = await sb.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.href, // Stay on same page or go to index? plan said index but staying is better ux
                queryParams: { access_type: 'offline', prompt: 'select_account', hd: 'poornima.edu.in' }
              }
            });
            if (error) throw error;

          } catch (err) {
            console.error("Login failed:", err);
            alert(err.message);
            if (loginText) loginText.textContent = originalText;
          }
        });
      }
    }

    // --- INITIAL RENDER ---
    // Render immediately with whatever is in localStorage (fast)
    renderHeader(null);

    // --- REACTIVE UPDATE ---
    // Listen for updates from auth-listener.js
    window.addEventListener('auth-state-changed', (e) => {
      console.log("Header received auth update:", e.detail);
      renderHeader(e.detail.user);
    });

  }
});
