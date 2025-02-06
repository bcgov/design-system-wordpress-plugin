/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/Navigation/view.js ***!
  \********************************/
/**
 * Navigation Block Frontend JavaScript
 *
 * Handles the interactive functionality of the navigation block including:
 * - Mobile menu toggling
 * - Submenu handling
 * - Responsive behavior
 * - Keyboard navigation
 * - Position adjustments for nested menus
 *
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', function () {
  // Select all navigation blocks that can have overlay behavior
  const navBlocks = document.querySelectorAll('.dswp-block-navigation-is-mobile-overlay, ' + '.dswp-block-navigation-is-always-overlay, ' + '.dswp-block-navigation-is-never-overlay');
  navBlocks.forEach(nav => {
    // Cache frequently used DOM elements
    const elements = {
      mobileNavIcon: nav.querySelector('.dswp-nav-mobile-toggle-icon'),
      menuContainer: nav.querySelector('.dswp-block-navigation__container'),
      iconText: nav.querySelector('.dswp-nav-mobile-menu-icon-text'),
      topBar: nav.querySelector('.dswp-nav-mobile-menu-top-bar'),
      middleBar: nav.querySelector('.dswp-nav-mobile-menu-middle-bar'),
      bottomBar: nav.querySelector('.dswp-nav-mobile-menu-bottom-bar')
    };

    // Initialize state flags
    const isMobileMode = nav.classList.contains('dswp-block-navigation-is-mobile-overlay');
    const isAlwaysMode = nav.classList.contains('dswp-block-navigation-is-always-overlay');

    /**
     * Menu State Management Functions
     */

    /**
     * Closes all open submenus within the navigation
     */
    function closeAllSubmenus() {
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

    /**
     * Resets the mobile menu to its default state
     */
    function resetMenuState() {
      if (elements.iconText) {
        elements.iconText.innerText = 'Menu';
      }
      if (elements.topBar) {
        elements.topBar.classList.remove('dswp-nav-mobile-menu-top-bar-open');
      }
      if (elements.middleBar) {
        elements.middleBar.classList.remove('dswp-nav-mobile-menu-middle-bar-open');
      }
      if (elements.bottomBar) {
        elements.bottomBar.classList.remove('dswp-nav-mobile-menu-bottom-bar-open');
      }
      elements.mobileNavIcon.setAttribute('aria-expanded', 'false');
    }

    /**
     * Resets all submenu arrow rotations to their default state
     */
    function resetArrowRotations() {
      const allArrows = nav.querySelectorAll('.dswp-submenu-toggle');
      allArrows.forEach(arrow => {
        arrow.setAttribute('aria-expanded', 'false');
      });
    }

    /**
     * Event Handlers
     */

    /**
     * Handles responsive behavior when window is resized
     */
    function handleResize() {
      if (!isMobileMode) {
        return;
      }
      const breakpoint = parseInt(nav.dataset.dswpMobileBreakpoint);
      const isMobileView = window.innerWidth <= (breakpoint || 768);
      const wasMobileView = elements.menuContainer.classList.contains('dswp-is-mobile');

      // Only run logic if we're actually switching between views
      if (isMobileView !== wasMobileView) {
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

    /**
     * Position & Layout Functions
     */

    /**
     * Adjusts the position of submenus to ensure they remain visible within viewport
     * @param {HTMLElement} submenu - The submenu element to position
     */
    function adjustSubmenuPosition(submenu) {
      const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
      if (!submenuContainer) {
        return;
      }
      const level = getSubmenuLevel(submenu);

      // Reset position first
      if (level === 1) {
        submenuContainer.style.left = '0%';
        submenuContainer.style.right = 'auto';
      } else if (level >= 2) {
        submenuContainer.style.left = '100%';
        submenuContainer.style.right = 'auto';
      }

      // Check viewport boundaries
      const rect = submenuContainer.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      if (level === 1 && rect.right > viewportWidth) {
        submenuContainer.style.left = 'auto';
        submenuContainer.style.right = '0%';
      } else if (level >= 2 && rect.right > viewportWidth) {
        submenuContainer.style.left = 'auto';
        submenuContainer.style.right = '100%';
      }
    }

    /**
     * Determines the nesting level of a submenu
     * @param {HTMLElement} submenu - The submenu element to check
     * @return {number} The nesting level (1-based)
     */
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

    /**
     * Determines the nesting level of a submenu and adds appropriate classes
     * @param {HTMLElement} submenu - The submenu element to check
     */
    function initializeSubmenuLevel(submenu) {
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

    /**
     * Initialization
     */

    // Set initial states
    if (isAlwaysMode || nav.classList.contains('dswp-block-navigation-is-mobile-only')) {
      elements.mobileNavIcon.style.display = 'flex';
      elements.menuContainer.style.display = 'none';
      elements.menuContainer.classList.add('dswp-is-mobile');
    } else if (isMobileMode) {
      handleResize();
    }

    // Event Listeners
    if (isMobileMode) {
      window.addEventListener('resize', handleResize);
    }

    // Mobile menu toggle functionality
    if (elements.mobileNavIcon) {
      elements.mobileNavIcon.addEventListener('click', function () {
        elements.menuContainer.classList.toggle('is-menu-open');
        const isOpen = elements.menuContainer.classList.contains('is-menu-open');
        elements.mobileNavIcon.setAttribute('aria-expanded', isOpen.toString());

        // Toggle hamburger animation
        elements.topBar.classList.toggle('dswp-nav-mobile-menu-top-bar-open');
        elements.middleBar.classList.toggle('dswp-nav-mobile-menu-middle-bar-open');
        if (elements.bottomBar) {
          elements.bottomBar.classList.toggle('dswp-nav-mobile-menu-bottom-bar-open');
        }
        elements.iconText.innerText = isOpen ? 'Close menu' : 'Menu';
        elements.menuContainer.style.display = isOpen ? 'grid' : 'none';
        if (!isOpen) {
          closeAllSubmenus();
        }
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      const isClickInside = nav.contains(event.target);
      const isMobileView = window.innerWidth <= (parseInt(nav.dataset.dswpMobileBreakpoint) || 768);

      // Close submenus if click is outside and we're in desktop mode
      if (!isClickInside) {
        if (isMobileView && elements.menuContainer.classList.contains('is-menu-open')) {
          // Mobile mode - close everything
          elements.menuContainer.classList.remove('is-menu-open');
          elements.menuContainer.style.display = 'none';
          resetMenuState();
          closeAllSubmenus();
        } else if (!isMobileView) {
          // Desktop mode - only close submenus
          closeAllSubmenus();
          resetArrowRotations(nav);
        }
      }
    });

    // Handle escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (elements.menuContainer.classList.contains('is-menu-open')) {
          elements.menuContainer.classList.remove('is-menu-open');
          elements.menuContainer.style.display = 'none';
          resetMenuState();
        }
        closeAllSubmenus();
        resetArrowRotations(nav);
      }
    });

    // Initialize submenu functionality
    const submenuLinks = nav.querySelectorAll('.wp-block-navigation-submenu > .wp-block-navigation-item__content');
    submenuLinks.forEach(link => {
      const submenu = link.closest('.wp-block-navigation-submenu');
      const hasSubmenu = submenu?.querySelector('.wp-block-navigation__submenu-container');
      if (hasSubmenu) {
        // Add level class to submenu
        initializeSubmenuLevel(submenu);

        // Create submenu toggle button
        const arrowButton = document.createElement('button');
        arrowButton.className = 'dswp-submenu-toggle';
        arrowButton.setAttribute('aria-expanded', 'false');
        arrowButton.setAttribute('aria-label', 'Toggle submenu');
        link.parentNode.insertBefore(arrowButton, link.nextSibling);

        // Handle submenu toggle
        arrowButton.addEventListener('click', () => {
          const submenuContainer = submenu.querySelector('.wp-block-navigation__submenu-container');
          const isOpen = submenu.classList.contains('is-open');

          // Close other submenus
          const currentPath = [];
          let parent = submenu;
          while (parent) {
            if (parent.classList.contains('wp-block-navigation-submenu')) {
              currentPath.push(parent);
            }
            parent = parent.parentElement.closest('.wp-block-navigation-submenu');
          }
          nav.querySelectorAll('.wp-block-navigation-submenu.is-open').forEach(openSubmenu => {
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
            const level = getSubmenuLevel(submenu);
            if (level >= 2) {
              adjustSubmenuPosition(submenu);
            }

            // Watch for size changes
            const resizeObserver = createObserver(submenu, () => {
              if (submenu.classList.contains('is-open')) {
                adjustSubmenuPosition(submenu);
              }
            });
            resizeObserver.observe(document.body);
            const cleanup = () => {
              if (!submenu.classList.contains('is-open')) {
                resizeObserver.disconnect();
                submenu.removeEventListener('classChange', cleanup);
              }
            };
            submenu.addEventListener('classChange', cleanup);
          }
          arrowButton.setAttribute('aria-expanded', (!isOpen).toString());
        });
      }
    });
  });
});

// Check if ResizeObserver is supported and create a fallback
const createObserver = (submenu, callback) => {
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    return new window.ResizeObserver(callback);
  }

  // Fallback to window resize event
  const handler = () => {
    if (submenu.classList.contains('is-open')) {
      callback();
    }
  };
  window.addEventListener('resize', handler);
  return {
    observe: () => {},
    disconnect: () => window.removeEventListener('resize', handler)
  };
};
/******/ })()
;
//# sourceMappingURL=view.js.map