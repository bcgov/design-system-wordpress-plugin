/**
 * Metadata Settings Application
 *
 * Main application component for managing document metadata fields.
 * Provides functionality for adding, editing, deleting, and reordering
 * metadata fields that can be associated with documents.
 *
 * @module MetadataApp
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	TextControl,
	SelectControl,
	Notice,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import MetadataModal from '../shared/components/MetadataModal';
import DeleteFieldModal from './components/Modals/DeleteFieldModal';

/**
 * Metadata List Component
 *
 * Container component for displaying a list of metadata fields.
 *
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to render
 * @return {JSX.Element} Metadata list container
 */
const MetadataList = ( { children } ) => (
	<div className="metadata-fields-list">{ children }</div>
);

/**
 * Metadata Item Component
 *
 * Individual metadata field item with move controls.
 *
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to render
 * @return {JSX.Element} Metadata item with move controls
 */
const MetadataItem = ( { children } ) => (
	<div className="metadata-field-item">
		<div className="metadata-field-info">{ children }</div>
	</div>
);

/**
 * Field Type Options
 *
 * Available metadata field types and their display labels.
 *
 * @constant {Object} FIELD_TYPES
 * @property {string} text   - Text field type
 * @property {string} select - Select/dropdown field type
 * @property {string} date   - Date field type
 */
const FIELD_TYPES = {
	text: __( 'Text', 'bcgov-design-system' ),
	select: __( 'Select', 'bcgov-design-system' ),
	date: __( 'Date', 'bcgov-design-system' ),
};

/**
 * Custom hook for metadata API operations
 *
 * Provides methods for fetching and saving metadata fields.
 *
 * @function useMetadataAPI
 * @return {Object} API methods
 * @return {Function} fetchFields - Fetches metadata fields
 * @return {Function} saveFields - Saves metadata fields
 */
const useMetadataAPI = () => {
	const { apiNamespace } = window.documentRepositorySettings;

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

/**
 * Validates a metadata field configuration
 *
 * @function validateField
 * @param {Object} field               - Field configuration to validate
 * @param {Array}  [existingFields=[]] - Existing fields for duplicate checking
 * @param {number} [currentIndex=null] - Current field index
 * @return {Object} Validation errors
 */
const validateField = ( field, existingFields = [], currentIndex = null ) => {
	const errors = {};

	if ( ! field.id ) {
		errors.id = __( 'Field ID is required', 'bcgov-design-system' );
	}

	if ( ! field.label ) {
		errors.label = __( 'Field label is required', 'bcgov-design-system' );
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
		field.type === 'select' &&
		( ! field.options || field.options.length === 0 )
	) {
		errors.options = __(
			'Select fields require at least one option',
			'bcgov-design-system'
		);
	}

	return errors;
};

/**
 * Updates modal field state
 *
 * @function updateModalField
 * @param {Object} state     - Current state
 * @param {string} modalType - Type of modal (add/edit)
 * @param {Object} updates   - Field updates to apply
 * @return {Object} Updated state
 */
const updateModalField = ( state, modalType, updates ) => ( {
	...state,
	modals: {
		...state.modals,
		[ modalType ]: {
			...state.modals[ modalType ],
			field: {
				...state.modals[ modalType ].field,
				...updates,
			},
		},
	},
} );

/**
 * Gets initial state for a new field
 *
 * @function getInitialFieldState
 * @return {Object} Initial field state
 */
const getInitialFieldState = () => ( {
	id: '',
	label: '',
	type: 'text',
	options: [],
	_rawOptionsText: '',
} );

/**
 * Main Metadata Settings Application Component
 *
 * @return {JSX.Element} Metadata settings application
 */
const MetadataApp = () => {
	// Consolidated state
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
			},
			delete: {
				isOpen: false,
				field: null,
			},
		},
	} );

	// API hooks
	const { fetchFields, saveFields } = useMetadataAPI();

	// Load fields on mount
	useEffect( () => {
		const loadFields = async () => {
			const result = await fetchFields();
			setState( ( prev ) => ( {
				...prev,
				fields: result.success ? result.data : [],
				error: result.success ? null : result.error,
				isLoading: false,
			} ) );
		};

		loadFields();
	}, [ fetchFields ] );

	// Memoized handlers
	const handleOptionsChange = useCallback( ( value, modalType ) => {
		const options = value
			.split( '\n' )
			.map( ( line ) => line.trim() )
			.filter( ( line ) => line.length > 0 );

		setState( ( prev ) => ( {
			...prev,
			modals: {
				...prev.modals,
				[ modalType ]: {
					...prev.modals[ modalType ],
					field: {
						...prev.modals[ modalType ].field,
						_rawOptionsText: value,
						options,
					},
				},
			},
		} ) );
	}, [] );

	const handleAddField = useCallback( async () => {
		const { field } = state.modals.add;
		const errors = validateField( field, state.fields );

		if ( Object.keys( errors ).length > 0 ) {
			setState( ( prev ) => ( {
				...prev,
				modals: {
					...prev.modals,
					add: {
						...prev.modals.add,
						errors,
					},
				},
			} ) );
			return;
		}

		setState( ( prev ) => ( { ...prev, isSaving: true } ) );

		try {
			const result = await saveFields( [
				...state.fields,
				{ ...field, order: state.fields.length },
			] );

			if ( result.success ) {
				setState( ( prev ) => ( {
					...prev,
					fields: [
						...prev.fields,
						{ ...field, order: prev.fields.length },
					],
					isSaving: false,
					modals: {
						...prev.modals,
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
					},
				} ) );
			} else {
				setState( ( prev ) => ( {
					...prev,
					isSaving: false,
					modals: {
						...prev.modals,
						add: {
							...prev.modals.add,
							errors: {
								submit:
									result.error ||
									__(
										'Failed to save field',
										'bcgov-design-system'
									),
							},
						},
					},
				} ) );
			}
		} catch ( error ) {
			setState( ( prev ) => ( {
				...prev,
				isSaving: false,
				modals: {
					...prev.modals,
					add: {
						...prev.modals.add,
						errors: {
							submit:
								error.message ||
								__(
									'Failed to save field',
									'bcgov-design-system'
								),
						},
					},
				},
			} ) );
		}
	}, [ state.modals.add, state.modals.add.field, state.fields, saveFields ] );

	// Handle editing a field
	const handleEditField = ( field, index ) => {
		// Store original values for comparison
		const originalFieldValues = {
			label: field.label || '',
			type: field.type || '',
			options: field.options || [],
			_rawOptionsText: field._rawOptionsText || '',
			id: field.id || '',
		};

		setOriginalValues( originalFieldValues );

		setState( ( prev ) => ( {
			...prev,
			modals: {
				...prev.modals,
				edit: {
					isOpen: true,
					field: { ...field },
					index,
				},
			},
		} ) );
	};

	// Handle saving edited field
	const handleSaveEditedField = async () => {
		const { field, index } = state.modals.edit;
		const errors = validateField( field, state.fields, index );

		if ( Object.keys( errors ).length > 0 ) {
			setState( ( prev ) => ( { ...prev, error: errors } ) );
			return;
		}

		setState( ( prev ) => ( { ...prev, isSaving: true } ) );

		const result = await saveFields( [
			...state.fields.slice( 0, index ),
			field,
			...state.fields.slice( index + 1 ),
		] );

		if ( result.success ) {
			setState( ( prev ) => ( {
				...prev,
				fields: [
					...state.fields.slice( 0, index ),
					field,
					...state.fields.slice( index + 1 ),
				],
				error: null,
				isSaving: false,
				modals: {
					...prev.modals,
					edit: {
						isOpen: false,
						field: null,
						index: null,
					},
				},
			} ) );
		} else {
			setState( ( prev ) => ( {
				...prev,
				error: result.error,
				isSaving: false,
			} ) );
		}
	};

	// Handle deleting a field
	const handleDeleteField = async ( field ) => {
		setState( ( prev ) => ( {
			...prev,
			modals: {
				...prev.modals,
				delete: {
					isOpen: true,
					field,
				},
			},
		} ) );
	};

	// Handle confirming field deletion
	const handleConfirmDelete = async () => {
		const fieldId = state.modals.delete.field.id;
		setState( ( prev ) => ( { ...prev, isSaving: true } ) );

		try {
			// First, delete the field from all documents
			await apiFetch( {
				path: `/${ window.documentRepositorySettings.apiNamespace }/metadata-fields/${ fieldId }/cleanup`,
				method: 'DELETE',
			} );

			// Then update the fields list
			const updatedFields = state.fields.filter(
				( field ) => field.id !== fieldId
			);
			const result = await saveFields( updatedFields );

			if ( result.success ) {
				setState( ( prev ) => ( {
					...prev,
					fields: updatedFields,
					isSaving: false,
					error: null,
					modals: {
						...prev.modals,
						delete: {
							isOpen: false,
							field: null,
						},
					},
				} ) );
			} else {
				setState( ( prev ) => ( {
					...prev,
					error: result.error,
					isSaving: false,
				} ) );
			}
		} catch ( error ) {
			setState( ( prev ) => ( {
				...prev,
				error:
					error.message ||
					__(
						'Error deleting metadata field',
						'bcgov-design-system'
					),
				isSaving: false,
			} ) );
		}
	};

	// Handle closing delete modal
	const handleCloseDeleteModal = () => {
		setState( ( prev ) => ( {
			...prev,
			modals: {
				...prev.modals,
				delete: {
					isOpen: false,
					field: null,
				},
			},
		} ) );
	};

	// Format options array to string for textarea
	const formatOptionsToString = ( field ) => {
		if ( field._rawOptionsText !== undefined ) {
			return field._rawOptionsText;
		}
		return Array.isArray( field.options ) ? field.options.join( '\n' ) : '';
	};

	// Simplified state updates using helper functions
	const [ hasChanges, setHasChanges ] = useState( false );
	const [ originalValues, setOriginalValues ] = useState( null );

	// Add function to check if any field values have changed from original
	const checkForChanges = useCallback(
		( modalType, currentValues ) => {
			if ( ! originalValues ) {
				return false;
			}

			// Compare each field with its original value
			const fieldsToCompare = [
				'label',
				'type',
				'options',
				'_rawOptionsText',
			];
			const fieldHasChanges = fieldsToCompare.some( ( field ) => {
				const original = String( originalValues[ field ] || '' ).trim();
				const current = String( currentValues[ field ] || '' ).trim();
				const isDifferent = original !== current;

				return isDifferent;
			} );

			setHasChanges( fieldHasChanges );
		},
		[ originalValues ]
	);

	// Update handleFieldChange to preserve exact case
	const handleFieldChange = useCallback(
		( modalType, field, value ) => {
			setState( ( prev ) => {
				const currentField = prev.modals[ modalType ].field;
				let updates = { [ field ]: value };

				// If the field being changed is the label, generate ID but preserve label case
				if ( field === 'label' ) {
					// Only transform the ID, not the label
					const baseId = value
						.toLowerCase()
						.replace( /[^a-z0-9]+/g, '_' );
					const fieldType = currentField.type.toLowerCase();
					const generatedId = `${ baseId }_${ fieldType }`;
					updates = {
						...updates,
						id: generatedId,
					};
				}
				// If the type is being changed, update the ID
				if ( field === 'type' ) {
					const baseId =
						currentField.label
							?.toLowerCase()
							.replace( /[^a-z0-9]+/g, '_' ) || '';
					const generatedId = `${ baseId }_${ value.toLowerCase() }`;
					updates = {
						...updates,
						id: generatedId,
					};
				}

				const updatedField = {
					...currentField,
					...updates,
				};

				// Check for changes against original values
				checkForChanges( modalType, updatedField );

				return updateModalField( prev, modalType, updates );
			} );
		},
		[ checkForChanges ]
	);

	// Reset states when modal closes
	const handleModalClose = useCallback( ( modalType ) => {
		setState( ( prev ) => ( {
			...prev,
			modals: {
				...prev.modals,
				[ modalType ]: {
					...prev.modals[ modalType ],
					isOpen: false,
					field: getInitialFieldState(),
					errors: {
						label: '',
						submit: '',
					},
				},
			},
		} ) );
		setHasChanges( false );
		setOriginalValues( null );
	}, [] );

	if ( state.isLoading ) {
		return (
			<div className="dswp-document-metadata-settings">
				<div className="metadata-settings-loading">
					<div className="spinner-wrapper">
						<div className="components-spinner" />
					</div>
					<p>
						{ __(
							'Loading metadata fields…',
							'bcgov-design-system'
						) }
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="dswp-document-metadata-settings">
			<div className="metadata-settings">
				{ state.error && (
					<Notice status="error" isDismissible={ false }>
						<p>{ state.error }</p>
					</Notice>
				) }

				<Card>
					<CardHeader>
						<h2>
							{ __(
								'Document Metadata Fields',
								'bcgov-design-system'
							) }
						</h2>
						<Button
							className="doc-repo-button save-button"
							onClick={ () =>
								setState( ( prev ) => ( {
									...prev,
									modals: {
										...prev.modals,
										add: {
											isOpen: true,
											field: getInitialFieldState(),
											errors: {
												label: '',
												submit: '',
											},
										},
									},
								} ) )
							}
							disabled={ state.isSaving }
						>
							{ __( 'Add New Field', 'bcgov-design-system' ) }
						</Button>
					</CardHeader>

					<CardBody>
						<div className="metadata-fields-info">
							<p>
								{ __(
									'Customize the metadata fields that will be available for documents.',
									'bcgov-design-system'
								) }
							</p>
						</div>

						{ state.fields.length === 0 ? (
							<div className="no-fields-message">
								<p>
									{ __(
										'No custom metadata fields defined yet. Click "Add New Field" to create one.',
										'bcgov-design-system'
									) }
								</p>
							</div>
						) : (
							<MetadataList>
								{ state.fields.map( ( field, index ) => (
									<MetadataItem key={ field.id }>
										<div className="metadata-field-info">
											<h3>{ field.label }</h3>
											<p className="field-id">
												ID: { field.id }
											</p>
											<p className="field-type">
												Type:{ ' ' }
												{ FIELD_TYPES[ field.type ] }
											</p>
										</div>
										<div className="metadata-field-actions">
											<Button
												className="doc-repo-button edit-button"
												onClick={ () =>
													handleEditField(
														field,
														index
													)
												}
											>
												{ __(
													'Edit',
													'bcgov-design-system'
												) }
											</Button>
											<Button
												className="doc-repo-button delete-button"
												onClick={ () =>
													handleDeleteField( field )
												}
												disabled={ state.isSaving }
											>
												{ __(
													'Delete',
													'bcgov-design-system'
												) }
											</Button>
										</div>
									</MetadataItem>
								) ) }
							</MetadataList>
						) }
					</CardBody>
				</Card>

				{ /* Edit Field Modal */ }
				<MetadataModal
					title={ __( 'Edit Metadata Field', 'bcgov-design-system' ) }
					isOpen={ state.modals.edit.isOpen }
					onClose={ () => handleModalClose( 'edit' ) }
					onSave={ handleSaveEditedField }
					isSaving={ state.isSaving }
					isDisabled={
						! hasChanges || ! state.modals.edit.field?.label
					}
				>
					<div className="metadata-field-form">
						<TextControl
							label={ __( 'Field Label', 'bcgov-design-system' ) }
							help={ __(
								'Display name for the field',
								'bcgov-design-system'
							) }
							value={ state.modals.edit.field?.label || '' }
							onChange={ ( label ) =>
								handleFieldChange( 'edit', 'label', label )
							}
							required
						/>

						<div className="field-type-display">
							<label htmlFor="edit-field-type-value">
								{ __( 'Field Type', 'bcgov-design-system' ) }
							</label>
							<div
								id="edit-field-type-value"
								className="field-type-value"
							>
								{ FIELD_TYPES[ state.modals.edit.field?.type ] }
							</div>
						</div>

						{ state.modals.edit.field?.type === 'select' && (
							<TextareaControl
								label={ __( 'Options', 'bcgov-design-system' ) }
								value={ formatOptionsToString(
									state.modals.edit.field
								) }
								onChange={ ( value ) =>
									handleOptionsChange( value, 'edit' )
								}
								help={ __(
									'Enter one option per line',
									'bcgov-design-system'
								) }
							/>
						) }
					</div>
				</MetadataModal>

				{ /* Add Field Modal */ }
				<MetadataModal
					title={ __(
						'Add New Metadata Field',
						'bcgov-design-system'
					) }
					isOpen={ state.modals.add.isOpen }
					onClose={ () => handleModalClose( 'add' ) }
					onSave={ handleAddField }
					isSaving={ state.isSaving }
					isDisabled={ ! state.modals.add.field.label }
				>
					<div className="metadata-field-form">
						{ state.modals.add.errors.submit && (
							<Notice status="error" isDismissible={ false }>
								<p>{ state.modals.add.errors.submit }</p>
							</Notice>
						) }

						<TextControl
							label={ __( 'Field Label', 'bcgov-design-system' ) }
							help={ __(
								'Display name for the field',
								'bcgov-design-system'
							) }
							value={ state.modals.add.field.label }
							onChange={ ( label ) =>
								handleFieldChange( 'add', 'label', label )
							}
							required
							className={
								state.modals.add.errors.label ? 'has-error' : ''
							}
						/>
						{ state.modals.add.errors.label && (
							<div className="field-error">
								{ state.modals.add.errors.label }
							</div>
						) }

						<SelectControl
							label={ __( 'Field Type', 'bcgov-design-system' ) }
							value={ state.modals.add.field.type }
							options={ Object.entries( FIELD_TYPES ).map(
								( [ value, label ] ) => ( {
									value,
									label,
								} )
							) }
							onChange={ ( type ) =>
								handleFieldChange( 'add', 'type', type )
							}
						/>

						{ state.modals.add.field.type === 'select' && (
							<TextareaControl
								label={ __( 'Options', 'bcgov-design-system' ) }
								value={ formatOptionsToString(
									state.modals.add.field
								) }
								onChange={ ( value ) =>
									handleOptionsChange( value, 'add' )
								}
								help={ __(
									'Enter one option per line',
									'bcgov-design-system'
								) }
							/>
						) }
					</div>
				</MetadataModal>

				<DeleteFieldModal
					isOpen={ state.modals.delete.isOpen }
					onClose={ handleCloseDeleteModal }
					onConfirm={ handleConfirmDelete }
					field={ state.modals.delete.field }
					isDeleting={ state.isSaving }
				/>
			</div>
		</div>
	);
};

export default MetadataApp;
