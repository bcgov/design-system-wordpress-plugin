/**
 * useVirtualization Hook
 *
 * A custom hook that handles virtualization logic for rendering large lists efficiently.
 * It calculates which items should be visible in the viewport based on scroll position.
 */

import { useState, useRef, useEffect, useCallback } from '@wordpress/element';

/**
 * useVirtualization Hook
 *
 * @param {Object} options               Virtualization options
 * @param {number} options.itemHeight    Height of each item in pixels
 * @param {number} options.itemCount     Total number of items
 * @param {number} options.overscan      Number of extra items to render above/below viewport
 * @param {number} options.initialHeight Initial container height in pixels
 * @return {Object} Virtualization state and handlers
 */
const useVirtualization = ( {
	itemHeight = 60,
	itemCount = 0,
	overscan = 5,
	initialHeight = 500,
} ) => {
	const containerRef = useRef( null );
	const [ visibleRange, setVisibleRange ] = useState( {
		start: 0,
		end: Math.min( 20, itemCount ),
	} );
	const [ containerHeight, setContainerHeight ] = useState( initialHeight );

	// Calculate which items should be visible based on scroll position
	const calculateVisibleRange = useCallback( () => {
		if ( ! containerRef.current ) {
			return;
		}

		const container = containerRef.current;
		const scrollTop = container.scrollTop;
		const viewportHeight = container.clientHeight;

		// Calculate visible item indices
		let startIndex = Math.floor( scrollTop / itemHeight );
		startIndex = Math.max( 0, startIndex - overscan );

		let endIndex = Math.ceil( ( scrollTop + viewportHeight ) / itemHeight );
		endIndex = Math.min( itemCount, endIndex + overscan );

		setVisibleRange( { start: startIndex, end: endIndex } );
	}, [ itemCount, itemHeight, overscan ] );

	// Define handleScroll using useCallback to maintain referential equality
	const handleScroll = useCallback( () => {
		calculateVisibleRange();
	}, [ calculateVisibleRange ] );

	// Initialize and handle resize
	useEffect( () => {
		const container = containerRef.current;
		if ( ! container ) {
			return;
		}

		// Set initial container height
		setContainerHeight( container.clientHeight );

		// Calculate initial visible range
		calculateVisibleRange();

		// Add scroll event listener
		container.addEventListener( 'scroll', handleScroll );

		// Handle window resize
		const handleResize = () => {
			if ( container ) {
				setContainerHeight( container.clientHeight );
				calculateVisibleRange();
			}
		};

		window.addEventListener( 'resize', handleResize );

		// Cleanup
		return () => {
			container.removeEventListener( 'scroll', handleScroll );
			window.removeEventListener( 'resize', handleResize );
		};
	}, [ calculateVisibleRange, handleScroll ] );

	// Update visible range when itemCount changes
	useEffect( () => {
		calculateVisibleRange();
	}, [ itemCount, calculateVisibleRange ] );

	// Calculate total height of all items for the scroll container
	const totalHeight = itemCount * itemHeight;

	// Calculate top offset for the visible items
	const topOffset = visibleRange.start * itemHeight;

	return {
		containerRef,
		visibleRange,
		containerHeight,
		totalHeight,
		topOffset,
		handleScroll,
		calculateVisibleRange,
	};
};

export default useVirtualization;
