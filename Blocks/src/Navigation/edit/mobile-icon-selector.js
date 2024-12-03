import {
    ButtonGroup,
    Button,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import MobileMenuIcon from "./mobile-menu-icon";

export default function MobileIconSelector({ setAttributes, mobileIconStyle }) {
    return (
        <div className="dswp-mobile-icon-selector">
            <p className="components-base-control__label">
                {__('Mobile Menu Icon Style', 'your-text-domain')}
            </p>
            <ButtonGroup>
                <Button
                    variant={mobileIconStyle === "twobar" ? "primary" : "secondary"}
                    onClick={() => setAttributes({ mobileIconStyle: "twobar" })}
                >
                    {<MobileMenuIcon mobileIconStyle="twobar" />}
                </Button>
                <Button
                    variant={mobileIconStyle === "threebar" ? "primary" : "secondary"}
                    onClick={() => setAttributes({ mobileIconStyle: "threebar" })}
                >
                    <MobileMenuIcon mobileIconStyle="threebar" />
                    <span className="dswp-nav-mobile-menu-icon-text">
                        {__('Menu', 'your-text-domain')}
                    </span>
                </Button>
            </ButtonGroup>
        </div>
    );
}