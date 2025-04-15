/**
 * Edit Document functionality for Document Manager
 * Handles editing document metadata in modals
 * 
 * This module manages the document editing interface, allowing users to:
 * - Edit document titles and descriptions
 * - Update custom metadata fields 
 * - Submit changes via AJAX
 * - Update the UI with changes without page reload
 * 
 * The module uses a modal dialog approach to provide a focused editing
 * experience without navigating away from the document list.
 */

(function ($) {
    'use strict';
    
    // Establish namespaces if they don't exist
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    /**
     * EditDocument module definition
     * Provides functionality for editing individual document metadata
     */
    window.BCGOV.DocumentManager.EditDocument = {
        /**
         * Initialize the module
         * Entry point for the module's functionality
         */
        init: function() {
            this.initEventHandlers();
        },
        
        /**
         * Set up all event handlers for document editing
         * Manages button clicks, form submissions, and modal interactions
         */
        initEventHandlers: function() {
            // Open edit modal when an edit button is clicked
            // This captures the document data and populates the form
            $(document).on('click', '.edit-metadata', function(e) {
                e.preventDefault();
                
                var $button = $(this);
                var postId = $button.data('id');
                // Use attr() instead of data() to get the current values
                // data() caches values, while attr() always reads from the DOM
                var title = $button.attr('data-title');
                var description = $button.attr('data-description');
                var metadata = $button.attr('data-metadata');
                
                // Parse the metadata JSON string into an object
                // Metadata comes from the button's data-metadata attribute
                // where it's stored as a JSON string
                try {
                    metadata = JSON.parse(metadata || '{}');
                } catch (e) {
                    console.error('Error parsing metadata:', e);
                    metadata = {};
                }

                // Populate the form fields with the document's current values
                $('#edit-post-id').val(postId);
                $('#edit_document_title').val(title);
                $('#edit_document_description').val(description);
                
                // Populate custom metadata fields
                // These are dynamically generated based on the available metadata fields
                if (metadata && typeof metadata === 'object') {
                    Object.keys(metadata).forEach(function(key) {
                        var $field = $('#edit_' + key);
                        if ($field.length) {
                            $field.val(metadata[key] || '');
                        }
                    });
                }
                
                // Display the edit modal
                $('#edit-document-modal').show();
            });

            // Handle modal close via close button or cancel button
            $(document).on('click', '.close-modal, .cancel-edit', function() {
                $(this).closest('.metadata-modal').hide();
            });

            // Close modal when clicking outside the modal content
            // This provides an intuitive way to dismiss the modal
            $(window).on('click', function(event) {
                if ($(event.target).hasClass('metadata-modal')) {
                    $(event.target).hide();
                }
            });
            
            // Handle form submission to save document changes
            $('#edit-document-form').on('submit', function(e) {
                e.preventDefault();
                
                var $form = $(this);
                var $submitButton = $form.find('button[type="submit"]');
                var postId = $('#edit-post-id').val();
                
                // Collect all form data for submission
                var formData = {
                    action: 'save_document_metadata',  // WordPress AJAX action
                    post_id: postId,                   // Document ID to update
                    security: documentManager.nonces.edit, // Security nonce
                    title: $('#edit_document_title').val(),
                    description: $('#edit_document_description').val(),
                    meta: {}  // Container for custom metadata fields
                };
                
                // Collect values from all custom metadata fields
                // These have names in the format meta[field_name]
                $form.find('[name^="meta["]').each(function() {
                    var $field = $(this);
                    // Extract the field name from the input name attribute
                    var key = $field.attr('name').match(/meta\[(.*?)\]/)[1];
                    formData.meta[key] = $field.val();
                });
                
                // Update UI to show saving is in progress
                $submitButton.prop('disabled', true).text('Saving...');
                
                // Send the AJAX request to update the document
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: formData,
                    success: function(response) {
                        if (response.success) {
                            // Find the document's row in the table
                            var $row = $('tr[data-id="' + postId + '"]');
                            
                            // Update the table row with the new data
                            // This avoids having to reload the page
                            if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
                                // Update all custom metadata fields
                                window.BCGOV.DocumentManager.TableView.updateRowMetadata($row, formData.meta);

                                // Update the edit button's data attributes with new values
                                // This ensures future edits will have the updated data
                                var $editButton = $row.find('.edit-metadata');
                                $editButton.attr({
                                    'data-title': formData.title,
                                    'data-description': formData.description
                                });
                                
                                // Update the title and description columns in the table
                                window.BCGOV.DocumentManager.TableView.updateField($row, 'title', formData.title);
                                window.BCGOV.DocumentManager.TableView.updateField($row, 'description', formData.description);
                                
                                // Highlight the row to provide visual feedback
                                window.BCGOV.DocumentManager.TableView.highlightUpdatedRow($row);
                            }
                            
                            // Hide the modal and show success notification
                            $('#edit-document-modal').hide();
                            window.BCGOV.DocumentManager.utils.showNotification('Document updated successfully!', 'success');
                        } else {
                            // Handle server-side errors
                            window.BCGOV.DocumentManager.utils.showNotification(response.data.message || 'Error updating document.', 'error');
                        }
                    },
                    error: function(xhr, status, error) {
                        // Handle AJAX errors (network issues, server errors)
                        console.error('Save error:', {xhr, status, error});
                        window.BCGOV.DocumentManager.utils.showNotification('Error saving changes. Please try again.', 'error');
                    },
                    complete: function() {
                        // Reset button state regardless of success/failure
                        $submitButton.prop('disabled', false).text('Save Changes');
                    }
                });
            });
        }
    };
    
})(jQuery); 