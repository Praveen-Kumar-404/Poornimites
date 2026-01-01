// assets/js/clubs.js

// Mock Data for Clubs and Events (Simulating API)
const CLUBS_DATA = [
    {
        id: "coding-club",
        name: "Coding Club",
        logo: "https://via.placeholder.com/80/004080/ffffff?text=CC",
        banner: "https://via.placeholder.com/600x200/004080/ffffff?text=Coding+Club+Poornima",
        category: "technical",
        status: "recruiting",
        description: "The official coding community of Poornima. We host hackathons, workshops, and competitive programming contests to foster a culture of problem solving.",
        mission: "To create a community of developers who build, learn, and grow together.",
        schedule: "Every Wednesday, 2:00 PM @ Lab 3",
        leadership: [
            { role: "President", name: "Aarav Sharma" },
            { role: "Vice President", name: "Neha Gupta" },
            { role: "Tech Lead", name: "Rohan Verma" }
        ],
        contact: {
            email: "codingclub@poornima.edu.in",
            instagram: "@poornima_coding"
        },
        events: [
            { title: "Hack-a-thon 2025", date: "2025-01-15", time: "10:00 AM", type: "upcoming" },
            { title: "React Workshop", date: "2024-12-10", time: "2:00 PM", type: "past" }
        ],
        achievements: ["Winners of SIH 2024", "Best Tech Club Award 2023"],
        gallery: [
            "https://via.placeholder.com/150/004080/fff",
            "https://via.placeholder.com/150/0056b3/fff",
            "https://via.placeholder.com/150/0069d9/fff"
        ]
    },
    {
        id: "dance-club",
        name: "Aavishkar Dance Crew",
        logo: "https://via.placeholder.com/80/e91e63/ffffff?text=AD",
        banner: "https://via.placeholder.com/600x200/e91e63/ffffff?text=Dance+Club",
        category: "cultural",
        status: "active",
        description: "Express yourself through movement. We explore different styles including hip-hop, classical, and contemporary dance forms.",
        mission: "To promote dance as an art form and provide a platform for student talent.",
        schedule: "Mon & Fri, 4:30 PM @ Auditorium",
        leadership: [
            { role: "President", name: "Sanya Malhotra" },
            { role: "Choreographer", name: "Vikram Singh" }
        ],
        contact: {
            email: "dance@poornima.edu.in",
            instagram: "@aavishkar_dance"
        },
        events: [
            { title: "Annual Cultural Fest", date: "2025-02-20", time: "5:00 PM", type: "upcoming" }
        ],
        achievements: ["1st Prize at IIT Jodhpur Fest"],
        gallery: []
    },
    {
        id: "robotics-club",
        name: "RoboTech Society",
        logo: "https://via.placeholder.com/80/607d8b/ffffff?text=RT",
        banner: "https://via.placeholder.com/600x200/607d8b/ffffff?text=Robotics+Club",
        category: "technical",
        status: "closed",
        description: "Building the future, one bot at a time. Join us to learn electronics, Arduino programming, and bot fabrication.",
        mission: "Empowering students with hands-on robotics and automation skills.",
        schedule: "Thursdays, 3:00 PM @ Robotics Lab",
        leadership: [
            { role: "President", name: "Kunal Shah" },
            { role: "Secretary", name: "Priya Das" }
        ],
        contact: {
            email: "robotics@poornima.edu.in",
            instagram: "@robotech_pu"
        },
        events: [],
        achievements: [],
        gallery: []
    },
    {
        id: "debate-club",
        name: "Debate & Lit Society",
        logo: "https://via.placeholder.com/80/795548/ffffff?text=DL",
        banner: "https://via.placeholder.com/600x200/795548/ffffff?text=Debate+Society",
        category: "literary",
        status: "recruiting",
        description: "Fostering critical thinking and public speaking. We organize parliamentary debates, poetry slams, and creative writing sessions.",
        mission: "To cultivate articulate leaders and thinkers.",
        schedule: "Tuesday, 4:00 PM @ Seminar Hall A",
        leadership: [
            { role: "President", name: "Ananya Roy" }
        ],
        contact: {
            email: "debate@poornima.edu.in",
            instagram: "@pu_debsoc"
        },
        events: [
            { title: "Freshers Debate", date: "2025-01-10", time: "3:00 PM", type: "upcoming" }
        ],
        achievements: [],
        gallery: []
    },
    {
        id: "entrepreneurship-cell",
        name: "E-Cell",
        logo: "https://via.placeholder.com/80/ff9800/ffffff?text=EC",
        banner: "https://via.placeholder.com/600x200/ff9800/ffffff?text=Entrepreneurship+Cell",
        category: "entrepreneurship",
        status: "active",
        description: "Turning ideas into reality. Support for startups, incubation guidance, and talks by successful founders.",
        mission: "Igniting the entrepreneurial spirit in every student.",
        schedule: "Alternating Saturdays, 11:00 AM @ Incubation Center",
        leadership: [
            { role: "Head", name: "Rahul Jain" },
            { role: "Coordinator", name: "Simran Kaur" }
        ],
        contact: {
            email: "ecell@poornima.edu.in",
            instagram: "@ecell_pu"
        },
        events: [
            { title: "Startup Saturday", date: "2025-01-25", time: "11:00 AM", type: "upcoming" }
        ],
        achievements: ["Incubated 5 student startups in 2024"],
        gallery: []
    },
    {
        id: "gaming-club",
        name: "Esports Alliance",
        logo: "https://via.placeholder.com/80/673ab7/ffffff?text=EA",
        banner: "https://via.placeholder.com/600x200/673ab7/ffffff?text=Esports+Alliance",
        category: "gaming",
        status: "recruiting",
        description: "The ultimate gaming community. Regular tournaments for BGMI, Valorant, FIFA, and Chess.",
        mission: "To build a competitive and fun gaming ecosystem on campus.",
        schedule: "Online Discord events every weekend",
        leadership: [
            { role: "President", name: "Arjun Reddy" }
        ],
        contact: {
            email: "gaming@poornima.edu.in",
            instagram: "@esports_pu"
        },
        events: [],
        achievements: ["Top 10 in National Valorant League"],
        gallery: []
    }
];

// Mock Global Events
const GLOBAL_EVENTS = [
    { title: "Hack-a-thon 2025", club: "Coding Club", date: "2025-01-15", time: "10:00 AM", venue: "Auditorium", type: "technical" },
    { title: "Freshers Debate", club: "Debate Society", date: "2025-01-10", time: "3:00 PM", venue: "Seminar Hall A", type: "literary" },
    { title: "Startup Saturday", club: "E-Cell", date: "2025-01-25", time: "11:00 AM", venue: "Incubation Ctr", type: "entrepreneurship" },
    { title: "Annual Cultural Fest", club: "Dance Club", date: "2025-02-20", time: "5:00 PM", venue: "Main Ground", type: "cultural" }
];

// Mock Announcements
const ANNOUNCEMENTS = [
    { title: "Club Registration Deadline Extended", date: "Dec 30, 2024", tag: "Important" },
    { title: "Coding Club wins First Prize at SIH!", date: "Dec 20, 2024", tag: "Achievement" },
    { title: "New Music Club starting next semester", date: "Dec 15, 2024", tag: "New Club" }
];

// Mock Resources
const RESOURCES = [
    { title: "Start a New Club", icon: "🚀", link: "#" },
    { title: "Funding Guidelines", icon: "💰", link: "#" },
    { title: "Event Approval Form", icon: "📝", link: "#" },
    { title: "Room Booking", icon: "📅", link: "#" }
];

// State Management
const ClubState = {
    clubs: CLUBS_DATA,
    activeCategory: 'all',
    searchQuery: '',
    sortBy: 'name',
    selectedClub: null
};

// DOM Elements
const clubsGrid = document.getElementById('clubsGrid');
const searchInput = document.getElementById('clubSearch');
const categoryPills = document.querySelectorAll('.category-pill');
const sortSelect = document.getElementById('sortClubs');
const clubModal = document.getElementById('clubModal');
const joinModal = document.getElementById('joinModal');
const emptyState = document.getElementById('emptyState');

// Initialize
function init() {
    renderClubs();
    renderGlobalEvents();
    renderAnnouncements();
    renderResources();
    setupEventListeners();
}

// Render Clubs Grid
function renderClubs() {
    clubsGrid.innerHTML = '';

    // Filter
    let filtered = ClubState.clubs.filter(club => {
        const matchesCategory = ClubState.activeCategory === 'all' || club.category === ClubState.activeCategory;
        const matchesSearch = club.name.toLowerCase().includes(ClubState.searchQuery.toLowerCase()) ||
            club.description.toLowerCase().includes(ClubState.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort
    if (ClubState.sortBy === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (ClubState.sortBy === 'active') { // "Most Active" -> Just prioritization logic
        // logic: 'active' status first, then 'recruiting', then 'closed'
        const priorities = { 'active': 1, 'recruiting': 2, 'closed': 3 };
        filtered.sort((a, b) => priorities[a.status] - priorities[b.status]);
    } else if (ClubState.sortBy === 'newest') {
        // Mock logic: reverse original array order or random
        // interacting with original data for simplicity
        filtered.reverse();
    }

    // Show empty state
    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    // Generate Cards
    filtered.forEach(club => {
        const card = document.createElement('div');
        card.className = 'club-card';
        card.innerHTML = `
            <div class="club-status status-${club.status}">${club.status}</div>
            <div class="club-header">
                <img src="${club.logo}" alt="${club.name}" class="club-logo">
                <div class="club-info">
                    <h3>${club.name}</h3>
                    <span class="club-category-tag">${capitalize(club.category)}</span>
                </div>
            </div>
            <p class="club-description">${club.description}</p>
            <div class="club-footer">
                <button class="btn-view" onclick="openClubDetail('${club.id}')">View Details</button>
                <button class="btn-join" onclick="openJoinModal('${club.id}')">Join Club</button>
            </div>
        `;
        clubsGrid.appendChild(card);
    });
}

function renderGlobalEvents() {
    const list = document.getElementById('globalEventsList');
    if (!list) return;
    list.innerHTML = GLOBAL_EVENTS.map(ev => `
        <div class="global-event-card">
            <span class="ge-date">${new Date(ev.date).toDateString()}</span>
            <h4 class="ge-title">${ev.title}</h4>
            <div class="ge-info">
                <span>📍 ${ev.venue}</span> • <span>⏰ ${ev.time}</span>
            </div>
            <div style="font-size: 0.85rem;">HOST: <strong>${ev.club}</strong></div>
            <button class="btn-view" style="width:100%; margin-top:1rem;" onclick="alert('RSVP feature coming soon!')">RSVP Now</button>
        </div>
    `).join('');
}

function renderAnnouncements() {
    const grid = document.getElementById('announcementsGrid');
    if (!grid) return;
    grid.innerHTML = ANNOUNCEMENTS.map(ann => `
        <div class="announcement-card">
            <span class="ann-tag">${ann.tag}</span>
            <h4 class="ann-title">${ann.title}</h4>
            <span class="ann-date">Posted on ${ann.date}</span>
        </div>
    `).join('');
}

function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;
    grid.innerHTML = RESOURCES.map(res => `
        <div class="resource-card" onclick="alert('Redirecting to resource...')" style="cursor:pointer;">
            <span class="res-icon">${res.icon}</span>
            <h4 class="res-title">${res.title}</h4>
            <span style="color: var(--accent-color); font-size: 0.9rem;">View →</span>
        </div>
    `).join('');
}

// Open Detailed View
window.openClubDetail = function (clubId) {
    const club = ClubState.clubs.find(c => c.id === clubId);
    if (!club) return;

    ClubState.selectedClub = club;
    const content = document.getElementById('clubDetailContent');

    content.innerHTML = `
        <img src="${club.banner}" alt="${club.name}" class="modal-banner">
        <div class="modal-title-section">
            <img src="${club.logo}" alt="${club.name}" class="modal-logo">
            <div class="modal-info">
                <h2>${club.name}</h2>
                <div style="margin-top: 0.5rem;">
                    <span class="club-category-tag">${capitalize(club.category)}</span>
                    <span style="margin-left: 0.5rem; color: #64748b;">${capitalize(club.status)}</span>
                </div>
            </div>
        </div>

        <div class="detail-grid">
            <div class="left-col">
                <div class="section-title">About Us</div>
                <p style="margin-bottom: 2rem; line-height: 1.6;">${club.description} ${club.mission}</p>
                
                ${club.achievements && club.achievements.length > 0 ? `
                <div class="section-title">Achievements</div>
                <ul style="margin-bottom: 2rem; padding-left: 1.2rem; line-height: 1.6;">
                    ${club.achievements.map(a => `<li>${a}</li>`).join('')}
                </ul>` : ''}

                <div class="section-title">Weekly Schedule</div>
                <p style="margin-bottom: 2rem;">🕒 ${club.schedule || "Contact for schedule"}</p>

                <div class="section-title">Upcoming Events</div>
                <div class="events-list">
                    ${club.events.length > 0 ? club.events.map(event => `
                        <div class="event-card">
                            <div class="event-date">
                                <span class="date-day">${new Date(event.date).getDate()}</span>
                                <span class="date-month">${new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div class="event-details">
                                <h4>${event.title}</h4>
                                <span class="event-meta">⏰ ${event.time} • ${capitalize(event.type)}</span>
                            </div>
                        </div>
                    `).join('') : '<p style="color: #64748b; font-style: italic;">No upcoming events scheduled.</p>'}
                </div>
            </div>

            <div class="right-col">
                <div class="section-title">Leadership</div>
                <div class="leadership-list" style="grid-template-columns: 1fr; gap: 0.5rem;">
                    ${club.leadership.map(leader => `
                        <div class="leader-item">
                            <div class="leader-role">${leader.role}</div>
                            <div class="leader-name">${leader.name}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="section-title" style="margin-top: 2rem;">Contact</div>
                <p><strong>Email:</strong> ${club.contact.email}</p>
                <p><strong>Instagram:</strong> ${club.contact.instagram}</p>

                ${club.gallery && club.gallery.length > 0 ? `
                <div class="section-title" style="margin-top: 2rem;">Gallery</div>
                <div class="gallery-grid">
                    ${club.gallery.map(img => `<img src="${img}" class="gallery-img" alt="Gallery">`).join('')}
                </div>` : ''}

                <button class="btn-join" style="width: 100%; margin-top: 2rem;" onclick="openJoinModal('${club.id}')">
                    Join This Club
                </button>
            </div>
        </div>
    `;

    openModal(clubModal);
};

// Open Join Modal
window.openJoinModal = function (clubId) {
    closeModal(clubModal); // Close detail if open
    document.getElementById('joinClubId').value = clubId;
    const club = ClubState.clubs.find(c => c.id === clubId);
    document.querySelector('#joinModal h2').innerText = `Join ${club.name}`;
    openModal(joinModal);
};

// Helper Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Event Listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', (e) => {
        ClubState.searchQuery = e.target.value.trim();
        renderClubs();
    });

    // Filtering
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            ClubState.activeCategory = pill.dataset.category;
            renderClubs();
        });
    });

    // Sorting
    sortSelect.addEventListener('change', (e) => {
        ClubState.sortBy = e.target.value;
        renderClubs();
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Form Submission
    document.getElementById('joinForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const clubId = document.getElementById('joinClubId').value;
        const studentName = document.getElementById('studentName').value;
        alert(`Application sent for ${studentName}! The club admin will review your request.`);
        closeModal(joinModal);
        document.getElementById('joinForm').reset();
    });

    // Global reset
    window.resetFilters = function () {
        ClubState.searchQuery = '';
        ClubState.activeCategory = 'all';
        ClubState.sortBy = 'name';
        searchInput.value = '';
        sortSelect.value = 'name';
        categoryPills.forEach(p => p.classList.remove('active'));
        categoryPills[0].classList.add('active');
        renderClubs();
    };
}

// Run Init
document.addEventListener('DOMContentLoaded', init);
