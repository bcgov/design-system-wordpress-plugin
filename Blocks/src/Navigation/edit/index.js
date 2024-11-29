import { useBlockProps, InspectorControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Spinner, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { createBlock } from '@wordpress/blocks';
import { parse } from '@wordpress/blocks'; // Correct import
export default function Edit({ attributes, setAttributes, clientId }) {
    const { menuId, overlayMenu } = attributes;
    const { replaceInnerBlocks } = useDispatch(blockEditorStore);
    const blockProps = useBlockProps();

    // Get available menus
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

    // Get selected menu content
    const { selectedMenu } = useSelect((select) => { 
			
        if (!menuId){
			return { selectedMenu: null };
		}

        const { getEditedEntityRecord } = select(coreStore);
        return {
            selectedMenu: getEditedEntityRecord('postType', 'wp_navigation', menuId),
        };
    }, [menuId]);

    const innerBlocksProps = useInnerBlocksProps(
        { className: 'wp-block-navigation__container' },
        {
            allowedBlocks: ['core/navigation-link', 'core/navigation-submenu'],
            orientation: 'horizontal',
            templateLock: false,
        }
    );

	useEffect(() => {
		// Clear blocks if no menu is selected or if selected menu has no content
		if (!selectedMenu || !selectedMenu.content) {
			replaceInnerBlocks(clientId, []);
			return;
		}
	
		console.log('Selected Menu Content:', selectedMenu.content);
		
		// Parse the content string into blocks
		const parsedBlocks = parse(selectedMenu.content);
	
		// Convert parsed blocks into new blocks
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
	}, [selectedMenu, clientId]);
    // Handle menu selection
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