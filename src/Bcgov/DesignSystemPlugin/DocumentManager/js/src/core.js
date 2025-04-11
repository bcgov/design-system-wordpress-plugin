/**
 * Core functionality for the Document Manager
 * Initializes the document manager and contains shared variables and utilities
 */

(function ($) {
    'use strict';

    // Export to global namespace for other modules to use
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};

    // Main initialization function
    window.BCGOV.DocumentManager.init = function() {
        console.log('Document Manager script loaded');
        
        // Initialize all modules
        if (typeof window.BCGOV.DocumentManager.Upload !== 'undefined') {
            window.BCGOV.DocumentManager.Upload.init();
        }
        
        if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
            window.BCGOV.DocumentManager.TableView.init();
        }
        
        if (typeof window.BCGOV.DocumentManager.EditDocument !== 'undefined') {
            window.BCGOV.DocumentManager.EditDocument.init();
        }
        
        if (typeof window.BCGOV.DocumentManager.BulkEdit !== 'undefined') {
            window.BCGOV.DocumentManager.BulkEdit.init();
        }
        
        if (typeof window.BCGOV.DocumentManager.Metadata !== 'undefined') {
            window.BCGOV.DocumentManager.Metadata.init();
        }
    };

    // Shared utilities
    window.BCGOV.DocumentManager.utils = {
        // Helper function to format the date
        formatDate: function(date) {
            return new Date(date).toLocaleDateString();
        },

        // Helper function to format empty values
        formatDisplayValue: function(value) {
            if (value === null || value === undefined || value === '') {
                return '—';  // Use em dash for empty values
            }
            return value;
        },

        // Helper function to show notifications (replace any existing notification)
        showNotification: function(message, type = 'success') {
            // Remove any existing notifications first
            $('.notice').remove();
            
            var notificationClass = 'notice notice-' + type + ' is-dismissible';
            var notification = $('<div class="' + notificationClass + '"><p>' + message + '</p></div>');
            
            // Add the notification at the top of the page
            $('.wrap > h1').after(notification);
            
            // Auto dismiss success messages after 5 seconds
            if (type === 'success') {
                setTimeout(function() {
                    notification.fadeOut(400, function() {
                        $(this).remove();
                    });
                }, 5000);
            }
        }
    };

    // Document ready handler
    $(document).ready(function() {
        window.BCGOV.DocumentManager.init();
    });

})(jQuery); 