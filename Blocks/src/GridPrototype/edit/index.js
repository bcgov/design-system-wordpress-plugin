/**
 * WordPress Block Editor and Component Imports
 */
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';

/**
 * Inject dynamic CSS for mobile stacking based on breakpoint
 * CSS variables don't work in media queries, so we use a style tag
 */
function useDynamicBreakpoint( breakpoint, clientId ) {
	useEffect( () => {
		const styleId = `dswp-grid-breakpoint-${ clientId }`;
		let styleElement = document.getElementById( styleId );

		if ( ! styleElement ) {
			styleElement = document.createElement( 'style' );
			styleElement.id = styleId;
			document.head.appendChild( styleElement );
		}

		styleElement.textContent = `
			@media (max-width: ${ breakpoint }px) {
				.dswp-grid-prototype[data-breakpoint="${ breakpoint }"] .dswp-grid-prototype__container,
				.dswp-grid-prototype[data-breakpoint="${ breakpoint }"].dswp-grid-prototype--custom .dswp-grid-prototype__container {
					grid-template-columns: 1fr !important;
					grid-template-rows: auto !important;
				}
				.dswp-grid-prototype[data-breakpoint="${ breakpoint }"].dswp-grid-prototype--wordpress .dswp-grid-prototype__container > * {
					flex: 1 1 100% !important;
					max-width: 100%;
				}
			}
		`;

		return () => {
			// Cleanup on unmount
			const element = document.getElementById( styleId );
			if ( element ) {
				element.remove();
			}
		};
	}, [ breakpoint, clientId ] );
}

/**
 * Edit Component for Grid Prototype Block
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Current block attributes
 * @param {Function} props.setAttributes - Function to update block attributes
 * @param {string}   props.clientId      - Unique block identifier
 * @return {JSX.Element} Rendered edit interface for grid prototype block
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		rows = 1,
		columns = 1,
		gridType = 'custom',
		breakpoint = 768,
	} = attributes;

	// Calculate required number of cells
	const requiredCells = rows * columns;

	// Get select function to access blocks inside useEffect
	const { getBlocks } = useSelect( ( select ) => ( {
		getBlocks: select( blockEditorStore ).getBlocks,
	} ) );

	// Dispatch for replacing inner blocks
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );

	// Track previous required cell count to detect changes
	const previousRequiredCellsRef = useRef( null );

	/**
	 * Effect to automatically create/remove GridCell blocks based on rows/columns
	 */
	useEffect( () => {
		// Get current inner blocks
		const currentInnerBlocks = getBlocks( clientId );

		// Skip on initial mount if count matches
		if ( previousRequiredCellsRef.current === null ) {
			previousRequiredCellsRef.current = requiredCells;
			// On initial mount, ensure we have the right number of cells
			if ( currentInnerBlocks.length !== requiredCells ) {
				replaceInnerBlocks(
					clientId,
					generateCellBlocks( requiredCells, currentInnerBlocks ),
					false
				);
			}
			return;
		}

		// Only update if the required cell count has changed
		if ( previousRequiredCellsRef.current !== requiredCells ) {
			// Mark change as not persistent to avoid undo issues
			replaceInnerBlocks(
				clientId,
				generateCellBlocks( requiredCells, currentInnerBlocks ),
				false
			);
			previousRequiredCellsRef.current = requiredCells;
		}
	}, [ requiredCells, clientId, getBlocks, replaceInnerBlocks ] );

	/**
	 * Generate the required number of GridCell blocks
	 * Preserves existing cell content when possible
	 *
	 * @param {number} count        - Number of cells needed
	 * @param {Array}  existingBlocks - Current inner blocks
	 * @return {Array} Array of GridCell blocks
	 */
	function generateCellBlocks( count, existingBlocks ) {
		const cellBlocks = [];

		for ( let i = 0; i < count; i++ ) {
			// If we have an existing block at this position, preserve it
			if ( existingBlocks[ i ] ) {
				cellBlocks.push( existingBlocks[ i ] );
			} else {
				// Create a new empty GridCell block
				cellBlocks.push(
					createBlock( 'design-system-wordpress-plugin/grid-cell' )
				);
			}
		}

		return cellBlocks;
	}

	// Get block to check layout - WordPress stores layout in block settings, not always in attributes
	const block = useSelect( ( select ) => {
		return select( blockEditorStore ).getBlock( clientId );
	}, [ clientId ] );

	// Check if layout is constrained (default is constrained per block.json)
	// WordPress may store layout in attributes.layout or apply it via className
	const blockLayout = block?.attributes?.layout;
	const isConstrained = ! blockLayout || blockLayout?.type === 'constrained' || blockLayout?.type === undefined;

	// Generate block properties with dynamic classes
	// useBlockProps should automatically merge layout classes, but we ensure constrained layout is applied
	const baseClassName = `dswp-grid-prototype dswp-grid-prototype--${ gridType }`;
	// Inject dynamic CSS for breakpoint-based stacking
	useDynamicBreakpoint( breakpoint, clientId );

	const blockProps = useBlockProps( {
		className: baseClassName,
		style: {
			'--dswp-grid-rows': String( rows ),
			'--dswp-grid-columns': String( columns ),
		},
		'data-breakpoint': breakpoint, // Use data attribute for breakpoint selector
	} );

	// Manually add is-layout-constrained if WordPress didn't add it and layout is constrained
	// This ensures the block centers properly
	if ( isConstrained && ! blockProps.className?.includes( 'is-layout-constrained' ) ) {
		blockProps.className = `${ blockProps.className } is-layout-constrained`.trim();
	}

	// Generate grid template strings directly for editor
	const gridTemplateRows = `repeat(${ rows }, minmax(0, 1fr))`;
	const gridTemplateColumns = `repeat(${ columns }, minmax(0, 1fr))`;

	// Inner blocks configuration - only allow GridCell blocks, locked to prevent manual deletion
	// Don't set grid-template in inline styles - let CSS handle it so media queries can override
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dswp-grid-prototype__container',
			style: {
				display: 'grid',
				alignItems: 'start', // Align items to start for proper alignment
				maxWidth: 'none', // Remove max-width constraint so grid fills parent
				marginLeft: '0', // Remove auto margins
				marginRight: '0',
				paddingLeft: '0', // Remove global padding to prevent indent (outer block handles padding)
				paddingRight: '0',
			},
		},
		{
			allowedBlocks: [ 'design-system-wordpress-plugin/grid-cell' ],
			templateLock: 'all', // Lock to prevent manual deletion of cells
		}
	);

	return (
		<>
			{ /* Inspector Controls for Block Settings */ }
			<InspectorControls>
				<PanelBody title={ __( 'Grid Settings' ) }>
					<RangeControl
						label={ __( 'Rows' ) }
						value={ rows }
						onChange={ ( value ) =>
							setAttributes( { rows: value } )
						}
						min={ 1 }
						max={ 2 }
					/>

					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ ( value ) =>
							setAttributes( { columns: value } )
						}
						min={ 1 }
						max={ 2 }
					/>

					<RangeControl
						label={ __( 'Breakpoint (px)' ) }
						value={ breakpoint }
						onChange={ ( value ) =>
							setAttributes( { breakpoint: value } )
						}
						min={ 320 }
						max={ 1920 }
						step={ 10 }
						help={ __( 'Width at which cells stack vertically' ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Editor Preview Container */ }
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
