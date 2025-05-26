import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import MobileMenuIcon from './edit/mobile-menu-icon';

export default function save( { attributes } ) {
	const { overlayMenu, mobileBreakpoint, showInDesktop, showInMobile } = attributes;

	const blockProps = useBlockProps.save( {
		className: `dswp-block-navigation-is-${ overlayMenu }-overlay`,
		'data-dswp-mobile-breakpoint': mobileBreakpoint,
		'data-show-in-desktop': showInDesktop,
		'data-show-in-mobile': showInMobile,
	} );

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'dswp-block-navigation__container',
	} );

	return (
		<nav { ...blockProps }>
			<MobileMenuIcon />
			<ul { ...innerBlocksProps } />
		</nav>
	);
}
