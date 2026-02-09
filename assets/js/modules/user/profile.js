// Profile Page JavaScript - Simplified Global Edit (WITH DEBUG LOGGING)
import { db as supabase } from "../../shared/auth-manager.js";
import { parseStudentEmail } from "../../utils/email-parser.js";

console.log("✅ Profile.js loaded successfully");

// Global edit mode state
let isEditMode = false;

// Initialize profile page
document.addEventListener('DOMContentLoaded', function () {
    console.log("✅ DOMContentLoaded fired");

    try {
        checkProfileCompletion();
        loadProfileData();
        initNavigation();
        setupGlobalEdit();
        setupProfileAvatar();
        setupMobileSidebar();
        animateProgressBars();
        loadActiveTab();
        console.log("✅ All initialization functions called");
    } catch (error) {
        console.error("❌ Initialization error:", error);
    }
});

// Initialize navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    console.log(`Found ${navItems.length} navigation items`);
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

    if (mobileSidebarToggle) {
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
    console.log("Loading profile data...");

    // 1. Load from LocalStorage first (for instant load)
    const savedProfile = localStorage.getItem('studentProfile');
    if (savedProfile) {
        try {
            const profile = JSON.parse(savedProfile);
            updateProfileDisplay(profile);
            console.log("✅ Loaded profile from localStorage");
        } catch (e) {
            console.error('Error parsing local profile', e);
        }
    }

    // 2. Fetch fresh data from Supabase
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.log("No user logged in");
            return;
        }

        console.log("Fetching profile from Supabase for user:", user.id);

        const { data: remoteProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
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
            rollNumber: remoteProfile.roll_number || '',
            branch: remoteProfile.branch || '',
            semester: remoteProfile.semester || '',
            section: remoteProfile.section || '',
            batch: remoteProfile.batch || '',
            linkedinUrl: remoteProfile.linkedin_url || '',
            githubUrl: remoteProfile.github_url || '',
            twitterUrl: remoteProfile.twitter_url || '',
            portfolioUrl: remoteProfile.portfolio_url || '',
            cgpa: remoteProfile.cgpa || '',
            personalEmail: remoteProfile.personal_email || '',
            universityEmail: remoteProfile.email || user.email || '',
            phone: remoteProfile.phone_number || '',
            address: remoteProfile.address || '',
            emergencyName: remoteProfile.emergency_name || '',
            emergencyRelation: remoteProfile.emergency_relation || '',
            emergencyPhone: remoteProfile.emergency_phone || '',
            year: remoteProfile.year || ''
        };

        // 4. Update UI and LocalStorage
        updateProfileDisplay(profile);
        localStorage.setItem('studentProfile', JSON.stringify(profile));
        console.log('✅ Profile synced from cloud');

    } catch (err) {
        console.error('❌ Profile sync error:', err);
    }
}

// Update profile display with data
function updateProfileDisplay(profile) {
    console.log("Updating profile display with:", profile);

    // Update all fields by ID
    const fieldMap = {
        // Header fields
        profileName: profile.fullName,
        profileBranch: profile.branch,
        profileYear: profile.year,
        statCGPA: profile.cgpa,

        // Academic fields
        rollNumber: profile.rollNumber,
        branch: profile.branch,
        semester: profile.semester,
        section: profile.section,
        batch: profile.batch,
        cgpa: profile.cgpa + (profile.cgpa && !profile.cgpa.includes('/') ? ' / 10.0' : ''),

        // Personal fields
        fullName: profile.fullName,
        dob: profile.dob,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        nationality: profile.nationality,

        // Contact fields
        personalEmail: profile.personalEmail,
        universityEmail: profile.universityEmail,
        phone: profile.phone,
        address: profile.address,

        // Social links
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        twitterUrl: profile.twitterUrl,
        portfolioUrl: profile.portfolioUrl,

        // Emergency contact
        emergencyName: profile.emergencyName,
        emergencyRelation: profile.emergencyRelation,
        emergencyPhone: profile.emergencyPhone
    };

    // Apply values to elements
    Object.keys(fieldMap).forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element && fieldMap[fieldId]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = fieldMap[fieldId];

                // Update visit button href for social links
                if (fieldId.includes('Url')) {
                    const visitBtn = document.getElementById(fieldId.replace('Url', 'Visit'));
                    if (visitBtn && fieldMap[fieldId]) {
                        visitBtn.href = fieldMap[fieldId];
                    }
                }
            } else {
                element.textContent = fieldMap[fieldId];
            }
        }
    });
}

// Setup global edit/save functionality
function setupGlobalEdit() {
    const editBtn = document.getElementById('editProfileBtn');

    console.log("Setting up global edit. Button found:", !!editBtn);

    if (!editBtn) {
        console.error('❌ Edit profile button not found!');
        return;
    }

    editBtn.addEventListener('click', function () {
        console.log("Edit button clicked! Current mode:", isEditMode ? "EDIT" : "VIEW");

        if (!isEditMode) {
            enableEditMode();
        } else {
            saveAndDisableEditMode();
        }
    });

    console.log("✅ Edit button listener attached");
}

// Enable edit mode
function enableEditMode() {
    console.log("🖊️ Enabling edit mode...");
    isEditMode = true;

    // Get all editable fields
    const editableFields = document.querySelectorAll('.editable-field');
    console.log(`Found ${editableFields.length} editable fields`);

    // Enable all fields
    editableFields.forEach(field => {
        field.disabled = false;
        console.log("Enabled field:", field.id);
    });

    // Update button
    const editBtn = document.getElementById('editProfileBtn');
    const btnIcon = editBtn.querySelector('.btn-icon');
    const btnText = editBtn.querySelector('.btn-text');

    editBtn.classList.add('saving');
    btnIcon.textContent = '💾';
    btnText.textContent = 'Save Profile';

    // Add visual indicator to body
    document.body.classList.add('edit-mode');

    console.log('✅ Edit mode enabled');
}

// Save and disable edit mode
async function saveAndDisableEditMode() {
    console.log("💾 Saving and disabling edit mode...");

    // Save the profile data
    await saveProfileData();

    // Disable edit mode
    isEditMode = false;

    // Get all editable fields
    const editableFields = document.querySelectorAll('.editable-field');

    // Disable all fields
    editableFields.forEach(field => {
        field.disabled = true;
    });

    // Update button
    const editBtn = document.getElementById('editProfileBtn');
    const btnIcon = editBtn.querySelector('.btn-icon');
    const btnText = editBtn.querySelector('.btn-text');

    editBtn.classList.remove('saving');
    btnIcon.textContent = '✏️';
    btnText.textContent = 'Edit Profile';

    // Remove visual indicator from body
    document.body.classList.remove('edit-mode');

    console.log('✅ Edit mode disabled');
}

// Save profile data to Supabase and localStorage
async function saveProfileData() {
    console.log("💾 Saving profile data...");

    // Collect all field values
    const profile = {
        fullName: document.getElementById('fullName')?.value || '',
        dob: document.getElementById('dob')?.value || '',
        gender: document.getElementById('gender')?.value || '',
        bloodGroup: document.getElementById('bloodGroup')?.value || '',
        nationality: document.getElementById('nationality')?.value || '',
        rollNumber: document.getElementById('rollNumber')?.value || '',
        branch: document.getElementById('branch')?.value || '',
        semester: document.getElementById('semester')?.value || '',
        section: document.getElementById('section')?.value || '',
        batch: document.getElementById('batch')?.value || '',
        cgpa: document.getElementById('cgpa')?.value || '',
        personalEmail: document.getElementById('personalEmail')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || '',
        emergencyName: document.getElementById('emergencyName')?.value || '',
        emergencyRelation: document.getElementById('emergencyRelation')?.value || '',
        emergencyPhone: document.getElementById('emergencyPhone')?.value || '',
        linkedinUrl: document.getElementById('linkedinUrl')?.value || '',
        githubUrl: document.getElementById('githubUrl')?.value || '',
        twitterUrl: document.getElementById('twitterUrl')?.value || '',
        portfolioUrl: document.getElementById('portfolioUrl')?.value || '',
        year: document.getElementById('profileYear')?.textContent || ''
    };

    console.log("Profile to save:", profile);

    // 1. Optimistic Update: Save to LocalStorage immediately
    localStorage.setItem('studentProfile', JSON.stringify(profile));
    console.log("✅ Saved to localStorage");

    // Update header display
    if (profile.fullName) {
        const profileNameEl = document.getElementById('profileName');
        if (profileNameEl) profileNameEl.textContent = profile.fullName;
    }

    // UI Feedback
    showNotification('Saving changes...', 'info');

    // 2. Sync to Supabase
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            showNotification('Saved locally (Not logged in)', 'warning');
            console.log("Not logged in, skipping cloud sync");
            return;
        }

        const updates = {
            full_name: profile.fullName,
            dob: profile.dob,
            gender: profile.gender,
            blood_group: profile.bloodGroup,
            nationality: profile.nationality,
            roll_number: profile.rollNumber,
            branch: profile.branch,
            semester: profile.semester,
            section: profile.section,
            batch: profile.batch,
            cgpa: profile.cgpa.replace(' / 10.0', ''),
            personal_email: profile.personalEmail,
            phone_number: profile.phone,
            address: profile.address,
            emergency_name: profile.emergencyName,
            emergency_relation: profile.emergencyRelation,
            emergency_phone: profile.emergencyPhone,
            linkedin_url: profile.linkedinUrl,
            github_url: profile.githubUrl,
            twitter_url: profile.twitterUrl,
            portfolio_url: profile.portfolioUrl,
            year: profile.year,
            updated_at: new Date().toISOString()
        };

        console.log("Sending updates to Supabase:", updates);

        const { error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', user.id);

        if (error) {
            console.error('❌ Supabase update error:', error);
            throw error;
        }

        showNotification('Profile synced successfully!', 'success');
        console.log("✅ Synced to Supabase");

    } catch (err) {
        console.error('❌ Cloud save error:', err);
        showNotification('Saved locally. Cloud sync failed.', 'warning');
    }
}

// Setup profile avatar
function setupProfileAvatar() {
    const avatar = document.getElementById('profileAvatar');
    const fullNameEl = document.getElementById('fullName');

    if (avatar && fullNameEl) {
        const fullName = fullNameEl.value || fullNameEl.textContent || 'Student';

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
    console.log(`📢 Notification: ${message} (${type})`);

    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'warning' ? '#ffc107' : '#0066cc'};
        color: ${type === 'warning' ? '#000' : 'white'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
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

// Check if profile is complete (New User Detection)
async function checkProfileCompletion() {
    console.log("Checking profile completion...");

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log("No user logged in.");
            return;
        }

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error("Error fetching profile:", error);
            return;
        }

        // Check if essential fields are missing
        const isIncomplete = !profile || !profile.branch || !profile.roll_number || !profile.year;

        if (isIncomplete) {
            console.log("Profile incomplete. Showing modal.");
            const parsedData = parseStudentEmail(user.email);
            showProfileCompletionModal(user, profile, parsedData);
        } else {
            console.log("Profile is complete");
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
        if (parsedData.program === 'BCA') inputs.branch.value = 'Computer Applications';
    }

    if (inputs.year && parsedData && parsedData.studentYear) {
        inputs.year.value = parsedData.studentYear;
    }

    if (inputs.rollNumber) {
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
            // Use upsert to create record if it doesn't exist
            const { error: upsertError } = await supabase
                .from('users')
                .upsert({
                    id: user.id,  // Include the user ID
                    email: user.email,  // Include email from auth
                    ...updates
                }, {
                    onConflict: 'id'  // Update if ID already exists
                });

            if (upsertError) throw upsertError;

            // Success
            modal.classList.add('hidden');
            showNotification('Profile setup complete!', 'success');

            // Sync to LocalStorage
            const localProfile = {
                fullName: updates.full_name,
                branch: updates.branch,
                year: updates.year,
                section: updates.section,
                phone: updates.phone_number,
            };

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
