import { __ } from "@wordpress/i18n";
import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { PanelBody, Radio } from "@wordpress/components";

export default function Edit({ attributes, setAttributes }) {
	const {showIcon, menuIcon} = attributes
	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Settings", "mega-menu-nav-block")}>
					<RadioGroup label="Width" onChange={ (value) => setAttributes({ menuIcon: value }) } checked={ menuIcon }>
						<Radio value="☰">☰</Radio>
						<Radio value="⋮">⋮</Radio>
						<Radio value="MENU ☰">MENU ☰</Radio>
					</RadioGroup>
				</PanelBody>
			</InspectorControls>
			<div {...useBlockProps()}>{menuIcon}3eeeee</div>
		</>
	);
}
