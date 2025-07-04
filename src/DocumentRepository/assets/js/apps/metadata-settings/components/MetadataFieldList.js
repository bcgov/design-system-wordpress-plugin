import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Metadata List Component
 *
 * Container component for displaying a list of metadata fields.
 *
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to render
 * @return {JSX.Element} Metadata list container
 */
const MetadataList = ( { children } ) => (
	<div className="metadata-fields-list">{ children }</div>
);

/**
 * Metadata Item Component
 *
 * Individual metadata field item with move controls.
 *
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to render
 * @return {JSX.Element} Metadata item with move controls
 */
const MetadataItem = ( { children } ) => (
	<div className="metadata-field-item">
		<div className="metadata-field-info">{ children }</div>
	</div>
);

/**
 * Field Type Options
 *
 * Available metadata field types and their display labels.
 *
 * @constant {Object} FIELD_TYPES
 */
const FIELD_TYPES = {
	text: __( 'Text', 'bcgov-design-system' ),
	date: __( 'Date', 'bcgov-design-system' ),
};

/**
 * Metadata Field List Component
 *
 * Displays a list of metadata fields with edit and delete actions.
 *
 * @param {Object}   props          - Component props
 * @param {Array}    props.fields   - Array of metadata fields
 * @param {Function} props.onEdit   - Callback when edit button is clicked
 * @param {Function} props.onDelete - Callback when delete button is clicked
 * @param {boolean}  props.isSaving - Whether a save operation is in progress
 * @return {JSX.Element} List of metadata fields
 */
const MetadataFieldList = ( { fields, onEdit, onDelete, isSaving } ) => {
	if ( fields.length === 0 ) {
		return (
			<div className="no-fields-message">
				<p>
					{ __(
						'No custom metadata fields defined yet. Click "Add New Field" to create one.',
						'bcgov-design-system'
					) }
				</p>
			</div>
		);
	}

	return (
		<MetadataList>
			{ fields.map( ( field, index ) => (
				<MetadataItem key={ field.id }>
					<div className="metadata-field-info">
						<h3>{ field.label }</h3>
						<p className="field-id">ID: { field.id }</p>
						<p className="field-type">
							Type: { FIELD_TYPES[ field.type ] }
						</p>
					</div>
					<div className="metadata-field-actions">
						<Button
							className="doc-repo-button edit-button"
							onClick={ () => onEdit( field, index ) }
						>
							{ __( 'Edit', 'bcgov-design-system' ) }
						</Button>
						<Button
							className="doc-repo-button delete-button"
							onClick={ () => onDelete( field ) }
							disabled={ isSaving }
						>
							{ __( 'Delete', 'bcgov-design-system' ) }
						</Button>
					</div>
				</MetadataItem>
			) ) }
		</MetadataList>
	);
};

export default MetadataFieldList;
