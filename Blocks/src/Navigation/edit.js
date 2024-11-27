import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import OverlayMenuIcon from "./overlay-menu-icon"; // Import the OverlayMenuIcon component
import OverlayMenuPreview from "./overlay-menu-preview"; // Import the OverlayMenuPreview component
import { useState } from "@wordpress/element"; // Import useState for managing state

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const { hasIcon, icon } = attributes;
	const [isOverlayOpen, setOverlayOpen] = useState(false); // State to manage overlay visibility

	const blockProps = useBlockProps();

	// Function to open the overlay
	const openOverlay = () => {
		setOverlayOpen(true);
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
			</InspectorControls>

			<div
				className="dswp-navigation-overlay-menu-icon-container"
				onClick={openOverlay}
			>
				{hasIcon && <OverlayMenuIcon icon={icon} />}
			</div>

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

			<div className="dswp-navigation-overlay-menu">
				<InnerBlocks allowedBlocks={["core/navigation-link"]} />
			</div>
		</div>
	);
};

export default Edit;
