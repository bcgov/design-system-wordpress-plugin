import './view.scss';

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.dswp-search-post-filter__button');
    const searchForm = document.querySelector('.dswp-search__form');
    const searchInput = document.querySelector('.dswp-search__input');
    const searchResults = document.getElementById('search-results'); // Make sure you have this container in your template
    
    if (!filterButtons.length || !searchForm) return;

    // Function to fetch search results via AJAX
    const fetchResults = async (searchQuery, postType) => {
        const params = new URLSearchParams({
            s: searchQuery,
            post_type: postType,
            action: 'custom_search_results'
        }).toString();

        try {
            const response = await fetch(`${window.location.origin}/wp-admin/admin-ajax.php?${params}`, {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching results:', error);
            return null;
        }
    };

    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Get the current search query and new post type
            const searchQuery = searchInput?.value || '';
            const buttonUrl = new URL(button.href);
            const newPostType = buttonUrl.searchParams.get('post_type');
            
            // Update URL without refresh
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set('post_type', newPostType);
            if (searchQuery) searchParams.set('s', searchQuery);
            const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
            window.history.pushState({}, '', newUrl);
            
            // Update active state of buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('dswp-search-post-filter__button--active');
            });
            button.classList.add('dswp-search-post-filter__button--active');
            
            // If there's a search query, fetch new results
            if (searchQuery) {
                const results = await fetchResults(searchQuery, newPostType);
                if (results && searchResults) {
                    searchResults.innerHTML = results.html;
                }
            }
        });
    });

    // Handle form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const searchQuery = searchInput?.value || '';
        const searchParams = new URLSearchParams(window.location.search);
        const currentPostType = searchParams.get('post_type') || 'any';
        
        // Update URL
        searchParams.set('s', searchQuery);
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
        
        // Fetch results
        const results = await fetchResults(searchQuery, currentPostType);
        if (results && searchResults) {
            searchResults.innerHTML = results.html;
        }
    });
}); 