/**
 * Edit Document functionality for Document Manager
 * Handles editing document metadata in modals
 */

(function ($) {
    'use strict';
    
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Module definition
    window.BCGOV.DocumentManager.EditDocument = {
        init: function() {
            this.initEventHandlers();
        },
        
        initEventHandlers: function() {
            // Handle edit button click
            $(document).on('click', '.edit-metadata', function(e) {
                e.preventDefault();
                
                var $button = $(this);
                var postId = $button.data('id');
                var title = $button.attr('data-title'); // Use attr instead of data
                var description = $button.attr('data-description'); // Use attr instead of data
                var metadata = $button.attr('data-metadata'); // Use attr instead of data
                
                console.log('Edit button clicked');
                console.log('Raw metadata from attribute:', metadata);
                
                try {
                    metadata = JSON.parse(metadata || '{}');
                } catch (e) {
                    console.error('Error parsing metadata:', e);
                    metadata = {};
                }
                
                console.log('Parsed metadata:', metadata);

                // Populate the form
                $('#edit-post-id').val(postId);
                $('#edit_document_title').val(title);
                $('#edit_document_description').val(description);
                
                // Populate metadata fields
                if (metadata && typeof metadata === 'object') {
                    Object.keys(metadata).forEach(function(key) {
                        var $field = $('#edit_' + key);
                        if ($field.length) {
                            $field.val(metadata[key] || '');
                        }
                    });
                }
                
                $('#edit-document-modal').show();
            });

            // Handle modal close
            $(document).on('click', '.close-modal, .cancel-edit', function() {
                $(this).closest('.metadata-modal').hide();
            });

            // Close modal when clicking outside
            $(window).on('click', function(event) {
                if ($(event.target).hasClass('metadata-modal')) {
                    $(event.target).hide();
                }
            });
            
            // Update the edit form submission handler
            $('#edit-document-form').on('submit', function(e) {
                e.preventDefault();
                
                var $form = $(this);
                var $submitButton = $form.find('button[type="submit"]');
                var postId = $('#edit-post-id').val();
                
                // Collect form data
                var formData = {
                    action: 'save_document_metadata',
                    post_id: postId,
                    security: documentManager.nonce,
                    title: $('#edit_document_title').val(),
                    description: $('#edit_document_description').val(),
                    meta: {}
                };
                
                // Collect metadata
                $form.find('[name^="meta["]').each(function() {
                    var $field = $(this);
                    var key = $field.attr('name').match(/meta\[(.*?)\]/)[1];
                    formData.meta[key] = $field.val();
                });
                
                // Show saving state
                $submitButton.prop('disabled', true).text('Saving...');
                
                // Make the AJAX request
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: formData,
                    success: function(response) {
                        if (response.success) {
                            var $row = $('tr[data-id="' + postId + '"]');
                            
                            // Update all metadata at once
                            if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
                                window.BCGOV.DocumentManager.TableView.updateRowMetadata($row, formData.meta);

                                // Update title and description
                                var $editButton = $row.find('.edit-metadata');
                                $editButton.attr({
                                    'data-title': formData.title,
                                    'data-description': formData.description
                                });
                                
                                window.BCGOV.DocumentManager.TableView.updateField($row, 'title', formData.title);
                                window.BCGOV.DocumentManager.TableView.updateField($row, 'description', formData.description);
                                
                                window.BCGOV.DocumentManager.TableView.highlightUpdatedRow($row);
                            }
                            
                            $('#edit-document-modal').hide();
                            window.BCGOV.DocumentManager.utils.showNotification('Document updated successfully!', 'success');
                        } else {
                            window.BCGOV.DocumentManager.utils.showNotification(response.data.message || 'Error updating document.', 'error');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Save error:', {xhr, status, error});
                        window.BCGOV.DocumentManager.utils.showNotification('Error saving changes. Please try again.', 'error');
                    },
                    complete: function() {
                        $submitButton.prop('disabled', false).text('Save Changes');
                    }
                });
            });
        }
    };
    
})(jQuery); 