import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	RadioControl,
	MenuGroup,
	MenuItem,
} from "@wordpress/components";
import { getEntity } from "./utils";
import { useState, useEffect } from "@wordpress/element";
import { createBlock } from "@wordpress/blocks"; 

export default function Edit({ attributes, setAttributes }) {
	const { menuIcon } = attributes;

	const [navMenus, setNavMenus] = useState([]);
	const [openNavMenuSelector, setopenNavMenuSelector] = useState(false)

	// Fetch nav menus and update state
	const handleFetchNavMenus = async () => {
		const menus = await getEntity("postType", "wp_navigation");
		setNavMenus(menus);
		setopenNavMenuSelector(!openNavMenuSelector)
		console.log('menus', menus)
	};


		// Parse the navigation links and create blocks
		const parseNavigationLinks = (content) => {
			// Assuming content.raw is a string of HTML
			const parser = new DOMParser();
			const doc = parser.parseFromString(content, 'text/html');
			const links = Array.from(doc.querySelectorAll('li.wp-block-navigation-item'));
	
			const blocks = links.map(link => {
				const anchor = link.querySelector('a');
				const label = anchor.querySelector('span').textContent;
				const url = anchor.href;
	
				return createBlock('core/navigation-link', {
					label: label,
					url: url,
				});
			});
	
			setNavigationBlocks(blocks);
		};
	

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
				<PanelBody title={__("Navigation Menu", "choose-nav-menu")} opened={openNavMenuSelector} onToggle={handleFetchNavMenus}>
					<MenuGroup>
						{navMenus.map((menuItem) => {
							return <MenuItem>{menuItem.title.rendered}</MenuItem>;
						})}
					</MenuGroup>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>{menuIcon}</div>
		</>
	);
}
