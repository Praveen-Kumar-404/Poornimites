// assets/js/modules/auth/auth-listener.js
import { supabase } from "../../core/supabase-init.js";

/**
 * Updates localStorage with user details to ensure persistence across non-SPA pages
 * and immediate access for synchronous scripts (like header-loader.js).
 */
function updateLegacyStorage(session) {
    if (session?.user) {
        localStorage.setItem('isLoggedIn', 'true');
        // Extract best available name
        const meta = session.user.user_metadata || {};
        const name = meta.full_name || meta.display_name || meta.name || session.user.email.split('@')[0];
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', session.user.email);
        localStorage.setItem('userId', session.user.id);
        if (meta.avatar_url) {
            localStorage.setItem('userAvatar', meta.avatar_url);
        }
    } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
        localStorage.removeItem('userAvatar');
    }
}

/**
 * Dispatches a custom event that UI components (like header-loader) can listen to.
 */
function notifyAuthStateChange(session) {
    const event = new CustomEvent('auth-state-changed', {
        detail: {
            isLoggedIn: !!session?.user,
            user: session?.user || null,
            name: localStorage.getItem('userName') || 'Student'
        }
    });
    window.dispatchEvent(event);
}

// Initialize listener
console.log('[Auth Listener] Initializing...');

// 1. Check initial session
supabase.auth.getSession().then(({ data: { session } }) => {
    updateLegacyStorage(session);
    notifyAuthStateChange(session);
});

// 2. Listen for changes (login, logout, token refresh)
supabase.auth.onAuthStateChange((event, session) => {
    console.log(`[Auth Listener] Auth event: ${event}`);
    updateLegacyStorage(session);
    notifyAuthStateChange(session);

    // Handle specific events if needed
    if (event === 'SIGNED_OUT') {
        // Optional: clear any other app-specific data
    }
});

// Expose helper to global scope for debugging or manual checks
window.AuthListener = {
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
};
