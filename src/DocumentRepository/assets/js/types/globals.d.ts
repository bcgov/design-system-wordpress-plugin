/**
 * Global Type Declarations
 *
 * This file contains TypeScript type declarations for global variables
 * and objects used throughout the application. It extends the Window
 * interface to include WordPress-specific global variables and settings.
 *
 * @module types/globals
 */

/* eslint-disable no-undef */

/**
 * Extended Window interface with WordPress-specific properties
 */
declare global {
	interface Window {
		/**
		 * Document Repository Settings
		 *
		 * Global settings object provided by WordPress for the Document Repository plugin.
		 * Contains configuration values and API endpoints used throughout the application.
		 */
		documentRepositorySettings: {
			/** The API namespace for WordPress REST API endpoints */
			apiNamespace: string;
			/** The API root URL for WordPress REST API endpoints */
			apiRoot: string;
			/** The WordPress nonce for authentication */
			nonce: string;
			// Add any other properties that WordPress adds to this object
		};

		/**
		 * WordPress Core
		 *
		 * Global WordPress object containing core functionality.
		 * Uncomment and use when WordPress core functionality is needed.
		 *
		 * @property {Object} wp - WordPress core functionality object
		 */
		// wp: any;

		/**
		 * WordPress API Settings
		 *
		 * Global settings object for WordPress REST API configuration.
		 * Uncomment and use when WordPress API settings are needed.
		 *
		 * @property {Object} wpApiSettings - WordPress REST API configuration settings
		 */
		// wpApiSettings: any;
	}
}

/* eslint-enable no-undef */

// This export is required to make this a module
export {};
