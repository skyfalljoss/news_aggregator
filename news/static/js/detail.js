// Detail page functionality for news articles

class NewsDetailPage {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.replyForm = document.querySelector('.reply-form');
        this.saveBtn = document.querySelector('.save-btn');
        this.shareBtn = document.querySelector('.share-btn');
        this.socialLinks = document.querySelectorAll('.social-link');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initializeTabs();
        this.initializeReplyForm();
        this.initializeSocialFeatures();
        this.initializeWeatherWidget();
        this.addScrollEffects();
        this.trackArticleView();
    }
    
    bindEvents() {
        // Tab switching
        this.tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
        
        // Save article functionality
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSaveArticle();
            });
        }
        
        // Share article functionality
        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showShareOptions();
            });
        }
        
        // Social media sharing
        this.socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareToSocial(link.className.split(' ')[1]);
            });
        });
    }
    
    initializeTabs() {
        // Set default active tab
        if (this.tabButtons.length > 0 && this.tabContents.length > 0) {
            this.switchTab('popular');
        }
    }
    
    switchTab(tabName) {
        // Update active tab button
        this.tabButtons.forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update active tab content
        this.tabContents.forEach(content => {
            if (content.id === tabName) {
                content.classList.add('active');
                this.loadTabContent(tabName);
            } else {
                content.classList.remove('active');
            }
        });
        
        // Trigger tab change event
        this.triggerTabChange(tabName);
    }
    
    loadTabContent(tabName) {
        const contentContainer = document.getElementById(tabName);
        if (!contentContainer) return;
        
        // Add loading state
        contentContainer.classList.add('loading');
        
        // Simulate content loading based on tab type
        setTimeout(() => {
            contentContainer.classList.remove('loading');
            
            switch (tabName) {
                case 'popular':
                    this.loadPopularContent(contentContainer);
                    break;
                case 'comment':
                    this.loadCommentContent(contentContainer);
                    break;
                case 'like':
                    this.loadLikeContent(contentContainer);
                    break;
            }
        }, 500);
    }
    
    loadPopularContent(container) {
        const newsList = container.querySelector('.news-list');
        if (!newsList) return;
        
        // Sample popular news data
        const popularNews = [
            {
                title: "AUSTRALIA: SARFARAZ JOINS VES CAMP AHEAD OF CAPMO VS VELDORA",
                author: "HABIB",
                date: "February 18, 2025"
            },
            {
                title: "KPMG WOMEN'S PGA CHAMPIONSHIP: MINJEE LEE CLOSES OUT THIRD MAJOR",
                author: "HABIB",
                date: "June 23, 2025"
            },
            {
                title: "KSCA INVITATIONAL: TENDULKAR TAKES MATCH HAUL OF NINE WICKETS IN",
                author: "HABIB",
                date: "February 18, 2025"
            }
        ];
        
        newsList.innerHTML = popularNews.map(news => `
            <article class="news-item">
                <h4>${news.title}</h4>
                <p>by ${news.author}, ${news.date}</p>
            </article>
        `).join('');
    }
    
    loadCommentContent(container) {
        const newsList = container.querySelector('.news-list');
        if (!newsList) return;
        
        // Sample comment data
        const comments = [
            {
                author: "John Doe",
                comment: "Great article! Very informative and well-written.",
                date: "2 hours ago"
            },
            {
                author: "Jane Smith",
                comment: "I learned a lot from this piece. Thanks for sharing!",
                date: "4 hours ago"
            }
        ];
        
        if (comments.length > 0) {
            newsList.innerHTML = comments.map(comment => `
                <article class="news-item">
                    <h4>${comment.author}</h4>
                    <p>${comment.comment}</p>
                    <small>${comment.date}</small>
                </article>
            `).join('');
        } else {
            newsList.innerHTML = `
                <article class="news-item">
                    <h4>No comments yet</h4>
                    <p>Be the first to leave a comment!</p>
                </article>
            `;
        }
    }
    
    loadLikeContent(container) {
        const newsList = container.querySelector('.news-list');
        if (!newsList) return;
        
        // Sample like data
        const likedArticles = [
            {
                title: "Most Liked Article 1",
                likes: 150,
                date: "Today"
            },
            {
                title: "Most Liked Article 2",
                likes: 120,
                date: "Yesterday"
            }
        ];
        
        newsList.innerHTML = likedArticles.map(article => `
            <article class="news-item">
                <h4>${article.title}</h4>
                <p>❤️ ${article.likes} likes • ${article.date}</p>
            </article>
        `).join('');
    }
    
    initializeReplyForm() {
        if (!this.replyForm) return;
        
        this.replyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReply();
        });
        
        // Add character counter for comment textarea
        const commentTextarea = this.replyForm.querySelector('#comment');
        if (commentTextarea) {
            this.addCharacterCounter(commentTextarea);
        }
    }
    
    addCharacterCounter(textarea) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.innerHTML = '<span class="current">0</span>/<span class="max">500</span> characters';
        
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', () => {
            const current = textarea.value.length;
            const max = 500;
            
            counter.querySelector('.current').textContent = current;
            
            if (current > max) {
                counter.classList.add('exceeded');
                textarea.classList.add('exceeded');
            } else {
                counter.classList.remove('exceeded');
                textarea.classList.remove('exceeded');
            }
        });
    }
    
    submitReply() {
        const formData = new FormData(this.replyForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const comment = formData.get('comment');
        
        if (!name || !email || !comment) {
            this.showFormError('Please fill in all required fields.');
            return;
        }
        
        if (comment.length > 500) {
            this.showFormError('Comment is too long. Maximum 500 characters allowed.');
            return;
        }
        
        // Add loading state
        const submitBtn = this.replyForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showFormSuccess('Thank you for your comment! It will be reviewed and published soon.');
            this.replyForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Update comment count
            this.updateCommentCount();
            
            // Add comment to the comment tab
            this.addNewComment(name, comment);
        }, 1500);
    }
    
    showFormError(message) {
        this.showFormMessage(message, 'error');
    }
    
    showFormSuccess(message) {
        this.showFormMessage(message, 'success');
    }
    
    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = this.replyForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        this.replyForm.insertBefore(messageDiv, this.replyForm.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    addNewComment(name, comment) {
        const commentTab = document.getElementById('comment');
        if (!commentTab) return;
        
        const newsList = commentTab.querySelector('.news-list');
        if (!newsList) return;
        
        const newComment = document.createElement('article');
        newComment.className = 'news-item new-comment';
        newComment.innerHTML = `
            <h4>${name}</h4>
            <p>${comment}</p>
            <small>Just now</small>
        `;
        
        // Add to the top of the list
        newsList.insertBefore(newComment, newsList.firstChild);
        
        // Add animation
        setTimeout(() => {
            newComment.classList.add('show');
        }, 100);
    }
    
    updateCommentCount() {
        const commentTab = document.querySelector('.tab-btn[data-tab="comment"]');
        if (commentTab) {
            const currentCount = document.querySelectorAll('#comment .news-item').length;
            commentTab.textContent = `COMMENT (${currentCount})`;
        }
    }
    
    initializeSocialFeatures() {
        // Initialize save functionality
        this.loadSavedState();
        
        // Initialize share functionality
        this.initializeShareAPI();
    }
    
    toggleSaveArticle() {
        const isSaved = this.saveBtn.classList.contains('saved');
        
        if (isSaved) {
            this.unsaveArticle();
        } else {
            this.saveArticle();
        }
    }
    
    saveArticle() {
        this.saveBtn.classList.add('saved');
        this.saveBtn.innerHTML = '<span class="action-icon">🔖</span><span class="action-text">SAVED</span>';
        
        // Save to localStorage
        this.saveToLocalStorage();
        
        // Show notification
        this.showNotification('Article saved to your reading list!', 'success');
    }
    
    unsaveArticle() {
        this.saveBtn.classList.remove('saved');
        this.saveBtn.innerHTML = '<span class="action-icon">🔖</span><span class="action-text">SAVE</span>';
        
        // Remove from localStorage
        this.removeFromLocalStorage();
        
        // Show notification
        this.showNotification('Article removed from your reading list.', 'info');
    }
    
    saveToLocalStorage() {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        const articleData = this.getArticleData();
        
        if (!savedArticles.find(article => article.id === articleData.id)) {
            savedArticles.push(articleData);
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
        }
    }
    
    removeFromLocalStorage() {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        const articleData = this.getArticleData();
        
        const filteredArticles = savedArticles.filter(article => article.id !== articleData.id);
        localStorage.setItem('savedArticles', JSON.stringify(filteredArticles));
    }
    
    loadSavedState() {
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        const articleData = this.getArticleData();
        
        if (savedArticles.find(article => article.id === articleData.id)) {
            this.saveBtn.classList.add('saved');
            this.saveBtn.innerHTML = '<span class="action-icon">🔖</span><span class="action-text">SAVED</span>';
        }
    }
    
    getArticleData() {
        // Get article data from the page
        const title = document.querySelector('.article-title')?.textContent || '';
        const category = document.querySelector('.category-tag')?.textContent || '';
        const author = document.querySelector('.author')?.textContent || '';
        const date = document.querySelector('.date')?.textContent || '';
        const image = document.querySelector('.article-image img')?.src || '';
        
        return {
            id: window.location.pathname,
            title,
            category,
            author,
            date,
            image,
            savedAt: new Date().toISOString()
        };
    }
    
    showShareOptions() {
        const shareData = {
            title: document.querySelector('.article-title')?.textContent || 'News Article',
            text: 'Check out this interesting article!',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData);
        } else {
            this.showCustomShareModal(shareData);
        }
    }
    
    showCustomShareModal(shareData) {
        const modal = document.createElement('div');
        modal.className = 'share-modal-overlay';
        modal.innerHTML = `
            <div class="share-modal">
                <div class="share-modal-header">
                    <h3>Share Article</h3>
                    <button class="close-share-modal">&times;</button>
                </div>
                <div class="share-modal-content">
                    <div class="share-options">
                        <button class="share-option facebook" data-platform="facebook">
                            <span class="share-icon">📘</span>
                            Facebook
                        </button>
                        <button class="share-option twitter" data-platform="twitter">
                            <span class="share-icon">🐦</span>
                            Twitter
                        </button>
                        <button class="share-option linkedin" data-platform="linkedin">
                            <span class="share-icon">💼</span>
                            LinkedIn
                        </button>
                        <button class="share-option whatsapp" data-platform="whatsapp">
                            <span class="share-icon">💬</span>
                            WhatsApp
                        </button>
                    </div>
                    <div class="share-link">
                        <label>Or copy this link:</label>
                        <div class="link-input">
                            <input type="text" value="${shareData.url}" readonly>
                            <button class="copy-link-btn">Copy</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        const closeBtn = modal.querySelector('.close-share-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Share options
        const shareOptions = modal.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', () => {
                const platform = option.dataset.platform;
                this.shareToPlatform(platform, shareData);
            });
        });
        
        // Copy link
        const copyBtn = modal.querySelector('.copy-link-btn');
        copyBtn.addEventListener('click', () => {
            this.copyToClipboard(shareData.url);
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });
    }
    
    shareToPlatform(platform, shareData) {
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`
        };
        
        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }
    
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        this.showNotification('Link copied to clipboard!', 'success');
    }
    
    shareToSocial(platform) {
        const shareData = {
            title: document.querySelector('.article-title')?.textContent || 'News Article',
            text: 'Check out this interesting article!',
            url: window.location.href
        };
        
        this.shareToPlatform(platform, shareData);
    }
    
    initializeShareAPI() {
        // Check if Web Share API is available
        if (navigator.share) {
            this.shareBtn.style.display = 'block';
        }
    }
    
    initializeWeatherWidget() {
        // Simulate weather data updates
        this.updateWeatherData();
        
        // Update weather every 30 minutes
        setInterval(() => {
            this.updateWeatherData();
        }, 30 * 60 * 1000);
    }
    
    updateWeatherData() {
        // Simulate weather API call
        const weatherData = {
            temperature: Math.floor(Math.random() * 10) + 25, // 25-35°C
            condition: ['SUNNY', 'CLOUDY', 'HAZE', 'PARTLY CLOUDY'][Math.floor(Math.random() * 4)],
            forecast: [
                { time: '06:00 PM', temp: Math.floor(Math.random() * 10) + 25, icon: '☁️' },
                { time: '09:00 PM', temp: Math.floor(Math.random() * 10) + 20, icon: '🌙' }
            ]
        };
        
        // Update DOM
        const tempElement = document.querySelector('.temperature');
        const conditionElement = document.querySelector('.condition');
        
        if (tempElement) tempElement.textContent = `${weatherData.temperature} °C`;
        if (conditionElement) conditionElement.textContent = weatherData.condition;
        
        // Update forecast
        const forecastItems = document.querySelectorAll('.forecast-item');
        forecastItems.forEach((item, index) => {
            if (weatherData.forecast[index]) {
                const forecast = weatherData.forecast[index];
                item.querySelector('.temp').textContent = `${forecast.temp} °C`;
                item.querySelector('.weather-icon').textContent = forecast.icon;
            }
        });
    }
    
    addScrollEffects() {
        // Add scroll-triggered animations
        const scrollElements = document.querySelectorAll('.article-content, .article-actions, .reply-section');
        
        if ('IntersectionObserver' in window) {
            const scrollObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('scroll-visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            scrollElements.forEach(element => {
                scrollObserver.observe(element);
            });
        }
    }
    
    trackArticleView() {
        // Track article view for analytics
        const articleData = this.getArticleData();
        
        // You can implement actual analytics tracking here
        console.log('Article viewed:', articleData);
        
        // trackEvent('article_view', {
        //     title: articleData.title,
        //     category: articleData.category,
        //     author: articleData.author
        // });
    }
    
    triggerTabChange(tabName) {
        // Custom event for tab changes
        const event = new CustomEvent('tabChange', {
            detail: {
                tab: tabName,
                timestamp: new Date().toISOString()
            }
        });
        document.dispatchEvent(event);
    }
    
    showNotification(message, type = 'info') {
        // Use global notification function if available
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const detailPage = new NewsDetailPage();
    
    // Expose detail page globally for debugging
    window.newsDetailPage = detailPage;
    
    // Listen for tab change events
    document.addEventListener('tabChange', function(e) {
        console.log('Tab changed:', e.detail);
    });
});

// Add detail page specific styles
const detailStyles = `
    .tab-content {
        transition: opacity 0.3s ease;
    }
    
    .tab-content.loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .tab-content.loading::after {
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
    
    .action-btn.saved {
        color: #10B981;
    }
    
    .action-btn.saved .action-icon {
        color: #10B981;
    }
    
    .form-message {
        padding: 12px 16px;
        border-radius: 6px;
        margin-bottom: 16px;
        font-weight: 500;
    }
    
    .form-message-success {
        background: #D1FAE5;
        color: #065F46;
        border: 1px solid #A7F3D0;
    }
    
    .form-message-error {
        background: #FEE2E2;
        color: #991B1B;
        border: 1px solid #FCA5A5;
    }
    
    .character-counter {
        font-size: 0.875rem;
        color: #6B7280;
        margin-top: 8px;
        text-align: right;
    }
    
    .character-counter.exceeded {
        color: #EF4444;
    }
    
    .form-group textarea.exceeded {
        border-color: #EF4444;
    }
    
    .new-comment {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .new-comment.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .share-modal-overlay {
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
    
    .share-modal {
        background: white;
        border-radius: 12px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .share-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }
    
    .close-share-modal {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #6B7280;
    }
    
    .share-options {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        margin-bottom: 24px;
    }
    
    .share-option {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px;
        border: 1px solid #E5E7EB;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .share-option:hover {
        border-color: #3B82F6;
        background: #F8FAFC;
    }
    
    .share-icon {
        font-size: 24px;
    }
    
    .share-link label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #374151;
    }
    
    .link-input {
        display: flex;
        gap: 8px;
    }
    
    .link-input input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #D1D5DB;
        border-radius: 4px;
        font-size: 14px;
    }
    
    .copy-link-btn {
        padding: 8px 16px;
        background: #000;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        white-space: nowrap;
    }
    
    .scroll-visible {
        opacity: 1;
        transform: translateY(0);
    }
    
    .article-content,
    .article-actions,
    .reply-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .share-options {
            grid-template-columns: 1fr;
        }
        
        .share-modal {
            margin: 16px;
            padding: 20px;
        }
    }
`;

// Inject detail styles
const detailStyleSheet = document.createElement('style');
detailStyleSheet.textContent = detailStyles;
document.head.appendChild(detailStyleSheet);
