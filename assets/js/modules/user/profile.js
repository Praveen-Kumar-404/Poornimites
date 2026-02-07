// Profile Page JavaScript - Duolingo-Style Navigation
import { db as supabase } from "../../shared/auth-manager.js";
import { parseStudentEmail } from "../../utils/email-parser.js";

// Edit mode state
let isEditMode = false;

// Initialize profile page
document.addEventListener('DOMContentLoaded', function () {
    checkProfileCompletion();
    loadProfileData();
    initNavigation();
    setupSectionEdit();
    setupProfileAvatar();
    setupMobileSidebar();
    animateProgressBars();
    loadActiveTab();
});


// Initialize navigation
// Initialize navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const sectionId = this.getAttribute('data-section');
            switchTab(sectionId);
            setActiveNav(this);
            saveActiveTab(sectionId);

            // Close mobile sidebar after selection
            if (window.innerWidth <= 768) {
                closeMobileSidebar();
            }
        });
    });
}

// Switch between tabs
function switchTab(sectionId) {
    const tabPanels = document.querySelectorAll('.tab-panel');
    // Hide all panels
    tabPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    // Show selected panel
    const targetPanel = document.getElementById(`${sectionId}-panel`);
    if (targetPanel) {
        targetPanel.classList.add('active');

        // Scroll to top of content
        const profileContent = document.querySelector('.profile-content');
        if (profileContent) {
            profileContent.scrollTop = 0;
        }

        // Re-animate progress bars if on academic tab
        if (sectionId === 'academic') {
            setTimeout(animateProgressBars, 100);
        }
    }
}

// Set active navigation item
function setActiveNav(activeItem) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Save active tab to localStorage
function saveActiveTab(sectionId) {
    localStorage.setItem('activeProfileTab', sectionId);
}

// Load active tab from localStorage
function loadActiveTab() {
    let savedTab = localStorage.getItem('activeProfileTab');

    // Redirect old tabs to new mapped tabs
    const validTabs = ['personal', 'academic', 'skills-achievements'];
    if (!savedTab || !validTabs.includes(savedTab)) {
        savedTab = 'personal';
    }

    const targetNav = document.querySelector(`[data-section="${savedTab}"]`);
    if (targetNav) {
        switchTab(savedTab);
        setActiveNav(targetNav);
    }
}

// Setup mobile sidebar
function setupMobileSidebar() {
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const profileSidebar = document.getElementById('profileSidebar');

    if (mobileSidebarToggle) {
        // Remove existing listeners if any (by replacing node or just adding new one safely)
        mobileSidebarToggle.onclick = function (e) {
            e.stopPropagation();
            openMobileSidebar();
        };
    }

    if (sidebarClose) {
        sidebarClose.onclick = function (e) {
            e.stopPropagation();
            closeMobileSidebar();
        };
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
        const toggle = document.getElementById('mobileSidebarToggle');
        const sidebar = document.getElementById('profileSidebar');

        if (window.innerWidth <= 768) {
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
                    closeMobileSidebar();
                }
            }
        }
    });
}

// Open mobile sidebar
function openMobileSidebar() {
    const profileSidebar = document.getElementById('profileSidebar');
    if (profileSidebar) {
        profileSidebar.classList.add('open');
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    const profileSidebar = document.getElementById('profileSidebar');
    if (profileSidebar) {
        profileSidebar.classList.remove('open');
    }
}

// Load profile data from Supabase and sync with localStorage
async function loadProfileData() {
    // 1. Load from LocalStorage first (for instant load)
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
        try {
            const profile = JSON.parse(savedProfile);
            updateProfileDisplay(profile);
        } catch (e) {
            console.error('Error parsing local profile', e);
        }
    }

    // 2. Fetch fresh data from Supabase
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Not logged in

        const { data: remoteProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            // If error is no rows found, we just stick to local
            if (error.code !== 'PGRST116') {
                console.log('Error fetching remote profile:', error);
            }
            return;
        }

        if (!remoteProfile) return;

        // 3. Map DB snake_case to App camelCase
        const profile = {
            fullName: remoteProfile.full_name || '',
            dob: remoteProfile.dob || '',
            gender: remoteProfile.gender || '',
            bloodGroup: remoteProfile.blood_group || '',
            nationality: remoteProfile.nationality || '',
            section: remoteProfile.section || '',
            personalEmail: remoteProfile.personal_email || '',
            phone: remoteProfile.phone_number || '',
            address: remoteProfile.address || '',
            emergencyName: remoteProfile.emergency_name || '',
            emergencyRelation: remoteProfile.emergency_relation || '',
            emergencyPhone: remoteProfile.emergency_phone || '',
            branch: remoteProfile.branch || '',
            year: remoteProfile.year || '',
            cgpa: remoteProfile.cgpa || ''
        };

        // 4. Update UI and LocalStorage
        updateProfileDisplay(profile);
        localStorage.setItem('studentProfile', JSON.stringify(profile));
        console.log('Profile synced from cloud');

    } catch (err) {
        console.error('Profile sync error:', err);
    }
}

// Helper to set value or textContent
function setElementValue(element, value) {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = value;
    } else {
        element.textContent = value;
    }
}

// Helper to get value or textContent
function getElementValue(element) {
    if (!element) return '';
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        return element.value;
    } else {
        return element.textContent;
    }
}

// Update profile display with data
function updateProfileDisplay(profile) {
    // Update header
    if (profile.fullName) {
        const profileNameEl = document.getElementById('profileName');
        const fullNameEl = document.getElementById('fullName');
        if (profileNameEl) profileNameEl.textContent = profile.fullName;
        if (fullNameEl) setElementValue(fullNameEl, profile.fullName);
    }

    if (profile.branch) {
        const profileBranchEl = document.getElementById('profileBranch');
        const branchEl = document.getElementById('branch');
        if (profileBranchEl) profileBranchEl.textContent = profile.branch;
        if (branchEl) branchEl.textContent = profile.branch;
    }

    if (profile.year) {
        const profileYearEl = document.getElementById('profileYear');
        if (profileYearEl) profileYearEl.textContent = profile.year;
    }

    // Update section (input)
    if (profile.section) {
        const sectionEl = document.getElementById('section');
        if (sectionEl) setElementValue(sectionEl, profile.section);
    }

    // Update stats
    if (profile.cgpa) {
        const statCGPAEl = document.getElementById('statCGPA');
        const cgpaEl = document.getElementById('cgpa');
        if (statCGPAEl) statCGPAEl.textContent = profile.cgpa;
        if (cgpaEl) cgpaEl.textContent = profile.cgpa + ' / 10.0';
    }

    // Update personal details
    const personalFields = ['dob', 'gender', 'bloodGroup', 'nationality'];
    personalFields.forEach(field => {
        if (profile[field]) {
            const element = document.getElementById(field);
            if (element) setElementValue(element, profile[field]);
        }
    });

    // Update contact info
    const contactFields = ['personalEmail', 'phone', 'address'];
    contactFields.forEach(field => {
        if (profile[field]) {
            const element = document.getElementById(field);
            if (element) setElementValue(element, profile[field]);
        }
    });

    // Update emergency contact
    const emergencyFields = ['emergencyName', 'emergencyRelation', 'emergencyPhone'];
    emergencyFields.forEach(field => {
        if (profile[field]) {
            const element = document.getElementById(field);
            if (element) setElementValue(element, profile[field]);
        }
    });
}


// Setup section-specific edit functionality
function setupSectionEdit() {
    const editButtons = document.querySelectorAll('.section-edit-btn');

    editButtons.forEach(btn => {
        // Prevent multiple listeners
        btn.onclick = null;

        btn.onclick = function (e) {
            e.stopPropagation(); // prevent bubbling
            const targetSectionId = this.getAttribute('data-target');
            handleSectionEdit(this, targetSectionId);
        };
    });
    console.log(`Attached listeners to ${editButtons.length} section edit buttons.`);
}

// Handle toggle edit for a specific section
function handleSectionEdit(btn, sectionId) {
    const container = document.querySelector(`.profile-section[data-editable-section="${sectionId}"]`);
    if (!container) {
        console.error(`Container for ${sectionId} not found.`);
        return;
    }

    const isEditing = btn.classList.contains('editing');
    const editableFields = container.querySelectorAll('.info-value.editable');

    if (!isEditing) {
        // Enable Edit Mode
        console.log(`Enabling edit for ${sectionId}`);

        editableFields.forEach(field => {
            field.disabled = false;
        });

        // Focus first field
        if (editableFields.length > 0) {
            editableFields[0].focus();
        }

        // Update Button State
        btn.classList.add('editing');
        btn.innerHTML = '💾'; // Change icon to save
        btn.title = "Save Changes";

    } else {
        // Save Mode
        console.log(`Saving changes for ${sectionId}`);

        // Disable Edit Mode
        editableFields.forEach(field => {
            field.disabled = true;
        });

        // Trigger global save
        saveProfileData();

        // Reset Button State
        btn.classList.remove('editing');
        btn.innerHTML = '✏️';
        btn.title = "Edit Section";
    }
}


// Save profile data to Supabase and localStorage
async function saveProfileData() {
    const fullNameEl = document.getElementById('fullName');
    const dobEl = document.getElementById('dob');
    const genderEl = document.getElementById('gender');
    const bloodGroupEl = document.getElementById('bloodGroup');
    const nationalityEl = document.getElementById('nationality');
    const sectionEl = document.getElementById('section');
    const personalEmailEl = document.getElementById('personalEmail');
    const phoneEl = document.getElementById('phone');
    const addressEl = document.getElementById('address');
    const emergencyNameEl = document.getElementById('emergencyName');
    const emergencyRelationEl = document.getElementById('emergencyRelation');
    const emergencyPhoneEl = document.getElementById('emergencyPhone');
    const branchEl = document.getElementById('branch');
    const profileYearEl = document.getElementById('profileYear');
    const statCGPAEl = document.getElementById('statCGPA');

    const profile = {
        fullName: getElementValue(fullNameEl),
        dob: getElementValue(dobEl),
        gender: getElementValue(genderEl),
        bloodGroup: getElementValue(bloodGroupEl),
        nationality: getElementValue(nationalityEl),
        section: getElementValue(sectionEl),
        personalEmail: getElementValue(personalEmailEl),
        phone: getElementValue(phoneEl),
        address: getElementValue(addressEl),
        emergencyName: getElementValue(emergencyNameEl),
        emergencyRelation: getElementValue(emergencyRelationEl),
        emergencyPhone: getElementValue(emergencyPhoneEl),
        branch: branchEl ? branchEl.textContent : '',
        year: profileYearEl ? profileYearEl.textContent : '',
        cgpa: statCGPAEl ? statCGPAEl.textContent : ''
    };

    // 1. Optimistic Update: Save to LocalStorage immediately
    localStorage.setItem('studentProfile', JSON.stringify(profile));

    // UI Feedback
    showNotification('Saving changes...', 'info');

    // 2. Sync to Supabase
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            showNotification('Saved locally (Not logged in)', 'warning');
            return;
        }

        const updates = {
            full_name: profile.fullName,
            dob: profile.dob,
            gender: profile.gender,
            blood_group: profile.bloodGroup,
            nationality: profile.nationality,
            section: profile.section,
            personal_email: profile.personalEmail,
            phone_number: profile.phone,
            address: profile.address,
            emergency_name: profile.emergencyName,
            emergency_relation: profile.emergencyRelation,
            emergency_phone: profile.emergencyPhone,
            branch: profile.branch,
            year: profile.year,
            cgpa: profile.cgpa,
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id);

        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }

        showNotification('Profile synced successfully!', 'success');

    } catch (err) {
        console.error('Cloud save error:', err);
        showNotification('Saved locally. Cloud sync failed.', 'warning');
    }
}

// Setup profile avatar
function setupProfileAvatar() {
    const avatar = document.getElementById('profileAvatar');
    const fullNameEl = document.getElementById('fullName');

    if (avatar && fullNameEl) {
        const fullName = fullNameEl.textContent;

        // Get initials from name
        const initials = fullName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);

        avatar.textContent = initials || '👤';
    }
}

// Animate progress bars on load
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    progressBars.forEach((bar, index) => {
        const width = bar.style.width;
        bar.style.width = '0%';

        setTimeout(() => {
            bar.style.width = width;
        }, 100 + (index * 100));
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#0066cc'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;

    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add skill tag functionality (for future enhancement)
function addSkillTag(containerId, skillName) {
    const container = document.getElementById(containerId);
    if (container) {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skillName;
        container.appendChild(tag);
    }
}

// Add achievement functionality (for future enhancement)
function addAchievement(title, details) {
    const list = document.getElementById('achievementsList');
    if (list) {
        const item = document.createElement('div');
        item.className = 'achievement-item';
        item.innerHTML = `
            <div class="achievement-title">${title}</div>
            <div class="achievement-details">${details}</div>
        `;
        list.appendChild(item);
    }
}

// Export profile data as JSON
function exportProfile() {
    const profile = localStorage.getItem('studentProfile');
    if (profile) {
        const blob = new Blob([profile], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student_profile.json';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Import profile data from JSON
function importProfile(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const profile = JSON.parse(e.target.result);
            localStorage.setItem('studentProfile', JSON.stringify(profile));
            updateProfileDisplay(profile);
            showNotification('Profile imported successfully!', 'success');
        } catch (error) {
            showNotification('Error importing profile', 'error');
        }
    };
    reader.readAsText(file);
}

// Check if profile is complete (New User Detection)
async function checkProfileCompletion() {
    console.log("Checking profile completion...");
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("No user logged in.");
        return; // Handle not logged in (redirect?) - handled by auth-handler likely
    }

    try {
        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Error fetching profile:", error);
            return;
        }

        // Logic: specific fields missing? OR no profile record?
        // We assume auth-handler creates a basic record.
        // Let's check for 'branch' or 'roll_number'
        const isIncomplete = !profile || !profile.branch || !profile.roll_number || !profile.year;

        if (isIncomplete) {
            console.log("Profile incomplete. Showing modal.");
            const parsedData = parseStudentEmail(user.email);
            showProfileCompletionModal(user, profile, parsedData);
        }
    } catch (err) {
        console.error("Unexpected error checking profile:", err);
    }
}

// Show the modal and pre-fill data
function showProfileCompletionModal(user, currentProfile, parsedData) {
    const modal = document.getElementById('profileCompletionModal');
    const form = document.getElementById('profileCompletionForm');

    if (!modal || !form) return;

    // Pre-fill fields
    const inputs = {
        fullName: document.getElementById('modalFullName'),
        branch: document.getElementById('modalBranch'),
        year: document.getElementById('modalYear'),
        section: document.getElementById('modalSection'),
        rollNumber: document.getElementById('modalRollNumber'),
        phone: document.getElementById('modalPhone')
    };

    // Prioritize existing profile data, then parsed data, then user metadata
    const name = (currentProfile && currentProfile.full_name) || (parsedData && parsedData.name) || user.user_metadata.full_name || '';
    if (inputs.fullName) inputs.fullName.value = name;

    if (inputs.branch && parsedData && parsedData.program) {
        // Try to match dropdown values
        // This is tricky because dropdown values are full names (Computer Science & Engineering) 
        // and parser gives codes (BCA).
        // Best effort:
        if (parsedData.program === 'BCA') inputs.branch.value = 'Computer Applications';
        // Add more mappings if needed or rely on user
    }

    if (inputs.year && parsedData && parsedData.studentYear) {
        inputs.year.value = parsedData.studentYear;
    }

    if (inputs.rollNumber && parsedData && parsedData.uniqueId && parsedData.admissionYear && parsedData.program) {
        // Construct standard roll number if missing?
        // Actually user has full email.
        // Let's just use the parsed ID or pre-fill with what we can.
        // The modal asks for "University Roll No.", e.g. 2023BCA...
        // We can reconstruct it:
        const constructedRoll = `${parsedData.admissionYear}${parsedData.program}${parsedData.name.toLowerCase()}${parsedData.uniqueId}`;
        // Wait, roll number usually is different from email.
        // The user request said "2023bcapraveen14906@poornima.edu.in"
        // Breakdown: 14906-> unique roll/registration identifier.
        // So the Roll No might be the full string before @?
        // Let's pre-fill with the email username part as a good guess.
        inputs.rollNumber.value = user.email.split('@')[0];
    }

    // Show modal
    modal.classList.remove('hidden');

    // Handle Submit
    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updates = {
            full_name: formData.get('fullName'),
            branch: formData.get('branch'),
            year: formData.get('year'),
            section: formData.get('section'),
            roll_number: formData.get('rollNumber'),
            phone_number: formData.get('phone'),
            updated_at: new Date().toISOString()
        };

        const btn = document.getElementById('saveProfileBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Saving...';
        btn.disabled = true;

        try {
            const { error: updateError } = await supabase
                .from('users')
                .update(updates)
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Success
            modal.classList.add('hidden');
            showNotification('Profile setup complete!', 'success');

            // Sync to LocalStorage (for compatibility with existing profile.js logic)
            const localProfile = {
                fullName: updates.full_name,
                branch: updates.branch,
                year: updates.year,
                section: updates.section,
                phone: updates.phone_number,
                // Add others as needed to match profile.js expected keys
            };
            // Merge with existing
            const existingLocal = JSON.parse(localStorage.getItem('studentProfile') || '{}');
            localStorage.setItem('studentProfile', JSON.stringify({ ...existingLocal, ...localProfile }));

            // Update UI
            updateProfileDisplay({ ...existingLocal, ...localProfile });

        } catch (err) {
            console.error('Error saving profile:', err);
            showNotification('Failed to save profile. Please try again.', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    };
}
