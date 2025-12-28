// assets/js/dashboard.js

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
    // Show default section (dashboard) if no active section
    const sections = document.querySelectorAll('.dashboard-section');
    if (sections.length > 0 && !document.querySelector('.dashboard-section.active')) {
        sections[0].classList.add('active');
    }

    // Navigation Click Handlers
    const navItems = document.querySelectorAll('.nav-item');
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
    if (role === 'admin') renderAdminWidgets(data);
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
