import { __ } from '@wordpress/i18n';

export const validateField = (field, existingFields = [], currentIndex = null) => {
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

export const getInitialFieldState = () => ({
    id: '',
    label: '',
    type: 'text',
    options: [],
    _rawOptionsText: ''
}); 