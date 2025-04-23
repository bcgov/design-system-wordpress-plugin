/**
 * Document Repository - Main Application Entry Point
 * 
 * This is the main entry point for the Document Repository React application.
 * It sets up the React application and mounts it to the DOM.
 */

import { render } from '@wordpress/element';
import App from './App';
import { Modal, Button } from '@wordpress/components';

// Ensure WP components are preloaded

/**
 * Render the app
 */
document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('document-repository-app');
    
    if (appContainer) {
        console.log('Document Repository mounting app');
        
        // Create a Modal root element if it doesn't exist
        let modalRoot = document.getElementById('document-repository-modals');
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'document-repository-modals';
            document.body.appendChild(modalRoot);
        }
        
        render(<App />, appContainer);
    } else {
        console.warn('Document Repository app container not found');
    }
}); 