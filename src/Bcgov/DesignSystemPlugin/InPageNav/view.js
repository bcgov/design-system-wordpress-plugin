document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('#main-content') || document.querySelector('main') || document.querySelector('.content-area');
    if (!mainContent) return;

    const headings = Array.from(mainContent.querySelectorAll('h2[id], h3[id]'));
    if (headings.length < 2) return;

    // Create navigation structure
    const nav = document.createElement('aside');
    nav.className = 'dswp-in-page-nav';
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'On this page');
    nav.innerHTML = `
        <div class="nav-header">
            <div class="nav-title">
                <h4 id="nav-title">On this page:</h4>
            </div>
            <button type="button" 
                class="nav-toggle" 
                aria-label="Toggle section navigation" 
                aria-expanded="false"
                aria-controls="nav-links">
            </button>
        </div>
        <ul id="nav-links" 
            class="nav-links" 
            role="list" 
            aria-labelledby="nav-title">
            ${headings.map(heading => `
                <li>
                    <a href="#${heading.id}" 
                       data-heading-id="${heading.id}"
                       aria-current="false">
                        ${heading.textContent}
                    </a>
                </li>
            `).join('')}
        </ul>
    `;

    // Create wrapper structure
    const wrapper = document.createElement('div');
    wrapper.className = 'dswp-nav-content-container';
    mainContent.parentNode.insertBefore(wrapper, mainContent);
    wrapper.appendChild(nav);
    wrapper.appendChild(mainContent);

    // Handle scroll and click events
    const updateActiveLink = () => {
        const navHeight = nav.offsetHeight + 8;
        const scrollPosition = window.scrollY + navHeight + (window.innerHeight * 0.2);
        const navToggle = nav.querySelector('.nav-toggle');
        
        // Always hide toggle in desktop view, handle mobile behavior separately
        if (window.innerWidth > 768) {
            navToggle.style.display = 'none'; // Always hide in desktop
            nav.classList.add('is-expanded'); // Always expanded in desktop
        } else {
            // Mobile-specific behavior
            if (window.scrollY < 50) {
                // At top of page on mobile: expand nav and hide toggle
                nav.classList.add('is-expanded');
                navToggle.setAttribute('aria-expanded', 'true');
                navToggle.style.display = 'none';
            } else {
                // Show toggle button when scrolling
                navToggle.style.display = 'flex';
                // Only collapse if not manually expanded
                if (!nav.hasAttribute('data-manual-expanded')) {
                    nav.classList.remove('is-expanded');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
        
        // Find current heading
        let currentHeading = null;
        for (const heading of headings) {
            if (heading.getBoundingClientRect().top + window.scrollY < scrollPosition) {
                currentHeading = heading;
            } else break;
        }

        // Update active link and current class
        nav.querySelectorAll('a').forEach(link => {
            const isCurrent = currentHeading && link.getAttribute('data-heading-id') === currentHeading.id;
            link.classList.toggle('dswp-current', isCurrent);
            link.setAttribute('aria-current', isCurrent ? 'true' : 'false');
            const listItem = link.closest('li');
            listItem.classList.toggle('current', isCurrent);
        });
    };

    // Toggle navigation - simplified
    const navToggle = nav.querySelector('.nav-toggle');
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = nav.classList.toggle('is-expanded');
        navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        
        if (isExpanded) {
            nav.setAttribute('data-manual-expanded', '');
        } else {
            nav.removeAttribute('data-manual-expanded');
        }
    });

    // Smooth scroll to heading
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (!target) return;

            const offset = nav.offsetHeight + dswpInPageNav.options.scroll_offset;
            
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
            
            history.pushState(null, null, `#${targetId}`);
            
            // Also remove manual expand marker when clicking a link
            nav.removeAttribute('data-manual-expanded');
            nav.classList.remove('is-expanded');
        });
    });

    // Keep the throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
        scrollTimeout = window.requestAnimationFrame(updateActiveLink);
    });

    // Add keyboard navigation for the toggle button
    navToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navToggle.click();
        }
    });

    // Initial check
    updateActiveLink();
}); 