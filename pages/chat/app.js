/*
 * Poornimites Chat - Application Logic
 * 
 * HOW TO RUN:
 * Open chat.html in a browser
 * 
 * SEEDED DATA:
 * - 1 server: "Poornimites University"
 * - 4 channels: general, announcements, study-group, random
 * - 12 members with various roles and presence states
 * - 35+ messages in general channel
 * 
 * HEADER HEIGHT:
 * If your header height differs from 60px, update the CSS variable --header-height in styles.css
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
    currentUser: {
        id: 'u-1',
        name: 'Praveen Kumar',
        avatar: 'https://ui-avatars.com/api/?name=Praveen+Kumar&background=0066cc&color=fff',
        discriminator: '0001'
    },
    servers: [],
    channels: [],
    members: [],
    messages: {}, // channelId: [messages]
    activeServerId: null,
    activeChannelId: null,
    presenceTimers: [],
    messageIdCounter: 1000,
    isAtBottom: true,
    hasNewMessages: false
};

// ============================================================================
// SEED DATA
// ============================================================================

function seedData() {
    // Server
    state.servers = [
        {
            id: 'server-1',
            name: 'Poornimites University',
            icon: 'PU'
        }
    ];

    // Channels
    state.channels = [
        { id: 'ch-1', serverId: 'server-1', name: 'general', category: 'Text Channels' },
        { id: 'ch-2', serverId: 'server-1', name: 'announcements', category: 'Text Channels' },
        { id: 'ch-3', serverId: 'server-1', name: 'study-group', category: 'Text Channels' },
        { id: 'ch-4', serverId: 'server-1', name: 'random', category: 'Text Channels' }
    ];

    // Members
    state.members = [
        { id: 'u-1', name: 'Praveen Kumar', role: 'owner', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Praveen+Kumar&background=0066cc&color=fff' },
        { id: 'u-2', name: 'Anjali Sharma', role: 'admin', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Anjali+Sharma&background=388e3c&color=fff' },
        { id: 'u-3', name: 'Rahul Verma', role: 'admin', status: 'idle', avatar: 'https://ui-avatars.com/api/?name=Rahul+Verma&background=f57c00&color=fff' },
        { id: 'u-4', name: 'Priya Singh', role: 'member', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Priya+Singh&background=d32f2f&color=fff' },
        { id: 'u-5', name: 'Amit Patel', role: 'member', status: 'dnd', avatar: 'https://ui-avatars.com/api/?name=Amit+Patel&background=7b1fa2&color=fff' },
        { id: 'u-6', name: 'Sneha Reddy', role: 'member', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=0097a7&color=fff' },
        { id: 'u-7', name: 'Vikram Joshi', role: 'member', status: 'offline', avatar: 'https://ui-avatars.com/api/?name=Vikram+Joshi&background=5d4037&color=fff' },
        { id: 'u-8', name: 'Kavya Nair', role: 'member', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Kavya+Nair&background=c2185b&color=fff' },
        { id: 'u-9', name: 'Arjun Mehta', role: 'member', status: 'idle', avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=303f9f&color=fff' },
        { id: 'u-10', name: 'Divya Iyer', role: 'member', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Divya+Iyer&background=689f38&color=fff' },
        { id: 'u-11', name: 'Rohan Gupta', role: 'member', status: 'offline', avatar: 'https://ui-avatars.com/api/?name=Rohan+Gupta&background=e64a19&color=fff' },
        { id: 'u-12', name: 'Neha Kapoor', role: 'member', status: 'online', avatar: 'https://ui-avatars.com/api/?name=Neha+Kapoor&background=00796b&color=fff' }
    ];

    // Messages for general channel
    const now = Date.now();
    state.messages['ch-1'] = [
        { id: 'm-1', channelId: 'ch-1', authorId: 'u-1', authorName: 'Praveen Kumar', authorAvatar: state.members[0].avatar, content: 'Welcome to Poornimites University chat! 🎓', timestamp: now - 3600000, edited: false },
        { id: 'm-2', channelId: 'ch-1', authorId: 'u-2', authorName: 'Anjali Sharma', authorAvatar: state.members[1].avatar, content: 'Hey everyone! Excited to be here!', timestamp: now - 3500000, edited: false },
        { id: 'm-3', channelId: 'ch-1', authorId: 'u-4', authorName: 'Priya Singh', authorAvatar: state.members[3].avatar, content: 'Does anyone have the notes from yesterday\'s lecture?', timestamp: now - 3400000, edited: false },
        { id: 'm-4', channelId: 'ch-1', authorId: 'u-3', authorName: 'Rahul Verma', authorAvatar: state.members[2].avatar, content: 'I can share them! Give me a moment.', timestamp: now - 3300000, edited: false },
        { id: 'm-5', channelId: 'ch-1', authorId: 'u-6', authorName: 'Sneha Reddy', authorAvatar: state.members[5].avatar, content: 'Thanks Rahul! You\'re a lifesaver 🙏', timestamp: now - 3200000, edited: false },
        { id: 'm-6', channelId: 'ch-1', authorId: 'u-8', authorName: 'Kavya Nair', authorAvatar: state.members[7].avatar, content: 'What time is the study group meeting today?', timestamp: now - 3000000, edited: false },
        { id: 'm-7', channelId: 'ch-1', authorId: 'u-2', authorName: 'Anjali Sharma', authorAvatar: state.members[1].avatar, content: 'Study group is at 4 PM in the library', timestamp: now - 2900000, edited: false },
        { id: 'm-8', channelId: 'ch-1', authorId: 'u-10', authorName: 'Divya Iyer', authorAvatar: state.members[9].avatar, content: 'Perfect! I\'ll be there', timestamp: now - 2800000, edited: false },
        { id: 'm-9', channelId: 'ch-1', authorId: 'u-5', authorName: 'Amit Patel', authorAvatar: state.members[4].avatar, content: 'Has anyone started the assignment for Data Structures?', timestamp: now - 2600000, edited: false },
        { id: 'm-10', channelId: 'ch-1', authorId: 'u-9', authorName: 'Arjun Mehta', authorAvatar: state.members[8].avatar, content: 'Yeah, I\'m working on it now. It\'s pretty challenging!', timestamp: now - 2500000, edited: false },
        { id: 'm-11', channelId: 'ch-1', authorId: 'u-12', authorName: 'Neha Kapoor', authorAvatar: state.members[11].avatar, content: 'We should form a study group for that', timestamp: now - 2400000, edited: false },
        { id: 'm-12', channelId: 'ch-1', authorId: 'u-1', authorName: 'Praveen Kumar', authorAvatar: state.members[0].avatar, content: 'Great idea! Let\'s use the study-group channel', timestamp: now - 2300000, edited: false },
        { id: 'm-13', channelId: 'ch-1', authorId: 'u-4', authorName: 'Priya Singh', authorAvatar: state.members[3].avatar, content: 'Anyone going to the tech fest next week?', timestamp: now - 2100000, edited: false },
        { id: 'm-14', channelId: 'ch-1', authorId: 'u-6', authorName: 'Sneha Reddy', authorAvatar: state.members[5].avatar, content: 'Definitely! I heard there are some amazing speakers', timestamp: now - 2000000, edited: false },
        { id: 'm-15', channelId: 'ch-1', authorId: 'u-3', authorName: 'Rahul Verma', authorAvatar: state.members[2].avatar, content: 'I\'m planning to participate in the hackathon', timestamp: now - 1900000, edited: false },
        { id: 'm-16', channelId: 'ch-1', authorId: 'u-8', authorName: 'Kavya Nair', authorAvatar: state.members[7].avatar, content: 'Nice! What\'s your project idea?', timestamp: now - 1800000, edited: false },
        { id: 'm-17', channelId: 'ch-1', authorId: 'u-3', authorName: 'Rahul Verma', authorAvatar: state.members[2].avatar, content: 'Building an AI-powered study assistant', timestamp: now - 1700000, edited: false },
        { id: 'm-18', channelId: 'ch-1', authorId: 'u-10', authorName: 'Divya Iyer', authorAvatar: state.members[9].avatar, content: 'That sounds awesome! Count me in if you need help', timestamp: now - 1600000, edited: false },
        { id: 'm-19', channelId: 'ch-1', authorId: 'u-2', authorName: 'Anjali Sharma', authorAvatar: state.members[1].avatar, content: 'Don\'t forget about the quiz tomorrow in Database Management', timestamp: now - 1400000, edited: false },
        { id: 'm-20', channelId: 'ch-1', authorId: 'u-5', authorName: 'Amit Patel', authorAvatar: state.members[4].avatar, content: 'Oh no! I completely forgot about that 😅', timestamp: now - 1300000, edited: false },
        { id: 'm-21', channelId: 'ch-1', authorId: 'u-9', authorName: 'Arjun Mehta', authorAvatar: state.members[8].avatar, content: 'We should do a quick revision session tonight', timestamp: now - 1200000, edited: false },
        { id: 'm-22', channelId: 'ch-1', authorId: 'u-12', authorName: 'Neha Kapoor', authorAvatar: state.members[11].avatar, content: 'I\'m in! What time works for everyone?', timestamp: now - 1100000, edited: false },
        { id: 'm-23', channelId: 'ch-1', authorId: 'u-1', authorName: 'Praveen Kumar', authorAvatar: state.members[0].avatar, content: 'How about 8 PM? We can use the voice channel', timestamp: now - 1000000, edited: false },
        { id: 'm-24', channelId: 'ch-1', authorId: 'u-4', authorName: 'Priya Singh', authorAvatar: state.members[3].avatar, content: 'Perfect! See you all then', timestamp: now - 900000, edited: false },
        { id: 'm-25', channelId: 'ch-1', authorId: 'u-6', authorName: 'Sneha Reddy', authorAvatar: state.members[5].avatar, content: 'Has anyone checked out the new library resources?', timestamp: now - 700000, edited: false },
        { id: 'm-26', channelId: 'ch-1', authorId: 'u-8', authorName: 'Kavya Nair', authorAvatar: state.members[7].avatar, content: 'Yes! They have some great online courses now', timestamp: now - 600000, edited: false },
        { id: 'm-27', channelId: 'ch-1', authorId: 'u-10', authorName: 'Divya Iyer', authorAvatar: state.members[9].avatar, content: 'The digital library is amazing. So many research papers!', timestamp: now - 500000, edited: false },
        { id: 'm-28', channelId: 'ch-1', authorId: 'u-3', authorName: 'Rahul Verma', authorAvatar: state.members[2].avatar, content: 'I found some great resources for machine learning there', timestamp: now - 400000, edited: false },
        { id: 'm-29', channelId: 'ch-1', authorId: 'u-2', authorName: 'Anjali Sharma', authorAvatar: state.members[1].avatar, content: 'Quick reminder: Submit your project proposals by Friday!', timestamp: now - 300000, edited: false },
        { id: 'm-30', channelId: 'ch-1', authorId: 'u-5', authorName: 'Amit Patel', authorAvatar: state.members[4].avatar, content: 'Thanks for the reminder! Almost forgot', timestamp: now - 200000, edited: false },
        { id: 'm-31', channelId: 'ch-1', authorId: 'u-9', authorName: 'Arjun Mehta', authorAvatar: state.members[8].avatar, content: 'Anyone want to grab lunch after class?', timestamp: now - 100000, edited: false },
        { id: 'm-32', channelId: 'ch-1', authorId: 'u-12', authorName: 'Neha Kapoor', authorAvatar: state.members[11].avatar, content: 'Sure! Let\'s meet at the cafeteria', timestamp: now - 50000, edited: false },
        { id: 'm-33', channelId: 'ch-1', authorId: 'u-1', authorName: 'Praveen Kumar', authorAvatar: state.members[0].avatar, content: 'Great to see everyone so active here! Keep it up 💪', timestamp: now - 10000, edited: false }
    ];

    // Empty messages for other channels
    state.messages['ch-2'] = [];
    state.messages['ch-3'] = [];
    state.messages['ch-4'] = [];

    // Set active server and channel
    state.activeServerId = 'server-1';
    state.activeChannelId = 'ch-1';
}

// ============================================================================
// RENDERING FUNCTIONS
// ============================================================================

function renderAppShell() {
    const app = document.getElementById('chat-root');
    app.innerHTML = `
        <div class="app-shell">
            <nav class="servers-col" role="navigation" aria-label="Servers">
                <!-- Servers will be rendered here -->
            </nav>
            
            <nav class="channels-col" role="navigation" aria-label="Channels">
                <div class="channels-header" id="server-name">Select a server</div>
                <div class="channels-list" id="channels-list">
                    <!-- Channels will be rendered here -->
                </div>
            </nav>
            
            <main class="main-col" role="main">
                <div class="channel-header">
                    <div class="channel-header-name">
                        <span class="channel-header-hash">#</span>
                        <span id="channel-name">Select a channel</span>
                    </div>
                    <div class="channel-topic" id="channel-topic">No topic set</div>
                </div>
                <div class="messages-wrap" id="messages-wrap" role="log" aria-live="polite" aria-atomic="false">
                    <!-- Messages will be rendered here -->
                </div>
                <div class="new-messages-badge" id="new-messages-badge">New messages ↓</div>
                <div class="message-input">
                    <div class="message-input-wrapper">
                        <button class="attach-btn" id="attach-btn" title="Attach file">+</button>
                        <textarea 
                            class="message-textarea" 
                            id="message-textarea" 
                            placeholder="Message #general" 
                            rows="1"
                            aria-label="Message input"
                        ></textarea>
                        <button class="send-btn" id="send-btn" disabled>Send</button>
                    </div>
                </div>
            </main>
            
            <aside class="members-col" role="complementary" aria-label="Members">
                <div class="members-header">Members</div>
                <div class="members-search">
                    <input type="text" placeholder="Search members..." id="member-search" aria-label="Search members">
                </div>
                <div class="members-list" id="members-list">
                    <!-- Members will be rendered here -->
                </div>
            </aside>
        </div>
    `;
}

function renderServers() {
    const serversCol = document.querySelector('.servers-col');
    const fragment = document.createDocumentFragment();

    state.servers.forEach(server => {
        const serverIcon = document.createElement('div');
        serverIcon.className = `server-icon ${server.id === state.activeServerId ? 'active' : ''}`;
        serverIcon.textContent = server.icon;
        serverIcon.title = server.name;
        serverIcon.setAttribute('role', 'button');
        serverIcon.setAttribute('tabindex', '0');
        serverIcon.onclick = () => selectServer(server.id);
        fragment.appendChild(serverIcon);
    });

    // Add separator
    const separator = document.createElement('div');
    separator.className = 'server-separator';
    fragment.appendChild(separator);

    // Add server button
    const addBtn = document.createElement('div');
    addBtn.className = 'add-server-btn';
    addBtn.textContent = '+';
    addBtn.title = 'Add a server';
    addBtn.onclick = () => alert('Add server functionality coming soon!');
    fragment.appendChild(addBtn);

    serversCol.innerHTML = '';
    serversCol.appendChild(fragment);
}

function renderChannels() {
    const channelsList = document.getElementById('channels-list');
    const serverChannels = state.channels.filter(ch => ch.serverId === state.activeServerId);

    // Group by category
    const categories = {};
    serverChannels.forEach(ch => {
        if (!categories[ch.category]) categories[ch.category] = [];
        categories[ch.category].push(ch);
    });

    const fragment = document.createDocumentFragment();

    Object.entries(categories).forEach(([category, channels]) => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'channel-category';
        categoryEl.textContent = category;
        fragment.appendChild(categoryEl);

        channels.forEach((channel, index) => {
            const channelEl = document.createElement('div');
            channelEl.className = 'channel-item';
            channelEl.setAttribute('role', 'button');
            channelEl.setAttribute('tabindex', '0');
            channelEl.setAttribute('data-channel-id', channel.id);

            if (channel.id === state.activeChannelId) {
                channelEl.setAttribute('aria-current', 'true');
            }

            channelEl.innerHTML = `
                <span class="channel-hash">#</span>
                <span>${channel.name}</span>
            `;

            channelEl.onclick = () => selectChannel(channel.id);
            channelEl.onkeydown = (e) => {
                if (e.key === 'Enter') selectChannel(channel.id);
                if (e.key === 'ArrowDown') {
                    const next = channelEl.nextElementSibling;
                    if (next && next.classList.contains('channel-item')) next.focus();
                }
                if (e.key === 'ArrowUp') {
                    const prev = channelEl.previousElementSibling;
                    if (prev && prev.classList.contains('channel-item')) prev.focus();
                }
            };

            fragment.appendChild(channelEl);
        });
    });

    // Add channel button
    const addChannelBtn = document.createElement('div');
    addChannelBtn.className = 'add-channel-btn';
    addChannelBtn.textContent = '+ Add Channel';
    addChannelBtn.onclick = () => alert('Add channel functionality coming soon!');
    fragment.appendChild(addChannelBtn);

    channelsList.innerHTML = '';
    channelsList.appendChild(fragment);
}

function renderMessages() {
    const messagesWrap = document.getElementById('messages-wrap');
    const messages = state.messages[state.activeChannelId] || [];

    const fragment = document.createDocumentFragment();

    messages.forEach(msg => {
        const messageEl = createMessageElement(msg);
        fragment.appendChild(messageEl);
    });

    messagesWrap.innerHTML = '';
    messagesWrap.appendChild(fragment);

    // Scroll to bottom
    requestAnimationFrame(() => {
        scrollToBottom();
    });
}

function createMessageElement(msg) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message-item';
    messageEl.setAttribute('data-message-id', msg.id);

    const timestamp = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageEl.innerHTML = `
        <img src="${msg.authorAvatar}" alt="${msg.authorName}" class="message-avatar">
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${msg.authorName}</span>
                <span class="message-timestamp">${timestamp}</span>
                ${msg.edited ? '<span class="message-edited">(edited)</span>' : ''}
            </div>
            <div class="message-text">${escapeHtml(msg.content)}</div>
        </div>
    `;

    return messageEl;
}

function renderMembers() {
    const membersList = document.getElementById('members-list');

    // Group by role
    const roles = {
        owner: [],
        admin: [],
        member: []
    };

    state.members.forEach(member => {
        roles[member.role].push(member);
    });

    const fragment = document.createDocumentFragment();

    Object.entries(roles).forEach(([role, members]) => {
        if (members.length === 0) return;

        const categoryEl = document.createElement('div');
        categoryEl.className = 'member-category';
        categoryEl.textContent = `${role.toUpperCase()}S — ${members.length}`;
        fragment.appendChild(categoryEl);

        members.forEach(member => {
            const memberEl = document.createElement('div');
            memberEl.className = 'member-item';
            memberEl.innerHTML = `
                <div class="member-avatar-wrap">
                    <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
                    <div class="member-status ${member.status}"></div>
                </div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-role">${member.role}</div>
                </div>
            `;
            fragment.appendChild(memberEl);
        });
    });

    membersList.innerHTML = '';
    membersList.appendChild(fragment);
}

// ============================================================================
// INTERACTION HANDLERS
// ============================================================================

function selectServer(serverId) {
    state.activeServerId = serverId;
    const server = state.servers.find(s => s.id === serverId);

    document.getElementById('server-name').textContent = server.name;

    renderServers();
    renderChannels();

    // Select first channel
    const firstChannel = state.channels.find(ch => ch.serverId === serverId);
    if (firstChannel) {
        selectChannel(firstChannel.id);
    }
}

function selectChannel(channelId) {
    state.activeChannelId = channelId;
    const channel = state.channels.find(ch => ch.id === channelId);

    document.getElementById('channel-name').textContent = channel.name;
    document.getElementById('message-textarea').placeholder = `Message #${channel.name}`;

    renderChannels();
    renderMessages();

    state.hasNewMessages = false;
    hideNewMessagesBadge();
}

function sendMessage() {
    const textarea = document.getElementById('message-textarea');
    const content = textarea.value.trim();

    if (!content || !state.activeChannelId) return;

    // Create optimistic message
    const tempId = `temp-${state.messageIdCounter++}`;
    const message = {
        id: tempId,
        channelId: state.activeChannelId,
        authorId: state.currentUser.id,
        authorName: state.currentUser.name,
        authorAvatar: state.currentUser.avatar,
        content: content,
        timestamp: Date.now(),
        edited: false
    };

    // Add to state
    if (!state.messages[state.activeChannelId]) {
        state.messages[state.activeChannelId] = [];
    }
    state.messages[state.activeChannelId].push(message);

    // Render immediately
    const messagesWrap = document.getElementById('messages-wrap');
    const messageEl = createMessageElement(message);
    messagesWrap.appendChild(messageEl);

    // Clear textarea
    textarea.value = '';
    textarea.style.height = 'auto';
    updateSendButton();

    // Scroll to bottom
    scrollToBottom();

    // Simulate server ACK
    const ackDelay = 300 + Math.random() * 500;
    setTimeout(() => {
        const realId = `m-${state.messageIdCounter++}`;
        const msgIndex = state.messages[state.activeChannelId].findIndex(m => m.id === tempId);
        if (msgIndex !== -1) {
            state.messages[state.activeChannelId][msgIndex].id = realId;
            const msgEl = messagesWrap.querySelector(`[data-message-id="${tempId}"]`);
            if (msgEl) {
                msgEl.setAttribute('data-message-id', realId);
            }
        }
    }, ackDelay);
}

function scrollToBottom() {
    const messagesWrap = document.getElementById('messages-wrap');
    messagesWrap.scrollTop = messagesWrap.scrollHeight;
    state.isAtBottom = true;
}

function showNewMessagesBadge() {
    const badge = document.getElementById('new-messages-badge');
    badge.classList.add('show');
}

function hideNewMessagesBadge() {
    const badge = document.getElementById('new-messages-badge');
    badge.classList.remove('show');
}

function updateSendButton() {
    const textarea = document.getElementById('message-textarea');
    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = !textarea.value.trim();
}

// ============================================================================
// PRESENCE SIMULATION
// ============================================================================

function simulatePresence() {
    setInterval(() => {
        const statuses = ['online', 'idle', 'dnd', 'offline'];
        const randomMember = state.members[Math.floor(Math.random() * state.members.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

        randomMember.status = randomStatus;
        renderMembers();
    }, 10000); // Change every 10 seconds
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Message textarea auto-resize
    const textarea = document.getElementById('message-textarea');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, 96); // Max 4 lines
        textarea.style.height = newHeight + 'px';
        updateSendButton();
    });

    // Keyboard shortcuts
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
        if (e.key === 'Escape') {
            textarea.value = '';
            textarea.style.height = 'auto';
            updateSendButton();
        }
    });

    // Send button
    document.getElementById('send-btn').addEventListener('click', sendMessage);

    // Attach button
    document.getElementById('attach-btn').addEventListener('click', () => {
        alert('File attachment coming soon!');
    });

    // New messages badge
    document.getElementById('new-messages-badge').addEventListener('click', () => {
        scrollToBottom();
        hideNewMessagesBadge();
    });

    // Scroll detection
    const messagesWrap = document.getElementById('messages-wrap');
    messagesWrap.addEventListener('scroll', () => {
        const isAtBottom = messagesWrap.scrollHeight - messagesWrap.scrollTop <= messagesWrap.clientHeight + 50;
        state.isAtBottom = isAtBottom;

        if (isAtBottom) {
            hideNewMessagesBadge();
            state.hasNewMessages = false;
        }
    });

    // Member search
    document.getElementById('member-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const memberItems = document.querySelectorAll('.member-item');

        memberItems.forEach(item => {
            const name = item.querySelector('.member-name').textContent.toLowerCase();
            item.style.display = name.includes(query) ? 'flex' : 'none';
        });
    });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
    // Seed data
    seedData();

    // Render UI
    renderAppShell();
    renderServers();
    renderChannels();
    renderMessages();
    renderMembers();

    // Setup event listeners
    setupEventListeners();

    // Start presence simulation
    simulatePresence();

    console.log('Chat initialized successfully!');
    console.log('Try switching channels, sending messages, and searching members!');
}

// Start the app
init();
