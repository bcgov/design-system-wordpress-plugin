import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const blockProps = useBlockProps.save();
	
	return (
		<div {...blockProps}>
			<div className="dswp-block-breadcrumb__container">
				{attributes.parentTitle && attributes.parentUrl && (
					<a href={attributes.parentUrl}>{attributes.parentTitle}</a>
				)}
			</div>
		</div>
	);
}
