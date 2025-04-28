/**
 * Document Repository - Main Application Entry Point
 * 
 * This is the main entry point for the Document Repository React application.
 * It sets up the React application and mounts it to the DOM.
 * 
 * @module DocumentRepository
 * @requires @wordpress/element
 * @requires ./App
 */

import { render } from '@wordpress/element';
import App from './App';

/**
 * Initialize the Document Repository application
 * 
 * This function is called when the DOM is fully loaded. It:
 * 1. Finds the application container element
 * 2. Creates a modal root element for WordPress modals
 * 3. Renders the main App component
 * 
 * @function initializeApp
 * @listens DOMContentLoaded
 * @throws {Error} If the app container is not found
 */
document.addEventListener('DOMContentLoaded', () => {
    // Find the application container
    const appContainer = document.getElementById('dswp-document-repository-app');
    
    if (appContainer) {
        console.log('Document Repository mounting app');
        
        /**
         * Create a Modal root element for WordPress modals
         * 
         * This is required for WordPress modal components to work properly.
         * The modal root is appended to the document body if it doesn't exist.
         */
        let modalRoot = document.getElementById('dswp-document-repository-modals');
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'dswp-document-repository-modals';
            document.body.appendChild(modalRoot);
        }
        
        // Render the main App component
        render(<App />, appContainer);
    } else {
        console.warn('Document Repository app container not found');
    }
}); 