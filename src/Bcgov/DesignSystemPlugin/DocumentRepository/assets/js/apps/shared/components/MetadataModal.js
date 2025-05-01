import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Shared metadata modal component used across the application
 * 
 * @param {Object} props Component props
 * @param {string} props.title Modal title
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Callback when modal is closed
 * @param {Function} props.onSave Callback when save button is clicked
 * @param {boolean} props.isSaving Whether save operation is in progress
 * @param {boolean} props.isDisabled Whether save button should be disabled
 * @param {React.ReactNode} props.children Modal content
 * @returns {JSX.Element} Modal component
 */
const MetadataModal = ({
    title,
    isOpen,
    onClose,
    onSave,
    isSaving = false,
    isDisabled = false,
    children
}) => {
    if (!isOpen) return null;

    return (
        <Modal
            title={title}
            onRequestClose={onClose}
            className="metadata-edit-modal"
        >
            <form onSubmit={(e) => {
                e.preventDefault();
                onSave();
            }} className="metadata-edit-form">
                {children}

                <div className="modal-actions">
                    <Button
                        onClick={onClose}
                        disabled={isSaving}
                        className="doc-repo-button cancel-button"
                    >
                        {__('Cancel', 'bcgov-design-system')}
                    </Button>
                    <Button
                        type="submit"
                        isBusy={isSaving}
                        disabled={isSaving || isDisabled}
                        className="doc-repo-button save-button"
                    >
                        {__('Save Changes', 'bcgov-design-system')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MetadataModal; 