/**
 * WordPress In-Page Navigation Editor Panel
 *
 * Adds a settings panel to the WordPress editor sidebar that allows
 * enabling/disabling in-page navigation for individual pages.
 *
 * @requires @wordpress/editor
 * @requires @wordpress/components
 * @requires @wordpress/data
 * @requires @wordpress/plugins
 */

// Import WordPress dependencies
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

/**
 * In-Page Navigation Settings Panel Component
 *
 * Renders a toggle control in the editor sidebar for enabling/disabling
 * in-page navigation on the current page settings panel.
 *
 * @component
 * @return {JSX.Element} Settings panel with toggle control
 */
const InPageNavPanel = () => {
	// Get current in-page navigation state from post meta
	const { showInPageNav } = useSelect( ( select ) => ( {
		showInPageNav:
			select( 'core/editor' ).getEditedPostAttribute( 'meta' )
				?.show_inpage_nav,
	} ) );

	// Get dispatch function for updating post meta
	const { editPost } = useDispatch( 'core/editor' );

	return (
		<PluginDocumentSettingPanel
			name="in-page-nav-panel"
			title="In-page Navigation"
			opened={ true }
		>
			<ToggleControl
				label="Enable in-page navigation"
				checked={ showInPageNav }
				onChange={ ( value ) => {
					editPost( { meta: { show_inpage_nav: value } } );
				} }
			/>
		</PluginDocumentSettingPanel>
	);
};

// Register the plugin with WordPress
registerPlugin( 'dswp-in-page-nav-panel', {
	render: InPageNavPanel,
	icon: 'list-view',
} );
