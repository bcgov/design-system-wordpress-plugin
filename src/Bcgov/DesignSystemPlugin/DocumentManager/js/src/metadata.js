/**
 * Metadata functionality for Document Manager
 * Handles custom metadata fields management
 * 
 * This module provides administrative functionality to:
 * - Add new custom metadata fields to the document system
 * - Delete existing metadata fields
 * - Manage the schema of document metadata
 * 
 * Custom metadata fields allow administrators to extend the document
 * management system with organization-specific attributes beyond the
 * standard title and description fields.
 */

(function ($) {
    'use strict';
    
    // Establish namespaces if they don't exist
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    /**
     * Metadata management module
     * Handles the administration of custom document metadata fields
     */
    window.BCGOV.DocumentManager.Metadata = {
        /**
         * Initialize the module
         * Sets up the event handlers for metadata management
         */
        init: function() {
            this.initEventHandlers();
        },
        
        /**
         * Set up all event handlers for metadata management
         * Manages form submissions and deletion requests
         */
        initEventHandlers: function() {
            // Handle the form submission for adding a new metadata field
            // This creates a new column in the document table
            $('#add-metadata-form').on('submit', function(e) {
                e.preventDefault();
                
                // Use FormData to easily collect all form fields
                // This supports both text inputs and potential file uploads
                var formData = new FormData(this);
                
                // Add required AJAX parameters
                formData.append('action', 'save_metadata_settings');  // WordPress AJAX action
                formData.append('security', documentManager.nonces.metadata_settings);  // Security nonce
                
                // Send the AJAX request to create the new metadata field
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: formData,
                    processData: false,  // Don't process the FormData object
                    contentType: false,  // Let the browser set content type with boundary
                    
                    // Update UI to show processing state
                    beforeSend: function() {
                        $('#add-metadata-form button[type="submit"]')
                            .prop('disabled', true)
                            .text('Adding...');
                    },
                    
                    // Handle the server response
                    success: function(response) {
                        if (response.success) {
                            // Reload page to show the new metadata field
                            // This ensures all UI components are updated correctly
                            window.location.reload();
                        } else {
                            // Display error message from server
                            alert('Error: ' + (response.data || 'Unknown error occurred'));
                        }
                    },
                    
                    // Handle AJAX errors (network issues, server errors)
                    error: function(xhr, status, error) {
                        alert('Error: ' + error);
                    },
                    
                    // Always restore the button state when complete
                    complete: function() {
                        $('#add-metadata-form button[type="submit"]')
                            .prop('disabled', false)
                            .text('Add Field');
                    }
                });
            });

            // Handle deletion of existing metadata fields
            // This removes the column and all associated metadata values
            $(document).on('click', '.delete-metadata', function(e) {
                e.preventDefault();
                
                // Confirm deletion since this is a destructive operation
                // This helps prevent accidental data loss
                if (!confirm('Are you sure you want to delete this metadata field? This will remove all associated metadata from documents.')) {
                    return;
                }

                // Get the field information from the button
                const $button = $(this);
                const metaKey = $button.data('meta-key');  // The identifier for this metadata field
                const $row = $button.closest('tr');        // The table row to remove if successful
                
                // Send the AJAX request to delete the metadata field
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'delete_metadata',         // WordPress AJAX action
                        security: documentManager.nonces.metadata_settings,  // Security nonce
                        meta_key: metaKey                  // The field to delete
                    },
                    
                    // Update UI to show processing state
                    beforeSend: function() {
                        $button.prop('disabled', true);
                        $row.addClass('deleting');         // Add visual indicator
                    },
                    
                    // Handle the server response
                    success: function(response) {
                        if (response.success) {
                            // Animate the removal of the row for better UX
                            $row.fadeOut(400, function() {
                                $(this).remove();
                            });
                        } else {
                            // Display error message and restore UI state
                            alert('Error: ' + (response.data || 'Failed to delete metadata field'));
                            $row.removeClass('deleting');
                            $button.prop('disabled', false);
                        }
                    },
                    
                    // Handle AJAX errors (network issues, server errors)
                    error: function(xhr, status, error) {
                        alert('Error: ' + error);
                        
                        // Restore UI state
                        $row.removeClass('deleting');
                        $button.prop('disabled', false);
                    }
                });
            });
        }
    };
    
})(jQuery); 