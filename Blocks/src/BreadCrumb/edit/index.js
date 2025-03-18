import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ButtonGroup, Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
	const { dividerType = 'slash', currentAsLink = false } = attributes;
	const blockProps = useBlockProps({
		className: 'is-editor-preview'
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Breadcrumb Settings')}>
					<div className="dswp-divider-selector">
						<p className="dswp-divider-label">{__('Divider Type')}</p>
						<ButtonGroup>
							<Button 
								variant={dividerType === 'slash' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ dividerType: 'slash' })}
								isPressed={dividerType === 'slash'}
							>
								/
							</Button>
							<Button 
								variant={dividerType === 'chevron' ? 'primary' : 'secondary'}
								onClick={() => setAttributes({ dividerType: 'chevron' })}
								isPressed={dividerType === 'chevron'}
							>
								&gt;
							</Button>
						</ButtonGroup>
					</div>
					
					<ToggleControl
						label={__('Current Page as Link')}
						help={currentAsLink ? 'Current page is shown as a link' : 'Current page is shown as text'}
						checked={currentAsLink}
						onChange={(value) => setAttributes({ currentAsLink: value })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="dswp-block-breadcrumb__container is-editor">
					<div className="dswp-breadcrumb-placeholder">
						<em>{__('Breadcrumb Navigation - Will display page hierarchy on frontend')}</em>
					</div>
				</div>
			</div>
		</>
	);
}

