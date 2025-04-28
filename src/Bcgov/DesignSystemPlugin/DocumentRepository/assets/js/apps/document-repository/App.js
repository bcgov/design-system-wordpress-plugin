/**
 * Document Repository - Main App Component
 * 
 * This is the root component of the Document Repository application.
 * It sets up the application structure, context providers, and main routes.
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
    
    // Load metadata fields configuration on component mount
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
    
    // Handle document selection for bulk actions
    const handleDocumentSelection = (documentId) => {
        setSelectedDocuments((prev) => {
            if (prev.includes(documentId)) {
                return prev.filter(id => id !== documentId);
            } else {
                return [...prev, documentId];
            }
        });
    };
    
    // Handle selecting all documents
    const handleSelectAll = (isSelected) => {
        if (isSelected) {
            setSelectedDocuments(documents.map(doc => doc.id));
        } else {
            setSelectedDocuments([]);
        }
    };
    
    // Handle page change
    const handlePageChange = (newPage) => {
        setSearchParams(prev => ({
            ...prev,
            page: newPage
        }));
    };
    
    // Add new state for managing multiple file uploads
    const [uploadQueue, setUploadQueue] = useState([]);
    const [currentUploadIndex, setCurrentUploadIndex] = useState(0);

    // Handle multiple file uploads
    const handleMultipleFiles = (files) => {
        // Convert to array if it's not already
        const fileArray = Array.isArray(files) ? files : Array.from(files);
        console.log('Multiple files to upload:', fileArray);
        
        // Filter out any non-PDF files
        const pdfFiles = fileArray.filter(file => 
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );

        if (pdfFiles.length === 0) {
            setError('No valid PDF files found.');
            return;
        }

        if (pdfFiles.length !== fileArray.length) {
            console.warn('Some files were skipped because they are not PDFs');
        }

        setUploadQueue(pdfFiles);
        setCurrentUploadIndex(0);
        setSelectedFileForUpload(pdfFiles[0]);
        setShowUploadModal(true);
    };

    // Handle upload success and move to next file
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

    // Handle file drop for document upload
    const handleFileDrop = async (file) => {
        try {
            // Create FormData object
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', file.name.split('.')[0]); // Use filename without extension as title

            // Upload the file
            const response = await apiFetch({
                path: '/bcgov-document-repository/v1/documents',
                method: 'POST',
                body: formData,
            });

            // Handle successful upload
            console.log('File uploaded successfully:', response);
            handleUploadSuccess(response);
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };
    
    if (isLoading) {
        return (
            <div className="dswp-document-repository-loading">
                <Spinner />
                <p>{__('Loading document repository...', 'bcgov-design-system')}</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <Notice status="error" isDismissible={false}>
                <p>{error}</p>
            </Notice>
        );
    }
    
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