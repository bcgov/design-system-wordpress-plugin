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
            if (isMobileMode || isAlwaysMode) {
                const isClickInside = nav.contains(event.target);
                
                if (!isClickInside && menuContainer.classList.contains('is-menu-open')) {
                    menuContainer.classList.remove('is-menu-open');
                    menuContainer.style.display = 'none';
                    resetMenuState();
                }
            }
        });

        // Handle escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && menuContainer.classList.contains('is-menu-open')) {
                menuContainer.classList.remove('is-menu-open');
                menuContainer.style.display = 'none';
                resetMenuState();
            }
        });

        // Clean up event listeners on page unload
        window.addEventListener('unload', function() {
            if (isMobileMode) {
                window.removeEventListener('resize', handleResize);
            }
        });

        // Add submenu click handlers
        const submenuLinks = nav.querySelectorAll('.wp-block-navigation-item__content');
        
        submenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop the event from bubbling up to avoid triggering parent submenu toggles inadvertently.

                const submenu = link.closest('.wp-block-navigation-submenu');
                const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');

                // Toggle the current submenu
                submenu.classList.toggle('is-open');
                if (submenuContainer) {
                    submenuContainer.classList.toggle('is-open');
                }

                // Close other submenus at the same level
                const siblings = submenu.parentElement.children;
                Array.from(siblings).forEach(sibling => {
                    if (sibling !== submenu && sibling.classList.contains('wp-block-navigation-submenu')) {
                        sibling.classList.remove('is-open');
                        const siblingSubmenuContainer = sibling.querySelector('.wp-block-navigation__submenu-container');
                        if (siblingSubmenuContainer) {
                            siblingSubmenuContainer.classList.remove('is-open');
                        }
                    }
                });

                // Close all nested submenus inside the current submenu if it is being closed
                if (!submenu.classList.contains('is-open')) {
                    const nestedSubmenus = submenu.querySelectorAll('.wp-block-navigation-submenu');
                    nestedSubmenus.forEach(nestedSubmenu => {
                        nestedSubmenu.classList.remove('is-open');
                        const nestedContainer = nestedSubmenu.querySelector('.wp-block-navigation__submenu-container');
                        if (nestedContainer) {
                            nestedContainer.classList.remove('is-open');
                        }
                    });
                }
            });
        });
    });
});