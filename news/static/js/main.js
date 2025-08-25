// Main JavaScript file for Newsprint website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navPrimary = document.querySelector('.nav-primary');
    
    if (mobileMenuBtn && navPrimary) {
        mobileMenuBtn.addEventListener('click', function() {
            navPrimary.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    // Dropdown functionality
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        // Show dropdown on hover
        dropdown.addEventListener('mouseenter', function() {
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            }
        });
        
        // Hide dropdown on mouse leave
        dropdown.addEventListener('mouseleave', function() {
            if (dropdownMenu) {
                dropdownMenu.style.opacity = '0';
                dropdownMenu.style.visibility = 'hidden';
                dropdownMenu.style.transform = 'translateY(-10px)';
            }
        });
    });

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Create search overlay
            const searchOverlay = document.createElement('div');
            searchOverlay.className = 'search-overlay';
            searchOverlay.innerHTML = `
                <div class="search-modal">
                    <div class="search-header">
                        <h3>Search News</h3>
                        <button class="close-search">&times;</button>
                    </div>
                    <div class="search-input">
                        <input type="text" placeholder="Search for news, articles, or topics..." autofocus>
                        <button class="search-submit">Search</button>
                    </div>
                    <div class="search-suggestions">
                        <h4>Popular Searches</h4>
                        <div class="suggestion-tags">
                            <span class="tag">Cricket</span>
                            <span class="tag">Football</span>
                            <span class="tag">Tennis</span>
                            <span class="tag">Boxing</span>
                            <span class="tag">Basketball</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(searchOverlay);
            
            // Close search overlay
            const closeSearch = searchOverlay.querySelector('.close-search');
            closeSearch.addEventListener('click', function() {
                document.body.removeChild(searchOverlay);
            });
            
            // Close on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    if (searchOverlay.parentNode) {
                        document.body.removeChild(searchOverlay);
                    }
                }
            });
            
            // Close on outside click
            searchOverlay.addEventListener('click', function(e) {
                if (e.target === searchOverlay) {
                    document.body.removeChild(searchOverlay);
                }
            });
            
            // Search functionality
            const searchInput = searchOverlay.querySelector('input');
            const searchSubmit = searchOverlay.querySelector('.search-submit');
            
            searchSubmit.addEventListener('click', function() {
                performSearch(searchInput.value);
            });
            
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch(searchInput.value);
                }
            });
            
            // Suggestion tags click
            const tags = searchOverlay.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.addEventListener('click', function() {
                    searchInput.value = tag.textContent;
                    performSearch(tag.textContent);
                });
            });
        });
    }

    // Newsletter subscription
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            if (email) {
                // Simulate subscription
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                form.reset();
            }
        });
    });

    // Footer newsletter
    const footerNewsletter = document.querySelector('.footer .newsletter-form');
    
    if (footerNewsletter) {
        footerNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = footerNewsletter.querySelector('input[type="email"]').value;
            
            if (email) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                footerNewsletter.reset();
            }
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.disabled = true;
                
                // Simulate loading
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Initialize tooltips
    initializeTooltips();
    
    // Initialize scroll effects
    initializeScrollEffects();
});

// Search function
function performSearch(query) {
    if (query.trim()) {
        // Simulate search
        showNotification(`Searching for: ${query}`, 'info');
        
        // In a real application, this would make an API call
        setTimeout(() => {
            showNotification(`Found 15 results for "${query}"`, 'success');
        }, 1000);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Tooltip system
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = e.target.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    e.target.tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target.tooltip) {
        e.target.tooltip.remove();
        e.target.tooltip = null;
    }
}

// Scroll effects
function initializeScrollEffects() {
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-visible');
                }
            });
        }, {
            threshold: 0.1
        });
        
        scrollElements.forEach(element => {
            scrollObserver.observe(element);
        });
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add CSS for notifications and tooltips
const additionalStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 16px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 10000;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        border-left: 4px solid #10B981;
    }
    
    .notification-info {
        border-left: 4px solid #3B82F6;
    }
    
    .notification-error {
        border-left: 4px solid #EF4444;
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6B7280;
        margin-left: 12px;
    }
    
    .notification-close:hover {
        color: #374151;
    }
    
    .tooltip {
        position: absolute;
        background: #111827;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: #111827;
    }
    
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .search-modal {
        background: white;
        border-radius: 12px;
        padding: 32px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }
    
    .close-search {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6B7280;
    }
    
    .search-input {
        display: flex;
        gap: 12px;
        margin-bottom: 24px;
    }
    
    .search-input input {
        flex: 1;
        padding: 12px 16px;
        border: 2px solid #D1D5DB;
        border-radius: 8px;
        font-size: 16px;
    }
    
    .search-input input:focus {
        outline: none;
        border-color: #3B82F6;
    }
    
    .search-submit {
        padding: 12px 24px;
        background: #000;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .search-suggestions h4 {
        margin-bottom: 16px;
        color: #6B7280;
    }
    
    .suggestion-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }
    
    .tag {
        padding: 6px 12px;
        background: #F3F4F6;
        border-radius: 16px;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .tag:hover {
        background: #E5E7EB;
    }
    
    .btn.loading {
        position: relative;
        color: transparent;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    .scroll-fade {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .scroll-fade.scroll-visible {
        opacity: 1;
        transform: translateY(0);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
