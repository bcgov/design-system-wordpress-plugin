/**
 * WordPress Block Editor and Component Imports
 * Importing necessary components for block editing interface
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
// Import block metadata
import metadata from '../block.json';

/**
 * Edit Component for Breadcrumb Block
 *
 * @return {JSX.Element} Rendered edit interface for breadcrumb block
 */
export default function Edit() {
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
				</PanelBody>
				<div className="dswp-block-version">
					{ __( 'Block Version:' ) } { metadata.version }
				</div>
			</InspectorControls>

			{ /* Editor Preview Container */ }
			<div { ...blockProps }>
				<div className="dswp-block-breadcrumb__container is-editor">
					<div className="dswp-breadcrumb-placeholder">
						Home / Parent / Child
					</div>
				</div>
			</div>
		</>
	);
}
