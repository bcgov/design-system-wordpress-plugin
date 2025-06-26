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
 * @property {Function} createField - Adds a metadata field to the API
 * @property {Function} deleteField - Deletes a metadata field from the API
 * @property {Function} editField   - Edits a metadata field in the API
 *
 * @example
 * const { fetchFields, createField, deleteField, editField } = useMetadataAPI();
 *
 * // Fetch fields
 * const { success, data, error } = await fetchFields();
 *
 * // Add a field
 * const { success, error } = await createField(newField);
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
	 * Create a new metadata field via the API
	 *
	 * Sends a request to add a new metadata field to the server.
	 *
	 * @async
	 * @function createField
	 * @param {Object}  field               - The metadata field to create
	 * @param {string}  field.id            - The unique ID of the new field
	 * @param {string}  field.label         - The user-facing label for the field
	 * @param {string}  field.type          - The type of the field (e.g., 'text', 'select', 'date')
	 * @param {Array}   [field.options]     - Options for select-type fields
	 * @param {string}  [field.description] - Optional description of the field
	 * @param {boolean} [field.required]    - Whether the field is required
	 * @return {Promise<Object>} Response object
	 * @return {boolean} response.success - Whether the operation succeeded
	 * @return {string} [response.error] - Error message if unsuccessful
	 */
	const createField = useCallback(
		async ( field ) => {
			try {
				await apiFetch( {
					path: `/${ apiNamespace }/metadata-fields`,
					method: 'POST',
					data: field,
				} );
				return { success: true };
			} catch ( err ) {
				return {
					success: false,
					error:
						err.message ||
						__(
							'Error creating metadata field',
							'bcgov-design-system'
						),
				};
			}
		},
		[ apiNamespace ]
	);

	/**
	 * Delete a metadata field from the API
	 *
	 * Sends a request to delete the specified metadata field by ID.
	 *
	 * @async
	 * @function deleteField
	 * @param {string} id - The ID of the metadata field to delete
	 * @return {Promise<Object>} Response object
	 * @return {boolean} response.success - Whether the operation succeeded
	 * @return {string} [response.error] - Error message if unsuccessful
	 */
	const deleteField = useCallback(
		async ( id ) => {
			try {
				await apiFetch( {
					path: `/${ apiNamespace }/metadata-fields/${ id }`,
					method: 'DELETE',
				} );
				return { success: true };
			} catch ( err ) {
				return {
					success: false,
					error:
						err.message ||
						__(
							'Error deleting metadata field',
							'bcgov-design-system'
						),
				};
			}
		},
		[ apiNamespace ]
	);

	/**
	 * Edit a single metadata field to the API
	 *
	 * Updates a specific metadata field on the server using its ID.
	 *
	 * @async
	 * @function editField
	 * @param {Object}  field               - The metadata field to edit
	 * @param {string}  field.id            - The unique ID of the field
	 * @param {string}  field.label         - The user-facing label for the field
	 * @param {string}  field.type          - The type of the field (e.g., 'text', 'select', 'date')
	 * @param {Array}   [field.options]     - Options for select-type fields
	 * @param {string}  [field.description] - Optional description of the field
	 * @param {boolean} [field.required]    - Whether the field is required
	 * @return {Promise<Object>} Response object
	 * @return {boolean} response.success - Whether the operation succeeded
	 * @return {string} [response.error] - Error message if unsuccessful
	 */
	const editField = useCallback(
		async ( field ) => {
			try {
				await apiFetch( {
					path: `/${ apiNamespace }/metadata-fields/${ field.id }`,
					method: 'PUT',
					data: field,
				} );
				return { success: true };
			} catch ( err ) {
				return {
					success: false,
					error:
						err.message ||
						__(
							'Error saving metadata field',
							'bcgov-design-system'
						),
				};
			}
		},
		[ apiNamespace ]
	);

	return { fetchFields, createField, deleteField, editField };
};
