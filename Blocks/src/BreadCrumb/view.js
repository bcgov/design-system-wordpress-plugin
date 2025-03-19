document.addEventListener('DOMContentLoaded', function() {
    const breadcrumbs = document.querySelectorAll('.wp-block-design-system-wordpress-plugin-breadcrumb');
    
    // Get post ID from body class
    function getPostId() {
        const bodyClasses = document.body.className.split(' ');
        const pageIdClass = bodyClasses.find(className => className.startsWith('page-id-'));
        return pageIdClass ? pageIdClass.replace('page-id-', '') : null;
    }

    // Get the site URL path from the current location
    function getSiteBasePath() {
        // Get WordPress site URL from a meta tag or similar source
        const wpJsonScripts = document.querySelectorAll('script[src*="/wp-json/"]');
        if (wpJsonScripts.length > 0) {
            const scriptSrc = wpJsonScripts[0].src;
            const wpJsonIndex = scriptSrc.indexOf('/wp-json/');
            if (wpJsonIndex !== -1) {
                return scriptSrc.substring(0, wpJsonIndex);
            }
        }

        // Fallback: use window.location.origin
        return window.location.origin;
    }

    function sanitizeTitle(title) {
        if (!title) return '';
        if (typeof title === 'string') return title;
        if (title.rendered) return title.rendered;
        return '';
    }

    breadcrumbs.forEach(async function(breadcrumb) {
        const container = breadcrumb.querySelector('.dswp-block-breadcrumb__container');
        
        try {
            let postId = breadcrumb.getAttribute('data-page-id');
            
            if (!postId || isNaN(postId)) {
                postId = getPostId();
                if (!postId) {
                    console.warn('Could not determine current page ID');
                    return;
                }
            }

            // Build the correct API URL using the base path
            const apiUrl = `${getSiteBasePath()}/wp-json/wp/v2/pages/${postId}`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const currentPage = await response.json();
            
            if (!currentPage?.title?.rendered) {
                throw new Error('Invalid page data received');
            }

            // Get the settings from the block's data attributes
            const dividerType = breadcrumb.getAttribute('data-divider-type') || 'slash';
            const currentAsLink = breadcrumb.getAttribute('data-current-as-link') === 'true';
            const divider = dividerType === 'chevron' ? ' > ' : ' / ';

            // Build hierarchy
            const hierarchy = [];
            let page = currentPage;

            // Add current page
            if (page?.title) {
                hierarchy.unshift({
                    title: sanitizeTitle(page.title),
                    url: page.link || '#',
                    id: page.id
                });
            }

            // Get ancestors
            while (page?.parent) {
                const parentApiUrl = `${getSiteBasePath()}/wp-json/wp/v2/pages/${page.parent}`;
                const parentResponse = await fetch(parentApiUrl);
                if (!parentResponse.ok) break;
                
                page = await parentResponse.json();
                
                if (page?.title) {
                    hierarchy.unshift({
                        title: sanitizeTitle(page.title),
                        url: page.link || '#',
                        id: page.id
                    });
                }
            }

            // Build breadcrumb HTML
            container.innerHTML = hierarchy.map((item, index) => {
                const isLast = index === hierarchy.length - 1;
                const title = sanitizeTitle(item.title);
                
                if (isLast) {
                    // Use the currentAsLink setting
                    return currentAsLink ? 
                        `<a href="${item.url}" class="current-page-link">${title}</a>` :
                        `<span class="current-page">${title}</span>`;
                }
                
                // Use the correct divider
                return `
                    <a href="${item.url}">${title}</a>
                    <span class="separator">${divider}</span>
                `;
            }).join('');

            // After content is rendered, add the loaded class
            container.classList.add('is-loaded');
        } catch (error) {
            console.error('Error building breadcrumb:', error);
            container.classList.add('is-loaded'); // Still add class even on error
            container.innerHTML = '<span class="breadcrumb-error">Navigation</span>';
        }
    });
});
