// Set Google Auth to only allow poornima.edu.in domain
googleProvider.setCustomParameters({
    hd: allowedDomain
});

// Get redirect URL from query parameter
function getRedirectUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('redirect') || 'index.html';
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    }
}

// Show loading state
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Create user document in Firestore
async function createUserDocument(user, username = null) {
    try {
        await setDoc(doc(db, 'users', user.uid), {
            username: username || user.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${username || user.displayName || 'User'}`,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            status: 'online'
        }, { merge: true });
    } catch (error) {
        console.error("Error creating user document:", error);
    }
}

// Handle successful authentication
async function handleAuthSuccess(user, username = null) {
    await createUserDocument(user, username);

    // Add success animation
    const authCard = document.querySelector('.auth-card');
    if (authCard) {
        authCard.classList.add('success');
    }

    // Redirect after short delay
    setTimeout(() => {
        window.location.href = getRedirectUrl();
    }, 500);
}

// Email/Password Login
export async function handleLogin(email, password, button) {
    setLoading(button, true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user);
    } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Login failed. Please try again.";

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = "No account found with this email.";
                break;
            case 'auth/wrong-password':
                errorMessage = "Incorrect password.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address.";
                break;
            case 'auth/user-disabled':
                errorMessage = "This account has been disabled.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many failed attempts. Please try again later.";
                break;
        }

        showError(errorMessage);
        setLoading(button, false);
    }
}

// Email/Password Signup
export async function handleSignup(email, password, username, button) {
    setLoading(button, true);

    // Validate email domain
    const domain = email.split("@")[1];
    if (domain !== allowedDomain) {
        showError(`Only ${allowedDomain} emails are allowed.`);
        setLoading(button, false);
        return;
    }

    // Validate password strength
    if (password.length < 6) {
        showError("Password must be at least 6 characters long.");
        setLoading(button, false);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleAuthSuccess(userCredential.user, username);
    } catch (error) {
        console.error("Signup error:", error);
        let errorMessage = "Signup failed. Please try again.";

        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = "An account with this email already exists.";
                break;
            case 'auth/invalid-email':
                errorMessage = "Invalid email address.";
                break;
            case 'auth/operation-not-allowed':
                errorMessage = "Email/password accounts are not enabled.";
                break;
            case 'auth/weak-password':
                errorMessage = "Password is too weak. Use at least 6 characters.";
                break;
        }

        showError(errorMessage);
        setLoading(button, false);
    }
}

// Google Sign In
export async function handleGoogleSignIn(button) {
    setLoading(button, true);

    try {
        const result = await signInWithPopup(auth, googleProvider);

        // Verify domain
        const email = result.user.email;
        const domain = email.split("@")[1];

        if (domain !== allowedDomain) {
            await auth.signOut();
            showError(`Only ${allowedDomain} emails are allowed.`);
            setLoading(button, false);
            return;
        }

        await handleAuthSuccess(result.user);
    } catch (error) {
        console.error("Google sign-in error:", error);
        let errorMessage = "Google sign-in failed. Please try again.";

        switch (error.code) {
            case 'auth/popup-closed-by-user':
                errorMessage = "Sign-in popup was closed.";
                break;
            case 'auth/popup-blocked':
                errorMessage = "Sign-in popup was blocked by your browser.";
                break;
            case 'auth/cancelled-popup-request':
                errorMessage = "Sign-in was cancelled.";
                break;
        }

        showError(errorMessage);
        setLoading(button, false);
    }
}

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is already logged in, redirect immediately
        window.location.href = getRedirectUrl();
    }
});

// Export auth instance for other modules
export { auth, db };
