import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { registerPlugin } from '@wordpress/plugins';

const InPageNavPanel = () => {
    const { showInPageNav } = useSelect(select => ({
        showInPageNav: select('core/editor').getEditedPostAttribute('meta')?.show_inpage_nav
    }));

    const { editPost } = useDispatch('core/editor');

    return (
        <PluginDocumentSettingPanel
            name="in-page-nav-panel"
            title="In-page Navigation"
            opened={true}
        >
            <ToggleControl
                label="Enable in-page navigation"
                checked={showInPageNav}
                onChange={(value) => {
                    editPost({ meta: { show_inpage_nav: value } });
                }}
            />
        </PluginDocumentSettingPanel>
    );
};

registerPlugin('dswp-in-page-nav-panel', {
    render: InPageNavPanel,
    icon: 'list-view'
}); 