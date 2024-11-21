import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import './style.css';
import './editor.css';

registerBlockType('your-plugin/navigation', {
    edit,
    save,
});


function register_design_system_navigation_block() {
    register_block_type(__DIR__ . '/src/Bcgov/DesignSystemPlugin/Blocks/Navigation/index.js');
}
add_action('init', 'register_design_system_navigation_block');