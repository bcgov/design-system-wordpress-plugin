import { 
    Modal,
    TextControl,
    SelectControl,
    TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FIELD_TYPES } from '../../constants/fieldTypes';

const AddFieldModal = ({ 
    isOpen,
    onClose,
    field,
    onFieldChange,
    onOptionsChange,
    onSave,
    errors = {}
}) => {
    if (!isOpen) return null;

    return (
        <Modal
            title={__('Add Metadata Field', 'bcgov-design-system')}
            onRequestClose={onClose}
            className="metadata-field-modal"
        >
            <TextControl
                label={__('Field ID', 'bcgov-design-system')}
                value={field.id}
                onChange={(value) => onFieldChange('id', value)}
                help={__('A unique identifier for the field', 'bcgov-design-system')}
                error={errors.id}
            />
            
            <TextControl
                label={__('Field Label', 'bcgov-design-system')}
                value={field.label}
                onChange={(value) => onFieldChange('label', value)}
                help={__('The label shown to users', 'bcgov-design-system')}
                error={errors.label}
            />
            
            <SelectControl
                label={__('Field Type', 'bcgov-design-system')}
                value={field.type}
                options={Object.entries(FIELD_TYPES).map(([value, label]) => ({ value, label }))}
                onChange={(value) => onFieldChange('type', value)}
            />
            
            {field.type === 'select' && (
                <TextareaControl
                    label={__('Options', 'bcgov-design-system')}
                    value={field._rawOptionsText}
                    onChange={onOptionsChange}
                    help={__('Enter one option per line', 'bcgov-design-system')}
                    error={errors.options}
                />
            )}
            
            <div className="modal-actions">
                <Button variant="primary" onClick={onSave}>
                    {__('Add Field', 'bcgov-design-system')}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    {__('Cancel', 'bcgov-design-system')}
                </Button>
            </div>
        </Modal>
    );
};

export default AddFieldModal; 