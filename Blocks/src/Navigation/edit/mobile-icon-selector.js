import { __ } from '@wordpress/i18n';
import { 
    Button,
    ButtonGroup,
    ColorPicker,
    Dropdown,
    PanelRow
} from '@wordpress/components';
import { menu, drawerLeft, drawerRight, moreVertical } from '@wordpress/icons';

const DEFAULT_ICONS = [
    { name: 'menu', icon: menu, label: __('Hamburger') },
    { name: 'drawer-left', icon: drawerLeft, label: __('Drawer Left') },
    { name: 'drawer-right', icon: drawerRight, label: __('Drawer Right') },
    { name: 'vertical', icon: moreVertical, label: __('Vertical Dots') },
];

export default function MobileIconSelector({ 
    icon, 
    hasCustomIcon, 
    iconColor,
    onChange 
}) {
    return (
        <>
            <PanelRow>
                <label>{__('Menu Icon')}</label>
                <ButtonGroup>
                    {DEFAULT_ICONS.map((defaultIcon) => (
                        <Button
                            key={defaultIcon.name}
                            icon={defaultIcon.icon}
                            isPressed={icon === defaultIcon.name}
                            onClick={() => onChange({
                                icon: defaultIcon.name,
                                hasCustomIcon: false
                            })}
                            label={defaultIcon.label}
                        />
                    ))}
                </ButtonGroup>
            </PanelRow>
            
            <PanelRow>
                <label>{__('Icon Color')}</label>
                <Dropdown
                    renderToggle={({ isOpen, onToggle }) => (
                        <Button
                            onClick={onToggle}
                            aria-expanded={isOpen}
                            style={{
                                backgroundColor: iconColor,
                                width: '30px',
                                height: '30px',
                            }}
                        />
                    )}
                    renderContent={() => (
                        <ColorPicker
                            color={iconColor}
                            onChange={(color) => onChange({ iconColor: color })}
                        />
                    )}
                />
            </PanelRow>
        </>
    );
}