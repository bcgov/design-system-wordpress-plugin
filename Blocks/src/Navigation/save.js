import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { overlayMenu, mobileIconStyle, mobileBreakpoint = 768 } = attributes;
    
    const blockProps = useBlockProps.save({
        className: `wp-block-navigation-is-${overlayMenu}-overlay`,
        style: {
            '--mobile-breakpoint': mobileBreakpoint // Remove the px unit
        }
    });
    
    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'wp-block-navigation__container',
    });

    const mobileToggleButton = (
        <button 
            className="dswp-nav-mobile-toggle-icon"
            aria-label="Toggle menu"
            aria-expanded="false"
        >
            <svg
                width="24"
                height="24"
                viewBox="0 3 24 24"
                aria-hidden="true"
                focusable="false"
            >
                <rect
                    className="dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar"
                    x="4"
                    y="7.5"
                    width="16"
                    height="1.5"
                />
                <rect
                    className="dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar"
                    x="4"
                    y="15"
                    width="16"
                    height="1.5"
                />
                {mobileIconStyle === "threebar" && (
                    <rect
                        className="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar"
                        x="4"
                        y="22.5"
                        width="16"
                        height="1.5"
                    />
                )}
            </svg>
            <span className="dswp-nav-mobile-menu-icon-text">Menu</span>
        </button>
    );

    return (
        <nav {...blockProps}>
            {mobileToggleButton}
            <div {...innerBlocksProps} />
        </nav>
    );
}