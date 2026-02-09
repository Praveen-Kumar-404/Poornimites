/**
 * 🎯 QUICK VENUE COORDINATE TEMPLATE
 * Copy this template and fill in your venue coordinates
 * 
 * HOW TO USE:
 * 1. Open the coordinate picker tool: venue-coordinate-picker.html
 * 2. Click on locations on the map to get coordinates
 * 3. Copy the coordinates here
 * 4. Replace "Venue Name" with exact name from your event data
 * 5. Paste into venue-map.js VENUE_COORDINATES object
 */

// ═══════════════════════════════════════════════════════
// 📋 BLANK TEMPLATE - Copy & Paste for Each Venue
// ═══════════════════════════════════════════════════════

"Venue Name Here": { x: 50, y: 50, icon: "📍" },


// ═══════════════════════════════════════════════════════
// 📝 EXAMPLE: Pre-filled Venues You Can Edit
// ═══════════════════════════════════════════════════════

// Sports Venues
"Football Ground": { x: 28, y: 38, icon: "⚽" },
"Cricket Ground": { x: 65, y: 45, icon: "🏏" },
"Basketball Court #1": { x: 48, y: 52, icon: "🏀" },
"Basketball Court #2": { x: 50, y: 48, icon: "🏀" },
"Volleyball Court": { x: 52, y: 58, icon: "🏐" },
"Tennis Court": { x: 46, y: 54, icon: "🎾" },
"Badminton Court": { x: 47, y: 56, icon: "🏸" },

// Academic Buildings & Labs  
"Lab 342, 347, 348": { x: 52, y: 48, icon: "💻" },
"Classroom": { x: 50, y: 48, icon: "📚" },
"Ground Floor Seminar Hall": { x: 48, y: 50, icon: "🎤" },

// Event Stages & Cultural Venues
"Lakshya Grand Arena Stage": { x: 50, y: 40, icon: "🎪" },
"Trackside Stage, Porch Area": { x: 45, y: 68, icon: "🎭" },
"Power Stop Park Stage, CP": { x: 42, y: 72, icon: "🎵" },

// Cafeteria & Common Areas
"Cafegram": { x: 48, y: 62, icon: "☕" },
"PU Canteen": { x: 46, y: 64, icon: "🍽️" },
"PIHM Mess": { x: 38, y: 70, icon: "🍴" },

// Outdoor & Other Venues
"Near Parking": { x: 42, y: 75, icon: "🅿️" },
"Gate No. 4": { x: 30, y: 78, icon: "🚪" },


// ═══════════════════════════════════════════════════════
// 🔄 MULTI-CATEGORY VENUE HANDLING
// ═══════════════════════════════════════════════════════

/**
 * If a venue hosts DIFFERENT category events on different days,
 * DON'T add multiple entries!
 *
 * ✅ CORRECT - One entry per physical location:
 * "Main Stage": { x: 50, y: 40, icon: "🎪" },
 *
 * The marker emoji will automatically change based on the event
 * category happening that day:
 * - Day 1: Sports event → Shows ⚽
 * - Day 2: Cultural event → Shows 🎭
 * - Day 3: Edufun event → Shows 🎨
 *
 * ❌ WRONG - Don't duplicate venues:
 * "Main Stage - Sports": { x: 50, y: 40 },  // Delete this!
 * "Main Stage - Cultural": { x: 50, y: 40 }, // Delete this!
 */


// ═══════════════════════════════════════════════════════
// 📌 COORDINATE REFERENCE GUIDE
// ═══════════════════════════════════════════════════════

/**
 * Campus Map Layout (From your image):
 *
 *     0%                    50%                   100%
 * 0%  ┌─────────────────────┬──────────────────────┐
 *     │  Govt School        │    Poornima Ln       │
 *     │  (18, 28)           │    (Top-right)       │
 *     │                     │                      │
 * 25% ├─────────────────────┼──────────────────────┤
 *     │  Football Ground    │    Main Building     │
 *     │  (28, 38)           │    (50, 48)          │
 *     │                     │                      │
 * 50% ├─────────────────────┼──────────────────────┤
 *     │                     │    Cricket Ground    │
 *     │                     │    (65, 45)          │
 *     │  Trackside Stage    │                      │
 * 75% │  (45, 68)           │                      │
 *     │                     │   Gargi's Hostel     │
 *100% └─────────────────────┴──────(80, 28)────────┘
 *
 * Quick Position Guide:
 * - Left side of campus: x = 20-35
 * - Center of campus: x = 45-55
 * - Right side of campus: x = 60-80
 *
 * - Top of campus: y = 20-35
 * - Middle of campus: y = 40-60
 * - Bottom of campus: y = 65-85
 */


// ═══════════════════════════════════════════════════════
// 🚀 QUICK START WORKFLOW
// ═══════════════════════════════════════════════════════

/**
 * STEP 1: Open coordinate picker
 * - Open: d:\Projects\Poornimites\tools\venue-coordinate-picker.html
 * - Upload your campus map image
 *
 * STEP 2: Click on each venue location
 * - Console will show: { x: 45, y: 60 }
 * - Copy the output
 *
 * STEP 3: Fill in template
 * - Use blank template above
 * - Paste coordinates
 * - Add venue name from your event data
 *
 * STEP 4: Add to venue-map.js
 * - Copy completed entry
 * - Paste into VENUE_COORDINATES object
 * - Save file
 *
 * STEP 5: Test
 * - Refresh lakshya-2k26.html
 * - Click "Show Map"
 * - Verify marker appears at correct location
 */


// ═══════════════════════════════════════════════════════
// 💡 TIPS & TRICKS
// ═══════════════════════════════════════════════════════

/**
 * TIP 1: Icon field is optional
 * The emoji shown is based on event category, not venue icon.
 * You can use "📍" for all venues or omit icon entirely.
 * 
 * TIP 2: Venue name matching
 * The system does partial matching, so:
 * - Event: "Basketball Court #1" 
 * - Can match: "Basketball Court #1" OR "Basketball Court"
 * 
 * TIP 3: Group similar venues
 * If you have multiple courts, keep them together:
 * "Basketball Court #1": { x: 48, y: 52 },
 * "Basketball Court #2": { x: 50, y: 48 },
 * 
 * TIP 4: Use sections/comments
 * Organize by area to find venues faster later:
 * // Sports Complex Area
 * // Academic Buildings  
 * // Hostel Area
 */
