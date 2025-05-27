/**
 * WordPress Block Registration Dependencies
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-blocks/#registerblocktype
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal Block Dependencies
 * Import the block's edit component for the editor interface
 */
import Edit from './edit';

/**
 * Register Search Block
 *
 * Registers a custom search block with WordPress's block system.
 * This block uses dynamic rendering, meaning the frontend output
 * is handled by PHP (render.php) rather than JavaScript.
 *
 * Block Features:
 * - Custom search form interface
 * - Integrates with WordPress's native search functionality
 * - Server-side rendering for better SEO and performance
 *
 * @see /render.php for frontend output
 */
registerBlockType( 'design-system-wordpress-plugin/search', {
	/**
	 * Edit Component
	 * Provides the editor interface for the block
	 */
	edit: Edit,

	/**
	 * Save Component
	 * Returns null as we're using dynamic (PHP) rendering
	 * @return {null} No static markup is saved
	 */
	save: () => null,
} );
