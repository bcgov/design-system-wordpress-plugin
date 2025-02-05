import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import MobileMenuIcon from './edit/mobile-menu-icon';

export default function save( { attributes } ) {
	const { overlayMenu, mobileBreakpoint } = attributes;

	const blockProps = useBlockProps.save( {
		className: `dswp-block-navigation-is-${ overlayMenu }-overlay`,
		'data-dswp-mobile-breakpoint': mobileBreakpoint,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'dswp-block-navigation__container',
	} );

	return (
		<nav { ...blockProps }>
			<MobileMenuIcon />
			<div { ...innerBlocksProps } />
		</nav>
	);
}
