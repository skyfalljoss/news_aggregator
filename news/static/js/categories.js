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
        
        // Add loading state to button
        button.classList.add('loading');
        button.textContent = 'Loading...';
        button.disabled = true;
        
        // Simulate loading more content
        setTimeout(() => {
            this.addMoreNewsItems(newsGrid, category);
            
            // Reset button state
            button.classList.remove('loading');
            button.textContent = 'LOAD MORE';
            button.disabled = false;
            
            // Check if we've reached the limit
            const currentItems = newsGrid.querySelectorAll('.news-card');
            if (currentItems.length >= 12) { // Example limit
                button.style.display = 'none';
                this.showEndMessage(newsGrid);
            }
        }, 1000);
    }
    
    addMoreNewsItems(newsGrid, category) {
        // Sample news items to add
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
    
    getSampleNews(category) {
        const newsTemplates = {
            cricket: [
                {
                    title: "New Cricket Tournament Announced for 2025",
                    author: "Habib",
                    date: "February 20, 2025",
                    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
                    category: "CRICKET"
                },
                {
                    title: "Young Players Shine in Domestic League",
                    author: "Habib",
                    date: "February 19, 2025",
                    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
                    category: "CRICKET"
                },
                {
                    title: "International Cricket Council Announces Rule Changes",
                    author: "Habib",
                    date: "February 18, 2025",
                    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
                    category: "CRICKET"
                }
            ],
            football: [
                {
                    title: "Transfer Window: Major Deals Announced",
                    author: "Habib",
                    date: "February 20, 2025",
                    image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400&h=300&fit=crop",
                    category: "FOOTBALL"
                },
                {
                    title: "Champions League: Quarter-Final Draw Results",
                    author: "Habib",
                    date: "February 19, 2025",
                    image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400&h=300&fit=crop",
                    category: "FOOTBALL"
                },
                {
                    title: "National Team Prepares for World Cup Qualifiers",
                    author: "Habib",
                    date: "February 18, 2025",
                    image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400&h=300&fit=crop",
                    category: "FOOTBALL"
                }
            ],
            tennis: [
                {
                    title: "Grand Slam Season: Australian Open Highlights",
                    author: "Habib",
                    date: "February 20, 2025",
                    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
                    category: "TENNIS"
                },
                {
                    title: "New Tennis Academy Opens in Major City",
                    author: "Habib",
                    date: "February 19, 2025",
                    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
                    category: "TENNIS"
                },
                {
                    title: "Tennis Legends Return for Exhibition Match",
                    author: "Habib",
                    date: "February 18, 2025",
                    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
                    category: "TENNIS"
                }
            ],
            boxing: [
                {
                    title: "Heavyweight Championship: Title Fight Announced",
                    author: "Habib",
                    date: "February 20, 2025",
                    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
                    category: "BOXING"
                },
                {
                    title: "Boxing Hall of Fame: New Inductees Revealed",
                    author: "Habib",
                    date: "February 19, 2025",
                    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
                    category: "BOXING"
                },
                {
                    title: "Amateur Boxing: National Championships Results",
                    author: "Habib",
                    date: "February 18, 2025",
                    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
                    category: "BOXING"
                }
            ]
        };
        
        return newsTemplates[category] || [];
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
            const cardObserver = new IntersectionObserver((entries) => {
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
                cardObserver.observe(card);
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

// Add category-specific styles
const categoryStyles = `
    .category-content {
        transition: opacity 0.3s ease;
    }
    
    .category-content.loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .category-content.loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    .news-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .news-card.animated,
    .news-card.scroll-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .load-more-btn.loading {
        position: relative;
        color: transparent;
    }
    
    .load-more-btn.loading::after {
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
    
    .end-message {
        text-align: center;
        padding: 32px;
        color: #6B7280;
        background: #F9FAFB;
        border-radius: 8px;
        margin-top: 24px;
    }
    
    .end-message p {
        margin-bottom: 8px;
    }
    
    .end-message p:last-child {
        margin-bottom: 0;
        font-size: 0.875rem;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    /* Category tab animations */
    .category-tab {
        position: relative;
        overflow: hidden;
    }
    
    .category-tab::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: #000;
        transition: all 0.3s ease;
        transform: translateX(-50%);
    }
    
    .category-tab.active::after,
    .category-tab:hover::after {
        width: 100%;
    }
    
    /* News grid animations */
    .news-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
        margin-bottom: 32px;
    }
    
    .news-card {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .news-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .category-tabs {
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .category-tab {
            flex: 1;
            min-width: 120px;
            text-align: center;
        }
        
        .news-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Inject category styles
const categoryStyleSheet = document.createElement('style');
categoryStyleSheet.textContent = categoryStyles;
document.head.appendChild(categoryStyleSheet);
