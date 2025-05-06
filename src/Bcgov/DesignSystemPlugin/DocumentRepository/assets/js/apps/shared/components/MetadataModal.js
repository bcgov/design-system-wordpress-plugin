import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useCallback } from '@wordpress/element';

/**
 * Shared metadata modal component used across the application
 *
 * @param {Object}          props                     Component props
 * @param {string}          props.title               Modal title
 * @param {boolean}         props.isOpen              Whether the modal is open
 * @param {Function}        props.onClose             Callback when modal is closed
 * @param {Function}        props.onSave              Callback when save button is clicked
 * @param {boolean}         props.isSaving            Whether save operation is in progress
 * @param {boolean}         props.isDisabled          Whether save button should be disabled
 * @param {string}          props.saveButtonText      Custom text for the save button
 * @param {string}          props.saveButtonClassName Custom class name for the save button
 * @param {React.ReactNode} props.children            Modal content
 * @return {JSX.Element} Modal component
 */
const MetadataModal = ( {
	title,
	isOpen,
	onClose,
	onSave,
	isSaving = false,
	isDisabled = false,
	saveButtonText,
	saveButtonClassName = 'doc-repo-button save-button',
	children,
} ) => {
	if ( ! isOpen ) {
		return null;
	}

	// Create a safe handler for closing the modal that prevents event bubbling
	const handleClose = useCallback(
		( e ) => {
			// Stop propagation to prevent the event from bubbling up
			if ( e ) {
				e.preventDefault();
				e.stopPropagation();
			}

			// Call the onClose callback
			onClose();
		},
		[ onClose ]
	);

	// Create a safe handler for form submission
	const handleSubmit = useCallback(
		( e ) => {
			e.preventDefault();
			e.stopPropagation();
			onSave();
		},
		[ onSave ]
	);

	return (
		<Modal
			title={ title }
			onRequestClose={ handleClose }
			className="metadata-edit-modal"
			shouldCloseOnClickOutside={ true }
			shouldCloseOnEsc={ true }
		>
			<form onSubmit={ handleSubmit } className="metadata-edit-form">
				{ children }

				<div className="modal-actions">
					<Button
						onClick={ handleClose }
						disabled={ isSaving }
						className="doc-repo-button cancel-button"
					>
						{ __( 'Cancel', 'bcgov-design-system' ) }
					</Button>
					<Button
						type="submit"
						isBusy={ isSaving }
						disabled={ isSaving || isDisabled }
						className={ saveButtonClassName }
					>
						{ saveButtonText ||
							__( 'Save Changes', 'bcgov-design-system' ) }
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default MetadataModal;
