/**
 * Document Bulk Actions Component
 * 
 * Provides bulk action functionality for selected documents.
 */

// Declare global type for window.documentRepositorySettings
/** @typedef {Object} DocumentRepositorySettings
 * @property {string} apiNamespace - API namespace for document repository
 */

// Declare the global window property
/** @type {Window & { documentRepositorySettings?: DocumentRepositorySettings }} */
const globalWindow = window;
const settings = globalWindow.documentRepositorySettings || { apiNamespace: '' };

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
    TextControl,
    SelectControl as MetadataSelectControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// Type definitions for better type safety
/** @typedef {Object} MetadataField
 * @property {string} id - Field identifier
 * @property {string} label - Field label
 * @property {'text'|'select'} type - Field type
 * @property {Object.<string, string>} [options] - Select field options
 */

/** @typedef {Object} DocumentBulkActionsProps
 * @property {number[]} selectedDocuments - Array of selected document IDs
 * @property {() => void} onActionComplete - Callback when bulk action completes
 * @property {MetadataField[]} metadataFields - Array of metadata fields
 */

/**
 * Document Bulk Actions component
 * 
 * @param {DocumentBulkActionsProps} props - Component props
 * @returns {JSX.Element} Component
 */
const DocumentBulkActions = ({
    selectedDocuments = [],
    onActionComplete,
    metadataFields = [],
}) => {
    // Consolidated state object for related states
    const [modalState, setModalState] = useState({
        show: false,
        title: '',
        selectedAction: '',
        isProcessing: false,
        error: null,
    });

    const [updateMetadata, setUpdateMetadata] = useState({});
    
    // Get API namespace from settings with type safety
    const { apiNamespace } = settings;
    if (!apiNamespace) {
        console.error('API namespace not found in settings');
        return null;
    }
    
    /**
     * Handle action selection
     * @param {string} action - Selected action
     */
    const handleActionChange = (action) => {
        setModalState(prev => ({
            ...prev,
            selectedAction: action,
        }));
    };
    
    /**
     * Apply the selected action
     */
    const handleApplyAction = () => {
        if (!modalState.selectedAction) {
            return;
        }
        
        const title = modalState.selectedAction === 'delete' 
            ? __('Bulk Delete Documents', 'bcgov-design-system')
            : __('Bulk Edit Documents', 'bcgov-design-system');
        
        setModalState(prev => ({
            ...prev,
            show: true,
            title,
        }));
    };
    
    /**
     * Handle metadata field change
     * @param {string} fieldId - Field identifier
     * @param {string} value - New field value
     */
    const handleMetadataChange = (fieldId, value) => {
        setUpdateMetadata(prev => ({
            ...prev,
            [fieldId]: value,
        }));
    };
    
    /**
     * Handle bulk delete operation
     */
    const handleBulkDelete = async () => {
        setModalState(prev => ({
            ...prev,
            isProcessing: true,
            error: null,
        }));
        
        try {
            await Promise.all(selectedDocuments.map(documentId => 
                apiFetch({
                    path: `/${apiNamespace}/documents/${documentId}`,
                    method: 'DELETE',
                })
            ));
            
            setModalState(prev => ({
                ...prev,
                show: false,
                isProcessing: false,
            }));
            onActionComplete();
        } catch (err) {
            setModalState(prev => ({
                ...prev,
                error: err.message || __('Error deleting documents.', 'bcgov-design-system'),
                isProcessing: false,
            }));
        }
    };
    
    /**
     * Handle bulk edit operation
     */
    const handleBulkEdit = async () => {
        if (Object.keys(updateMetadata).length === 0) {
            setModalState(prev => ({
                ...prev,
                error: __('No changes were made. Please update at least one field.', 'bcgov-design-system'),
            }));
            return;
        }
        
        setModalState(prev => ({
            ...prev,
            isProcessing: true,
            error: null,
        }));
        
        try {
            await Promise.all(selectedDocuments.map(documentId => 
                apiFetch({
                    path: `/${apiNamespace}/documents/${documentId}`,
                    method: 'PUT',
                    data: updateMetadata,
                })
            ));
            
            setModalState(prev => ({
                ...prev,
                show: false,
                isProcessing: false,
            }));
            onActionComplete();
        } catch (err) {
            setModalState(prev => ({
                ...prev,
                error: err.message || __('Error updating documents.', 'bcgov-design-system'),
                isProcessing: false,
            }));
        }
    };
    
    /**
     * Render form field based on field type
     * @param {MetadataField} field - Metadata field configuration
     * @returns {JSX.Element|null} Rendered field component
     */
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
                            ...Object.entries(options || {}).map(([value, label]) => ({
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
    
    /**
     * Render modal content based on selected action
     * @returns {JSX.Element|null} Modal content
     */
    const renderModalContent = () => {
        const { selectedAction, isProcessing } = modalState;
        
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
                                onClick={() => setModalState(prev => ({ ...prev, show: false }))}
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
                                onClick={() => setModalState(prev => ({ ...prev, show: false }))}
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
                        value={modalState.selectedAction}
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
                        disabled={!modalState.selectedAction}
                    >
                        {__('Apply', 'bcgov-design-system')}
                    </Button>
                </div>
            </div>
            
            {modalState.show && (
                <Modal
                    title={modalState.title}
                    onRequestClose={() => setModalState(prev => ({ ...prev, show: false }))}
                    className="document-bulk-modal"
                >
                    {modalState.error && (
                        <Notice 
                            status="error" 
                            isDismissible={true} 
                            onRemove={() => setModalState(prev => ({ ...prev, error: null }))}
                        >
                            {modalState.error}
                        </Notice>
                    )}
                    
                    {modalState.isProcessing && (
                        <div className="bulk-processing">
                            <Spinner 
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                            />
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