/**
 * Field Validation Utilities
 *
 * Provides functions for validating metadata field configurations
 * and generating initial field states. Includes validation for
 * required fields, duplicate IDs, and field-specific requirements.
 *
 * @module fieldValidation
 */

import { __ } from '@wordpress/i18n';

/**
 * Validates a metadata field configuration
 *
 * Checks for required fields, duplicate IDs, and field-specific
 * requirements (e.g., options for select fields).
 *
 * @function validateField
 * @param {Object} field               - The field configuration to validate
 * @param {string} field.id            - The field's unique identifier
 * @param {string} field.label         - The field's display label
 * @param {string} field.type          - The field's type (text, select, date)
 * @param {Array}  [field.options]     - Options for select fields
 * @param {Array}  [existingFields=[]] - Array of existing fields to check for duplicates
 * @param {number} [currentIndex=null] - Index of the current field in the existing fields array
 * @return {Object} Object containing validation errors, empty if valid
 * @return {string} [errors.id] - Error message for ID validation
 * @return {string} [errors.label] - Error message for label validation
 * @return {string} [errors.options] - Error message for options validation
 *
 * @example
 * const field = {
 *   id: 'new-field',
 *   label: 'New Field',
 *   type: 'select',
 *   options: []
 * };
 *
 * const errors = validateField(field, existingFields);
 * if (Object.keys(errors).length === 0) {
 *   // Field is valid
 * }
 */
export const validateField = (
	field,
	existingFields = [],
	currentIndex = null
) => {
	const errors = {};

	// Validate required ID
	if ( ! field.id ) {
		errors.id = __( 'Field ID is required', 'bcgov-design-system' );
	}

	// Validate required label
	if ( ! field.label ) {
		errors.label = __( 'Field label is required', 'bcgov-design-system' );
	}

	// Check for duplicate ID
	const hasDuplicate = existingFields.some(
		( existing, index ) =>
			existing.id === field.id && index !== currentIndex
	);
	if ( hasDuplicate ) {
		errors.id = __(
			'A field with this ID already exists',
			'bcgov-design-system'
		);
	}

	// Validate select field options
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
 * Generates the initial state for a new metadata field
 *
 * @function getInitialFieldState
 * @return {Object} Initial field state object
 * @return {string} id - Empty string for field ID
 * @return {string} label - Empty string for field label
 * @return {string} type - Default type 'text'
 * @return {Array} options - Empty array for select options
 * @return {string} _rawOptionsText - Empty string for raw options text
 *
 * @example
 * const newField = getInitialFieldState();
 * // Returns: { id: '', label: '', type: 'text', options: [], _rawOptionsText: '' }
 */
export const getInitialFieldState = () => ( {
	id: '',
	label: '',
	type: 'text',
	options: [],
	_rawOptionsText: '',
} );
