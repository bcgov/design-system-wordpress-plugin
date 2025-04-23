/**
 * Document List Component
 * 
 * Displays a table of documents with sorting, pagination, and selection capabilities.
 */

import { useState, useEffect, useRef } from '@wordpress/element';
import {
    Button,
    CheckboxControl,
    Spinner,
    Pagination,
    Modal,
    Notice,
    SelectControl,
    TextControl,
    TextareaControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// Components
import DocumentDetails from './DocumentDetails';

// Get settings from WordPress
const { apiNamespace } = window.documentRepositorySettings;

/**
 * Format file size for display
 * 
 * @param {number} bytes Size in bytes
 * @return {string} Formatted size
 */
const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date for display
 * 
 * @param {string} dateString Date string
 * @return {string} Formatted date
 */
const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

/**
 * Simple error boundary component
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Document list error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Notice status="error" isDismissible={false}>
                    <p>{__('Something went wrong displaying documents.', 'bcgov-design-system')}</p>
                    <pre>{this.state.error && this.state.error.toString()}</pre>
                </Notice>
            );
        }

        return this.props.children;
    }
}

/**
 * Safe render helper that catches errors in individual rows
 */
const SafeRender = ({ children, rowKey }) => {
    try {
        return <React.Fragment key={rowKey}>{children}</React.Fragment>;
    } catch (error) {
        console.error("Render error:", error);
        return (
            <div className="document-table-row error" role="row" key={`error-${rowKey}`}>
                <div className="document-table-cell" role="cell" colSpan="8">
                    {__('Error rendering item:', 'bcgov-design-system')} {error.message}
                </div>
            </div>
        );
    }
};

/**
 * Document List component
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Component
 */
const DocumentList = ({
    documents = [],
    isLoading = false,
    totalItems = 0,
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
    const [detailsDocument, setDetailsDocument] = useState(null);
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
    const [isSavingMetadata, setIsSavingMetadata] = useState(false);
    const [isSpreadsheetMode, setIsSpreadsheetMode] = useState(false);
    const [bulkEditedMetadata, setBulkEditedMetadata] = useState({});
    const [isSavingBulk, setIsSavingBulk] = useState(false);

    // Ref for the file input
    const fileInputRef = useRef(null);

    // Update local documents when documents prop changes
    useEffect(() => {
        setLocalDocuments(documents);
    }, [documents]);

    // Handle row click to view document details
    const handleRowClick = (document) => {
        setDetailsDocument(document);
    };
    
    // Handle document deletion
    const handleDelete = async (documentId) => {
        await onDelete(documentId);
        setDeleteDocument(null);
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
            // Show immediate feedback before any processing
            const files = Array.from(droppedFiles);
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
        }
    };

    // Handle file selection through file input
    const handleFileInputChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
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
        }
    };

    // Handle click on the upload hint or dropzone
    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file selection
    const handleFileSelected = (file) => {
        // Make sure we have a valid file
        if (!file) {
            console.error('No file provided to handleFileSelected');
            return;
        }
        
        console.log('File selected for upload:', file.name);
        
        // Immediately open the modal without delay
        setUploadModal({
            file: file,
            fileName: file.name,
            fileSize: formatFileSize(file.size)
        });
        console.log('Upload modal set directly to:', file.name);
    };
    
    // Handle upload success from the modal
    const handleUploadComplete = (document) => {
        console.log('Upload complete, closing modal');
        setUploadModal(null);
        if (onUploadSuccess) {
            onUploadSuccess(document);
        }
    };
    
    // Add useEffect hook to log when the upload modal state changes
    useEffect(() => {
        console.log('Upload modal state changed:', uploadModal);
    }, [uploadModal]);

    // Add debugging for component render cycle
    useEffect(() => {
        console.log('DocumentList component rendered, uploadModal state:', uploadModal);
    });

    // Check if all documents are selected
    const allSelected = localDocuments.length > 0 && selectedDocuments.length === localDocuments.length;
    
    // Modify the table rendering to include metadata columns and quick edit
    const renderTableContent = () => {
        return (
            <div className="document-table" role="table">
                {/* Table header */}
                <div className="document-table-header" role="rowgroup">
                    <div className="document-table-row" role="row">
                        <div className="document-table-cell header" role="columnheader">
                            <CheckboxControl
                                checked={allSelected}
                                onChange={onSelectAll}
                            />
                        </div>
                        <div className="document-table-cell header" role="columnheader">
                            {__('Title', 'bcgov-design-system')}
                        </div>
                        {metadataFields.map(field => (
                            <div 
                                key={field.id} 
                                className="document-table-cell header metadata-column" 
                                role="columnheader"
                            >
                                {field.label}
                            </div>
                        ))}
                        <div className="document-table-cell header" role="columnheader">
                            {__('Size', 'bcgov-design-system')}
                        </div>
                        <div className="document-table-cell header" role="columnheader">
                            {__('Type', 'bcgov-design-system')}
                        </div>
                        <div className="document-table-cell header" role="columnheader">
                            {__('Modified', 'bcgov-design-system')}
                        </div>
                        <div className="document-table-cell header" role="columnheader">
                            {__('Actions', 'bcgov-design-system')}
                        </div>
                    </div>
                </div>
                
                {/* Table body */}
                <div className="document-table-body" role="rowgroup">
                    {localDocuments.map((document) => (
                        <SafeRender key={document.id} rowKey={document.id}>
                            <div 
                                className={`document-table-row ${selectedDocuments.includes(document.id) ? 'selected' : ''}`}
                                role="row"
                                onClick={() => !isSpreadsheetMode && handleRowClick(document)}
                            >
                                <div className="document-table-cell" role="cell" onClick={(e) => e.stopPropagation()}>
                                    <CheckboxControl
                                        checked={selectedDocuments.includes(document.id)}
                                        onChange={() => onSelectDocument(document.id)}
                                    />
                                </div>
                                <div className="document-table-cell" role="cell">
                                    {document.title || document.filename}
                                </div>
                                {/* Metadata fields */}
                                {metadataFields.map(field => (
                                    <div 
                                        key={field.id} 
                                        className="document-table-cell metadata-column" 
                                        role="cell"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {isSpreadsheetMode ? (
                                            field.type === 'select' ? (
                                                <SelectControl
                                                    value={bulkEditedMetadata[document.id]?.[field.id] || ''}
                                                    options={[
                                                        { label: __('Select...', 'bcgov-design-system'), value: '' },
                                                        ...(field.options || []).map(option => ({
                                                            label: option,
                                                            value: option
                                                        }))
                                                    ]}
                                                    onChange={(value) => handleBulkMetadataChange(document.id, field.id, value)}
                                                />
                                            ) : field.type === 'date' ? (
                                                <TextControl
                                                    type="date"
                                                    value={bulkEditedMetadata[document.id]?.[field.id] || ''}
                                                    onChange={(value) => handleBulkMetadataChange(document.id, field.id, value)}
                                                    className="metadata-input"
                                                />
                                            ) : (
                                                <TextControl
                                                    value={bulkEditedMetadata[document.id]?.[field.id] || ''}
                                                    onChange={(value) => handleBulkMetadataChange(document.id, field.id, value)}
                                                    className="metadata-input"
                                                />
                                            )
                                        ) : (
                                            document.metadata && document.metadata[field.id] ? document.metadata[field.id] : '—'
                                        )}
                                    </div>
                                ))}
                                <div className="document-table-cell" role="cell">
                                    {document.metadata && document.metadata.document_file_size ? 
                                        formatFileSize(document.metadata.document_file_size) : '—'}
                                </div>
                                <div className="document-table-cell" role="cell">
                                    {document.metadata && document.metadata.document_file_type ? 
                                        document.metadata.document_file_type : '—'}
                                </div>
                                <div className="document-table-cell" role="cell">
                                    {document.metadata && document.metadata.modified_date ? 
                                        formatDate(document.metadata.modified_date) : 
                                        formatDate(document.modified)}
                                </div>
                                <div className="document-table-cell actions" role="cell" onClick={(e) => e.stopPropagation()}>
                                    {!isSpreadsheetMode && (
                                        <div className="action-buttons">
                                            <Button
                                                variant="secondary"
                                                onClick={() => handleEditMetadata(document)}
                                                className="icon-button"
                                                title={__('Edit Metadata', 'bcgov-design-system')}
                                                aria-label={__('Edit Metadata', 'bcgov-design-system')}
                                            >
                                                <span className="dashicons dashicons-edit"></span>
                                            </Button>
                                            <Button
                                                isDestructive
                                                onClick={() => setDeleteDocument(document)}
                                                disabled={isDeleting}
                                                className="icon-button"
                                                title={__('Delete', 'bcgov-design-system')}
                                                aria-label={__('Delete', 'bcgov-design-system')}
                                            >
                                                <span className="dashicons dashicons-trash"></span>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </SafeRender>
                    ))}
                </div>
            </div>
        );
    };

    // Update the renderUploadFeedback function to handle placeholder
    const renderUploadFeedback = () => {
        if (!showUploadFeedback || uploadingFiles.length === 0) return null;

        const successCount = uploadingFiles.filter(f => f.status === 'success').length;
        const errorCount = uploadingFiles.filter(f => f.status === 'error').length;
        const uploadingCount = uploadingFiles.filter(f => f.status === 'uploading').length;
        const processingCount = uploadingFiles.filter(f => f.status === 'processing').length;
        const hasPlaceholder = uploadingFiles.some(f => f.isPlaceholder);

        return (
            <div className="upload-feedback">
                <div className="upload-feedback-header">
                    <div className="upload-feedback-title">
                        <span className="dashicons dashicons-upload"></span>
                        {__('Document Upload Status', 'bcgov-design-system')}
                    </div>
                    <button 
                        className="upload-feedback-close"
                        onClick={() => {
                            // Only allow closing if no uploads are in progress
                            if (uploadingCount === 0 && processingCount === 0) {
                                setShowUploadFeedback(false);
                                setUploadingFiles([]);
                            }
                        }}
                    >
                        <span className="dashicons dashicons-no-alt"></span>
                    </button>
                </div>
                <div className="upload-feedback-items">
                    {uploadingFiles.map(file => (
                        <div key={file.id} className={`upload-feedback-item ${file.status} ${file.isPlaceholder ? 'placeholder' : ''}`}>
                            <span className="upload-feedback-item-name">{file.name}</span>
                            {file.status === 'processing' && (
                                <>
                                    <Spinner />
                                    <span className="dashicons dashicons-update"></span>
                                </>
                            )}
                            {file.status === 'uploading' && (
                                <>
                                    <Spinner />
                                    <span className="dashicons dashicons-cloud-upload"></span>
                                </>
                            )}
                            {file.status === 'success' && (
                                <span className="dashicons dashicons-yes-alt"></span>
                            )}
                            {file.status === 'error' && (
                                <>
                                    <span className="dashicons dashicons-warning"></span>
                                    {file.error && (
                                        <span className="upload-feedback-item-error">{file.error}</span>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <div className="upload-feedback-summary">
                    {hasPlaceholder ? (
                        <div className="processing">
                            <span className="dashicons dashicons-update"></span>
                            {__('Preparing files...', 'bcgov-design-system')}
                        </div>
                    ) : (
                        <>
                            {processingCount > 0 && (
                                <div className="processing">
                                    <span className="dashicons dashicons-update"></span>
                                    {sprintf(__('Processing %d files...', 'bcgov-design-system'), processingCount)}
                                </div>
                            )}
                            {uploadingCount > 0 && (
                                <div className="uploading">
                                    <span className="dashicons dashicons-cloud-upload"></span>
                                    {sprintf(__('Uploading %d files...', 'bcgov-design-system'), uploadingCount)}
                                </div>
                            )}
                            {successCount > 0 && (
                                <div className="success">
                                    <span className="dashicons dashicons-yes-alt"></span>
                                    {sprintf(__('%d files uploaded successfully', 'bcgov-design-system'), successCount)}
                                </div>
                            )}
                            {errorCount > 0 && (
                                <div className="error">
                                    <span className="dashicons dashicons-warning"></span>
                                    {sprintf(__('%d files failed to upload', 'bcgov-design-system'), errorCount)}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };
    
    // Handle metadata edit
    const handleEditMetadata = (document) => {
        setEditingMetadata(document);
        setEditedMetadataValues(document.metadata || {});
        setError(null);
    };

    // Handle metadata change
    const handleMetadataChange = (key, value) => {
        setEditedMetadataValues(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle metadata save
    const handleSaveMetadata = async () => {
        if (!editingMetadata) return;
        
        setIsSavingMetadata(true);
        setError(null);
        
        try {
            const response = await apiFetch({
                path: `/${apiNamespace}/documents/${editingMetadata.id}/metadata`,
                method: 'POST',
                data: editedMetadataValues,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            // Update the document in the local state with the response data
            const updatedDocuments = localDocuments.map(doc => 
                doc.id === editingMetadata.id 
                    ? { ...doc, metadata: response.metadata }
                    : doc
            );
            
            // Update local state
            setLocalDocuments(updatedDocuments);
            
            // Notify parent component if callback exists
            if (typeof onDocumentsUpdate === 'function') {
                onDocumentsUpdate(updatedDocuments);
            }
            
            // Reset editing state
            setEditingMetadata(null);
            setEditedMetadataValues({});
        } catch (error) {
            console.error('Error saving metadata:', error);
            setError(error.message || 'Failed to save metadata');
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

    // Handle bulk metadata change
    const handleBulkMetadataChange = (documentId, fieldId, value) => {
        setBulkEditedMetadata(prev => ({
            ...prev,
            [documentId]: {
                ...(prev[documentId] || {}),
                [fieldId]: value
            }
        }));
    };

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

    // Add the mode toggle and bulk actions
    return (
        <ErrorBoundary>
            <div 
                className={`document-list-container ${isDragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
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
                            <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" fill="currentColor"/>
                        </svg>
                        {__('Upload Documents', 'bcgov-design-system')}
                    </button>
                </div>
                        {selectedDocuments.length > 0 && (
                            <Button
                                isDestructive
                                onClick={() => setBulkDeleteConfirmOpen(true)}
                                className="bulk-delete-button"
                                icon={<span className="dashicons dashicons-trash"></span>}
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
                                        <>
                                            <Spinner />
                                            {__('Saving...', 'bcgov-design-system')}
                                        </>
                                    ) : __('Save All Changes', 'bcgov-design-system')}
                                                    </Button>
                            )}
                                                </div>
                    )}
                        </div>

                {/* Main content */}
                {renderTableContent()}
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
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
                        
                        {/* Document details modal */}
                        {detailsDocument && (
                            <DocumentDetails
                                document={detailsDocument}
                                onClose={() => setDetailsDocument(null)}
                            />
                        )}
                        
                        {/* Delete confirmation modal */}
                        {deleteDocument && (
                            <Modal
                                title={__('Delete Document', 'bcgov-design-system')}
                                onRequestClose={() => setDeleteDocument(null)}
                            >
                                <div className="delete-confirmation-content">
                                    <p>
                                        {__('Are you sure you want to delete', 'bcgov-design-system')} 
                                        {' '}
                                        <strong>"{deleteDocument.title || deleteDocument.filename}"</strong>?
                                    </p>
                                    <div className="modal-actions">
                                        <Button
                                            isDestructive
                                            onClick={() => handleDelete(deleteDocument.id)}
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
                        
                {/* Upload feedback */}
                {renderUploadFeedback()}

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
                                        <>
                                            <Spinner />
                                            {__('Deleting...', 'bcgov-design-system')}
                                        </>
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

                {/* Metadata edit modal */}
                        {editingMetadata && (
                            <Modal
                                title={__('Edit Document Metadata', 'bcgov-design-system')}
                                onRequestClose={() => {
                                    setEditingMetadata(null);
                                    setEditedMetadataValues({});
                                }}
                            >
                                <div className="metadata-edit-form">
                                    {error && (
                                        <Notice status="error" isDismissible={false}>
                                            {error}
                                        </Notice>
                                    )}
                                    
                                    {metadataFields.map(field => (
                                        <div key={field.id} className="metadata-field">
                                            <label htmlFor={`metadata-${field.id}`}>{field.label}</label>
                                            {field.type === 'select' ? (
                                                <SelectControl
                                                    id={`metadata-${field.id}`}
                                                    value={editedMetadataValues[field.id] || ''}
                                                    options={[
                                                        { label: __('Select...', 'bcgov-design-system'), value: '' },
                                                        ...(field.options || []).map(option => ({
                                                            label: option,
                                                            value: option
                                                        }))
                                                    ]}
                                                    onChange={value => handleMetadataChange(field.id, value)}
                                                />
                                            ) : field.type === 'date' ? (
                                                <TextControl
                                                    id={`metadata-${field.id}`}
                                                    type="date"
                                                    value={editedMetadataValues[field.id] || ''}
                                                    onChange={value => handleMetadataChange(field.id, value)}
                                                />
                                            ) : field.type === 'textarea' ? (
                                                <TextareaControl
                                                    id={`metadata-${field.id}`}
                                                    value={editedMetadataValues[field.id] || ''}
                                                    onChange={value => handleMetadataChange(field.id, value)}
                                                />
                                            ) : (
                                                <TextControl
                                                    id={`metadata-${field.id}`}
                                                    value={editedMetadataValues[field.id] || ''}
                                                    onChange={value => handleMetadataChange(field.id, value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                        
                                    <div className="modal-actions">
                                        <Button
                                            isPrimary
                                            onClick={handleSaveMetadata}
                                            disabled={isSavingMetadata}
                                        >
                                            {isSavingMetadata ? (
                                                <>
                                                    <Spinner />
                                                    {__('Saving...', 'bcgov-design-system')}
                                                </>
                                            ) : __('Save Changes', 'bcgov-design-system')}
                                        </Button>
                                        <Button
                                            isSecondary
                                            onClick={() => {
                                                setEditingMetadata(null);
                                                setEditedMetadataValues({});
                                            }}
                                            disabled={isSavingMetadata}
                                        >
                                            {__('Cancel', 'bcgov-design-system')}
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default DocumentList; 