/**
 * Metadata Settings - Main Application Entry Point
 * 
 * This is the main entry point for the Metadata Settings React application.
 * It sets up the React application and mounts it to the DOM.
 */

import { createRoot } from '@wordpress/element';
import MetadataApp from './MetadataApp';

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('dswp-document-repository-metadata-app');
    
    if (!container) {
        console.error('Could not find metadata app container element');
        return;
    }

    try {
        const root = createRoot(container);
        root.render(<MetadataApp />);
    } catch (error) {
        console.error('Error initializing metadata app:', error);
        container.innerHTML = '<div class="notice notice-error"><p>Error initializing metadata settings. Please check the console for details.</p></div>';
    }
}); 