// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA5wdR7hw8OeMInj7MPCzwg2N40PmWJ19E",
  authDomain: "poornimites-2bbe7.firebaseapp.com",
  projectId: "poornimites-2bbe7",
  storageBucket: "poornimites-2bbe7.appspot.com",
  messagingSenderId: "597165564910",
  appId: "1:597165564910:web:4d87e756fa1250359324ff",
  measurementId: "G-2M98Z8JY7Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Restrict signup domain
const allowedDomain = "poornima.edu.in";

// Email/password registration
export async function register(email, password) {
  const domain = email.split("@")[1];
  if (domain !== allowedDomain) {
    throw new Error("Only poornima.edu.in emails are allowed");
  }
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Google sign-in/out button logic
const authBtn = document.getElementById("auth-btn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    authBtn.textContent = "🚪";
    authBtn.href = "#";
    authBtn.onclick = (e) => {
      e.preventDefault();
      signOut(auth)
        .then(() => alert("Logged out successfully"))
        .catch((err) => {
          console.error(err);
          alert("Logout failed");
        });
    };
  } else {
    authBtn.textContent = "👤";
    authBtn.href = "#";
    authBtn.onclick = (e) => {
      e.preventDefault();
      signInWithPopup(auth, provider)
        .then((result) => {
          alert(`Welcome ${result.user.displayName}`);
        })
        .catch((error) => {
          console.error(error);
          alert("Login failed");
        });
    };
  }
});
