import { CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import SafeRender from './SafeRender';
import DocumentTableRow from './DocumentTableRow';

const DocumentTable = ({
    documents,
    selectedDocuments,
    onSelectDocument,
    onSelectAll,
    onDelete,
    onEdit,
    isDeleting,
    metadataFields,
    isSpreadsheetMode,
    bulkEditedMetadata,
    onMetadataChange,
    formatFileSize
}) => {
    const allSelected = documents.length > 0 && selectedDocuments.length === documents.length;

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
                        {__('Actions', 'bcgov-design-system')}
                    </div>
                </div>
            </div>
            
            {/* Table body */}
            <div className="document-table-body" role="rowgroup">
                {documents.map((document) => (
                    <SafeRender key={document.id}>
                        <DocumentTableRow
                            document={document}
                            isSelected={selectedDocuments.includes(document.id)}
                            onSelect={onSelectDocument}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            isDeleting={isDeleting}
                            metadataFields={metadataFields}
                            isSpreadsheetMode={isSpreadsheetMode}
                            bulkEditedMetadata={bulkEditedMetadata}
                            onMetadataChange={onMetadataChange}
                            formatFileSize={formatFileSize}
                        />
                    </SafeRender>
                ))}
            </div>
        </div>
    );
};

export default DocumentTable; 