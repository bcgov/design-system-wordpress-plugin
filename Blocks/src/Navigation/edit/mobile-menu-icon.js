import { SVG, Rect } from "@wordpress/primitives";

export default function MobileMenuIcon({ icon }) {
	return (
		<div class="dswp-nav-mobile-toggle-icon">
			<SVG
				width="24"
				height="24"
				viewBox="0 0 24 24"
				aria-hidden="true"
				focusable="false"
			>
				<Rect
					className="dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar"
					x="4"
					y="7.5"
					width="16"
					height="1.5"
				/>
				<Rect
					className="dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar"
					x="4"
					y="15"
					width="16"
					height="1.5"
				/>
				{icon === "menu" && (
					<Rect
						className="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar"
						x="4"
						y="22.5"
						width="16"
						height="1.5"
					/>
				)}
			</SVG>
			{icon === "menu" && <span class="dswp-nav-mobile-menu-icon-text" style={{ marginLeft: "8px" }}>Menu</span>}
		</div>
	);
}