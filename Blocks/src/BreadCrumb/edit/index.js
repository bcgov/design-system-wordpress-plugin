/**
 * WordPress Block Editor and Component Imports
 * Importing necessary components for block editing interface
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ButtonGroup,
	Button,
	ToggleControl,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo, useCallback, Fragment } from '@wordpress/element';
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
	const { dividerType = 'slash', currentAsLink = false } = attributes;

	// Generate block properties with editor preview class
	const blockProps = useBlockProps( {
		className: 'is-editor-preview',
	} );

	/**
	 * Memoized example hierarchy to prevent unnecessary re-renders
	 * Provides a static example of breadcrumb navigation
	 */
	const exampleHierarchy = useMemo(
		() => [ 'Grandparent', 'Parent', 'Child' ],
		[]
	);

	/**
	 * Memoized Separator Component
	 * Renders different separator icons based on selected divider type
	 * @return {JSX.Element} Separator icon
	 */
	const Separator = useCallback(
		() => (
			<span className="dswp-breadcrumb-separator">
				{ dividerType === 'slash' ? (
					<span className="dashicons dashicons-minus dswp-forward-slash"></span>
				) : (
					<span className="dashicons dashicons-arrow-right-alt2"></span>
				) }
			</span>
		),
		[ dividerType ]
	);

	/**
	 * Memoized Example Display
	 * Generates a preview of breadcrumb navigation in the editor
	 * Dynamically renders separators and titles based on current settings
	 */
	const dividerExampleDisplay = useMemo(
		() => (
			<div className="dswp-breadcrumb-example">
				{ exampleHierarchy.map( ( title, index ) => (
					<Fragment key={ index }>
						{ index > 0 && <Separator /> }
						<span>{ title }</span>
					</Fragment>
				) ) }
			</div>
		),
		[ exampleHierarchy, Separator ]
	);

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
					{ /* Divider Type Selector */ }
					<div className="dswp-divider-selector">
						<p className="dswp-block-setting-label">
							{ __( 'Divider Type' ) }
						</p>
						<ButtonGroup>
							{ [ 'slash', 'chevron' ].map( ( type ) => (
								<Button
									key={ type }
									variant={
										dividerType === type
											? 'primary'
											: 'secondary'
									}
									onClick={ () =>
										setAttributes( { dividerType: type } )
									}
									isPressed={ dividerType === type }
								>
									<span
										className={ `dashicons ${
											type === 'slash'
												? 'dashicons-minus dswp-forward-slash'
												: 'dashicons-arrow-right-alt2'
										}` }
									/>
								</Button>
							) ) }
						</ButtonGroup>
					</div>

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
						{ dividerExampleDisplay }
					</div>
				</div>
			</div>
		</>
	);
}
