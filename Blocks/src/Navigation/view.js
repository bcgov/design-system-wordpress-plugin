document.addEventListener("DOMContentLoaded", function () {
    const navBlocks = document.querySelectorAll('.dswp-block-navigation-is-mobile-overlay, .dswp-block-navigation-is-always-overlay');
    
    navBlocks.forEach(nav => {
        // Cache frequently used elements
        const elements = {
            mobileNavIcon: nav.querySelector(".dswp-nav-mobile-toggle-icon"),
            menuContainer: nav.querySelector(".dswp-block-navigation__container"),
            iconText: nav.querySelector(".dswp-nav-mobile-menu-icon-text"),
            topBar: nav.querySelector(".dswp-nav-mobile-menu-top-bar"),
            middleBar: nav.querySelector(".dswp-nav-mobile-menu-middle-bar"),
            bottomBar: nav.querySelector(".dswp-nav-mobile-menu-bottom-bar")
        };

        const isMobileMode = nav.classList.contains('dswp-block-navigation-is-mobile-overlay');
        const isAlwaysMode = nav.classList.contains('dswp-block-navigation-is-always-overlay');
        
        /**
         * Closes all submenus within the navigation
         */
        function closeAllSubmenus() {
            const openSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
            openSubmenus.forEach(submenu => {
                submenu.classList.remove('is-open');
                const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
                const submenuButton = submenu.querySelector('.dswp-submenu-toggle');
                if (submenuContainer) submenuContainer.classList.remove('is-open');
                if (submenuButton) submenuButton.setAttribute('aria-expanded', 'false');
            });
        }

        function handleResize() {
            if (!isMobileMode) return;
            
            const breakpoint = parseInt(nav.dataset.dswpMobileBreakpoint);
            const isMobileView = window.innerWidth <= (breakpoint || 768);
            const wasMobileView = elements.menuContainer.classList.contains('dswp-is-mobile');
            
            // Only run logic if we're actually switching between views
            if (isMobileView !== wasMobileView) {
                // Close all open submenus
                closeAllSubmenus();

                // Reset mobile menu state if switching from mobile to desktop
                if (!isMobileView) {
                    elements.menuContainer.classList.remove('is-menu-open');
                    elements.menuContainer.style.display = 'flex';
                    resetMenuState();
                }
                
                // Update mobile classes and display
                elements.mobileNavIcon.style.display = isMobileView ? 'flex' : 'none';
                elements.menuContainer.classList.toggle('dswp-is-mobile', isMobileView);
                if (isMobileView && !elements.menuContainer.classList.contains('is-menu-open')) {
                    elements.menuContainer.style.display = 'none';
                }
            }
        }

        function resetMenuState() {
            if (elements.iconText) elements.iconText.innerText = "Menu";
            if (elements.topBar) elements.topBar.classList.remove("dswp-nav-mobile-menu-top-bar-open");
            if (elements.middleBar) elements.middleBar.classList.remove("dswp-nav-mobile-menu-middle-bar-open");
            if (elements.bottomBar) elements.bottomBar.classList.remove("dswp-nav-mobile-menu-bottom-bar-open");
            
            elements.mobileNavIcon.setAttribute('aria-expanded', 'false');
        }

        // Set initial states
        if (isAlwaysMode || nav.classList.contains('dswp-block-navigation-is-mobile-only')) {
            elements.mobileNavIcon.style.display = 'flex';
            elements.menuContainer.style.display = 'none';
            elements.menuContainer.classList.add('dswp-is-mobile');
        } else if (isMobileMode) {
            handleResize();
        }

        // Listen for window resize only in mobile mode
        if (isMobileMode) {
            window.addEventListener('resize', handleResize);
        }

        // Mobile menu toggle functionality
        if (elements.mobileNavIcon) {
            elements.mobileNavIcon.addEventListener("click", function () {
                // Toggle menu visibility
                elements.menuContainer.classList.toggle('is-menu-open');
                const isOpen = elements.menuContainer.classList.contains('is-menu-open');
                
                // Update ARIA state
                elements.mobileNavIcon.setAttribute('aria-expanded', isOpen.toString());
                
                // Toggle hamburger animation
                elements.topBar.classList.toggle("dswp-nav-mobile-menu-top-bar-open");
                elements.middleBar.classList.toggle("dswp-nav-mobile-menu-middle-bar-open");
                if (elements.bottomBar) {
                    elements.bottomBar.classList.toggle("dswp-nav-mobile-menu-bottom-bar-open");
                }

                // Update menu text
                elements.iconText.innerText = isOpen ? "Close menu" : "Menu";
                
                // Show/hide menu
                elements.menuContainer.style.display = isOpen ? 'grid' : 'none';

                // Close all open submenus when closing the mobile menu
                if (!isOpen) {
                    closeAllSubmenus();
                }
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = nav.contains(event.target);
                
            if (!isClickInside) {
                if (elements.menuContainer.classList.contains('is-menu-open')) {
                    elements.menuContainer.classList.remove('is-menu-open');
                    elements.menuContainer.style.display = 'none';
                    resetMenuState();
                }
                
                // Close all open submenus
                closeAllSubmenus();
            }
        });

        // Handle escape key for mobile menu
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && elements.menuContainer.classList.contains('is-menu-open')) {
                elements.menuContainer.classList.remove('is-menu-open');
                elements.menuContainer.style.display = 'none';
                resetMenuState();
            }
        });

        // Add submenu click handlers
        
  // Add submenu click handlers
const submenuLinks = nav.querySelectorAll('.wp-block-navigation-submenu > .wp-block-navigation-item__content');

submenuLinks.forEach(link => {
    const submenu = link.closest('.wp-block-navigation-submenu');
    const hasSubmenu = submenu?.querySelector('.wp-block-navigation__submenu-container');
    
    if (hasSubmenu) {
        // Create a button for the arrow
        const arrowButton = document.createElement('button');
        arrowButton.className = 'dswp-submenu-toggle';
        arrowButton.setAttribute('aria-expanded', 'false');
        arrowButton.setAttribute('aria-label', 'Toggle submenu');
        
        // Insert the button after the link text
        link.parentNode.insertBefore(arrowButton, link.nextSibling);
        
        // Move click handler to the arrow button
        arrowButton.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            
            const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
            const isOpen = submenu.classList.contains('is-open');
            
            // First, close all open submenus except the current submenu's ancestors
            const allOpenSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
            const currentPath = [];
            let parent = submenu;
            while (parent) {
                if (parent.classList.contains('wp-block-navigation-submenu')) {
                    currentPath.push(parent);
                }
                parent = parent.parentElement.closest('.wp-block-navigation-submenu');
            }

            allOpenSubmenus.forEach(openSubmenu => {
                if (!currentPath.includes(openSubmenu)) {
                    openSubmenu.classList.remove('is-open');
                    const container = openSubmenu.querySelector('.wp-block-navigation__submenu-container');
                    const button = openSubmenu.querySelector('.dswp-submenu-toggle');
                    if (container) {
                        container.classList.remove('is-open');
                    }
                    if (button) {
                        button.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            // Toggle current submenu
            submenu.classList.toggle('is-open');
            if (submenuContainer) {
                submenuContainer.classList.toggle('is-open');

                // Add position adjustment for level 2 and level 2+ submenus
                const level = getSubmenuLevel(submenu);
                if (level >= 2) {
                    adjustSubmenuPosition(submenu);
                }
                
                const resizeObserver = new ResizeObserver(() => {
                    if (submenu.classList.contains('is-open')) {
                        adjustSubmenuPosition(submenu);
                    }
                });
                
                resizeObserver.observe(submenu);
                resizeObserver.observe(document.body);
                
                const cleanup = () => {
                    if (!submenu.classList.contains('is-open')) {
                        resizeObserver.disconnect();
                        submenu.removeEventListener('classChange', cleanup);
                    }
                };
                
                submenu.addEventListener('classChange', cleanup);
            }
            
            // Update ARIA state
            arrowButton.setAttribute('aria-expanded', (!isOpen).toString());
        });
    }
});
        // Add this after the submenu click handlers
        document.addEventListener('click', function(event) {
            // Check if click is outside the navigation
            const isClickInsideNav = nav.contains(event.target);
            
            if (!isClickInsideNav) {
                // Close all open submenus
                closeAllSubmenus();
            }
        });

        // Add keyboard navigation for submenus
        document.addEventListener('keydown', function(event) {
            const activeElement = document.activeElement;
            
            if (event.key === 'Escape') {
                // Close all open submenus
                closeAllSubmenus();
                // Reset all arrow rotations
                resetArrowRotations(nav);
            }
            
            // Handle arrow keys for submenu navigation
            if (activeElement.classList.contains('wp-block-navigation-item__content') || 
                activeElement.classList.contains('dswp-submenu-toggle')) {
                
                const submenu = activeElement.closest('.wp-block-navigation-submenu');
                const submenuContainer = submenu?.querySelector('.wp-block-navigation__submenu-container');
                
                switch(event.key) {
                    case 'Enter':
                    case ' ':
                        if (activeElement.classList.contains('dswp-submenu-toggle')) {
                            event.preventDefault();
                            activeElement.click();
                        }
                        break;
                        
                    case 'Escape':
                        if (submenu?.classList.contains('is-open')) {
                            event.preventDefault();
                            const toggleButton = submenu.querySelector('.dswp-submenu-toggle');
                            toggleButton?.click();
                            toggleButton?.focus();
                        }
                        break;
                }
            }
        });
    });
});

function adjustSubmenuPosition(submenu) {
    const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
    if (!submenuContainer) return;

    // Get the level of the submenu
    const level = getSubmenuLevel(submenu);

    // Reset position first
    if (level === 1) {
        submenuContainer.style.left = '0%';
        submenuContainer.style.right = 'auto'; // Set right to 0% for level 1
    } else if (level >= 2) {
        submenuContainer.style.left = '100%';
        submenuContainer.style.right = 'auto'; // Default for level 2 and deeper
    }

    // Get updated position after reset
    const rect = submenuContainer.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Check if submenu extends beyond right edge
    if (level === 1 && rect.right > viewportWidth) {
        submenuContainer.style.left = 'auto';
        submenuContainer.style.right = '0%'; // Adjust for level 1 if it overflows
    } else if (level >=2 && rect.right > viewportWidth) {
        submenuContainer.style.left = 'auto';
        submenuContainer.style.right = '100%'; // Adjust for level 2 or deeper
    }
}

// Add this helper function
function getSubmenuLevel(submenu) {
    let level = 1;
    let parent = submenu.parentElement;
    while (parent) {
        if (parent.classList.contains('wp-block-navigation-submenu')) {
            level++;
        }
        parent = parent.parentElement;
    }
    return level;
}

function resetArrowRotations(nav) {
    const allArrows = nav.querySelectorAll('.dswp-submenu-toggle');
    allArrows.forEach(arrow => {
        arrow.setAttribute('aria-expanded', 'false');
    });
}