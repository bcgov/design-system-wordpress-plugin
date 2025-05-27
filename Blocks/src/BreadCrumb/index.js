/**
 * WordPress Dependencies
 * Imports necessary WordPress block registration and related functions
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal Dependencies
 * Imports the Edit component, block metadata, and styles
 */
import Edit from './edit';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

/**
 * Register Breadcrumb Block
 *
 * @description Registers a custom Gutenberg block for displaying breadcrumb navigation
 * @param {string} metadata.name      - The block's unique identifier
 * @param {Object} blockConfiguration - Configuration object for the block
 */
registerBlockType( metadata.name, {
	/**
	 * Edit Component
	 * Renders the block's interface in the WordPress block editor
	 */
	edit: Edit,

	/**
	 * Save Method
	 * Returns null as the block's content is rendered dynamically via PHP
	 * @return {null} This block is dynamic and does not save content to the post content.
	 */
	save: () => null,
} );
