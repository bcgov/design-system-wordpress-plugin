<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * DocumentManagerScripts Service
 * 
 * This specialized service handles all front-end asset management for the Document Manager.
 * It's a crucial part of the presentation layer that ensures all JavaScript modules and CSS
 * are properly registered, enqueued, and initialized with the necessary configuration data.
 * 
 * Architectural benefits:
 * - Centralizes all script/style management in one dedicated class
 * - Ensures conditional loading to optimize admin performance
 * - Provides modular JavaScript architecture through dependencies
 * - Creates a bridge between PHP backend and JavaScript frontend
 * 
 * Performance optimizations:
 * - Conditional loading only on relevant admin pages
 * - Automatic versioning based on file modification time for cache busting
 * - Modular loading with proper dependencies to prevent duplicate code
 * - Footer loading of scripts to improve page rendering performance
 */
class DocumentManagerScripts {
    /**
     * Configuration settings
     * 
     * Used to access plugin-wide settings such as nonce keys,
     * feature flags, and other configuration values needed
     * for JavaScript initialization.
     * 
     * @var DocumentManagerConfig
     */
    private $config;
    
    /**
     * Constructor
     * 
     * Initializes the scripts service with its required dependencies.
     * Uses dependency injection for better testability and looser coupling.
     * 
     * @param DocumentManagerConfig $config Configuration service
     */
    public function __construct(DocumentManagerConfig $config) {
        $this->config = $config;
    }
    
    /**
     * Enqueue necessary scripts and styles
     * 
     * This method is the primary entry point, typically hooked to WordPress's
     * 'admin_enqueue_scripts' action. It performs several key functions:
     * 
     * 1. Checks if we're on a Document Manager admin page
     * 2. Registers and enqueues all required JavaScript modules
     * 3. Establishes module dependencies for proper loading order
     * 4. Adds version numbers for cache management
     * 5. Localizes scripts with translated messages and configuration
     * 6. Sets up security through WordPress nonces
     * 
     * The JavaScript architecture follows a modular pattern where:
     * - core.js: Contains shared utilities and configuration
     * - Feature-specific modules: Handle discrete functionality areas
     * - Each module properly depends on its prerequisites
     * 
     * @param string $hook The current admin page hook suffix
     */
    public function enqueue_admin_scripts($hook) {
        // Performance optimization: Only load on Document Manager pages
        $valid_pages = array('toplevel_page_document-manager', 'documents_page_document-metadata');
        if (!in_array($hook, $valid_pages)) {
            return;
        }

        // Get the correct plugin directory path and URL
        // This complex path resolution handles various WordPress installation structures
        $plugin_dir = plugin_dir_path(dirname(dirname(dirname(dirname(__FILE__)))));
        $plugin_url = plugin_dir_url(dirname(dirname(dirname(dirname(__FILE__)))));
        
        // Remove the extra 'src' from the paths
        $relative_path = 'Bcgov/DesignSystemPlugin/DocumentManager/';
        
        // Construct file paths
        $style_path = $plugin_dir . $relative_path . 'style.css';
        
        // Define JavaScript modules with their dependencies
        // This modular approach allows for better organization and performance
        $js_modules = array(
            'core' => array(
                'file' => 'js/src/core.js',
                'deps' => array('jquery')
            ),
            'table-view' => array(
                'file' => 'js/src/table-view.js',
                'deps' => array('jquery', 'document-manager-core')
            ),
            'upload' => array(
                'file' => 'js/src/upload.js',
                'deps' => array('jquery', 'document-manager-core', 'document-manager-table-view')
            ),
            'edit-document' => array(
                'file' => 'js/src/edit-document.js',
                'deps' => array('jquery', 'document-manager-core', 'document-manager-table-view')
            ),
            'bulk-edit' => array(
                'file' => 'js/src/bulk-edit.js',
                'deps' => array('jquery', 'document-manager-core', 'document-manager-table-view')
            ),
            'metadata' => array(
                'file' => 'js/src/metadata.js',
                'deps' => array('jquery', 'document-manager-core')
            )
        );
        
        // Enqueue each module with proper caching and dependency management
        foreach ($js_modules as $name => $module) {
            // Generate file paths and URLs
            $file_path = $plugin_dir . $relative_path . $module['file'];
            $file_url = $plugin_url . $relative_path . $module['file'];
            
            // Use file modification time as version for cache busting
            // This ensures browsers load the latest version after changes
            $version = file_exists($file_path) ? filemtime($file_path) : '1.0';
            
            // Register and enqueue the script
            // Note: true in the last parameter loads scripts in footer for better performance
            wp_enqueue_script(
                'document-manager-' . $name, 
                $file_url, 
                $module['deps'], 
                $version, 
                true
            );
        }
        
        // Enqueue styles with cache busting version number
        $style_url = $plugin_url . $relative_path . 'style.css';
        $style_version = file_exists($style_path) ? filemtime($style_path) : '1.0';
        wp_enqueue_style('document-manager-styles', $style_url, array(), $style_version);
        
        // Security: Generate WordPress nonce for AJAX operations
        // This prevents Cross-Site Request Forgery (CSRF) attacks
        $nonce_key = $this->config->get('nonce_key');
        $nonce = wp_create_nonce($nonce_key);
        
        // Add debug logging for troubleshooting
        // These logs help diagnose issues in development environments
        error_log('Enqueuing scripts for document manager');
        error_log('Nonce Key: ' . $nonce_key);
        error_log('Generated Nonce: ' . $nonce);

        // Add localized script data to the core module
        // This creates the bridge between PHP and JavaScript
        wp_localize_script('document-manager-core', 'documentManager', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => $nonce,
            'isAdmin' => current_user_can('manage_options'),
            'messages' => $this->getLocalizedMessages()
        ));
    }
    
    /**
     * Get localized messages for JavaScript
     * 
     * This method centralizes all user-facing messages that will be used
     * in JavaScript. Benefits of this approach include:
     * 
     * - Internationalization (i18n) support through WordPress translation functions
     * - Consistent messaging between PHP and JavaScript components
     * - Single point of maintenance for all front-end text
     * - Avoids hardcoded strings in JavaScript files
     *
     * Integration points:
     * - Used by all JavaScript modules through the global documentManager object
     * - Supports WordPress translation workflow with translation functions
     * - Messages can be extended or modified centrally without changing JS files
     *
     * @return array Associative array of message keys and translated strings
     */
    private function getLocalizedMessages() {
        return array(
            'unauthorized' => __('You do not have permission to perform this action.', 'design-system'),
            'uploadError' => __('Error uploading file.', 'design-system'),
            'success' => __('Document uploaded successfully.', 'design-system'),
            'deleteConfirm' => __('Are you sure you want to delete this document?', 'design-system'),
            'saving' => __('Saving changes...', 'design-system'),
            'saved' => __('Changes saved successfully.', 'design-system'),
        );
    }
} 