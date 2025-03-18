import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ButtonGroup, Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { dividerType = 'slash', currentAsLink = false } = attributes;
	
	const breadcrumbData = useSelect(select => {
		try {
			if (!select || !select('core/editor')) {
				return null;
			}

			const postId = select('core/editor').getCurrentPostId();
			const postType = select('core/editor').getCurrentPostType();
			
			if (!postId || !postType) {
				return null;
			}

			// Get current post
			const currentPost = select(coreStore).getEntityRecord('postType', postType, postId);
			if (!currentPost) {
				return null;
			}

			// Get immediate parent
			const parentPost = currentPost.parent ? 
				select(coreStore).getEntityRecord('postType', postType, currentPost.parent) : 
				null;

			// Get grandparent if parent exists
			const grandParentPost = parentPost?.parent ? 
				select(coreStore).getEntityRecord('postType', postType, parentPost.parent) : 
				null;

			return {
				current: {
					title: currentPost.title?.rendered || '',
					url: currentPost.link || ''
				},
				parent: parentPost ? {
					title: parentPost.title?.rendered || '',
					url: parentPost.link || ''
				} : null,
				grandParent: grandParentPost ? {
					title: grandParentPost.title?.rendered || '',
					url: grandParentPost.link || ''
				} : null
			};
		} catch (error) {
			console.error('Error fetching breadcrumb data:', error);
			return null;
		}
	}, []);

	useEffect(() => {
		if (breadcrumbData) {
			setAttributes({
				currentTitle: breadcrumbData.current.title,
				currentUrl: breadcrumbData.current.url,
				parentTitle: breadcrumbData.parent?.title || '',
				parentUrl: breadcrumbData.parent?.url || '',
				grandParentTitle: breadcrumbData.grandParent?.title || '',
				grandParentUrl: breadcrumbData.grandParent?.url || ''
			});
		}
	}, [breadcrumbData, setAttributes]);

	const getDivider = () => {
		switch (dividerType) {
			case 'chevron':
				return ' > ';
			case 'slash':
			default:
				return ' / ';
		}
	};

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
				<div className="dswp-block-breadcrumb__container">
					{/* Grandparent link */}
					{attributes.grandParentTitle && attributes.grandParentUrl && (
						<>
							<a href={attributes.grandParentUrl}>{attributes.grandParentTitle}</a>
							<span className="separator">{getDivider()}</span>
						</>
					)}
					
					{/* Parent link */}
					{attributes.parentTitle && attributes.parentUrl && (
						<>
							<a href={attributes.parentUrl}>{attributes.parentTitle}</a>
							<span className="separator">{getDivider()}</span>
						</>
					)}
					
					{/* Current page (as link or text based on setting) */}
					{attributes.currentTitle && (
						currentAsLink && attributes.currentUrl ? (
							<a href={attributes.currentUrl} className="current-page-link">
								{attributes.currentTitle}
							</a>
						) : (
							<span className="current-page">{attributes.currentTitle}</span>
						)
					)}
				</div>
			</div>
		</>
	);
}
