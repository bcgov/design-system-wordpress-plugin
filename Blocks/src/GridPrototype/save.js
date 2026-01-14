import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { rows, columns, gridType, breakpoint, layout } = attributes;

	// Generate grid template strings directly
	const gridTemplateRows = `repeat(${ rows }, minmax(0, 1fr))`;
	const gridTemplateColumns = `repeat(${ columns }, minmax(0, 1fr))`;

	// Check if layout is constrained (default is constrained per block.json)
	const isConstrained = ! layout || layout?.type === 'constrained' || layout?.type === undefined;

	// useBlockProps.save should automatically merge layout classes
	const baseClassName = `dswp-grid-prototype dswp-grid-prototype--${ gridType }`;
	const blockProps = useBlockProps.save( {
		className: baseClassName,
		style: {
			'--dswp-grid-rows': String( rows ),
			'--dswp-grid-columns': String( columns ),
		},
		'data-breakpoint': breakpoint, // Use data attribute for breakpoint since CSS vars don't work in media queries
	} );

	// Manually add is-layout-constrained if WordPress didn't add it and layout is constrained
	// This ensures the block centers properly on the frontend
	if ( isConstrained && ! blockProps.className?.includes( 'is-layout-constrained' ) ) {
		blockProps.className = `${ blockProps.className } is-layout-constrained`.trim();
	}

	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'dswp-grid-prototype__container',
		style: {
			display: 'grid',
			// Don't set grid-template in inline styles - let CSS handle it so media queries can override
			alignItems: 'start', // Align items to start for proper alignment
			maxWidth: 'none', // Remove max-width constraint so grid fills parent
			marginLeft: '0', // Remove auto margins
			marginRight: '0',
			paddingLeft: '0', // Remove global padding to prevent indent (outer block handles padding)
			paddingRight: '0',
		},
	} );

	return (
		<>
			{/* Inject dynamic CSS for breakpoint-based stacking on frontend */}
			{/* Use a unique ID to avoid duplicate style tags if multiple blocks exist */}
			<style
				dangerouslySetInnerHTML={ {
					__html: `
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
					`,
				} }
			/>
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
