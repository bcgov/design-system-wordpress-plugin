import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();
	
	return (
		<div {...blockProps}>
			<div className="dswp-block-breadcrumb__container"></div>
		</div>
	);
}
