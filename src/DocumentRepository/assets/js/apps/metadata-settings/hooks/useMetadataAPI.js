/**
 * Custom hook for managing metadata field API interactions
 *
 * Provides methods for fetching and saving metadata field configurations
 * through the WordPress REST API. Handles error cases and provides
 * consistent response formats.
 *
 * @module useMetadataAPI
 * @return {Object} API interaction methods
 * @property {Function} fetchFields - Fetches metadata fields from the API
 * @property {Function} saveFields  - Saves metadata fields to the API
 *
 * @example
 * const { fetchFields, saveFields } = useMetadataAPI();
 *
 * // Fetch fields
 * const { success, data, error } = await fetchFields();
 *
 * // Save fields
 * const { success, error } = await saveFields(updatedFields);
 */

import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Hook to manage metadata field API interactions
 *
 * @return {Object} API interaction methods
 */
export const useMetadataAPI = () => {
	const { apiNamespace } = window.documentRepositorySettings;

	/**
	 * Fetch metadata fields from the API
	 *
	 * Retrieves the current metadata field configuration from the server.
	 *
	 * @async
	 * @function fetchFields
	 * @return {Promise<Object>} Response object
	 * @return {boolean} response.success - Whether the operation succeeded
	 * @return {Array} [response.data] - Array of metadata fields if successful
	 * @return {string} [response.error] - Error message if unsuccessful
	 */
	const fetchFields = useCallback( async () => {
		try {
			const fields = await apiFetch( {
				path: `/${ apiNamespace }/metadata-fields`,
			} );
			return { success: true, data: fields };
		} catch ( err ) {
			return {
				success: false,
				error:
					err.message ||
					__(
						'Error loading metadata fields',
						'bcgov-design-system'
					),
			};
		}
	}, [ apiNamespace ] );

	/**
	 * Save metadata fields to the API
	 *
	 * Updates the metadata field configuration on the server.
	 *
	 * @async
	 * @function saveFields
	 * @param {Array} fields - Array of metadata field configurations to save
	 * @return {Promise<Object>} Response object
	 * @return {boolean} response.success - Whether the operation succeeded
	 * @return {string} [response.error] - Error message if unsuccessful
	 */
	const saveFields = useCallback(
		async ( fields ) => {
			try {
				await apiFetch( {
					path: `/${ apiNamespace }/metadata-fields`,
					method: 'PUT',
					data: { fields },
				} );
				return { success: true };
			} catch ( err ) {
				return {
					success: false,
					error:
						err.message ||
						__(
							'Error saving metadata fields',
							'bcgov-design-system'
						),
				};
			}
		},
		[ apiNamespace ]
	);

	return { fetchFields, saveFields };
};
