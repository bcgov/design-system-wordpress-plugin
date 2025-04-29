/**
 * DeleteFieldModal Component
 * 
 * A modal component for confirming metadata field deletion.
 * Provides a warning message and field information before deletion.
 */

import { Modal, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, warning } from '@wordpress/icons';

const DeleteFieldModal = ({ 
    isOpen,
    onClose,
    onConfirm,
    field,
    isDeleting
}) => {
    if (!isOpen || !field) return null;

    return (
        <Modal
            title={__('Delete Metadata Field', 'bcgov-design-system')}
            onRequestClose={onClose}
            className="metadata-field-modal"
        >
            <div className="document-delete-form">
                <div className="delete-warning">
                    <div className="warning-icon">
                        <Icon icon={warning} />
                    </div>
                    <div className="warning-content">
                        <strong>{__('This action cannot be undone', 'bcgov-design-system')}</strong>
                        <p>
                            {__('Deleting this field will permanently remove it and its values from all documents in the repository.', 'bcgov-design-system')}
                        </p>
                    </div>
                </div>

                <div className="document-info">
                    <h3>{__('Field Information', 'bcgov-design-system')}</h3>
                    <div className="info-grid">
                        <div className="label">{__('Field ID:', 'bcgov-design-system')}</div>
                        <div className="value">{field.id}</div>
                        <div className="label">{__('Label:', 'bcgov-design-system')}</div>
                        <div className="value">{field.label}</div>
                        <div className="label">{__('Type:', 'bcgov-design-system')}</div>
                        <div className="value">{field.type}</div>
                    </div>
                </div>

                <div className="delete-actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="cancel-button"
                        disabled={isDeleting}
                    >
                        {__('Cancel', 'bcgov-design-system')}
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onConfirm}
                        className="delete-button"
                        disabled={isDeleting}
                        isDestructive
                    >
                        {isDeleting 
                            ? __('Deleting...', 'bcgov-design-system')
                            : __('Delete Field', 'bcgov-design-system')
                        }
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteFieldModal; 