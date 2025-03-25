// Import the styles for the in-page navigation
import './styles.css';  

/**
 * In-page Navigation Script
 * Creates a navigation menu that dynamically links to headings on the page
 * Based on USWDS in-page navigation component with custom modifications
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /**
     * Safely escapes HTML special characters to prevent XSS attacks
     * @param {string} str - The string to escape
     * @returns {string} - The escaped HTML string
     */
    const escapeHTML = (str) => {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    /**
     * Creates and inserts the in-page navigation into the DOM
     */
    const createNavigation = () => {
        // Fix the mainContent selector line
        const mainContent = document.querySelector('#main-content') || document.querySelector('main') || document.querySelector('.content-area');
        if (!mainContent) {
            console.log('No main content found');
            return;
        }

        // Only select H2 and H3 elements that have an ID attribute
        const headings = Array.from(mainContent.querySelectorAll('h2[id], h3[id]'));
        console.log('Found headings:', headings); // Debug log

        // Don't create navigation if there are no valid headings
        if (headings.length < 2) {
            console.log('Not enough headings found, minimum required: 2'); // Debug log
            return;
        }

        // Create the navigation container as an aside element
        const asideElement = document.createElement('aside');
        asideElement.className = 'dswp-in-page-nav';
        
        // Create the navigation HTML structure
        const navHTML = `
            <div class="nav-title">
                <h4>On this page</h4>
            </div>
            <ul class="nav-links">
                ${headings
                    .map(heading => `
                        <li>
                            <a href="#${heading.id}" data-heading-id="${heading.id}">${escapeHTML(heading.textContent)}</a>
                        </li>
                    `)
                    .join('')}
            </ul>
        `;
        
        // Insert the navigation HTML
        asideElement.innerHTML = navHTML;
        console.log('Navigation HTML created:', asideElement); // Debug log

        // Replace the Intersection Observer code with this new scroll-based highlighting
        const updateActiveLink = () => {
            const isMobile = window.innerWidth <= 1800;
            const navHeight = isMobile ? asideElement.offsetHeight + 8 : 0;
            
            // Get the viewport height and calculate the scroll threshold
            const viewportHeight = window.innerHeight;
            const scrollThreshold = navHeight + (viewportHeight * 0.2);
            
            // Get total scroll height and current scroll position
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollPosition = window.scrollY + viewportHeight;
            
            // Find the current heading by checking positions
            const currentHeading = headings.reduce((closest, heading) => {
                const headingRect = heading.getBoundingClientRect();
                const headingTop = headingRect.top;
                
                // Special case for last heading or near bottom of page
                if (scrollPosition >= scrollHeight - 50) {
                    // If we're at the bottom, select the last heading
                    return headings[headings.length - 1];
                }
                
                // Check if heading is in the threshold area, accounting for nav height
                if (headingTop < scrollThreshold && headingTop > -headingRect.height) {
                    if (!closest || headingTop > closest.getBoundingClientRect().top) {
                        return heading;
                    }
                }
                return closest;
            }, null);

            // Update active state
            if (currentHeading) {
                const activeLink = asideElement.querySelector(`a[data-heading-id="${currentHeading.id}"]`);
                asideElement.querySelectorAll('a').forEach(link => {
                    link.classList.remove('dswp-current');
                });
                if (activeLink) {
                    activeLink.classList.add('dswp-current');
                }
            }
        };

        // Add scroll event listener with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                updateActiveLink();
            });
        });

        // Also update on page load
        updateActiveLink();

        // Add smooth scrolling
        asideElement.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const isMobile = window.innerWidth <= 1800;
                    const navHeight = isMobile ? asideElement.offsetHeight + 8 : 0;
                    const extraPadding = 60; // Reduced from 100 to 60 pixels
                    
                    // Calculate position with adjusted offset
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - extraPadding;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    history.pushState(null, null, `#${targetId}`);
                }
            });
        });

        // Insert the in-page navigation at the beginning of main content
        mainContent.insertBefore(asideElement, mainContent.firstChild);
        console.log('Navigation inserted into DOM'); // Debug log
    };

    // Initialize the navigation when the DOM is fully loaded
    createNavigation();
});