import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { createElement, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import './styles.css';

// Function to create a valid HTML anchor from text
const createAnchorFromText = ( text ) => {
	if ( ! text ) {
		return '';
	}
	return text
		.toLowerCase()
		.trim()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /^-+|-+$/g, '' );
};

/**
 * Higher-order component that adds automatic anchor generation to heading blocks.
 *
 * This component:
 * - Monitors heading block content changes
 * - Automatically generates URL-friendly anchor IDs from heading text
 * - Respects the global auto-anchor setting from WordPress admin
 * - Cleans up auto-generated anchors when the feature is disabled
 *
 * @param {Function} BlockEdit - The original block edit component
 * @return {Function} Enhanced component with auto-anchor functionality
 */
const withAutoAnchor = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, attributes, setAttributes } = props;

		// Get the setting value from WordPress options
		const isEnabled = useSelect( ( select ) => {
			const settings = select( 'core' ).getEntityRecord(
				'root',
				'site',
				undefined
			);
			// Check if the option exists and is "1"
			return settings?.dswp_auto_anchor_enabled === '1';
		}, [] );

		useEffect( () => {
			if ( name === 'core/heading' ) {
				if ( isEnabled && attributes.content ) {
					// Generate new anchor when enabled
					const newAnchor = createAnchorFromText(
						attributes.content
					);
					if ( newAnchor !== attributes.anchor ) {
						setAttributes( {
							anchor: newAnchor,
							isAutoAnchor: true, // Track that this was auto-generated
						} );
					}
				} else if ( ! isEnabled && attributes.isAutoAnchor ) {
					// Clear auto-generated anchor when disabled
					setAttributes( {
						anchor: '',
						isAutoAnchor: false,
					} );
				}
			}
		}, [
			attributes.content,
			isEnabled,
			name,
			attributes.anchor,
			attributes.isAutoAnchor,
			setAttributes,
		] );

		return createElement( BlockEdit, props );
	};
}, 'withAutoAnchor' );

// Add the filter for the editor
addFilter( 'editor.BlockEdit', 'bcgov/auto-anchor', withAutoAnchor );
