document.addEventListener("DOMContentLoaded", function () {
    const navBlocks = document.querySelectorAll('.dswp-block-navigation-is-mobile-overlay, .dswp-block-navigation-is-always-overlay');
    
    navBlocks.forEach(nav => {
        const mobileNavIcon = nav.querySelector(".dswp-nav-mobile-toggle-icon");
        const menuContainer = nav.querySelector(".dswp-block-navigation__container");
        const isMobileMode = nav.classList.contains('dswp-block-navigation-is-mobile-overlay');
        const isAlwaysMode = nav.classList.contains('dswp-block-navigation-is-always-overlay');
        
        function handleResize() {
            if (!isMobileMode) return;
            
            const breakpoint = parseInt(getComputedStyle(nav).getPropertyValue('--mobile-breakpoint'));
            const isMobileView = window.innerWidth <= (breakpoint || 768);
            
            if (isMobileView) {
                mobileNavIcon.style.display = 'flex';
                if (!menuContainer.classList.contains('is-menu-open')) {
                    menuContainer.style.display = 'none';
                }
            } else {
                mobileNavIcon.style.display = 'none';
                menuContainer.style.display = 'flex';
                menuContainer.classList.remove('is-menu-open');
                resetMenuState();
            }
        }

        function resetMenuState() {
            const mobileNavIconText = nav.querySelector(".dswp-nav-mobile-menu-icon-text");
            const mobileNavTopBar = nav.querySelector(".dswp-nav-mobile-menu-top-bar");
            const mobileNavMiddleBar = nav.querySelector(".dswp-nav-mobile-menu-middle-bar");
            const mobileNavBottomBar = nav.querySelector(".dswp-nav-mobile-menu-bottom-bar");

            if (mobileNavIconText) mobileNavIconText.innerText = "Menu";
            if (mobileNavTopBar) mobileNavTopBar.classList.remove("dswp-nav-mobile-menu-top-bar-open");
            if (mobileNavMiddleBar) mobileNavMiddleBar.classList.remove("dswp-nav-mobile-menu-middle-bar-open");
            if (mobileNavBottomBar) mobileNavBottomBar.classList.remove("dswp-nav-mobile-menu-bottom-bar-open");
            
            mobileNavIcon.setAttribute('aria-expanded', 'false');
        }

        // Set initial states
        if (isAlwaysMode) {
            mobileNavIcon.style.display = 'flex';
            menuContainer.style.display = 'none';
        } else if (isMobileMode) {
            handleResize();
        }

        // Listen for window resize only in mobile mode
        if (isMobileMode) {
            window.addEventListener('resize', handleResize);
        }

        // Mobile menu toggle functionality
        if (mobileNavIcon) {
            mobileNavIcon.addEventListener("click", function () {
                const mobileNavIconText = nav.querySelector(".dswp-nav-mobile-menu-icon-text");
                const mobileNavTopBar = nav.querySelector(".dswp-nav-mobile-menu-top-bar");
                const mobileNavMiddleBar = nav.querySelector(".dswp-nav-mobile-menu-middle-bar");
                const mobileNavBottomBar = nav.querySelector(".dswp-nav-mobile-menu-bottom-bar");

                // Toggle menu visibility
                menuContainer.classList.toggle('is-menu-open');
                const isOpen = menuContainer.classList.contains('is-menu-open');
                
                // Update ARIA state
                mobileNavIcon.setAttribute('aria-expanded', isOpen.toString());
                
                // Toggle hamburger animation
                mobileNavTopBar.classList.toggle("dswp-nav-mobile-menu-top-bar-open");
                mobileNavMiddleBar.classList.toggle("dswp-nav-mobile-menu-middle-bar-open");
                if (mobileNavBottomBar) {
                    mobileNavBottomBar.classList.toggle("dswp-nav-mobile-menu-bottom-bar-open");
                }

                // Update menu text
                mobileNavIconText.innerText = isOpen ? "Close menu" : "Menu";
                
                // Show/hide menu
                menuContainer.style.display = isOpen ? 'grid' : 'none';
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = nav.contains(event.target);
                
                if (!isClickInside && menuContainer.classList.contains('is-menu-open')) {
                    menuContainer.classList.remove('is-menu-open');
                    menuContainer.style.display = 'none';
                    resetMenuState();
                }
        });

        // Handle escape key for mobile menu //! Need to add functionality for desktop as well
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && menuContainer.classList.contains('is-menu-open')) {
                menuContainer.classList.remove('is-menu-open');
                menuContainer.style.display = 'none';
                resetMenuState();
            }
        });

        // Add submenu click handlers
        const submenuLinks = nav.querySelectorAll('.wp-block-navigation-submenu > .wp-block-navigation-item__content');
        
        submenuLinks.forEach(link => {
            // Only create button if parent has submenu
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
                    
                    // Toggle submenu
                    submenu.classList.toggle('is-open');
                    if (submenuContainer) {
                        submenuContainer.classList.toggle('is-open');
                    }
                    
                    // Update ARIA state
                    arrowButton.setAttribute('aria-expanded', (!isOpen).toString());
                    
                    // Close other submenus
                    const siblings = submenu.parentElement.children;
                    Array.from(siblings).forEach(sibling => {
                        if (sibling !== submenu && sibling.classList.contains('wp-block-navigation-submenu')) {
                            sibling.classList.remove('is-open');
                            const siblingSubmenuContainer = sibling.querySelector('.wp-block-navigation__submenu-container');
                            const siblingButton = sibling.querySelector('.dswp-submenu-toggle');
                            if (siblingSubmenuContainer) {
                                siblingSubmenuContainer.classList.remove('is-open');
                            }
                            if (siblingButton) {
                                siblingButton.setAttribute('aria-expanded', 'false');
                            }
                        }
                    });
                });
            }
        });

        // Add this after the submenu click handlers
        document.addEventListener('click', function(event) {
            // Check if click is outside the navigation
            const isClickInsideNav = nav.contains(event.target);
            
            if (!isClickInsideNav) {
                // Close all open submenus
                const openSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
                openSubmenus.forEach(submenu => {
                    submenu.classList.remove('is-open');
                    const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
                    if (submenuContainer) {
                        submenuContainer.classList.remove('is-open');
                    }
                });
            }
        });

        // Add keyboard navigation for submenus
        document.addEventListener('keydown', function(event) {
            const activeElement = document.activeElement;
            
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