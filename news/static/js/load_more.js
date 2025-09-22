document.addEventListener('DOMContentLoaded', function () {
    const loadMoreButtons = document.querySelectorAll('.load-more-btn');
    const pages = {};

    loadMoreButtons.forEach(button => {
        const category = button.dataset.category;
        pages[category] = 2; // Start with page 2, since page 1 is already loaded

        button.addEventListener('click', function () {
            const nextPage = pages[category];
            
            // Show loading state
            const originalText = button.innerHTML;
            button.innerHTML = 'Loading...';
            button.disabled = true;
            
            fetch(`/load-more-articles/?category=${category}&page=${nextPage}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Find the correct container for this category
                        const categorySection = document.getElementById(category);
                        if (categorySection) {
                            const newsGrid = categorySection.querySelector('.news-grid');
                            if (newsGrid) {
                                newsGrid.insertAdjacentHTML('beforeend', data.html);
                            }
                        }
                        
                        if (data.has_next) {
                            pages[category]++;
                        } else {
                            button.style.display = 'none';
                        }
                    } else {
                        console.error('Error loading articles:', data.error);
                    }
                })
                .catch(error => {
                    console.error('Error loading more articles:', error);
                })
                .finally(() => {
                    // Reset button state
                    button.innerHTML = originalText;
                    button.disabled = false;
                });
        });
    });
});
