// assets/js/career.js

// Mock Data
const INTERNSHIPS = [
    {
        id: 1,
        role: "Frontend Developer Intern",
        company: "TechSolutions Inc.",
        location: "Remote",
        type: "Paid",
        stipend: "₹15,000/mo",
        deadline: "Apply by Jan 10",
        tags: ["React", "CSS", "UI/UX"],
        logo: "TS"
    },
    {
        id: 2,
        role: "Data Analyst Intern",
        company: "DataCorp",
        location: "Jaipur",
        type: "Paid",
        stipend: "₹10,000/mo",
        deadline: "Apply by Jan 15",
        tags: ["Python", "SQL", "Excel"],
        logo: "DC"
    },
    {
        id: 3,
        role: "Social Media Manager",
        company: "Creative Agency",
        location: "Remote",
        type: "Unpaid",
        stipend: "Certificate",
        deadline: "Apply by Jan 20",
        tags: ["Marketing", "Canva", "Content"],
        logo: "CA"
    },
    {
        id: 4,
        role: "Network Engineer Trainee",
        company: "NetWorks",
        location: "On-site",
        type: "Paid",
        stipend: "₹12,000/mo",
        deadline: "Apply by Jan 25",
        tags: ["Networking", "CCNA", "Linux"],
        logo: "NW"
    }
];

const PROJECTS = [
    {
        id: 101,
        title: "Smart Campus App",
        student: "Aarav & Team",
        category: "Tech",
        desc: "A mobile app to track bus schedules and canteen menu in real-time using Flutter and Firebase.",
        image: "https://via.placeholder.com/300x180/004080/fff?text=Smart+Campus"
    },
    {
        id: 102,
        title: "Eco-Friendly Concrete",
        student: "Civil Dept.",
        category: "Research",
        desc: "Research paper published on using plastic waste in concrete mixture to increase durability.",
        image: "https://via.placeholder.com/300x180/28a745/fff?text=Eco+Concrete"
    },
    {
        id: 103,
        title: "Autonomous Drone",
        student: "Robotics Club",
        category: "Tech",
        desc: "A drone capable of surveillance and obstacle avoidance using Raspberry Pi and OpenCV.",
        image: "https://via.placeholder.com/300x180/dc3545/fff?text=Drone+Project"
    }
];

const SKILLS = [
    { title: "Web Development", count: "12 Courses", icon: "💻" },
    { title: "Data Science", count: "8 Courses", icon: "📊" },
    { title: "Soft Skills", count: "5 Workshops", icon: "🗣️" },
    { title: "Entrepreneurship", count: "4 Guides", icon: "🚀" }
];

// State
let state = {
    internshipFilter: 'all',
    projectFilter: 'all'
};

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderInternships();
    renderProjects();
    renderSkills();
    setupFilters();
});

// Render Internships
function renderInternships() {
    const container = document.getElementById('internshipList');
    if (!container) return;

    const filtered = INTERNSHIPS.filter(job => {
        if (state.internshipFilter === 'all') return true;
        if (state.internshipFilter === 'remote') return job.location === 'Remote';
        if (state.internshipFilter === 'paid') return job.type === 'Paid';
        return true;
    });

    container.innerHTML = filtered.map(job => `
        <div class="internship-card">
            <div class="job-main">
                <div class="job-logo">${job.logo}</div>
                <div class="job-info">
                    <h3>${job.role}</h3>
                    <div class="job-company">${job.company} • ${job.location}</div>
                    <div class="job-tags">
                        ${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        <span class="tag ${job.type === 'Paid' ? 'paid' : ''}">${job.type}</span>
                    </div>
                </div>
            </div>
            <div class="job-action">
                <span class="deadline-text">⏳ ${job.deadline}</span>
                <button class="btn-apply" onclick="alert('Redirecting to application portal...')">Apply Now</button>
            </div>
        </div>
    `).join('');
}

// Render Projects
function renderProjects() {
    const container = document.getElementById('projectGrid');
    if (!container) return;

    container.innerHTML = PROJECTS.map(p => `
        <div class="project-card">
            <img src="${p.image}" alt="${p.title}" class="project-img">
            <div class="project-body">
                <h3 class="project-title">${p.title}</h3>
                <p class="project-desc">${p.desc}</p>
                <div class="project-meta">
                    <span>👤 ${p.student}</span>
                    <span>🏷️ ${p.category}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Skills
function renderSkills() {
    const container = document.getElementById('skillGrid');
    if (!container) return;

    container.innerHTML = SKILLS.map(s => `
        <div class="skill-card">
            <span class="skill-icon">${s.icon}</span>
            <div class="skill-title">${s.title}</div>
            <div class="skill-count">${s.count}</div>
        </div>
    `).join('');
}

// Event Listeners
function setupFilters() {
    const internFilter = document.getElementById('internshipFilter');
    if (internFilter) {
        internFilter.addEventListener('change', (e) => {
            state.internshipFilter = e.target.value;
            renderInternships();
        });
    }

    // Mock search functionality
    const searchInput = document.getElementById('internshipSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            // Simplified search simulation
            // In a real app, this would filter the INTERNSHIPS array
        });
    }
}
