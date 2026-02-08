
import { supabase } from "../../core/supabase-init.js";

// Mock Data for Galleries (Keeping as requested)
const galleriesData = [
    {
        id: 101,
        title: "Diwali Celebration 2024",
        date: "2024-11-04",
        cover: "https://images.unsplash.com/photo-1583084333675-02b4d115ee8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
        count: 42
    },
    {
        id: 102,
        title: "Tech Fest '24",
        date: "2024-03-15",
        cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
        count: 128
    },
    {
        id: 103,
        title: "Freshers 2024",
        date: "2024-08-20",
        cover: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60",
        count: 85
    }
];

// State
let eventsData = [];
let currentView = 'list'; // list, calendar, map
let filterCategory = 'all';
let searchQuery = '';

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const galleriesGrid = document.querySelector('.gallery-grid');
const searchInput = document.getElementById('event-search');
const categorySelect = document.getElementById('category-filter');
const viewButtons = document.querySelectorAll('.view-btn');
const eventForm = document.getElementById('event-form');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
    renderGalleries();
    setupEventListeners();
    setupFormSubmission();
});

// Fetch Approved Events from Supabase
async function fetchEvents() {
    eventsContainer.innerHTML = '<div class="loader">Loading events...</div>';

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        eventsContainer.innerHTML = '<div class="error-message">Failed to load events. Please try again later.</div>';
        return;
    }

    eventsData = data || [];
    renderEvents();
}

// Event Listeners
function setupEventListeners() {
    viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            viewButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            renderEvents();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderEvents();
    });

    categorySelect.addEventListener('change', (e) => {
        filterCategory = e.target.value;
        renderEvents();
    });
}

// Handle Event Submission
function setupFormSubmission() {
    if (!eventForm) return;

    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = eventForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Check authentication
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('You must be logged in to submit an event.');
                window.location.href = '../auth/login.html';
                return;
            }

            // Gather form data
            const title = document.getElementById('event-title').value;
            const description = document.getElementById('event-desc').value;
            const category = document.getElementById('event-cat').value;
            const location = document.getElementById('event-loc').value;
            const startDate = document.getElementById('start-time').value;
            const organizerEmail = document.getElementById('organizer-email').value;

            // Map coordinates if selected
            const mapX = document.getElementById('map-x').value;
            const mapY = document.getElementById('map-y').value;
            let coordinates = null;
            if (mapX && mapY) {
                coordinates = { x: parseFloat(mapX), y: parseFloat(mapY) };
            }

            // Date parsing (primitive)
            const dateObj = new Date(startDate);
            const dateStr = dateObj.toISOString().split('T')[0];
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const newEvent = {
                title,
                description,
                category,
                location,
                date: dateStr,
                time: timeStr,
                organizer: organizerEmail,
                user_id: user.id,
                coordinates,
                status: 'pending',
                image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60'
            };

            const { error } = await supabase
                .from('events')
                .insert([newEvent]);

            if (error) throw error;

            alert('Event submitted successfully! It will be visible after moderator approval.');
            eventForm.reset();
            // Reset map pin
            document.getElementById('map-pin').style.display = 'none';

        } catch (error) {
            console.error('Error submitting event:', error);
            alert('Failed to submit event: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Render Functions
function renderEvents() {
    eventsContainer.innerHTML = '';

    // Filter logic
    const filteredEvents = eventsData.filter(event => {
        const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery) || (event.description && event.description.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    if (filteredEvents.length === 0) {
        eventsContainer.innerHTML = '<div class="no-results">No events found matching your criteria.</div>';
        return;
    }

    if (currentView === 'list') {
        renderListView(filteredEvents);
    } else if (currentView === 'calendar') {
        renderCalendarView(filteredEvents);
    } else if (currentView === 'map') {
        renderMapView(filteredEvents);
    }
}

function renderListView(events) {
    const grid = document.createElement('div');
    grid.className = 'events-grid';

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        // Use default image if null
        const imageUrl = event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=60';

        card.innerHTML = `
            <div class="card-image" style="background-image: url('${imageUrl}')">
                <span class="category-badge">${event.category}</span>
            </div>
            <div class="card-content">
                <div class="date-badge">${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <span>🕒 ${event.time}</span>
                    <span>📍 ${event.location}</span>
                </div>
                <p class="event-desc">${event.description || ''}</p>
                <div class="card-footer">
                    <span class="organizer-info">By ${event.organizer}</span>
                    <span class="rsvp-count">Connect</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
    eventsContainer.appendChild(grid);
}

function renderCalendarView(events) {
    // Simplified Calendar Render
    const wrapper = document.createElement('div');
    wrapper.className = 'calendar-view';

    const header = document.createElement('div');
    header.className = 'calendar-header';
    header.innerHTML = `<h2>Upcoming Events</h2>`;
    wrapper.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Days Header
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
        const d = document.createElement('div');
        d.className = 'week-day';
        d.textContent = day;
        grid.appendChild(d);
    });

    // Mock Days for demonstration (just a visual representation)
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 0; i < daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.innerHTML = `<span class="day-number">${i + 1}</span>`;

        // Find events on this day
        // Construct date string YYYY-MM-DD
        const currentDay = i + 1;
        // Simple matching for events in current month (ignoring year/month exact match for robustness in this simple view)
        // Ideally we'd filter strictly.

        events.forEach(e => {
            const eDate = new Date(e.date);
            if (eDate.getDate() === currentDay) {
                const dot = document.createElement('div');
                dot.className = 'event-dot';
                dot.title = e.title;
                dayCell.appendChild(dot);
            }
        });

        grid.appendChild(dayCell);
    }

    wrapper.appendChild(grid);
    eventsContainer.appendChild(wrapper);
}

function renderMapView(events) {
    eventsContainer.innerHTML = `
        <div class="map-view-container" style="position: relative; width: 100%; height: 600px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <img src="../../assets/images/campus-map.png" alt="Campus Map" style="width: 100%; height: 100%; object-fit: contain;">
            <div id="map-overlays"></div>
        </div>
    `;

    const overlaysContainer = document.getElementById('map-overlays');

    events.forEach(event => {
        if (event.coordinates) {
            const pin = document.createElement('div');
            pin.className = 'map-pin';
            pin.style.position = 'absolute';
            pin.style.left = `${event.coordinates.x}%`;
            pin.style.top = `${event.coordinates.y}%`;
            pin.style.transform = 'translate(-50%, -100%)';
            pin.style.cursor = 'pointer';
            pin.innerHTML = `<span style="font-size: 24px;">📍</span>`;
            pin.title = event.title;

            // Add custom tooltip on hover
            const tooltip = document.createElement('div');
            tooltip.className = 'map-tooltip';
            tooltip.style.display = 'none';
            tooltip.style.position = 'absolute';
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.backgroundColor = 'white';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            tooltip.style.zIndex = '10';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.textContent = event.title;

            pin.appendChild(tooltip);

            pin.addEventListener('mouseenter', () => tooltip.style.display = 'block');
            pin.addEventListener('mouseleave', () => tooltip.style.display = 'none');

            overlaysContainer.appendChild(pin);
        }
    });
}

// Map Selection Logic for Form
const mapContainer = document.getElementById('map-selector-container');
const mapImage = document.getElementById('campus-map-image');
const mapPin = document.getElementById('map-pin');
const inputX = document.getElementById('map-x');
const inputY = document.getElementById('map-y');

if (mapContainer && mapImage) {
    mapContainer.addEventListener('click', (e) => {
        const rect = mapImage.getBoundingClientRect();

        // Calculate click position relative to the image
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate percentage (0-100)
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Update inputs
        inputX.value = xPercent.toFixed(2);
        inputY.value = yPercent.toFixed(2);

        // Show and position pin
        mapPin.style.display = 'block';
        mapPin.style.left = `${xPercent}%`;
        mapPin.style.top = `${yPercent}%`;
    });
}

function renderGalleries() {
    if (!galleriesGrid) return;

    galleriesData.forEach(gallery => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        // Randomly make some wide for masonry effect
        if (Math.random() > 0.7) item.classList.add('wide');

        item.innerHTML = `
            <img src="${gallery.cover}" loading="lazy" alt="${gallery.title}">
            <div class="gallery-overlay">
                <h3>${gallery.title}</h3>
                <p>${gallery.date} • ${gallery.count} Photos</p>
            </div>
        `;
        galleriesGrid.appendChild(item);
    });
}
