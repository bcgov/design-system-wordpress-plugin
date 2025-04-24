/**
 * Metadata Settings App
 * 
 * This component manages the metadata fields configuration.
 */

import { useState, useEffect, useMemo, useCallback } from '@wordpress/element';
import { 
    Button, 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    TextControl,
    SelectControl,
    CheckboxControl,
    Notice,
    Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// Since drag and drop is not available in @wordpress/components, we'll use a simple list
const MetadataList = ({ children }) => (
    <div className="metadata-fields-list">
        {children}
    </div>
);

const MetadataItem = ({ children, onMoveUp, onMoveDown, index, total }) => (
    <div className="metadata-field-item">
        <div className="metadata-field-info">
            {children}
        </div>
        <div className="metadata-field-move-actions">
            {index > 0 && (
                <Button
                    variant="secondary"
                    onClick={onMoveUp}
                    className="move-up"
                    aria-label={__('Move Up', 'bcgov-design-system')}
                >
                    ↑
                </Button>
            )}
            {index < total - 1 && (
                <Button
                    variant="secondary"
                    onClick={onMoveDown}
                    className="move-down"
                    aria-label={__('Move Down', 'bcgov-design-system')}
                >
                    ↓
                </Button>
            )}
        </div>
    </div>
);

/**
 * Field Type Options
 */
const FIELD_TYPES = {
    text: __('Text', 'bcgov-design-system'),
    select: __('Select', 'bcgov-design-system'),
    date: __('Date', 'bcgov-design-system'),
};

// Custom hook for API operations
const useMetadataAPI = () => {
    const { apiNamespace } = window.documentRepositorySettings;
    
    const fetchFields = useCallback(async () => {
        try {
            const fields = await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
            });
            return { success: true, data: fields };
        } catch (err) {
            return { 
                success: false, 
                error: err.message || __('Error loading metadata fields', 'bcgov-design-system')
            };
        }
    }, [apiNamespace]);
    
    const saveFields = useCallback(async (fields) => {
        try {
            await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
                method: 'PUT',
                data: { fields },
            });
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.message || __('Error saving metadata fields', 'bcgov-design-system')
            };
        }
    }, [apiNamespace]);
    
    return { fetchFields, saveFields };
};

// Field validation utility
const validateField = (field, existingFields = [], currentIndex = null) => {
    const errors = {};
    
    if (!field.id) {
        errors.id = __('Field ID is required', 'bcgov-design-system');
    }
    
    if (!field.label) {
        errors.label = __('Field label is required', 'bcgov-design-system');
    }
    
    // Check for duplicate ID
    const hasDuplicate = existingFields.some(
        (existing, index) => existing.id === field.id && index !== currentIndex
    );
    if (hasDuplicate) {
        errors.id = __('A field with this ID already exists', 'bcgov-design-system');
    }
    
    if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        errors.options = __('Select fields require at least one option', 'bcgov-design-system');
    }
    
    return errors;
};

// Helper function for updating modal field state
const updateModalField = (state, modalType, updates) => ({
    ...state,
    modals: {
        ...state.modals,
        [modalType]: {
            ...state.modals[modalType],
            field: {
                ...state.modals[modalType].field,
                ...updates
            }
        }
    }
});

// Helper function for closing a modal
const closeModal = (state, modalType) => ({
    ...state,
    modals: {
        ...state.modals,
        [modalType]: {
            ...state.modals[modalType],
            isOpen: false
        }
    }
});

// Initial state for a new field
const getInitialFieldState = () => ({
    id: '',
    label: '',
    type: 'text',
    options: [],
    _rawOptionsText: ''
});

/**
 * Metadata Settings App component
 */
const MetadataApp = () => {
    // Consolidated state
    const [state, setState] = useState({
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
                    _rawOptionsText: ''
                }
            },
            edit: { 
                isOpen: false,
                field: null,
                index: null
            }
        }
    });
    
    // API hooks
    const { fetchFields, saveFields } = useMetadataAPI();
    
    // Memoized sorted fields
    const sortedFields = useMemo(() => 
        [...state.fields].sort((a, b) => a.order - b.order),
        [state.fields]
    );
    
    // Load fields on mount
    useEffect(() => {
        const loadFields = async () => {
            const result = await fetchFields();
            setState(prev => ({
                ...prev,
                fields: result.success ? result.data : [],
                error: result.success ? null : result.error,
                isLoading: false
            }));
        };
        
        loadFields();
    }, [fetchFields]);
    
    // Memoized handlers
    const handleOptionsChange = useCallback((e, fieldType) => {
        const value = e.target.value;
        const options = value.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
            
        setState(prev => ({
            ...prev,
            modals: {
                ...prev.modals,
                [fieldType]: {
                    ...prev.modals[fieldType],
                    field: {
                        ...prev.modals[fieldType].field,
                        _rawOptionsText: value,
                        options
                    }
                }
            }
        }));
    }, []);
    
    const handleAddField = useCallback(async () => {
        const { field } = state.modals.add;
        const errors = validateField(field, state.fields);
        
        if (Object.keys(errors).length > 0) {
            setState(prev => ({ ...prev, error: errors }));
            return;
        }
        
        setState(prev => ({ ...prev, isSaving: true }));
        
        const result = await saveFields([
            ...state.fields,
            { ...field, order: state.fields.length }
        ]);
        
        if (result.success) {
            setState(prev => ({
                ...prev,
                fields: [...prev.fields, { ...field, order: prev.fields.length }],
                error: null,
                isSaving: false,
                modals: {
                    ...prev.modals,
                    add: {
                        isOpen: false,
                        field: { id: '', label: '', type: 'text', options: [], _rawOptionsText: '' }
                    }
                }
            }));
        } else {
            setState(prev => ({
                ...prev,
                error: result.error,
                isSaving: false
            }));
        }
    }, [state.modals.add.field, state.fields, saveFields]);
    
    // Handle editing a field
    const handleEditField = (field, index) => {
        setState(prev => ({
            ...prev,
            modals: {
                ...prev.modals,
                edit: {
                    isOpen: true,
                    field: { ...field },
                    index
                }
            }
        }));
    };
    
    // Handle saving edited field
    const handleSaveEditedField = async () => {
        const { field, index } = state.modals.edit;
        const errors = validateField(field, state.fields, index);
        
        if (Object.keys(errors).length > 0) {
            setState(prev => ({ ...prev, error: errors }));
            return;
        }
        
        setState(prev => ({ ...prev, isSaving: true }));
        
        const result = await saveFields([
            ...state.fields.slice(0, index),
            field,
            ...state.fields.slice(index + 1)
        ]);
        
        if (result.success) {
            setState(prev => ({
                ...prev,
                fields: [
                    ...state.fields.slice(0, index),
                    field,
                    ...state.fields.slice(index + 1)
                ],
                error: null,
                isSaving: false,
                modals: {
                    ...prev.modals,
                    edit: {
                        isOpen: false,
                        field: null,
                        index: null
                    }
                }
            }));
        } else {
            setState(prev => ({
                ...prev,
                error: result.error,
                isSaving: false
            }));
        }
    };
    
    // Handle deleting a field
    const handleDeleteField = async (fieldId) => {
        if (!confirm(__('Are you sure you want to delete this field? This will remove this metadata from ALL documents and cannot be undone.', 'bcgov-design-system'))) {
            return;
        }

        setState(prev => ({ ...prev, isSaving: true }));
        
        try {
            // First, delete the field from all documents
            await apiFetch({
                path: `/${window.documentRepositorySettings.apiNamespace}/metadata-fields/${fieldId}/cleanup`,
                method: 'DELETE',
            });

            // Then update the fields list
            const updatedFields = state.fields.filter(field => field.id !== fieldId);
            const result = await saveFields(updatedFields);
            
            if (result.success) {
                setState(prev => ({ 
                    ...prev, 
                    fields: updatedFields,
                    isSaving: false,
                    error: null
                }));
            } else {
                setState(prev => ({ 
                    ...prev, 
                    error: result.error,
                    isSaving: false
                }));
            }
        } catch (error) {
            setState(prev => ({ 
                ...prev, 
                error: error.message || __('Error deleting metadata field', 'bcgov-design-system'),
                isSaving: false
            }));
        }
    };
    
    // Format options array to string for textarea
    const formatOptionsToString = (field) => {
        if (field._rawOptionsText !== undefined) {
            return field._rawOptionsText;
        }
        return Array.isArray(field.options) ? field.options.join('\n') : '';
    };
    
    // Simplified state updates using helper functions
    const handleFieldChange = useCallback((modalType, field, value) => {
        setState(prev => {
            // If the field being changed is the label, auto-generate the ID
            if (field === 'label') {
                const baseId = value.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const fieldType = prev.modals[modalType].field.type.toLowerCase();
                const generatedId = `${baseId}_${fieldType}`;
                return updateModalField(prev, modalType, { 
                    [field]: value,
                    id: generatedId
                });
            }
            // If the type is being changed, update the ID to reflect the new type
            if (field === 'type') {
                const currentLabel = prev.modals[modalType].field.label || '';
                const baseId = currentLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_');
                const generatedId = `${baseId}_${value.toLowerCase()}`;
                return updateModalField(prev, modalType, { 
                    [field]: value,
                    id: generatedId
                });
            }
            return updateModalField(prev, modalType, { [field]: value });
        });
    }, []);

    const handleIdChange = useCallback((modalType, id) => {
        setState(prev => updateModalField(prev, modalType, { 
            id: id.toLowerCase().replace(/[^a-z0-9]+/g, '_') 
        }));
    }, []);

    const handleModalClose = useCallback((modalType) => {
        setState(prev => closeModal(prev, modalType));
    }, []);
    
    if (state.isLoading) {
        return (
            <div className="metadata-settings-loading">
                <div className="spinner-wrapper">
                    <div className="components-spinner" />
                </div>
                <p>{__('Loading metadata fields...', 'bcgov-design-system')}</p>
            </div>
        );
    }
    
    // Handle moving items up/down
    const handleMoveUp = (index) => {
        if (index <= 0) return;
        const newFields = [...state.fields];
        [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
        // Update order property
        newFields.forEach((field, idx) => {
            field.order = idx;
        });
        setState(prev => ({ ...prev, fields: newFields }));
    };

    const handleMoveDown = (index) => {
        if (index >= state.fields.length - 1) return;
        const newFields = [...state.fields];
        [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
        // Update order property
        newFields.forEach((field, idx) => {
            field.order = idx;
        });
        setState(prev => ({ ...prev, fields: newFields }));
    };

    return (
        <div className="metadata-settings">
            {state.error && (
                <Notice status="error" isDismissible={false}>
                    <p>{state.error}</p>
                </Notice>
            )}
            
            <Card>
                <CardHeader>
                    <h2>{__('Document Metadata Fields', 'bcgov-design-system')}</h2>
                    <Button
                        variant="primary"
                        onClick={() => setState(prev => ({ 
                            ...prev, 
                            modals: { 
                                ...prev.modals, 
                                add: { 
                                    isOpen: true,
                                    field: getInitialFieldState()
                                } 
                            } 
                        }))}
                        disabled={state.isSaving}
                    >
                        {__('Add New Field', 'bcgov-design-system')}
                    </Button>
                </CardHeader>
                
                <CardBody>
                    <div className="metadata-fields-info">
                        <p>{__('Customize the metadata fields that will be available for documents. Use the up/down arrows to reorder fields.', 'bcgov-design-system')}</p>
                    </div>
                    
                    {state.fields.length === 0 ? (
                        <div className="no-fields-message">
                            <p>{__('No custom metadata fields defined yet. Click "Add New Field" to create one.', 'bcgov-design-system')}</p>
                        </div>
                    ) : (
                        <MetadataList>
                            {sortedFields.map((field, index) => (
                                <MetadataItem
                                    key={field.id}
                                    index={index}
                                    total={sortedFields.length}
                                    onMoveUp={() => handleMoveUp(index)}
                                    onMoveDown={() => handleMoveDown(index)}
                                >
                                    <h3>{field.label}</h3>
                                    <div className="metadata-field-details">
                                        <span className="metadata-field-id">
                                            ID: {field.id.replace(/_[^_]+$/, '')}
                                        </span>
                                    </div>
                                    <div className="metadata-field-actions">
                                        <Button
                                            variant="secondary"
                                            onClick={() => handleEditField(field, index)}
                                        >
                                            {__('Edit', 'bcgov-design-system')}
                                        </Button>
                                        
                                        <Button
                                            variant="secondary"
                                            isDestructive
                                            onClick={() => handleDeleteField(field.id)}
                                            disabled={state.isSaving}
                                        >
                                            {__('Delete', 'bcgov-design-system')}
                                        </Button>
                                    </div>
                                </MetadataItem>
                            ))}
                        </MetadataList>
                    )}
                </CardBody>
            </Card>
            
            {/* Add Field Modal */}
            {state.modals.add.isOpen && (
                <Modal
                    title={__('Add New Metadata Field', 'bcgov-design-system')}
                    onRequestClose={() => handleModalClose('add')}
                    className="metadata-field-modal"
                    isDismissible={true}
                    shouldCloseOnClickOutside={true}
                    shouldCloseOnEsc={true}
                >
                    <div className="metadata-field-form">
                        <TextControl
                            label={__('Field Label', 'bcgov-design-system')}
                            help={__('Display name for the field', 'bcgov-design-system')}
                            value={state.modals.add.field.label}
                            onChange={label => handleFieldChange('add', 'label', label)}
                            required
                        />
                        
                        <SelectControl
                            label={__('Field Type', 'bcgov-design-system')}
                            value={state.modals.add.field.type}
                            options={Object.entries(FIELD_TYPES).map(([value, label]) => ({
                                value,
                                label,
                            }))}
                            onChange={type => handleFieldChange('add', 'type', type)}
                        />
                        
                        {state.modals.add.field.type === 'select' && (
                            <div className="field-options">
                                <label htmlFor="field-options">
                                    {__('Options', 'bcgov-design-system')}
                                </label>
                                <p className="field-options-help">
                                    {__('Enter each option on a new line:', 'bcgov-design-system')}
                                </p>
                                <div className="field-options-example">
                                    {__('Example:', 'bcgov-design-system')} <br />
                                    Draft<br />
                                    In Review<br />
                                    Approved<br />
                                    Archived
                                </div>
                                <textarea
                                    id="field-options"
                                    value={formatOptionsToString(state.modals.add.field)}
                                    onChange={(e) => handleOptionsChange(e, 'add')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.stopPropagation();
                                        }
                                        if (e.key === 'Tab') {
                                            e.preventDefault();
                                        }
                                    }}
                                    rows={5}
                                    placeholder={__('Enter your options here...', 'bcgov-design-system')}
                                />
                            </div>
                        )}
                        
                        <div className="metadata-field-actions">
                            <Button
                                variant="secondary"
                                onClick={() => handleModalClose('add')}
                            >
                                {__('Cancel', 'bcgov-design-system')}
                            </Button>
                            
                            <Button
                                variant="primary"
                                onClick={handleAddField}
                            >
                                {__('Add Field', 'bcgov-design-system')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
            
            {/* Edit Field Modal */}
            {state.modals.edit.isOpen && state.modals.edit.field && (
                <Modal
                    title={__('Edit Metadata Field', 'bcgov-design-system')}
                    onRequestClose={() => handleModalClose('edit')}
                    className="metadata-field-modal"
                    isDismissible={true}
                    shouldCloseOnClickOutside={true}
                    shouldCloseOnEsc={true}
                >
                    <div className="metadata-field-form">
                        <TextControl
                            label={__('Field Label', 'bcgov-design-system')}
                            help={__('Display name for the field', 'bcgov-design-system')}
                            value={state.modals.edit.field.label}
                            onChange={label => handleFieldChange('edit', 'label', label)}
                            required
                        />
                        
                        <div className="field-type-display">
                            <label>{__('Field Type', 'bcgov-design-system')}</label>
                            <div className="field-type-value">{FIELD_TYPES[state.modals.edit.field.type]}</div>
                        </div>
                        
                        {state.modals.edit.field.type === 'select' && (
                            <div className="field-options">
                                <label htmlFor="field-options-edit">
                                    {__('Options', 'bcgov-design-system')}
                                </label>
                                <p className="field-options-help">
                                    {__('Enter each option on a new line:', 'bcgov-design-system')}
                                </p>
                                <div className="field-options-example">
                                    {__('Example:', 'bcgov-design-system')} <br />
                                    Draft<br />
                                    In Review<br />
                                    Approved<br />
                                    Archived
                                </div>
                                <textarea
                                    id="field-options-edit"
                                    value={formatOptionsToString(state.modals.edit.field)}
                                    onChange={(e) => handleOptionsChange(e, 'edit')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.stopPropagation();
                                        }
                                        if (e.key === 'Tab') {
                                            e.preventDefault();
                                        }
                                    }}
                                    rows={5}
                                    placeholder={__('Enter your options here...', 'bcgov-design-system')}
                                />
                            </div>
                        )}
                        
                        <div className="metadata-field-actions">
                            <Button
                                variant="secondary"
                                onClick={() => handleModalClose('edit')}
                            >
                                {__('Cancel', 'bcgov-design-system')}
                            </Button>
                            
                            <Button
                                variant="primary"
                                onClick={handleSaveEditedField}
                            >
                                {__('Save Field', 'bcgov-design-system')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MetadataApp; 