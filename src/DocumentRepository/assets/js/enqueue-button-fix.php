<?php
/**
 * Enqueue the button fix JavaScript
 * 
 * This file enqueues a JavaScript solution to fix the button styling
 * when CSS is not working properly due to conflicts or specificity issues.
 */

// Don't allow direct access to this file
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Enqueue the button fix script
 */
function bcgov_document_repository_enqueue_button_fix() {
    // Get the plugin URL
    $plugin_url = plugin_dir_url(dirname(__FILE__));
    
    // Enqueue the script with high priority (100) to make sure it runs after all other scripts
    wp_enqueue_script(
        'bcgov-document-repository-button-fix',
        $plugin_url . 'js/button-fix.js',
        array('jquery'),
        '1.0.0',
        true // Load in footer
    );
}
add_action('admin_enqueue_scripts', 'bcgov_document_repository_enqueue_button_fix', 100); 