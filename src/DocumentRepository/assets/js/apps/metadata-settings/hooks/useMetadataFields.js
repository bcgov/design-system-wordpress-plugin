import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

/**
 * Custom hook for managing metadata fields
 *
 * @return {Object} Field management methods and state
 */
const useMetadataFields = () => {
	const [ state, setState ] = useState( {
		fields: [],
		isLoading: true,
		error: null,
		isSaving: false,
		modals: {
			add: {
				isOpen: false,
				field: {
					id: '',
					label: '',
					type: 'text',
					options: [],
					_rawOptionsText: '',
				},
				errors: {
					label: '',
					submit: '',
				},
			},
			edit: {
				isOpen: false,
				field: null,
				index: null,
				errors: {
					label: '',
					submit: '',
				},
				originalValues: null,
			},
			delete: {
				isOpen: false,
				field: null,
			},
		},
	} );

	const { apiNamespace } = window.documentRepositorySettings;

	// Fetch fields from the API
	const fetchFields = useCallback( async () => {
		try {
			const fields = await apiFetch( {
				path: `/${ apiNamespace }/metadata-fields`,
			} );
			setState( ( prev ) => ( {
				...prev,
				fields,
				error: null,
				isLoading: false,
			} ) );
			return { success: true, data: fields };
		} catch ( err ) {
			setState( ( prev ) => ( {
				...prev,
				error:
					err.message ||
					__(
						'Error loading metadata fields',
						'bcgov-design-system'
					),
				isLoading: false,
			} ) );
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

	// Save a new metadata field via the API
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

	// Delete a field from the API
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

	// Edit a field from the API
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
							'Error editing metadata field',
							'bcgov-design-system'
						),
				};
			}
		},
		[ apiNamespace ]
	);

	// Validate a field
	const validateField = useCallback(
		( field, existingFields = [], currentIndex = null ) => {
			const errors = {};

			if ( ! field.id ) {
				errors.id = __( 'Field ID is required', 'bcgov-design-system' );
			}

			if ( ! field.label ) {
				errors.label = __(
					'Field label is required',
					'bcgov-design-system'
				);
			}

			// Check for duplicate labels (case-insensitive)
			const hasDuplicateLabel = existingFields.some(
				( existing, index ) =>
					index !== currentIndex &&
					existing.label.toLowerCase() === field.label.toLowerCase()
			);

			if ( hasDuplicateLabel ) {
				errors.label = __(
					'A field with this label already exists',
					'bcgov-design-system'
				);
			}

			// Check for duplicate IDs
			const hasDuplicateId = existingFields.some(
				( existing, index ) =>
					index !== currentIndex && existing.id === field.id
			);

			if ( hasDuplicateId ) {
				errors.id = __(
					'A field with this ID already exists',
					'bcgov-design-system'
				);
			}

			if (
				field.type === 'taxonomy' &&
				( ! field.options || field.options.length === 0 )
			) {
				errors.options = __(
					'Taxonomy fields require at least one term',
					'bcgov-design-system'
				);
			}

			return errors;
		},
		[]
	);

	// Get initial field state
	const getInitialFieldState = useCallback(
		() => ( {
			id: '',
			label: '',
			type: 'text',
			options: [],
			_rawOptionsText: '',
		} ),
		[]
	);

	return {
		state,
		setState,
		fetchFields,
		createField,
		deleteField,
		editField,
		validateField,
		getInitialFieldState,
	};
};

export default useMetadataFields;
