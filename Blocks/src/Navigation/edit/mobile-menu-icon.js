import { menu, drawerLeft, drawerRight, moreVertical } from '@wordpress/icons';

const ICON_MAP = {
    menu,
    'drawer-left': drawerLeft,
    'drawer-right': drawerRight,
    vertical: moreVertical,
};

export default function MobileMenuIcon({ icon, color }) {
    const IconComponent = ICON_MAP[icon] || ICON_MAP.menu;
    
    return (
        <button 
            className="mobile-menu-toggle"
            style={{ color }}
            aria-label="Toggle menu"
        >
            <IconComponent />
        </button>
    );
}