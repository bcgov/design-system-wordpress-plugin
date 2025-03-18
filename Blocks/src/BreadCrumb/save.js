import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	const { dividerType = 'slash' } = attributes;

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
				
				{/* Current page (no link) */}
				{attributes.currentTitle && (
					<span className="current-page">{attributes.currentTitle}</span>
				)}
			</div>
		</div>
	);
}
