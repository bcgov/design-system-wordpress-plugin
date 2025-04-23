/**
 * Document Details Component
 * 
 * Displays detailed information about a document in a modal.
 */

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

/**
 * Document Details component
 * 
 * @param {Object} props Component props
 * @returns {JSX.Element} Component
 */
const DocumentDetails = ({ document, metadataFields = [] }) => {
    if (!document) {
        return null;
    }
    
    const { metadata = {} } = document;
    
    return (
        <div className="document-details">
            <div className="document-details-header">
                <h2>{document.title}</h2>
                
                <Button
                    variant="primary"
                    onClick={() => metadata.document_file_url ? 
                        window.open(metadata.document_file_url, '_blank') : null}
                    disabled={!metadata.document_file_url}
                >
                    {__('Download', 'bcgov-design-system')}
                </Button>
            </div>
            
            <div className="document-details-content">
                <div className="document-details-section">
                    <h3>{__('File Information', 'bcgov-design-system')}</h3>
                    
                    <div className="document-details-info">
                        <div className="document-details-info-item">
                            <span className="document-details-label">{__('File Type:', 'bcgov-design-system')}</span>
                            <span className="document-details-value">
                                {metadata.document_file_type ? 
                                    metadata.document_file_type.split('/').pop().toUpperCase() : 
                                    __('Unknown', 'bcgov-design-system')}
                            </span>
                        </div>
                        
                        <div className="document-details-info-item">
                            <span className="document-details-label">{__('File Size:', 'bcgov-design-system')}</span>
                            <span className="document-details-value">
                                {metadata.document_file_size ? 
                                    formatFileSize(metadata.document_file_size) : 
                                    __('Unknown', 'bcgov-design-system')}
                            </span>
                        </div>
                        
                        <div className="document-details-info-item">
                            <span className="document-details-label">{__('Filename:', 'bcgov-design-system')}</span>
                            <span className="document-details-value">
                                {metadata.document_file_name || __('Unknown', 'bcgov-design-system')}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="document-details-section">
                    <h3>{__('Document Information', 'bcgov-design-system')}</h3>
                    
                    <div className="document-details-info">
                        <div className="document-details-info-item">
                            <span className="document-details-label">{__('Upload Date:', 'bcgov-design-system')}</span>
                            <span className="document-details-value">{formatDate(document.date)}</span>
                        </div>
                        
                        <div className="document-details-info-item">
                            <span className="document-details-label">{__('Author:', 'bcgov-design-system')}</span>
                            <span className="document-details-value">{document.author || ''}</span>
                        </div>
                        
                        {/* Render custom metadata fields */}
                        {metadataFields.map((field) => (
                            <div className="document-details-info-item" key={field.id}>
                                <span className="document-details-label">{field.label}:</span>
                                <span className="document-details-value">
                                    {metadata[field.id] !== undefined ? metadata[field.id] : '—'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Document preview for supported file types */}
                {metadata.document_file_type && metadata.document_file_url && metadata.document_file_type.startsWith('image/') && (
                    <div className="document-details-section">
                        <h3>{__('Preview', 'bcgov-design-system')}</h3>
                        
                        <div className="document-preview">
                            <img 
                                src={metadata.document_file_url} 
                                alt={document.title || ''}
                                className="document-preview-image" 
                            />
                        </div>
                    </div>
                )}
                
                {/* PDF preview */}
                {metadata.document_file_type && metadata.document_file_url && metadata.document_file_type === 'application/pdf' && (
                    <div className="document-details-section">
                        <h3>{__('Preview', 'bcgov-design-system')}</h3>
                        
                        <div className="document-preview">
                            <iframe
                                src={`${metadata.document_file_url}#view=FitH`}
                                title={document.title || ''}
                                className="document-preview-pdf"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentDetails; 