/**
 * DeleteFieldModal Component
 *
 * A modal component for confirming metadata field deletion.
 * Provides a warning message and field information before deletion.
 *
 * @param {Object}   props            - Component props
 * @param {boolean}  props.isOpen     - Whether the modal is open
 * @param {Function} props.onClose    - Callback to close the modal
 * @param {Function} props.onConfirm  - Callback to confirm deletion
 * @param {Object}   props.field      - The field to be deleted
 * @param {boolean}  props.isDeleting - Flag indicating if deletion is in progress
 * @return {JSX.Element|null} The modal component or null if not open or no field provided
 */

import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, warning } from '@wordpress/icons';

const DeleteFieldModal = ( {
	isOpen,
	onClose,
	onConfirm,
	field,
	isDeleting,
} ) => {
	// Return null if modal is not open or no field data provided
	if ( ! isOpen || ! field ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'Delete Metadata Field', 'bcgov-design-system' ) }
			onRequestClose={ onClose }
			className="metadata-field-modal"
		>
			{ /* Warning section with icon and message */ }
			<div className="document-delete-form">
				<div className="delete-warning">
					<div className="warning-icon">
						<Icon icon={ warning } />
					</div>
					<div className="warning-content">
						<strong>
							{ __(
								'This action cannot be undone',
								'bcgov-design-system'
							) }
						</strong>
						<p>
							{ __(
								'Deleting this field will permanently remove it and its values from all documents in the repository.',
								'bcgov-design-system'
							) }
						</p>
					</div>
				</div>

				{ /* Field information display */ }
				<div className="document-info">
					<h3>
						{ __( 'Field Information', 'bcgov-design-system' ) }
					</h3>
					<div className="info-grid">
						<div className="label">
							{ __( 'Field ID:', 'bcgov-design-system' ) }
						</div>
						<div className="value">{ field.id }</div>
						<div className="label">
							{ __( 'Label:', 'bcgov-design-system' ) }
						</div>
						<div className="value">{ field.label }</div>
						<div className="label">
							{ __( 'Type:', 'bcgov-design-system' ) }
						</div>
						<div className="value">{ field.type }</div>
					</div>
				</div>

				{ /* Action buttons */ }
				<div className="delete-actions">
					<Button
						onClick={ onClose }
						className="doc-repo-button cancel-button"
						disabled={ isDeleting }
					>
						{ __( 'Cancel', 'bcgov-design-system' ) }
					</Button>
					<Button
						onClick={ onConfirm }
						className="doc-repo-button delete-button"
						disabled={ isDeleting }
					>
						{ isDeleting
							? __( 'Deleting…', 'bcgov-design-system' )
							: __( 'Delete Field', 'bcgov-design-system' ) }
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteFieldModal;
