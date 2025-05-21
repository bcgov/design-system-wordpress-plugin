/**
 * VirtualDocumentTable Component
 *
 * A performance-optimized version of DocumentTable that uses virtualization
 * to render only the visible rows in the viewport, greatly improving
 * performance for large document lists.
 */

import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CheckboxControl } from '@wordpress/components';
import useVirtualization from './hooks/useVirtualization';

/**
 * VirtualDocumentTable Component
 *
 * @param {Object}   props                    Component props
 * @param {Array}    props.documents          List of documents to display
 * @param {Array}    props.selectedDocuments  Array of selected document IDs
 * @param {Function} props.onSelectDocument   Callback when a document is selected
 * @param {Function} props.onSelectAll        Callback to select all documents
 * @param {Function} props.onDelete           Callback to delete a document
 * @param {Function} props.onEdit             Callback to edit a document
 * @param {boolean}  props.isDeleting         Flag indicating if a delete operation is in progress
 * @param {Array}    props.metadataFields     Array of metadata field definitions
 * @param {boolean}  props.isSpreadsheetMode  Flag indicating if spreadsheet mode is active
 * @param {Object}   props.bulkEditedMetadata Object containing bulk edited metadata values
 * @param {Function} props.onMetadataChange   Callback when metadata is changed in spreadsheet mode
 * @param {Function} props.formatFileSize     Function to format file size
 */
const VirtualDocumentTable = ( {
	documents = [],
	selectedDocuments = [],
	onSelectDocument,
	onSelectAll,
	onDelete,
	onEdit,
	isDeleting = false,
	metadataFields = [],
	isSpreadsheetMode = false,
	bulkEditedMetadata = {},
	onMetadataChange,
	formatFileSize,
} ) => {
	// Use virtualization hook
	const { containerRef, visibleRange, totalHeight, topOffset } =
		useVirtualization( {
			itemHeight: 60, // Height of each row in pixels
			itemCount: documents.length,
			overscan: 5, // Number of extra rows to render above/below viewport
			initialHeight: 500, // Initial container height
		} );

	// Handle select all checkbox
	const handleSelectAll = useCallback(
		( isChecked ) => {
			onSelectAll( isChecked );
		},
		[ onSelectAll ]
	);

	// Check if all documents are selected
	const areAllSelected =
		documents.length > 0 && selectedDocuments.length === documents.length;

	// Check if some documents are selected
	const areSomeSelected =
		selectedDocuments.length > 0 &&
		selectedDocuments.length < documents.length;

	// Render only the visible rows
	const visibleDocuments = documents.slice(
		visibleRange.start,
		visibleRange.end
	);

	return (
		<div className="virtualized-table-container" ref={ containerRef }>
			<table className="document-table">
				<thead className="document-table__header">
					<tr>
						<th className="checkbox-column">
							<CheckboxControl
								checked={ areAllSelected }
								indeterminate={ areSomeSelected }
								onChange={ handleSelectAll }
							/>
						</th>
						<th>{ __( 'Document', 'bcgov-design-system' ) }</th>
						{ metadataFields.map( ( field ) => (
							<th key={ field.id }>{ field.label }</th>
						) ) }
						<th>{ __( 'File Size', 'bcgov-design-system' ) }</th>
						<th className="actions-column">
							{ __( 'Actions', 'bcgov-design-system' ) }
						</th>
					</tr>
				</thead>
				<tbody
					style={ {
						height: `${ totalHeight }px`,
						position: 'relative',
					} }
				>
					{ documents.length === 0 ? (
						<tr>
							<td
								colSpan={ metadataFields.length + 4 }
								className="empty-state"
							>
								{ __(
									'No documents found.',
									'bcgov-design-system'
								) }
							</td>
						</tr>
					) : (
						<div
							className="virtualized-rows"
							style={ {
								position: 'absolute',
								top: `${ topOffset }px`,
								width: '100%',
							} }
						>
							{ visibleDocuments.map( ( document ) => {
								const isSelected = selectedDocuments.includes(
									document.id
								);
								const rowClass = isSelected
									? 'document-table__row document-table__row--selected'
									: 'document-table__row';

								return (
									<tr
										key={ document.id }
										className={ rowClass }
									>
										<td className="checkbox-column">
											<CheckboxControl
												checked={ isSelected }
												onChange={ () =>
													onSelectDocument(
														document.id
													)
												}
											/>
										</td>
										<td>
											<div className="document-cell">
												<span className="document-cell__title">
													{ document.title ||
														document.filename ||
														__(
															'Untitled',
															'bcgov-design-system'
														) }
												</span>
												<span className="document-cell__metadata">
													{ document.filename ||
														document.title ||
														__(
															'No filename',
															'bcgov-design-system'
														) }
												</span>
											</div>
										</td>

										{ /* Render metadata fields */ }
										{ metadataFields.map( ( field ) => {
											const fieldValue =
												document.metadata?.[
													field.id
												] || '';
											const cellValue = isSpreadsheetMode
												? bulkEditedMetadata[
														document.id
												  ]?.[ field.id ] ?? fieldValue
												: fieldValue;

											if ( isSpreadsheetMode ) {
												return (
													<td
														key={ field.id }
														className="editable-cell"
													>
														<input
															type="text"
															className="editable-field"
															value={ cellValue }
															onChange={ ( e ) =>
																onMetadataChange(
																	document.id,
																	field.id,
																	e.target
																		.value
																)
															}
														/>
													</td>
												);
											}

											return (
												<td key={ field.id }>
													{ cellValue }
												</td>
											);
										} ) }

										<td className="file-size">
											{ document.metadata
												?.document_file_size
												? formatFileSize(
														parseInt(
															document.metadata
																.document_file_size
														)
												  )
												: __(
														'N/A',
														'bcgov-design-system'
												  ) }
										</td>
										<td className="actions-column">
											<div className="action-buttons">
												<button
													className="edit-button"
													onClick={ () =>
														onEdit( document )
													}
													title={ __(
														'Edit Document',
														'bcgov-design-system'
													) }
												>
													<svg
														viewBox="0 0 24 24"
														width="24"
														height="24"
													>
														<path
															fill="currentColor"
															d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
														/>
													</svg>
												</button>
												{ document.metadata
													?.document_file_url && (
													<a
														href={
															document.metadata
																.document_file_url
														}
														target="_blank"
														rel="noopener noreferrer"
														className="view-button"
														title={ __(
															'View Document',
															'bcgov-design-system'
														) }
													>
														<svg
															viewBox="0 0 24 24"
															width="24"
															height="24"
														>
															<path
																fill="currentColor"
																d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
															/>
														</svg>
													</a>
												) }
												<button
													className="delete-button"
													onClick={ () =>
														onDelete( document )
													}
													disabled={ isDeleting }
													title={ __(
														'Delete Document',
														'bcgov-design-system'
													) }
												>
													<svg
														viewBox="0 0 24 24"
														width="24"
														height="24"
													>
														<path
															fill="currentColor"
															d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
														/>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								);
							} ) }
						</div>
					) }
				</tbody>
			</table>
		</div>
	);
};

export default VirtualDocumentTable;
