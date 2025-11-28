import { Markdown } from './markdown.js';
import { VirtualList } from './virtual-list.js';

export const UI = {
    appContainer: document.getElementById('app'),
    virtualList: null,
    currentUser: null,

    clear() {
        this.appContainer.innerHTML = '';
    },

    showLoading() {
        this.appContainer.innerHTML = `
            <div class="loading-screen">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    },

    renderLogin() {
        this.clear();
        const loginDiv = document.createElement('div');
        loginDiv.className = 'auth-container';
        loginDiv.innerHTML = `
            <div class="auth-box">
                <h2>Welcome Back!</h2>
                <p class="auth-subtitle">We're so excited to see you again!</p>
                
                <form id="login-form">
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" id="email" required>
                    </div>
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="password" required>
                    </div>
                    <button type="submit" class="btn-primary">Log In</button>
                </form>

                <div class="auth-divider">
                    <span>OR</span>
                </div>

                <button id="google-btn" class="btn-secondary">
                    Sign in with Google
                </button>

                <p class="auth-footer">
                    Need an account? <a href="#" id="show-register">Register</a>
                </p>
            </div>
        `;
        this.appContainer.appendChild(loginDiv);
        return {
            form: loginDiv.querySelector('#login-form'),
            googleBtn: loginDiv.querySelector('#google-btn'),
            registerLink: loginDiv.querySelector('#show-register')
        };
    },

    renderRegister() {
        this.clear();
        const registerDiv = document.createElement('div');
        registerDiv.className = 'auth-container';
        registerDiv.innerHTML = `
            <div class="auth-box">
                <h2>Create an Account</h2>
                
                <form id="register-form">
                    <div class="input-group">
                        <label>Email</label>
                        <input type="email" id="reg-email" required>
                    </div>
                    <div class="input-group">
                        <label>Username</label>
                        <input type="text" id="reg-username" required>
                    </div>
                    <div class="input-group">
                        <label>Password</label>
                        <input type="password" id="reg-password" required>
                    </div>
                    <button type="submit" class="btn-primary">Continue</button>
                </form>

                <p class="auth-footer">
                    <a href="#" id="show-login">Already have an account?</a>
                </p>
            </div>
        `;
        this.appContainer.appendChild(registerDiv);
        return {
            form: registerDiv.querySelector('#register-form'),
            loginLink: registerDiv.querySelector('#show-login')
        };
    },

    renderAppShell(user, onEditMessage, onDeleteMessage, onReaction) {
        this.currentUser = user;
        this.clear();
        this.appContainer.innerHTML = `
            <nav class="server-sidebar" id="server-list">
                <!-- Servers will go here -->
            </nav>
            
            <div class="sidebar" id="channel-sidebar">
                <header class="sidebar-header">
                    <h3 id="server-name">Select a Server</h3>
                </header>
                <div class="channel-list" id="channel-list">
                    <!-- Channels -->
                </div>
                <div class="user-area">
                    <div class="user-info">
                        <img src="${user.photoURL || 'https://via.placeholder.com/32'}" alt="Avatar" class="avatar-sm">
                        <div class="name-tag">
                            <span class="username">${user.displayName || 'User'}</span>
                            <span class="discriminator">#${user.uid.substring(0, 4)}</span>
                        </div>
                    </div>
                    <div class="user-controls">
                        <button id="logout-btn" title="Logout">🛑</button>
                    </div>
                </div>
            </div>

            <main class="chat-area">
                <header class="chat-header">
                    <span class="channel-hash">#</span>
                    <h3 class="channel-name" id="channel-header-name">general</h3>
                </header>
                <div class="messages-wrapper" id="messages-list" style="position: relative; overflow-y: auto;">
                    <!-- Messages -->
                </div>
                <div class="chat-input-area">
                    <form class="chat-input-wrapper" id="message-form">
                        <button type="button" class="attach-btn" id="attach-btn">+</button>
                        <input type="file" id="file-input" style="display: none;">
                        <input type="text" placeholder="Message #general" id="message-input" autocomplete="off">
                    </form>
                    <div id="upload-progress" style="display: none; height: 4px; background: var(--brand-experiment); width: 0%; transition: width 0.2s;"></div>
                    <div id="typing-indicator" style="padding: 0 16px; height: 20px; font-size: 12px; color: var(--text-muted); font-weight: bold;"></div>
                </div>
            </main>

            <aside class="members-sidebar">
                <header class="members-header">Members</header>
                <div class="members-list" id="members-list">
                    <!-- Members -->
                </div>
            </aside>
        `;

        // Initialize VirtualList
        const container = document.getElementById('messages-list');
        this.virtualList = new VirtualList(container, (msg) => this.createMessageNode(msg), 60);

        // Event Delegation
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const messageId = btn.dataset.id;

            if (btn.classList.contains('delete-btn')) {
                if (confirm("Are you sure you want to delete this message?")) {
                    if (onDeleteMessage) onDeleteMessage(messageId);
                }
            } else if (btn.classList.contains('edit-btn')) {
                const content = btn.dataset.content;
                const newContent = prompt("Edit message:", content);
                if (newContent !== null && newContent.trim() !== content) {
                    if (onEditMessage) onEditMessage(messageId, newContent.trim());
                }
            } else if (btn.classList.contains('reaction-btn')) {
                const emoji = btn.dataset.emoji;
                if (onReaction) onReaction(messageId, emoji);
            } else if (btn.classList.contains('add-reaction-btn')) {
                const emoji = prompt("Enter emoji (e.g. 👍):");
                if (emoji) {
                    if (onReaction) onReaction(messageId, emoji);
                }
            }
        });

        return {
            logoutBtn: document.getElementById('logout-btn'),
            messageForm: document.getElementById('message-form'),
            messageInput: document.getElementById('message-input'),
            attachBtn: document.getElementById('attach-btn'),
            fileInput: document.getElementById('file-input'),
            progressBar: document.getElementById('upload-progress')
        };
    },

    renderServerList(servers, activeServerId, onServerClick, onAddServerClick) {
        const list = document.getElementById('server-list');
        list.innerHTML = '';

        // Home Icon (Placeholder)
        const homeIcon = document.createElement('div');
        homeIcon.className = 'server-icon home-icon';
        homeIcon.textContent = 'D';
        list.appendChild(homeIcon);

        const separator = document.createElement('div');
        separator.className = 'server-separator';
        list.appendChild(separator);

        servers.forEach(server => {
            const el = document.createElement('div');
            el.className = `server-icon ${server.id === activeServerId ? 'active' : ''}`;
            // If iconURL exists use img, else text
            if (server.iconURL) {
                el.style.backgroundImage = `url(${server.iconURL})`;
                el.style.backgroundSize = 'cover';
                el.innerText = '';
            } else {
                el.innerText = server.name.substring(0, 2).toUpperCase();
            }
            el.title = server.name;
            el.onclick = () => onServerClick(server);
            list.appendChild(el);
        });

        const addBtn = document.createElement('div');
        addBtn.className = 'server-icon add-server';
        addBtn.textContent = '+';
        addBtn.style.color = '#3ba55c';
        addBtn.onclick = onAddServerClick;
        list.appendChild(addBtn);
    },

    renderChannelList(channels, activeChannelId, onChannelClick) {
        const list = document.getElementById('channel-list');
        list.innerHTML = '';

        if (!channels || channels.length === 0) {
            list.innerHTML = '<div style="padding: 10px; color: var(--text-muted);">No channels</div>';
            return;
        }

        channels.forEach(channel => {
            const el = document.createElement('div');
            el.className = 'channel-item'; // Add styles for this
            el.style.padding = '8px';
            el.style.cursor = 'pointer';
            el.style.borderRadius = '4px';
            el.style.color = channel.id === activeChannelId ? 'var(--header-primary)' : 'var(--text-muted)';
            el.style.backgroundColor = channel.id === activeChannelId ? 'var(--bg-primary)' : 'transparent';
            el.style.marginBottom = '2px';

            el.innerHTML = `<span style="margin-right: 6px; font-size: 18px;">#</span> ${channel.name}`;

            el.onclick = () => onChannelClick(channel);
            el.onmouseover = () => { if (channel.id !== activeChannelId) el.style.backgroundColor = 'var(--bg-primary)'; };
            el.onmouseout = () => { if (channel.id !== activeChannelId) el.style.backgroundColor = 'transparent'; };

            list.appendChild(el);
        });
    },

    updateChannelHeader(channelName) {
        document.getElementById('channel-header-name').textContent = channelName;
        document.getElementById('message-input').placeholder = `Message #${channelName}`;
    },

    updateServerHeader(serverName) {
        document.getElementById('server-name').textContent = serverName;
    },

    updateTypingIndicator(users) {
        const el = document.getElementById('typing-indicator');
        if (!el) return;

        if (users.length === 0) {
            el.textContent = '';
        } else if (users.length === 1) {
            el.textContent = `${users[0]} is typing...`;
        } else if (users.length === 2) {
            el.textContent = `${users[0]} and ${users[1]} are typing...`;
        } else {
            el.textContent = 'Several people are typing...';
        }
    },

    createMessageNode(msg) {
        const el = document.createElement('div');
        el.className = 'message-item';
        el.style.padding = '8px 0';
        el.style.display = 'flex';
        el.style.position = 'relative';

        const date = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'Just now';
        const contentHtml = Markdown.parse(msg.content);
        const isOwner = this.currentUser && msg.authorId === this.currentUser.uid;

        let attachmentsHtml = '';
        if (msg.attachments && msg.attachments.length > 0) {
            msg.attachments.forEach(att => {
                if (att.type.startsWith('image/')) {
                    attachmentsHtml += `<div style="margin-top: 8px;"><img src="${att.url}" style="max-width: 300px; max-height: 300px; border-radius: 4px;"></div>`;
                } else if (att.type.startsWith('video/')) {
                    attachmentsHtml += `<div style="margin-top: 8px;"><video src="${att.url}" controls style="max-width: 300px; max-height: 300px; border-radius: 4px;"></video></div>`;
                } else {
                    attachmentsHtml += `<div style="margin-top: 8px;"><a href="${att.url}" target="_blank" style="color: var(--brand-experiment);">📄 ${att.name}</a></div>`;
                }
            });
        }

        // Reactions
        let reactionsHtml = '';
        if (msg.reactions) {
            reactionsHtml = '<div class="reactions-list" style="display: flex; gap: 4px; margin-top: 4px;">';
            for (const [emoji, users] of Object.entries(msg.reactions)) {
                const count = users.length;
                const hasReacted = this.currentUser && users.includes(this.currentUser.uid);
                const style = hasReacted
                    ? 'background: rgba(88, 101, 242, 0.15); border: 1px solid var(--brand-experiment);'
                    : 'background: var(--bg-secondary); border: 1px solid transparent;';

                reactionsHtml += `
                    <button class="reaction-btn" data-id="${msg.id}" data-emoji="${emoji}" 
                        style="${style} border-radius: 8px; padding: 2px 6px; cursor: pointer; color: var(--text-normal); font-size: 12px; display: flex; align-items: center; gap: 4px;">
                        <span>${emoji}</span>
                        <span style="font-weight: bold;">${count}</span>
                    </button>
                `;
            }
            reactionsHtml += `
                <button class="add-reaction-btn" data-id="${msg.id}" 
                    style="background: transparent; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; padding: 2px;">
                    +
                </button>
            `;
            reactionsHtml += '</div>';
        } else {
            reactionsHtml = `
                <div class="reactions-list" style="display: flex; gap: 4px; margin-top: 4px;">
                    <button class="add-reaction-btn" data-id="${msg.id}" 
                        style="background: transparent; border: none; cursor: pointer; color: var(--text-muted); font-size: 14px; padding: 2px;">
                        +
                    </button>
                </div>
            `;
        }

        let actionsHtml = '';
        if (isOwner) {
            actionsHtml = `
                <div class="message-actions" style="margin-left: auto; display: flex; gap: 8px;">
                    <button class="edit-btn" data-id="${msg.id}" data-content="${msg.content.replace(/"/g, '&quot;')}" style="background: none; border: none; cursor: pointer; color: var(--text-muted);">✏️</button>
                    <button class="delete-btn" data-id="${msg.id}" style="background: none; border: none; cursor: pointer; color: var(--text-muted);">🗑️</button>
                </div>
            `;
        }

        el.innerHTML = `
            <img src="${msg.authorAvatar || 'https://via.placeholder.com/40'}" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 16px;">
            <div class="message-content" style="flex: 1;">
                <div class="message-header" style="display: flex; align-items: baseline; margin-bottom: 4px;">
                    <span style="color: var(--header-primary); font-weight: bold; margin-right: 8px;">${msg.authorName}</span>
                    <span style="color: var(--text-muted); font-size: 12px;">${date}</span>
                    ${msg.editedAt ? '<span style="color: var(--text-muted); font-size: 10px; margin-left: 4px;">(edited)</span>' : ''}
                </div>
                <div class="message-body" style="color: var(--text-normal); white-space: pre-wrap;">${contentHtml}</div>
                ${attachmentsHtml}
                ${reactionsHtml}
            </div>
            ${actionsHtml}
        `;
        return el;
    },

    renderMessages(messages) {
        if (this.virtualList) {
            this.virtualList.setItems(messages);
        }
    }
};
