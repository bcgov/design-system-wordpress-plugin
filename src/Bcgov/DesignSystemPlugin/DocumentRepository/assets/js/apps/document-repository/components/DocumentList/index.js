import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';
import { Button, Modal, Notice, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import ErrorBoundary from './ErrorBoundary';
import DocumentTable from './DocumentTable';
import UploadFeedback from './UploadFeedback';
import MetadataModal from '../../../shared/components/MetadataModal';
import UploadArea from './UploadArea';
import PaginationControls from './PaginationControls';
import RetryNotice from './RetryNotice';

/**
 * DocumentList Component
 * 
 * Main component for managing and displaying a list of documents with metadata.
 * Handles document uploads, metadata editing, bulk operations, and pagination.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.documents - List of document objects to display
 * @param {number} props.currentPage - Current page number for pagination
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {Function} props.onDelete - Callback when a document is deleted
 * @param {boolean} props.isDeleting - Flag indicating if a delete operation is in progress
 * @param {Array} props.selectedDocuments - Array of selected document IDs
 * @param {Function} props.onSelectDocument - Callback when a document is selected
 * @param {Function} props.onSelectAll - Callback when all documents are selected/deselected
 * @param {Function} props.onFileDrop - Callback when files are dropped/uploaded
 * @param {Function} props.onDocumentsUpdate - Callback when documents are updated
 * @param {Array} props.metadataFields - Array of metadata field definitions
 */

const DocumentList = ({
    documents = [],
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    onDelete,
    isDeleting = false,
    selectedDocuments = [],
    onSelectDocument,
    onSelectAll,
    onFileDrop,
    onDocumentsUpdate,
    metadataFields = [],
}) => {
    // State management
    const [localDocuments, setLocalDocuments] = useState(documents);
    const [deleteDocument, setDeleteDocument] = useState(null);
    const [showUploadFeedback, setShowUploadFeedback] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
    const [isMultiDeleting, setIsMultiDeleting] = useState(false);
    const [editingMetadata, setEditingMetadata] = useState(null);
    const [editedMetadataValues, setEditedMetadataValues] = useState({});
    const [metadataErrors, setMetadataErrors] = useState({});
    const [isSavingMetadata, setIsSavingMetadata] = useState(false);
    const [isSpreadsheetMode, setIsSpreadsheetMode] = useState(false);
    const [bulkEditedMetadata, setBulkEditedMetadata] = useState({});
    const [isSavingBulk, setIsSavingBulk] = useState(false);
    const [notice, setNotice] = useState(null);
    const [hasMetadataChanges, setHasMetadataChanges] = useState(false);
    const [failedOperations, setFailedOperations] = useState([]);
    const [retryCount, setRetryCount] = useState({});

    // Memoize document IDs for performance
    const documentIds = useMemo(() => localDocuments.map(doc => doc.id), [localDocuments]);

    // Memoize formatFileSize to prevent recreation on each render
    const formatFileSize = useMemo(() => (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }, []);

    // Memoize API namespace to prevent recalculation
    const apiNamespace = useMemo(() => {
        const settings = window.documentRepositorySettings;
        if (!settings) {
            console.error('Document Repository settings not found. Make sure the script is properly enqueued in WordPress.');
        }
        return settings?.apiNamespace || 'wp/v2';
    }, []);

    // Effects
    useEffect(() => {
        setLocalDocuments(documents);
    }, [documents]);

    /**
     * Handles errors and tracks failed operations
     * @param {string} operationType - Type of operation that failed (delete, metadata, upload)
     * @param {number|string} documentId - ID of the document or operation that failed
     * @param {Error|Object} error - Error object
     * @param {Object} options - Additional options
     * @param {boolean} options.addToRetryQueue - Whether to add to the retry queue
     * @param {boolean} options.showNotice - Whether to show a notification
     * @param {string} options.customMessage - Custom message to display instead of the default
     */
    const handleOperationError = useCallback((operationType, documentId, error, options = {}) => {
        const { 
            addToRetryQueue = true, 
            showNotice = true,
            customMessage = null 
        } = options;
        
        // Log for debugging
        console.error(`Operation ${operationType} failed:`, { documentId, error });
        
        // Add to retry queue if needed
        if (addToRetryQueue) {
            setFailedOperations(prev => [...prev, { type: operationType, documentId, error }]);
            setRetryCount(prev => ({
                ...prev,
                [documentId]: (prev[documentId] || 0) + 1
            }));
        }

        // Show notification if needed
        if (showNotice) {
            const errorMessage = customMessage || 
                error.message || 
                error.data?.message || 
                __('An unknown error occurred.', 'bcgov-design-system');
                
            setNotice({
                status: 'error',
                message: documentId ? 
                    sprintf(
                        __('Operation failed for document %d: %s', 'bcgov-design-system'),
                        documentId,
                        errorMessage
                    ) : errorMessage
            });
            
            // Auto-dismiss notice after 3 seconds
            setTimeout(() => setNotice(null), 3000);
        }
    }, []);

    /**
     * Display a notification message
     * @param {string} status - Status of the notification (success, error, warning)
     * @param {string} message - Message to display
     * @param {number} timeout - Time in ms before auto-dismissing (0 to disable)
     */
    const showNotification = useCallback((status, message, timeout = 3000) => {
        setNotice({ status, message });
        
        if (timeout > 0) {
            setTimeout(() => setNotice(null), timeout);
        }
    }, []);

    /**
     * Retry failed operations
     * @param {Object} operation - Failed operation to retry
     */
    const retryOperation = useCallback(async (operation) => {
        const maxRetries = 3;
        if (retryCount[operation.documentId] >= maxRetries) {
            setNotice({
                status: 'error',
                message: sprintf(
                    __('Maximum retry attempts reached for document %d', 'bcgov-design-system'),
                    operation.documentId
                )
            });
            return;
        }

        try {
            switch (operation.type) {
                case 'delete':
                    await onDelete(operation.documentId);
                    break;
                case 'metadata':
                    await handleSaveMetadata();
                    break;
                default:
                    console.error('Unknown operation type:', operation.type);
            }

            // Remove from failed operations if successful
            setFailedOperations(prev => 
                prev.filter(op => 
                    !(op.type === operation.type && op.documentId === operation.documentId)
                )
            );
        } catch (error) {
            handleOperationError(operation.type, operation.documentId, error);
        }
    }, [onDelete, handleSaveMetadata, retryCount]);

    // Handler for retrying all failed operations
    const handleRetryAll = useCallback(() => {
        failedOperations.forEach(retryOperation);
    }, [failedOperations, retryOperation]);

    // Update handleBulkDelete with better error handling
    const handleBulkDelete = useCallback(async () => {
        setIsMultiDeleting(true);
        try {
            await Promise.all(selectedDocuments.map(docId => onDelete(docId)));
            setBulkDeleteConfirmOpen(false);
            onSelectAll(false);
            showNotification('success', __('Selected documents were deleted successfully.', 'bcgov-design-system'));
        } catch (error) {
            handleOperationError('bulk-delete', null, error, {
                addToRetryQueue: false,
                customMessage: __('Error deleting one or more documents.', 'bcgov-design-system')
            });
        } finally {
            setIsMultiDeleting(false);
        }
    }, [selectedDocuments, onDelete, onSelectAll, handleOperationError, showNotification]);

    // Updated version of handleFiles with standardized error handling
    const handleFiles = useCallback((files) => {
        // Show immediate feedback before any processing
        setShowUploadFeedback(true);
        
        if (!files || files.length === 0) {
            showNotification('error', __('No files were selected for upload.', 'bcgov-design-system'));
            setShowUploadFeedback(false);
            return;
        }
        
        // Display placeholder while processing files
        setUploadingFiles([{
            id: 'placeholder',
            name: sprintf(__('Preparing %d files...', 'bcgov-design-system'), files.length),
            status: 'processing',
            error: null,
            isPlaceholder: true
        }]);

        // Process files and create file objects for display
        const processedFiles = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            originalFile: file,
            status: 'processing',
            error: null
        }));
        
        // Update UI with processing files
        setUploadingFiles(processedFiles);
        
        // Filter for PDF files and check file types
        const pdfFiles = [];
        const nonPdfFiles = [];
        
        files.forEach(file => {
            if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                pdfFiles.push(file);
            } else {
                nonPdfFiles.push(file);
            }
        });
        
        // Update UI with file validation results
        setUploadingFiles(prev => 
            prev.map(f => {
                const originalFile = files.find(file => file.name === f.name);
                const isPdf = originalFile && 
                    (originalFile.type === 'application/pdf' || originalFile.name.toLowerCase().endsWith('.pdf'));
                
                return {
                    ...f,
                    status: isPdf ? 'uploading' : 'error',
                    error: isPdf ? null : __('Not a PDF file. Only PDF files are allowed.', 'bcgov-design-system')
                };
            })
        );
        
        // Show error notice if any files were skipped
        if (nonPdfFiles.length > 0) {
            showNotification('warning', sprintf(
                __('%d of %d files were skipped because they are not PDFs.', 'bcgov-design-system'),
                nonPdfFiles.length,
                files.length
            ));
        }
        
        // If no valid files, return
        if (pdfFiles.length === 0) {
            return;
        }

        // Upload each valid PDF file
        pdfFiles.forEach((file) => {
            onFileDrop(file)
                .then(() => {
                    // Update UI with success
                    setUploadingFiles(prev => prev.map(f => 
                        f.name === file.name ? { ...f, status: 'success' } : f
                    ));
                })
                .catch(error => {
                    // Update UI with error details
                    setUploadingFiles(prev => prev.map(f => 
                        f.name === file.name ? { 
                            ...f, 
                            status: 'error', 
                            error: error.message || __('Upload failed. Please try again.', 'bcgov-design-system')
                        } : f
                    ));
                    
                    handleOperationError('upload', file.name, error, {
                        addToRetryQueue: false,
                        customMessage: sprintf(
                            __('Error uploading "%s": %s', 'bcgov-design-system'),
                            file.name,
                            error.message || __('Upload failed', 'bcgov-design-system')
                        )
                    });
                });
        });
    }, [onFileDrop, showNotification, handleOperationError]);

    const handleEditMetadata = useCallback((document) => {
        const documentToEdit = {
            ...document,
            upload_date: document.date || document.upload_date || document.metadata?.upload_date
        };
        setEditingMetadata(documentToEdit);
        
        // Initialize edited values with current metadata, preserving case
        const initialValues = {};
        metadataFields.forEach(field => {
            // Get the exact value from the document's metadata
            initialValues[field.id] = document.metadata?.[field.id] ?? '';
        });
        setEditedMetadataValues(initialValues);
        setMetadataErrors({});
    }, [metadataFields]);

    const hasMetadataChanged = useCallback(() => {
        if (!editingMetadata) return false;
        return metadataFields.some(field => {
            const currentValue = editingMetadata.metadata?.[field.id] || '';
            const editedValue = editedMetadataValues[field.id] || '';
            return currentValue !== editedValue;
        });
    }, [editingMetadata, editedMetadataValues, metadataFields]);

    const handleMetadataChange = useCallback((documentId, fieldId, value) => {
        // Get the original document to compare values
        const originalDoc = localDocuments.find(doc => doc.id === documentId);
        const originalValue = originalDoc?.metadata?.[fieldId] || '';
        
        // Update bulk edited metadata for saving later
        setBulkEditedMetadata(prev => {
            const newBulkMetadata = {
                ...prev,
                [documentId]: {
                    ...prev[documentId],
                    [fieldId]: value // Preserve exact case
                }
            };
            
            // Check if there are any changes in the new bulk metadata
            const hasChanged = Object.entries(newBulkMetadata).some(([docId, editedMetadata]) => {
                const originalDoc = localDocuments.find(doc => doc.id === parseInt(docId));
                if (!originalDoc) {
                    return false;
                }
                
                return Object.entries(editedMetadata).some(([fieldId, editedValue]) => {
                    const originalValue = originalDoc.metadata?.[fieldId] || '';
                    const isChanged = String(originalValue) !== String(editedValue);
                    return isChanged;
                });
            });
            
            setHasMetadataChanges(hasChanged);
            return newBulkMetadata;
        });

        // Always update local documents to reflect changes in the UI
        setLocalDocuments(prev => {
            const newDocs = prev.map(doc => {
                if (doc.id === documentId) {
                    return {
                        ...doc,
                        metadata: {
                            ...doc.metadata,
                            [fieldId]: value // Preserve exact case
                        }
                    };
                }
                return doc;
            });
            
            if (typeof onDocumentsUpdate === 'function') {
                onDocumentsUpdate(newDocs);
            }
            
            return newDocs;
        });
    }, [localDocuments, onDocumentsUpdate]);

    const handleSaveMetadata = useCallback(async () => {
        setIsSavingMetadata(true);
        
        try {
            await apiFetch({
                path: `/${apiNamespace}/documents/${editingMetadata.id}/metadata`,
                method: 'POST',
                data: editedMetadataValues
            });

            setLocalDocuments(prev => prev.map(doc => 
                doc.id === editingMetadata.id 
                    ? { ...doc, metadata: { ...doc.metadata, ...editedMetadataValues } }
                    : doc
            ));
            
            setEditingMetadata(null);
            setEditedMetadataValues({});
            setMetadataErrors({});
            
            showNotification('success', __('Document metadata updated successfully', 'bcgov-design-system'));
        } catch (error) {
            if (error.data?.errors) {
                setMetadataErrors(error.data.errors);
            }
            
            handleOperationError('metadata', editingMetadata.id, error, {
                customMessage: error.data?.message || __('Failed to update metadata', 'bcgov-design-system')
            });
        } finally {
            setIsSavingMetadata(false);
        }
    }, [editingMetadata, editedMetadataValues, apiNamespace, showNotification, handleOperationError]);

    // Initialize bulk edit metadata when entering spreadsheet mode
    useEffect(() => {
        if (isSpreadsheetMode) {
            const initialBulkMetadata = {};
            localDocuments.forEach(doc => {
                initialBulkMetadata[doc.id] = { ...(doc.metadata || {}) };
            });
            setBulkEditedMetadata(initialBulkMetadata);
            setHasMetadataChanges(false);
        } else {
            setBulkEditedMetadata({});
            setHasMetadataChanges(false);
        }
    }, [isSpreadsheetMode]);

    const hasBulkMetadataChanged = useCallback(() => {
        if (!bulkEditedMetadata || Object.keys(bulkEditedMetadata).length === 0) {
            return false;
        }
        
        const hasChanges = Object.entries(bulkEditedMetadata).some(([docId, editedMetadata]) => {
            const originalDoc = localDocuments.find(doc => doc.id === parseInt(docId));
            if (!originalDoc) {
                return false;
            }
            
            const hasDocChanges = Object.entries(editedMetadata).some(([fieldId, value]) => {
                const originalValue = originalDoc.metadata?.[fieldId] || '';
                const editedValue = value || '';
                const isChanged = String(originalValue).trim() !== String(editedValue).trim();
                return isChanged;
            });
            
            return hasDocChanges;
        });
        
        return hasChanges;
    }, [bulkEditedMetadata, localDocuments]);

    // Update handleSaveBulkChanges with better error handling
    const handleSaveBulkChanges = useCallback(async () => {
        setIsSavingBulk(true);
        const results = await Promise.allSettled(
            Object.entries(bulkEditedMetadata).map(([docId, metadata]) => 
                apiFetch({
                    path: `/${apiNamespace}/documents/${docId}/metadata`,
                    method: 'POST',
                    data: metadata
                })
            )
        );

        // Process results
        const failed = results
            .map((result, index) => ({
                result,
                docId: Object.keys(bulkEditedMetadata)[index]
            }))
            .filter(({ result }) => result.status === 'rejected');

        if (failed.length > 0) {
            failed.forEach(({ result, docId }) => {
                handleOperationError('metadata', docId, result.reason, {
                    showNotice: false // Don't show individual notices
                });
            });

            showNotification('warning', sprintf(
                __('%d of %d metadata updates failed. You can retry the failed operations.', 'bcgov-design-system'),
                failed.length,
                Object.keys(bulkEditedMetadata).length
            ), 0); // Don't auto-dismiss
        } else {
            showNotification('success', __('All metadata changes saved successfully.', 'bcgov-design-system'));
            setBulkEditedMetadata({});
            setHasMetadataChanges(false);
            setIsSpreadsheetMode(false);
        }

        setIsSavingBulk(false);
    }, [bulkEditedMetadata, apiNamespace, handleOperationError, showNotification]);

    // Memoize the document table props to prevent unnecessary re-renders
    const documentTableProps = useMemo(() => ({
        documents: localDocuments,
        selectedDocuments,
        onSelectDocument,
        onSelectAll,
        onDelete: setDeleteDocument,
        onEdit: handleEditMetadata,
        isDeleting,
        metadataFields,
        isSpreadsheetMode,
        bulkEditedMetadata,
        onMetadataChange: handleMetadataChange,
        formatFileSize
    }), [
        localDocuments,
        selectedDocuments,
        onSelectDocument,
        onSelectAll,
        isDeleting,
        metadataFields,
        isSpreadsheetMode,
        bulkEditedMetadata,
        handleEditMetadata,
        handleMetadataChange
    ]);

    return (
        <ErrorBoundary>
            <div className="document-list">
                <RetryNotice 
                    failedOperations={failedOperations}
                    onRetryAll={handleRetryAll}
                />

                {/* Upload Section */}
                <UploadArea 
                    onFilesSelected={handleFiles}
                    acceptMimeTypes="application/pdf"
                />

                {/* Bulk Delete Button and Spreadsheet Mode Toggle */}
                <div className="document-list-actions">
                    <div className="document-list-left-actions">
                        {selectedDocuments.length > 0 && (
                            <Button
                                className="doc-repo-button delete-button bulk-delete-button"
                                onClick={() => setBulkDeleteConfirmOpen(true)}
                                disabled={isMultiDeleting}
                            >
                                {sprintf(
                                    __('Delete Selected (%d)', 'bcgov-design-system'),
                                    selectedDocuments.length
                                )}
                            </Button>
                        )}
                        <div className="mode-toggle">
                            <Button
                                className="doc-repo-button edit-button"
                                onClick={() => setIsSpreadsheetMode(!isSpreadsheetMode)}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                    <path d="M4 4h16v16H4V4zm5.333 0v16m5.334-16v16M4 9.333h16m-16 5.334h16" strokeWidth="2" stroke="currentColor" fill="none" />
                                </svg>
                                {isSpreadsheetMode ? (
                                    __('Exit Spreadsheet Mode', 'bcgov-design-system')
                                ) : (
                                    __('Enter Spreadsheet Mode', 'bcgov-design-system')
                                )}
                            </Button>
                        </div>
                        {isSpreadsheetMode && hasMetadataChanges && (
                            <Button
                                isPrimary
                                onClick={handleSaveBulkChanges}
                                disabled={isSavingBulk}
                            >
                                {isSavingBulk ? (
                                    __('Saving Changes...', 'bcgov-design-system')
                                ) : __('Save Changes', 'bcgov-design-system')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Document Table */}
                <DocumentTable {...documentTableProps} />
                
                {/* Pagination Controls */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
                
                <UploadFeedback
                    uploadingFiles={uploadingFiles}
                    showUploadFeedback={showUploadFeedback}
                    onClose={() => {
                        setShowUploadFeedback(false);
                        setUploadingFiles([]);
                    }}
                />

                {/* Bulk Delete Confirmation Modal */}
                {bulkDeleteConfirmOpen && (
                    <Modal
                        title={__('Delete Selected Documents', 'bcgov-design-system')}
                        onRequestClose={() => setBulkDeleteConfirmOpen(false)}
                    >
                        <div className="delete-confirmation-content">
                            <p>
                                {sprintf(
                                    __('Are you sure you want to delete %d selected document(s)?', 'bcgov-design-system'),
                                    selectedDocuments.length
                                )}
                            </p>
                            <div className="documents-to-delete">
                                <h4>{__('Documents to be deleted:', 'bcgov-design-system')}</h4>
                                <ul>
                                    {documents
                                        .filter(doc => selectedDocuments.includes(doc.id))
                                        .map(doc => (
                                            <li key={doc.id}>{doc.title || doc.filename}</li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <p className="delete-warning">
                                {__('This action cannot be undone.', 'bcgov-design-system')}
                            </p>
                            <div className="modal-actions">
                                <Button
                                    className="doc-repo-button delete-button"
                                    onClick={handleBulkDelete}
                                    disabled={isMultiDeleting}
                                >
                                    {isMultiDeleting ? (
                                        __('Deleting...', 'bcgov-design-system')
                                    ) : sprintf(
                                        __('Delete Selected (%d)', 'bcgov-design-system'),
                                        selectedDocuments.length
                                    )}
                                </Button>
                                <Button
                                    onClick={() => setBulkDeleteConfirmOpen(false)}
                                    className="doc-repo-button cancel-button"
                                    disabled={isMultiDeleting}
                                >
                                    {__('Cancel', 'bcgov-design-system')}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {deleteDocument && (
                    <Modal
                        title={__('Delete Document', 'bcgov-design-system')}
                        onRequestClose={() => setDeleteDocument(null)}
                    >
                        <div className="delete-confirmation-content">
                            <p>
                                {__('Are you sure you want to delete this document?', 'bcgov-design-system')}
                            </p>
                            <div className="documents-to-delete">
                                <h4>{__('Document to be deleted:', 'bcgov-design-system')}</h4>
                                <ul>
                                    <li>{deleteDocument.title || deleteDocument.filename}</li>
                                </ul>
                            </div>
                            <p className="delete-warning">
                                {__('This action cannot be undone.', 'bcgov-design-system')}
                            </p>
                            <div className="modal-actions">
                                <Button
                                    onClick={() => setDeleteDocument(null)}
                                    className="doc-repo-button cancel-button"
                                    disabled={isDeleting}
                                >
                                    {__('Cancel', 'bcgov-design-system')}
                                </Button>
                                <Button
                                    className="doc-repo-button delete-button"
                                    onClick={() => {
                                        onDelete(deleteDocument.id);
                                        setDeleteDocument(null);
                                    }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? __('Deleting...', 'bcgov-design-system') : __('Delete', 'bcgov-design-system')}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {editingMetadata && (
                    <MetadataModal
                        title={__('Edit Document Metadata', 'bcgov-design-system')}
                        isOpen={!!editingMetadata}
                        onClose={() => {
                            setEditingMetadata(null);
                            setEditedMetadataValues({});
                            setMetadataErrors({});
                        }}
                        onSave={handleSaveMetadata}
                        isSaving={isSavingMetadata}
                        isDisabled={!hasMetadataChanged()}
                    >
                        <div className="editable-metadata">
                            {metadataFields.map(field => {
                                const error = metadataErrors[field.id];
                                const currentValue = editedMetadataValues[field.id] ?? '';
                                
                                return (
                                    <div key={field.id} className="metadata-field">
                                        {field.type === 'select' ? (
                                            <SelectControl
                                                label={field.label}
                                                value={currentValue}
                                                options={[
                                                    { label: __('Select...', 'bcgov-design-system'), value: '' },
                                                    ...(Array.isArray(field.options) 
                                                        ? field.options.map(option => ({
                                                            label: option,
                                                            value: option
                                                        }))
                                                        : Object.entries(field.options || {}).map(([value, label]) => ({
                                                            label,
                                                            value
                                                        }))
                                                    )
                                                ]}
                                                onChange={value => setEditedMetadataValues(prev => ({
                                                    ...prev,
                                                    [field.id]: value
                                                }))}
                                            />
                                        ) : (
                                            <TextControl
                                                label={field.label}
                                                value={currentValue}
                                                onChange={value => setEditedMetadataValues(prev => ({
                                                    ...prev,
                                                    [field.id]: value
                                                }))}
                                                type={field.type === 'date' ? 'date' : 'text'}
                                            />
                                        )}
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
                                    {(editingMetadata.metadata?.document_file_name || 
                                     editingMetadata.filename || 
                                     editingMetadata.title || 
                                     '').replace(/\.pdf$/i, '') || 
                                     __('Not available', 'bcgov-design-system')}
                                </div>
                            </div>
                            <div className="metadata-field">
                                <label>{__('File Type', 'bcgov-design-system')}</label>
                                <div className="field-value">
                                    {editingMetadata.metadata?.document_file_type || 'PDF'}
                                </div>
                            </div>
                            <div className="metadata-field">
                                <label>{__('File Size', 'bcgov-design-system')}</label>
                                <div className="field-value">
                                    {editingMetadata.metadata?.document_file_size ? 
                                        formatFileSize(parseInt(editingMetadata.metadata.document_file_size)) : 
                                        __('Not available', 'bcgov-design-system')}
                                </div>
                            </div>
                        </div>
                    </MetadataModal>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default DocumentList; 