/**
 * WordPress Dependencies
 * Imports necessary WordPress block registration and related functions
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal Dependencies
 * Imports the Edit component, Save component, block metadata, and styles
 */
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

/**
 * Register Grid Prototype Block
 *
 * @description Registers a custom Gutenberg block for grid layout prototyping
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
	 * Returns the saved block content
	 */
	save: Save,
} );

