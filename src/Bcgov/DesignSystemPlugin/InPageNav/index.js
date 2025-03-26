document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('#main-content') || document.querySelector('main') || document.querySelector('.content-area');
    if (!mainContent) return;

    const headings = Array.from(mainContent.querySelectorAll('h2[id], h3[id]'));
    if (headings.length < 2) return;

    // Create navigation structure
    const nav = document.createElement('aside');
    nav.className = 'dswp-in-page-nav';
    nav.innerHTML = `
        <div class="nav-header">
            <div class="nav-title">
                <h4>On this page</h4>
            </div>
            <button type="button" class="nav-toggle" aria-label="Toggle navigation menu" aria-expanded="false"></button>
        </div>
        <ul class="nav-links">
            ${headings.map(heading => `
                <li>
                    <a href="#${heading.id}" data-heading-id="${heading.id}">
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
            const listItem = link.closest('li');
            listItem.classList.toggle('current', isCurrent);
        });
    };

    // Toggle navigation
    const navToggle = nav.querySelector('.nav-toggle');
    navToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event from bubbling to navHeader
        if (window.innerWidth <= 768) {
            const isExpanded = nav.classList.toggle('is-expanded');
            navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
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
            
            // Collapse the navigation after clicking a link
            nav.classList.remove('is-expanded');
        });
    });

    // Keep the throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
        scrollTimeout = window.requestAnimationFrame(updateActiveLink);
    });

    // Initial check
    updateActiveLink();
}); 