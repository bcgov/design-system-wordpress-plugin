import { useState, useEffect, useRef, useCallback, useMemo } from '@wordpress/element';
import { Button, Modal, Notice, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import ErrorBoundary from './ErrorBoundary';
import DocumentTable from './DocumentTable';
import UploadFeedback from './UploadFeedback';

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
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [showUploadFeedback, setShowUploadFeedback] = useState(false);
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

    // Refs
    const fileInputRef = useRef(null);
    const dragTimeoutRef = useRef(null);

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

    // Cleanup drag timeout on unmount
    useEffect(() => {
        return () => {
            if (dragTimeoutRef.current) {
                clearTimeout(dragTimeoutRef.current);
            }
        };
    }, []);

    // Memoize handlers to prevent unnecessary re-renders
    const handleBulkDelete = useCallback(async () => {
        try {
            setIsMultiDeleting(true);
            
            // Use Promise.all for parallel deletion
            await Promise.all(selectedDocuments.map(docId => onDelete(docId)));
            
            setBulkDeleteConfirmOpen(false);
            onSelectAll(false);
            
        } catch (error) {
            console.error('Error deleting documents:', error);
            setNotice({
                status: 'error',
                message: __('Failed to delete some documents.', 'bcgov-design-system')
            });
        } finally {
            setIsMultiDeleting(false);
        }
    }, [selectedDocuments, onDelete, onSelectAll]);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    }, [isDragging]);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const isLeavingContainer = !e.currentTarget.contains(e.relatedTarget);
        if (isLeavingContainer) {
            // Use timeout to prevent flickering
            dragTimeoutRef.current = setTimeout(() => {
                setIsDragging(false);
            }, 50);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            handleFiles(Array.from(droppedFiles));
        }
    }, []);

    const handleFileInputChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    }, []);

    const handleFiles = useCallback((files) => {
        // Show immediate feedback before any processing
        setShowUploadFeedback(true);
        setUploadingFiles([{
            id: 'placeholder',
            name: sprintf(__('Preparing %d files...', 'bcgov-design-system'), files.length),
            status: 'processing',
            error: null,
            isPlaceholder: true
        }]);

        // Process files immediately
        const processedFiles = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            status: 'processing',
            error: null
        }));
        setUploadingFiles(processedFiles);
        
        // Filter for PDF files
        const pdfFiles = files.filter(file => 
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );
        
        if (pdfFiles.length === 0) {
            setUploadingFiles(prev => prev.map(f => ({
                ...f,
                status: 'error',
                error: 'Only PDF files are allowed.'
            })));
            setNotice({
                status: 'error',
                message: __('Only PDF files are allowed.', 'bcgov-design-system')
            });
            return;
        }

        // Update file statuses
        setUploadingFiles(prev => prev.map(f => {
            const isPdf = f.name.toLowerCase().endsWith('.pdf');
            return {
                ...f,
                status: isPdf ? 'uploading' : 'error',
                error: isPdf ? null : 'Not a PDF file'
            };
        }));

        if (files.length !== pdfFiles.length) {
            setNotice({
                status: 'warning',
                message: __('Some files were skipped because they are not PDFs.', 'bcgov-design-system')
            });
        }

        // Handle each PDF file
        pdfFiles.forEach((file) => {
            onFileDrop(file)
                .then(() => {
                    setUploadingFiles(prev => prev.map(f => 
                        f.name === file.name ? { ...f, status: 'success' } : f
                    ));
                })
                .catch(error => {
                    setUploadingFiles(prev => prev.map(f => 
                        f.name === file.name ? { ...f, status: 'error', error: error.message } : f
                    ));
                });
        });
    }, [onFileDrop]);

    const handleUploadClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    const handleEditMetadata = useCallback((document) => {
        const documentToEdit = {
            ...document,
            upload_date: document.date || document.upload_date || document.metadata?.upload_date
        };
        setEditingMetadata(documentToEdit);
        
        // Initialize edited values with current metadata
        const initialValues = {};
        metadataFields.forEach(field => {
            initialValues[field.id] = document.metadata?.[field.id] || '';
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
        
        // Only set hasMetadataChanges if the value is different from original
        const hasChanged = String(value).trim() !== String(originalValue).trim();
        setHasMetadataChanges(hasChanged);
        
        // Update bulk edited metadata for saving later
        setBulkEditedMetadata(prev => ({
            ...prev,
            [documentId]: {
                ...prev[documentId],
                [fieldId]: value
            }
        }));

        // Only update local documents if not in spreadsheet mode
        if (!isSpreadsheetMode) {
            setLocalDocuments(prev => {
                const newDocs = prev.map(doc => {
                    if (doc.id === documentId) {
                        return {
                            ...doc,
                            metadata: {
                                ...doc.metadata,
                                [fieldId]: value
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
        }
    }, [localDocuments, isSpreadsheetMode, onDocumentsUpdate]);

    const handleSaveMetadata = useCallback(async (e) => {
        e.preventDefault();
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
            
            setNotice({
                status: 'success',
                message: __('Document metadata updated successfully', 'bcgov-design-system')
            });
            
            setTimeout(() => setNotice(null), 3000);
        } catch (error) {
            console.error('Error updating metadata:', error);
            const errorMessage = error.data?.message || error.message || __('Failed to update metadata', 'bcgov-design-system');
            if (error.data?.errors) {
                setMetadataErrors(error.data.errors);
            }
            setNotice({
                status: 'error',
                message: errorMessage
            });
        } finally {
            setIsSavingMetadata(false);
        }
    }, [editingMetadata, editedMetadataValues, apiNamespace]);

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
    }, [isSpreadsheetMode, localDocuments]);

    const hasBulkMetadataChanged = useCallback(() => {
        if (!bulkEditedMetadata || Object.keys(bulkEditedMetadata).length === 0) return false;
        
        return Object.entries(bulkEditedMetadata).some(([docId, editedMetadata]) => {
            const originalDoc = localDocuments.find(doc => doc.id === docId);
            if (!originalDoc) return false;
            
            return Object.entries(editedMetadata).some(([fieldId, value]) => {
                const originalValue = originalDoc.metadata?.[fieldId] || '';
                return String(originalValue).trim() !== String(value).trim();
            });
        });
    }, [bulkEditedMetadata, localDocuments]);

    const handleSaveBulkChanges = useCallback(async () => {
        setIsSavingBulk(true);
        let hasError = false;
        
        try {
            const updatePromises = Object.entries(bulkEditedMetadata).map(([docId, metadata]) => 
                apiFetch({
                    path: `/${apiNamespace}/documents/${docId}/metadata`,
                    method: 'POST',
                    data: metadata
                }).catch(error => {
                    hasError = true;
                    console.error(`Error updating document ${docId}:`, error);
                    return null;
                })
            );

            const results = await Promise.all(updatePromises);
            const updatedDocs = results.filter(result => result !== null);

            if (updatedDocs.length > 0) {
                setLocalDocuments(prev => prev.map(doc => {
                    const updatedDoc = updatedDocs.find(ud => ud.id === doc.id);
                    return updatedDoc ? {
                        ...doc,
                        metadata: {
                            ...doc.metadata,
                            ...updatedDoc.metadata
                        }
                    } : doc;
                }));

                if (typeof onDocumentsUpdate === 'function') {
                    onDocumentsUpdate(localDocuments);
                }
            }

            setBulkEditedMetadata({});
            setHasMetadataChanges(false);
            setIsSpreadsheetMode(false);
            
            setNotice({
                status: hasError ? 'warning' : 'success',
                message: hasError 
                    ? __('Some changes could not be saved. Please check the console for details.', 'bcgov-design-system')
                    : __('All changes saved successfully', 'bcgov-design-system')
            });
        } catch (error) {
            console.error('Error saving bulk metadata:', error);
            setNotice({
                status: 'error',
                message: error.message || __('Failed to save metadata changes', 'bcgov-design-system')
            });
        } finally {
            setIsSavingBulk(false);
        }
    }, [bulkEditedMetadata, localDocuments, apiNamespace, onDocumentsUpdate]);

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
                {/* Upload Section */}
                <div 
                    className={`document-upload-section ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                        multiple
                        accept=".pdf"
                    />
                    <div className="document-upload-content">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
                            <path fill="none" d="M0 0h24v24H0z"/>
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>
                        </svg>
                        <h3>{__('Drag or Click to Upload', 'bcgov-design-system')}</h3>
                        <p>{__('Drop your files here or click to browse', 'bcgov-design-system')}</p>
                    </div>
                </div>

                {/* Mode Toggle Buttons */}
                <div className="document-list-actions">
                    <div className="document-list-left-actions">
                        <div className="mode-toggle">
                            <Button
                                variant={isSpreadsheetMode ? 'primary' : 'secondary'}
                                onClick={() => setIsSpreadsheetMode(!isSpreadsheetMode)}
                                className="mode-toggle-button"
                            >
                                {isSpreadsheetMode ? __('Exit Spreadsheet Mode', 'bcgov-design-system') : __('Spreadsheet Mode', 'bcgov-design-system')}
                            </Button>
                            {isSpreadsheetMode && (
                                <Button
                                    variant="primary"
                                    onClick={handleSaveBulkChanges}
                                    disabled={!hasMetadataChanges || isSavingBulk}
                                    isBusy={isSavingBulk}
                                    className="save-changes-button"
                                >
                                    {isSavingBulk 
                                        ? __('Saving...', 'bcgov-design-system')
                                        : __('Save Changes', 'bcgov-design-system')
                                    }
                                </Button>
                            )}
                        </div>
                        {selectedDocuments.length > 0 && (
                            <Button
                                isDestructive
                                onClick={() => setBulkDeleteConfirmOpen(true)}
                                className="bulk-delete-button"
                                disabled={isMultiDeleting}
                            >
                                {isMultiDeleting ? (
                                    __('Deleting...', 'bcgov-design-system')
                                ) : sprintf(
                                    __('Delete Selected (%d)', 'bcgov-design-system'),
                                    selectedDocuments.length
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Document Table */}
                <DocumentTable {...documentTableProps} />
                
                {totalPages > 1 && (
                    <div className="pagination">
                        <Button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            {__('Previous', 'bcgov-design-system')}
                        </Button>
                        <span className="page-info">
                            {sprintf(__('Page %d of %d', 'bcgov-design-system'), currentPage, totalPages)}
                        </span>
                        <Button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            {__('Next', 'bcgov-design-system')}
                        </Button>
                    </div>
                )}
                
                <UploadFeedback
                    uploadingFiles={uploadingFiles}
                    showUploadFeedback={showUploadFeedback}
                    onClose={() => {
                        setShowUploadFeedback(false);
                        setUploadingFiles([]);
                    }}
                />

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
                                    isDestructive
                                    onClick={() => {
                                        onDelete(deleteDocument.id);
                                        setDeleteDocument(null);
                                    }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? __('Deleting...', 'bcgov-design-system') : __('Delete', 'bcgov-design-system')}
                                </Button>
                                <Button
                                    onClick={() => setDeleteDocument(null)}
                                    disabled={isDeleting}
                                >
                                    {__('Cancel', 'bcgov-design-system')}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

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
                                    {localDocuments
                                        .filter(doc => selectedDocuments.includes(doc.id))
                                        .map(doc => (
                                            <li key={doc.id}>
                                                {doc.title || doc.filename}
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <p className="delete-warning">
                                {__('This action cannot be undone.', 'bcgov-design-system')}
                            </p>
                            <div className="modal-actions">
                                <Button
                                    isDestructive
                                    onClick={handleBulkDelete}
                                    disabled={isMultiDeleting}
                                >
                                    {isMultiDeleting ? (
                                        <>{__('Deleting...', 'bcgov-design-system')}</>
                                    ) : __('Delete Selected', 'bcgov-design-system')}
                                </Button>
                                <Button
                                    onClick={() => setBulkDeleteConfirmOpen(false)}
                                    disabled={isMultiDeleting}
                                >
                                    {__('Cancel', 'bcgov-design-system')}
                                </Button>
                            </div>
                        </div>
                    </Modal>
                )}

                {editingMetadata && (
                    <Modal
                        title={__('Edit Document Metadata', 'bcgov-design-system')}
                        onRequestClose={() => {
                            setEditingMetadata(null);
                            setEditedMetadataValues({});
                            setMetadataErrors({});
                        }}
                        className="metadata-edit-modal"
                    >
                        <form onSubmit={handleSaveMetadata} className="metadata-edit-form">
                            <div className="editable-metadata">
                                <h3>{__('Custom Metadata', 'bcgov-design-system')}</h3>
                                {metadataFields.map(field => {
                                    const error = metadataErrors[field.id];
                                    
                                    return (
                                        <div key={field.id} className="metadata-field">
                                            {field.type === 'select' ? (
                                                <SelectControl
                                                    label={field.label}
                                                    value={editedMetadataValues[field.id] || ''}
                                                    options={[
                                                        { label: __('Select...', 'bcgov-design-system'), value: '' },
                                                        ...(field.options || []).map(option => ({
                                                            label: option,
                                                            value: option
                                                        }))
                                                    ]}
                                                    onChange={value => setEditedMetadataValues(prev => ({
                                                        ...prev,
                                                        [field.id]: value
                                                    }))}
                                                />
                                            ) : (
                                                <TextControl
                                                    label={field.label}
                                                    value={editedMetadataValues[field.id] || ''}
                                                    onChange={value => setEditedMetadataValues(prev => ({
                                                        ...prev,
                                                        [field.id]: value
                                                    }))}
                                                    type={field.type === 'date' ? 'text' : 'text'}
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

                            <div className="modal-actions">
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setEditingMetadata(null);
                                        setEditedMetadataValues({});
                                        setMetadataErrors({});
                                    }}
                                >
                                    {__('Cancel', 'bcgov-design-system')}
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    isBusy={isSavingMetadata}
                                    disabled={isSavingMetadata || !hasMetadataChanged()}
                                >
                                    {__('Save Changes', 'bcgov-design-system')}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default DocumentList; 