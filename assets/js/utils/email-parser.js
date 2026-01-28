/**
 * email-parser.js
 * Utility to extract student details from Poornima University email addresses.
 * Structure: <admission_year><program_code><student_name><unique_id>@poornima.edu.in
 */

const KNOWN_PROGRAMS = [
    'bcaaids', 'bca', 'btech', 'mtech', 'bba', 'bcom', 'ba', 'bsc', 'bdes', 'barch'
];

/**
 * Parses a student email to extract details.
 * @param {string} email 
 * @returns {object|null} Object containing year, program, name, id, studentYear or null if invalid
 */
export function parseStudentEmail(email) {
    if (!email || !email.includes('@poornima.edu.in')) {
        return null;
    }

    const localPart = email.split('@')[0];

    // Regex breakdown:
    // ^(\d{4})       -> Capture first 4 digits (Admission Year)
    // ([a-zA-Z]+)    -> Capture alphabetic characters (Program + Name)
    // (\d+)$         -> Capture trailing digits (Unique ID)
    const regex = /^(\d{4})([a-zA-Z]+)(\d+)$/;
    const match = localPart.match(regex);

    if (!match) {
        return null;
    }

    const admissionYear = parseInt(match[1], 10);
    const middlePart = match[2].toLowerCase(); // Program + Name
    const uniqueId = match[3];

    // Attempt to separate Program from Name
    let program = '';
    let name = middlePart;

    // specific check for longer matches first to avoid partial prefix matches (e.g. 'bcaaids' vs 'bca')
    // We sort KNOWN_PROGRAMS by length descending to match longest possible prefix
    const sortedPrograms = [...KNOWN_PROGRAMS].sort((a, b) => b.length - a.length);

    for (const prog of sortedPrograms) {
        if (middlePart.startsWith(prog)) {
            program = prog;
            name = middlePart.slice(prog.length);
            break;
        }
    }

    // Capitalize name first letter
    if (name) {
        name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Calculate current student year
    const currentStudentYear = calculateStudentYear(admissionYear);

    return {
        admissionYear,
        program: program.toUpperCase(), // e.g. BCA
        name,
        uniqueId,
        studentYear: currentStudentYear // e.g. "3rd Year"
    };
}

/**
 * Calculates which year the student is currently in.
 * @param {number} admissionYear 
 * @returns {string} e.g. "1st Year", "2nd Year"
 */
function calculateStudentYear(admissionYear) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed, 0=Jan, 6=July

    // Academic year usually starts in July.
    // If we are in Jan-June 2026, the academic year is 2025-2026.
    // If we are in July-Dec 2026, the academic year is 2026-2027.

    let academicYearStart = currentYear;
    if (currentMonth < 6) { // Before July
        academicYearStart = currentYear - 1;
    }

    const yearDiff = academicYearStart - admissionYear + 1;

    if (yearDiff < 1) return "1st Year"; // Should not happen usually unless future date
    if (yearDiff > 4) return "Alumni"; // Assuming 4 year max for simplicity, or 5 for Arch

    switch (yearDiff) {
        case 1: return "1st Year";
        case 2: return "2nd Year";
        case 3: return "3rd Year";
        case 4: return "4th Year";
        default: return `${yearDiff}th Year`;
    }
}
