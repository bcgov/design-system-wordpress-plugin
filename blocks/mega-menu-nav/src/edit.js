import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import {
	PanelBody,
	RadioControl,
	MenuGroup,
	MenuItem,
} from "@wordpress/components";
import { getEntity } from "./utils";
import { useState } from "@wordpress/element";
import { parseNavLinks } from "./utils/parseNavLinks";

export default function Edit({ attributes, setAttributes }) {
	const { menuIcon } = attributes;

	const [navMenus, setNavMenus] = useState([]);
	const [openNavMenuSelector, setopenNavMenuSelector] = useState(false);
	const [currentNavMenu, setCurrentNavMenu] = useState([]);

	// Fetch nav menus and update state
	const handleFetchNavMenus = async () => {
		const menus = await getEntity("postType", "wp_navigation");
		setNavMenus(menus);
		setopenNavMenuSelector(!openNavMenuSelector);
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
				<PanelBody
					title={__("Navigation Menu", "choose-nav-menu")}
					opened={openNavMenuSelector}
					onToggle={handleFetchNavMenus}
				>
					<MenuGroup>
						{navMenus.map((menuItem) => {
							return (
								<MenuItem
									onClick={(event) => {
										const findSelectNav = navMenus.find(
											(item) => item.title.rendered === event.target.innerText
										);
										setCurrentNavMenu(parseNavLinks(findSelectNav.content.raw));
									}}
								>
									{menuItem.title.rendered}
								</MenuItem>
							);
						})}
					</MenuGroup>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>{menuIcon}</div>
		</>
	);
}
