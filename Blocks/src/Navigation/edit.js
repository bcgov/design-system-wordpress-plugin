import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from "@wordpress/block-editor";
import { PanelBody } from "@wordpress/components";
import OverlayMenuIcon from "./overlay-menu-icon"; // Import the OverlayMenuIcon component
import OverlayMenuPreview from "./overlay-menu-preview"; // Import the OverlayMenuPreview component
import ResponsiveWrapper from "./responsive-wrapper";
import NavigationInnerBlocks from "./inner-blocks";

const Edit = (props) => {
	console.log("made it");

	const { attributes, setAttributes } = props;
	const { hasIcon, icon } = attributes;
	console.log("attributes", attributes);

	const blockProps = useBlockProps();
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

			<ResponsiveWrapper
				id={"testnavigation"}//!change this before PR
				onToggle={()=>{}}
				hasIcon={hasIcon}
				icon={icon}
				isOpen={true}
				isResponsive={true}
				isHiddenByDefault={false}
				overlayBackgroundColor={"white"}
				overlayTextColor={"black"}
			>
				<NavigationInnerBlocks />
			</ResponsiveWrapper>
		</div>
	);
};

export default Edit;
