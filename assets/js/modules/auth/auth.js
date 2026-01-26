
// assets/js/auth.js - Updated to use Supabase
import { supabase } from "../../core/supabase-init.js";

const allowedDomain = "poornima.edu.in";

// Email/password registration
export async function register(email, password) {
  const domain = email.split("@")[1];
  if (domain !== allowedDomain) {
    throw new Error("Only poornima.edu.in emails are allowed");
  }
  return await supabase.auth.signUp({
    email,
    password
  });
}

// Track user login session
async function trackUserSession(user) {
  try {
    const userId = user.id;
    const email = user.email;
    const displayName = user.user_metadata.full_name || user.user_metadata.display_name || email.split('@')[0];

    // Create a user session document - In Supabase usually we just update the user table
    // If we want a separate session table we need to create it, but for migration let's stick to updating user

    // Update user's last login in users table
    await supabase.from("users").upsert({
      id: userId,
      email: email,
      username: displayName,
      last_login: new Date().toISOString(),
      photo_url: user.user_metadata.avatar_url || null
    }, { onConflict: 'id' });

    // Set up activity tracking
    const activityInterval = setInterval(async () => {
      // Check if user is still logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Update last_active
        await supabase.from("users").update({
          status: 'online', // or last_active column if we had one, 'status' seems to be the field used in other files
          // creating 'last_active' might be good if schema supports it, but preserving 'status' is safer
        }).eq('id', userId);
      } else {
        clearInterval(activityInterval);
      }
    }, 60000); // Update every minute

  } catch (error) {
    console.error("Error tracking user session:", error);
  }
}

// Google sign-in/out button logic
const authBtn = document.getElementById("auth-btn");

if (authBtn) {
  supabase.auth.onAuthStateChange((event, session) => {
    const user = session ? session.user : null;
    if (user) {
      // Track user login
      if (event === 'SIGNED_IN') {
        trackUserSession(user);
      }

      authBtn.textContent = "🚪";
      authBtn.href = "#";
      authBtn.onclick = async (e) => {
        e.preventDefault();

        // 1. Set status to offline BEFORE signing out (while still authenticated)
        try {
          await supabase.from("users").update({
            status: 'offline'
          }).eq('id', user.id);
        } catch (err) {
          console.warn("Failed to update status before logout:", err);
          // Continue with logout anyway
        }

        // 2. Perform Sign Out
        const { error } = await supabase.auth.signOut();

        if (error) {
          // If session is missing, we are already logged out from the client's perspective
          if (error.message.includes("Auth session missing")) {
            console.warn("Session was already missing. Treating as successful logout.");
            window.location.reload();
            return;
          }
          console.error(error);
          alert("Logout failed: " + error.message);
        } else {
          alert("Logged out successfully");
          // Optional: Redirect to home or refresh
          window.location.reload();
        }
      };
    } else {
      authBtn.textContent = "👤";
      authBtn.href = "#";
      authBtn.onclick = async (e) => {
        e.preventDefault();
        // Directly trigger Google sign-in, skipping auth page
        try {
          const redirectUrl = window.location.href;
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: redirectUrl, // Redirect back to current page after auth
              queryParams: {
                access_type: 'offline',
                prompt: 'consent',
                hd: 'poornima.edu.in' // Restrict to poornima.edu.in domain
              }
            }
          });

          if (error) {
            console.error('Google sign-in error:', error);
            alert('Failed to initiate Google sign-in: ' + error.message);
          }
        } catch (error) {
          console.error('Unexpected error during Google sign-in:', error);
          alert('An unexpected error occurred. Please try again.');
        }
      };
    }
  });
}
