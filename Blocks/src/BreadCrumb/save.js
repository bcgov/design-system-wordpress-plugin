import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
	const { dividerType = 'slash', currentAsLink = false } = attributes;
	
	// Pass the settings as data attributes
	const blockProps = useBlockProps.save({
		'data-divider-type': dividerType,
		'data-current-as-link': currentAsLink.toString()
	});
	
	return (
		<div {...blockProps}>
			<div className="dswp-block-breadcrumb__container"></div>
		</div>
	);
}
