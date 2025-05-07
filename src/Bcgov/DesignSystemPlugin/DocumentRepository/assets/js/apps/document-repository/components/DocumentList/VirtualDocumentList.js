/**
 * VirtualDocumentList Component
 *
 * A component that combines the virtualization capabilities of VirtualList
 * with the functionality of the DocumentList component.
 */

import { useCallback } from '@wordpress/element';
import PropTypes from 'prop-types';
import VirtualList from './VirtualList';

/**
 * Loading spinner component for the virtual list
 */
const LoadingSpinner = () => (
	<div className="virtual-list__loading">
		<div className="virtual-list__loading-spinner" />
	</div>
);

/**
 * Empty state component for the virtual list
 * @param {Object} root0         - The props object
 * @param {string} root0.message - The message to display
 */
const EmptyState = ( { message } ) => (
	<div className="virtual-list__empty">
		<p>{ message }</p>
	</div>
);

/**
 * VirtualDocumentList component for efficient rendering of large document lists
 * @param {Object}        root0                   - The props object
 * @param {Array<Object>} root0.documents         - Array of document objects to render
 * @param {boolean}       root0.isLoading         - Whether the document list is loading
 * @param {Function}      root0.onSelectDocument  - Function called when a document is selected
 * @param {Function}      root0.onDeleteDocument  - Function called when a document is deleted
 * @param {Function}      root0.onEditDocument    - Function called when a document is edited
 * @param {Array<Object>} root0.selectedDocuments - Array of currently selected documents
 * @param {number}        root0.itemHeight        - Height of each document row in pixels
 * @param {number}        root0.listHeight        - Fixed height for the list container
 * @param {string}        root0.emptyMessage      - Message to display when no documents are found
 * @param {boolean}       root0.showCheckboxes    - Whether to show checkboxes for selection
 * @param {Function}      root0.renderActions     - Custom function to render action buttons for each document
 * @param {string}        root0.className         - Additional class name for the component
 * @param {number}        root0.overscan          - Number of items to render outside the visible area
 */
const VirtualDocumentList = ( {
	documents,
	isLoading,
	onSelectDocument,
	onDeleteDocument,
	onEditDocument,
	selectedDocuments,
	itemHeight = 60,
	listHeight = 500, // Fixed height or null for auto
	emptyMessage = 'No documents found.',
	showCheckboxes = true,
	renderActions,
	className = '',
	// Virtualization props
	overscan = 5,
} ) => {
	// Extract document ID for key
	const keyExtractor = useCallback( ( document ) => {
		return document?.id || document?.ID || `document-${ Math.random() }`;
	}, [] );

	// Check if a document is selected
	const isDocumentSelected = useCallback(
		( document ) => {
			if ( ! selectedDocuments || ! document ) {
				return false;
			}
			const documentId = document.id || document.ID;
			return selectedDocuments.some(
				( d ) => ( d.id || d.ID ) === documentId
			);
		},
		[ selectedDocuments ]
	);

	// Render a single document row
	const renderDocument = useCallback(
		( { item: document, style } ) => {
			if ( ! document ) {
				return null;
			}

			const isSelected = isDocumentSelected( document );
			const documentId = document.id || document.ID;

			return (
				<div
					className={ `virtual-list__item ${
						isSelected ? 'selected' : ''
					}` }
					style={ style }
				>
					<div className="document-row">
						{ showCheckboxes && (
							<div className="document-row__checkbox">
								<input
									type="checkbox"
									id={ `document-${ documentId }` }
									checked={ isSelected }
									onChange={ () =>
										onSelectDocument( document )
									}
									aria-label={ `Select ${
										document.title || document.post_title
									}` }
								/>
								<label
									htmlFor={ `document-${ documentId }` }
									className="visually-hidden"
								>
									Select{ ' ' }
									{ document.title || document.post_title }
								</label>
							</div>
						) }

						<div
							className="document-row__title"
							onClick={ () => onSelectDocument( document ) }
							onKeyDown={ ( e ) => {
								if ( e.key === 'Enter' || e.key === ' ' ) {
									onSelectDocument( document );
								}
							} }
							role="button"
							tabIndex={ 0 }
						>
							{ document.title || document.post_title }
						</div>

						<div className="document-row__meta">
							<span className="document-row__date">
								{ document.date ||
									document.post_date ||
									'No date' }
							</span>
						</div>

						<div className="document-row__actions">
							{ renderActions ? (
								renderActions( document )
							) : (
								<>
									<button
										onClick={ () =>
											onEditDocument( document )
										}
										className="document-row__action-btn document-row__action-btn--edit"
										aria-label={ `Edit ${
											document.title ||
											document.post_title
										}` }
									>
										Edit
									</button>
									<button
										onClick={ () =>
											onDeleteDocument( document )
										}
										className="document-row__action-btn document-row__action-btn--delete"
										aria-label={ `Delete ${
											document.title ||
											document.post_title
										}` }
									>
										Delete
									</button>
								</>
							) }
						</div>
					</div>
				</div>
			);
		},
		[
			isDocumentSelected,
			showCheckboxes,
			onSelectDocument,
			onEditDocument,
			onDeleteDocument,
			renderActions,
		]
	);

	return (
		<div className={ `virtual-document-list ${ className }` }>
			<VirtualList
				items={ documents }
				itemHeight={ itemHeight }
				renderItem={ renderDocument }
				className="virtual-document-list__items"
				containerClassName="virtual-document-list__container"
				listHeight={ listHeight }
				overscan={ overscan }
				emptyMessage={ <EmptyState message={ emptyMessage } /> }
				loadingComponent={ <LoadingSpinner /> }
				isLoading={ isLoading }
				keyExtractor={ keyExtractor }
			/>
		</div>
	);
};

VirtualDocumentList.propTypes = {
	/** Array of document objects to render */
	documents: PropTypes.array.isRequired,

	/** Whether the document list is loading */
	isLoading: PropTypes.bool,

	/** Function called when a document is selected */
	onSelectDocument: PropTypes.func.isRequired,

	/** Function called when a document is deleted */
	onDeleteDocument: PropTypes.func.isRequired,

	/** Function called when a document is edited */
	onEditDocument: PropTypes.func.isRequired,

	/** Array of currently selected documents */
	selectedDocuments: PropTypes.array,

	/** Height of each document row in pixels */
	itemHeight: PropTypes.number,

	/** Fixed height for the list container */
	listHeight: PropTypes.number,

	/** Message to display when no documents are found */
	emptyMessage: PropTypes.string,

	/** Whether to show checkboxes for selection */
	showCheckboxes: PropTypes.bool,

	/** Custom function to render action buttons for each document */
	renderActions: PropTypes.func,

	/** Additional class name for the component */
	className: PropTypes.string,

	/** Number of items to render outside the visible area */
	overscan: PropTypes.number,
};

export default VirtualDocumentList;
