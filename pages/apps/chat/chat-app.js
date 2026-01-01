// Import supabase-init FIRST to ensure Supabase is initialized
import '../../assets/js/supabase-init.js';
import { AuthService } from './modules/auth.js';
import { UI } from './modules/ui.js';
import { FirestoreService } from './modules/firestore.js';
import { StorageService } from './modules/storage.js';
import { stateManager } from './modules/state-manager.js';
import { presenceSimulator } from './modules/presence-simulator.js';

// Global State
const state = {
    user: null,
    currentServer: null,
    currentChannel: null,
    typingUnsubscribe: null
};

// Initialize App
function init() {
    UI.showLoading();

    AuthService.init((user) => {
        if (user) {
            console.log('User signed in:', user.id);
            state.user = user;
            stateManager.setCurrentUser(user);
            loadApp();
        } else {
            console.log('No user signed in, entering as Guest');
            const guestUser = {
                id: 'guest-' + Math.floor(Math.random() * 1000000),
                email: 'guest@poornimites.com',
                user_metadata: {
                    full_name: 'Guest User',
                    avatar_url: 'https://ui-avatars.com/api/?name=Guest+User'
                }
            };
            state.user = guestUser;
            stateManager.setCurrentUser(guestUser);
            loadApp();
        }
    });

    // Subscribe to state changes for members list updates
    stateManager.subscribe((newState) => {
        if (newState.members && newState.members.length > 0) {
            UI.renderMembersList(newState.members);
        }
    });
}

function showLogin() {
    const { form, googleBtn, registerLink } = UI.renderLogin();

    // Login Form Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;

        try {
            await AuthService.signIn(email, password);
        } catch (error) {
            alert(error.message);
        }
    });

    // Google Sign In
    googleBtn.addEventListener('click', async () => {
        try {
            await AuthService.signInWithGoogle();
        } catch (error) {
            alert(error.message);
        }
    });

    // Switch to Register
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegister();
    });
}

function showRegister() {
    const { form, loginLink } = UI.renderRegister();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = form.querySelector('#reg-email').value;
        const username = form.querySelector('#reg-username').value;
        const password = form.querySelector('#reg-password').value;

        try {
            await AuthService.signUp(email, password, username);
        } catch (error) {
            alert(error.message);
        }
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
}

function loadApp() {
    const { logoutBtn, messageForm, messageInput, attachBtn, fileInput, progressBar } = UI.renderAppShell(
        state.user,
        // On Edit
        async (messageId, newContent) => {
            try {
                await FirestoreService.updateMessage(state.currentServer.id, state.currentChannel.id, messageId, newContent);
            } catch (error) {
                console.error(error);
                alert("Failed to update message");
            }
        },
        // On Delete
        async (messageId) => {
            try {
                await FirestoreService.deleteMessage(state.currentServer.id, state.currentChannel.id, messageId);
            } catch (error) {
                console.error(error);
                alert("Failed to delete message");
            }
        },
        // On Reaction
        async (messageId, emoji) => {
            try {
                await FirestoreService.toggleReaction(state.currentServer.id, state.currentChannel.id, messageId, emoji, state.user);
            } catch (error) {
                console.error(error);
            }
        }
    );

    // Logout
    logoutBtn.addEventListener('click', async () => {
        try {
            await AuthService.logout();
        } catch (error) {
            console.error(error);
        }
    });

    // Attach Button
    attachBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // File Upload
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!state.currentServer || !state.currentChannel) {
            alert("Select a channel first!");
            return;
        }

        const uploadProgress = document.getElementById('upload-progress');
        uploadProgress.style.display = 'block';
        const path = `servers/${state.currentServer.id}/channels/${state.currentChannel.id}/${Date.now()}_${file.name}`;

        try {
            const result = await StorageService.uploadFile(file, path, (progress) => {
                progressBar.style.width = `${progress}%`;
            });

            // Send message with attachment
            await FirestoreService.sendMessage(
                state.currentServer.id,
                state.currentChannel.id,
                "", // Empty content for file-only message
                state.user,
                [result]
            );

            uploadProgress.style.display = 'none';
            progressBar.style.width = '0%';
            fileInput.value = ''; // Reset
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
            uploadProgress.style.display = 'none';
        }
    });

    // Load Servers
    FirestoreService.getServers((servers) => {
        stateManager.setServers(servers);

        // Auto-select first server if none selected
        if (!state.currentServer && servers.length > 0) {
            selectServer(servers[0]);
        }

        UI.renderServerList(
            servers,
            state.currentServer?.id,
            (server) => selectServer(server),
            () => {
                const name = prompt("Enter Server Name:");
                if (name) FirestoreService.createServer(name, state.user.id);
            }
        );
    });

    // Message Sending
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = messageInput.value.trim();
        if (!content || !state.currentServer || !state.currentChannel) return;

        try {
            // Optimistic UI - add message immediately
            const tempId = 'temp_' + Date.now();
            const optimisticMessage = {
                id: tempId,
                content: content,
                authorId: state.user.id,
                authorName: state.user.user_metadata?.full_name || state.user.email,
                authorAvatar: state.user.user_metadata?.avatar_url,
                createdAt: new Date(),
                type: 'text',
                attachments: []
            };

            // Add to state
            stateManager.addMessage(state.currentChannel.id, optimisticMessage);

            // Render messages
            const messages = stateManager.getChannelMessages(state.currentChannel.id);
            UI.renderMessages(messages);

            // Scroll to bottom
            UI.scrollToBottom();

            // Clear input
            messageInput.value = '';
            messageInput.style.height = 'auto';

            // Send to Firebase
            await FirestoreService.sendMessage(state.currentServer.id, state.currentChannel.id, content, state.user);

            // Remove temp message (real one will come from listener)
            stateManager.deleteMessage(state.currentChannel.id, tempId);
        } catch (error) {
            console.error("Failed to send message:", error);
            // Remove optimistic message on error
            stateManager.deleteMessage(state.currentChannel.id, tempId);
            UI.renderMessages(stateManager.getChannelMessages(state.currentChannel.id));
        }
    });

    // Keyboard shortcuts
    messageInput.addEventListener('keydown', (e) => {
        // Enter = send (unless Shift is held)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
        // Esc = clear
        else if (e.key === 'Escape') {
            messageInput.value = '';
            messageInput.style.height = 'auto';
        }
    });

    // Typing Input Listener
    messageInput.addEventListener('input', () => {
        handleTyping();
    });
}

let typingTimeout;
function handleTyping() {
    if (!state.currentServer || !state.currentChannel) return;

    FirestoreService.setTypingStatus(state.currentServer.id, state.currentChannel.id, state.user, true);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        FirestoreService.setTypingStatus(state.currentServer.id, state.currentChannel.id, state.user, false);
    }, 2000);
}

function selectServer(server) {
    state.currentServer = server;
    stateManager.setActiveServer(server.id);
    UI.updateServerHeader(server.name);

    // Load Channels
    FirestoreService.getChannels(server.id, (channels) => {
        stateManager.setChannels(channels);

        if (channels.length > 0) {
            // Auto-select 'general' or first channel
            const general = channels.find(c => c.name === 'general') || channels[0];
            selectChannel(general);
        } else {
            state.currentChannel = null;
            UI.renderChannelList([], null, null);
            UI.renderMessages([]);
        }

        UI.renderChannelList(
            channels,
            state.currentChannel?.id,
            (channel) => selectChannel(channel)
        );
    });

    // Load mock members for demo
    loadMockMembers(server.id);
}

function selectChannel(channel) {
    state.currentChannel = channel;
    stateManager.setActiveChannel(channel.id);
    UI.updateChannelHeader(channel.name);

    // Update active state in channel list
    const channelItems = document.querySelectorAll('.channel-item');
    channelItems.forEach(item => {
        item.setAttribute('aria-current', item.dataset.id === channel.id);
    });

    // Load Messages
    FirestoreService.getMessages(state.currentServer.id, channel.id, (messages) => {
        stateManager.setChannelMessages(channel.id, messages);
        UI.renderMessages(messages);

        // Scroll to bottom when opening channel
        setTimeout(() => UI.scrollToBottom(), 100);
    });

    // Typing Indicators
    if (state.typingUnsubscribe) {
        state.typingUnsubscribe();
    }
    state.typingUnsubscribe = FirestoreService.subscribeToTyping(state.currentServer.id, channel.id, (users) => {
        // Filter out self
        const others = users.filter(name => name !== (state.user.user_metadata?.full_name || state.user.email));
        UI.updateTypingIndicator(others);
    });
}

// Load mock members for demo purposes
function loadMockMembers(serverId) {
    const mockMembers = [
        { id: '1', username: state.user.user_metadata?.full_name || state.user.email, role: 'owner' },
        { id: '2', username: 'Alice Johnson', role: 'admin' },
        { id: '3', username: 'Bob Smith', role: 'member' },
        { id: '4', username: 'Carol White', role: 'member' },
        { id: '5', username: 'David Brown', role: 'member' },
        { id: '6', username: 'Eve Davis', role: 'member' },
        { id: '7', username: 'Frank Wilson', role: 'member' },
        { id: '8', username: 'Grace Lee', role: 'member' }
    ];

    stateManager.setMembers(mockMembers);
    UI.renderMembersList(mockMembers);

    // Start presence simulation
    presenceSimulator.start(mockMembers);
}

init();
