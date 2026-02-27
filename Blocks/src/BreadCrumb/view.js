/**
 * Breadcrumb Block Frontend JavaScript
 *
 * Handles desktop-only left/right arrow buttons to scroll the breadcrumb
 * when content overflows. Arrows are shown/hidden via CSS (desktop only).
 *
 * @since 1.0.0
 */

/* global ResizeObserver */

document.addEventListener( 'DOMContentLoaded', function () {
	const blocks = document.querySelectorAll(
		'.wp-block-design-system-wordpress-plugin-breadcrumb'
	);

	blocks.forEach( function ( block ) {
		const container = block.querySelector(
			'.dswp-block-breadcrumb__container'
		);
		const leftArrow = block.querySelector( '.dswp-breadcrumb-arrow--left' );
		const rightArrow = block.querySelector(
			'.dswp-breadcrumb-arrow--right'
		);

		if ( ! container || ! leftArrow || ! rightArrow ) {
			return;
		}

		const scrollAmount = 200;

		function updateArrowVisibility() {
			const { scrollLeft, scrollWidth, clientWidth } = container;
			const canScrollLeft = scrollLeft > 0;
			const canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

			leftArrow.classList.toggle( 'is-hidden', ! canScrollLeft );
			rightArrow.classList.toggle( 'is-hidden', ! canScrollRight );
			leftArrow.setAttribute( 'aria-hidden', ! canScrollLeft );
			rightArrow.setAttribute( 'aria-hidden', ! canScrollRight );
		}

		leftArrow.addEventListener( 'click', function () {
			container.scrollBy( { left: -scrollAmount, behavior: 'smooth' } );
		} );

		rightArrow.addEventListener( 'click', function () {
			container.scrollBy( { left: scrollAmount, behavior: 'smooth' } );
		} );

		container.addEventListener( 'scroll', updateArrowVisibility );

		// Initial state and on resize (overflow may change)
		const resizeObserver = new ResizeObserver( updateArrowVisibility );
		resizeObserver.observe( container );

		updateArrowVisibility();
	} );
} );
