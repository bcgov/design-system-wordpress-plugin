import { useEffect, useState, useCallback, useRef } from "react";
import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	InnerBlocks,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";
import OverlayMenuIcon from "../navigation/overlay-menu-icon"; // Import the OverlayMenuIcon component
import OverlayMenuPreview from "../navigation/overlay-menu-preview"; // Import the OverlayMenuPreview component

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const { hasIcon, icon } = attributes;

	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__("Menu Icon", "text-domain")} initialOpen={true}>
					<OverlayMenuPreview
						setAttributes={setAttributes}
						hasIcon={hasIcon}
						icon={icon}
					/>
				</PanelBody>
			</InspectorControls>

			{/* Main Overlay Menu Icon */}
			<div className="dswp-navigation-overlay-menu-icon-container">
				{hasIcon && <OverlayMenuIcon icon={icon} />}
			</div>
			<div className="dswp-navigation-overlay-menu ">
				<InnerBlocks allowedBlocks={["core/navigation-link"]} />
			</div>
		</div>
	);
};

export default Edit;