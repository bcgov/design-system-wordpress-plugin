import {
	useState,
	useEffect,
	useCallback,
	useReducer,
} from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Metadata reducer for handling metadata state
 * @param {Object}  state                      - The current state
 * @param {Object}  action                     - The action to perform
 * @param {string}  action.type                - The type of action
 * @param {*}       action.payload             - The payload for the action
 * @param {Object}  [action.initialValues]     - Initial values for editing
 * @param {Object}  [action.initialBulkValues] - Initial values for bulk editing
 * @param {string}  [action.documentId]        - Document ID for bulk updates
 * @param {string}  [action.fieldId]           - Field ID for bulk updates
 * @param {*}       [action.value]             - New value for bulk updates
 * @param {boolean} [action.hasChanges]        - Whether there are changes
 * @return {Object} The new state
 */
const metadataReducer = ( state, action ) => {
	switch ( action.type ) {
		case 'SET_EDITING_DOCUMENT':
			return {
				...state,
				editingMetadata: action.payload,
				editedValues: action.initialValues || {},
				errors: {},
			};
		case 'CLEAR_EDITING_DOCUMENT':
			return {
				...state,
				editingMetadata: null,
				editedValues: {},
				errors: {},
			};
		case 'UPDATE_EDITED_VALUES':
			return {
				...state,
				editedValues: {
					...state.editedValues,
					...action.payload,
				},
			};
		case 'SET_ERRORS':
			return {
				...state,
				errors: action.payload,
			};
		case 'SET_IS_SAVING':
			return {
				...state,
				isSaving: action.payload,
			};
		case 'ENTER_SPREADSHEET_MODE':
			return {
				...state,
				isSpreadsheetMode: true,
				bulkEditedMetadata: action.initialBulkValues || {},
				hasMetadataChanges: false,
			};
		case 'EXIT_SPREADSHEET_MODE':
			return {
				...state,
				isSpreadsheetMode: false,
				bulkEditedMetadata: {},
				hasMetadataChanges: false,
			};
		case 'UPDATE_BULK_METADATA':
			return {
				...state,
				bulkEditedMetadata: {
					...state.bulkEditedMetadata,
					[ action.documentId ]: {
						...state.bulkEditedMetadata[ action.documentId ],
						[ action.fieldId ]: action.value,
					},
				},
				hasMetadataChanges: action.hasChanges,
			};
		case 'SET_IS_SAVING_BULK':
			return {
				...state,
				isSavingBulk: action.payload,
			};
		case 'CLEAR_BULK_CHANGES':
			return {
				...state,
				bulkEditedMetadata: {},
				hasMetadataChanges: false,
			};
		default:
			return state;
	}
};

/**
 * Custom hook for managing document metadata
 *
 * @param {Object}   options                    Options for the hook
 * @param {Array}    options.documents          Current documents array
 * @param {Array}    options.metadataFields     Metadata field definitions
 * @param {string}   options.apiNamespace       API namespace for metadata operations
 * @param {Function} options.onUpdateDocuments  Callback when documents are updated
 * @param {Function} options.onError            Callback for error handling
 * @param {Function} options.onShowNotification Callback for showing notifications
 * @return {Object} Metadata management state and functions
 */
const useMetadataManagement = ( {
	documents = [],
	metadataFields = [],
	apiNamespace,
	onUpdateDocuments,
	onError,
	onShowNotification,
} ) => {
	// Use reducer for all metadata-related state
	const [ metadataState, dispatch ] = useReducer( metadataReducer, {
		// Single document editing
		editingMetadata: null,
		editedValues: {},
		errors: {},
		isSaving: false,

		// Spreadsheet mode - critical for keeping the save button functionality
		isSpreadsheetMode: false,
		bulkEditedMetadata: {},
		hasMetadataChanges: false,
		isSavingBulk: false,
	} );

	// Maintain local copy of documents
	const [ localDocuments, setLocalDocuments ] = useState( documents );

	// Keep local documents in sync with documents prop
	useEffect( () => {
		setLocalDocuments( documents );
	}, [ documents ] );

	/**
	 * Check if metadata values have changed
	 */
	const hasMetadataChanged = useCallback( () => {
		const { editingMetadata, editedValues } = metadataState;

		if ( ! editingMetadata ) {
			return false;
		}

		return metadataFields.some( ( field ) => {
			const currentValue = editingMetadata.metadata?.[ field.id ] || '';
			const editedValue = editedValues[ field.id ] || '';
			return currentValue !== editedValue;
		} );
	}, [ metadataState, metadataFields ] );

	/**
	 * Start editing a document's metadata
	 * @param {Object} document The document to edit
	 */
	const handleEditMetadata = useCallback(
		( document ) => {
			// If document is null, clear the editing state
			if ( ! document ) {
				dispatch( { type: 'CLEAR_EDITING_DOCUMENT' } );
				return;
			}

			const documentToEdit = {
				...document,
				upload_date:
					document.date ||
					document.upload_date ||
					document.metadata?.upload_date,
			};

			// Initialize edited values with current metadata, preserving case
			const initialValues = {};
			metadataFields.forEach( ( field ) => {
				initialValues[ field.id ] =
					document.metadata?.[ field.id ] ?? '';
			} );

			dispatch( {
				type: 'SET_EDITING_DOCUMENT',
				payload: documentToEdit,
				initialValues,
			} );
		},
		[ metadataFields ]
	);

	/**
	 * Handle metadata field value change
	 * @param {number} documentId Document ID
	 * @param {string} fieldId    Field ID
	 * @param {string} value      New value
	 */
	const handleMetadataChange = useCallback(
		( documentId, fieldId, value ) => {
			// Update bulk edited metadata
			const newBulkMetadata = {
				...metadataState.bulkEditedMetadata,
				[ documentId ]: {
					...metadataState.bulkEditedMetadata[ documentId ],
					[ fieldId ]: value,
				},
			};

			// Check if any metadata has changed
			const hasChanges = Object.entries( newBulkMetadata ).some(
				( [ docId, editedMetadata ] ) => {
					const currentDoc = localDocuments.find(
						( doc ) => doc.id === parseInt( docId )
					);
					if ( ! currentDoc ) {
						return false;
					}

					return Object.entries( editedMetadata ).some(
						( [ currentFieldId, editedValue ] ) => {
							const originalValue =
								currentDoc.metadata?.[ currentFieldId ] || '';
							const isChanged =
								String( originalValue ) !==
								String( editedValue );
							return isChanged;
						}
					);
				}
			);

			// Update state with changed value and hasChanges flag
			dispatch( {
				type: 'UPDATE_BULK_METADATA',
				documentId,
				fieldId,
				value,
				hasChanges,
			} );

			// Always update local documents to reflect changes in the UI
			setLocalDocuments( ( prev ) => {
				const newDocs = prev.map( ( doc ) => {
					if ( doc.id === documentId ) {
						return {
							...doc,
							metadata: {
								...doc.metadata,
								[ fieldId ]: value,
							},
						};
					}
					return doc;
				} );
				return newDocs;
			} );
		},
		[ localDocuments, metadataState.bulkEditedMetadata, dispatch ]
	);

	/**
	 * Update a single field value when editing a single document
	 * @param {string} fieldId Field ID
	 * @param {string} value   New value
	 */
	const updateEditedField = useCallback(
		( fieldId, value ) => {
			dispatch( {
				type: 'UPDATE_EDITED_VALUES',
				payload: { [ fieldId ]: value },
			} );
		},
		[ dispatch ]
	);

	/**
	 * Save metadata changes for a single document
	 */
	const handleSaveMetadata = useCallback( async () => {
		const { editingMetadata, editedValues } = metadataState;

		if ( ! editingMetadata ) {
			return;
		}

		dispatch( { type: 'SET_IS_SAVING', payload: true } );

		try {
			await apiFetch( {
				path: `/${ apiNamespace }/documents/${ editingMetadata.id }/metadata`,
				method: 'POST',
				data: editedValues,
			} );

			// Update local documents
			setLocalDocuments( ( prev ) =>
				prev.map( ( doc ) =>
					doc.id === editingMetadata.id
						? {
								...doc,
								metadata: { ...doc.metadata, ...editedValues },
						  }
						: doc
				)
			);

			// Update parent component if needed
			if ( typeof onUpdateDocuments === 'function' ) {
				onUpdateDocuments(
					localDocuments.map( ( doc ) =>
						doc.id === editingMetadata.id
							? {
									...doc,
									metadata: {
										...doc.metadata,
										...editedValues,
									},
							  }
							: doc
					)
				);
			}

			// Reset editing state
			dispatch( { type: 'CLEAR_EDITING_DOCUMENT' } );

			// Show success notification
			if ( onShowNotification ) {
				onShowNotification(
					'success',
					__(
						'Document metadata updated successfully',
						'bcgov-design-system'
					)
				);
			}
		} catch ( error ) {
			if ( error.data?.errors ) {
				dispatch( { type: 'SET_ERRORS', payload: error.data.errors } );
			}

			if ( onError ) {
				onError( 'metadata', editingMetadata.id, error, {
					customMessage:
						error.data?.message ||
						__(
							'Failed to update metadata',
							'bcgov-design-system'
						),
				} );
			}
		} finally {
			dispatch( { type: 'SET_IS_SAVING', payload: false } );
		}
	}, [
		metadataState,
		apiNamespace,
		localDocuments,
		onUpdateDocuments,
		onShowNotification,
		onError,
		dispatch,
	] );

	/**
	 * Toggle spreadsheet mode on/off
	 * @param {boolean} enabled Whether to enable spreadsheet mode
	 */
	const toggleSpreadsheetMode = useCallback(
		( enabled ) => {
			if ( enabled ) {
				// Initialize bulk edit metadata when entering spreadsheet mode
				const initialBulkMetadata = {};
				localDocuments.forEach( ( doc ) => {
					initialBulkMetadata[ doc.id ] = {
						...( doc.metadata || {} ),
					};
				} );

				dispatch( {
					type: 'ENTER_SPREADSHEET_MODE',
					initialBulkValues: initialBulkMetadata,
				} );
			} else {
				dispatch( { type: 'EXIT_SPREADSHEET_MODE' } );
			}
		},
		[ localDocuments ]
	);

	/**
	 * Save all bulk metadata changes
	 */
	const handleSaveBulkChanges = useCallback( async () => {
		const { bulkEditedMetadata } = metadataState;

		dispatch( { type: 'SET_IS_SAVING_BULK', payload: true } );

		try {
			const results = await Promise.allSettled(
				Object.entries( bulkEditedMetadata ).map(
					( [ docId, metadata ] ) =>
						apiFetch( {
							path: `/${ apiNamespace }/documents/${ docId }/metadata`,
							method: 'POST',
							data: metadata,
						} )
				)
			);

			// Process results
			const failed = results
				.map( ( result, index ) => ( {
					result,
					docId: Object.keys( bulkEditedMetadata )[ index ],
				} ) )
				.filter( ( { result } ) => result.status === 'rejected' );

			if ( failed.length > 0 ) {
				// Handle failed operations
				failed.forEach( ( { result, docId } ) => {
					if ( onError ) {
						onError( 'metadata', docId, result.reason, {
							showNotice: false, // Don't show individual notices
						} );
					}
				} );

				// Show summary notification
				if ( onShowNotification ) {
					onShowNotification(
						'warning',
						sprintf(
							/* translators: %1$d: number of failed updates, %2$d: total number of updates */
							__(
								'%1$d of %2$d metadata updates failed. You can retry the failed operations.',
								'bcgov-design-system'
							),
							failed.length,
							Object.keys( bulkEditedMetadata ).length
						),
						0 // Don't auto-dismiss
					);
				}
			} else {
				// All updates successful
				if ( onShowNotification ) {
					onShowNotification(
						'success',
						__(
							'All metadata changes saved successfully.',
							'bcgov-design-system'
						)
					);
				}

				// Clear bulk changes state
				dispatch( { type: 'CLEAR_BULK_CHANGES' } );

				// Exit spreadsheet mode
				dispatch( { type: 'EXIT_SPREADSHEET_MODE' } );
			}
		} catch ( error ) {
			if ( onError ) {
				onError( 'bulk-metadata', null, error );
			}
		} finally {
			dispatch( { type: 'SET_IS_SAVING_BULK', payload: false } );
		}
	}, [ metadataState, apiNamespace, onError, onShowNotification ] );

	return {
		// Single document editing
		editingMetadata: metadataState.editingMetadata,
		editedValues: metadataState.editedValues,
		errors: metadataState.errors,
		isSaving: metadataState.isSaving,
		hasMetadataChanged,
		handleEditMetadata,
		updateEditedField,
		handleSaveMetadata,

		// Spreadsheet mode
		isSpreadsheetMode: metadataState.isSpreadsheetMode,
		hasMetadataChanges: metadataState.hasMetadataChanges,
		bulkEditedMetadata: metadataState.bulkEditedMetadata,
		isSavingBulk: metadataState.isSavingBulk,
		handleMetadataChange,
		toggleSpreadsheetMode,
		handleSaveBulkChanges,

		// Document state
		localDocuments,
	};
};

export default useMetadataManagement;
