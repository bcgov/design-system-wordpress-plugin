import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
	useBlockEditingMode,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import OverlayMenuIcon from "./overlay-menu-icon"; // Import the OverlayMenuIcon component
import OverlayMenuPreview from "./overlay-menu-preview"; // Import the OverlayMenuPreview component
import NavigationInnerBlocks from "./inner-blocks";
import NavigationMenuSelector from "./navigation-menu-selector";
import MenuInspectorControls from "./menu-inspector-controls";
import useNavigationMenu from "../hooks/use-navigation-menu";
import {
	useCallback,
	useState,
	useEffect,
	useRef,
	Platform,
} from '@wordpress/element';

import { useDispatch, useSelect } from '@wordpress/data';

const Edit = (props) => {
	const { attributes, setAttributes, 	clientId} = props;
	const { hasIcon, icon } = attributes;
	const [isOverlayOpen, setOverlayOpen] = useState(false); // State to manage overlay visibility

	const blockProps = useBlockProps();
	const ref = attributes.ref;
	const setRef = useCallback(
		(postId) => {
			setAttributes({ ref: postId });
		},
		[setAttributes]
	);

	const {
		selectBlock,
	} = useDispatch( blockEditorStore );

	const blockEditingMode = useBlockEditingMode();

	const handleUpdateMenu = useCallback(
		( menuId, options = { focusNavigationBlock: false } ) => {
			const { focusNavigationBlock } = options;
			setRef( menuId );
			if ( focusNavigationBlock ) {
				selectBlock( clientId );
			}
		},
		[ selectBlock, clientId, setRef ]
	);

	const onSelectNavigationMenu = ( menuId ) => {
		handleUpdateMenu( menuId );
	};

	const {
		hasResolvedNavigationMenus,
		isNavigationMenuResolved,
		isNavigationMenuMissing,
		canUserUpdateNavigationMenu,
		hasResolvedCanUserUpdateNavigationMenu,
		canUserDeleteNavigationMenu,
		hasResolvedCanUserDeleteNavigationMenu,
		canUserCreateNavigationMenus,
		isResolvingCanUserCreateNavigationMenus,
		hasResolvedCanUserCreateNavigationMenus,
	} = useNavigationMenu(ref);

	// Function to open the overlay
	const openOverlay = () => {
		// setOverlayOpen(true);
	};

	// Function to close the overlay
	const closeOverlay = () => {
		setOverlayOpen(false);
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__("Menu Icon", "text-domain")} initialOpen={true}>
					{attributes && (
						<OverlayMenuPreview
							setAttributes={setAttributes}
							hasIcon={hasIcon}
							icon={icon}
						/>
					)}
				</PanelBody>
				<NavigationMenuSelector
					currentMenuId={9}
					onSelectClassicMenu={() => {}}
					onSelectNavigationMenu={() => {}}
					onCreateNew={() => {}}
					createNavigationMenuIsSuccess={() => {}}
					createNavigationMenuIsError={() => {}}
					actionLabel={"test"}
					isManageMenusButtonDisabled={false}
				/>
				<MenuInspectorControls
					clientId={"test"}
					createNavigationMenuIsSuccess={() => {}}
					createNavigationMenuIsError={() => {}}
					currentMenuId={9}
					isNavigationMenuMissing={false}
					isManageMenusButtonDisabled={false}
					onCreateNew={() => {}}
					onSelectClassicMenu={() => {}}
					onSelectNavigationMenu={onSelectNavigationMenu}
					isLoading={false}
					blockEditingMode={true}
				/>
			</InspectorControls>

			{/* Full-Screen Overlay for Editor */}
			{isOverlayOpen && (
				<div className="fullscreen-overlay">
					<div className="overlay-content">
						{/* Render InnerBlocks content */}
						<div className="dswp-navigation-overlay-menu">
							<InnerBlocks allowedBlocks={["core/navigation-link"]} />
						</div>
						<Button className="close-overlay" onClick={closeOverlay}>
							Close
						</Button>
					</div>
				</div>
			)}

			<nav className="dswp-navigation-overlay-menu">
				{hasIcon ? (
					<div
						className="dswp-navigation-overlay-menu-icon-container"
						onClick={openOverlay}
					>
						{hasIcon && <OverlayMenuIcon icon={icon} />}
					</div>
				) : (
					<NavigationInnerBlocks allowedBlocks={["core/navigation-link"]} />
				)}
			</nav>
		</div>
	);
};

export default Edit;
