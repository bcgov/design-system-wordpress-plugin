import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import './style.scss';
import './editor.scss';

registerBlockType('design-system-wordpress-plugin/in-page-navigation', {
	edit: Edit,
	save,
} );
