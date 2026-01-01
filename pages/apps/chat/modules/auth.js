import { supabase } from '../../../assets/js/supabase-init.js';

export const AuthService = {
    // Observer
    init(callback) {
        // Initial check
        supabase.auth.getSession().then(({ data: { session } }) => {
            callback(session?.user || null);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user || null);
        });

        // Store subscription to unsubscribe later if needed (though not exposed in current API)
        this._subscription = subscription;
    },

    // Sign Up
    async signUp(email, password, username) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: username, // Supabase stores metadata here
                        display_name: username
                    }
                }
            });

            if (error) throw error;
            const user = data.user;

            if (user) {
                // Create User Document in 'users' table
                const { error: dbError } = await supabase
                    .from('users')
                    .upsert({
                        id: user.id,
                        username: username,
                        email: email,
                        photo_url: `https://ui-avatars.com/api/?name=${username}`,
                        status: 'online',
                        // created_at is automatic usually, but we can send if needed
                    });

                if (dbError) console.error("Error creating user profile:", dbError);
            }

            return user;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    },

    // Sign In
    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error) throw error;
            return data.user;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    },

    // Google Sign In
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/chat.html' // or just current page
                }
            });
            if (error) throw error;
            // Note: This will redirect away, so subsequent code might not run until return
        } catch (error) {
            console.error("Error with Google Sign In:", error);
            throw error;
        }
    },

    // Sign Out
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    }
};
