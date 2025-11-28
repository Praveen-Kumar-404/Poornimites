import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const auth = getAuth();
const db = getFirestore();

export const AuthService = {
    // Observer
    init(callback) {
        onAuthStateChanged(auth, callback);
    },

    // Sign Up
    async signUp(email, password, username) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Profile
            await updateProfile(user, { displayName: username });

            // Create User Document
            await setDoc(doc(db, 'users', user.uid), {
                username: username,
                email: email,
                photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${username}`,
                createdAt: serverTimestamp(),
                status: 'online'
            });

            return user;
        } catch (error) {
            console.error("Error signing up:", error);
            throw error;
        }
    },

    // Sign In
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing in:", error);
            throw error;
        }
    },

    // Google Sign In
    async signInWithGoogle() {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user doc exists, if not create it
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', user.uid), {
                    username: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    status: 'online'
                });
            }
            return user;
        } catch (error) {
            console.error("Error with Google Sign In:", error);
            throw error;
        }
    },

    // Sign Out
    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    },

    getCurrentUser() {
        return auth.currentUser;
    }
};
