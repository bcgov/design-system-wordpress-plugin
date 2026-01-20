export default function MobileMenuIcon( { isOpen, onClick, isVisible } ) {
	if ( ! isVisible ) {
		return null;
	}

	const topBarClassName = [
		'dswp-nav-mobile-bar',
		'dswp-nav-mobile-menu-top-bar',
		isOpen && 'dswp-nav-mobile-menu-top-bar-open',
	]
		.filter( Boolean )
		.join( ' ' );

	const middleBarClassName = [
		'dswp-nav-mobile-bar',
		'dswp-nav-mobile-menu-middle-bar',
		isOpen && 'dswp-nav-mobile-menu-middle-bar-open',
	]
		.filter( Boolean )
		.join( ' ' );

	const bottomBarClassName = [
		'dswp-nav-mobile-bar',
		'dswp-nav-mobile-menu-bottom-bar',
		isOpen && 'dswp-nav-mobile-menu-bottom-bar-open',
	]
		.filter( Boolean )
		.join( ' ' );

	return (
		<button
			className="dswp-nav-mobile-toggle-icon"
			aria-label="Toggle menu"
			aria-expanded={ isOpen }
			onClick={ onClick }
			type="button"
		>
			<span className="dswp-nav-mobile-menu-icon-text">
				{ isOpen ? 'Close' : 'Menu' }
			</span>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				aria-hidden="true"
				focusable="false"
			>
				<path
					className={ topBarClassName }
					d="M3,6h13"
					strokeWidth="1"
					stroke="currentColor"
				/>
				<path
					className={ middleBarClassName }
					d="M3,12h13"
					strokeWidth="1"
					stroke="currentColor"
				/>
				<path
					className={ bottomBarClassName }
					d="M3,18h13"
					strokeWidth="1"
					stroke="currentColor"
				/>
			</svg>
		</button>
	);
}
