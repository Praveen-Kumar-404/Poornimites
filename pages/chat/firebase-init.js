// firebase-init.js — must run first on any page that uses Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase Configuration
export const firebaseConfig = {
    apiKey: "AIzaSyA5wdR7hw8OeMInj7MPCzwg2N40PmWJ19E",
    authDomain: "poornimites-2bbe7.firebaseapp.com",
    projectId: "poornimites-2bbe7",
    storageBucket: "poornimites-2bbe7.appspot.com",
    messagingSenderId: "597165564910",
    appId: "1:597165564910:web:4d87e756fa1250359324ff",
    measurementId: "G-2M98Z8JY7Q"
};

// Initialize Firebase - creates DEFAULT app
export const app = initializeApp(firebaseConfig);

// Initialize services with the app instance
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log('Firebase initialized successfully');
