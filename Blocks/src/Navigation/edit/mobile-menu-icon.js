import { SVG, Rect } from "@wordpress/primitives";

export default function MobileMenuIcon({ mobileIconStyle, isSelected }) {

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            outline: isSelected ? '2px solid var(--wp-admin-theme-color)' : 'none',
            padding: '8px'
        }}>
            <SVG
                width="24"
                height="24"
                viewBox="0 3 24 24"
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
                {mobileIconStyle === "threebar" && (
                    <Rect
                        className="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar"
                        x="4"
                        y="22.5"
                        width="16"
                        height="1.5"
                    />
                )}
            </SVG>            
        </div>
    );
}

