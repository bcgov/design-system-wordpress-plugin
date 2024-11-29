import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Spinner, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { createBlock, serialize } from '@wordpress/blocks'; // Added serialize
import { parse } from '@wordpress/blocks';

export default function Edit({ attributes, setAttributes, clientId }) {
    const { menuId, overlayMenu } = attributes;
    const { replaceInnerBlocks } = useDispatch(blockEditorStore);
    // Add these dispatches
    const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);
    const blockProps = useBlockProps();

    // Add this selector to get current blocks
    const { currentBlocks } = useSelect((select) => ({
        currentBlocks: select(blockEditorStore).getBlocks(clientId),
    }), [clientId]);

    // Your existing menu selectors
    const { menus, hasResolvedMenus } = useSelect((select) => {
        const { getEntityRecords, hasFinishedResolution } = select(coreStore);
        const query = { 
            per_page: -1,
            status: ['publish', 'draft'],
        };
        
        return {
            menus: getEntityRecords('postType', 'wp_navigation', query),
            hasResolvedMenus: hasFinishedResolution('getEntityRecords', ['postType', 'wp_navigation', query]),
        };
    }, []);

    const { selectedMenu } = useSelect((select) => {
        if (!menuId) {
            return { selectedMenu: null };
        }

        const { getEditedEntityRecord } = select(coreStore);
        return {
            selectedMenu: getEditedEntityRecord('postType', 'wp_navigation', menuId),
        };
    }, [menuId]);

    // Add this new effect to handle block updates
    const handleBlocksUpdate = async (blocks) => {
        if (!menuId) return;

        try {
            const serializedBlocks = serialize(blocks);
            await editEntityRecord('postType', 'wp_navigation', menuId, {
                content: serializedBlocks
            });
            await saveEditedEntityRecord('postType', 'wp_navigation', menuId);
        } catch (error) {
            console.error('Failed to update navigation menu:', error);
        }
    };
	useEffect(() => {
        if (menuId && currentBlocks) {
            const timeoutId = setTimeout(() => {
                handleBlocksUpdate(currentBlocks);
            }, 1000); // Wait 1 second after changes before saving

            return () => clearTimeout(timeoutId);
        }
    }, [currentBlocks, menuId]);

    // Your existing effect for loading menu content
    useEffect(() => {
        if (!selectedMenu || !selectedMenu.content) {
            replaceInnerBlocks(clientId, []);
            return;
        }

        const parsedBlocks = parse(selectedMenu.content);
        const processBlocks = (blocks) => {
            return blocks.map(block => {
                if (block.name === 'core/navigation-link') {
                    return createBlock('core/navigation-link', {
                        label: block.attributes.label,
                        url: block.attributes.url,
                        type: block.attributes.type,
                        id: block.attributes.id,
                        kind: block.attributes.kind,
                        opensInNewTab: block.attributes.opensInNewTab || false,
                    });
                }
                
                if (block.name === 'core/navigation-submenu') {
                    return createBlock(
                        'core/navigation-submenu',
                        {
                            label: block.attributes.label,
                            url: block.attributes.url,
                            type: block.attributes.type,
                            id: block.attributes.id,
                            kind: block.attributes.kind,
                            opensInNewTab: block.attributes.opensInNewTab || false,
                        },
                        block.innerBlocks ? processBlocks(block.innerBlocks) : []
                    );
                }
                
                return null;
            }).filter(Boolean);
        };

        const newBlocks = processBlocks(parsedBlocks);
        replaceInnerBlocks(clientId, newBlocks);
    }, [selectedMenu]);

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'wp-block-navigation__container' },
        {
            allowedBlocks: ['core/navigation-link', 'core/navigation-submenu'],
            orientation: 'horizontal',
            templateLock: false,
        }
    );

    // Rest of your component (handleMenuSelect, return statement, etc.)
    const handleMenuSelect = (value) => {
        const newMenuId = parseInt(value);
        setAttributes({ menuId: newMenuId });
    };

    if (!hasResolvedMenus) {
        return <Spinner />;
    }

    const menuOptions = [
        { label: __('Select a menu'), value: 0 },
        ...(menus || []).map((menu) => ({
            label: menu.title.rendered || __('(no title)'),
            value: menu.id,
        })),
    ];

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Navigation Settings')}>
                    <SelectControl
                        label={__('Select Menu')}
                        value={menuId || 0}
                        options={menuOptions}
                        onChange={handleMenuSelect}
                    />
                    <SelectControl
                        label={__('Overlay Menu')}
                        value={overlayMenu}
                        options={[
                            { label: __('Mobile'), value: 'mobile' },
                            { label: __('Always'), value: 'always' },
                            { label: __('Never'), value: 'never' },
                        ]}
                        onChange={(value) => setAttributes({ overlayMenu: value })}
                    />
                </PanelBody>
            </InspectorControls>
            
            <nav {...blockProps}>
                <div {...innerBlocksProps} />
            </nav>
        </>
    );
}