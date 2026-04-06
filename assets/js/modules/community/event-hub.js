
import { supabase } from "../../core/supabase-init.js";
import { VENUE_COORDINATES } from './venue-map.js';

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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - query after DOM is loaded
    const eventsContainer = document.getElementById('events-container');
    const galleriesGrid = document.querySelector('.gallery-grid');
    const searchInput = document.getElementById('event-search');
    const categorySelect = document.getElementById('category-filter');
    const viewButtons = document.querySelectorAll('.view-btn');
    const eventForm = document.getElementById('event-form');

    // Make them globally accessible
    window.eventsContainer = eventsContainer;
    window.galleriesGrid = galleriesGrid;
    window.searchInput = searchInput;
    window.categorySelect = categorySelect;
    window.viewButtons = viewButtons;
    window.eventForm = eventForm;

    fetchEvents();
    renderGalleries();
    setupEventListeners();
    setupFormSubmission();
});

// Fetch Approved Events from Supabase
async function fetchEvents() {
    window.eventsContainer.innerHTML = '<div class="loader">Loading events...</div>';

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        window.eventsContainer.innerHTML = '<div class="error-message">Failed to load events. Please try again later.</div>';
        return;
    }

    eventsData = data || [];
    renderEvents();
}

// Event Listeners
function setupEventListeners() {
    window.viewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            window.viewButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentView = e.target.dataset.view;
            renderEvents();
        });
    });

    window.searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderEvents();
    });

    window.categorySelect.addEventListener('change', (e) => {
        filterCategory = e.target.value;
        renderEvents();
    });
}

// Handle Event Submission
function setupFormSubmission() {
    if (!window.eventForm) return;

    window.eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = window.eventForm.querySelector('button[type="submit"]');
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
            window.eventForm.reset();
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
    window.eventsContainer.innerHTML = '';

    // Filter logic
    const filteredEvents = eventsData.filter(event => {
        const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery) || (event.description && event.description.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    if (filteredEvents.length === 0) {
        window.eventsContainer.innerHTML = '<div class="no-results">No events found matching your criteria.</div>';
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
    window.eventsContainer.appendChild(grid);
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
    window.eventsContainer.appendChild(wrapper);
}

function renderMapView(events) {
    window.eventsContainer.innerHTML = `
        <div class="map-view-container">
            <div class="map-wrapper">
                <img src="../../assets/images/campus-map.png" alt="Campus Map" class="campus-map-image">
                <div class="map-markers" id="map-markers"></div>
            </div>
            <div class="map-legend">
                <div class="legend-item"><span class="legend-dot academic"></span> Academic</div>
                <div class="legend-item"><span class="legend-dot sports"></span> Sports</div>
                <div class="legend-item"><span class="legend-dot arts"></span> Arts</div>
                <div class="legend-item"><span class="legend-dot clubs"></span> Clubs</div>
                <div class="legend-item"><span class="legend-dot social"></span> Social</div>
            </div>
        </div>
    `;

    const markersContainer = document.getElementById('map-markers');

    // Group events by location for markers
    const locationMap = {};

    events.forEach(event => {
        // Try to match venue from VENUE_COORDINATES
        let coordinates = event.coordinates;

        // If no coordinates, try to find venue in VENUE_COORDINATES
        if (!coordinates && event.location) {
            const venueKey = Object.keys(VENUE_COORDINATES).find(key =>
                event.location.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(event.location.toLowerCase())
            );

            if (venueKey) {
                coordinates = VENUE_COORDINATES[venueKey];
            }
        }

        if (coordinates) {
            const locKey = `${coordinates.x},${coordinates.y}`;
            if (!locationMap[locKey]) {
                locationMap[locKey] = {
                    coordinates,
                    events: []
                };
            }
            locationMap[locKey].events.push(event);
        }
    });

    // Create markers
    Object.values(locationMap).forEach(location => {
        const marker = createMapMarker(location);
        markersContainer.appendChild(marker);
    });
}

// Helper: Get category emoji
function getCategoryEmoji(category) {
    const emojiMap = {
        'academic': '📚',
        'sports': '⚽',
        'arts': '🎨',
        'clubs': '🎭',
        'social': '🤝'
    };
    return emojiMap[category] || '📍';
}

// Helper: Get category class
function getCategoryClass(category) {
    return category || 'other';
}

// Helper: Create map marker
function createMapMarker(location) {
    const { coordinates, events } = location;
    const primaryEvent = events[0];
    const categoryClass = getCategoryClass(primaryEvent.category);
    const emoji = getCategoryEmoji(primaryEvent.category);

    const marker = document.createElement('div');
    marker.className = `event-marker ${categoryClass}`;
    marker.style.left = `${coordinates.x}%`;
    marker.style.top = `${coordinates.y}%`;

    // Marker pin
    const pin = document.createElement('div');
    pin.className = 'marker-pin';
    pin.textContent = emoji;
    marker.appendChild(pin);

    // Badge for multiple events
    if (events.length > 1) {
        const badge = document.createElement('div');
        badge.className = 'marker-badge';
        badge.textContent = events.length;
        marker.appendChild(badge);
    }

    // Popup
    const popup = createEventPopup(location.events, primaryEvent.location);
    marker.appendChild(popup);

    return marker;
}

// Helper: Create event popup
function createEventPopup(events, venueName) {
    const popup = document.createElement('div');
    popup.className = 'event-popup';

    const header = document.createElement('div');
    header.className = 'popup-header';
    header.innerHTML = `
        <div class="popup-venue">${venueName || events[0].location}</div>
        <div class="popup-count">${events.length} event${events.length > 1 ? 's' : ''}</div>
    `;
    popup.appendChild(header);

    const eventsList = document.createElement('div');
    eventsList.className = 'popup-events';

    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'popup-event-item';
        eventItem.innerHTML = `
            <div class="popup-event-name">${event.title}</div>
            <div class="popup-event-time">🕒 ${event.date} • ${event.time}</div>
            <div class="popup-event-category ${getCategoryClass(event.category)}">${event.category}</div>
        `;
        eventsList.appendChild(eventItem);
    });

    popup.appendChild(eventsList);

    return popup;
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
    if (!window.galleriesGrid) return;

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
        window.galleriesGrid.appendChild(item);
    });
}
