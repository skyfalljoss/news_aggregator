// Categories functionality for the news website

class CategoryManager {
    constructor() {
        this.categoryTabs = document.querySelectorAll('.category-tab');
        this.categoryContents = document.querySelectorAll('.category-content');
        this.loadMoreBtns = document.querySelectorAll('.load-more-btn');
        this.currentCategory = 'cricket'; // Default category
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeLoadMore();
        this.addScrollEffects();
    }
    
    bindEvents() {
        // Category tab switching
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const category = tab.dataset.category;
                this.switchCategory(category);
            });
        });
        
        // Load more button functionality
        this.loadMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadMoreContent(btn);
            });
        });
    }
    
    switchCategory(category) {
        // Update active tab
        this.categoryTabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Update active content
        this.categoryContents.forEach(content => {
            if (content.id === category) {
                content.classList.add('active');
                this.currentCategory = category;
                
                // Trigger content load if needed
                this.loadCategoryContent(category);
                // Reset load-more to correct next page for this category
                this.resetLoadMore(category);
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update URL hash
        if (history.pushState) {
            history.pushState(null, null, `#${category}`);
        }
        
        // Trigger category change event
        this.triggerCategoryChange(category);
        
        // Scroll to category section
        this.scrollToCategory();
    }
    
    loadCategoryContent(category) {
        // Simulate loading content for the category
        const contentContainer = document.getElementById(category);
        if (!contentContainer) return;
        
        // Add loading state
        contentContainer.classList.add('loading');
        
        // Simulate API call delay
        setTimeout(() => {
            contentContainer.classList.remove('loading');
            
            // You can add actual content loading logic here
            // this.fetchCategoryNews(category);
        }, 500);
    }
    
    loadMoreContent(button) {
        const category = button.closest('.category-content').id;
        const newsGrid = button.closest('.category-content').querySelector('.news-grid');
        
        // Get current page from button data attribute
        const currentPage = parseInt(button.dataset.page) || 2;
        
        // Add loading state to button
        button.classList.add('loading');
        button.textContent = 'Loading...';
        button.disabled = true;
        
        // Make AJAX request to load more articles
        this.fetchMoreArticles(category, currentPage)
            .then(data => {
                if (data.success) {
                    // Append new articles to the grid
                    this.appendArticlesToGrid(newsGrid, data.html);
                    
                    // Update button state
                    if (data.has_next) {
                        button.classList.remove('loading');
                        button.textContent = 'LOAD MORE';
                        button.disabled = false;
                        button.dataset.page = data.next_page;
                    } else {
                        // No more articles to load
                        button.style.display = 'none';
                        this.showEndMessage(newsGrid);
                    }
                    
                    // Add animation to new items
                    this.animateNewArticles(newsGrid);
                } else {
                    throw new Error(data.error || 'Failed to load articles');
                }
            })
            .catch(error => {
                console.error('Error loading more articles:', error);
                
                // Reset button state on error
                button.classList.remove('loading');
                button.textContent = 'LOAD MORE';
                button.disabled = false;
                
                // Show error message
                this.showErrorMessage(newsGrid, 'Failed to load more articles. Please try again.');
            });
    }
    
    async fetchMoreArticles(category, page) {
        try {
            // Get CSRF token from cookies
            const csrfToken = this.getCSRFToken();
            
            const response = await fetch(`/load-more-articles/?category=${encodeURIComponent(category)}&page=${page}`, {
                method: 'GET',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching articles:', error);
            throw error;
        }
    }
    
    getCSRFToken() {
        // Try to get CSRF token from cookies
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'csrftoken') {
                return value;
            }
        }
        
        // Fallback: try to get from meta tag
        const metaToken = document.querySelector('meta[name="csrf-token"]');
        if (metaToken) {
            return metaToken.getAttribute('content');
        }
        
        return '';
    }
    
    appendArticlesToGrid(newsGrid, html) {
        // Create a temporary container to hold the new HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = html;
        
        // Append each article to the grid
        const newArticles = tempContainer.querySelectorAll('.news-card');
        newArticles.forEach(article => {
            newsGrid.appendChild(article);
            // Observe for scroll animation if available
            if (this.cardObserver) {
                this.cardObserver.observe(article);
            } else {
                // Fallback: ensure visibility
                article.classList.add('animated');
            }
        });
    }
    
    animateNewArticles(newsGrid) {
        // Add animation to newly loaded articles
        const allArticles = newsGrid.querySelectorAll('.news-card');
        const newArticles = Array.from(allArticles).slice(-4); // Last 4 articles are new
        
        newArticles.forEach((article, index) => {
            article.style.opacity = '0';
            article.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                article.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                article.style.opacity = '1';
                article.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    showErrorMessage(newsGrid, message) {
        // Remove existing error messages
        const existingError = newsGrid.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <p>⚠️ ${message}</p>
            <button onclick="this.parentNode.remove()" class="btn btn-secondary">Dismiss</button>
        `;
        
        newsGrid.parentNode.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    addMoreNewsItems(newsGrid, category) {
        // Sample news items to add (fallback for demo purposes)
        const sampleNews = this.getSampleNews(category);
        
        sampleNews.forEach(newsItem => {
            const newsCard = this.createNewsCard(newsItem);
            newsGrid.appendChild(newsCard);
        });
        
        // Add animation to new items
        const newItems = newsGrid.querySelectorAll('.news-card:not(.animated)');
        newItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, index * 100);
        });
    }
    
    createNewsCard(newsData) {
        const card = document.createElement('article');
        card.className = 'news-card';
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${newsData.image}" alt="${newsData.title}">
                <div class="category-tag">${newsData.category}</div>
            </div>
            <div class="card-content">
                <h3>${newsData.title}</h3>
                <p>By ${newsData.author} • ${newsData.date}</p>
            </div>
        `;
        
        // Add click event to navigate to detail page
        card.addEventListener('click', () => {
            this.navigateToNewsDetail(newsData);
        });
        
        return card;
    }
    
    
    showEndMessage(newsGrid) {
        const endMessage = document.createElement('div');
        endMessage.className = 'end-message';
        endMessage.innerHTML = `
            <p>You've reached the end of available news for this category.</p>
            <p>Check back later for more updates!</p>
        `;
        
        newsGrid.parentNode.appendChild(endMessage);
    }
    
    navigateToNewsDetail(newsData) {
        // In a real application, this would navigate to the news detail page
        // For now, we'll show a notification
        if (window.showNotification) {
            window.showNotification(`Navigating to: ${newsData.title}`, 'info');
        }
        
        // You can implement actual navigation here
        // window.location.href = `/news/detail/${newsData.id}`;
    }
    
    scrollToCategory() {
        const categorySection = document.querySelector('.category-sections');
        if (categorySection) {
            categorySection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    triggerCategoryChange(category) {
        // Custom event for category changes
        const event = new CustomEvent('categoryChange', {
            detail: {
                category: category,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
        
        // Log for debugging
        console.log(`Category changed to: ${category}`);
        
        // You can add analytics tracking here
        // trackEvent('category_change', { category: category });
    }
    
    initializeLoadMore() {
        // Initialize load more buttons with page numbers
        const perPage = 5; // Must match backend articles_per_page
        this.loadMoreBtns.forEach(btn => {
            const container = btn.closest('.category-content');
            const grid = container ? container.querySelector('.news-grid') : null;
            const alreadyLoaded = grid ? grid.querySelectorAll('.news-card').length : 0;
            const startPage = Math.ceil(alreadyLoaded / perPage) + 1;
            btn.dataset.page = String(startPage > 1 ? startPage : 2);
        });
        
        // Add scroll-based load more functionality
        const loadMoreContainers = document.querySelectorAll('.category-content');
        
        loadMoreContainers.forEach(container => {
            const loadMoreBtn = container.querySelector('.load-more-btn');
            if (loadMoreBtn) {
                this.setupScrollLoadMore(container, loadMoreBtn);
            }
        });
    }
    
    setupScrollLoadMore(container, loadMoreBtn) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !loadMoreBtn.disabled) {
                    // Auto-load more content when button comes into view
                    this.loadMoreContent(loadMoreBtn);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(loadMoreBtn);
    }
    
    addScrollEffects() {
        // Add scroll-triggered animations to news cards
        const newsCards = document.querySelectorAll('.news-card');
        
        if ('IntersectionObserver' in window) {
            this.cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            newsCards.forEach(card => {
                this.cardObserver.observe(card);
            });
        }
    }
    
    // Public methods for external control
    getCurrentCategory() {
        return this.currentCategory;
    }
    
    refreshCategory(category) {
        this.loadCategoryContent(category);
    }
    
    resetLoadMore(category) {
        const contentContainer = document.getElementById(category);
        if (contentContainer) {
            const loadMoreBtn = contentContainer.querySelector('.load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.disabled = false;
                loadMoreBtn.textContent = 'LOAD MORE';
                const perPage = 5; // Must match backend
                const grid = contentContainer.querySelector('.news-grid');
                const alreadyLoaded = grid ? grid.querySelectorAll('.news-card').length : 0;
                const startPage = Math.ceil(alreadyLoaded / perPage) + 1;
                loadMoreBtn.dataset.page = String(startPage > 1 ? startPage : 2);
            }
            
            // Remove end message if exists
            const endMessage = contentContainer.querySelector('.end-message');
            if (endMessage) {
                endMessage.remove();
            }
        }
    }
}

// Initialize category manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const categoryManager = new CategoryManager();
    
    // Expose category manager globally for debugging
    window.categoryManager = categoryManager;
    
    // Listen for category change events
    document.addEventListener('categoryChange', function(e) {
        console.log('Category changed:', e.detail);
        
        // You can add additional logic here
        // Update page title, analytics, etc.
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        const hash = window.location.hash.slice(1);
        if (hash && categoryManager) {
            categoryManager.switchCategory(hash);
        }
    });
    
    // Check initial hash
    if (window.location.hash) {
        const initialCategory = window.location.hash.slice(1);
        categoryManager.switchCategory(initialCategory);
    }
});


// Inject category styles if provided globally
try {
    if (typeof categoryStyles === 'string' && categoryStyles.trim().length > 0) {
        const categoryStyleSheet = document.createElement('style');
        categoryStyleSheet.textContent = categoryStyles;
        document.head.appendChild(categoryStyleSheet);
    }
} catch (e) {
    // Silently ignore if categoryStyles is not defined
}
