import { useInnerBlocksProps, useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	// const { overlayMenu, mobileBreakpoint } = attributes;

	const blockProps = useBlockProps.save();

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'dswp-block-in-page-navigation__container',
	} );

	return (
		<div { ...blockProps }>
			<ul { ...innerBlocksProps } />
		</div>
	);
}
