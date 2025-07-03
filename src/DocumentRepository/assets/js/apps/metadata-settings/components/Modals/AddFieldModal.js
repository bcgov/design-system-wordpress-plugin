/**
 * AddFieldModal Component
 *
 * A modal component for adding new metadata fields to the document repository.
 * Provides a form interface for configuring field properties including ID, label,
 * type, and options (for select fields).
 *
 * @param {Object}   props                 - Component props
 * @param {boolean}  props.isOpen          - Whether the modal is open
 * @param {Function} props.onClose         - Callback to close the modal
 * @param {Object}   props.field           - Current field data
 * @param {Function} props.onFieldChange   - Callback for field property changes
 * @param {Function} props.onOptionsChange - Callback for options text changes
 * @param {Function} props.onSave          - Callback to save the new field
 * @param {Object}   [props.errors={}]     - Validation errors for the form
 * @return {JSX.Element|null} The modal component or null if not open
 *
 * @example
 * <AddFieldModal
 *   isOpen={true}
 *   onClose={() => setModalOpen(false)}
 *   field={fieldData}
 *   onFieldChange={(key, value) => updateField(key, value)}
 *   onOptionsChange={(value) => updateOptions(value)}
 *   onSave={() => saveField()}
 *   errors={validationErrors}
 * />
 */

import {
	Modal,
	TextControl,
	SelectControl,
	TextareaControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FIELD_TYPES } from '../../constants/fieldTypes';

const AddFieldModal = ( {
	isOpen,
	onClose,
	field,
	onFieldChange,
	onOptionsChange,
	onSave,
	errors = {},
} ) => {
	// Return null if modal is not open
	if ( ! isOpen ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Add Metadata Field', 'bcgov-design-system' ) }
			onRequestClose={ onClose }
			className="metadata-field-modal"
		>
			{ /* Field ID input */ }
			<TextControl
				label={ __( 'Field ID', 'bcgov-design-system' ) }
				value={ field.id }
				onChange={ ( value ) => onFieldChange( 'id', value ) }
				help={ __(
					'A unique identifier for the field',
					'bcgov-design-system'
				) }
				error={ errors.id }
			/>

			{ /* Field Label input */ }
			<TextControl
				label={ __( 'Field Label', 'bcgov-design-system' ) }
				value={ field.label }
				onChange={ ( value ) => onFieldChange( 'label', value ) }
				help={ __( 'The label shown to users', 'bcgov-design-system' ) }
				error={ errors.label }
			/>

			{ /* Field Type selection */ }
			<SelectControl
				label={ __( 'Field Type', 'bcgov-design-system' ) }
				value={ field.type }
				options={ Object.entries( FIELD_TYPES ).map(
					( [ value, label ] ) => ( { value, label } )
				) }
				onChange={ ( value ) => onFieldChange( 'type', value ) }
			/>

			{ /* Options input (only shown for taxonomy fields) */ }
			{ field.type === 'taxonomy' && (
				<TextareaControl
					label={ __( 'Taxonomy Terms', 'bcgov-design-system' ) }
					value={ field._rawOptionsText }
					onChange={ onOptionsChange }
					help={ __(
						'Enter one taxonomy term per line. These will become the available options for this taxonomy.',
						'bcgov-design-system'
					) }
					error={ errors.options }
				/>
			) }

			{ /* Modal action buttons */ }
			<div className="modal-actions">
				<Button
					onClick={ onSave }
					className="doc-repo-button save-button"
				>
					{ __( 'Add Field', 'bcgov-design-system' ) }
				</Button>
				<Button
					onClick={ onClose }
					className="doc-repo-button cancel-button"
				>
					{ __( 'Cancel', 'bcgov-design-system' ) }
				</Button>
			</div>
		</Modal>
	);
};

export default AddFieldModal;
