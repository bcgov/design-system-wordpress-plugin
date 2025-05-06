/**
 * Document Repository - Main Application Entry Point
 *
 * This is the main entry point for the Document Repository React application.
 * It sets up the React application and mounts it to the DOM.
 *
 * @module DocumentRepository
 * @requires @wordpress/element
 */

import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Initialize and render the Document Repository application
 */
document.addEventListener( 'DOMContentLoaded', () => {
	try {
		const appContainer = document.getElementById(
			'dswp-document-repository-app'
		);

		if ( appContainer ) {
			const root = createRoot( appContainer );
			root.render( <App /> );
		} else {
			// Create a visible error message if container is not found
			const errorDiv = document.createElement( 'div' );
			errorDiv.style.color = 'red';
			errorDiv.style.padding = '20px';
			errorDiv.style.border = '1px solid red';
			errorDiv.innerHTML =
				'<strong>Error:</strong> Document Repository container not found. Check console for details.';
			document.body.prepend( errorDiv );
		}
	} catch ( error ) {
		// Display error on the page
		const errorDiv = document.createElement( 'div' );
		errorDiv.style.color = 'red';
		errorDiv.style.padding = '20px';
		errorDiv.style.border = '1px solid red';
		errorDiv.innerHTML = `<strong>Error:</strong> Failed to initialize Document Repository app: ${ error.message }`;
		document.body.prepend( errorDiv );
	}
} );
