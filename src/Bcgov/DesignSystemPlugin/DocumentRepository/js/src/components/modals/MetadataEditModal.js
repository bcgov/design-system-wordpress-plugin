import { __ } from '@wordpress/i18n';
import { Button, Modal, SelectControl, TextControl } from '@wordpress/components';

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const MetadataEditModal = ({
    document,
    metadataFields,
    editedMetadataValues,
    metadataErrors,
    isSaving,
    onClose,
    onSave,
    onChange
}) => {
    if (!document) return null;

    const renderMetadataField = (field) => {
        if (field.type === 'select') {
            return (
                <SelectControl
                    label={field.label}
                    value={editedMetadataValues[field.id] || ''}
                    options={field.options.map(opt => ({
                        label: opt,
                        value: opt
                    }))}
                    onChange={value => onChange(field.id, value)}
                />
            );
        }
        
        return (
            <TextControl
                label={field.label}
                value={editedMetadataValues[field.id] || ''}
                onChange={value => onChange(field.id, value)}
                type={field.type === 'date' ? 'date' : 'text'}
            />
        );
    };

    return (
        <Modal
            title={__('Edit Document Metadata', 'bcgov-design-system')}
            onRequestClose={onClose}
            className="metadata-edit-modal"
        >
            <form onSubmit={(e) => {
                e.preventDefault();
                onSave();
            }} className="metadata-edit-form">
                <div className="editable-metadata">
                    <h3>{__('Custom Metadata', 'bcgov-design-system')}</h3>
                    {metadataFields.map(field => {
                        const error = metadataErrors[field.id];
                        
                        return (
                            <div key={field.id} className="metadata-field">
                                {renderMetadataField(field)}
                                {error && <div className="metadata-error">{error}</div>}
                            </div>
                        );
                    })}
                </div>
                
                <div className="non-editable-metadata">
                    <h3>{__('Document Information', 'bcgov-design-system')}</h3>
                    <div className="metadata-field">
                        <label>{__('Filename', 'bcgov-design-system')}</label>
                        <div className="field-value">
                            {(document.metadata?.document_file_name || 
                             document.filename || 
                             document.title || 
                             '').replace(/\.pdf$/i, '') || 
                             __('Not available', 'bcgov-design-system')}
                        </div>
                    </div>
                    <div className="metadata-field">
                        <label>{__('File Type', 'bcgov-design-system')}</label>
                        <div className="field-value">
                            {document.metadata?.document_file_type || 'PDF'}
                        </div>
                    </div>
                    <div className="metadata-field">
                        <label>{__('File Size', 'bcgov-design-system')}</label>
                        <div className="field-value">
                            {document.metadata?.document_file_size ? 
                                formatFileSize(parseInt(document.metadata.document_file_size)) : 
                                __('Not available', 'bcgov-design-system')}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        {__('Cancel', 'bcgov-design-system')}
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        isBusy={isSaving}
                        disabled={isSaving}
                    >
                        {__('Save Changes', 'bcgov-design-system')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default MetadataEditModal; 