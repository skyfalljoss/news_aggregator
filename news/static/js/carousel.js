// Carousel functionality for the hero section

class Carousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelectorAll('.carousel-slide');
        this.indicators = container.querySelectorAll('.indicator');
        this.prevBtn = container.querySelector('.carousel-btn.prev');
        this.nextBtn = container.querySelector('.carousel-btn.next');
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        
        this.init();
    }
    
    init() {
        if (this.totalSlides <= 0) {
            console.log('No carousel slides found');
            return;
        }
        
        if (this.totalSlides === 1) {
            // Single slide - hide controls and indicators
            this.hideControls();
            return;
        }
        
        this.bindEvents();
        this.startAutoPlay();
        this.updateIndicators();
    }
    
    bindEvents() {
        // Previous button
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoPlay();
            });
        }
        
        // Next button
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoPlay();
            });
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoPlay();
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoPlay();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoPlay();
            }
        });
        
        // Pause auto-play on hover
        this.container.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
        
        // Touch/swipe support for mobile
        this.initTouchSupport();
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        // Hide current slide
        this.slides[this.currentSlide].classList.remove('active');
        
        // Update current slide index
        this.currentSlide = index;
        
        // Show new slide
        this.slides[this.currentSlide].classList.add('active');
        
        // Update indicators
        this.updateIndicators();
        
        // Trigger slide change event
        this.triggerSlideChange();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    hideControls() {
        // Hide controls and indicators for single slide
        if (this.prevBtn) this.prevBtn.style.display = 'none';
        if (this.nextBtn) this.nextBtn.style.display = 'none';
        this.indicators.forEach(indicator => {
            indicator.style.display = 'none';
        });
    }
    
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.pauseAutoPlay();
        this.startAutoPlay();
    }
    
    initTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        let isSwiping = false;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwiping = false;
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!isSwiping) {
                endX = e.touches[0].clientX;
                endY = e.touches[0].clientY;
                
                const deltaX = Math.abs(endX - startX);
                const deltaY = Math.abs(endY - startY);
                
                // Determine if it's a horizontal swipe
                if (deltaX > deltaY && deltaX > 50) {
                    isSwiping = true;
                    e.preventDefault();
                }
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            if (isSwiping) {
                const deltaX = endX - startX;
                const threshold = 50;
                
                if (Math.abs(deltaX) > threshold) {
                    if (deltaX > 0) {
                        this.prevSlide();
                    } else {
                        this.nextSlide();
                    }
                    this.resetAutoPlay();
                }
            }
        });
    }
    
    triggerSlideChange() {
        // Custom event for slide changes
        const event = new CustomEvent('slideChange', {
            detail: {
                currentSlide: this.currentSlide,
                totalSlides: this.totalSlides
            }
        });
        this.container.dispatchEvent(event);
    }
    
    // Public methods for external control
    play() {
        this.startAutoPlay();
    }
    
    pause() {
        this.pauseAutoPlay();
    }
    
    setAutoPlayDelay(delay) {
        this.autoPlayDelay = delay;
        this.resetAutoPlay();
    }
    
    destroy() {
        this.pauseAutoPlay();
        // Remove event listeners if needed
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.hero-carousel');
    
    if (carouselContainer) {
        const carousel = new Carousel(carouselContainer);
        
        // Expose carousel instance globally for debugging
        window.heroCarousel = carousel;
        
        // Add slide change event listener for analytics or other purposes
        carouselContainer.addEventListener('slideChange', function(e) {
            console.log(`Slide changed to ${e.detail.currentSlide + 1} of ${e.detail.totalSlides}`);
            
            // You can add analytics tracking here
            // trackEvent('carousel_slide_change', {
            //     slide_number: e.detail.currentSlide + 1,
            //     total_slides: e.detail.totalSlides
            // });
        });
    }
});

// Add carousel-specific styles
const carouselStyles = `
    .carousel-slide {
        transition: opacity 0.5s ease-in-out;
    }
    
    .carousel-slide:not(.active) {
        opacity: 0;
        pointer-events: none;
    }
    
    .carousel-slide.active {
        opacity: 1;
        pointer-events: auto;
    }
    
    .carousel-controls {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .hero-carousel:hover .carousel-controls {
        opacity: 1;
    }
    
    .carousel-btn {
        transition: all 0.3s ease;
    }
    
    .carousel-btn:hover {
        transform: scale(1.1);
    }
    
    .carousel-indicators {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .hero-carousel:hover .carousel-indicators {
        opacity: 1;
    }
    
    .indicator {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .indicator:hover {
        transform: scale(1.2);
    }
    
    .indicator.active {
        transform: scale(1.3);
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .carousel-controls {
            opacity: 1;
        }
        
        .carousel-indicators {
            opacity: 1;
        }
        
        .carousel-btn {
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
        }
    }
    
    /* Accessibility improvements */
    .carousel-btn:focus,
    .indicator:focus {
        outline: 2px solid #3B82F6;
        outline-offset: 2px;
    }
    
    /* Loading state */
    .carousel-loading {
        position: relative;
    }
    
    .carousel-loading::after {
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
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
    
    /* Fade transition effect */
    .carousel-fade .carousel-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    
    .carousel-fade .carousel-slide.active {
        opacity: 1;
        z-index: 1;
    }
    
    /* Slide transition effect */
    .carousel-slide-transition .carousel-slide {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateX(100%);
        transition: transform 0.5s ease-in-out;
    }
    
    .carousel-slide-transition .carousel-slide.active {
        transform: translateX(0);
        z-index: 1;
    }
    
    .carousel-slide-transition .carousel-slide.prev {
        transform: translateX(-100%);
    }
`;

// Inject carousel styles
const carouselStyleSheet = document.createElement('style');
carouselStyleSheet.textContent = carouselStyles;
document.head.appendChild(carouselStyleSheet);
