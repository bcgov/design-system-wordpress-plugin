import { CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import SafeRender from './SafeRender';
import DocumentTableRow from './DocumentTableRow';

/**
 * DocumentTable Component
 *
 * A table component that displays a list of documents with their metadata and actions.
 * Supports both regular and spreadsheet modes for metadata editing.
 *
 * @param {Object}   props                    - Component props
 * @param {Array}    props.documents          - List of document objects to display
 * @param {Array}    props.selectedDocuments  - Array of selected document IDs
 * @param {Function} props.onSelectDocument   - Callback when a document is selected
 * @param {Function} props.onSelectAll        - Callback when all documents are selected/deselected
 * @param {Function} props.onDelete           - Callback when a document is deleted
 * @param {Function} props.onEdit             - Callback when a document is edited
 * @param {boolean}  props.isDeleting         - Flag indicating if a delete operation is in progress
 * @param {Array}    props.metadataFields     - Array of metadata field definitions
 * @param {boolean}  props.isSpreadsheetMode  - Flag indicating if table is in spreadsheet mode
 * @param {Object}   props.bulkEditedMetadata - Object containing bulk edited metadata values
 * @param {Function} props.onMetadataChange   - Callback when metadata is changed in spreadsheet mode
 * @param {Function} props.formatFileSize     - Function to format file size for display
 * @return {JSX.Element} Rendered document table
 */
function DocumentTable( {
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
	formatFileSize,
} ) {
	// Check if all documents are currently selected
	const allSelected =
		documents.length > 0 && selectedDocuments.length === documents.length;

	return (
		<div className="document-table" role="table">
			{ /* Table header with column titles and select all checkbox */ }
			<div className="document-table-header" role="rowgroup">
				<div className="document-table-row" role="row">
					{ /* Select all checkbox column */ }
					<div
						className="document-table-cell header"
						role="columnheader"
					>
						<CheckboxControl
							checked={ allSelected }
							onChange={ onSelectAll }
						/>
					</div>
					{ /* Document title column */ }
					<div
						className="document-table-cell header"
						role="columnheader"
					>
						{ __( 'Title', 'bcgov-design-system' ) }
					</div>
					{ /* Metadata columns */ }
					{ metadataFields.map( ( field ) => (
						<div
							key={ field.id }
							className="document-table-cell header metadata-column"
							role="columnheader"
						>
							{ field.label }
						</div>
					) ) }
					{ /* File size column */ }
					<div
						className="document-table-cell header"
						role="columnheader"
					>
						{ __( 'Size', 'bcgov-design-system' ) }
					</div>
					{ /* File type column */ }
					<div
						className="document-table-cell header"
						role="columnheader"
					>
						{ __( 'Type', 'bcgov-design-system' ) }
					</div>
					{ /* Actions column */ }
					<div
						className="document-table-cell header"
						role="columnheader"
					>
						{ __( 'Actions', 'bcgov-design-system' ) }
					</div>
				</div>
			</div>

			{ /* Table body containing document rows */ }
			<div className="document-table-body" role="rowgroup">
				{ documents.map( ( document ) => (
					<SafeRender key={ document.id }>
						<DocumentTableRow
							document={ document }
							isSelected={ selectedDocuments.includes(
								document.id
							) }
							onSelect={ onSelectDocument }
							onDelete={ onDelete }
							onEdit={ onEdit }
							isDeleting={ isDeleting }
							metadataFields={ metadataFields }
							isSpreadsheetMode={ isSpreadsheetMode }
							bulkEditedMetadata={ bulkEditedMetadata }
							onMetadataChange={ onMetadataChange }
							formatFileSize={ formatFileSize }
						/>
					</SafeRender>
				) ) }
			</div>
		</div>
	);
}

export { DocumentTable as default };
