/**
 * Venue Coordinate Mapping for Lakshya 2k26 Events
 * Maps venue names to percentage-based coordinates on the campus map
 */

const VENUE_COORDINATES = {
    // Sports Venues
    "Football Ground": { x: 32, y: 50, icon: "⚽" },
    "Cricket Ground": { x: 71, y: 60, icon: "🏏" },
    "Basketball Court #1": { x: 28, y: 78, icon: "🏀" },
    "Basketball Court #2": { x: 30, y: 77, icon: "🏀" },
    "Volleyball Court #1": { x: 28, y: 67, icon: "🏐" },
    "Volleyball Court #2": { x: 28, y: 70, icon: "🏐" },
    "Kabaddi Court": { x: 34, y: 39, icon: "🤼" },
    "Pickleball Court": { x: 33, y: 77, icon: "🎾" },
    "Tennis Court": { x: 32, y: 70, icon: "🎾" },
    "Badminton Court": { x: 32, y: 70, icon: "🏸" },

    // Gym & Fitness Venues
    "Old Gym": { x: 20, y: 83, icon: "💪" },
    "New Gym": { x: 18, y: 64, icon: "💪" },
    "At Gym": { x: 18, y: 64, icon: "💪" },
    "Fitness Studio": { x: 18, y: 64, icon: "🏋️" },
    "In front of Fitness Studio": { x: 18, y: 64, icon: "🏋️" },
    "In front of New Gym": { x: 18, y: 64, icon: "💪" },
    "In front of H1 Boys Hostel": { x: 20, y: 84, icon: "🏠" },
    "Football Ground – Yoga Room": { x: 31, y: 39, icon: "🧘" },

    // Hostel Areas
    "Billiards Room (H2 Boys Hostel)": { x: 24, y: 77, icon: "🎱" },
    // "Gargi Gil's Hostel": { x: 80, y: 28, icon: "🏠" },

    // Academic Buildings & Labs
    "Lab 342, 347, 348": { x: 46, y: 59, icon: "💻" },
    "Classroom": { x: 48, y: 55, icon: "📚" },
    "Ground Floor Seminar Hall": { x: 48, y: 65, icon: "🎤" },

    // Event Stages & Cultural Venues
    "Lakshya Grand Arena Stage": { x: 50, y: 40, icon: "🎪" },
    "Trackside Stage, Porch Area": { x: 42, y: 60, icon: "🎭" },
    "Power Stop Park Stage, CP": { x: 57, y: 59, icon: "🎵" },
    "Park Stage, CP": { x: 57, y: 59, icon: "🎵" },
    "Racing Track, Porch Area": { x: 40, y: 59, icon: "🏎️" },

    // Cafeteria & Common Areas
    "Cafegram": { x: 74, y: 67, icon: "☕" },
    "PU Canteen": { x: 42, y: 41, icon: "🍽️" },
    "New Canteen": { x: 42, y: 41, icon: "🍽️" },
    "PIHM Mess": { x: 47, y: 52, icon: "🍴" },

    // Outdoor & Other Venues
    "Near Parking": { x: 38, y: 72, icon: "🅿️" },
    "Behind Admin-2": { x: 52, y: 76, icon: "📍" },
    "Gate No. 4": { x: 35, y: 84, icon: "🚪" },
    "Academic Block Stairs": { x: 43, y: 61, icon: "🏛️" },

    // Schools
    "Govt./Higher/Sandry Sch (High/Grey School/Cent)": { x: 18, y: 28, icon: "🏫" }
};

/**
 * Get coordinates for a venue name
 * Handles partial matches and variations
 */
function getVenueCoordinates(venueName) {
    if (!venueName || venueName === '-') return null;

    // Direct match
    if (VENUE_COORDINATES[venueName]) {
        return VENUE_COORDINATES[venueName];
    }

    // Try to find partial match
    const venueKeys = Object.keys(VENUE_COORDINATES);
    for (const key of venueKeys) {
        if (venueName.includes(key) || key.includes(venueName)) {
            return VENUE_COORDINATES[key];
        }
    }

    // Default to center if venue not found
    return null;
}

/**
 * Get all venues from Lakshya events data
 */
function extractVenuesFromEvents(lakshyaEvents) {
    const venues = new Set();

    Object.keys(lakshyaEvents).forEach(day => {
        lakshyaEvents[day].forEach(event => {
            if (event.venue && event.venue !== '-') {
                venues.add(event.venue);
            }
        });
    });

    return Array.from(venues).sort();
}

/**
 * Group events by venue for a specific day
 */
function groupEventsByVenue(events) {
    const grouped = {};

    events.forEach(event => {
        if (!event.venue || event.venue === '-') return;

        const coords = getVenueCoordinates(event.venue);
        if (!coords) return;

        const key = `${coords.x}-${coords.y}`;

        if (!grouped[key]) {
            grouped[key] = {
                venue: event.venue,
                coordinates: coords,
                events: []
            };
        }

        grouped[key].events.push(event);
    });

    return Object.values(grouped);
}

// Export for use in lakshya-2k26.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VENUE_COORDINATES,
        getVenueCoordinates,
        extractVenuesFromEvents,
        groupEventsByVenue
    };
}

// ES6 Export for event-hub.js
export { VENUE_COORDINATES, getVenueCoordinates, extractVenuesFromEvents, groupEventsByVenue };
