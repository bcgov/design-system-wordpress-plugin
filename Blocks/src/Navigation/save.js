// import { InnerBlocks } from '@wordpress/block-editor';
// import OverlayMenuIcon from "./overlay-menu-icon"; // Import the OverlayMenuIcon component

// const Save = ({ attributes }) => {
//     const { hasIcon, icon } = attributes;

//     return (
//         <div
//             className="dswp-navigation-overlay-menu"
//             data-has-icon={hasIcon}
//             data-icon={icon}
//         >
//             <div className="dswp-navigation-overlay-menu-icon-container">
//                 {hasIcon && <OverlayMenuIcon icon={icon} />}
//             </div>

//             {/* Full-Screen Overlay for Frontend */}
//             <div className="fullscreen-overlay">
//                 <div className="overlay-content">
//                     <InnerBlocks.Content />
//                 </div>
//             </div>

//             <div className="dswp-navigation-overlay-menu-links">
//                 <InnerBlocks.Content />
//             </div>
//         </div>
//     );
// };

// export default Save;

import { InnerBlocks } from "@wordpress/block-editor";
import OverlayMenuIcon from "./edit/overlay-menu-icon"; // Import the OverlayMenuIcon component

const Save = ({ attributes }) => {
	const { hasIcon, icon } = attributes;

	return (
		<div
			className="dswp-navigation-overlay-menu"
			data-has-icon={hasIcon}
			data-icon={icon}
		>
			<OverlayMenuIcon icon={icon} />

			<div className="dswp-navigation-overlay-menu-links">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
