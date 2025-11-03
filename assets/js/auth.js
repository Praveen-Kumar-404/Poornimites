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
import { getFirestore, doc, setDoc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

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
const db = getFirestore(app);
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

// Track user login session
async function trackUserSession(user) {
  try {
    // Create a user session document
    const sessionData = {
      userId: user.uid,
      email: user.email,
      displayName: user.displayName,
      loginTime: serverTimestamp(),
      lastActive: serverTimestamp(),
      browser: navigator.userAgent,
      platform: navigator.platform
    };
    
    // Store in Firestore
    await setDoc(doc(db, "userSessions", `${user.uid}_${Date.now()}`), sessionData);
    
    // Update user's last login in users collection
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: user.displayName,
      lastLogin: serverTimestamp(),
      photoURL: user.photoURL || null
    }, { merge: true });
    
    // Set up activity tracking
    const activityInterval = setInterval(async () => {
      if (auth.currentUser) {
        await updateDoc(doc(db, "users", user.uid), {
          lastActive: serverTimestamp()
        });
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

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Track user login
    trackUserSession(user);
    
    authBtn.textContent = "🚪";
    authBtn.href = "#";
    authBtn.onclick = (e) => {
      e.preventDefault();
      signOut(auth)
        .then(() => {
          // Record logout time
          if (user && user.uid) {
            updateDoc(doc(db, "users", user.uid), {
              lastLogout: serverTimestamp()
            }).catch(err => console.error("Error recording logout time:", err));
          }
          alert("Logged out successfully");
        })
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
