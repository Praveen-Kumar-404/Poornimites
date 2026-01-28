// Profile Page JavaScript - Duolingo-Style Navigation
import { db as supabase } from "../../shared/auth-manager.js";
import { parseStudentEmail } from "../../utils/email-parser.js";

// Edit mode state
let isEditMode = false;

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const tabPanels = document.querySelectorAll('.tab-panel');
const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
const profileSidebar = document.getElementById('profileSidebar');
const sidebarClose = document.getElementById('sidebarClose');
const editProfileBtnInline = document.getElementById('editProfileBtnInline');
const editBtnTextInline = document.getElementById('editBtnTextInline');
const editableFields = document.querySelectorAll('.info-value.editable');

// Initialize profile page
document.addEventListener('DOMContentLoaded', function () {
    checkProfileCompletion();
    loadProfileData();
    initNavigation();
    setupEditMode();
    setupProfileAvatar();
    setupMobileSidebar();
    animateProgressBars();
    loadActiveTab();
});

// Initialize navigation
function initNavigation() {
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
    const savedTab = localStorage.getItem('activeProfileTab');
    if (savedTab) {
        const targetNav = document.querySelector(`[data-section="${savedTab}"]`);
        if (targetNav) {
            switchTab(savedTab);
            setActiveNav(targetNav);
        }
    }
}

// Setup mobile sidebar
function setupMobileSidebar() {
    if (mobileSidebarToggle) {
        mobileSidebarToggle.addEventListener('click', openMobileSidebar);
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeMobileSidebar);
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            if (profileSidebar && profileSidebar.classList.contains('open')) {
                if (!profileSidebar.contains(e.target) && !mobileSidebarToggle.contains(e.target)) {
                    closeMobileSidebar();
                }
            }
        }
    });
}

// Open mobile sidebar
function openMobileSidebar() {
    if (profileSidebar) {
        profileSidebar.classList.add('open');
    }
}

// Close mobile sidebar
function closeMobileSidebar() {
    if (profileSidebar) {
        profileSidebar.classList.remove('open');
    }
}

// Load profile data from localStorage or use defaults
function loadProfileData() {
    const savedProfile = localStorage.getItem('studentProfile');

    if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        updateProfileDisplay(profile);
    }
}

// Update profile display with data
function updateProfileDisplay(profile) {
    // Update header
    if (profile.fullName) {
        const profileNameEl = document.getElementById('profileName');
        const fullNameEl = document.getElementById('fullName');
        if (profileNameEl) profileNameEl.textContent = profile.fullName;
        if (fullNameEl) fullNameEl.textContent = profile.fullName;
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
            if (element) element.textContent = profile[field];
        }
    });

    // Update contact info
    const contactFields = ['personalEmail', 'phone', 'address'];
    contactFields.forEach(field => {
        if (profile[field]) {
            const element = document.getElementById(field);
            if (element) element.textContent = profile[field];
        }
    });

    // Update emergency contact
    const emergencyFields = ['emergencyName', 'emergencyRelation', 'emergencyPhone'];
    emergencyFields.forEach(field => {
        if (profile[field]) {
            const element = document.getElementById(field);
            if (element) element.textContent = profile[field];
        }
    });
}

// Setup edit mode functionality
function setupEditMode() {
    if (editProfileBtnInline) {
        editProfileBtnInline.addEventListener('click', function () {
            isEditMode = !isEditMode;

            if (isEditMode) {
                enableEditMode();
            } else {
                disableEditMode();
                saveProfileData();
            }
        });
    }
}

// Enable edit mode
function enableEditMode() {
    editableFields.forEach(field => {
        field.contentEditable = 'true';
        field.style.borderColor = 'var(--profile-accent)';
        field.style.backgroundColor = '#fff';
    });

    if (editBtnTextInline) {
        editBtnTextInline.textContent = 'Save Profile';
    }
    if (editProfileBtnInline) {
        editProfileBtnInline.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    }
}

// Disable edit mode
function disableEditMode() {
    editableFields.forEach(field => {
        field.contentEditable = 'false';
        field.style.borderColor = '';
        field.style.backgroundColor = '';
    });

    if (editBtnTextInline) {
        editBtnTextInline.textContent = 'Edit Profile';
    }
    if (editProfileBtnInline) {
        editProfileBtnInline.style.background = '';
    }
}

// Save profile data to localStorage
function saveProfileData() {
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
        fullName: fullNameEl ? fullNameEl.textContent : '',
        dob: dobEl ? dobEl.textContent : '',
        gender: genderEl ? genderEl.textContent : '',
        bloodGroup: bloodGroupEl ? bloodGroupEl.textContent : '',
        nationality: nationalityEl ? nationalityEl.textContent : '',
        section: sectionEl ? sectionEl.textContent : '',
        personalEmail: personalEmailEl ? personalEmailEl.textContent : '',
        phone: phoneEl ? phoneEl.textContent : '',
        address: addressEl ? addressEl.textContent : '',
        emergencyName: emergencyNameEl ? emergencyNameEl.textContent : '',
        emergencyRelation: emergencyRelationEl ? emergencyRelationEl.textContent : '',
        emergencyPhone: emergencyPhoneEl ? emergencyPhoneEl.textContent : '',
        branch: branchEl ? branchEl.textContent : '',
        year: profileYearEl ? profileYearEl.textContent : '',
        cgpa: statCGPAEl ? statCGPAEl.textContent : ''
    };

    localStorage.setItem('studentProfile', JSON.stringify(profile));

    // Show success message
    showNotification('Profile saved successfully!', 'success');
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
