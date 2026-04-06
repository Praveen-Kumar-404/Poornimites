// Edit Profile Popup Loader
// This script dynamically loads the edit profile popup component into pages
(function () {
    'use strict';

    // Function to load the popup HTML
    function loadPopupHTML() {
        fetch('/components/edit-profile-popup.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load edit profile popup');
                }
                return response.text();
            })
            .then(html => {
                // Create a container for the popup if it doesn't exist
                let container = document.getElementById('edit-profile-popup-container');
                if (!container) {
                    container = document.createElement('div');
                    container.id = 'edit-profile-popup-container';
                    document.body.appendChild(container);
                }

                // Inject the popup HTML
                container.innerHTML = html;

                // Load the popup CSS
                loadPopupCSS();

                // Load the popup JavaScript
                loadPopupJS();
            })
            .catch(error => {
                console.error('Error loading edit profile popup:', error);
            });
    }

    // Function to load the popup CSS
    function loadPopupCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/css/components/edit-profile-popup.css';
        document.head.appendChild(link);
    }

    // Function to load the popup JavaScript
    function loadPopupJS() {
        const script = document.createElement('script');
        script.src = '/assets/js/components/edit-profile-popup.js';
        document.body.appendChild(script);
    }

    // Initialize loader when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPopupHTML);
    } else {
        loadPopupHTML();
    }
})();
