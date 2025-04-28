/**
 * DocumentUploader Component
 * 
 * A comprehensive component for handling document uploads with metadata.
 * Supports both drag-and-drop and file selection, with progress tracking
 * and validation. Can operate in both modal and full-page modes.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.metadataFields - Array of metadata field definitions
 * @param {Function} props.onUploadSuccess - Callback when upload completes successfully
 * @param {File} [props.selectedFile] - Optional pre-selected file
 * @param {boolean} [props.modalMode=false] - Whether to render in modal mode
 * 
 * @example
 * const metadataFields = [
 *   { id: 'title', label: 'Title', type: 'text', required: true },
 *   { id: 'category', label: 'Category', type: 'select', options: ['A', 'B', 'C'] }
 * ];
 * 
 * <DocumentUploader
 *   metadataFields={metadataFields}
 *   onUploadSuccess={(document) => console.log('Uploaded:', document)}
 *   modalMode={true}
 * />
 */

import { useState, useRef, useEffect } from '@wordpress/element';
import {
    Button,
    FormFileUpload,
    TextControl,
    SelectControl,
    Spinner,
    Notice,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * State Management
 * 
 * The component manages several pieces of state:
 * - file: The currently selected file
 * - isUploading: Upload progress flag
 * - uploadProgress: Upload progress percentage
 * - error: Error message if any
 * - uploadSuccess: Success state flag
 * - isDragging: Drag-and-drop state
 * - title: Document title
 * - metadata: Document metadata values
 */

/**
 * Document Uploader component
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Component
 */
const DocumentUploader = ({ 
    metadataFields,
    onUploadSuccess,
    selectedFile = null,
    modalMode = false 
}) => {
    
    // File upload state
    const [file, setFile] = useState(selectedFile);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    
    // Ref for the file input
    const fileInputRef = useRef(null);
    
    // Document metadata state
    const [title, setTitle] = useState(selectedFile ? selectedFile.name.split('.')[0] : '');
    const [metadata, setMetadata] = useState({});
    
    // Get settings from WordPress
    const { apiNamespace, maxFileSize, allowedMimeTypes } = window.documentRepositorySettings;
    
    // Handle initial file setting from props
    useEffect(() => {
        if (selectedFile) {
            console.log('Selected file prop detected:', selectedFile.name);
            
            // Directly set the file in state
            setFile(selectedFile);
            
            // Set a default title from the filename (without extension)
            const fileName = selectedFile.name;
            const fileNameWithoutExt = fileName.includes('.') 
                ? fileName.substring(0, fileName.lastIndexOf('.')) 
                : fileName;
                
            setTitle(fileNameWithoutExt);
            
            // Also validate the file
            if (!validateFile(selectedFile)) {
                console.error('Initial file validation failed, but still setting file for UI');
            }
        }
    }, [selectedFile]);
    
    /**
     * File Validation
     * 
     * Validates files based on:
     * - File size limits
     * - Allowed file types
     * - Required metadata fields
     * 
     * @param {File} file - File to validate
     * @returns {boolean} Whether the file is valid
     */
    const validateFile = (file) => {
        if (!file) return false;
        
        // Check file size
        if (file.size > maxFileSize) {
            const errorMsg = `File "${file.name}" is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is ${(maxFileSize / (1024 * 1024)).toFixed(2)} MB.`;
            console.error('Validation error:', errorMsg);
            setError(errorMsg);
            return false;
        }
        
        // Check file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = Object.keys(allowedMimeTypes);
        
        if (!allowedExtensions.includes(fileExtension)) {
            const errorMsg = `File "${file.name}" has an invalid file type. Allowed types are: ${allowedExtensions.join(', ')}`;
            console.error('Validation error:', errorMsg);
            setError(errorMsg);
            return false;
        }
        
        setError(null);
        return true;
    }
    
    // Handle file validation and selection
    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) {
            console.log('No file provided to validate');
            return false;
        }
        
        console.log('Validating file:', selectedFile.name, 'Size:', selectedFile.size);
        
        if (validateFile(selectedFile)) {
            console.log('File validation passed, setting file and title');
            setFile(selectedFile);
            
            // Set default title from filename
            const fileNameWithoutExt = selectedFile.name.includes('.')
                ? selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.'))
                : selectedFile.name;
                
            setTitle(fileNameWithoutExt);
            return true;
        }
        
        return false;
    };
    
    // Handle file selection from input
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        validateAndSetFile(selectedFile);
    };
    
    // Handle drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('DocumentUploader - Drag enter detected');
        setIsDragging(true);
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Keep setting isDragging to true to ensure state persists
        setIsDragging(true);
    };
    
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Only set isDragging to false if we're actually leaving the container
        // not just moving between child elements
        const isLeavingContainer = !e.currentTarget.contains(e.relatedTarget);
        
        if (isLeavingContainer) {
            console.log('DocumentUploader - Drag leave detected - leaving container');
            setIsDragging(false);
        }
    };
    
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        console.log('DocumentUploader - Drop detected');
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            console.log('DocumentUploader - File dropped:', droppedFiles[0].name);
            validateAndSetFile(droppedFiles[0]);
        } else {
            console.warn('DocumentUploader - Drop event had no files');
        }
    };
    
    // Click handler for the drop zone
    const handleDropzoneClick = () => {
        console.log('DocumentUploader - Dropzone clicked');
        if (fileInputRef.current) {
            console.log('DocumentUploader - Triggering file input click');
            fileInputRef.current.click();
        }
    };
    
    // Handle metadata field change
    const handleMetadataChange = (fieldId, value) => {
        setMetadata(prev => ({
            ...prev,
            [fieldId]: value,
        }));
    };
    
    /**
     * Upload Process
     * 
     * Handles the document upload process:
     * 1. Validates required fields
     * 2. Creates FormData with file and metadata
     * 3. Tracks upload progress
     * 4. Handles success/error states
     * 5. Notifies parent component on success
     * 
     * @async
     */
    const handleUpload = async () => {
        console.log('Beginning upload process for file:', file?.name);
        
        // Validate required fields
        const requiredFields = metadataFields.filter(field => field.required);
        
        for (const field of requiredFields) {
            if (!metadata[field.id]) {
                setError(__('Please fill in all required fields.', 'bcgov-design-system'));
                return;
            }
        }
        
        if (!file) {
            setError(__('Please select a file to upload.', 'bcgov-design-system'));
            return;
        }
        
        if (!title) {
            setError(__('Please enter a title for the document.', 'bcgov-design-system'));
            return;
        }
        
        setIsUploading(true);
        setError(null);
        setUploadProgress(0);
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        
        // Add metadata as JSON
        const metadataJson = JSON.stringify(metadata);
        formData.append('metadata', metadataJson);
        
        console.log('FormData prepared, sending to server');
        console.log('API settings check:', {
            apiRoot: window.documentRepositorySettings.apiRoot,
            apiNamespace: apiNamespace,
            nonceExists: !!window.documentRepositorySettings.nonce,
            nonceLength: window.documentRepositorySettings.nonce?.length,
            isLoggedIn: !!document.body.classList.contains('logged-in'),
            userRole: window.documentRepositorySettings.userRole || 'unknown',
            currentUserId: typeof window.userSettings !== 'undefined' ? window.userSettings.uid : 'not set'
        });
        
        try {
            // Create XMLHttpRequest for upload with progress tracking
            const xhr = new XMLHttpRequest();
            
            const uploadPromise = new Promise((resolve, reject) => {
                xhr.open('POST', `${window.documentRepositorySettings.apiRoot}${apiNamespace}/documents`);
                
                // Add WordPress nonce header
                xhr.setRequestHeader('X-WP-Nonce', window.documentRepositorySettings.nonce);
                
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
                            console.log('Upload successful:', response);
                            resolve(response);
                        } catch (error) {
                            console.error('Error parsing response:', xhr.responseText);
                            reject(new Error(`Error uploading "${file.name}": Server returned invalid response`));
                        }
                    } else {
                        console.error('HTTP error:', xhr.status, xhr.statusText);
                        console.error('Response:', xhr.responseText);
                        
                        let errorMessage;
                        try {
                            const response = JSON.parse(xhr.responseText);
                            errorMessage = response.message || response.error || xhr.statusText;
                        } catch (e) {
                            errorMessage = xhr.statusText || 'Server error';
                        }
                        
                        if (xhr.status === 403) {
                            console.error('403 Forbidden - Authentication error. Headers:', xhr.getAllResponseHeaders());
                            reject(new Error(`Error uploading "${file.name}": Authentication error - please refresh the page and try again`));
                        } else {
                            reject(new Error(`Error uploading "${file.name}": ${errorMessage}`));
                        }
                    }
                };
                
                xhr.onerror = () => {
                    console.error('Network error during upload');
                    reject(new Error(`Network error while uploading "${file.name}". Please check your connection and try again.`));
                };
                
                xhr.send(formData);
            });
            
            // Wait for upload to complete
            const uploadedDocument = await uploadPromise;
            
            // Show success message
            setUploadSuccess(true);
            setIsUploading(false);
            
            // Notify parent of successful upload
            if (onUploadSuccess) {
                console.log('Notifying parent of successful upload');
                onUploadSuccess(uploadedDocument);
            }
            
            // Reset form if not in modal mode
            if (!modalMode) {
                setFile(null);
                setTitle('');
                setMetadata({});
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || `Error uploading "${file.name}". Please try again or contact support.`);
            setIsUploading(false);
        }
    };
    
    /**
     * Metadata Field Rendering
     * 
     * Dynamically renders form fields based on metadata field definitions:
     * - Text fields
     * - Select fields
     * - Date fields
     * 
     * @param {Object} field - Metadata field definition
     * @returns {JSX.Element} Rendered form field
     */
    const renderField = (field) => {
        const { id, label, type, options, required } = field;
        
        switch (type) {
            case 'text':
                return (
                    <TextControl
                        key={id}
                        label={label}
                        value={metadata[id] || ''}
                        onChange={(value) => handleMetadataChange(id, value)}
                        required={required}
                    />
                );
                
            case 'select':
                return (
                    <SelectControl
                        key={id}
                        label={label}
                        value={metadata[id] || ''}
                        options={[
                            { label: __('Select...', 'bcgov-design-system'), value: '' },
                            ...Object.entries(options).map(([value, label]) => ({
                                label,
                                value,
                            })),
                        ]}
                        onChange={(value) => handleMetadataChange(id, value)}
                        required={required}
                    />
                );
                
            case 'date':
                return (
                    <TextControl
                        key={id}
                        label={label}
                        type="date"
                        value={metadata[id] || ''}
                        onChange={(value) => handleMetadataChange(id, value)}
                        required={required}
                    />
                );
                
            default:
                return null;
        }
    };
    
    /**
     * Layout Modes
     * 
     * The component supports two layout modes:
     * 1. Modal Mode:
     *    - Simplified interface
     *    - Pre-selected file support
     *    - Compact metadata form
     * 
     * 2. Full Mode:
     *    - Card-based layout
     *    - Drag-and-drop support
     *    - Full metadata form
     */
    // Render content based on whether we're in modal mode or not
    const renderContent = () => {
        return (
            <>
                {uploadSuccess && (
                    <Notice status="success" isDismissible={true} onRemove={() => setUploadSuccess(false)}>
                        {__('Document uploaded successfully!', 'bcgov-design-system')}
                    </Notice>
                )}
                
                {error && (
                    <Notice status="error" isDismissible={true} onRemove={() => setError(null)}>
                        {error}
                    </Notice>
                )}
                
                {/* Drag & Drop Area - only show if not in modal mode and no file is selected */}
                {!modalMode && !file && (
                    <div 
                        className={`document-uploader-dropzone ${isDragging ? 'dragging' : ''}`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleDropzoneClick}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept={Object.values(allowedMimeTypes).join(',')}
                        />
                        
                        <div className="dropzone-icon">
                            <svg viewBox="0 0 64 64" width="64" height="64">
                                <path d="M32 16v24M20 28l12-12 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 48h32M12 20v28c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <div className="dropzone-text">
                            <p className="primary-text">
                                {isDragging 
                                    ? __('Drop file here', 'bcgov-design-system')
                                    : __('Drag & drop your file here or click to browse', 'bcgov-design-system')
                                }
                            </p>
                            <p className="secondary-text">
                                {__('Accepted file types:', 'bcgov-design-system')} {Object.keys(allowedMimeTypes).join(', ')}
                            </p>
                            <p className="secondary-text">
                                {__('Maximum file size:', 'bcgov-design-system')} {Math.round(maxFileSize / (1024 * 1024))} MB
                            </p>
                        </div>
                    </div>
                )}
                
                {/* File selection input for modal mode */}
                {modalMode && !file && (
                    <div className="document-uploader-file-select">
                        <FormFileUpload
                            accept={Object.values(allowedMimeTypes).join(',')}
                            onChange={handleFileChange}
                        >
                            {__('Select a different file', 'bcgov-design-system')}
                        </FormFileUpload>
                    </div>
                )}
                
                {/* Selected file display */}
                {file && (
                    <div className="selected-file-container">
                        <div className="selected-file">
                            <span className="file-name">{file.name}</span>
                            <button 
                                type="button" 
                                className="remove-file" 
                                onClick={() => setFile(null)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        {!modalMode && (
                            <FormFileUpload
                                accept={Object.values(allowedMimeTypes).join(',')}
                                onChange={handleFileChange}
                            >
                                {__('Select a different file', 'bcgov-design-system')}
                            </FormFileUpload>
                        )}
                    </div>
                )}
                
                {isUploading && (
                    <div className="upload-progress">
                        <progress value={uploadProgress} max="100"></progress>
                        <p>{uploadProgress}% {__('Uploaded', 'bcgov-design-system')}</p>
                    </div>
                )}
                
                <TextControl
                    label={__('Document Title', 'bcgov-design-system')}
                    value={title}
                    onChange={setTitle}
                    disabled={isUploading}
                    required
                />
                
                <h4>{__('Document Metadata', 'bcgov-design-system')}</h4>
                
                <div className={`metadata-fields ${modalMode ? 'modal-layout' : ''}`}>
                    {metadataFields.map(renderField)}
                </div>
            </>
        );
    };
    
    /**
     * Layout Modes
     * 
     * The component supports two layout modes:
     * 1. Modal Mode:
     *    - Simplified interface
     *    - Pre-selected file support
     *    - Compact metadata form
     * 
     * 2. Full Mode:
     *    - Card-based layout
     *    - Drag-and-drop support
     *    - Full metadata form
     */
    // If in modal mode, return a simplified layout
    if (modalMode) {
        console.log('DocumentUploader rendering in modal mode with file:', file?.name);
        
        // In modal mode, always ensure we have a file set
        useEffect(() => {
            if (!file && selectedFile) {
                setFile(selectedFile);
                console.log('Modal mode: Setting file from props', selectedFile.name);
            }
        }, [selectedFile, file]);
        
        return (
            <div className="document-uploader-modal">
                {error && (
                    <Notice status="error" isDismissible={true} onRemove={() => setError(null)}>
                        {error}
                    </Notice>
                )}
                
                {uploadSuccess && (
                    <Notice status="success" isDismissible={true} onRemove={() => setUploadSuccess(false)}>
                        {__('Document uploaded successfully!', 'bcgov-design-system')}
                    </Notice>
                )}
                
                {/* File info - explicitly confirm we have the file */}
                <div className="selected-file-info">
                    {file ? (
                        <p><strong>File:</strong> {file.name} ({Math.round(file.size / 1024)} KB)</p>
                    ) : selectedFile ? (
                        <p><strong>File:</strong> {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
                    ) : (
                        <p><strong>Warning:</strong> No file selected</p>
                    )}
                </div>
                
                {/* Always show title field and metadata fields in modal mode */}
                <TextControl
                    label={__('Document Title', 'bcgov-design-system')}
                    value={title}
                    onChange={setTitle}
                    disabled={isUploading}
                    required
                />
                
                <h4>{__('Document Metadata', 'bcgov-design-system')}</h4>
                
                <div className="metadata-fields modal-layout">
                    {metadataFields.map(renderField)}
                </div>
                
                {isUploading && (
                    <div className="upload-progress">
                        <progress value={uploadProgress} max="100"></progress>
                        <p>{uploadProgress}% {__('Uploaded', 'bcgov-design-system')}</p>
                    </div>
                )}
                
                <div className="modal-actions">
                    <Button
                        isPrimary
                        onClick={handleUpload}
                        disabled={(!file && !selectedFile) || !title || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Spinner />
                                {__('Uploading...', 'bcgov-design-system')}
                            </>
                        ) : (
                            __('Upload Document', 'bcgov-design-system')
                        )}
                    </Button>
                </div>
            </div>
        );
    }
    
    // Full card layout for non-modal mode
    return (
        <Card className="document-uploader">
            <CardHeader>
                <h3>{__('Upload Document', 'bcgov-design-system')}</h3>
            </CardHeader>
            
            <CardBody>
                {renderContent()}
            </CardBody>
            
            <CardFooter>
                <div className="card-actions">
                    <Button
                        isPrimary
                        onClick={handleUpload}
                        disabled={!file || !title || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Spinner />
                                {__('Uploading...', 'bcgov-design-system')}
                            </>
                        ) : (
                            __('Upload Document', 'bcgov-design-system')
                        )}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};

export default DocumentUploader; 