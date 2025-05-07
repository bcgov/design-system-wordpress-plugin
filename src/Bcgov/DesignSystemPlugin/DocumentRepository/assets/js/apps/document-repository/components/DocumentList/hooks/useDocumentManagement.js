import { useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Custom hook for document management operations
 *
 * @param {Object}   options                    Options for the hook
 * @param {Function} options.onDelete           Function to delete a document
 * @param {Function} options.onSelectAll        Function to select/deselect all documents
 * @param {Function} options.onShowNotification Function to show notifications
 * @param {Function} options.onError            Function to handle errors
 * @return {Object} Document management state and functions
 */
const useDocumentManagement = ( {
	onDelete,
	onSelectAll,
	onShowNotification,
	onError,
} ) => {
	const [ deleteDocument, setDeleteDocument ] = useState( null );
	const [ bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen ] =
		useState( false );
	const [ isMultiDeleting, setIsMultiDeleting ] = useState( false );

	/**
	 * Handle bulk deletion of documents
	 * @param {Array} selectedDocuments Array of document IDs to delete
	 */
	const handleBulkDelete = useCallback(
		async ( selectedDocuments ) => {
			if ( ! selectedDocuments || selectedDocuments.length === 0 ) {
				return;
			}

			setIsMultiDeleting( true );

			try {
				await Promise.all(
					selectedDocuments.map( ( docId ) => onDelete( docId ) )
				);
				setBulkDeleteConfirmOpen( false );
				onSelectAll( false );

				if ( onShowNotification ) {
					onShowNotification(
						'success',
						__(
							'Selected documents were deleted successfully.',
							'bcgov-design-system'
						)
					);
				}
			} catch ( error ) {
				if ( onError ) {
					onError( 'bulk-delete', null, error, {
						addToRetryQueue: false,
						customMessage: __(
							'Error deleting one or more documents.',
							'bcgov-design-system'
						),
					} );
				}
			} finally {
				setIsMultiDeleting( false );
			}
		},
		[ onDelete, onSelectAll, onShowNotification, onError ]
	);

	/**
	 * Delete a single document
	 * @param {number} documentId Document ID to delete
	 */
	const handleSingleDelete = useCallback(
		async ( documentId ) => {
			try {
				await onDelete( documentId );
				setDeleteDocument( null );

				if ( onShowNotification ) {
					onShowNotification(
						'success',
						__(
							'Document deleted successfully.',
							'bcgov-design-system'
						)
					);
				}
			} catch ( error ) {
				if ( onError ) {
					onError( 'delete', documentId, error, {
						customMessage: sprintf(
							/* translators: %1$d: document ID, %2$s: error message */
							__(
								'Error deleting document %1$d: %2$s',
								'bcgov-design-system'
							),
							documentId,
							error.message ||
								__(
									'An unknown error occurred',
									'bcgov-design-system'
								)
						),
					} );
				}
			}
		},
		[ onDelete, onShowNotification, onError ]
	);

	/**
	 * Open bulk delete confirmation dialog
	 */
	const openBulkDeleteConfirm = useCallback( () => {
		setBulkDeleteConfirmOpen( true );
	}, [] );

	/**
	 * Close bulk delete confirmation dialog
	 */
	const closeBulkDeleteConfirm = useCallback( () => {
		setBulkDeleteConfirmOpen( false );
	}, [] );

	return {
		// State
		deleteDocument,
		bulkDeleteConfirmOpen,
		isMultiDeleting,

		// Actions
		setDeleteDocument,
		handleBulkDelete,
		handleSingleDelete,
		openBulkDeleteConfirm,
		closeBulkDeleteConfirm,
	};
};

export default useDocumentManagement;
