
import { supabase } from '../../assets/js/supabase-init.js';

export const AuthService = {
    // Observer
    init(callback) {
        supabase.auth.onAuthStateChange((event, session) => {
            const user = session ? session.user : null;
            callback(user);
        });
    },

    // Sign Up
    async signUp(email, password, username) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: username,
                        full_name: username
                    }
                }
            });

            if (error) throw error;
            const user = data.user;

            // Create User Document (Public Profile)
            if (user) {
                const { error: dbError } = await supabase
                    .from('users')
                    .upsert({
                        id: user.id,
                        username: username,
                        email: email,
                        photo_url: `https://ui-avatars.com/api/?name=${username}`,
                        created_at: new Date().toISOString(),
                        status: 'online'
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
                    queryParams: {
                        hd: "poornima.edu.in"
                    }
                }
            });

            if (error) throw error;
            // Note: This often triggers a redirect
            return null;
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
