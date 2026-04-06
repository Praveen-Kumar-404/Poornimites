// Edit Profile Popup Component
(function () {
    'use strict';

    const POPUP_STATE_KEY = 'editProfilePopupDismissed';
    const PROFILE_URL = '/pages/user/profile.html';

    // Initialize popup when DOM is ready
    function init() {
        const overlay = document.getElementById('edit-profile-popup-overlay');
        if (!overlay) {
            console.error('Edit profile popup overlay not found');
            return;
        }

        // Check if user wants to see the popup
        if (shouldShowPopup()) {
            // Show popup after a short delay for better UX
            setTimeout(() => {
                showPopup();
            }, 1500);
        }

        // Attach event listeners
        attachEventListeners();
    }

    // Check if popup should be shown
    function shouldShowPopup() {
        // Don't show if user has dismissed it permanently
        const dismissed = localStorage.getItem(POPUP_STATE_KEY);
        if (dismissed === 'true') {
            return false;
        }

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            return false;
        }

        // You can add additional logic here to check if profile is incomplete
        // For example, checking if certain profile fields are empty
        const profileComplete = checkProfileCompleteness();

        return !profileComplete;
    }

    // Check if user profile is complete
    function checkProfileCompleteness() {
        // Check if contact number (phone) is saved
        const userPhone = localStorage.getItem('userPhone');

        // If phone number exists, profile is considered complete
        // and popup will never show again
        if (userPhone && userPhone.trim() !== '') {
            return true;
        }

        return false;
    }

    // Show the popup
    function showPopup() {
        const overlay = document.getElementById('edit-profile-popup-overlay');
        if (overlay) {
            overlay.classList.add('show');
            // Prevent body scroll when popup is open
            document.body.style.overflow = 'hidden';
        }
    }

    // Hide the popup
    function hidePopup() {
        const overlay = document.getElementById('edit-profile-popup-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            // Restore body scroll
            document.body.style.overflow = '';
        }
    }

    // Redirect to profile page
    function redirectToProfile() {
        window.location.href = PROFILE_URL;
    }

    // Attach event listeners to popup elements
    function attachEventListeners() {
        // Edit Profile button
        const editBtn = document.getElementById('edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function () {
                redirectToProfile();
            });
        }

        // Close button
        const closeBtn = document.getElementById('popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                handleDismiss();
            });
        }

        // Later button
        const laterBtn = document.getElementById('later-btn');
        if (laterBtn) {
            laterBtn.addEventListener('click', function () {
                handleDismiss();
            });
        }

        // Close on overlay click (outside popup)
        const overlay = document.getElementById('edit-profile-popup-overlay');
        if (overlay) {
            overlay.addEventListener('click', function (e) {
                // Only close if clicking the overlay itself, not its children
                if (e.target === overlay) {
                    handleDismiss();
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                const overlay = document.getElementById('edit-profile-popup-overlay');
                if (overlay && overlay.classList.contains('show')) {
                    handleDismiss();
                }
            }
        });
    }

    // Handle popup dismissal
    function handleDismiss() {
        const dontShowAgain = document.getElementById('dont-show-again');

        // If user checked "don't show again", save this preference
        if (dontShowAgain && dontShowAgain.checked) {
            localStorage.setItem(POPUP_STATE_KEY, 'true');
        }

        hidePopup();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
