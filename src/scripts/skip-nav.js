document.addEventListener( 'DOMContentLoaded', () => {
	// Select the skip navigation link
	const skipNavLink = document.querySelector(
		'a.dswp-skip-nav[href="#main-navigation"]'
	);
	// Check if the link exists
	if ( skipNavLink ) {
		// Add click event listener
		skipNavLink.addEventListener( 'click', ( event ) => {
			// Prevent the default anchor behavior
			event.preventDefault();
			// Optionally, scroll smoothly to the main navigation
			const mainNav = document.querySelector(
				'#main-navigation > button'
			);
			if ( mainNav ) {
				// Check if the button is visible (not display: none)
				const style = window.getComputedStyle( mainNav );
				if ( style.display !== 'none' ) {
					mainNav.click(); // Click the button if it's visible
				} else {
					// Find the first link with the specified class
					const firstNavLink = document.querySelector(
						'#main-navigation .wp-block-navigation-item__content'
					);
					if ( firstNavLink ) {
						firstNavLink.focus(); // Focus on the first link with the class
					}
				}
			}
		} );
	}
} );
