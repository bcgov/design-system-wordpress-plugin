// editor-sidebar.js
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel } from '@wordpress/editor';

/**
 * WordPress sidebar panel component for In-Page Navigation settings.
 * Allows users to toggle the visibility of in-page navigation menu for the current page.
 * 
 * @return {JSX.Element} The settings panel component with toggle control.
 */
function PageSettings() {
    const { showInPageNav } = useSelect(select => ({
        showInPageNav: select('core/editor').getEditedPostAttribute('meta')?.show_inpage_nav || false,
    }));

    const { editPost } = useDispatch('core/editor');

    return (
        <PluginDocumentSettingPanel
            name="inpage-nav-settings-panel"
            title={__('In-Page Navigation', 'dswp')}
            icon="menu"
        >
            <ToggleControl
                label={__('Enable In-Page Navigation', 'dswp')}
                help={__('Show automatic navigation menu on this page', 'dswp')}
                checked={showInPageNav}
                onChange={(value) => {
                    editPost({
                        meta: {
                            show_inpage_nav: value,
                        },
                    });
                }}
            />
        </PluginDocumentSettingPanel>
    );
}

registerPlugin('inpage-nav-settings', {
    render: PageSettings,
    icon: 'menu'
});