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
            const wasMobileView = menuContainer.classList.contains('dswp-is-mobile');
            
            // If we're switching between views (mobile to desktop or vice versa)
            if (isMobileView !== wasMobileView) {
                // Close all open submenus
                const openSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
                openSubmenus.forEach(submenu => {
                    submenu.classList.remove('is-open');
                    const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
                    const submenuButton = submenu.querySelector('.dswp-submenu-toggle');
                    if (submenuContainer) {
                        submenuContainer.classList.remove('is-open');
                    }
                    if (submenuButton) {
                        submenuButton.setAttribute('aria-expanded', 'false');
                    }
                });

                // Reset mobile menu state if switching from mobile to desktop
                if (!isMobileView) {
                    menuContainer.classList.remove('is-menu-open');
                    menuContainer.style.display = 'flex';
                    resetMenuState();
                }
            }

            // Update mobile classes
            if (isMobileView) {
                mobileNavIcon.style.display = 'flex';
                menuContainer.classList.add('dswp-is-mobile');
                if (!menuContainer.classList.contains('is-menu-open')) {
                    menuContainer.style.display = 'none';
                }
            } else {
                mobileNavIcon.style.display = 'none';
                menuContainer.classList.remove('dswp-is-mobile');
                menuContainer.style.display = 'flex';
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
        if (isAlwaysMode || nav.classList.contains('dswp-block-navigation-is-mobile-only')) {
            mobileNavIcon.style.display = 'flex';
            menuContainer.style.display = 'none';
            menuContainer.classList.add('dswp-is-mobile');
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

                // Close all open submenus when closing the mobile menu
                if (!isOpen) {
                    const openSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
                    openSubmenus.forEach(submenu => {
                        submenu.classList.remove('is-open');
                        const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
                        const submenuButton = submenu.querySelector('.dswp-submenu-toggle');
                        if (submenuContainer) {
                            submenuContainer.classList.remove('is-open');
                        }
                        if (submenuButton) {
                            submenuButton.setAttribute('aria-expanded', 'false');
                        }
                    });
                }
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = nav.contains(event.target);
                
            if (!isClickInside) {
                if (menuContainer.classList.contains('is-menu-open')) {
                    menuContainer.classList.remove('is-menu-open');
                    menuContainer.style.display = 'none';
                    resetMenuState();
                }
                
                // Close all open submenus
                const openSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
                openSubmenus.forEach(submenu => {
                    submenu.classList.remove('is-open');
                    const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
                    const submenuButton = submenu.querySelector('.dswp-submenu-toggle');
                    if (submenuContainer) {
                        submenuContainer.classList.remove('is-open');
                    }
                    if (submenuButton) {
                        submenuButton.setAttribute('aria-expanded', 'false');
                    }
                });
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
                        
                        // Add position adjustment for level 3+ submenus
                        const level = getSubmenuLevel(submenu);
                        if (level >= 3) {
                            adjustSubmenuPosition(submenu);
                            
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
            
            if (event.key === 'Escape') {
                // Close all open submenus
                const openSubmenus = nav.querySelectorAll('.wp-block-navigation-submenu.is-open');
                openSubmenus.forEach(submenu => {
                    submenu.classList.remove('is-open');
                    const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
                    if (submenuContainer) {
                        submenuContainer.classList.remove('is-open');
                    }
                });
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

    // Reset position first
    submenuContainer.style.left = '100%';
    submenuContainer.style.right = 'auto';

    // Get updated position after reset
    const rect = submenuContainer.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Check if submenu extends beyond right edge
    if (rect.right > viewportWidth) {
        submenuContainer.style.left = 'auto';
        submenuContainer.style.right = '100%';
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