// assets/js/student-bazaar.js

// ==================== STATE MANAGEMENT ====================
const BazaarState = {
    listings: [],
    savedListings: JSON.parse(localStorage.getItem('savedListings') || '[]'),
    userListings: JSON.parse(localStorage.getItem('userListings') || '[]'),
    currentUser: {
        id: 'user123', // This should come from auth system
        name: 'Current User',
        rating: 4.5
    },
    activeTab: 'books',
    filters: {
        minPrice: null,
        maxPrice: null,
        condition: [],
        category: '',
        radius: 10,
        sortBy: 'newest'
    },
    currentListingId: null
};

// ==================== DATA INITIALIZATION ====================
function initializeSampleData() {
    const sampleListings = [
        // Books
        {
            id: 'book1',
            category: 'books',
            title: 'Data Structures and Algorithms',
            subject: 'Computer Science / Semester 3',
            author: 'Cormen, Leiserson, Rivest',
            edition: '3rd Edition',
            condition: 'like-new',
            originalPrice: 800,
            price: 450,
            availability: 'sell',
            location: 'Main Campus',
            distance: 0.5,
            images: ['https://via.placeholder.com/400x300/667eea/ffffff?text=DSA+Book'],
            sellerId: 'seller1',
            sellerName: 'Rahul Sharma',
            sellerRating: 4.8,
            datePosted: Date.now() - 86400000 * 2,
            status: 'active',
            views: 45,
            saves: 12
        },
        {
            id: 'book2',
            category: 'books',
            title: 'Operating Systems Concepts',
            subject: 'Computer Science / Semester 4',
            author: 'Silberschatz, Galvin',
            edition: '9th Edition',
            condition: 'used',
            originalPrice: 650,
            price: 300,
            availability: 'sell',
            location: 'North Block',
            distance: 1.2,
            images: ['https://via.placeholder.com/400x300/764ba2/ffffff?text=OS+Book'],
            sellerId: 'seller2',
            sellerName: 'Priya Patel',
            sellerRating: 4.5,
            datePosted: Date.now() - 86400000 * 5,
            status: 'active',
            views: 32,
            saves: 8
        },
        // Gadgets
        {
            id: 'gadget1',
            category: 'gadgets',
            title: 'Scientific Calculator Casio FX-991EX',
            deviceName: 'Casio FX-991EX',
            purchaseYear: 2023,
            condition: 'new',
            accessories: 'Original box, manual',
            warranty: 'Yes - 6 months remaining',
            price: 1200,
            reason: 'Bought duplicate by mistake',
            location: 'South Campus',
            distance: 2.1,
            images: ['https://via.placeholder.com/400x300/f093fb/ffffff?text=Calculator'],
            sellerId: 'seller3',
            sellerName: 'Amit Kumar',
            sellerRating: 5.0,
            datePosted: Date.now() - 86400000,
            status: 'active',
            views: 67,
            saves: 23
        },
        {
            id: 'gadget2',
            category: 'gadgets',
            title: 'Wireless Mouse Logitech M331',
            deviceName: 'Logitech M331',
            purchaseYear: 2022,
            condition: 'like-new',
            accessories: 'USB receiver',
            warranty: 'No',
            price: 400,
            reason: 'Upgraded to new model',
            location: 'Main Campus',
            distance: 0.8,
            images: ['https://via.placeholder.com/400x300/4facfe/ffffff?text=Mouse'],
            sellerId: 'seller4',
            sellerName: 'Sneha Reddy',
            sellerRating: 4.3,
            datePosted: Date.now() - 86400000 * 3,
            status: 'active',
            views: 28,
            saves: 5
        },
        // Other Items
        {
            id: 'other1',
            category: 'other',
            itemName: 'Study Lamp LED',
            itemCategory: 'Furniture',
            condition: 'used',
            price: 250,
            description: 'Adjustable LED study lamp, works perfectly',
            location: 'Hostel Block A',
            distance: 1.5,
            images: ['https://via.placeholder.com/400x300/00f2fe/ffffff?text=Study+Lamp'],
            sellerId: 'seller5',
            sellerName: 'Vikram Singh',
            sellerRating: 4.6,
            datePosted: Date.now() - 86400000 * 4,
            status: 'active',
            views: 19,
            saves: 4
        },
        // Roommates
        {
            id: 'roommate1',
            category: 'roommate',
            mode: 'looking',
            title: 'Looking for Roommate - 2BHK near Campus',
            location: 'Marathahalli (2km from campus)',
            distance: 2.0,
            rentRange: '8000-10000',
            roomType: 'shared',
            genderPreference: 'male',
            lifestyle: ['non-smoker', 'quiet', 'early-riser'],
            moveInDate: '2025-01-01',
            duration: 'long-term',
            description: 'Looking for a clean, responsible roommate. Fully furnished 2BHK with WiFi.',
            images: ['https://via.placeholder.com/400x300/43e97b/ffffff?text=Room'],
            sellerId: 'seller6',
            sellerName: 'Arjun Mehta',
            sellerRating: 4.7,
            datePosted: Date.now() - 86400000 * 1,
            status: 'active',
            views: 54,
            saves: 15
        }
    ];

    // Load from localStorage or use sample data
    const stored = localStorage.getItem('bazaarListings');
    BazaarState.listings = stored ? JSON.parse(stored) : sampleListings;
    saveListings();
}

function saveListings() {
    localStorage.setItem('bazaarListings', JSON.stringify(BazaarState.listings));
}

// ==================== UI RENDERING ====================
function renderListings(category = BazaarState.activeTab) {
    const gridId = category === 'my-listings' ? 'myListingsGrid' : `${category}Grid`;
    const grid = document.getElementById(gridId);

    if (!grid) return;

    let filteredListings = category === 'my-listings'
        ? BazaarState.listings.filter(l => BazaarState.userListings.includes(l.id))
        : BazaarState.listings.filter(l => l.category === category && l.status === 'active');

    // Apply filters
    filteredListings = applyFilters(filteredListings);

    // Show empty state if no listings
    const emptyState = document.getElementById('emptyState');
    if (filteredListings.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    // Render listing cards
    grid.innerHTML = filteredListings.map(listing => createListingCard(listing)).join('');

    // Update stats
    updateStats();
}

function createListingCard(listing) {
    const isSaved = BazaarState.savedListings.includes(listing.id);
    const isOwn = BazaarState.userListings.includes(listing.id);

    const conditionClass = `badge-${listing.condition}`;
    const imageUrl = listing.images && listing.images[0] ? listing.images[0] : 'https://via.placeholder.com/400x300/cccccc/ffffff?text=No+Image';

    let title, subtitle, price;

    if (listing.category === 'books') {
        title = listing.title;
        subtitle = listing.subject;
        price = `₹${listing.price}`;
    } else if (listing.category === 'gadgets') {
        title = listing.title;
        subtitle = listing.deviceName;
        price = `₹${listing.price}`;
    } else if (listing.category === 'roommate') {
        title = listing.title;
        subtitle = `${listing.roomType} • ₹${listing.rentRange}`;
        price = '';
    } else {
        title = listing.itemName || listing.title;
        subtitle = listing.itemCategory || '';
        price = listing.price ? `₹${listing.price}` : 'Free';
    }

    return `
        <div class="listing-card" onclick="openDetailModal('${listing.id}')">
            <div class="listing-actions">
                ${!isOwn ? `<button class="action-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleSave('${listing.id}')" title="${isSaved ? 'Unsave' : 'Save'}">
                    ${isSaved ? '❤️' : '🤍'}
                </button>` : ''}
            </div>
            
            <img src="${imageUrl}" 
                 alt="${title}" 
                 class="listing-image" 
                 onerror="this.onerror=null; this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22280%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22280%22%20height%3D%22200%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2394a3b8%22%3EImage%20Not%20Available%3C%2Ftext%3E%3C%2Fsvg%3E'"
            />
            
            <div class="listing-content">
                <div class="listing-header">
                    <h3 class="listing-title" title="${title}">${title}</h3>
                    ${price ? `<span class="listing-price">${price}</span>` : ''}
                </div>
                ${subtitle ? `<p class="listing-subtitle" title="${subtitle}">${subtitle}</p>` : ''}
                <div class="listing-badges">
                    ${listing.condition ? `<span class="badge ${conditionClass}">${listing.condition.replace('-', ' ')}</span>` : ''}
                    ${listing.sellerRating >= 4.5 ? '<span class="badge badge-verified">✓ Verified</span>' : ''}
                </div>
                <div class="listing-footer">
                    <div class="seller-info">
                        <span class="seller-rating">⭐ ${listing.sellerRating}</span>
                        <span>${listing.sellerName}</span>
                    </div>
                    <span class="listing-distance">📍 ${listing.distance} km</span>
                </div>
            </div>
        </div>
    `;
}

function applyFilters(listings) {
    let filtered = [...listings];

    // Price filter
    if (BazaarState.filters.minPrice !== null) {
        filtered = filtered.filter(l => (l.price || 0) >= BazaarState.filters.minPrice);
    }
    if (BazaarState.filters.maxPrice !== null) {
        filtered = filtered.filter(l => (l.price || 0) <= BazaarState.filters.maxPrice);
    }

    // Condition filter
    if (BazaarState.filters.condition.length > 0) {
        filtered = filtered.filter(l => BazaarState.filters.condition.includes(l.condition));
    }

    // Distance filter
    filtered = filtered.filter(l => l.distance <= BazaarState.filters.radius);

    // Sort
    switch (BazaarState.filters.sortBy) {
        case 'newest':
            filtered.sort((a, b) => b.datePosted - a.datePosted);
            break;
        case 'price-low':
            filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-high':
            filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
        case 'distance':
            filtered.sort((a, b) => a.distance - b.distance);
            break;
    }

    return filtered;
}

function updateStats() {
    const activeListings = BazaarState.listings.filter(l => l.status === 'active').length;
    const soldToday = BazaarState.listings.filter(l => {
        const today = new Date().setHours(0, 0, 0, 0);
        return l.status === 'sold' && l.soldDate >= today;
    }).length;
    const verifiedUsers = new Set(BazaarState.listings.map(l => l.sellerId)).size;

    document.getElementById('activeListings').textContent = activeListings;
    document.getElementById('soldToday').textContent = soldToday;
    document.getElementById('verifiedUsers').textContent = verifiedUsers;
}

// ==================== TAB MANAGEMENT ====================
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
        btn.setAttribute('aria-selected', btn.dataset.tab === tab);
    });

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tab}-content`);
    });

    BazaarState.activeTab = tab;
    renderListings(tab);
}

// ==================== SEARCH & FILTER ====================
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

function performSearch(query) {
    if (!query.trim()) {
        renderListings();
        return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const category = BazaarState.activeTab === 'my-listings' ? null : BazaarState.activeTab;

    let results = BazaarState.listings.filter(listing => {
        if (category && listing.category !== category) return false;

        const searchableText = [
            listing.title,
            listing.subject,
            listing.author,
            listing.deviceName,
            listing.itemName,
            listing.description,
            listing.location,
            listing.sellerName
        ].filter(Boolean).join(' ').toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
    });

    const gridId = BazaarState.activeTab === 'my-listings' ? 'myListingsGrid' : `${BazaarState.activeTab}Grid`;
    const grid = document.getElementById(gridId);

    if (results.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No results found for your search.</p></div>';
    } else {
        grid.innerHTML = results.map(listing => createListingCard(listing)).join('');
    }
}

function initializeFilters() {
    // Filter toggle for mobile
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');
    const filterClose = document.getElementById('filterClose');

    filterToggle?.addEventListener('click', () => {
        filterPanel.classList.add('active');
    });

    filterClose?.addEventListener('click', () => {
        filterPanel.classList.remove('active');
    });

    // Radius slider
    const radiusSlider = document.getElementById('radiusSlider');
    const radiusValue = document.getElementById('radiusValue');

    radiusSlider?.addEventListener('input', (e) => {
        radiusValue.textContent = `${e.target.value} km`;
        BazaarState.filters.radius = parseInt(e.target.value);
    });

    // Apply filters button
    document.getElementById('applyFilters')?.addEventListener('click', () => {
        applyFilterSettings();
        filterPanel.classList.remove('active');
    });

    // Clear filters button
    document.getElementById('clearFilters')?.addEventListener('click', () => {
        clearFilters();
    });

    // Sort select
    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
        BazaarState.filters.sortBy = e.target.value;
        renderListings();
    });
}

function applyFilterSettings() {
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;

    BazaarState.filters.minPrice = minPrice ? parseInt(minPrice) : null;
    BazaarState.filters.maxPrice = maxPrice ? parseInt(maxPrice) : null;

    // Condition checkboxes
    const conditionCheckboxes = document.querySelectorAll('#conditionFilter input[type="checkbox"]:checked');
    BazaarState.filters.condition = Array.from(conditionCheckboxes).map(cb => cb.value);

    renderListings();
}

function clearFilters() {
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('radiusSlider').value = 10;
    document.getElementById('radiusValue').textContent = '10 km';
    document.getElementById('sortSelect').value = 'newest';

    document.querySelectorAll('#conditionFilter input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    BazaarState.filters = {
        minPrice: null,
        maxPrice: null,
        condition: [],
        category: '',
        radius: 10,
        sortBy: 'newest'
    };

    renderListings();
}

// ==================== MODAL MANAGEMENT ====================
function initializeModals() {
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // FAB button
    document.getElementById('createListingBtn')?.addEventListener('click', openCreateModal);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openCreateModal() {
    openModal('createModal');
    resetListingForm();
}

function openDetailModal(listingId) {
    const listing = BazaarState.listings.find(l => l.id === listingId);
    if (!listing) return;

    // Increment views
    listing.views++;
    saveListings();

    const modal = document.getElementById('detailModal');
    const content = document.getElementById('detailContent');

    const isSaved = BazaarState.savedListings.includes(listingId);
    const isOwn = BazaarState.userListings.includes(listingId);

    let detailsHTML = `
        <div class="listing-detail">
            <div class="detail-images">
                ${listing.images && listing.images.length > 0 ?
            `<img src="${listing.images[0]}" alt="${listing.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1rem;" />`
            : ''}
            </div>
            <h2>${listing.title}</h2>
            ${listing.price ? `<p class="listing-price" style="font-size: 1.5rem; margin: 1rem 0;">₹${listing.price}</p>` : ''}
            
            <div style="margin: 1.5rem 0;">
                ${listing.condition ? `<p><strong>Condition:</strong> ${listing.condition.replace('-', ' ')}</p>` : ''}
                ${listing.location ? `<p><strong>Location:</strong> ${listing.location} (${listing.distance} km away)</p>` : ''}
                ${listing.subject ? `<p><strong>Subject:</strong> ${listing.subject}</p>` : ''}
                ${listing.author ? `<p><strong>Author:</strong> ${listing.author}</p>` : ''}
                ${listing.edition ? `<p><strong>Edition:</strong> ${listing.edition}</p>` : ''}
                ${listing.deviceName ? `<p><strong>Device:</strong> ${listing.deviceName}</p>` : ''}
                ${listing.warranty ? `<p><strong>Warranty:</strong> ${listing.warranty}</p>` : ''}
                ${listing.description ? `<p><strong>Description:</strong> ${listing.description}</p>` : ''}
            </div>

            <div style="border-top: 2px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;">
                <p><strong>Seller:</strong> ${listing.sellerName} ⭐ ${listing.sellerRating}</p>
                <p><strong>Posted:</strong> ${formatDate(listing.datePosted)}</p>
                <p><strong>Views:</strong> ${listing.views} • <strong>Saves:</strong> ${listing.saves}</p>
            </div>

            <div class="detail-actions" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                ${!isOwn ? `
                    <button class="btn-primary" onclick="openMessageModal('${listingId}')">💬 Message Seller</button>
                    <button class="btn-secondary" onclick="toggleSave('${listingId}')">${isSaved ? '❤️ Saved' : '🤍 Save'}</button>
                    <button class="btn-secondary" onclick="shareListing('${listingId}')">📤 Share</button>
                    <button class="btn-secondary" onclick="openReportModal('${listingId}')" style="background: var(--danger-color);">🚩 Report</button>
                ` : `
                    <button class="btn-primary" onclick="editListing('${listingId}')">✏️ Edit</button>
                    <button class="btn-secondary" onclick="markAsSold('${listingId}')">✓ Mark as Sold</button>
                    <button class="btn-secondary" onclick="deleteListing('${listingId}')" style="background: var(--danger-color);">🗑️ Delete</button>
                `}
            </div>
        </div>
    `;

    content.innerHTML = detailsHTML;
    openModal('detailModal');
}

function openMessageModal(listingId) {
    BazaarState.currentListingId = listingId;
    closeModal('detailModal');
    openModal('messageModal');
}

function openReportModal(listingId) {
    BazaarState.currentListingId = listingId;
    closeModal('detailModal');
    openModal('reportModal');
}

// ==================== LISTING ACTIONS ====================
function toggleSave(listingId) {
    const index = BazaarState.savedListings.indexOf(listingId);
    const listing = BazaarState.listings.find(l => l.id === listingId);

    if (index > -1) {
        BazaarState.savedListings.splice(index, 1);
        if (listing) listing.saves--;
    } else {
        BazaarState.savedListings.push(listingId);
        if (listing) listing.saves++;
    }

    localStorage.setItem('savedListings', JSON.stringify(BazaarState.savedListings));
    saveListings();
    renderListings();
}

function shareListing(listingId) {
    const listing = BazaarState.listings.find(l => l.id === listingId);
    if (!listing) return;

    const shareText = `Check out this listing: ${listing.title} - ₹${listing.price || 'Free'}`;

    if (navigator.share) {
        navigator.share({
            title: listing.title,
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Link copied to clipboard!');
    }
}

function markAsSold(listingId) {
    const listing = BazaarState.listings.find(l => l.id === listingId);
    if (!listing) return;

    if (confirm('Mark this listing as sold?')) {
        listing.status = 'sold';
        listing.soldDate = Date.now();
        saveListings();
        closeModal('detailModal');
        renderListings();
        alert('Listing marked as sold!');
    }
}

function deleteListing(listingId) {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
        BazaarState.listings = BazaarState.listings.filter(l => l.id !== listingId);
        BazaarState.userListings = BazaarState.userListings.filter(id => id !== listingId);

        localStorage.setItem('userListings', JSON.stringify(BazaarState.userListings));
        saveListings();
        closeModal('detailModal');
        renderListings();
        alert('Listing deleted successfully!');
    }
}

// ==================== LISTING FORM ====================
function initializeListingForm() {
    const form = document.getElementById('listingForm');
    const categorySelect = document.getElementById('listingCategory');
    const nextBtn = document.getElementById('nextStep');
    const prevBtn = document.getElementById('prevStep');
    const submitBtn = document.getElementById('submitListing');

    categorySelect?.addEventListener('change', (e) => {
        if (e.target.value) {
            loadDynamicFields(e.target.value);
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (validateStep(1)) {
            showStep(2);
        }
    });

    prevBtn?.addEventListener('click', () => {
        showStep(1);
    });

    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitListing();
    });

    // Image upload
    document.getElementById('listingImages')?.addEventListener('change', handleImageUpload);

    // Report form
    document.getElementById('reportForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        submitReport();
    });

    // Message send
    document.getElementById('sendMessage')?.addEventListener('click', sendMessage);
}

function loadDynamicFields(category) {
    const container = document.getElementById('dynamicFields');
    let fieldsHTML = '';

    switch (category) {
        case 'books':
            fieldsHTML = `
                <div class="form-group">
                    <label for="bookTitle">Book Title *</label>
                    <input type="text" id="bookTitle" required />
                </div>
                <div class="form-group">
                    <label for="bookSubject">Subject / Course / Semester *</label>
                    <input type="text" id="bookSubject" required />
                </div>
                <div class="form-group">
                    <label for="bookAuthor">Author *</label>
                    <input type="text" id="bookAuthor" required />
                </div>
                <div class="form-group">
                    <label for="bookEdition">Edition</label>
                    <input type="text" id="bookEdition" />
                </div>
                <div class="form-group">
                    <label for="bookCondition">Condition *</label>
                    <select id="bookCondition" required>
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="used">Used</option>
                        <option value="heavily-used">Heavily Used</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="bookOriginalPrice">Original Price (₹)</label>
                    <input type="number" id="bookOriginalPrice" min="0" />
                </div>
                <div class="form-group">
                    <label for="bookPrice">Asking Price (₹) *</label>
                    <input type="number" id="bookPrice" min="0" required />
                </div>
                <div class="form-group">
                    <label for="bookLocation">Pickup Location *</label>
                    <input type="text" id="bookLocation" required />
                </div>
            `;
            break;

        case 'gadgets':
            fieldsHTML = `
                <div class="form-group">
                    <label for="gadgetName">Device Name *</label>
                    <input type="text" id="gadgetName" required />
                </div>
                <div class="form-group">
                    <label for="gadgetModel">Model *</label>
                    <input type="text" id="gadgetModel" required />
                </div>
                <div class="form-group">
                    <label for="gadgetYear">Purchase Year *</label>
                    <input type="number" id="gadgetYear" min="2000" max="2025" required />
                </div>
                <div class="form-group">
                    <label for="gadgetCondition">Condition *</label>
                    <select id="gadgetCondition" required>
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="used">Used</option>
                        <option value="heavily-used">Heavily Used</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="gadgetAccessories">Accessories Included</label>
                    <input type="text" id="gadgetAccessories" placeholder="e.g., charger, box, manual" />
                </div>
                <div class="form-group">
                    <label for="gadgetWarranty">Warranty Status</label>
                    <input type="text" id="gadgetWarranty" placeholder="e.g., 6 months remaining" />
                </div>
                <div class="form-group">
                    <label for="gadgetPrice">Asking Price (₹) *</label>
                    <input type="number" id="gadgetPrice" min="0" required />
                </div>
                <div class="form-group">
                    <label for="gadgetReason">Reason for Selling</label>
                    <textarea id="gadgetReason" rows="2"></textarea>
                </div>
                <div class="form-group">
                    <label for="gadgetLocation">Pickup Location *</label>
                    <input type="text" id="gadgetLocation" required />
                </div>
            `;
            break;

        case 'other':
            fieldsHTML = `
                <div class="form-group">
                    <label for="itemName">Item Name *</label>
                    <input type="text" id="itemName" required />
                </div>
                <div class="form-group">
                    <label for="itemCategory">Category *</label>
                    <select id="itemCategory" required>
                        <option value="">Select category</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Cycles">Cycles</option>
                        <option value="Lab Equipment">Lab Equipment</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Hostel Essentials">Hostel Essentials</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="itemCondition">Condition *</label>
                    <select id="itemCondition" required>
                        <option value="">Select condition</option>
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="used">Used</option>
                        <option value="heavily-used">Heavily Used</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="itemPrice">Price (₹) - Leave blank if free</label>
                    <input type="number" id="itemPrice" min="0" />
                </div>
                <div class="form-group">
                    <label for="itemDescription">Description *</label>
                    <textarea id="itemDescription" rows="3" required></textarea>
                </div>
                <div class="form-group">
                    <label for="itemLocation">Pickup Location *</label>
                    <input type="text" id="itemLocation" required />
                </div>
            `;
            break;

        case 'roommate':
            fieldsHTML = `
                <div class="form-group">
                    <label for="roommateMode">I am *</label>
                    <select id="roommateMode" required>
                        <option value="">Select option</option>
                        <option value="looking">Looking for a roommate</option>
                        <option value="offering">Offering a room/bed</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="roommateTitle">Title *</label>
                    <input type="text" id="roommateTitle" placeholder="e.g., Looking for roommate near campus" required />
                </div>
                <div class="form-group">
                    <label for="roommateLocation">Location *</label>
                    <input type="text" id="roommateLocation" placeholder="e.g., Marathahalli, 2km from campus" required />
                </div>
                <div class="form-group">
                    <label for="roommateRent">Rent Range (₹) *</label>
                    <input type="text" id="roommateRent" placeholder="e.g., 8000-10000" required />
                </div>
                <div class="form-group">
                    <label for="roommateType">Room Type *</label>
                    <select id="roommateType" required>
                        <option value="">Select type</option>
                        <option value="shared">Shared</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="roommateGender">Gender Preference *</label>
                    <select id="roommateGender" required>
                        <option value="">Select preference</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="any">Any</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="roommateMoveIn">Move-in Date *</label>
                    <input type="date" id="roommateMoveIn" required />
                </div>
                <div class="form-group">
                    <label for="roommateDescription">Description *</label>
                    <textarea id="roommateDescription" rows="3" required></textarea>
                </div>
            `;
            break;
    }

    container.innerHTML = fieldsHTML;
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach((s, i) => {
        s.classList.toggle('active', i + 1 === step);
    });

    document.getElementById('prevStep').style.display = step === 1 ? 'none' : 'block';
    document.getElementById('nextStep').style.display = step === 2 ? 'none' : 'block';
    document.getElementById('submitListing').style.display = step === 2 ? 'block' : 'none';
}

function validateStep(step) {
    if (step === 1) {
        const category = document.getElementById('listingCategory').value;
        if (!category) {
            alert('Please select a category');
            return false;
        }
    }
    return true;
}

function handleImageUpload(e) {
    const files = e.target.files;
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

function submitListing() {
    const category = document.getElementById('listingCategory').value;
    const listing = {
        id: 'listing_' + Date.now(),
        category: category,
        sellerId: BazaarState.currentUser.id,
        sellerName: BazaarState.currentUser.name,
        sellerRating: BazaarState.currentUser.rating,
        datePosted: Date.now(),
        status: 'active',
        views: 0,
        saves: 0,
        distance: 0.5,
        images: []
    };

    // Collect images
    const imageFiles = document.getElementById('listingImages').files;
    const imagePromises = Array.from(imageFiles).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    Promise.all(imagePromises).then(images => {
        listing.images = images.length > 0 ? images : ['https://via.placeholder.com/400x300/cccccc/ffffff?text=No+Image'];

        // Collect category-specific fields
        switch (category) {
            case 'books':
                listing.title = document.getElementById('bookTitle').value;
                listing.subject = document.getElementById('bookSubject').value;
                listing.author = document.getElementById('bookAuthor').value;
                listing.edition = document.getElementById('bookEdition').value;
                listing.condition = document.getElementById('bookCondition').value;
                listing.originalPrice = parseInt(document.getElementById('bookOriginalPrice').value) || 0;
                listing.price = parseInt(document.getElementById('bookPrice').value);
                listing.location = document.getElementById('bookLocation').value;
                break;

            case 'gadgets':
                listing.title = document.getElementById('gadgetName').value;
                listing.deviceName = document.getElementById('gadgetModel').value;
                listing.purchaseYear = parseInt(document.getElementById('gadgetYear').value);
                listing.condition = document.getElementById('gadgetCondition').value;
                listing.accessories = document.getElementById('gadgetAccessories').value;
                listing.warranty = document.getElementById('gadgetWarranty').value;
                listing.price = parseInt(document.getElementById('gadgetPrice').value);
                listing.reason = document.getElementById('gadgetReason').value;
                listing.location = document.getElementById('gadgetLocation').value;
                break;

            case 'other':
                listing.title = document.getElementById('itemName').value;
                listing.itemName = document.getElementById('itemName').value;
                listing.itemCategory = document.getElementById('itemCategory').value;
                listing.condition = document.getElementById('itemCondition').value;
                listing.price = parseInt(document.getElementById('itemPrice').value) || 0;
                listing.description = document.getElementById('itemDescription').value;
                listing.location = document.getElementById('itemLocation').value;
                break;

            case 'roommate':
                listing.mode = document.getElementById('roommateMode').value;
                listing.title = document.getElementById('roommateTitle').value;
                listing.location = document.getElementById('roommateLocation').value;
                listing.rentRange = document.getElementById('roommateRent').value;
                listing.roomType = document.getElementById('roommateType').value;
                listing.genderPreference = document.getElementById('roommateGender').value;
                listing.moveInDate = document.getElementById('roommateMoveIn').value;
                listing.description = document.getElementById('roommateDescription').value;
                break;
        }

        BazaarState.listings.unshift(listing);
        BazaarState.userListings.push(listing.id);

        localStorage.setItem('userListings', JSON.stringify(BazaarState.userListings));
        saveListings();

        closeModal('createModal');
        alert('Listing posted successfully!');
        renderListings();
    });
}

function resetListingForm() {
    document.getElementById('listingForm').reset();
    document.getElementById('dynamicFields').innerHTML = '';
    document.getElementById('imagePreview').innerHTML = '';
    showStep(1);
}

function submitReport() {
    const reason = document.querySelector('input[name="reportReason"]:checked')?.value;
    const details = document.getElementById('reportDetails').value;

    if (!reason) {
        alert('Please select a reason for reporting');
        return;
    }

    // In production, this would send to backend
    console.log('Report submitted:', { listingId: BazaarState.currentListingId, reason, details });

    alert('Thank you for your report. We will review it shortly.');
    closeModal('reportModal');
    document.getElementById('reportForm').reset();
}

function sendMessage() {
    const message = document.getElementById('messageInput').value.trim();

    if (!message) {
        alert('Please enter a message');
        return;
    }

    // In production, this would integrate with chat system
    const thread = document.getElementById('messageThread');
    const messageEl = document.createElement('div');
    messageEl.style.cssText = 'background: var(--card-bg); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem;';
    messageEl.innerHTML = `<strong>You:</strong> ${message}`;
    thread.appendChild(messageEl);

    document.getElementById('messageInput').value = '';

    // Simulate seller response
    setTimeout(() => {
        const response = document.createElement('div');
        response.style.cssText = 'background: var(--primary-bg); padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem;';
        response.innerHTML = `<strong>Seller:</strong> Thanks for your interest! I'll get back to you soon.`;
        thread.appendChild(response);
        thread.scrollTop = thread.scrollHeight;
    }, 1000);
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeSampleData();
    initializeTabs();
    initializeSearch();
    initializeFilters();
    initializeModals();
    initializeListingForm();
    renderListings('books');
});
