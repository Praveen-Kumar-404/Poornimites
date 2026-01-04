// assets/js/dashboard.js
import { supabase } from '../../core/supabase-init.js';


/**
 * MOCK DATA
 */
const MOCK_DATA = {
    // STUDENT DATA
    student: {
        user: { name: "Praveen Kumar", role: "Student", avatar: "PK" },
        stats: [
            { label: "Overall GPA", value: "3.8", icon: "🎓" },
            { label: "Credits Earned", value: "85", icon: "⭐" },
            { label: "Attendance", value: "92%", icon: "📅" }
        ],
        progress: { course: "Data Structures", percent: 75 },
        courses: [
            { name: "Algorithm Design", status: "In Progress", grade: "A", feedback: "Excellent problem solving skills." },
            { name: "Web Technologies", status: "In Progress", grade: "B+", feedback: "Good UI, work on backend logic." },
            { name: "Database Systems", status: "Completed", grade: "O", feedback: "Perfect score." }
        ],
        deadlines: [
            { title: "React Project Submission", date: "Dec 30", type: "urgent" },
            { title: "DSA Quiz 3", date: "Jan 05", type: "normal" }
        ],
        growth: [
            { title: "Frontend Intern @ TechSolutions", type: "Internship" },
            { title: "Advanced React Patterns", type: "Course" }
        ]
    },

    // TEACHER DATA
    teacher: {
        user: { name: "Dr. Sarah Wilson", role: "Teacher", avatar: "SW" },
        stats: [
            { label: "Total Students", value: "145", icon: "👥" },
            { label: "Assignments Active", value: "4", icon: "📝" },
            { label: "Pending Grades", value: "28", icon: "⏳" }
        ],
        classes: [
            { name: "CS101: Intro to CS", students: 45, time: "Mon 10:00 AM" },
            { name: "CS305: Web Dev", students: 50, time: "Tue 2:00 PM" },
            { name: "CS401: AI/ML", students: 50, time: "Wed 11:00 AM" }
        ],
        notifications: [
            { msg: "5 students requested deadline extension for Lab 3", time: "2h ago" },
            { msg: "System maintenance scheduled for tonight", time: "5h ago" }
        ],
        assignments: [
            { title: "Lab 3: React Hooks", status: "grading", count: "45/50 Submitted" },
            { title: "Final Project Proposal", status: "published", count: "Due in 2 days" },
            { title: "Mid-term Exam", status: "draft", count: "Hidden" }
        ],
        atRisk: [
            { name: "John Doe", issue: "Low Attendance (65%)" },
            { name: "Jane Smith", issue: "Missed 2 Assignments" }
        ]
    },

    // ADMIN DATA
    admin: {
        user: { name: "System Admin", role: "Administrator", avatar: "SA" },
        // EXTENDED MOCK USERS FOR MANAGEMENT
        // EXTENDED MOCK USERS REMOVED - FETCHING FROM DB
        users: [],
        stats: [
            { label: "Total Users", value: "2,450", icon: "🌐" },
            { label: "Active Sessions", value: "118", icon: "⚡" },
            { label: "Server Load", value: "24%", icon: "🖥️" }
        ],
        alerts: [
            { msg: "High traffic detected on Student Portal", level: "warning" },
            { msg: "Database backup completed successfully", level: "success" }
        ],
        logs: [
            { user: "user_123", action: "Failed Login", time: "10:15 AM", ip: "192.168.1.5" },
            { user: "mod_45", action: "Deleted Post", time: "09:45 AM", ip: "192.168.1.12" },
            { user: "admin_1", action: "Updated Policy", time: "09:00 AM", ip: "10.0.0.1" }
        ],
        chartData: [
            { label: "Mon", value: 40 },
            { label: "Tue", value: 65 },
            { label: "Wed", value: 85 },
            { label: "Thu", value: 55 },
            { label: "Fri", value: 70 },
            { label: "Sat", value: 30 },
            { label: "Sun", value: 25 }
        ],
        contentStats: [
            { label: "Courses", value: 120 },
            { label: "Assignments", value: 450 },
            { label: "Projects", value: 890 }
        ]
    },

    // MODERATOR DATA
    moderator: {
        user: { name: "Community Mod", role: "Moderator", avatar: "CM" },
        stats: [
            { label: "Pending Reports", value: "12", icon: "🚩" },
            { label: "Active Threads", value: "340", icon: "💬" },
            { label: "Users Flagged", value: "5", icon: "⚠️" }
        ],
        queue: [
            { item: "Spam comment on General", reporter: "user_88", time: "10m ago" },
            { item: "Inappropriate image in Gallery", reporter: "user_99", time: "25m ago" }
        ],
        history: [
            { action: "Banned user_99", reason: "Hate Speech", time: "Yesterday" },
            { action: "Deleted thread #405", reason: "Spam", time: "2 days ago" }
        ],
        liveFeed: [
            { user: "Alice", action: "Posted in General", time: "Just now" },
            { user: "Bob", action: "Commented on 'Exam Tips'", time: "2m ago" },
            { user: "Charlie", action: "Uploaded Project", time: "5m ago" }
        ]
    }
};

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    // Identify Role based on body class or data attribute
    const role = document.body.getAttribute('data-role');
    if (role && MOCK_DATA[role]) {
        initDashboard(role, MOCK_DATA[role]);
    }

    // Mobile Sidebar Toggle
    const menuBtn = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    // SPA Navigation Logic
    // 1. Check for Hash in URL
    const hash = window.location.hash;
    let initialSectionId = null;

    if (hash) {
        // Remove '#'
        const id = hash.substring(1);
        const target = document.getElementById(id);
        if (target && target.classList.contains('dashboard-section')) {
            initialSectionId = id;
        }
    }

    // 2. Activate Initial Section
    const sections = document.querySelectorAll('.dashboard-section');
    const navItems = document.querySelectorAll('.nav-item');

    if (initialSectionId) {
        // Hide all
        sections.forEach(s => s.classList.remove('active'));
        // Show target
        document.getElementById(initialSectionId).classList.add('active');

        // Update Sidebar
        navItems.forEach(nav => {
            nav.classList.remove('active');
            if (nav.getAttribute('data-section') === initialSectionId) {
                nav.classList.add('active');
            }
        });
    } else {
        // Default to first section (Dashboard) if no hash or invalid hash
        if (sections.length > 0 && !document.querySelector('.dashboard-section.active')) {
            sections[0].classList.add('active');
            // Ensure first nav item is active
            if (navItems.length > 0) navItems[0].classList.add('active');
        }
    }

    // Navigation Click Handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetSectionId = item.getAttribute('data-section');

            // Only handle if it's a SPA link (has data-section)
            if (targetSectionId) {
                e.preventDefault();

                // 1. Update Sidebar Active State
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // 2. Hide all sections
                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.classList.remove('active');
                    // Ensure display none is handled by CSS, but we can force it if needed
                    // section.style.display = 'none'; 
                });

                // 3. Show target section
                const targetSection = document.getElementById(targetSectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    // targetSection.style.display = 'block';
                }
            }
        });
    });
});

function initDashboard(role, data) {
    // 1. Set User Profile
    const userName = document.getElementById('userName');
    const userRole = document.getElementById('userRole');
    const userAvatar = document.getElementById('userAvatar');

    if (userName) userName.innerText = data.user.name;
    if (userRole) userRole.innerText = data.user.role;
    if (userAvatar) userAvatar.innerText = data.user.avatar;

    // 2. Render Cards/Stats
    renderStats(data.stats);

    // 3. Render Role-Specific Widgets
    if (role === 'student') renderStudentWidgets(data);
    if (role === 'teacher') renderTeacherWidgets(data);
    if (role === 'admin') {
        renderAdminWidgets(data);
        initUserManagement();
    }
    if (role === 'moderator') renderModeratorWidgets(data);
}

/**
 * RENDERERS
 */
function renderStats(stats) {
    const container = document.getElementById('statsRow');
    if (!container) return;

    container.innerHTML = stats.map(s => `
        <div class="stat-item">
            <div class="stat-icon">${s.icon}</div>
            <div>
                <div class="stat-val">${s.value}</div>
                <div class="stat-label">${s.label}</div>
            </div>
        </div>
    `).join('');
}

// === STUDENT ===
function renderStudentWidgets(data) {
    // Progress Bar
    const progContainer = document.getElementById('progressWidget');
    if (progContainer) {
        progContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                <strong>Continue: ${data.progress.course}</strong>
                <span>${data.progress.percent}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.progress.percent}%"></div>
            </div>
        `;
    }

    // Courses List
    const courseList = document.getElementById('courseList');
    if (courseList) {
        courseList.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Course</th><th>Status</th><th>Grade</th><th>Feedback</th></tr></thead>
                <tbody>
                    ${data.courses.map(c => `
                        <tr>
                            <td>${c.name}</td>
                            <td><span class="status-pill ${c.status === 'Completed' ? 'status-success' : 'status-warning'}">${c.status}</span></td>
                            <td><strong>${c.grade}</strong></td>
                            <td style="font-size:0.85rem; color:#64748b;">${c.feedback || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Growth Zone Widget
    const growthWidget = document.getElementById('growthWidget');
    if (growthWidget) {
        growthWidget.innerHTML = data.growth.map(g => `
            <div class="feed-item" onclick="window.location.href='career.html'" style="cursor:pointer;">
                <div class="feed-avatar" style="background:var(--accent-light); color:var(--accent-color);">🚀</div>
                <div class="feed-content">
                    <h4>${g.title}</h4>
                    <p>New ${g.type} Opportunity</p>
                </div>
            </div>
        `).join('');
    }
}

// === TEACHER ===
function renderTeacherWidgets(data) {
    // Class Schedule
    const classList = document.getElementById('classList');
    if (classList) {
        classList.innerHTML = data.classes.map(c => `
            <div class="card" style="margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:700;">${c.name}</div>
                        <div style="font-size:0.85rem; color:#64748b;">${c.students} Students</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-weight:600; color:var(--accent-color);">${c.time}</div>
                        <button class="icon-btn" style="font-size:0.9rem;">Start Class</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Assignments Kanban
    const assignmentBoard = document.getElementById('assignmentBoard');
    if (assignmentBoard) {
        const drafts = data.assignments.filter(a => a.status === 'draft');
        const published = data.assignments.filter(a => a.status === 'published');
        const grading = data.assignments.filter(a => a.status === 'grading');

        const renderCol = (title, items) => `
            <div class="kanban-col">
                <div class="kanban-header">${title} (${items.length})</div>
                ${items.map(i => `
                    <div class="kanban-item">
                        <div style="font-weight:600; margin-bottom:0.25rem;">${i.title}</div>
                        <div style="font-size:0.8rem; color:#64748b;">${i.count}</div>
                    </div>
                `).join('')}
                <button style="width:100%; border:1px dashed #cbd5e1; background:none; padding:0.5rem; border-radius:6px; color:#64748b; font-size:0.85rem; cursor:pointer;">+ Add</button>
            </div>
        `;

        assignmentBoard.innerHTML = `
            ${renderCol('Drafts', drafts)}
            ${renderCol('Published', published)}
            ${renderCol('Grading', grading)}
        `;
    }

    // At Risk Alert
    const riskAlert = document.getElementById('riskAlert');
    if (riskAlert) {
        riskAlert.innerHTML = `
            <div class="alert-box">
                <div class="alert-title">⚠️ At-Risk Attention Required</div>
                <ul style="margin:0; padding-left:1.5rem;">
                    ${data.atRisk.map(s => `<li><strong>${s.name}</strong>: ${s.issue}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}

// === ADMIN ===
function renderAdminWidgets(data) {
    const logsTable = document.getElementById('logsTable');
    if (logsTable) {
        logsTable.innerHTML = `
            <table class="data-table">
                <thead><tr><th>User</th><th>Action</th><th>Time</th><th>IP</th></tr></thead>
                <tbody>
                    ${data.logs.map(l => `
                        <tr>
                            <td style="font-family:monospace;">${l.user}</td>
                            <td>${l.action}</td>
                            <td>${l.time}</td>
                            <td>${l.ip}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Render Charts
    const chartContainer = document.getElementById('loginChart');
    if (chartContainer) {
        const maxVal = Math.max(...data.chartData.map(d => d.value));
        chartContainer.innerHTML = data.chartData.map(d => `
            <div class="chart-bar-group">
                <div class="chart-bar" style="height: ${(d.value / maxVal) * 100}%" title="${d.value}"></div>
                <span class="chart-label">${d.label}</span>
            </div>
        `).join('');
    }

    // Content Stats
    const contentStatsObj = document.getElementById('contentStats');
    if (contentStatsObj) {
        contentStatsObj.innerHTML = data.contentStats.map(c => `
             <div class="stat-item" style="border:none; box-shadow:none; padding:1rem; background:#f8fafc;">
                 <div style="font-size:1.5rem; font-weight:bold; color:var(--text-primary);">${c.value}</div>
                 <div style="font-size:0.85rem; color:var(--text-secondary);">${c.label}</div>
             </div>
         `).join('');
    }
}

// === MODERATOR ===
function renderModeratorWidgets(data) {
    const queueList = document.getElementById('reportQueue');
    if (queueList) {
        queueList.innerHTML = data.queue.map(q => `
            <div class="card" style="margin-bottom:1rem; border-left: 4px solid #ef4444;">
                <div style="display:flex; justify-content:space-between;">
                    <strong>Reported Content</strong>
                    <span style="font-size:0.8rem; color:#64748b;">${q.time}</span>
                </div>
                <p style="margin:0.5rem 0; font-size:0.95rem;">${q.item}</p>
                <div style="display:flex; gap:0.5rem; justify-content:flex-end;">
                    <button class="btn-primary" style="background:#ef4444; padding:0.25rem 0.75rem; font-size:0.8rem;" onclick="alert('User Banned!')">Ban User</button>
                    <button class="btn-primary" style="background:#64748b; padding:0.25rem 0.75rem; font-size:0.8rem;">Ignore</button>
                </div>
            </div>
        `).join('');
    }

    // Live Feed
    const liveFeed = document.getElementById('liveFeed');
    if (liveFeed) {
        liveFeed.innerHTML = data.liveFeed.map(f => `
            <div class="feed-item">
                <div class="feed-avatar">👤</div>
                <div class="feed-content">
                    <div style="font-size:0.9rem;"><strong>${f.user}</strong> ${f.action}</div>
                    <div class="feed-meta">${f.time}</div>
                </div>
            </div>
        `).join('');
    }

    // History Log
    const modHistory = document.getElementById('modHistory');
    if (modHistory) {
        modHistory.innerHTML = `
            <table class="data-table">
                <thead><tr><th>Action</th><th>Reason</th><th>Time</th></tr></thead>
                <tbody>
                    ${data.history.map(h => `
                        <tr>
                            <td>${h.action}</td>
                            <td>${h.reason}</td>
                            <td>${h.time}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
         `;
    }
}

/**
 * USER MANAGEMENT LOGIC (Admin)
 */
let allUsers = [];
let currentSort = { field: 'username', dir: 'asc' }; // 'username' matches DB column
let currentPage = 1;
const USERS_PER_PAGE = 20;

async function initUserManagement() {
    console.log("Initializing User Management...");

    // Event Listeners
    const searchInput = document.getElementById('userSearch');
    const roleFilter = document.getElementById('roleFilter');
    const sortSelect = document.getElementById('sortOption');
    const editForm = document.getElementById('editRoleForm');

    // Debounce search
    let searchTimeout;
    if (searchInput) searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            fetchAndRenderUsers();
        }, 300);
    });

    if (roleFilter) roleFilter.addEventListener('change', () => {
        currentPage = 1;
        fetchAndRenderUsers();
    });

    if (sortSelect) sortSelect.addEventListener('change', (e) => {
        currentSort.field = e.target.value;
        fetchAndRenderUsers();
    });

    if (editForm) {
        editForm.addEventListener('submit', handleRoleSave);
    }

    // Initial Fetch
    await fetchAndRenderUsers();
}

async function fetchAndRenderUsers() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    // Loading State
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem;"><div class="loader">Loading users...</div></td></tr>`;

    const searchVal = document.getElementById('userSearch')?.value.trim();
    const roleVal = document.getElementById('roleFilter')?.value || 'all';

    try {
        let query = supabase
            .from('users')
            .select('*', { count: 'exact' });

        // Search
        if (searchVal) {
            query = query.or(`username.ilike.%${searchVal}%,email.ilike.%${searchVal}%`);
        }

        // Role Filter (Note: 'roles' column assumed to be JSONB array or text array)
        if (roleVal !== 'all') {
            // Using logic assuming roles is an array column
            query = query.contains('roles', [roleVal]);
        }

        // Sort
        // Mapping UI sort keys to DB columns
        let dbSortField = currentSort.field;
        if (dbSortField === 'name') dbSortField = 'username';
        if (dbSortField === 'role') dbSortField = 'roles'; // Sorting by array is tricky, might default to something else or trust Postgres
        if (dbSortField === 'status') dbSortField = 'status';

        query = query.order(dbSortField, { ascending: currentSort.dir === 'asc' });

        // Pagination
        const from = (currentPage - 1) * USERS_PER_PAGE;
        const to = from + USERS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        allUsers = data; // Store for local access (e.g. modals)
        renderUserTable(data);
        renderPagination(count, from, to);

    } catch (err) {
        console.error('Error fetching users:', err);
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:red; padding:2rem;">Error loading users: ${err.message}</td></tr>`;
    }
}

function renderPagination(totalCount, currentFrom, currentTo) {
    const paginationContainer = document.getElementById('tablePagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(totalCount / USERS_PER_PAGE);

    let html = `<span style="align-self:center; font-size:0.9rem; color:#64748b;">Showing ${currentFrom + 1}-${Math.min(currentTo + 1, totalCount)} of ${totalCount}</span>`;

    if (totalPages > 1) {
        html += `
            <button class="btn-primary" ${currentPage === 1 ? 'disabled style="opacity:0.5"' : ''} onclick="changePage(${currentPage - 1})" style="padding:0.25rem 0.75rem;">Prev</button>
            <button class="btn-primary" ${currentPage === totalPages ? 'disabled style="opacity:0.5"' : ''} onclick="changePage(${currentPage + 1})" style="padding:0.25rem 0.75rem;">Next</button>
        `;
    }
    paginationContainer.innerHTML = html;
}

// Make globally available
window.changePage = function (page) {
    currentPage = page;
    fetchAndRenderUsers();
}

window.handleSort = function (field) {
    if (currentSort.field === field) {
        currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.dir = 'asc';
    }

    const sortSelect = document.getElementById('sortOption');
    if (sortSelect) sortSelect.value = field;

    fetchAndRenderUsers();
}

function renderUserTable(users) {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;

    if (!users || users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:2rem; color:#64748b;">No users found.</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => {
        // Handle missing roles gracefully
        const userRoles = u.roles || ['Student'];
        // Handle date
        const lastLogin = u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never';

        return `
        <tr>
            <td>
                <div style="font-weight:600;">${u.username || 'Unknown'}</div>
            </td>
            <td>${u.email}</td>
            <td>
                ${userRoles.map(r => `<span class="status-pill ${getRoleBadgeClass(r)}">${r}</span>`).join(' ')}
            </td>
            <td>
                <span class="status-pill ${getStatusBadgeClass(u.status)}">${u.status || 'Offline'}</span>
            </td>
            <td>
                <button class="icon-btn" onclick="window.openEditModal('${u.id}')" title="Edit Roles">✏️</button>
            </td>
        </tr>
    `}).join('');
}

function getRoleBadgeClass(role) {
    switch (role) {
        case 'Administrator': return 'status-primary';
        case 'Teacher': return 'status-warning';
        case 'Moderator': return 'status-danger';
        case 'Student': return 'status-success';
        default: return 'status-neutral';
    }
}

function getStatusBadgeClass(status) {
    switch (status) {
        case 'online': return 'status-success'; // Matches 'status' in DB ('online')
        case 'Active': return 'status-success';
        case 'Warning': return 'status-warning';
        case 'Banned': return 'status-danger';
        default: return 'status-neutral';
    }
}

// === MODAL LOGIC ===
window.openEditModal = function (userId) {
    const user = allUsers.find(u => u.id == userId); // loose match for string/int IDs
    if (!user) return;

    // Populate Modal
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editModalUserName').innerText = `Editing: ${user.username} (${user.email})`;

    const currentRoles = user.roles || ['Student'];

    // Reset Checkboxes
    document.querySelectorAll('#editRoleForm input[name="role"]').forEach(cb => {
        cb.checked = currentRoles.includes(cb.value);
    });

    // Show Modal
    const modal = document.getElementById('editRoleModal');
    modal.style.display = 'flex';
}

window.closeEditModal = function () {
    document.getElementById('editRoleModal').style.display = 'none';
}

async function handleRoleSave(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "Saving...";

    const userId = document.getElementById('editUserId').value;
    const checkboxes = document.querySelectorAll('#editRoleForm input[name="role"]:checked');
    const newRoles = Array.from(checkboxes).map(cb => cb.value);

    // Ensure at least Student? optional rule.
    if (newRoles.length === 0) {
        alert("A user must have at least one role.");
        btn.disabled = false;
        btn.innerText = originalText;
        return;
    }

    try {
        const { error } = await supabase
            .from('users')
            .update({ roles: newRoles })
            .eq('id', userId);

        if (error) throw error;

        // Success
        await fetchAndRenderUsers(); // Refresh list
        alert('Roles updated successfully!');
        window.closeEditModal();

    } catch (err) {
        console.error("Error updating roles:", err);
        alert(`Failed to update roles: ${err.message}`);
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

