import { Markdown } from './markdown.js';
import { VirtualList } from './virtual-list.js';
import { stateManager } from './state-manager.js';

export const UI = {
    appContainer: document.getElementById('chat-root'),
    virtualList: null,
    currentUser: null,
    messageContainer: null,
    newMessagesBadge: null,

    clear() {
        this.appContainer.innerHTML = '';
    },

    showLoading() {
        this.clear();
        this.appContainer.innerHTML = `
            <div class="auth-container">
                <div style="text-align: center;">
                    <div class="loading-spinner" style="width: 50px; height: 50px; border-width: 4px; margin: 0 auto 20px;"></div>
                    <p style="color: var(--color-text-muted);">Loading...</p>
                </div>
            </div>
        `;
    },

    renderLogin() {
        this.clear();
        this.appContainer.innerHTML = `
            <div class="auth-container">
                <div class="auth-box">
                    <h2>Welcome Back!</h2>
                    <p class="auth-subtitle">We're so excited to see you again!</p>
                    <form id="login-form">
                        <div class="input-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" required autocomplete="email">
                        </div>
                        <div class="input-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" required autocomplete="current-password">
                        </div>
                        <button type="submit" class="btn-primary">Log In</button>
                    </form>
                    <div class="auth-divider"><span>OR</span></div>
                    <button id="google-signin-btn" class="btn-secondary">Sign in with Google</button>
                    <p class="auth-footer">
                        Need an account? <a href="#" id="register-link">Register</a>
                    </p>
                </div>
            </div>
        `;

        return {
            form: document.getElementById('login-form'),
            googleBtn: document.getElementById('google-signin-btn'),
            registerLink: document.getElementById('register-link')
        };
    },

    renderRegister() {
        this.clear();
        this.appContainer.innerHTML = `
            <div class="auth-container">
                <div class="auth-box">
                    <h2>Create an account</h2>
                    <p class="auth-subtitle">Join the community!</p>
                    <form id="register-form">
                        <div class="input-group">
                            <label for="reg-email">Email</label>
                            <input type="email" id="reg-email" required autocomplete="email">
                        </div>
                        <div class="input-group">
                            <label for="reg-username">Username</label>
                            <input type="text" id="reg-username" required autocomplete="username">
                        </div>
                        <div class="input-group">
                            <label for="reg-password">Password</label>
                            <input type="password" id="reg-password" required autocomplete="new-password">
                        </div>
                        <button type="submit" class="btn-primary">Continue</button>
                    </form>
                    <p class="auth-footer">
                        Already have an account? <a href="#" id="login-link">Log In</a>
                    </p>
                </div>
            </div>
        `;

        return {
            form: document.getElementById('register-form'),
            loginLink: document.getElementById('login-link')
        };
    },

    renderAppShell(user, onEditMessage, onDeleteMessage, onReaction) {
        this.currentUser = user;
        this.clear();

        this.appContainer.innerHTML = `
            <div class="chat-container">
                <!-- Servers Column -->
                <div class="servers-column">
                    <div class="server-list" id="server-list"></div>
                </div>

                <!-- Channels Column -->
                <div class="channels-column">
                    <div class="server-header">
                        <span class="server-name" id="server-name">Select a Server</span>
                    </div>
                    <div class="channels-list" id="channels-list"></div>
                    <div class="user-area">
                        <div class="user-avatar">${this.getInitials(user.displayName)}</div>
                        <div class="user-info">
                            <div class="user-name">${user.displayName}</div>
                            <div class="user-discriminator">#${this.generateDiscriminator()}</div>
                        </div>
                        <div class="user-controls">
                            <button class="user-control-btn" id="logout-btn" title="Logout">🚪</button>
                        </div>
                    </div>
                </div>

                <!-- Message Pane -->
                <div class="message-pane">
                    <div class="channel-header">
                        <span class="channel-header-hash">#</span>
                        <span class="channel-header-name" id="channel-name">general</span>
                        <span class="channel-topic" id="channel-topic">Welcome to the channel!</span>
                    </div>
                    <div class="messages-container" id="messages-container">
                        <div class="message-list" id="messages-list"></div>
                        <div class="new-messages-badge" id="new-messages-badge">New messages ↓</div>
                    </div>
                    <div class="message-input-container">
                        <form id="message-form">
                            <div class="message-input-wrapper">
                                <button type="button" class="attach-btn" id="attach-btn">+</button>
                                <textarea 
                                    id="message-input" 
                                    class="message-input" 
                                    placeholder="Message #general"
                                    rows="1"
                                ></textarea>
                                <input type="file" id="file-input" style="display: none;">
                            </div>
                        </form>
                        <div class="upload-progress" id="upload-progress" style="display: none;">
                            <div class="upload-progress-header">
                                <span class="upload-progress-title">Uploading...</span>
                            </div>
                            <div class="upload-progress-bar">
                                <div class="upload-progress-fill" id="upload-progress-fill"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Members Column -->
                <div class="members-column">
                    <div class="members-header">Members</div>
                    <div class="members-list" id="members-list"></div>
                </div>
            </div>
        `;

        // Store references
        this.messageContainer = document.getElementById('messages-container');
        this.newMessagesBadge = document.getElementById('new-messages-badge');

        // Set up message input autosizing
        const messageInput = document.getElementById('message-input');
        messageInput.addEventListener('input', () => this.autosizeTextarea(messageInput));

        // Set up scroll detection
        this.messageContainer.addEventListener('scroll', () => this.handleScroll());

        // Set up new messages badge click
        this.newMessagesBadge.addEventListener('click', () => this.scrollToBottom());

        // Set up event delegation for message actions
        const messagesList = document.getElementById('messages-list');
        messagesList.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            const reactionBtn = e.target.closest('.reaction-btn');
            const addReactionBtn = e.target.closest('.add-reaction-btn');

            if (editBtn) {
                const messageId = editBtn.dataset.id;
                const currentContent = editBtn.dataset.content;
                const newContent = prompt('Edit message:', currentContent);
                if (newContent && newContent !== currentContent) {
                    onEditMessage(messageId, newContent);
                }
            } else if (deleteBtn) {
                const messageId = deleteBtn.dataset.id;
                if (confirm('Delete this message?')) {
                    onDeleteMessage(messageId);
                }
            } else if (reactionBtn) {
                const messageId = reactionBtn.dataset.id;
                const emoji = reactionBtn.dataset.emoji;
                onReaction(messageId, emoji);
            } else if (addReactionBtn) {
                const messageId = addReactionBtn.dataset.id;
                const emoji = prompt('Enter emoji:');
                if (emoji) {
                    onReaction(messageId, emoji);
                }
            }
        });

        return {
            logoutBtn: document.getElementById('logout-btn'),
            messageForm: document.getElementById('message-form'),
            messageInput: messageInput,
            attachBtn: document.getElementById('attach-btn'),
            fileInput: document.getElementById('file-input'),
            progressBar: document.getElementById('upload-progress-fill')
        };
    },

    // Autosize textarea
    autosizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 96); // max 4 lines
        textarea.style.height = newHeight + 'px';
    },

    // Handle scroll detection
    handleScroll() {
        if (!this.messageContainer) return;

        const { scrollTop, scrollHeight, clientHeight } = this.messageContainer;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

        stateManager.setScrolledUp(!isAtBottom);

        if (isAtBottom && this.newMessagesBadge) {
            this.newMessagesBadge.classList.remove('visible');
        }
    },

    // Scroll to bottom
    scrollToBottom(smooth = false) {
        if (!this.messageContainer) return;

        this.messageContainer.scrollTo({
            top: this.messageContainer.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        });

        if (this.newMessagesBadge) {
            this.newMessagesBadge.classList.remove('visible');
        }
    },

    // Show new messages badge
    showNewMessagesBadge() {
        if (stateManager.isScrolledUp() && this.newMessagesBadge) {
            this.newMessagesBadge.classList.add('visible');
        }
    },

    // Render server list
    renderServerList(servers, activeServerId, onServerClick, onAddServer) {
        const serverList = document.getElementById('server-list');
        if (!serverList) return;

        serverList.innerHTML = servers.map(server => `
            <div class="server-item ${server.id === activeServerId ? 'active' : ''}" 
                 data-id="${server.id}"
                 title="${server.name}">
                <div class="server-icon">${this.getInitials(server.name)}</div>
            </div>
        `).join('');

        serverList.innerHTML += `
            <div class="server-separator"></div>
            <button class="add-server-btn" id="add-server-btn" title="Add a Server">+</button>
        `;

        // Add click handlers
        serverList.querySelectorAll('.server-item').forEach(item => {
            item.addEventListener('click', () => {
                const serverId = item.dataset.id;
                const server = servers.find(s => s.id === serverId);
                if (server) onServerClick(server);
            });
        });

        const addBtn = document.getElementById('add-server-btn');
        if (addBtn) {
            addBtn.addEventListener('click', onAddServer);
        }
    },

    // Update server header
    updateServerHeader(serverName) {
        const serverNameEl = document.getElementById('server-name');
        if (serverNameEl) {
            serverNameEl.textContent = serverName;
        }
    },

    // Render channel list
    renderChannelList(channels, activeChannelId, onChannelClick) {
        const channelsList = document.getElementById('channels-list');
        if (!channelsList) return;

        // Group channels by category
        const textChannels = channels.filter(c => c.type !== 'voice');

        channelsList.innerHTML = `
            <div class="channel-category">
                <div class="category-header">
                    <span>Text Channels</span>
                </div>
                ${textChannels.map(channel => `
                    <div class="channel-item" 
                         data-id="${channel.id}"
                         aria-current="${channel.id === activeChannelId}">
                        <span class="channel-hash">#</span>
                        <span>${channel.name}</span>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers
        channelsList.querySelectorAll('.channel-item').forEach(item => {
            item.addEventListener('click', () => {
                const channelId = item.dataset.id;
                const channel = channels.find(c => c.id === channelId);
                if (channel) onChannelClick(channel);
            });
        });
    },

    // Update channel header
    updateChannelHeader(channelName, topic = 'Welcome to the channel!') {
        const channelNameEl = document.getElementById('channel-name');
        const channelTopicEl = document.getElementById('channel-topic');
        const messageInput = document.getElementById('message-input');

        if (channelNameEl) {
            channelNameEl.textContent = channelName;
        }
        if (channelTopicEl) {
            channelTopicEl.textContent = topic;
        }
        if (messageInput) {
            messageInput.placeholder = `Message #${channelName}`;
        }
    },

    // Render messages
    renderMessages(messages) {
        const messagesList = document.getElementById('messages-list');
        if (!messagesList) return;

        if (messages.length === 0) {
            messagesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <div class="empty-state-title">No messages yet</div>
                    <div class="empty-state-description">Be the first to send a message in this channel!</div>
                </div>
            `;
            return;
        }

        // Use virtual list for >200 messages
        if (messages.length > 200 && !this.virtualList) {
            this.virtualList = new VirtualList(messagesList, {
                itemHeight: 80,
                renderItem: (msg) => this.createMessageNode(msg)
            });
            this.virtualList.setItems(messages);
        } else if (this.virtualList) {
            this.virtualList.setItems(messages);
        } else {
            messagesList.innerHTML = messages.map(msg =>
                this.createMessageNode(msg).outerHTML
            ).join('');
        }
    },

    // Create message node
    createMessageNode(msg) {
        const el = document.createElement('div');
        el.className = 'message';
        el.dataset.id = msg.id;

        const date = msg.createdAt?.toDate ?
            msg.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const isOwner = this.currentUser && msg.authorId === this.currentUser.uid;
        const contentHtml = Markdown.parse(msg.content || '');

        // Attachments
        let attachmentsHtml = '';
        if (msg.attachments && msg.attachments.length > 0) {
            attachmentsHtml = '<div class="message-attachments">';
            msg.attachments.forEach(att => {
                if (att.type?.startsWith('image/')) {
                    attachmentsHtml += `
                        <div class="message-attachment">
                            <img src="${att.url}" alt="${att.name}">
                        </div>
                    `;
                } else if (att.type?.startsWith('video/')) {
                    attachmentsHtml += `
                        <div class="message-attachment">
                            <video src="${att.url}" controls></video>
                        </div>
                    `;
                } else {
                    attachmentsHtml += `
                        <div class="message-attachment-file">
                            <div class="file-icon">📄</div>
                            <div class="file-info">
                                <div class="file-name">${att.name}</div>
                                <div class="file-size">${this.formatFileSize(att.size)}</div>
                            </div>
                        </div>
                    `;
                }
            });
            attachmentsHtml += '</div>';
        }

        // Reactions
        let reactionsHtml = '';
        if (msg.reactions && Object.keys(msg.reactions).length > 0) {
            reactionsHtml = '<div class="message-reactions">';
            for (const [emoji, users] of Object.entries(msg.reactions)) {
                const hasReacted = this.currentUser && users.includes(this.currentUser.uid);
                reactionsHtml += `
                    <button class="reaction ${hasReacted ? 'reacted' : ''}" 
                            data-id="${msg.id}" 
                            data-emoji="${emoji}">
                        <span class="reaction-emoji">${emoji}</span>
                        <span class="reaction-count">${users.length}</span>
                    </button>
                `;
            }
            reactionsHtml += `
                <button class="add-reaction-btn" data-id="${msg.id}">+</button>
            `;
            reactionsHtml += '</div>';
        }

        // Actions
        let actionsHtml = '';
        if (isOwner) {
            actionsHtml = `
                <div class="message-actions">
                    <button class="message-action-btn edit-btn" 
                            data-id="${msg.id}" 
                            data-content="${(msg.content || '').replace(/"/g, '&quot;')}"
                            title="Edit">✏️</button>
                    <button class="message-action-btn delete-btn" 
                            data-id="${msg.id}"
                            title="Delete">🗑️</button>
                </div>
            `;
        }

        el.innerHTML = `
            <div class="message-avatar">${this.getInitials(msg.authorName)}</div>
            <div class="message-content">
                <div class="message-header">
                    <span class="message-author">${msg.authorName}</span>
                    <span class="message-timestamp">${date}</span>
                    ${msg.editedAt ? '<span class="message-edited">(edited)</span>' : ''}
                </div>
                <div class="message-body">${contentHtml}</div>
                ${attachmentsHtml}
                ${reactionsHtml}
            </div>
            ${actionsHtml}
        `;

        return el;
    },

    // Render members list
    renderMembersList(members) {
        const membersList = document.getElementById('members-list');
        if (!membersList) return;

        // Group by role
        const owners = members.filter(m => m.role === 'owner');
        const admins = members.filter(m => m.role === 'admin');
        const regularMembers = members.filter(m => !m.role || m.role === 'member');

        let html = '';

        if (owners.length > 0) {
            html += this.renderMemberGroup('Owner', owners);
        }
        if (admins.length > 0) {
            html += this.renderMemberGroup('Admins', admins);
        }
        if (regularMembers.length > 0) {
            html += this.renderMemberGroup('Members', regularMembers);
        }

        membersList.innerHTML = html;
    },

    // Render member group
    renderMemberGroup(title, members) {
        return `
            <div class="member-group">
                <div class="member-group-header">
                    <span>${title}</span>
                    <span class="member-count">— ${members.length}</span>
                </div>
                ${members.map(member => this.createMemberNode(member)).join('')}
            </div>
        `;
    },

    // Create member node
    createMemberNode(member) {
        const presence = stateManager.getPresence(member.id);
        return `
            <div class="member-item" data-id="${member.id}">
                <div class="member-avatar-wrapper">
                    <div class="member-avatar">${this.getInitials(member.username)}</div>
                    <div class="presence-indicator ${presence}"></div>
                </div>
                <div class="member-name">${member.username}</div>
            </div>
        `;
    },

    // Update typing indicator
    updateTypingIndicator(users) {
        // This would be implemented if needed
    },

    // Helper: Get initials from name
    getInitials(name) {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    },

    // Helper: Generate discriminator
    generateDiscriminator() {
        return String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    },

    // Helper: Format file size
    formatFileSize(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
};
