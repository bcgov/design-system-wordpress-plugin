import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editSiteStore } from '@wordpress/edit-site';
import { store as editorStore } from '@wordpress/editor';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ButtonGroup, Button, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	const { dividerType = 'slash', currentAsLink = false } = attributes;

	// Get the current page and its ancestors
	useSelect(select => {
		// Try to get context from site editor first (for template parts)
		const siteEditor = select(editSiteStore);
		const editor = select(editorStore);
		const core = select(coreStore);

		let postId, postType;

		// Check if we're in the site editor (template part)
		if (siteEditor) {
			const templateContext = siteEditor.getEditedPostContext();
			if (templateContext) {
				postId = templateContext.postId;
				postType = templateContext.postType;
			}
		}
		// Fallback to post editor context
		else if (editor) {
			postId = editor.getCurrentPostId();
			postType = editor.getCurrentPostType();
		}

		if (!postId || !postType) return;

		const currentPost = core.getEntityRecord('postType', postType, postId);

		if (currentPost) {
			// Set current page data
			setAttributes({
				currentTitle: currentPost.title?.rendered || '',
				currentUrl: currentPost.link || '',
				currentId: currentPost.id
			});

			// If there's a parent, get its data
			if (currentPost.parent) {
				const parentPost = core.getEntityRecord('postType', postType, currentPost.parent);
				if (parentPost) {
					setAttributes({
						parentTitle: parentPost.title?.rendered || '',
						parentUrl: parentPost.link || '',
						parentId: parentPost.id
					});

					// If there's a grandparent, get its data
					if (parentPost.parent) {
						const grandParentPost = core.getEntityRecord('postType', postType, parentPost.parent);
						if (grandParentPost) {
							setAttributes({
								grandParentTitle: grandParentPost.title?.rendered || '',
								grandParentUrl: grandParentPost.link || '',
								grandParentId: grandParentPost.id
							});
						}
					}
				}
			}
		}
	}, []);

	// Show preview message in template editor
	const isTemplateEditor = useSelect(select => !!select(editSiteStore), []);
	
	if (isTemplateEditor) {
		return (
			<div {...blockProps}>
				<div className="dswp-block-breadcrumb__container dswp-template-preview">
					<em>{__('Breadcrumb - Will display page hierarchy on the frontend')}</em>
				</div>
			</div>
		);
	}

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
					{attributes.grandParentTitle && attributes.grandParentUrl && (
						<>
							<a href={attributes.grandParentUrl}>{attributes.grandParentTitle}</a>
							<span className="separator">{dividerType === 'chevron' ? ' > ' : ' / '}</span>
						</>
					)}
					
					{attributes.parentTitle && attributes.parentUrl && (
						<>
							<a href={attributes.parentUrl}>{attributes.parentTitle}</a>
							<span className="separator">{dividerType === 'chevron' ? ' > ' : ' / '}</span>
						</>
					)}
					
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

