// assets/js/modules/auth/auth-listener.js
import { auth } from "../../core/firebase-init.js";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/**
 * Updates localStorage with user details to ensure persistence across non-SPA pages
 * and immediate access for synchronous scripts (like header-loader.js).
 */
function updateLegacyStorage(user) {
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        // Extract best available name
        const name = user.displayName || user.email.split('@')[0];
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userId', user.uid);
        if (user.photoURL) {
            localStorage.setItem('userAvatar', user.photoURL);
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
function notifyAuthStateChange(user) {
    const event = new CustomEvent('auth-state-changed', {
        detail: {
            isLoggedIn: !!user,
            user: user,
            name: localStorage.getItem('userName') || 'Student'
        }
    });
    window.dispatchEvent(event);
}

// Initialize listener
console.log('[Auth Listener] Initializing...');

// Listen for changes (login, logout, token refresh)
onAuthStateChanged(auth, (user) => {
    console.log(`[Auth Listener] Auth event, user logged in: ${!!user}`);
    updateLegacyStorage(user);
    notifyAuthStateChange(user);
});

// Expose helper to global scope for debugging or manual checks
window.AuthListener = {
    loginWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account',
            hd: 'poornima.edu.in'
        });
        const result = await signInWithPopup(auth, provider);
        return result.user;
    },
    logout: async () => {
        await signOut(auth);
    },
    getCurrentUser: () => {
        return auth.currentUser;
    }
};
