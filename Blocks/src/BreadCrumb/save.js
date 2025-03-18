import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	const { dividerType, currentAsLink } = attributes;

	return (
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
	);
}
