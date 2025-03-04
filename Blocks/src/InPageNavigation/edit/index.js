// import {
// 	PanelBody,
// 	SelectControl,
// 	Spinner,
// 	ButtonGroup,
// 	Button,
// 	RangeControl,
// } from '@wordpress/components';
// import { __ } from '@wordpress/i18n';
// import { useEffect, useRef, useCallback, useMemo } from '@wordpress/element';
// import { useDispatch, useSelect, useRegistry } from '@wordpress/data';
// import {
// 	store as blockEditorStore,
// 	useBlockProps,
// 	InspectorControls,
// 	useInnerBlocksProps,
// } from '@wordpress/block-editor';
// import { store as coreStore } from '@wordpress/core-data';
// import { createBlock, serialize, parse } from '@wordpress/blocks';
// import MobileMenuIcon from './mobile-menu-icon';

// const ALLOWED_BLOCKS = [
// 	'core/navigation-link',
// 	'core/navigation-submenu',
// 	'core/spacer',
// ];


export default function Edit( { attributes, setAttributes, clientId } ) {
	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Navigation Settings', 'dswp' ) }>
					
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<ul { ...innerBlocksProps } />
			</div>
		</>
	);
}
