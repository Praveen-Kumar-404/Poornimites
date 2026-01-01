/**
 * Personal Planner - Core Logic
 * Handles state management, UI rendering, and local storage persistence.
 */

const Planner = {
    state: {
        activeTab: 'planner', // planner, tracker, life
        tasks: [],
        habits: [],
        events: [],
        projects: []
    },

    init() {
        this.loadData();
        this.setupEventListeners();
        this.render();
        this.startClock();
    },

    // --- Data Management ---

    loadData() {
        const stored = localStorage.getItem('poornimites_planner_data');
        if (stored) {
            this.state = { ...this.state,
                ...JSON.parse(stored)
            };
        } else {
            // Seed initial data if empty
            this.seedData();
        }
    },

    saveData() {
        localStorage.setItem('poornimites_planner_data', JSON.stringify(this.state));
        this.renderStats(); // Update stats whenever data changes
    },

    seedData() {
        this.state.tasks = [{
                id: 't1',
                text: 'Review Lecture Notes',
                priority: 'high',
                completed: false,
                tag: 'Study'
            },
            {
                id: 't2',
                text: 'Email Internship Coordinator',
                priority: 'medium',
                completed: false,
                tag: 'Career'
            }
        ];
        this.state.habits = [{
                id: 'h1',
                text: 'Drink 3L Water',
                streak: 5,
                today: false
            },
            {
                id: 'h2',
                text: 'Read 30 mins',
                streak: 12,
                today: true
            }
        ];
        this.state.events = [{
                id: 'e1',
                title: 'Data Structures Class',
                time: '09:00',
                duration: 60
            },
            {
                id: 'e2',
                title: 'Project Meeting',
                time: '14:00',
                duration: 60
            }
        ];
        this.saveData();
    },

    // --- UI Rendering ---

    render() {
        this.renderTabs();
        this.renderTasks();
        this.renderHabits();
        this.renderSchedule();
        this.renderStats();
    },

    renderTabs() {
        document.querySelectorAll('.tab-content-area').forEach(el => el.classList.remove('active'));
        document.getElementById(`tab-${this.state.activeTab}`).classList.add('active');

        document.querySelectorAll('.planner-tab').forEach(el => {
            el.classList.toggle('active', el.dataset.tab === this.state.activeTab);
        });
    },

    renderTasks() {
        const list = document.getElementById('planner-task-list');
        if (!list) return;

        list.innerHTML = this.state.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? 'checked' : ''} 
                    onchange="Planner.toggleTask('${task.id}')">
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <div class="task-meta">
                        <span class="tag ${task.priority === 'high' ? 'tag-urgent' : 'tag-project'}">${task.tag}</span>
                    </div>
                </div>
                <button class="btn-icon text-danger" onclick="Planner.deleteTask('${task.id}')" style="background:none; border:none; cursor:pointer;">&times;</button>
            </div>
        `).join('') || '<div class="text-muted text-center p-2">No active tasks. Good job!</div>';
    },

    renderHabits() {
        const list = document.getElementById('planner-habit-list');
        if (!list) return;

        list.innerHTML = this.state.habits.map(habit => `
            <div class="habit-row">
                <div>
                    <div class="habit-name">${habit.text}</div>
                    <div class="habit-streak">🔥 ${habit.streak} day streak</div>
                </div>
                <div class="habit-check ${habit.today ? 'done' : ''}" onclick="Planner.toggleHabit('${habit.id}')">
                    ${habit.today ? '✓' : ''}
                </div>
            </div>
        `).join('');
    },

    renderSchedule() {
        const container = document.getElementById('planner-schedule');
        if (!container) return;

        // Simple mock schedule for visualization
        const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        
        container.innerHTML = hours.map(time => {
            const event = this.state.events.find(e => e.time === time);
            return `
            <div class="schedule-row">
                <div class="time-slot">${time}</div>
                <div class="event-slot">
                    ${event ? `<div class="event-card">${event.title}</div>` : ''}
                </div>
            </div>
            `;
        }).join('');
    },

    renderStats() {
        const pendingTasks = this.state.tasks.filter(t => !t.completed).length;
        const habitsDone = this.state.habits.filter(h => h.today).length;
        
        document.getElementById('stat-tasks-pending').innerText = pendingTasks;
        document.getElementById('stat-habits-done').innerText = `${habitsDone}/${this.state.habits.length}`;
    },

    // --- Actions ---

    switchTab(tabName) {
        this.state.activeTab = tabName;
        this.renderTabs();
    },

    addTask(text) {
        if (!text.trim()) return;
        const newTask = {
            id: 't' + Date.now(),
            text: text,
            priority: 'medium',
            completed: false,
            tag: 'Inbox'
        };
        this.state.tasks.unshift(newTask);
        this.saveData();
        this.renderTasks();
    },

    toggleTask(id) {
        const task = this.state.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.renderTasks();
        }
    },

    deleteTask(id) {
        this.state.tasks = this.state.tasks.filter(t => t.id !== id);
        this.saveData();
        this.renderTasks();
    },

    toggleHabit(id) {
        const habit = this.state.habits.find(h => h.id === id);
        if (habit) {
            habit.today = !habit.today;
            if (habit.today) habit.streak++;
            else habit.streak--;
            this.saveData();
            this.renderHabits();
        }
    },

    // --- Quick Capture ---
    handleQuickCapture() {
        const input = document.getElementById('quick-capture-input');
        this.addTask(input.value);
        input.value = '';
    },

    startClock() {
        const update = () => {
            const now = new Date();
            const el = document.getElementById('planner-clock');
            if (el) el.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            const dateEl = document.getElementById('planner-date');
            if (dateEl) dateEl.innerText = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
        };
        update();
        setInterval(update, 60000);
    },

    setupEventListeners() {
        document.getElementById('quick-capture-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleQuickCapture();
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    Planner.init();
});
