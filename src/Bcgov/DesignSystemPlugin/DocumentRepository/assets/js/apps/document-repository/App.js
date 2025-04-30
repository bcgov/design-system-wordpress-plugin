/**
 * Document Repository - Main App Component
 * 
 * This is the root component of the Document Repository application.
 * It sets up the application structure, context providers, and main routes.
 * 
 * @component
 * @example
 * <App />
 */

import { useState, useEffect } from '@wordpress/element';
import { Modal, Notice, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

import DocumentList from './components/DocumentList';
import DocumentUploader from './components/DocumentUploader';
import { useDocuments } from './hooks/useDocuments';
import AppErrorBoundary from '../../shared/components/AppErrorBoundary';

/**
 * Main App component
 * 
 * Manages the document repository application state and UI.
 * Handles document listing, uploading, and metadata management.
 * 
 * @returns {JSX.Element} The rendered application
 */
const App = () => {
    // API data loading state
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Metadata fields configuration
    const [metadataFields, setMetadataFields] = useState([]);
    
    // Modal state for document upload
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFileForUpload, setSelectedFileForUpload] = useState(null);
    
    // Document data and operations from custom hook
    const {
        documents,
        totalDocuments,
        currentPage,
        totalPages,
        fetchDocuments,
        deleteDocument,
        isDeleting,
        searchParams,
        setSearchParams,
    } = useDocuments();
    
    // For debugging
    useEffect(() => {
        console.log('Documents received:', documents);
        if (documents && documents.length > 0) {
            console.log('First document structure:', JSON.stringify(documents[0], null, 2));
        }
    }, [documents]);
    
    // Selected documents for bulk actions
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    
    /**
     * Load metadata fields configuration on component mount
     * 
     * Fetches the metadata field definitions from the API
     * and updates the component state.
     * 
     * @async
     * @function fetchMetadataFields
     */
    useEffect(() => {
        const fetchMetadataFields = async () => {
            try {
                const { apiNamespace } = window.documentRepositorySettings;
                
                // Fetch metadata fields from API
                const fields = await apiFetch({
                    path: `/${apiNamespace}/metadata-fields`,
                });
                
                setMetadataFields(fields);
                setIsLoading(false);
            } catch (err) {
                setError(err.message || 'Error loading metadata fields');
                setIsLoading(false);
            }
        };
        
        fetchMetadataFields();
    }, []);
    
    /**
     * Handle document selection for bulk actions
     * 
     * @function handleDocumentSelection
     * @param {number} documentId - ID of the document to select/deselect
     */
    const handleDocumentSelection = (documentId) => {
        setSelectedDocuments((prev) => {
            if (prev.includes(documentId)) {
                return prev.filter(id => id !== documentId);
            } else {
                return [...prev, documentId];
            }
        });
    };
    
    /**
     * Handle selecting all documents
     * 
     * @function handleSelectAll
     * @param {boolean} isSelected - Whether to select or deselect all documents
     */
    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedDocuments(documents.map(doc => doc.id));
        } else {
            setSelectedDocuments([]);
        }
    };
    
    /**
     * Handle page change in pagination
     * 
     * @function handlePageChange
     * @param {number} newPage - New page number to navigate to
     */
    const handlePageChange = (newPage) => {
        setSearchParams(prev => ({
            ...prev,
            page: newPage
        }));
    };
    
    // Add new state for managing multiple file uploads
    const [uploadQueue, setUploadQueue] = useState([]);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    /**
     * Handle multiple file uploads
     * 
     * Processes an array of files for upload, filtering for PDFs
     * and setting up the upload queue.
     * 
     * @function handleMultipleFiles
     * @param {FileList|Array<File>} files - Files to upload
     */
    const handleMultipleFiles = async (files) => {
        try {
            // Filter for PDF files and validate
            const pdfFiles = Array.from(files).filter(file => {
                const isPdf = file.type.includes('pdf') || file.name.toLowerCase().endsWith('.pdf');
                if (!isPdf) {
                    console.warn(`Skipping non-PDF file: ${file.name}`);
                }
                return isPdf;
            });

            if (pdfFiles.length === 0) {
                throw new Error('No valid PDF files found');
            }

            // Set loading state
            setIsUploading(true);
            setUploadProgress(0);

            // Process files sequentially
            for (let i = 0; i < pdfFiles.length; i++) {
                try {
                    await handleFileDrop(pdfFiles[i]);
                    setUploadProgress(((i + 1) / pdfFiles.length) * 100);
                } catch (error) {
                    console.error(`Error uploading file ${pdfFiles[i].name}:`, error);
                    setError(`Failed to upload ${pdfFiles[i].name}: ${error.message}`);
                    // Continue with next file even if one fails
                }
            }
        } catch (error) {
            console.error('Error processing files:', error);
            setError(error.message);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    /**
     * Handle upload success and move to next file
     * 
     * @function handleUploadSuccess
     * @param {Object} document - The successfully uploaded document
     */
    const handleUploadSuccess = (document) => {
        console.log('Upload success:', document);
        
        // Refresh the document list
        fetchDocuments();
        
        // Move to next file if there are more in the queue
        if (currentUploadIndex < uploadQueue.length - 1) {
            const nextIndex = currentUploadIndex + 1;
            setCurrentUploadIndex(nextIndex);
            setSelectedFileForUpload(uploadQueue[nextIndex]);
        } else {
            // Reset upload state when all files are done
            setUploadQueue([]);
            setCurrentUploadIndex(0);
            setSelectedFileForUpload(null);
            setShowUploadModal(false);
        }
    };

    /**
     * Handle file drop for document upload
     * 
     * @async
     * @function handleFileDrop
     * @param {File} file - The file to upload
     * @throws {Error} If upload fails
     */
    const handleFileDrop = async (file) => {
        try {
            // Validate file type
            if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
                throw new Error('Only PDF files are allowed');
            }

            // Create FormData object
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', file.name.split('.')[0]); // Use filename without extension as title

            // Get the nonce from WordPress settings
            const nonce = window.documentRepositorySettings?.nonce;
            if (!nonce) {
                throw new Error('Security token not found');
            }

            // Create XMLHttpRequest for upload with progress tracking
            const xhr = new XMLHttpRequest();
            
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.open('POST', `${window.documentRepositorySettings.apiRoot}${window.documentRepositorySettings.apiNamespace}/documents`);
                xhr.setRequestHeader('X-WP-Nonce', nonce);
                
                // Track upload progress
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = Math.round((event.loaded / event.total) * 100);
                        setUploadProgress(progress);
                    }
                };
                
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (error) {
                            reject(new Error(`Error uploading "${file.name}": Server returned invalid response`));
                        }
                    } else {
                        let errorMessage;
                        try {
                            const response = JSON.parse(xhr.responseText);
                            errorMessage = response.message || response.error || xhr.statusText;
                        } catch (e) {
                            errorMessage = xhr.statusText || 'Server error';
                        }
                        reject(new Error(`Error uploading "${file.name}": ${errorMessage}`));
                    }
                };
                
                xhr.onerror = () => {
                    reject(new Error(`Network error while uploading "${file.name}". Please check your connection and try again.`));
                };
                
                xhr.send(formData);
            });

            // Wait for upload to complete
            const result = await uploadPromise;

            // Handle successful upload
            handleUploadSuccess(result);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError(error.message || 'Failed to upload file');
            throw error;
        }
    };
    
    // Loading state
    if (isLoading) {
        return (
            <div className="dswp-document-repository-loading">
                <Spinner />
                <p>{__('Loading document repository...', 'bcgov-design-system')}</p>
            </div>
        );
    }
    
    // Error state
    if (error) {
        return (
            <Notice status="error" isDismissible={false}>
                <p>{error}</p>
            </Notice>
        );
    }
    
    // Main application render
    return (
        <AppErrorBoundary>
            <div className="dswp-document-repository">
                <DocumentList
                    documents={documents || []}
                    isLoading={isLoading}
                    totalItems={totalDocuments}
                    currentPage={currentPage || 1}
                    totalPages={totalPages || 1}
                    onPageChange={handlePageChange}
                    onDelete={deleteDocument}
                    isDeleting={isDeleting}
                    selectedDocuments={selectedDocuments || []}
                    onSelectDocument={handleDocumentSelection}
                    onSelectAll={handleSelectAll}
                    metadataFields={metadataFields || []}
                    onUploadSuccess={handleUploadSuccess}
                    onFileDrop={handleFileDrop}
                />
                
                {/* Upload Modal */}
                {showUploadModal && selectedFileForUpload && (
                    <Modal
                        title={uploadQueue.length > 1 
                            ? __('Upload Documents', 'bcgov-design-system')
                            : __('Upload Document', 'bcgov-design-system')
                        }
                        onRequestClose={() => {
                            if (confirm(__('Are you sure you want to cancel the remaining uploads?', 'bcgov-design-system'))) {
                                setShowUploadModal(false);
                                setSelectedFileForUpload(null);
                                setUploadQueue([]);
                                setCurrentUploadIndex(0);
                            }
                        }}
                        className="document-upload-modal"
                    >
                        <div className="upload-progress-info">
                            {uploadQueue.length > 1 && (
                                <p className="upload-queue-status">
                                    {__('Uploading file', 'bcgov-design-system')} {currentUploadIndex + 1} {__('of', 'bcgov-design-system')} {uploadQueue.length}
                                </p>
                            )}
                        </div>
                        <DocumentUploader
                            metadataFields={metadataFields}
                            onUploadSuccess={handleUploadSuccess}
                            selectedFile={selectedFileForUpload}
                            modalMode={true}
                        />
                    </Modal>
                )}
            </div>
        </AppErrorBoundary>
    );
};

export default App; 