import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	
	return (
		<div {...blockProps}>
			<div className="dswp-block-breadcrumb__container">
				{/* Grandparent link */}
				{attributes.grandParentTitle && attributes.grandParentUrl && (
					<>
						<a href={attributes.grandParentUrl}>{attributes.grandParentTitle}</a>
						<span className="separator"> / </span>
					</>
				)}
				
				{/* Parent link */}
				{attributes.parentTitle && attributes.parentUrl && (
					<>
						<a href={attributes.parentUrl}>{attributes.parentTitle}</a>
						<span className="separator"> / </span>
					</>
				)}
				
				{/* Current page (no link) */}
				{attributes.currentTitle && (
					<span className="current-page">{attributes.currentTitle}</span>
				)}
			</div>
		</div>
	);
}
