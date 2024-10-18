import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, RadioControl } from "@wordpress/components";
import { select } from '@wordpress/data';

export default function Edit({ attributes, setAttributes }) {
	const { showIcon, menuIcon } = attributes;

	const menus = select('core').getEntityRecords('taxonomy', 'nav_menu', {
        per_page: -1, // fetch all menus
    });
	
	const menuItems = select('core').getEntityRecords('postType', 'nav_menu_item', {
        menu: "194",
    });

	console.log('menuItems', menuItems)

	console.log('menus', menus)

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Settings", "mega-menu-nav-block")}>					
					<RadioControl
						label="Mobile Menu Icon"
						help="The type of the current user"
						selected={menuIcon}
						options={[
							{ label: "☰", value: "☰" },
							{ label: "Menu ☰", value: "Menu ☰" },
						]}
						onChange={(value) => setAttributes({ menuIcon: value })}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>{menuIcon}3eeeeethis is changed shawn truple</div>
		</>
	);
}