/**
 * Custom hook for managing document data and operations
 *
 * Provides a centralized way to manage document-related state and operations
 * including fetching, updating, and deleting documents. Handles pagination,
 * loading states, and error handling.
 *
 * @module useDocuments
 * @return {Object} Document management utilities and state
 * @property {Array}       documents           - List of documents
 * @property {number}      totalDocuments      - Total number of documents
 * @property {number}      currentPage         - Current page number
 * @property {number}      totalPages          - Total number of pages
 * @property {boolean}     isLoading           - Loading state flag
 * @property {boolean}     isDeleting          - Deletion in progress flag
 * @property {string|null} error               - Error message if any
 * @property {Object}      searchParams        - Current search parameters
 * @property {Function}    setSearchParams     - Update search parameters
 * @property {Function}    fetchDocuments      - Fetch documents from API
 * @property {Function}    deleteDocument      - Delete a single document
 * @property {Function}    updateDocument      - Update a single document
 * @property {Function}    bulkUpdateDocuments - Update multiple documents
 * @property {Function}    bulkDeleteDocuments - Delete multiple documents
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Hook to manage document data and operations
 *
 * @return {Object} Document data and operations
 */
export const useDocuments = () => {
	// Document data state
	const [ documents, setDocuments ] = useState( [] );
	const [ totalDocuments, setTotalDocuments ] = useState( 0 );
	const [ currentPage, setCurrentPage ] = useState( 1 );
	const [ totalPages, setTotalPages ] = useState( 1 );

	// Loading and error states
	const [ isLoading, setIsLoading ] = useState( false );
	const [ isDeleting, setIsDeleting ] = useState( false );
	const [ error, setError ] = useState( null );

	// Search and pagination parameters
	const [ searchParams, setSearchParams ] = useState( {
		page: 1,
		per_page: window.documentRepositorySettings?.perPage || 20,
		orderby: 'date',
		order: 'DESC',
	} );

	/**
	 * Fetch documents from the API
	 *
	 * Retrieves documents based on current search parameters.
	 * Updates document list, pagination info, and loading states.
	 *
	 * @async
	 * @function fetchDocuments
	 * @throws {Error} If API request fails or response is invalid
	 */
	const fetchDocuments = useCallback( async () => {
		if ( ! window.documentRepositorySettings?.apiNamespace ) {
			setError(
				'Document Repository settings not found. Make sure the script is properly enqueued in WordPress.'
			);
			return;
		}

		setIsLoading( true );
		setError( null );

		try {
			const { apiNamespace } = window.documentRepositorySettings;

			// Build query string for pagination
			const queryParams = new URLSearchParams();

			// Add all parameters to query
			Object.entries( searchParams ).forEach( ( [ key, value ] ) => {
				if ( value ) {
					queryParams.append( key, value );
				}
			} );

			// Add timeout to prevent indefinite loading
			const timeoutPromise = new Promise( ( _, reject ) => {
				setTimeout( () => {
					reject(
						new Error(
							'Document fetch request timed out. Please try again.'
						)
					);
				}, 5000 ); // 5 second timeout
			} );

			// Fetch documents from API with timeout
			const response = await Promise.race( [
				apiFetch( {
					path: `/${ apiNamespace }/documents?${ queryParams.toString() }`,
				} ),
				timeoutPromise,
			] );

			// Validate the response structure
			if ( ! response || typeof response !== 'object' ) {
				throw new Error( 'Invalid response from server' );
			}

			// Ensure documents is an array and each item has required properties
			const validDocuments = Array.isArray( response.documents )
				? response.documents.filter(
						( doc ) => doc && typeof doc === 'object' && doc.id
				  )
				: [];

			// Update state with fetched data
			setDocuments( validDocuments );
			setTotalDocuments( response.total || 0 );
			setCurrentPage( response.current_page || 1 );
			setTotalPages( response.total_pages || 1 );

			// If we got no documents but the page number is greater than 1,
			// we should reset to page 1
			if ( validDocuments.length === 0 && searchParams.page > 1 ) {
				setSearchParams( ( prev ) => ( {
					...prev,
					page: 1,
				} ) );
			}
		} catch ( err ) {
			setError( err.message || 'Error loading documents' );
			// Don't clear the documents array on error to prevent UI flicker
			// Only update if we're on page 1
			if ( searchParams.page === 1 ) {
				setDocuments( [] );
				setTotalDocuments( 0 );
				setTotalPages( 1 );
			}
		} finally {
			setIsLoading( false );
		}
	}, [ searchParams ] );

	// Update current page when search params change
	useEffect( () => {
		const newPage = parseInt( searchParams.page, 10 );
		if ( ! isNaN( newPage ) && newPage !== currentPage ) {
			setCurrentPage( newPage );
		}
	}, [ searchParams.page, currentPage ] );

	// Fetch documents when search parameters change
	useEffect( () => {
		fetchDocuments();
	}, [ fetchDocuments ] );

	/**
	 * Delete a document
	 *
	 * @async
	 * @function deleteDocument
	 * @param {number} documentId - Document ID to delete
	 * @return {Promise<boolean>} Success status
	 * @throws {Error} If deletion fails
	 */
	const deleteDocument = async ( documentId ) => {
		setIsDeleting( true );

		try {
			const { apiNamespace } = window.documentRepositorySettings;

			// Delete document from API
			await apiFetch( {
				path: `/${ apiNamespace }/documents/${ documentId }`,
				method: 'DELETE',
			} );

			// Refresh documents list
			await fetchDocuments();
			setIsDeleting( false );
			return true;
		} catch ( err ) {
			setError( err.message || 'Error deleting document' );
			setIsDeleting( false );
			return false;
		}
	};

	/**
	 * Update a document
	 *
	 * @async
	 * @function updateDocument
	 * @param {number} documentId - Document ID to update
	 * @param {Object} data       - Document data to update
	 * @return {Promise<Object|null>} Updated document or null on error
	 * @throws {Error} If update fails
	 */
	const updateDocument = async ( documentId, data ) => {
		try {
			const { apiNamespace } = window.documentRepositorySettings;

			// Update document via API
			const response = await apiFetch( {
				path: `/${ apiNamespace }/documents/${ documentId }`,
				method: 'PUT',
				data,
			} );

			// Refresh documents list
			await fetchDocuments();
			return response;
		} catch ( err ) {
			setError( err.message || 'Error updating document' );
			return null;
		}
	};

	/**
	 * Bulk update documents
	 *
	 * @async
	 * @function bulkUpdateDocuments
	 * @param {Array<number>} documentIds - Document IDs to update
	 * @param {Object}        data        - Data to update for all documents
	 * @return {Promise<boolean>} Success status
	 * @throws {Error} If bulk update fails
	 */
	const bulkUpdateDocuments = async ( documentIds, data ) => {
		try {
			// Update each document sequentially
			for ( const id of documentIds ) {
				await updateDocument( id, data );
			}

			// Refresh documents list
			await fetchDocuments();
			return true;
		} catch ( err ) {
			setError( err.message || 'Error performing bulk update' );
			return false;
		}
	};

	/**
	 * Bulk delete documents
	 *
	 * @async
	 * @function bulkDeleteDocuments
	 * @param {Array<number>} documentIds - Document IDs to delete
	 * @return {Promise<boolean>} Success status
	 * @throws {Error} If bulk delete fails
	 */
	const bulkDeleteDocuments = async ( documentIds ) => {
		try {
			// Delete each document sequentially
			for ( const id of documentIds ) {
				await deleteDocument( id );
			}

			return true;
		} catch ( err ) {
			setError( err.message || 'Error performing bulk delete' );
			return false;
		}
	};

	return {
		// Document data
		documents,
		totalDocuments,
		currentPage,
		totalPages,

		// Loading states
		isLoading,
		isDeleting,
		error,

		// Search and filter parameters
		searchParams,
		setSearchParams,

		// Document operations
		fetchDocuments,
		deleteDocument,
		updateDocument,
		bulkUpdateDocuments,
		bulkDeleteDocuments,
	};
};
