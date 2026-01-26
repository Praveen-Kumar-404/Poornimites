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
    console.log('Google login button found:', googleLoginBtn);

    if (googleLoginBtn) {
      console.log('Attaching click handler to Google login button');

      googleLoginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Google login button clicked!');

        // Function to get or load Supabase client
        async function getSupabaseClient() {
          console.log('Getting Supabase client...');

          // Try global instance first
          if (window.__SUPABASE_CLIENT__) {
            console.log('Found global Supabase instance');
            return window.__SUPABASE_CLIENT__;
          }

          console.log('Global instance not found, waiting...');
          // Wait a bit for module to load (in case auth.js is loading)
          await new Promise(resolve => setTimeout(resolve, 100));
          if (window.__SUPABASE_CLIENT__) {
            console.log('Found Supabase instance after waiting');
            return window.__SUPABASE_CLIENT__;
          }

          console.log('Dynamically loading Supabase module...');
          // Dynamically load Supabase by injecting the module script
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.type = 'module';
            script.textContent = `
              import { supabase } from '/assets/js/core/supabase-init.js';
              window.__SUPABASE_CLIENT__ = supabase;
              window.dispatchEvent(new CustomEvent('supabase-loaded'));
            `;
            document.head.appendChild(script);

            window.addEventListener('supabase-loaded', () => {
              console.log('Supabase loaded via dynamic import');
              resolve(window.__SUPABASE_CLIENT__);
            }, { once: true });

            setTimeout(() => {
              console.error('Supabase load timeout');
              reject(new Error('Supabase load timeout'));
            }, 5000);
          });
        }

        try {
          const supabase = await getSupabaseClient();

          if (!supabase) {
            throw new Error('Could not initialize Supabase');
          }

          console.log('Initiating Google OAuth...');
          const redirectUrl = window.location.href;
          console.log('Redirect URL:', redirectUrl);

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

          console.log('OAuth response:', { data, error });

          if (error) {
            console.error('Google sign-in error:', error);
            alert('Failed to initiate Google sign-in: ' + error.message);
          } else {
            console.log('OAuth initiated successfully, should redirect...');
          }
          // If no error, Supabase will redirect to Google OAuth page
        } catch (error) {
          console.error('Unexpected error during Google sign-in:', error);
          alert('Authentication system is unavailable. Error: ' + error.message);
        }
      });

      console.log('Click handler attached successfully');
    } else {
      console.warn('Google login button not found in DOM');
    }
  }
});
