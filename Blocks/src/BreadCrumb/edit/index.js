/**
 * WordPress Block Editor and Component Imports
 * Importing necessary components for block editing interface
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
// Import block metadata
import metadata from '../block.json';

/**
 * Edit Component for Breadcrumb Block
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Current block attributes
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Rendered edit interface for breadcrumb block
 */
export default function Edit( { attributes, setAttributes } ) {
	// Destructure attributes with default values
	const { currentAsLink = false } = attributes;

	// Generate block properties with editor preview class
	const blockProps = useBlockProps( {
		className: 'is-editor-preview',
	} );

	return (
		<>
			{ /* Inspector Controls for Block Settings */ }
			<InspectorControls>
				<PanelBody title={ __( 'Breadcrumb Settings' ) }>
					<Notice
						className="dswp-block-setting-warning"
						status="warning"
						isDismissible={ false }
					>
						{ __(
							'This block is limited to page hierarchies. Post type support upcoming.'
						) }
					</Notice>

					{ /* Current Page Link Toggle */ }
					<div className="dswp-current-page-as-link">
						<p className="dswp-block-setting-label">
							{ __( 'Current Page as Link' ) }
						</p>
						<ToggleControl
							help={
								currentAsLink
									? 'Current page is shown as a link'
									: 'Current page is shown as text'
							}
							checked={ currentAsLink }
							onChange={ ( value ) =>
								setAttributes( { currentAsLink: value } )
							}
						/>
					</div>
				</PanelBody>
				<div className="dswp-block-version">
					{ __( 'Block Version:' ) } { metadata.version }
				</div>
			</InspectorControls>

			{ /* Editor Preview Container */ }
			<div { ...blockProps }>
				<div className="dswp-block-breadcrumb__container is-editor">
					<div className="dswp-breadcrumb-placeholder">
						Grandparent / Parent / Child
					</div>
				</div>
			</div>
		</>
	);
}
