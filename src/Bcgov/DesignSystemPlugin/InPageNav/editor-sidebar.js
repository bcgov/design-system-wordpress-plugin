// editor-sidebar.js
import { ToggleControl } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';
import { useEffect } from '@wordpress/element';
import { createRoot } from '@wordpress/element';

function InPageNavSettings() {
    const { showInPageNav } = useSelect(select => ({
        showInPageNav: select('core/editor').getEditedPostAttribute('meta')?.show_inpage_nav || false,
    }));

    const { editPost } = useDispatch('core/editor');

    useEffect(() => {
        const editorWrapper = document.querySelector('.block-editor-writing-flow');
        if (editorWrapper) {
            const toggleContainer = document.createElement('div');
            toggleContainer.className = 'inpage-nav-toggle-wrapper';
            toggleContainer.style.cssText = `
                padding: 16px;
                margin: 20px auto;
                background: #fff;
                border: 1px solid #e2e4e7;
                border-radius: 2px;
                max-width: 840px;
            `;
            
            editorWrapper.insertBefore(toggleContainer, editorWrapper.firstChild);

            // Create a root and render the toggle
            const root = createRoot(toggleContainer);
            root.render(
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
            );

            // Cleanup function
            return () => {
                root.unmount();
                toggleContainer.remove();
            };
        }
    }, [showInPageNav]);

    return null;
}

registerPlugin('inpage-nav-settings', {
    render: InPageNavSettings,
});