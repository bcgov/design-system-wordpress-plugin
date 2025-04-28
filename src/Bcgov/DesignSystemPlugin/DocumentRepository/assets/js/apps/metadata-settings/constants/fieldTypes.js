/**
 * Field Types Constants
 * 
 * Defines the available types of metadata fields that can be created in the
 * document repository. Each field type has a corresponding label that is
 * translated using WordPress i18n.
 * 
 * @module fieldTypes
 * @constant {Object} FIELD_TYPES
 * @property {string} text - Text input field type
 * @property {string} select - Dropdown selection field type
 * @property {string} date - Date picker field type
 * 
 * @example
 * // Using in a SelectControl
 * <SelectControl
 *   label={__('Field Type', 'bcgov-design-system')}
 *   value={field.type}
 *   options={Object.entries(FIELD_TYPES).map(([value, label]) => ({ value, label }))}
 *   onChange={(value) => setFieldType(value)}
 * />
 */

import { __ } from '@wordpress/i18n';

/**
 * Available field types with their translated labels
 * @type {Object<string, string>}
 */
export const FIELD_TYPES = {
    /** Text input field type */
    text: __('Text', 'bcgov-design-system'),
    
    /** Dropdown selection field type */
    select: __('Select', 'bcgov-design-system'),
    
    /** Date picker field type */
    date: __('Date', 'bcgov-design-system'),
}; 