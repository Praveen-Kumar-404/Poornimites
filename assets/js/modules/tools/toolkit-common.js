// ===================================
// TOOLKIT COMMON UTILITIES
// Shared JavaScript functions for all toolkit pages
// ===================================

const ToolkitUtils = {
    // ===== LOCAL STORAGE HELPERS =====
    storage: {
        save(key, data) {
            try {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                this.showToast('Failed to save data', 'error');
                return false;
            }
        },

        load(key, defaultValue = null) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : defaultValue;
            } catch (error) {
                console.error('Error loading from localStorage:', error);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return false;
            }
        },

        clear(prefix = null) {
            try {
                if (prefix) {
                    Object.keys(localStorage)
                        .filter(key => key.startsWith(prefix))
                        .forEach(key => localStorage.removeItem(key));
                } else {
                    localStorage.clear();
                }
                return true;
            } catch (error) {
                console.error('Error clearing localStorage:', error);
                return false;
            }
        }
    },

    // ===== TOAST NOTIFICATIONS =====
    showToast(message, type = 'info', duration = 3000) {
        // Create toast container if it doesn't exist
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        }[type] || 'ℹ';

        toast.innerHTML = `
            <span style="font-size: 1.5rem;">${icon}</span>
            <span>${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after duration
        setTimeout(() => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // ===== MODAL MANAGEMENT =====
    modal: {
        open(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        },

        close(modalId) {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        },

        create(title, content, buttons = []) {
            const modalId = 'dynamic-modal-' + Date.now();
            const modal = document.createElement('div');
            modal.id = modalId;
            modal.className = 'modal';
            
            const buttonsHtml = buttons.map(btn => 
                `<button class="btn ${btn.class || 'btn-primary'}" onclick="${btn.onclick}">${btn.text}</button>`
            ).join('');

            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" onclick="ToolkitUtils.modal.close('${modalId}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${buttonsHtml}
                        <button class="btn btn-secondary" onclick="ToolkitUtils.modal.close('${modalId}')">Close</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            this.open(modalId);

            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.close(modalId);
                }
            });

            return modalId;
        }
    },

    // ===== FILE HANDLING =====
    file: {
        async readAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(file);
            });
        },

        async readAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },

        async readAsArrayBuffer(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsArrayBuffer(file);
            });
        },

        download(content, filename, type = 'text/plain') {
            const blob = new Blob([content], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    },

    // ===== VALIDATION =====
    validate: {
        email(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        url(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        notEmpty(value) {
            return value && value.trim().length > 0;
        },

        number(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        positiveNumber(value) {
            return this.number(value) && parseFloat(value) > 0;
        },

        inRange(value, min, max) {
            const num = parseFloat(value);
            return this.number(value) && num >= min && num <= max;
        }
    },

    // ===== FORMATTING =====
    format: {
        date(date, format = 'YYYY-MM-DD') {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const seconds = String(d.getSeconds()).padStart(2, '0');

            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },

        number(num, decimals = 2) {
            return parseFloat(num).toFixed(decimals);
        },

        fileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        },

        currency(amount, symbol = '$') {
            return symbol + parseFloat(amount).toFixed(2);
        }
    },

    // ===== COPY TO CLIPBOARD =====
    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopy(text);
            });
        } else {
            this.fallbackCopy(text);
        }
    },

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            this.showToast('Copied to clipboard!', 'success');
        } catch (err) {
            this.showToast('Failed to copy', 'error');
        }
        document.body.removeChild(textarea);
    },

    // ===== DEBOUNCE =====
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // ===== GENERATE UNIQUE ID =====
    generateId(prefix = 'id') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    // ===== EXPORT TO PDF (using browser print) =====
    exportToPDF(elementId, filename = 'document.pdf') {
        const element = document.getElementById(elementId);
        if (!element) {
            this.showToast('Element not found', 'error');
            return;
        }

        // Store original title
        const originalTitle = document.title;
        document.title = filename.replace('.pdf', '');

        // Print
        window.print();

        // Restore title
        document.title = originalTitle;
    },

    // ===== EXPORT TO CSV =====
    exportToCSV(data, filename = 'data.csv') {
        if (!Array.isArray(data) || data.length === 0) {
            this.showToast('No data to export', 'warning');
            return;
        }

        // Get headers from first object
        const headers = Object.keys(data[0]);
        
        // Create CSV content
        let csv = headers.join(',') + '\n';
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            });
            csv += values.join(',') + '\n';
        });

        this.file.download(csv, filename, 'text/csv');
    },

    // ===== EXPORT TO JSON =====
    exportToJSON(data, filename = 'data.json') {
        const json = JSON.stringify(data, null, 2);
        this.file.download(json, filename, 'application/json');
    },

    // ===== SEARCH/FILTER ARRAY =====
    searchArray(array, searchTerm, keys = []) {
        if (!searchTerm) return array;
        
        const term = searchTerm.toLowerCase();
        
        return array.filter(item => {
            if (keys.length === 0) {
                // Search all string values
                return Object.values(item).some(value => 
                    String(value).toLowerCase().includes(term)
                );
            } else {
                // Search specific keys
                return keys.some(key => 
                    String(item[key]).toLowerCase().includes(term)
                );
            }
        });
    },

    // ===== SORT ARRAY =====
    sortArray(array, key, ascending = true) {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (typeof aVal === 'string') {
                return ascending 
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            } else {
                return ascending 
                    ? aVal - bVal
                    : bVal - aVal;
            }
        });
    },

    // ===== INITIALIZE TABS =====
    initTabs(containerSelector = '.tabs') {
        const tabContainers = document.querySelectorAll(containerSelector);
        
        tabContainers.forEach(container => {
            const tabs = container.querySelectorAll('.tab');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs
                    tabs.forEach(t => t.classList.remove('active'));
                    
                    // Add active class to clicked tab
                    tab.classList.add('active');
                    
                    // Hide all tab contents
                    const contentId = tab.dataset.tab;
                    const allContents = document.querySelectorAll('.tab-content');
                    allContents.forEach(content => content.classList.remove('active'));
                    
                    // Show selected tab content
                    const selectedContent = document.getElementById(contentId);
                    if (selectedContent) {
                        selectedContent.classList.add('active');
                    }
                });
            });
        });
    },

    // ===== INITIALIZE MODALS =====
    initModals() {
        // Close modal on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal on close button click
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    activeModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    ToolkitUtils.initTabs();
    ToolkitUtils.initModals();
});

// Make available globally
window.ToolkitUtils = ToolkitUtils;
