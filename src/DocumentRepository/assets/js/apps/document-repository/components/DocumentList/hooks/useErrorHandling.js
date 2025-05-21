import { useState, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Custom hook for error handling and operation retries
 *
 * @param {Object}   options                    Options for the hook
 * @param {Function} options.onShowNotification Function to show notifications
 * @return {Object} Error handling state and functions
 */
const useErrorHandling = ( { onShowNotification } ) => {
	const [ failedOperations, setFailedOperations ] = useState( [] );
	const [ retryCount, setRetryCount ] = useState( {} );

	/**
	 * Handles errors and tracks failed operations
	 * @param {string}        operationType           - Type of operation that failed (delete, metadata, upload)
	 * @param {number|string} documentId              - ID of the document or operation that failed
	 * @param {Error|Object}  error                   - Error object
	 * @param {Object}        options                 - Additional options
	 * @param {boolean}       options.addToRetryQueue - Whether to add to the retry queue
	 * @param {boolean}       options.showNotice      - Whether to show a notification
	 * @param {string}        options.customMessage   - Custom message to display instead of the default
	 */
	const handleOperationError = useCallback(
		( operationType, documentId, error, options = {} ) => {
			const {
				addToRetryQueue = true,
				showNotice = true,
				customMessage = null,
			} = options;

			// Add to retry queue if needed
			if ( addToRetryQueue ) {
				setFailedOperations( ( prev ) => [
					...prev,
					{ type: operationType, documentId, error },
				] );
				setRetryCount( ( prev ) => ( {
					...prev,
					[ documentId ]: ( prev[ documentId ] || 0 ) + 1,
				} ) );
			}

			// Show notification if needed
			if ( showNotice && onShowNotification ) {
				const errorMessage =
					customMessage ||
					error.message ||
					error.data?.message ||
					__( 'An unknown error occurred.', 'bcgov-design-system' );

				onShowNotification(
					'error',
					documentId
						? sprintf(
								/* translators: %1$d: document ID, %2$s: error message */
								__(
									'Operation failed for document %1$d: %2$s',
									'bcgov-design-system'
								),
								documentId,
								errorMessage
						  )
						: errorMessage
				);
			}
		},
		[ onShowNotification ]
	);

	/**
	 * Retry a specific failed operation
	 * @param {Object} operation - The operation to retry
	 * @param {Object} handlers  - Handlers for different operation types
	 */
	const retryOperation = useCallback(
		async ( operation, handlers ) => {
			const maxRetries = 3;
			if ( retryCount[ operation.documentId ] >= maxRetries ) {
				onShowNotification(
					'error',
					sprintf(
						/* translators: %1$d: document ID */
						__(
							'Maximum retry attempts reached for document %1$d',
							'bcgov-design-system'
						),
						operation.documentId
					)
				);
				return;
			}

			try {
				const handler = handlers[ operation.type ];
				if ( handler ) {
					await handler( operation.documentId );
				} else {
					return {
						error: `Unknown operation type: ${ operation.type }`,
					};
				}

				// Remove from failed operations if successful
				setFailedOperations( ( prev ) =>
					prev.filter(
						( op ) =>
							! (
								op.type === operation.type &&
								op.documentId === operation.documentId
							)
					)
				);
			} catch ( error ) {
				handleOperationError(
					operation.type,
					operation.documentId,
					error
				);
			}
		},
		[ retryCount, handleOperationError, onShowNotification ]
	);

	/**
	 * Retry all failed operations
	 * @param {Object} handlers - Handlers for different operation types
	 */
	const retryAllOperations = useCallback(
		( handlers ) => {
			failedOperations.forEach( ( operation ) =>
				retryOperation( operation, handlers )
			);
		},
		[ failedOperations, retryOperation ]
	);

	return {
		failedOperations,
		handleOperationError,
		retryOperation,
		retryAllOperations,
	};
};

export default useErrorHandling;
