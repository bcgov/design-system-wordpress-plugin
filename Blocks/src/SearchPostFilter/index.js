import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import './style.scss'; 

registerBlockType('design-system-wordpress-plugin/search-post-filter', {
    edit: Edit,
    save: () => null
});
