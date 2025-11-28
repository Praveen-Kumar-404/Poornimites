// assets/js/shared/auth-manager.js
// Centralized authentication manager
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { app } from "./firebase-init.js"; // Import initialized app

// Export auth and db instances
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Auth and Firestore services initialized");
