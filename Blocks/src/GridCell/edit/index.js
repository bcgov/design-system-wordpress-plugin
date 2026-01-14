/**
 * WordPress Block Editor Imports
 */
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Edit Component for Grid Cell Block
 *
 * @param {Object} props - Component properties
 * @return {JSX.Element} Rendered edit interface for grid cell block
 */
export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'dswp-grid-cell',
	} );

	// Inner blocks configuration - allow any blocks inside the cell
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'dswp-grid-cell__content' },
		{
			allowedBlocks: true,
			templateLock: false,
		}
	);

	return (
		<div { ...blockProps }>
			<div { ...innerBlocksProps } />
		</div>
	);
}

