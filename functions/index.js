const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// On User Create: Create a user document in Firestore
exports.onUserCreate = functions.auth.user().onCreate((user) => {
    return db.collection("users").doc(user.uid).set({
        email: user.email,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "https://via.placeholder.com/150",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "online", // Default status
    });
});

// On User Delete: Clean up user document
exports.onUserDelete = functions.auth.user().onDelete((user) => {
    return db.collection("users").doc(user.uid).delete();
});

// Example: Send Notification (Placeholder)
exports.sendNotification = functions.firestore
    .document("servers/{serverId}/channels/{channelId}/messages/{messageId}")
    .onCreate((snap, context) => {
        const message = snap.data();
        console.log("New message:", message.content);
        // TODO: Implement FCM logic
        return null;
    });
