/**
 * EditFieldModal Component
 *
 * A modal component for editing existing metadata fields in the document repository.
 * Provides a form interface for modifying field properties including ID, label,
 * type, and options (for select fields). Similar to AddFieldModal but pre-populated
 * with existing field data.
 *
 * @param {Object}   props                 - Component props
 * @param {boolean}  props.isOpen          - Whether the modal is open
 * @param {Function} props.onClose         - Callback to close the modal
 * @param {Object}   props.field           - Current field data to edit
 * @param {Function} props.onFieldChange   - Callback for field property changes
 * @param {Function} props.onOptionsChange - Callback for options text changes
 * @param {Function} props.onSave          - Callback to save the field changes
 * @param {Object}   [props.errors={}]     - Validation errors for the form
 * @return {JSX.Element|null} The modal component or null if not open or no field provided
 *
 * @example
 * <EditFieldModal
 *   isOpen={true}
 *   onClose={() => setModalOpen(false)}
 *   field={existingFieldData}
 *   onFieldChange={(key, value) => updateField(key, value)}
 *   onOptionsChange={(value) => updateOptions(value)}
 *   onSave={() => saveChanges()}
 *   errors={validationErrors}
 * />
 */

import {
	Modal,
	TextControl,
	TextareaControl,
	Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FIELD_TYPES } from '../../constants/fieldTypes';

const EditFieldModal = ( {
	isOpen,
	onClose,
	field,
	onFieldChange,
	onOptionsChange,
	onSave,
	errors = {},
} ) => {
	// Return null if modal is not open or no field data provided
	if ( ! isOpen || ! field ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Edit Metadata Field', 'bcgov-design-system' ) }
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

			{ /* Field Type display */ }
			<div className="field-type-display">
				<label htmlFor="field-type-value">
					{ __( 'Field Type', 'bcgov-design-system' ) }
				</label>
				<div id="field-type-value" className="field-type-value">
					{ FIELD_TYPES[ field.type ] || field.type }
				</div>
				<p className="help-text">
					{ __(
						'Field type cannot be changed after creation',
						'bcgov-design-system'
					) }
				</p>
			</div>

			{ /* Options input (only shown for taxonomy fields) */ }
			{ field.type === 'taxonomy' && (
				<TextareaControl
					label={ __( 'Taxonomy Terms', 'bcgov-design-system' ) }
					value={ field._rawOptionsText }
					onChange={ onOptionsChange }
					help={ __(
						'Enter one taxonomy term per line. These will modify the available options for this taxonomy.',
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
					{ __( 'Save Changes', 'bcgov-design-system' ) }
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

export default EditFieldModal;
