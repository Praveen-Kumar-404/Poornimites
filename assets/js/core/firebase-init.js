// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyA5wdR7hw8OeMInj7MPCzwg2N40PmWJ19E",
    authDomain: "poornimites-2bbe7.firebaseapp.com",
    projectId: "poornimites-2bbe7",
    storageBucket: "poornimites-2bbe7.firebasestorage.app",
    messagingSenderId: "597165564910",
    appId: "1:597165564910:web:4d87e756fa1250359324ff",
    measurementId: "G-2M98Z8JY7Q"
};

// Warn if using placeholder values
if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn("⚠️ Firebase is not configured! Please update firebase-init.js with your Firebase project config.");
    console.warn("Find your config at: Firebase Console > Project Settings > General > Your Apps");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Export Firestore functions for convenience
export { collection, addDoc, getDocs, query, where, updateDoc, doc, orderBy };

console.log("✅ Firebase initialized");
