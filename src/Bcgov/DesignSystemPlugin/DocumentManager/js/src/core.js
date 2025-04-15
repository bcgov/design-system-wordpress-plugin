/**
 * Core functionality for the Document Manager
 * Initializes the document manager and contains shared variables and utilities
 * 
 * This module serves as the central hub for the Document Manager's JavaScript functionality.
 * It provides:
 * - Namespace management to prevent global scope pollution
 * - Centralized initialization of all feature modules
 * - Shared utility functions used across modules
 * - Common UI patterns and helpers
 * 
 * The architecture follows a modular pattern where each feature has its own
 * module (Upload, TableView, EditDocument, BulkEdit, Metadata) that is 
 * initialized by this core component when the DOM is ready.
 */

(function ($) {
    'use strict';

    // Create global namespaces to organize code and prevent conflicts
    // All Document Manager functionality will be attached to these objects
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};

    /**
     * Main initialization function
     * 
     * Detects which modules are available and initializes each one
     * This allows for feature modules to be added or removed without
     * modifying the core initialization process
     */
    window.BCGOV.DocumentManager.init = function() {
        
        // Conditionally initialize each module if it exists
        // This approach allows for:
        // 1. Graceful degradation if a module fails to load
        // 2. Selective inclusion of modules based on the current page
        // 3. Easier testing of individual modules
        
        // Initialize file upload functionality
        if (typeof window.BCGOV.DocumentManager.Upload !== 'undefined') {
            window.BCGOV.DocumentManager.Upload.init();
        }
        
        // Initialize table view and manipulation
        if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
            window.BCGOV.DocumentManager.TableView.init();
        }
        
        // Initialize single document editing functionality
        if (typeof window.BCGOV.DocumentManager.EditDocument !== 'undefined') {
            window.BCGOV.DocumentManager.EditDocument.init();
        }
        
        // Initialize bulk editing functionality
        if (typeof window.BCGOV.DocumentManager.BulkEdit !== 'undefined') {
            window.BCGOV.DocumentManager.BulkEdit.init();
        }
        
        // Initialize metadata management functionality
        if (typeof window.BCGOV.DocumentManager.Metadata !== 'undefined') {
            window.BCGOV.DocumentManager.Metadata.init();
        }
    };

    /**
     * Shared utility functions
     * 
     * This object contains reusable utility functions that are used
     * across multiple modules. Centralizing these functions here:
     * - Reduces code duplication
     * - Ensures consistent behavior
     * - Makes updates easier (change in one place)
     * - Simplifies testing
     */
    window.BCGOV.DocumentManager.utils = {
        /**
         * Format a date object or string into a localized date string
         * Uses the browser's locale settings for consistent date formatting
         * 
         * @param {Date|string} date - The date to format
         * @return {string} Localized date string
         */
        formatDate: function(date) {
            return new Date(date).toLocaleDateString();
        },

        /**
         * Format empty or null values for display
         * Converts empty values to an em dash for better visual presentation
         * 
         * @param {*} value - The value to format
         * @return {string} Formatted value or em dash if empty
         */
        formatDisplayValue: function(value) {
            if (value === null || value === undefined || value === '') {
                return '—';  // Use em dash for empty values
            }
            return value;
        },

        /**
         * Display a notification message to the user
         * Creates a WordPress-style notification at the top of the page
         * 
         * @param {string} message - The message to display
         * @param {string} type - Message type: 'success', 'error', 'warning', or 'info'
         */
        showNotification: function(message, type = 'success') {
            // Remove any existing notifications to prevent stacking
            $('.notice').remove();
            
            // Create notification with WordPress admin styling
            var notificationClass = 'notice notice-' + type + ' is-dismissible';
            var notification = $('<div class="' + notificationClass + '"><p>' + message + '</p></div>');
            
            // Insert notification after the page title
            $('.wrap > h1').after(notification);
            
            // Auto-dismiss success messages after 5 seconds
            // Error and warning messages remain until manually dismissed
            if (type === 'success') {
                setTimeout(function() {
                    notification.fadeOut(400, function() {
                        $(this).remove();
                    });
                }, 5000);
            }
        }
    };

    /**
     * Initialize the Document Manager when the DOM is fully loaded
     * This ensures all elements are available for manipulation
     */
    $(document).ready(function() {
        window.BCGOV.DocumentManager.init();
    });

})(jQuery); 