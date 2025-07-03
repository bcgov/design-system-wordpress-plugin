import {
	TextControl,
	SelectControl,
	TextareaControl,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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
	taxonomy: __( 'Taxonomy', 'bcgov-design-system' ),
};

/**
 * Metadata Field Form Component
 *
 * Form for adding or editing metadata fields.
 *
 * @param {Object}   props                 - Component props
 * @param {Object}   props.field           - Field data
 * @param {Object}   props.errors          - Validation errors
 * @param {Function} props.onChange        - Callback when field values change
 * @param {Function} props.onOptionsChange - Callback when options change
 * @param {boolean}  props.isEdit          - Whether this is an edit form
 * @return {JSX.Element} Metadata field form
 */
const MetadataFieldForm = ( {
	field,
	errors,
	onChange,
	onOptionsChange,
	isEdit = false,
} ) => {
	// Format options array to string for textarea
	const formatOptionsToString = ( fieldValue ) => {
		if ( fieldValue._rawOptionsText !== undefined ) {
			return fieldValue._rawOptionsText;
		}
		return Array.isArray( fieldValue.options )
			? fieldValue.options.join( '\n' )
			: '';
	};

	return (
		<div className="metadata-field-form">
			{ errors?.submit && (
				<Notice status="error" isDismissible={ false }>
					<p>{ errors.submit }</p>
				</Notice>
			) }

			<TextControl
				label={ __( 'Field Label', 'bcgov-design-system' ) }
				help={ __(
					'Display name for the field',
					'bcgov-design-system'
				) }
				value={ field.label }
				onChange={ ( label ) => onChange( 'label', label ) }
				required
				className={ errors?.label ? 'has-error' : '' }
			/>
			{ errors?.label && (
				<div className="field-error">{ errors.label }</div>
			) }

			{ isEdit ? (
				<div className="field-type-display">
					<label htmlFor="edit-field-type-value">
						{ __( 'Field Type', 'bcgov-design-system' ) }
					</label>
					<div
						id="edit-field-type-value"
						className="field-type-value"
					>
						{ FIELD_TYPES[ field.type ] }
					</div>
				</div>
			) : (
				<SelectControl
					label={ __( 'Field Type', 'bcgov-design-system' ) }
					value={ field.type }
					options={ Object.entries( FIELD_TYPES ).map(
						( [ value, typeLabel ] ) => ( {
							value,
							label: typeLabel,
						} )
					) }
					onChange={ ( type ) => onChange( 'type', type ) }
				/>
			) }

			{ field.type === 'taxonomy' && (
				<TextareaControl
					label={ __( 'Taxonomy Terms', 'bcgov-design-system' ) }
					value={ formatOptionsToString( field ) }
					onChange={ onOptionsChange }
					help={ __(
						'Enter one taxonomy term per line. These will become the available options for this taxonomy.',
						'bcgov-design-system'
					) }
				/>
			) }
		</div>
	);
};

export default MetadataFieldForm;
