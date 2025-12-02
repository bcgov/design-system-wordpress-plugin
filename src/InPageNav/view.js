/* global dswpInPageNav */

/**
 * In-Page Navigation Frontend Implementation
 *
 * Provides dynamic navigation functionality for page sections, including:
 * - Automatic navigation generation from headings
 * - Responsive behavior for mobile/desktop
 * - Smooth scrolling to sections
 * - Accessibility support
 */

// Wait for DOM to be fully loaded before initializing.
document.addEventListener( 'DOMContentLoaded', () => {
	// Detect WordPress admin bar and add class to body
	const adminBar = document.getElementById( 'wpadminbar' );
	if ( adminBar ) {
		document.body.classList.add( 'admin-bar' );
	}

	// Find the main content area using various common selectors.
	const mainContent =
		document.querySelector( '#main-content' ) ||
		document.querySelector( 'main' ) ||
		document.querySelector( '.content-area' ) ||
		document.querySelector( '.entry-content' ) || // Common WordPress class
		document.querySelector( '.post-content' ) || // Another common class
		document.querySelector( 'article' ); // Fallback to article element

	if ( ! mainContent ) {
		return;
	}

	// First, ensure all h2 elements have IDs
	const allHeadings = mainContent.querySelectorAll( 'h2' );

	allHeadings.forEach( ( heading, index ) => {
		if ( ! heading.id ) {
			// Generate a slug from the heading text
			const slug = heading.textContent
				.toLowerCase()
				.replace( /[^a-z0-9]+/g, '-' )
				.replace( /(^-|-$)/g, '' );

			// Add a unique ID using the slug and index
			heading.id = `section-${ slug }-${ index }`;
		}
	} );

	// Now find all h2 headings (they should all have IDs now).
	const headings = Array.from( mainContent.querySelectorAll( 'h2' ) );

	// Exit if there aren't enough headings to warrant navigation.
	if ( headings.length < 1 ) {
		return;
	}

	// Create the navigation sidebar structure.
	const nav = document.createElement( 'aside' );
	nav.className = 'dswp-in-page-nav';
	nav.setAttribute( 'role', 'navigation' );
	nav.setAttribute( 'aria-label', 'On this page' );

	// Get page excerpt from PHP
	const pageExcerpt = window.dswpInPageNav?.page_excerpt || '';

	// Insert the navigation HTML structure with accessibility attributes.
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
            ${
				pageExcerpt
					? `
                <li class="nav-excerpt">
                    <span class="excerpt-text">${ pageExcerpt }</span>
                </li>
            `
					: ''
			}
            ${ headings
				.map(
					( heading, index ) => `
                <li>
                    <a href="#${ heading.id }" 
                       data-heading-id="${ heading.id }"
                       aria-current="false">
                        <span class="heading-number">${ index + 1 }.</span>
                        <span class="heading-text">${
							heading.textContent
						}</span>
                    </a>
                </li>
            `
				)
				.join( '' ) }
        </ul>
    `;

	// Create a wrapper to contain both navigation and content.
	const wrapper = document.createElement( 'div' );
	wrapper.className = 'dswp-nav-content-container';
	mainContent.parentNode.insertBefore( wrapper, mainContent );
	wrapper.appendChild( nav );
	wrapper.appendChild( mainContent );

	// Set initial active state - on mobile, first link should be active by default
	if ( window.innerWidth <= 768 ) {
		const firstLink = nav.querySelector( 'a[data-heading-id]' );
		if ( firstLink ) {
			firstLink.setAttribute( 'aria-current', 'true' );
			// Also set the current class for mobile styling
			const listItem = firstLink.closest( 'li' );
			if ( listItem ) {
				listItem.classList.add( 'current' );
			}
		}
		// Expand navigation on initial load to show the first element
		nav.classList.add( 'is-expanded' );
	}

	/**
	 * Updates the active navigation link based on scroll position.
	 * Handles both desktop and mobile responsive behaviors.
	 */
	const updateActiveLink = () => {
		const navHeight = nav.offsetHeight + 8;
		// Calculate scroll position with offset for better UX.
		const scrollPosition =
			window.scrollY + navHeight + window.innerHeight * 0.2;
		const navToggle = nav.querySelector( '.nav-toggle' );

		// Handle responsive behavior.
		if ( window.innerWidth > 768 ) {
			// Desktop view: Always show expanded navigation, no scroll behavior needed.
			navToggle.style.display = 'none';
			nav.classList.add( 'is-expanded' );
		} else if ( window.scrollY < 50 ) {
			// Mobile view: At top of page - Show expanded navigation.
			nav.classList.add( 'is-expanded' );
			nav.classList.remove( 'is-scrolled' );
			navToggle.setAttribute( 'aria-expanded', 'true' );
			navToggle.style.display = 'none';
		} else {
			// Mobile view: When scrolling - Show toggle button and add scrolled state.
			nav.classList.add( 'is-scrolled' );
			navToggle.style.display = 'flex';
			// Collapse nav unless manually expanded.
			if ( ! nav.hasAttribute( 'data-manual-expanded' ) ) {
				nav.classList.remove( 'is-expanded' );
				navToggle.setAttribute( 'aria-expanded', 'false' );
			}
		}

		// Determine which heading is currently in view.
		let currentHeading = null;

		// Normal scroll-based detection
		for ( const heading of headings ) {
			if (
				heading.getBoundingClientRect().top + window.scrollY <
				scrollPosition
			) {
				currentHeading = heading;
			} else {
				break;
			}
		}

		// Fallback: default to first heading
		// This ensures the navigation always shows a current link on mobile
		if ( ! currentHeading ) {
			currentHeading = headings[ 0 ];
		}

		// Update navigation links to reflect current section.
		nav.querySelectorAll( 'a' ).forEach( ( link ) => {
			const isCurrent =
				currentHeading &&
				link.getAttribute( 'data-heading-id' ) === currentHeading.id;

			// Always update aria-current for accessibility
			link.setAttribute( 'aria-current', isCurrent ? 'true' : 'false' );

			// Only apply visual styling classes on mobile
			if ( window.innerWidth <= 768 ) {
				link.classList.toggle( 'dswp-current', isCurrent );
				const listItem = link.closest( 'li' );
				listItem.classList.toggle( 'current', isCurrent );
			} else {
				// Remove all visual styling classes on desktop
				link.classList.remove( 'dswp-current' );
				const listItem = link.closest( 'li' );
				listItem.classList.remove( 'current' );
			}
		} );
	};

	// Handle mobile navigation toggle.
	const navToggle = nav.querySelector( '.nav-toggle' );
	navToggle.addEventListener( 'click', ( e ) => {
		e.stopPropagation();
		const isExpanded = nav.classList.toggle( 'is-expanded' );
		navToggle.setAttribute(
			'aria-expanded',
			isExpanded ? 'true' : 'false'
		);

		// Track manual expansion state.
		if ( isExpanded ) {
			nav.setAttribute( 'data-manual-expanded', '' );
		} else {
			nav.removeAttribute( 'data-manual-expanded' );
		}
	} );

	// Handle smooth scrolling when clicking navigation links.
	nav.querySelectorAll( 'a' ).forEach( ( link ) => {
		link.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			const targetId = link.getAttribute( 'href' ).substring( 1 );
			const target = document.getElementById( targetId );
			if ( ! target ) {
				return;
			}

			// Calculate scroll position with offset.
			const offset =
				nav.offsetHeight +
				( dswpInPageNav?.options?.scroll_offset || 0 );

			// Smooth scroll to target.
			window.scrollTo( {
				top:
					target.getBoundingClientRect().top +
					window.scrollY -
					offset,
				behavior: 'smooth',
			} );

			// Update URL hash without triggering scroll.
			window.history.pushState( null, null, `#${ targetId }` );

			// Reset navigation state after clicking.
			nav.removeAttribute( 'data-manual-expanded' );
			nav.classList.remove( 'is-expanded' );
		} );
	} );

	// Throttle scroll event listener for better performance.
	let scrollTimeout;
	window.addEventListener( 'scroll', () => {
		if ( scrollTimeout ) {
			window.cancelAnimationFrame( scrollTimeout );
		}
		scrollTimeout = window.requestAnimationFrame( updateActiveLink );
	} );

	// Add keyboard accessibility for navigation toggle.
	navToggle.addEventListener( 'keydown', ( e ) => {
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			navToggle.click();
		}
	} );

	// Initialize navigation state.
	updateActiveLink();
} );
