
export default function MobileMenuIcon() {
	return (
		<button
			className="dswp-nav-mobile-toggle-icon"
			aria-label="Toggle menu"
			aria-expanded="false"
		>
			<span className="dswp-nav-mobile-menu-icon-text">Menu</span>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				aria-hidden="true"
				focusable="false"
			>
				<path
					className="dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar"
					d="M3,6h13"
					strokeWidth="1"
					stroke="currentColor"
				/>
				<path
					className="dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar"
					d="M3,12h13"
					strokeWidth="1"
					stroke="currentColor"
				/>
				<path
					className="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar"
					d="M3,18h13"
					strokeWidth="1"
					stroke="currentColor"
				/>
			</svg>
		</button>
	);
}
