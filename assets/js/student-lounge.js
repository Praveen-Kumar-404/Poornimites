/**
 * Student Lounge Logic
 * Handles tabs, rendering posts (confessions, forums, memes, polls), and mock interactions.
 */

// Initial State / Mock Data
const DEFAULT_STATE = {
    currentTab: 'confessions',
    posts: {
        confessions: [
            {
                id: 1,
                text: "I actually really enjoy the mess food on Tuesdays. Am I broken?",
                author: "Anonymous Owl #88",
                tags: ["Campus Life", "Funny"],
                timestamp: "2 hours ago",
                upvotes: 45,
                comments: 12
            },
            {
                id: 2,
                text: "The library AC being broken is a conspiracy to make us leave early.",
                author: "Anonymous Owl #102",
                tags: ["Rant", "Academic"],
                timestamp: "4 hours ago",
                upvotes: 89,
                comments: 23
            }
        ],
        forums: [
            {
                id: 101,
                title: "Best resources for DSA placement prep?",
                text: "I'm starting my placement prep. What resources do you guys recommend for reliable DSA practice?",
                author: "TechGeek_21",
                board: "Placements",
                timestamp: "1 day ago",
                replies: 15,
                views: 340
            }
        ],
        memes: [
            {
                id: 201,
                caption: "Every time the attendance is 74.9%",
                image: "https://placehold.co/600x400/e6f3ff/0066cc?text=Meme+Image+Placeholder",
                author: "MemeLord",
                upvotes: 230
            }
        ],
        polls: [
            {
                id: 301,
                question: "Best chill spot on campus?",
                totalVotes: 145,
                options: [
                    { label: "Canteen", votes: 45 },
                    { label: "Library Garden", votes: 30 },
                    { label: "Basketball Court", votes: 20 },
                    { label: "Old Canteen", votes: 50 }
                ]
            }
        ]
    }
};

// Load from LocalStorage or use Default
let APP_STATE = JSON.parse(localStorage.getItem('studentLoungeState')) || DEFAULT_STATE;

function saveState() {
    localStorage.setItem('studentLoungeState', JSON.stringify(APP_STATE));
}

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    // Restore active tab
    const storedTab = APP_STATE.currentTab || 'confessions';
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${storedTab}"]`);
    if (tabBtn) {
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        tabBtn.classList.add('active');
    }
    renderContent(storedTab);
    setupEventListeners();
});

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            tab.classList.add('active');

            const target = tab.dataset.tab;
            APP_STATE.currentTab = target;
            saveState();
            renderContent(target);
        });
    });
}

function renderContent(tabType) {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = ''; // a loader could go here

    const posts = APP_STATE.posts[tabType] || [];

    if (posts.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Be the first to share something!</p>
            </div>`;
        return;
    }

    posts.forEach(post => {
        const card = createCard(tabType, post);
        feedContainer.appendChild(card);
    });
}

function createCard(type, data) {
    const card = document.createElement('div');
    card.className = 'post-card';

    if (type === 'confessions') {
        card.innerHTML = `
            <div class="post-header">
                <span class="post-author"><span class="anonymous-badge">?</span> ${data.author}</span>
                <span class="post-meta">${data.timestamp}</span>
            </div>
            <div class="post-body">${data.text}</div>
            <div class="post-tags">
                ${data.tags.map(t => `<span class="tag ${t.toLowerCase().replace(' ', '-')}">#${t}</span>`).join('')}
            </div>
            <div class="post-actions">
                <div class="vote-controls">
                    <button class="vote-btn up" aria-label="Upvote">▲</button>
                    <span>${data.upvotes}</span>
                    <button class="vote-btn down" aria-label="Downvote">▼</button>
                </div>
                <button class="action-btn">💬 ${data.comments} Comments</button>
                <button class="action-btn" aria-label="Report Post">⚠️ Report</button>
            </div>
        `;
    } else if (type === 'forums') {
        card.innerHTML = `
            <div class="post-header">
                <span class="post-author">👤 ${data.author}</span>
                <span class="post-meta">in <strong>${data.board}</strong> • ${data.timestamp}</span>
            </div>
            <h3>${data.title}</h3>
            <div class="post-body">${data.text}</div>
            <div class="post-actions">
                <button class="action-btn">💬 ${data.replies} Replies</button>
                <button class="action-btn">👁️ ${data.views} Views</button>
            </div>
        `;
    } else if (type === 'memes') {
        card.innerHTML = `
            <div class="post-header">
                <span class="post-author">🤡 ${data.author}</span>
            </div>
            <div class="post-body">${data.caption}</div>
            <img src="${data.image}" class="meme-image" alt="Meme">
            <div class="post-actions" style="margin-top:1rem;">
                <div class="vote-controls">
                    <button class="vote-btn up" aria-label="Upvote">▲</button>
                    <span>${data.upvotes}</span>
                    <button class="vote-btn down" aria-label="Downvote">▼</button>
                </div>
                <button class="action-btn">Share</button>
            </div>
        `;
    } else if (type === 'polls') {
        const optionsHtml = data.options.map(opt => {
            const percentage = Math.round((opt.votes / data.totalVotes) * 100);
            return `
                <div class="poll-option">
                    <div class="poll-bar-container">
                        <div class="poll-fill" style="width: ${percentage}%"></div>
                        <div class="poll-label">
                            <span>${opt.label}</span>
                            <span>${percentage}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            <div class="post-header">
                <span class="post-author">📊 Campus Poll</span>
                <span class="post-meta">${data.totalVotes} votes</span>
            </div>
            <h3 style="margin-top:0">${data.question}</h3>
            <div class="poll-options">
                ${optionsHtml}
            </div>
            <div class="post-actions">
                <span class="post-meta">Ends in 2 days</span>
            </div>
        `;
    }

    return card;
}

function setupEventListeners() {
    const modal = document.getElementById('createModal');
    const fab = document.getElementById('createPostBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('createPostForm');
    const typeSelect = document.getElementById('postType');

    // Open Modal
    fab.addEventListener('click', () => {
        // Set dropdown to current tab
        if (APP_STATE.currentTab) {
            typeSelect.value = APP_STATE.currentTab;
            updateFormFields(APP_STATE.currentTab);
        }
        modal.classList.add('active');
    });

    // Close Modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    // Type Change
    typeSelect.addEventListener('change', (e) => {
        updateFormFields(e.target.value);
    });

    // Handle Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = typeSelect.value;
        const content = document.getElementById('postContent')?.value;
        const title = document.getElementById('postTitle')?.value; // For forums/polls

        // Mock ID generation
        const newId = Date.now();

        // Create new Post Object
        let newPost = {
            id: newId,
            timestamp: "Just now",
            author: "You (Anon)",
            upvotes: 0
        };

        if (type === 'confessions') {
            const tags = Array.from(document.querySelectorAll('input[name="tags"]:checked')).map(cb => cb.value);
            newPost = { ...newPost, text: content, tags, comments: 0 };
        } else if (type === 'forums') {
            newPost = {
                ...newPost,
                title: title,
                text: content,
                board: "General",
                replies: 0,
                views: 1
            };
        } else if (type === 'memes') {
            // Mock image
            newPost = {
                ...newPost,
                caption: content,
                image: "https://placehold.co/600x400/e6f3ff/0066cc?text=New+Meme",
            };
        } else if (type === 'polls') {
            // Mock poll options
            newPost = {
                ...newPost,
                question: title,
                totalVotes: 0,
                options: [
                    { label: "Option 1", votes: 0 },
                    { label: "Option 2", votes: 0 }
                ]
            };
        }

        // Add to state
        if (!APP_STATE.posts[type]) APP_STATE.posts[type] = [];
        APP_STATE.posts[type].unshift(newPost); // Add to top
        saveState();

        // Re-render
        if (APP_STATE.currentTab === type) {
            renderContent(type);
        } else {
            // Switch to that tab
            document.querySelector(`.tab-btn[data-tab="${type}"]`).click();
        }

        modal.classList.remove('active');
        form.reset();
    });

    // Direct Event Delegation for Vote Buttons (Dynamic Elements)
    document.getElementById('feed-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('vote-btn')) {
            const btn = e.target;
            const countSpan = btn.parentElement.querySelector('span');
            let current = parseInt(countSpan.innerText);

            if (btn.classList.contains('active')) {
                // Toggle off
                btn.classList.remove('active');
                if (btn.classList.contains('up')) countSpan.innerText = current - 1;
                else countSpan.innerText = current + 1; // Un-downvote
            } else {
                // Toggle on
                // Reset siblings
                const siblings = btn.parentElement.querySelectorAll('.vote-btn');
                siblings.forEach(s => s.classList.remove('active'));

                btn.classList.add('active');
                if (btn.classList.contains('up')) countSpan.innerText = current + 1;
                else countSpan.innerText = current - 1;
            }
            saveState(); // Persist vote (Note: In real app, update object in APP_STATE too)
        }
    });

    // Character Counter
    const textArea = document.getElementById('postContent');
    if (textArea) {
        textArea.addEventListener('input', (e) => {
            document.getElementById('charCount').innerText = `${e.target.value.length}/500`;
        });
    }
}

function updateFormFields(type) {
    const container = document.getElementById('dynamicFields');
    let html = '';

    if (type === 'confessions') {
        html = `
            <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Confession</label>
             <textarea id="postContent" rows="5" class="form-control" placeholder="What's your secret?" style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #ccc;"></textarea>
             <div id="charCount" style="text-align:right; font-size:0.8rem; color:#666;">0/500</div>
            </div>
             <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Tags</label>
             <div class="tags-input" style="display:flex; gap:0.5rem; flex-wrap:wrap;">
               <label><input type="checkbox" name="tags" value="Academic"> Academic</label>
               <label><input type="checkbox" name="tags" value="Relationships"> Relationships</label>
               <label><input type="checkbox" name="tags" value="Funny"> Funny</label>
               <label><input type="checkbox" name="tags" value="Rant"> Rant</label>
             </div>
          </div>
        `;
    } else if (type === 'forums') {
        html = `
            <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Topic Title</label>
             <input type="text" id="postTitle" class="form-control" placeholder="e.g., Best place for internships?" style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #ccc;">
            </div>
            <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Body</label>
             <textarea id="postContent" rows="6" class="form-control" placeholder="Elaborate..." style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #ccc;"></textarea>
            </div>
        `;
    } else if (type === 'memes') {
        html = `
            <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Caption</label>
             <input type="text" id="postContent" class="form-control" placeholder="When the professor says..." style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #ccc;">
            </div>
            <div class="form-group" style="margin-bottom:1rem; padding: 1rem; border: 2px dashed #ccc; text-align:center;">
             <p>Click to upload or paste image URL (Mock)</p>
            </div>
        `;
    } else if (type === 'polls') {
        html = `
            <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Question</label>
             <input type="text" id="postTitle" class="form-control" placeholder="Ask the campus..." style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #ccc;">
            </div>
            <div class="form-group" style="margin-bottom:1rem;">
             <label style="display:block; font-weight:bold; margin-bottom:0.5rem">Options (Mock)</label>
             <input type="text" class="form-control" placeholder="Option 1" style="width:100%; margin-bottom:0.5rem; padding:0.5rem; border-radius:8px; border:1px solid #ccc;">
             <input type="text" class="form-control" placeholder="Option 2" style="width:100%; padding:0.5rem; border-radius:8px; border:1px solid #ccc;">
            </div>
        `;
    }

    container.innerHTML = html;

    // Re-attach listeners for new elements if needed (e.g. char count)
    const newTextArea = document.getElementById('postContent');
    if (newTextArea && type === 'confessions') {
        newTextArea.addEventListener('input', (e) => {
            const count = document.getElementById('charCount');
            if (count) count.innerText = `${e.target.value.length}/500`;
        });
    }
}
