import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	SelectControl,
	Spinner,
	ButtonGroup,
	Button,
	RangeControl
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useEffect, useRef } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as coreStore } from "@wordpress/core-data";
import { createBlock, serialize } from "@wordpress/blocks"; // Added serialize
import { parse } from "@wordpress/blocks";
import MobileMenuIcon from "./mobile-menu-icon";

export default function Edit({ attributes, setAttributes, clientId }) {
	const {
		menuId,
		overlayMenu,
		isMobile,
		mobileBreakpoint = 768
	} = attributes;
	const { replaceInnerBlocks } = useDispatch(blockEditorStore);
	// Add these dispatches
	const { editEntityRecord, saveEditedEntityRecord } = useDispatch(coreStore);
	const blockProps = useBlockProps({
		className: `dswp-block-navigation-is-${overlayMenu}-overlay`,
		style: {
			'--mobile-breakpoint': mobileBreakpoint
		}
	});

	// Add this selector near your other useSelect calls
	const { canUserEditNavigation } = useSelect(
		(select) => {
			const { canUser } = select(coreStore);
			return {
				canUserEditNavigation: canUser("update", "navigation", menuId),
			};
		},
		[menuId]
	);

	

	// Your existing menu selectors
	const { menus, hasResolvedMenus } = useSelect((select) => {
		const { getEntityRecords, hasFinishedResolution } = select(coreStore);
		const query = {
			per_page: -1,
			status: ["publish", "draft"],
		};

		return {
			menus: getEntityRecords("postType", "wp_navigation", query),
			hasResolvedMenus: hasFinishedResolution("getEntityRecords", [
				"postType",
				"wp_navigation",
				query,
			]),
		};
	}, []);

	const { selectedMenu } = useSelect(
		(select) => {
			if (!menuId) {
				return { selectedMenu: null };
			}

			const { getEditedEntityRecord } = select(coreStore);
			return {
				selectedMenu: getEditedEntityRecord(
					"postType",
					"wp_navigation",
					menuId
				),
			};
		},
		[menuId]
	);

	// Add this to handle block updates
	const handleBlockUpdate = (nextBlocks) => {
		if (!menuId) return;
		
		try {
			const serializedContent = serialize(nextBlocks);
			editEntityRecord("postType", "wp_navigation", menuId, {
				content: serializedContent,
				status: "publish"
			});
		} catch (error) {
			console.error("Failed to update navigation menu:", error);
		}
	};

	const innerBlocksProps = useInnerBlocksProps(
		{ className: "dswp-block-navigation__container" },
		{
			allowedBlocks: ["core/navigation-link", "core/navigation-submenu"],
			orientation: "horizontal",
			templateLock: false,
			onChange: handleBlockUpdate
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
		{ label: __("Select a menu"), value: 0 },
		...(menus || []).map((menu) => ({
			label: menu.title.rendered || __("(no title)"),
			value: menu.id,
		})),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Navigation Settings")}>
					<SelectControl
						label={__("Select Menu")}
						value={menuId || 0}
						options={menuOptions}
						onChange={handleMenuSelect}
					/>
					<ButtonGroup>
						<Button
							variant={overlayMenu === "mobile" ? "primary" : "secondary"}
							onClick={() =>
								setAttributes({
									overlayMenu: "mobile",
									isMobile: "inMobileMode",
								})
							}
						>
							{__("Mobile")}
						</Button>
						<Button
							variant={overlayMenu === "always" ? "primary" : "secondary"}
							onClick={() =>
								setAttributes({ overlayMenu: "always", isMobile: "always" })
							}
						>
							{__("Always")}
						</Button>
						<Button
							variant={overlayMenu === "never" ? "primary" : "secondary"}
							onClick={() =>
								setAttributes({ overlayMenu: "never", isMobile: "never" })
							}
						>
							{__("Never")}
						</Button>
					</ButtonGroup>
					{overlayMenu === "mobile" && (
						<RangeControl
							label={__('Mobile Breakpoint (px)', 'your-text-domain')}
							value={mobileBreakpoint}
							onChange={(value) => setAttributes({ mobileBreakpoint: value })}
							min={320}
							max={1200}
							step={1}
						/>
					)}
				</PanelBody>
			</InspectorControls>

			<nav {...blockProps}>
				{overlayMenu === "always" ? (
					<>
						<MobileMenuIcon />
						<div {...innerBlocksProps} style={{ display: 'none' }} />
					</>
				) : (
					<div {...innerBlocksProps} />
				)}
			</nav>
		</>
	);
}
