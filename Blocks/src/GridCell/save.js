import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save( {
		className: 'dswp-grid-cell',
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'dswp-grid-cell__content',
	} );

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}

