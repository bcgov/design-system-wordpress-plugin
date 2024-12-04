import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import MobileMenuIcon from "./edit/mobile-menu-icon";

export default function save({ attributes }) {
	const { overlayMenu, mobileIconStyle, mobileBreakpoint = 768 } = attributes;

	const blockProps = useBlockProps.save({
		className: `wp-block-navigation-is-${overlayMenu}-overlay`,
		style: {
			"--mobile-breakpoint": mobileBreakpoint, // Remove the px unit
		},
	});

	const innerBlocksProps = useInnerBlocksProps.save({
		className: "wp-block-navigation__container",
	});

	return (
		<nav {...blockProps}>
			<MobileMenuIcon />
			<div {...innerBlocksProps} />
		</nav>
	);
}
