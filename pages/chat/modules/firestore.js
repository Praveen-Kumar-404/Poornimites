import {
    collection,
    addDoc,
    getDocs,
    onSnapshot,
    query,
    orderBy,
    where,
    serverTimestamp,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    setDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from '../firebase-init.js';

export const FirestoreService = {
    // Servers
    async createServer(name, ownerId) {
        try {
            const serverRef = await addDoc(collection(db, 'servers'), {
                name: name,
                ownerId: ownerId,
                createdAt: serverTimestamp(),
                iconURL: `https://ui-avatars.com/api/?name=${name}&background=random`
            });

            // Create default 'general' channel
            await addDoc(collection(db, 'servers', serverRef.id, 'channels'), {
                name: 'general',
                type: 'text',
                createdAt: serverTimestamp()
            });

            return serverRef.id;
        } catch (error) {
            console.error("Error creating server:", error);
            throw error;
        }
    },

    getServers(callback) {
        // For now, get all servers (public style) or implement membership logic
        const q = query(collection(db, 'servers'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const servers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(servers);
        });
    },

    // Channels
    getChannels(serverId, callback) {
        const q = query(
            collection(db, 'servers', serverId, 'channels'),
            orderBy('createdAt', 'asc')
        );
        return onSnapshot(q, (snapshot) => {
            const channels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(channels);
        });
    },

    // Messages
    async sendMessage(serverId, channelId, content, user, attachments = []) {
        try {
            await addDoc(collection(db, 'servers', serverId, 'channels', channelId, 'messages'), {
                content: content,
                authorId: user.uid,
                authorName: user.displayName,
                authorAvatar: user.photoURL,
                createdAt: serverTimestamp(),
                type: attachments.length > 0 ? 'media' : 'text',
                attachments: attachments
            });
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    },

    async updateMessage(serverId, channelId, messageId, newContent) {
        try {
            const msgRef = doc(db, 'servers', serverId, 'channels', channelId, 'messages', messageId);
            await updateDoc(msgRef, {
                content: newContent,
                editedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating message:", error);
            throw error;
        }
    },

    async deleteMessage(serverId, channelId, messageId) {
        try {
            const msgRef = doc(db, 'servers', serverId, 'channels', channelId, 'messages', messageId);
            await deleteDoc(msgRef);
        } catch (error) {
            console.error("Error deleting message:", error);
            throw error;
        }
    },

    getMessages(serverId, channelId, callback) {
        const q = query(
            collection(db, 'servers', serverId, 'channels', channelId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            callback(messages);
        });
    },

    // Typing Indicators
    async setTypingStatus(serverId, channelId, user, isTyping) {
        const typingRef = doc(db, 'servers', serverId, 'channels', channelId, 'typing', user.uid);
        if (isTyping) {
            await setDoc(typingRef, {
                displayName: user.displayName,
                timestamp: serverTimestamp()
            });
        } else {
            await deleteDoc(typingRef);
        }
    },

    subscribeToTyping(serverId, channelId, callback) {
        const q = collection(db, 'servers', serverId, 'channels', channelId, 'typing');
        return onSnapshot(q, (snapshot) => {
            const typingUsers = [];
            snapshot.forEach((doc) => {
                // In a real app, filter by timestamp to avoid stuck indicators
                typingUsers.push(doc.data().displayName);
            });
            callback(typingUsers);
        });
    },

    // Reactions
    async toggleReaction(serverId, channelId, messageId, emoji, user) {
        const msgRef = doc(db, 'servers', serverId, 'channels', channelId, 'messages', messageId);
        const msgSnap = await getDoc(msgRef);
        if (!msgSnap.exists()) return;

        const data = msgSnap.data();
        const reactions = data.reactions || {};
        const userList = reactions[emoji] || [];

        if (userList.includes(user.uid)) {
            // Remove reaction
            reactions[emoji] = userList.filter(uid => uid !== user.uid);
            if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
            // Add reaction
            if (!reactions[emoji]) reactions[emoji] = [];
            reactions[emoji].push(user.uid);
        }

        await updateDoc(msgRef, { reactions });
    }
};
