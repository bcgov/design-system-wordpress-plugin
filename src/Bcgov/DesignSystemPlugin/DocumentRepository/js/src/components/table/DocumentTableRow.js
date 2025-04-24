import { Button, CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';

// Safe render component to prevent crashes from individual row errors
class SafeRender extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Row Render Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="document-table-row error" role="row">
                    <div className="document-table-cell" role="cell" style={{ textAlign: 'center' }}>
                        {__('Error rendering document row.', 'bcgov-design-system')}
                        {process.env.NODE_ENV === 'development' && (
                            <pre>{this.state.error?.toString()}</pre>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DocumentTableRow = ({
    document,
    isSelected,
    onSelect,
    metadataFields,
    isSpreadsheetMode,
    bulkEditedMetadata,
    onMetadataChange,
    onEdit,
    onDelete,
    isDeleting
}) => {
    return (
        <SafeRender key={document.id} rowKey={document.id}>
            <div className="document-table-row" role="row">
                <div className="document-table-cell" role="cell" onClick={(e) => e.stopPropagation()}>
                    <CheckboxControl
                        checked={isSelected}
                        onChange={() => onSelect(document.id)}
                    />
                </div>
                <div className="document-table-cell" role="cell">
                    {document.title || document.filename}
                </div>
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
                                    onChange={(value) => onMetadataChange(document.id, field.id, value)}
                                />
                            ) : field.type === 'date' ? (
                                <TextControl
                                    type="text"
                                    value={bulkEditedMetadata[document.id]?.[field.id] || ''}
                                    onChange={(value) => onMetadataChange(document.id, field.id, value)}
                                    className="metadata-input"
                                />
                            ) : (
                                <TextControl
                                    value={bulkEditedMetadata[document.id]?.[field.id] || ''}
                                    onChange={(value) => onMetadataChange(document.id, field.id, value)}
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
                <div className="document-table-cell actions" role="cell" onClick={(e) => e.stopPropagation()}>
                    {!isSpreadsheetMode && (
                        <div className="action-buttons">
                            <Button
                                variant="secondary"
                                onClick={() => window.open(document.metadata.document_file_url, '_blank')}
                                className="icon-button"
                                title={__('Download', 'bcgov-design-system')}
                                aria-label={__('Download', 'bcgov-design-system')}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
                                </svg>
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => onEdit(document)}
                                className="icon-button"
                                title={__('Edit Metadata', 'bcgov-design-system')}
                                aria-label={__('Edit Metadata', 'bcgov-design-system')}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                                </svg>
                            </Button>
                            <Button
                                isDestructive
                                onClick={() => onDelete(document)}
                                disabled={isDeleting}
                                className="icon-button"
                                title={__('Delete', 'bcgov-design-system')}
                                aria-label={__('Delete', 'bcgov-design-system')}
                            >
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                                </svg>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </SafeRender>
    );
};

export default DocumentTableRow; 