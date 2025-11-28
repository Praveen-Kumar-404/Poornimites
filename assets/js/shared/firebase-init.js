// assets/js/shared/firebase-init.js
// Single source of truth for Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

export const firebaseConfig = {
    apiKey: "AIzaSyA5wdR7hw8OeMInj7MPCzwg2N40PmWJ19E",
    authDomain: "poornimites-2bbe7.firebaseapp.com",
    projectId: "poornimites-2bbe7",
    storageBucket: "poornimites-2bbe7.appspot.com",
    messagingSenderId: "597165564910",
    appId: "1:597165564910:web:4d87e756fa1250359324ff",
    measurementId: "G-2M98Z8JY7Q"
};

// Create and export the DEFAULT Firebase app
export const app = initializeApp(firebaseConfig);

console.log("Firebase initialized:", app.name, app.options.projectId);
