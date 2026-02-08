// assets/js/auth-handler.js
// Supabase Auth Handler

import { supabase } from "../../core/supabase-init.js";

const allowedDomain = "poornima.edu.in";

// Get redirect URL from query parameter, sessionStorage, or default to Lakshya 2k26
function getRedirectUrl() {
    // First check if there's a stored redirect from auth guard
    const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
    if (storedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin'); // Clear it after use
        return storedRedirect;
    }

    // Then check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const paramRedirect = urlParams.get('redirect');
    if (paramRedirect) {
        return paramRedirect;
    }

    // Default to Lakshya 2k26 page
    return '/pages/community/lakshya-2k26.html';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

// Show loading state
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Create user document in Supabase
async function createUserDocument(user, username = null) {
    try {
        const { error } = await supabase
            .from('users')
            .upsert({
                id: user.id,
                username: username || user.user_metadata.full_name || user.email.split('@')[0],
                email: user.email,
                photo_url: user.user_metadata.avatar_url || `https://ui-avatars.com/api/?name=${username || user.user_metadata.full_name || 'User'}`,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString(),
                status: 'online'
            }, { onConflict: 'id' });

        if (error) throw error;
    } catch (error) {
        console.error("Error creating user document:", error);
    }
}

// Handle successful authentication
async function handleAuthSuccess(user, username = null) {
    await createUserDocument(user, username);

    // Add success animation
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.classList.add('success');
    }

    // Redirect after short delay
    setTimeout(() => {
        window.location.href = getRedirectUrl();
    }, 500);
}

// Email/Password Login
export async function handleLogin(email, password, button) {
    setLoading(button, true);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) throw error;

        await handleAuthSuccess(data.user);
    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Login failed. Please try again.";

        if (error.message.includes("Invalid login credentials")) {
            errorMessage = "Invalid email or password.";
        } else if (error.message.includes("Email not confirmed")) {
            errorMessage = "Please confirm your email address.";
        }

        showError(errorMessage);
        setLoading(button, false);
    }
}

// Email/Password Signup
export async function handleSignup(email, password, username, button) {
    setLoading(button, true);

    // Validate email domain
    const domain = email.split("@")[1];
    if (domain !== allowedDomain) {
        showError(`Only ${allowedDomain} emails are allowed.`);
        setLoading(button, false);
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        showError("Password must be at least 6 characters long.");
        setLoading(button, false);
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    display_name: username,
                    full_name: username,
                }
            }
        });

        if (error) throw error;

        // If auto-confirm is enabled, we get a session/user immediately
        if (data.user) {
            // For Supabase, signUp might return a user but if email confirm is required, session might be null.
            // But let's assume soft reset where we might not strictly enforce email confirm or it's disabled for migration ease,
            // Or we just handle the user creation.
            // If data.session is null, it means check email.
            if (data.session) {
                await handleAuthSuccess(data.user, username);
            } else {
                showError("Please check your email to confirm your account.");
                setLoading(button, false);
            }
        }
    } catch (error) {
        console.error("Signup error:", error);
        showError(error.message);
        setLoading(button, false);
    }
}

// Google Sign In
export async function handleGoogleSignIn(button) {
    console.log('Google sign-in button clicked');
    setLoading(button, true);

    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/pages/auth/login.html', // Redirect back to auth to handle session
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                    hd: allowedDomain
                }
            }
        });

        if (error) throw error;

        // Supabase OAuth redirects, so line below might not be reached if redirect happens immediately
    } catch (error) {
        console.error("Google sign-in error:", error);
        showError("Google sign-in failed. " + error.message);
        setLoading(button, false);
    }
}

// Initialize Auth State Listener (Global)
supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
        // Optional: Ensure user doc exists
        // This runs on every page load if this file is imported
    }
});

// Export supabase client for compatibility if needed, though mostly using internal functions
export { supabase as auth, supabase as db }; 
