/**
 * Metadata Settings App
 * 
 * This component manages the metadata fields configuration.
 */

import { useState, useEffect } from '@wordpress/element';
import { 
    Button, 
    Card, 
    CardHeader, 
    CardBody, 
    CardFooter,
    TextControl,
    SelectControl,
    CheckboxControl,
    Spinner,
    Notice,
    DragDropContext,
    Draggable,
    Droppable,
    Modal,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// Mock DragDropContext if it's not available
const DndContext = typeof DragDropContext !== 'undefined' ? DragDropContext : ({ children }) => children;
const DndDroppable = typeof Droppable !== 'undefined' ? Droppable : ({ children }) => children(
    { droppableProps: {}, innerRef: () => {} }, {}
);
const DndDraggable = typeof Draggable !== 'undefined' ? Draggable : ({ children }) => children(
    { draggableProps: {}, dragHandleProps: {}, innerRef: () => {} }, {}
);

/**
 * Field Type Options
 */
const FIELD_TYPES = {
    'text': __('Text', 'bcgov-design-system'),
    'select': __('Select', 'bcgov-design-system'),
    'date': __('Date', 'bcgov-design-system'),
};

/**
 * Metadata Settings App component
 */
const MetadataApp = () => {
    // State for metadata fields
    const [fields, setFields] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    
    // New field form state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newField, setNewField] = useState({
        id: '',
        label: '',
        type: 'text',
        required: false,
        options: [],
    });
    
    // Edit field modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    
    // Get API namespace from settings
    const { apiNamespace } = window.documentRepositorySettings;
    
    // Load metadata fields on component mount
    useEffect(() => {
        const fetchMetadataFields = async () => {
            try {
                const fields = await apiFetch({
                    path: `/${apiNamespace}/metadata-fields`,
                });
                
                setFields(fields);
                setIsLoading(false);
            } catch (err) {
                setError(err.message || __('Error loading metadata fields', 'bcgov-design-system'));
                setIsLoading(false);
            }
        };
        
        fetchMetadataFields();
    }, [apiNamespace]);
    
    // Handle drag and drop reordering
    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        
        const reorderedFields = [...fields];
        const [movedField] = reorderedFields.splice(result.source.index, 1);
        reorderedFields.splice(result.destination.index, 0, movedField);
        
        // Update order property
        const updatedFields = reorderedFields.map((field, index) => ({
            ...field,
            order: index,
        }));
        
        setFields(updatedFields);
    };
    
    // Handle adding a new field
    const handleAddField = async () => {
        // Validate field ID
        if (!newField.id) {
            setError(__('Field ID is required', 'bcgov-design-system'));
            return;
        }
        
        // Check for duplicate ID
        if (fields.some(field => field.id === newField.id)) {
            setError(__('A field with this ID already exists', 'bcgov-design-system'));
            return;
        }
        
        setIsSaving(true);
        
        try {
            // Add new field and save immediately
            const updatedFields = [
                ...fields,
                {
                    ...newField,
                    order: fields.length,
                },
            ];
            
            await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
                method: 'PUT',
                data: {
                    fields: updatedFields,
                },
            });
            
            setFields(updatedFields);
            setShowAddModal(false);
            
            // Reset new field form
            setNewField({
                id: '',
                label: '',
                type: 'text',
                required: false,
                options: [],
            });
            
            setError(null);
        } catch (err) {
            setError(err.message || __('Error adding metadata field', 'bcgov-design-system'));
        } finally {
            setIsSaving(false);
        }
    };
    
    // Handle editing a field
    const handleEditField = (field, index) => {
        setEditingField({ ...field });
        setEditingIndex(index);
        setShowEditModal(true);
    };
    
    // Handle saving edited field
    const handleSaveEditedField = async () => {
        // Validate field
        if (!editingField.id || !editingField.label) {
            setError(__('ID and Label are required', 'bcgov-design-system'));
            return;
        }
        
        // Check for duplicate ID (except current field)
        if (
            fields.some(
                (field, index) => field.id === editingField.id && index !== editingIndex
            )
        ) {
            setError(__('A field with this ID already exists', 'bcgov-design-system'));
            return;
        }

        setIsSaving(true);
        
        try {
            // Update field and save immediately
            const updatedFields = [...fields];
            updatedFields[editingIndex] = editingField;
            
            await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
                method: 'PUT',
                data: {
                    fields: updatedFields,
                },
            });
            
            setFields(updatedFields);
            setShowEditModal(false);
            setEditingField(null);
            setEditingIndex(null);
            setError(null);
        } catch (err) {
            setError(err.message || __('Error saving metadata field', 'bcgov-design-system'));
        } finally {
            setIsSaving(false);
        }
    };
    
    // Handle deleting a field
    const handleDeleteField = async (fieldId) => {
        try {
            const updatedFields = fields.filter(field => field.id !== fieldId);
            
            await apiFetch({
                path: `/${apiNamespace}/metadata-fields`,
                method: 'PUT',
                data: {
                    fields: updatedFields,
                },
            });
            
            setFields(updatedFields);
        } catch (err) {
            setError(err.message || __('Error deleting metadata field', 'bcgov-design-system'));
        }
    };
    
    // Handle changes to select field options
    const handleOptionsChange = (e, setFunction) => {
        const value = e.target.value;
        setFunction(prev => ({
            ...prev,
            _rawOptionsText: value,
            options: value.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
        }));
    };
    
    // Format options array to string for textarea
    const formatOptionsToString = (field) => {
        if (field._rawOptionsText !== undefined) {
            return field._rawOptionsText;
        }
        return Array.isArray(field.options) ? field.options.join('\n') : '';
    };
    
    if (isLoading) {
        return (
            <div className="metadata-settings-loading">
                <Spinner />
                <p>{__('Loading metadata fields...', 'bcgov-design-system')}</p>
            </div>
        );
    }
    
    return (
        <div className="metadata-settings">
            {error && (
                <Notice status="error" isDismissible={false}>
                    <p>{error}</p>
                </Notice>
            )}
            
            <Card>
                <CardHeader>
                    <h2>{__('Document Metadata Fields', 'bcgov-design-system')}</h2>
                    <Button
                        variant="primary"
                        onClick={() => setShowAddModal(true)}
                        disabled={isSaving}
                    >
                        {__('Add New Field', 'bcgov-design-system')}
                    </Button>
                </CardHeader>
                
                <CardBody>
                    <div className="metadata-fields-info">
                        <p>{__('Customize the metadata fields that will be available for documents. Drag and drop to reorder fields.', 'bcgov-design-system')}</p>
                    </div>
                    
                    {fields.length === 0 ? (
                        <div className="no-fields-message">
                            <p>{__('No custom metadata fields defined yet. Click "Add New Field" to create one.', 'bcgov-design-system')}</p>
                        </div>
                    ) : (
                        <DndContext onDragEnd={handleDragEnd}>
                            <DndDroppable droppableId="metadata-fields">
                                {(provided) => (
                                    <div
                                        className="metadata-fields-list"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {fields.map((field, index) => (
                                            <DndDraggable
                                                key={field.id}
                                                draggableId={field.id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        className="metadata-field-item"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <div className="metadata-field-info">
                                                            <h3>{field.label}</h3>
                                                            <div className="metadata-field-details">
                                                                <span className="metadata-field-id">
                                                                    ID: {field.id}
                                                                </span>
                                                                <span className="metadata-field-type">
                                                                    {FIELD_TYPES[field.type]}
                                                                </span>
                                                                {field.required && (
                                                                    <span className="metadata-field-required">
                                                                        {__('Required', 'bcgov-design-system')}
                                                                    </span>
                                                                )}
                                                            </div>
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
                                                                disabled={isSaving}
                                                            >
                                                                {__('Delete', 'bcgov-design-system')}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </DndDraggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </DndDroppable>
                        </DndContext>
                    )}
                </CardBody>
            </Card>
            
            {/* Add Field Modal */}
            {showAddModal && (
                <Modal
                    title={__('Add New Metadata Field', 'bcgov-design-system')}
                    onRequestClose={() => setShowAddModal(false)}
                    className="metadata-field-modal"
                    isDismissible={true}
                    shouldCloseOnClickOutside={true}
                    shouldCloseOnEsc={true}
                >
                    <div 
                        className="metadata-field-form"
                        onKeyDown={(e) => {
                            if (e.target.tagName === 'TEXTAREA') {
                                e.stopPropagation();
                            }
                        }}
                    >
                        <TextControl
                            label={__('Field ID', 'bcgov-design-system')}
                            help={__('Unique identifier for the field (lowercase, no spaces)', 'bcgov-design-system')}
                            value={newField.id}
                            onChange={(id) => setNewField(prev => ({ ...prev, id: id.toLowerCase().replace(/\s+/g, '_') }))}
                            required
                        />
                        
                        <TextControl
                            label={__('Field Label', 'bcgov-design-system')}
                            help={__('Display name for the field', 'bcgov-design-system')}
                            value={newField.label}
                            onChange={(label) => setNewField(prev => ({ ...prev, label }))}
                            required
                        />
                        
                        <SelectControl
                            label={__('Field Type', 'bcgov-design-system')}
                            value={newField.type}
                            options={Object.entries(FIELD_TYPES).map(([value, label]) => ({
                                value,
                                label,
                            }))}
                            onChange={(type) => setNewField(prev => ({ ...prev, type }))}
                        />
                        
                        {newField.type === 'select' && (
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
                                    value={formatOptionsToString(newField)}
                                    onChange={(e) => handleOptionsChange(e, setNewField)}
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
                        
                        <CheckboxControl
                            label={__('Required', 'bcgov-design-system')}
                            help={__('Make this field required when uploading documents', 'bcgov-design-system')}
                            checked={newField.required}
                            onChange={(required) => setNewField(prev => ({ ...prev, required }))}
                        />
                        
                        <div className="metadata-field-actions">
                            <Button
                                variant="secondary"
                                onClick={() => setShowAddModal(false)}
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
            {showEditModal && editingField && (
                <Modal
                    title={__('Edit Metadata Field', 'bcgov-design-system')}
                    onRequestClose={() => setShowEditModal(false)}
                    className="metadata-field-modal"
                    isDismissible={true}
                    shouldCloseOnClickOutside={true}
                    shouldCloseOnEsc={true}
                >
                    <div 
                        className="metadata-field-form"
                        onKeyDown={(e) => {
                            if (e.target.tagName === 'TEXTAREA') {
                                e.stopPropagation();
                            }
                        }}
                    >
                        <TextControl
                            label={__('Field ID', 'bcgov-design-system')}
                            help={__('Unique identifier for the field (lowercase, no spaces)', 'bcgov-design-system')}
                            value={editingField.id}
                            onChange={(id) => setEditingField(prev => ({ ...prev, id: id.toLowerCase().replace(/\s+/g, '_') }))}
                            required
                            disabled // Don't allow changing IDs for existing fields
                        />
                        
                        <TextControl
                            label={__('Field Label', 'bcgov-design-system')}
                            help={__('Display name for the field', 'bcgov-design-system')}
                            value={editingField.label}
                            onChange={(label) => setEditingField(prev => ({ ...prev, label }))}
                            required
                        />
                        
                        <div className="field-type-display">
                            <label>{__('Field Type', 'bcgov-design-system')}</label>
                            <div className="field-type-value">{FIELD_TYPES[editingField.type]}</div>
                        </div>
                        
                        {editingField.type === 'select' && (
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
                                    value={formatOptionsToString(editingField)}
                                    onChange={(e) => handleOptionsChange(e, setEditingField)}
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
                        
                        <CheckboxControl
                            label={__('Required', 'bcgov-design-system')}
                            help={__('Make this field required when uploading documents', 'bcgov-design-system')}
                            checked={editingField.required}
                            onChange={(required) => setEditingField(prev => ({ ...prev, required }))}
                        />
                        
                        <div className="metadata-field-actions">
                            <Button
                                variant="secondary"
                                onClick={() => setShowEditModal(false)}
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