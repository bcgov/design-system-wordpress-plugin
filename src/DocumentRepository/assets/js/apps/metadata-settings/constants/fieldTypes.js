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
 * @property {string} date - Date picker field type
 *
 * @example
 * // Using field types in form validation
 * const validTypes = Object.keys(FIELD_TYPES);
 * if (!validTypes.includes(fieldType)) {
 *   throw new Error('Invalid field type');
 * }
 */

import { __ } from '@wordpress/i18n';

/**
 * Available field types with their translated labels
 * @type {Object<string, string>}
 */
export const FIELD_TYPES = {
	/** Text input field type */
	text: __( 'Text', 'bcgov-design-system' ),

	/** Date picker field type */
	date: __( 'Date', 'bcgov-design-system' ),

	/** Taxonomy field type */
	taxonomy: __( 'Taxonomy', 'bcgov-design-system' ),
};
