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
        ]
    },
    {
        id: "dance-club",
        name: "Aavishkar Dance Crew",
        logo: "https://via.placeholder.com/80/e91e63/ffffff?text=AD",
        banner: "https://via.placeholder.com/600x200/e91e63/ffffff?text=Dance+Club",
        category: "cultural",
        status: "active",
        description: "Express yourself through movement. We explore improved styles including hip-hop, classical, and contemporary dance forms.",
        mission: "To promote dance as an art form and provide a platform for student talent.",
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
        ]
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
        leadership: [
            { role: "President", name: "Kunal Shah" },
            { role: "Secretary", name: "Priya Das" }
        ],
        contact: {
            email: "robotics@poornima.edu.in",
            instagram: "@robotech_pu"
        },
        events: []
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
        leadership: [
            { role: "President", name: "Ananya Roy" }
        ],
        contact: {
            email: "debate@poornima.edu.in",
            instagram: "@pu_debsoc"
        },
        events: [
            { title: "Freshers Debate", date: "2025-01-10", time: "3:00 PM", type: "upcoming" }
        ]
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
        ]
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
        leadership: [
            { role: "President", name: "Arjun Reddy" }
        ],
        contact: {
            email: "gaming@poornima.edu.in",
            instagram: "@esports_pu"
        },
        events: []
    }
];

// State Management
const ClubState = {
    clubs: CLUBS_DATA,
    activeCategory: 'all',
    searchQuery: '',
    selectedClub: null
};

// DOM Elements
const clubsGrid = document.getElementById('clubsGrid');
const searchInput = document.getElementById('clubSearch');
const categoryPills = document.querySelectorAll('.category-pill');
const clubModal = document.getElementById('clubModal');
const joinModal = document.getElementById('joinModal');
const emptyState = document.getElementById('emptyState');

// Initialize
function init() {
    renderClubs();
    setupEventListeners();
}

// Render Clubs Grid
function renderClubs() {
    clubsGrid.innerHTML = '';

    // Filter data
    const filteredClubs = ClubState.clubs.filter(club => {
        const matchesCategory = ClubState.activeCategory === 'all' || club.category === ClubState.activeCategory;
        const matchesSearch = club.name.toLowerCase().includes(ClubState.searchQuery.toLowerCase()) ||
            club.description.toLowerCase().includes(ClubState.searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Show empty state
    if (filteredClubs.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    // Generate Cards
    filteredClubs.forEach(club => {
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
    // If called from main grid, we need to close detail modal first if open
    closeModal(clubModal);

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
            // Update UI
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Update State
            ClubState.activeCategory = pill.dataset.category;
            renderClubs();
        });
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close on Outside Click
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

        // Simulating API call
        alert(`Application sent for ${studentName}! The club admin will review your request.`);

        closeModal(joinModal);
        document.getElementById('joinForm').reset();
    });

    // Global reset
    window.resetFilters = function () {
        ClubState.searchQuery = '';
        ClubState.activeCategory = 'all';
        searchInput.value = '';
        categoryPills.forEach(p => p.classList.remove('active'));
        categoryPills[0].classList.add('active');
        renderClubs();
    };
}

// Run Init
document.addEventListener('DOMContentLoaded', init);
