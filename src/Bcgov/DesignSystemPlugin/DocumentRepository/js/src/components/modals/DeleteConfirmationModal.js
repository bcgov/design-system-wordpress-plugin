import { __ } from '@wordpress/i18n';
import { sprintf } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';

/**
 * Delete Confirmation Modal component
 * 
 * @param {Object} props Component props
 * @param {Object} [props.document] Document to delete (optional when isBulk is true)
 * @param {boolean} props.isDeleting Whether deletion is in progress
 * @param {(event: React.MouseEvent | React.KeyboardEvent) => void} props.onClose Function to close the modal
 * @param {(event: React.MouseEvent) => void} props.onConfirm Function to confirm deletion
 * @param {boolean} [props.isBulk=false] Whether this is a bulk delete operation
 * @param {Array} [props.selectedDocuments] Array of selected document IDs for bulk delete
 * @param {Array} [props.documents] Array of all documents for bulk delete
 * @returns {JSX.Element} Component
 */
const DeleteConfirmationModal = ({
    document = null,
    isDeleting,
    onClose,
    onConfirm,
    isBulk = false,
    selectedDocuments = [],
    documents = []
}) => {
    if (!isBulk && !document) {
        return null;
    }

    if (isBulk && (!selectedDocuments || selectedDocuments.length === 0)) {
        return null;
    }

    const title = isBulk 
        ? __('Delete Selected Documents', 'design-system')
        : __('Delete Document', 'design-system');

    const confirmationText = isBulk
        ? sprintf(
            __('Are you sure you want to delete %d documents?', 'design-system'),
            selectedDocuments.length
        )
        : sprintf(
            __('Are you sure you want to delete "%s"?', 'design-system'),
            document?.title || ''
        );

    return (
        <Modal
            title={title}
            onRequestClose={onClose}
            className="document-repository-modal delete-modal"
        >
            <p>{confirmationText}</p>
            {isBulk && selectedDocuments.length > 0 && (
                <ul>
                    {selectedDocuments.map(id => {
                        const doc = documents.find(d => d.id === id);
                        return doc ? (
                            <li key={doc.id}>{doc.title}</li>
                        ) : null;
                    })}
                </ul>
            )}
            <div className="modal-actions">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={isDeleting}
                >
                    {__('Cancel', 'design-system')}
                </Button>
                <Button
                    variant="primary"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="is-destructive"
                >
                    {isDeleting ? __('Deleting...', 'design-system') : __('Delete', 'design-system')}
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteConfirmationModal; 