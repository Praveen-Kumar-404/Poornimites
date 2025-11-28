// auth.js - Updated to use centralized Firebase initialization
import { app } from "./shared/firebase-init.js";
import { auth, db } from "./shared/auth-manager.js";
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const provider = new GoogleAuthProvider();

// Restrict signup domain
const allowedDomain = "poornima.edu.in";

// Set Google Auth to only allow poornima.edu.in domain
provider.setCustomParameters({
  hd: allowedDomain
});

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
      // Get current page path
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      // Redirect to auth page with current page as redirect parameter
      window.location.href = `auth.html?redirect=${encodeURIComponent(currentPage)}`;
    };
  }
});
