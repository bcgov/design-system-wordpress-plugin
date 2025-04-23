/**
 * Document Bulk Actions Component
 * 
 * Provides bulk action functionality for selected documents.
 */

import { useState } from '@wordpress/element';
import {
    Button,
    SelectControl,
    Modal,
    Notice,
    Spinner,
    Card,
    CardHeader,
    CardBody,
    TextareaControl,
    TextControl,
    SelectControl as MetadataSelectControl,
    CheckboxControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Document Bulk Actions component
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Component
 */
const DocumentBulkActions = ({
    selectedDocuments = [],
    onActionComplete,
    metadataFields = [],
}) => {
    // Action selection state
    const [selectedAction, setSelectedAction] = useState('');
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [actionTitle, setActionTitle] = useState('');
    
    // Operation status
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    
    // Metadata to update (for bulk edit)
    const [updateMetadata, setUpdateMetadata] = useState({});
    
    // Get API namespace from settings
    const { apiNamespace } = window.documentRepositorySettings;
    
    // Handle action selection
    const handleActionChange = (action) => {
        setSelectedAction(action);
    };
    
    // Apply the selected action
    const handleApplyAction = () => {
        if (!selectedAction) {
            return;
        }
        
        // Set modal title based on action
        switch (selectedAction) {
            case 'delete':
                setActionTitle(__('Bulk Delete Documents', 'bcgov-design-system'));
                break;
                
            case 'edit':
                setActionTitle(__('Bulk Edit Documents', 'bcgov-design-system'));
                break;
                
            default:
                return;
        }
        
        // Show the modal
        setShowModal(true);
    };
    
    // Handle metadata field change for bulk edit
    const handleMetadataChange = (fieldId, value) => {
        setUpdateMetadata(prev => ({
            ...prev,
            [fieldId]: value,
        }));
    };
    
    // Handle bulk delete
    const handleBulkDelete = async () => {
        setIsProcessing(true);
        setError(null);
        
        try {
            // Delete each document
            for (const documentId of selectedDocuments) {
                await apiFetch({
                    path: `/${apiNamespace}/documents/${documentId}`,
                    method: 'DELETE',
                });
            }
            
            // Close modal and notify parent
            setShowModal(false);
            setIsProcessing(false);
            onActionComplete();
        } catch (err) {
            setError(err.message || __('Error deleting documents.', 'bcgov-design-system'));
            setIsProcessing(false);
        }
    };
    
    // Handle bulk edit
    const handleBulkEdit = async () => {
        // Validate if anything was changed
        if (Object.keys(updateMetadata).length === 0) {
            setError(__('No changes were made. Please update at least one field.', 'bcgov-design-system'));
            return;
        }
        
        setIsProcessing(true);
        setError(null);
        
        try {
            // Update each document
            for (const documentId of selectedDocuments) {
                await apiFetch({
                    path: `/${apiNamespace}/documents/${documentId}`,
                    method: 'PUT',
                    data: updateMetadata,
                });
            }
            
            // Close modal and notify parent
            setShowModal(false);
            setIsProcessing(false);
            onActionComplete();
        } catch (err) {
            setError(err.message || __('Error updating documents.', 'bcgov-design-system'));
            setIsProcessing(false);
        }
    };
    
    // Render form field based on field type for bulk edit
    const renderField = (field) => {
        const { id, label, type, options } = field;
        
        switch (type) {
            case 'text':
                return (
                    <TextControl
                        key={id}
                        label={label}
                        value={updateMetadata[id] || ''}
                        onChange={(value) => handleMetadataChange(id, value)}
                    />
                );
                
            case 'select':
                return (
                    <MetadataSelectControl
                        key={id}
                        label={label}
                        value={updateMetadata[id] || ''}
                        options={[
                            { label: __('-- No change --', 'bcgov-design-system'), value: '' },
                            ...Object.entries(options).map(([value, label]) => ({
                                label,
                                value,
                            })),
                        ]}
                        onChange={(value) => handleMetadataChange(id, value)}
                    />
                );
                
            default:
                return null;
        }
    };
    
    // Render the appropriate modal content based on the selected action
    const renderModalContent = () => {
        switch (selectedAction) {
            case 'delete':
                return (
                    <>
                        <p>
                            {__('Are you sure you want to delete the selected documents?', 'bcgov-design-system')}
                            {' '}
                            <strong>
                                {__('This action cannot be undone.', 'bcgov-design-system')}
                            </strong>
                        </p>
                        
                        <p>
                            <strong>
                                {__('Documents to delete:', 'bcgov-design-system')}
                                {' '}
                                {selectedDocuments.length}
                            </strong>
                        </p>
                        
                        <div className="bulk-action-buttons">
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                                disabled={isProcessing}
                            >
                                {__('Cancel', 'bcgov-design-system')}
                            </Button>
                            
                            <Button
                                variant="primary"
                                isDestructive
                                onClick={handleBulkDelete}
                                isBusy={isProcessing}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 
                                    __('Deleting...', 'bcgov-design-system') : 
                                    __('Delete Documents', 'bcgov-design-system')}
                            </Button>
                        </div>
                    </>
                );
                
            case 'edit':
                return (
                    <>
                        <p>
                            <strong>
                                {__('Documents to update:', 'bcgov-design-system')}
                                {' '}
                                {selectedDocuments.length}
                            </strong>
                        </p>
                        
                        <Card>
                            <CardHeader>
                                <h3>{__('Update Fields', 'bcgov-design-system')}</h3>
                            </CardHeader>
                            
                            <CardBody>
                                <p className="bulk-edit-help">
                                    {__('Only fields you change will be updated. Leave fields blank to keep existing values.', 'bcgov-design-system')}
                                </p>
                                
                                <div className="bulk-edit-fields">
                                    {metadataFields.map(renderField)}
                                </div>
                            </CardBody>
                        </Card>
                        
                        <div className="bulk-action-buttons">
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                                disabled={isProcessing}
                            >
                                {__('Cancel', 'bcgov-design-system')}
                            </Button>
                            
                            <Button
                                variant="primary"
                                onClick={handleBulkEdit}
                                isBusy={isProcessing}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 
                                    __('Updating...', 'bcgov-design-system') : 
                                    __('Update Documents', 'bcgov-design-system')}
                            </Button>
                        </div>
                    </>
                );
                
            default:
                return null;
        }
    };
    
    return (
        <div className="document-bulk-actions">
            <div className="bulk-actions-bar">
                <span className="bulk-actions-count">
                    {`${selectedDocuments.length} ${
                        selectedDocuments.length === 1 ? 
                            __('document selected', 'bcgov-design-system') : 
                            __('documents selected', 'bcgov-design-system')
                    }`}
                </span>
                
                <div className="bulk-actions-controls">
                    <SelectControl
                        value={selectedAction}
                        options={[
                            { label: __('Bulk Actions', 'bcgov-design-system'), value: '' },
                            { label: __('Edit', 'bcgov-design-system'), value: 'edit' },
                            { label: __('Delete', 'bcgov-design-system'), value: 'delete' },
                        ]}
                        onChange={handleActionChange}
                    />
                    
                    <Button
                        variant="secondary"
                        onClick={handleApplyAction}
                        disabled={!selectedAction}
                    >
                        {__('Apply', 'bcgov-design-system')}
                    </Button>
                </div>
            </div>
            
            {showModal && (
                <Modal
                    title={actionTitle}
                    onRequestClose={() => setShowModal(false)}
                    className="document-bulk-modal"
                >
                    {error && (
                        <Notice status="error" isDismissible={true} onRemove={() => setError(null)}>
                            {error}
                        </Notice>
                    )}
                    
                    {isProcessing && (
                        <div className="bulk-processing">
                            <Spinner />
                            <p>{__('Processing documents...', 'bcgov-design-system')}</p>
                        </div>
                    )}
                    
                    {renderModalContent()}
                </Modal>
            )}
        </div>
    );
};

export default DocumentBulkActions; 