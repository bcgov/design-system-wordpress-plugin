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
 * @return {Object} errors - Object containing validation errors with structure:
 *                   - id: Error message for field ID validation
 *                   - label: Error message for label validation
 *                   - type: Error message for type validation
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

	// Validate field type
	if (
		! field.type ||
		! [ 'text', 'date', 'taxonomy' ].includes( field.type )
	) {
		errors.type = __(
			'Please select a valid field type',
			'bcgov-design-system'
		);
	}

	// Validate taxonomy field options
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
};

/**
 * Generates the initial state for a new metadata field
 *
 * @function getInitialFieldState
 * @return {Object} Initial field state object with the following properties:
 *                   - id: Empty string for field ID
 *                   - label: Empty string for field label
 *                   - type: Default type 'text'
 *                   - options: Empty array for select options
 *                   - _rawOptionsText: Empty string for raw options text
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
