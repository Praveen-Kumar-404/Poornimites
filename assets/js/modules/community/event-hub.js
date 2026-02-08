
// Mock Data for Events
const eventsData = [
    {
        id: 1,
        title: "Freshers' Welcome Party",
        date: "2025-09-10",
        time: "18:00 - 22:00",
        location: "Main Auditorium",
        category: "social",
        description: "Join us for a night of music, dance, and fun to welcome the new batch of 2029!",
        organizer: "Student Council",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rsvp: 245,
        coordinates: { x: 45.5, y: 30.2 } // Example: Auditorium general area
    },
    {
        id: 2,
        title: "Inter-College Hackathon",
        date: "2025-09-15",
        time: "09:00 - 21:00",
        location: "Tech Park, Lab 3",
        category: "academic",
        description: "24-hour coding marathon. Win prizes up to ₹50,000! Teams of 4.",
        organizer: "Coding Club",
        image: "https://images.unsplash.com/photo-1504384308090-c54be3855833?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rsvp: 112,
        coordinates: { x: 72.0, y: 15.5 } // Example: Tech Park area
    },
    {
        id: 3,
        title: "Annual Sports Day",
        date: "2025-09-20",
        time: "08:00 - 17:00",
        location: "University Ground",
        category: "sports",
        description: "Track and field events, football finals, and more. Register at the gym.",
        organizer: "Sports Dep.",
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rsvp: 89,
        coordinates: { x: 20.0, y: 65.0 } // Example: Sports ground area
    },
    {
        id: 4,
        title: "Art Exhibition: Perspectives",
        date: "2025-09-25",
        time: "10:00 - 16:00",
        location: "Art Gallery, Block B",
        category: "arts",
        description: "Showcasing student artwork from the Department of Fine Arts.",
        organizer: "Arts Club",
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rsvp: 45,
        coordinates: { x: 55.0, y: 80.0 } // Example: Arts block
    },
    {
        id: 5,
        title: "Seminar: AI in 2030",
        date: "2025-09-28",
        time: "14:00 - 16:00",
        location: "Seminar Hall 1",
        category: "academic",
        description: "A talk by Dr. S. Gupta on the future of Artificial Intelligence.",
        organizer: "Tech Society",
        image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        rsvp: 156,
        coordinates: { x: 48.0, y: 35.0 } // Example: Seminar hall
    }
];

// Mock Data for Galleries
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
let currentView = 'list'; // list, calendar, map
let filterCategory = 'all';
let searchQuery = '';

// DOM Elements
const eventsContainer = document.getElementById('events-container');
const galleriesGrid = document.querySelector('.gallery-grid');
const searchInput = document.getElementById('event-search');
const categorySelect = document.getElementById('category-filter');
const viewButtons = document.querySelectorAll('.view-btn');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    renderGalleries();
    setupEventListeners();
});

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

// Render Functions
function renderEvents() {
    eventsContainer.innerHTML = '';

    // Filter logic
    const filteredEvents = eventsData.filter(event => {
        const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchQuery) || event.description.toLowerCase().includes(searchQuery);
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
        card.innerHTML = `
            <div class="card-image" style="background-image: url('${event.image}')">
                <span class="category-badge">${event.category}</span>
            </div>
            <div class="card-content">
                <div class="date-badge">${new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <span>🕒 ${event.time}</span>
                    <span>📍 ${event.location}</span>
                </div>
                <p class="event-desc">${event.description}</p>
                <div class="card-footer">
                    <span class="organizer-info">By ${event.organizer}</span>
                    <span class="rsvp-count">${event.rsvp} Going</span>
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
    header.innerHTML = `<h2>September 2025</h2>`;
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

    // Mock Days (starting mid-week for demo)
    for (let i = 0; i < 30; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.innerHTML = `<span class="day-number">${i + 1}</span>`;

        // Find events on this day
        const dayString = `2025-09-${String(i + 1).padStart(2, '0')}`;
        const daysEvents = events.filter(e => e.date === dayString);

        daysEvents.forEach(e => {
            const dot = document.createElement('div');
            dot.className = 'event-dot';
            dot.title = e.title;
            dayCell.appendChild(dot);
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
            pin.title = event.title; // Simple tooltip

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
