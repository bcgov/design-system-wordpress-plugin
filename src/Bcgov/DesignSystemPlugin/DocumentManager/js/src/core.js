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
        
        if (typeof window.BCGOV.DocumentManager.Columns !== 'undefined') {
            window.BCGOV.DocumentManager.Columns.init();
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

    // Add CSS to ensure proper display
    function addStyles() {
        var style = document.createElement('style');
        style.textContent = `
            .edit-mode {
                display: none;
                width: 100%;
                padding: 5px;
                margin: 2px 0;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .view-mode {
                display: block;
                padding: 5px;
            }
            .bulk-edit-mode .edit-mode {
                display: block;
            }
            .bulk-edit-mode .view-mode {
                display: none;
            }
            .wp-list-table {
                table-layout: fixed;
                width: 100%;
            }
            .wp-list-table th,
            .wp-list-table td {
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            .wp-list-table .column-icon {
                width: 30px;
            }
            .wp-list-table .column-actions {
                width: 200px;
            }
            .wp-list-table .column-title {
                width: 20%;
            }
            .wp-list-table .column-description {
                width: 25%;
            }
            .wp-list-table .column-filetype {
                width: 10%;
            }
            .wp-list-table .column-date {
                width: 10%;
            }
        `;
        document.head.appendChild(style);
    }

    // Document ready handler
    $(document).ready(function() {
        addStyles();
        window.BCGOV.DocumentManager.init();
    });

})(jQuery); 