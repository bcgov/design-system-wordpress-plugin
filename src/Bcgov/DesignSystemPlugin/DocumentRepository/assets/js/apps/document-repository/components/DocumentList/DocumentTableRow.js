import {
	Button,
	CheckboxControl,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * DocumentTableRow Component
 *
 * A row component that displays a single document's information and actions.
 * Handles both display and editing of document metadata in spreadsheet mode.
 *
 * @component
 * @param {Object}   props                    - Component props
 * @param {Object}   props.document           - The document object containing all document data
 * @param {boolean}  props.isSelected         - Whether this document is currently selected
 * @param {Function} props.onSelect           - Callback when the document's selection state changes
 * @param {Function} props.onDelete           - Callback when the document is deleted
 * @param {Function} props.onEdit             - Callback when the document is edited
 * @param {boolean}  props.isDeleting         - Flag indicating if a delete operation is in progress
 * @param {Array}    props.metadataFields     - Array of metadata field definitions
 * @param {boolean}  props.isSpreadsheetMode  - Flag indicating if table is in spreadsheet mode
 * @param {Object}   props.bulkEditedMetadata - Object containing bulk edited metadata values
 * @param {Function} props.onMetadataChange   - Callback when metadata is changed in spreadsheet mode
 * @param {Function} props.formatFileSize     - Function to format file size for display
 * @return {JSX.Element} Rendered document table row
 */
const DocumentTableRow = ( {
	document,
	isSelected,
	onSelect,
	onDelete,
	onEdit,
	isDeleting,
	metadataFields,
	isSpreadsheetMode,
	bulkEditedMetadata,
	onMetadataChange,
	formatFileSize,
} ) => (
	<div className="document-table-row" role="row">
		{ /* Selection checkbox cell */ }
		<div
			className="document-table-cell"
			role="cell"
			onClick={ ( e ) => e.stopPropagation() }
		>
			<CheckboxControl
				checked={ isSelected }
				onChange={ () => onSelect( document.id ) }
			/>
		</div>

		{ /* Document title cell */ }
		<div className="document-table-cell" role="cell">
			{ document.title || document.filename }
		</div>

		{ /* Metadata cells - dynamically rendered based on metadata fields */ }
		{ metadataFields.map( ( field ) => (
			<div
				key={ field.id }
				className="document-table-cell metadata-column"
				role="cell"
				onClick={ ( e ) => e.stopPropagation() }
			>
				{ isSpreadsheetMode ? (
					// Spreadsheet mode: Render editable controls based on field type
					field.type === 'select' ? (
						<SelectControl
							value={
								bulkEditedMetadata[ document.id ]?.[
									field.id
								] || ''
							}
							options={ [
								{
									label: __(
										'Select…',
										'bcgov-design-system'
									),
									value: '',
								},
								...( Array.isArray( field.options )
									? ( field.options || [] ).map(
											( option ) => ( {
												label: option,
												value: option,
											} )
									  )
									: Object.entries( field.options || {} ).map(
											( [ value, label ] ) => ( {
												label,
												value,
											} )
									  ) ),
							] }
							onChange={ ( value ) =>
								onMetadataChange( document.id, field.id, value )
							}
						/>
					) : field.type === 'date' ? (
						<TextControl
							type="date"
							value={
								bulkEditedMetadata[ document.id ]?.[
									field.id
								] || ''
							}
							onChange={ ( value ) =>
								onMetadataChange( document.id, field.id, value )
							}
							className="metadata-input"
						/>
					) : (
						<TextControl
							value={
								bulkEditedMetadata[ document.id ]?.[
									field.id
								] || ''
							}
							onChange={ ( value ) =>
								onMetadataChange( document.id, field.id, value )
							}
							className="metadata-input"
						/>
					)
				) : // Regular mode: Display metadata value or dash if empty
				document.metadata && document.metadata[ field.id ] ? (
					document.metadata[ field.id ]
				) : (
					'—'
				) }
			</div>
		) ) }

		{ /* File size cell */ }
		<div className="document-table-cell" role="cell">
			{ document.metadata && document.metadata.document_file_size
				? formatFileSize( document.metadata.document_file_size )
				: '—' }
		</div>

		{ /* File type cell */ }
		<div className="document-table-cell" role="cell">
			{ document.metadata && document.metadata.document_file_type
				? document.metadata.document_file_type
				: '—' }
		</div>

		{ /* Actions cell - only shown in regular mode */ }
		<div
			className="document-table-cell actions"
			role="cell"
			onClick={ ( e ) => e.stopPropagation() }
		>
			{ ! isSpreadsheetMode && (
				<div className="action-buttons">
					{ /* Download button */ }
					<Button
						onClick={ () =>
							window.open(
								document.metadata.document_file_url,
								'_blank'
							)
						}
						className="doc-repo-button icon-button table-action-button"
						title={ __( 'Download', 'bcgov-design-system' ) }
						aria-label={ __( 'Download', 'bcgov-design-system' ) }
					>
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path
								d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
								fill="currentColor"
							/>
						</svg>
					</Button>

					{ /* Edit button */ }
					<Button
						onClick={ () => onEdit( document ) }
						className="doc-repo-button icon-button table-action-button"
						title={ __( 'Edit Metadata', 'bcgov-design-system' ) }
						aria-label={ __(
							'Edit Metadata',
							'bcgov-design-system'
						) }
					>
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path
								d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
								fill="currentColor"
							/>
						</svg>
					</Button>

					{ /* Delete button */ }
					<Button
						className="doc-repo-button icon-button delete-button table-action-button"
						onClick={ () => onDelete( document ) }
						disabled={ isDeleting }
						title={ __( 'Delete', 'bcgov-design-system' ) }
						aria-label={ __( 'Delete', 'bcgov-design-system' ) }
					>
						<svg viewBox="0 0 24 24" width="16" height="16">
							<path
								d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
								fill="currentColor"
							/>
						</svg>
					</Button>
				</div>
			) }
		</div>
	</div>
);

export default DocumentTableRow;
