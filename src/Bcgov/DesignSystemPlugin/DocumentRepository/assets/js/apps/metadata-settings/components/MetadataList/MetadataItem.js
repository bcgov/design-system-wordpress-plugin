/**
 * MetadataItem Component
 *
 * A component that renders an individual metadata field item with move up/down controls.
 * Provides a consistent layout for metadata field items and handles reordering functionality.
 *
 * @param {Object}      props            - Component props
 * @param {JSX.Element} props.children   - The content of the metadata field item
 * @param {Function}    props.onMoveUp   - Callback function to move the item up in the list
 * @param {Function}    props.onMoveDown - Callback function to move the item down in the list
 * @param {number}      props.index      - The current position of the item in the list
 * @param {number}      props.total      - The total number of items in the list
 * @return {JSX.Element} A div element containing the metadata field info and move controls
 *
 * @example
 * <MetadataItem
 *   onMoveUp={() => handleMoveUp(index)}
 *   onMoveDown={() => handleMoveDown(index)}
 *   index={0}
 *   total={3}
 * >
 *   <MetadataFieldContent />
 * </MetadataItem>
 */

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const MetadataItem = ( { children, onMoveUp, onMoveDown, index, total } ) => (
	<div className="metadata-field-item">
		{ /* Main content area for the metadata field */ }
		<div className="metadata-field-info">{ children }</div>

		{ /* Move controls - only show up/down buttons when applicable */ }
		<div className="metadata-field-move-actions">
			{ /* Show move up button if not the first item */ }
			{ index > 0 && (
				<Button
					variant="secondary"
					onClick={ onMoveUp }
					className="move-up"
					aria-label={ __( 'Move Up', 'bcgov-design-system' ) }
				>
					↑
				</Button>
			) }

			{ /* Show move down button if not the last item */ }
			{ index < total - 1 && (
				<Button
					variant="secondary"
					onClick={ onMoveDown }
					className="move-down"
					aria-label={ __( 'Move Down', 'bcgov-design-system' ) }
				>
					↓
				</Button>
			) }
		</div>
	</div>
);

export default MetadataItem;
