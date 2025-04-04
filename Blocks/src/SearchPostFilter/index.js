/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import './style.scss'; 

/**
 * Register the Search Post Filter block
 * 
 * This block allows users to filter search results by post type.
 * It uses dynamic rendering on the PHP side, so the save function
 * returns null while the frontend is handled by render.php.
 */
registerBlockType('design-system-wordpress-plugin/search-post-filter', {
    edit: Edit,
    save: () => null
});
