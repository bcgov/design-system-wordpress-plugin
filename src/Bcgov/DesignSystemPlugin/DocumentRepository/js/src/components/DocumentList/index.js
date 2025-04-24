import { useState, useEffect, useRef } from '@wordpress/element';
import { Button, Modal, Notice, SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import ErrorBoundary from './ErrorBoundary';
import DocumentTable from './DocumentTable';
import UploadFeedback from './UploadFeedback';

// Global settings from WordPress
const settings = window.documentRepositorySettings;
if (!settings) {
    console.error('Document Repository settings not found. Make sure the script is properly enqueued in WordPress.');
}
const apiNamespace = settings?.apiNamespace || 'wp/v2';

/**
 * Format file size for display
 * 
 * @param {number} bytes Size in bytes
 * @return {string} Formatted size
 */
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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
    onUploadSuccess,
    onFileDrop,
    onDocumentsUpdate,
    metadataFields = [],
}) => {
    const [localDocuments, setLocalDocuments] = useState(documents);
    const [deleteDocument, setDeleteDocument] = useState(null);
    const [uploadModal, setUploadModal] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
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

    // Ref for the file input
    const fileInputRef = useRef(null);

    // Update local documents when documents prop changes
    useEffect(() => {
        setLocalDocuments(documents);
    }, [documents]);

    // Handle bulk document deletion
    const handleBulkDelete = async () => {
        try {
            setIsMultiDeleting(true);
            
            // Delete each selected document
            for (const documentId of selectedDocuments) {
                await onDelete(documentId);
            }
            
            // Close the confirmation modal
            setBulkDeleteConfirmOpen(false);
            
            // Clear selected documents
            onSelectAll(false);
            
        } catch (error) {
            console.error('Error deleting documents:', error);
            setError(__('Failed to delete some documents.', 'bcgov-design-system'));
        } finally {
            setIsMultiDeleting(false);
        }
    };

    // Handle drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isDragging) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isLeavingContainer = !e.currentTarget.contains(e.relatedTarget);
        if (isLeavingContainer) {
            setIsDragging(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            handleFiles(Array.from(droppedFiles));
        }
    };

    // Handle file selection through file input
    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFiles(files);
        }
    };

    // Common file handling logic
    const handleFiles = (files) => {
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
        setUploadingFiles(files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            status: 'processing',
            error: null
        })));
        
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
            setError('Only PDF files are allowed.');
            return;
        }

        if (files.length !== pdfFiles.length) {
            // Update non-PDF files to show error
            setUploadingFiles(prev => prev.map(f => {
                const isPdf = f.name.toLowerCase().endsWith('.pdf');
                return {
                    ...f,
                    status: isPdf ? 'uploading' : 'error',
                    error: isPdf ? null : 'Not a PDF file'
                };
            }));
            setError('Some files were skipped because they are not PDFs.');
        } else {
            // Update all files to uploading status
            setUploadingFiles(prev => prev.map(f => ({
                ...f,
                status: 'uploading'
            })));
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
    };

    // Handle click on the upload hint or dropzone
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    
    // Handle metadata edit
    const handleEditMetadata = (document) => {
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
    };

    // Handle metadata change
    const handleMetadataChange = (documentId, fieldId, value) => {
        setBulkEditedMetadata(prev => ({
            ...prev,
            [documentId]: {
                ...(prev[documentId] || {}),
                [fieldId]: value
            }
        }));
    };

    // Handle metadata save
    const handleSaveMetadata = async (e) => {
        e.preventDefault();
        setIsSavingMetadata(true);
        
        try {
            const response = await apiFetch({
                path: `/${apiNamespace}/documents/${editingMetadata.id}/metadata`,
                method: 'POST',
                data: editedMetadataValues
            });

            // Update the document in the list
            setLocalDocuments(prev => prev.map(doc => 
                doc.id === editingMetadata.id 
                    ? { ...doc, metadata: { ...doc.metadata, ...editedMetadataValues } }
                    : doc
            ));
            
            // Close modal and reset state
            setEditingMetadata(null);
            setEditedMetadataValues({});
            setMetadataErrors({});
            
            setNotice({
                status: 'success',
                message: __('Document metadata updated successfully', 'bcgov-design-system')
            });
            
            // Clear notice after 3 seconds
            setTimeout(() => setNotice(null), 3000);
        } catch (error) {
            console.error('Error updating metadata:', error);
            if (error.data?.errors) {
                setMetadataErrors(error.data.errors);
            } else {
                setNotice({
                    status: 'error',
                    message: error.message || __('Failed to update metadata', 'bcgov-design-system')
                });
            }
        } finally {
            setIsSavingMetadata(false);
        }
    };

    // Initialize bulk edit metadata when entering spreadsheet mode
    useEffect(() => {
        if (isSpreadsheetMode) {
            const initialBulkMetadata = {};
            localDocuments.forEach(doc => {
                initialBulkMetadata[doc.id] = doc.metadata || {};
            });
            setBulkEditedMetadata(initialBulkMetadata);
        }
    }, [isSpreadsheetMode, localDocuments]);

    // Save all bulk metadata changes
    const handleSaveBulkChanges = async () => {
        setIsSavingBulk(true);
        setError(null);
        
        try {
            // Create an array of promises for each document update
            const updatePromises = Object.entries(bulkEditedMetadata).map(([docId, metadata]) => {
                return apiFetch({
                    path: `/${apiNamespace}/documents/${docId}/metadata`,
                    method: 'POST',
                    data: metadata,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            });

            // Wait for all updates to complete
            await Promise.all(updatePromises);

            // Update local state
            const updatedDocuments = localDocuments.map(doc => ({
                ...doc,
                metadata: bulkEditedMetadata[doc.id] || doc.metadata
            }));
            setLocalDocuments(updatedDocuments);

            // Notify parent component
            if (typeof onDocumentsUpdate === 'function') {
                onDocumentsUpdate(updatedDocuments);
            }

            setIsSpreadsheetMode(false);
        } catch (error) {
            console.error('Error saving bulk metadata:', error);
            setError(error.message || 'Failed to save metadata changes');
        } finally {
            setIsSavingBulk(false);
        }
    };

    return (
        <ErrorBoundary>
            <div 
                className={`document-list ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {notice && (
                    <Notice 
                        status={notice.status}
                        isDismissible={true}
                        onRemove={() => setNotice(null)}
                    >
                        {notice.message}
                    </Notice>
                )}
                
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                    accept="application/pdf,.pdf"
                    multiple
                />

                {/* Actions */}
                <div className="document-list-actions">
                    <div className="document-list-left-actions">
                        <div className="document-list-upload-hint-container">
                            <button className="document-list-upload-hint" onClick={handleUploadClick}>
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                                </svg>
                                {__('Upload Documents', 'bcgov-design-system')}
                            </button>
                        </div>
                        {selectedDocuments.length > 0 && (
                            <Button
                                isDestructive
                                onClick={() => setBulkDeleteConfirmOpen(true)}
                                className="bulk-delete-button"
                                icon={<svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                                </svg>}
                            >
                                {sprintf(__('Delete Selected (%d)', 'bcgov-design-system'), selectedDocuments.length)}
                            </Button>
                        )}
                    </div>
                    {localDocuments.length > 0 && (
                        <div className="mode-toggle">
                            <Button
                                variant={isSpreadsheetMode ? "primary" : "secondary"}
                                onClick={() => setIsSpreadsheetMode(!isSpreadsheetMode)}
                            >
                                {isSpreadsheetMode ? __('Exit Spreadsheet Mode', 'bcgov-design-system') : __('Edit as Spreadsheet', 'bcgov-design-system')}
                            </Button>
                            {isSpreadsheetMode && (
                                <Button
                                    variant="primary"
                                    onClick={handleSaveBulkChanges}
                                    disabled={isSavingBulk}
                                    style={{ marginLeft: '8px' }}
                                >
                                    {isSavingBulk ? (
                                        <>{__('Saving...', 'bcgov-design-system')}</>
                                    ) : __('Save All Changes', 'bcgov-design-system')}
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Main content */}
                <DocumentTable
                    documents={localDocuments}
                    selectedDocuments={selectedDocuments}
                    onSelectDocument={onSelectDocument}
                    onSelectAll={onSelectAll}
                    onDelete={setDeleteDocument}
                    onEdit={handleEditMetadata}
                    isDeleting={isDeleting}
                    metadataFields={metadataFields}
                    isSpreadsheetMode={isSpreadsheetMode}
                    bulkEditedMetadata={bulkEditedMetadata}
                    onMetadataChange={handleMetadataChange}
                    formatFileSize={formatFileSize}
                />
                
                {/* Pagination */}
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
                
                {/* Drop zone overlay */}
                {isDragging && (
                    <div className="document-drop-overlay">
                        <div className="document-drop-message">
                            <svg viewBox="0 0 64 64" width="64" height="64">
                                <path d="M32 16v24M20 28l12-12 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 48h32M12 20v28c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            {__('Drop files to upload', 'bcgov-design-system')}
                        </div>
                    </div>
                )}
                
                {/* Upload feedback */}
                <UploadFeedback
                    uploadingFiles={uploadingFiles}
                    showUploadFeedback={showUploadFeedback}
                    onClose={() => {
                        setShowUploadFeedback(false);
                        setUploadingFiles([]);
                    }}
                />

                {/* Delete confirmation modal */}
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

                {/* Bulk Delete confirmation modal */}
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

                {/* Metadata Edit Modal */}
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
                                    disabled={isSavingMetadata}
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