/**
 * Metadata Settings Application
 *
 * Main application component for managing document metadata fields.
 * Provides functionality for adding, editing, deleting, and reordering
 * metadata fields that can be associated with documents.
 *
 * @module MetadataApp
 */

import { useEffect, useCallback, useState } from '@wordpress/element';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	Notice,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import MetadataModal from '../shared/components/MetadataModal';
import DeleteFieldModal from './components/Modals/DeleteFieldModal';
import MetadataFieldList from './components/MetadataFieldList';
import MetadataFieldForm from './components/MetadataFieldForm';
import useMetadataFields from './hooks/useMetadataFields';
import apiFetch from '@wordpress/api-fetch';

/**
 * Main Metadata Settings Application Component
 *
 * @return {JSX.Element} Metadata settings application
 */
const MetadataApp = () => {
	const {
		state,
		setState,
		fetchFields,
		saveFields,
		validateField,
		getInitialFieldState,
	} = useMetadataFields();

	// Check for changes - moved to the top to fix "Cannot access before initialization" error
	const [ hasChanges, setHasChanges ] = useState( false );
	
	// Normalize options - moved to the top
	const normalizeOptions = useCallback(
		( options ) =>
			Array.isArray( options )
				? options
						.map( ( s ) => String( s ).trim() )
						.filter( ( s ) => s.length > 0 )
				: [],
		[]
	);

	// Format options array to string for textarea - moved to the top
	const formatOptionsToString = useCallback( ( field ) => {
		if ( field._rawOptionsText !== undefined ) {
			return field._rawOptionsText;
		}
		return Array.isArray( field.options ) ? field.options.join( '\n' ) : '';
	}, [] );

	// Load fields on mount
	useEffect( () => {
		fetchFields();
	}, [ fetchFields ] );

	// Handle field changes
	const handleFieldChange = useCallback(
		( modalType, field, value ) => {
			setState(
				( prev ) => {
					const currentField = prev.modals[ modalType ].field;
					let updates = { [ field ]: value };

					// If the field being changed is the label, generate ID but preserve label case
					if ( field === 'label' ) {
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

					// Get original values
					const originalValues =
						prev.modals[ modalType ]?.originalValues;

					// Check for changes
					let hasChanges = false;
					if ( originalValues ) {
						// Compare label
						if ( originalValues.label !== updatedField.label ) {
							hasChanges = true;
						}
						// Compare type
						else if ( originalValues.type !== updatedField.type ) {
							hasChanges = true;
						}
						// Compare options
						else if (
							originalValues._rawOptionsText !==
							updatedField._rawOptionsText
						) {
							hasChanges = true;
						}
					}

					setHasChanges( hasChanges );

					return {
						...prev,
						modals: {
							...prev.modals,
							[ modalType ]: {
								...prev.modals[ modalType ],
								field: updatedField,
							},
						},
					};
				},
				[ setState ]
			);
		},
		[ setState ]
	);

	// Handle options changes
	const handleOptionsChange = useCallback(
		( value, modalType ) => {
			const options = value
				.split( '\n' )
				.map( ( line ) => line.trim() )
				.filter( ( line ) => line.length > 0 );

			setState(
				( prev ) => {
					const updatedField = {
						...prev.modals[ modalType ].field,
						_rawOptionsText: value,
						options,
					};

					// Get original values
					const originalValues =
						prev.modals[ modalType ]?.originalValues;

					// Check for changes
					let hasChanges = false;
					if ( originalValues ) {
						// Compare label
						if ( originalValues.label !== updatedField.label ) {
							hasChanges = true;
						}
						// Compare type
						else if ( originalValues.type !== updatedField.type ) {
							hasChanges = true;
						}
						// Compare options
						else if (
							originalValues._rawOptionsText !==
							updatedField._rawOptionsText
						) {
							hasChanges = true;
						}
					}

					setHasChanges( hasChanges );

					return {
						...prev,
						modals: {
							...prev.modals,
							[ modalType ]: {
								...prev.modals[ modalType ],
								field: updatedField,
							},
						},
					};
				},
				[ setState ]
			);
		},
		[ setState ]
	);

	// Handle adding a field
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
							field: getInitialFieldState(),
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
	}, [
		state.fields,
		state.modals.add,
		saveFields,
		validateField,
		getInitialFieldState,
		setState,
	] );

	// Handle editing a field
	const handleEditField = useCallback(
		( field, index ) => {
			// Store original values for comparison
			const originalFieldValues = {
				label: field.label || '',
				type: field.type || '',
				options: normalizeOptions( field.options ),
				_rawOptionsText:
					field._rawOptionsText || formatOptionsToString( field ),
				id: field.id || '',
			};

			setState( ( prev ) => ( {
				...prev,
				modals: {
					...prev.modals,
					edit: {
						isOpen: true,
						field: { ...field },
						index,
						originalValues: originalFieldValues,
						errors: {
							label: '',
							submit: '',
						},
					},
				},
			} ) );
			setHasChanges( false );
		},
		[ normalizeOptions, formatOptionsToString, setState ]
	);

	// Handle saving edited field
	const handleSaveEditedField = useCallback( async () => {
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
						originalValues: null,
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
	}, [
		state.fields,
		state.modals.edit,
		saveFields,
		validateField,
		setState,
	] );

	// Handle deleting a field
	const handleDeleteField = useCallback(
		( field ) => {
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
		},
		[ setState ]
	);

	// Handle confirming field deletion
	const handleConfirmDelete = useCallback( async () => {
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
	}, [ state.fields, state.modals.delete.field, saveFields, setState ] );

	// Handle closing delete modal
	const handleCloseDeleteModal = useCallback( () => {
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
	}, [ setState ] );

	// Handle modal close
	const handleModalClose = useCallback(
		( modalType ) => {
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
						originalValues: null,
					},
				},
			} ) );
			setHasChanges( false );
		},
		[ getInitialFieldState, setState ]
	);

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

						<MetadataFieldList
							fields={ state.fields }
							onEdit={ handleEditField }
							onDelete={ handleDeleteField }
							isSaving={ state.isSaving }
						/>
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
					<MetadataFieldForm
						field={ state.modals.edit.field }
						errors={ state.modals.edit.errors }
						onChange={ ( field, value ) =>
							handleFieldChange( 'edit', field, value )
						}
						onOptionsChange={ ( value ) =>
							handleOptionsChange( value, 'edit' )
						}
						isEdit={ true }
					/>
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
					<MetadataFieldForm
						field={ state.modals.add.field }
						errors={ state.modals.add.errors }
						onChange={ ( field, value ) =>
							handleFieldChange( 'add', field, value )
						}
						onOptionsChange={ ( value ) =>
							handleOptionsChange( value, 'add' )
						}
						isEdit={ false }
					/>
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
