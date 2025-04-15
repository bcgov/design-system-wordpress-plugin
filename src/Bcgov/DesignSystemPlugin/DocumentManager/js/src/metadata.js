/**
 * Metadata functionality for Document Manager
 * Handles custom metadata fields management
 */

(function ($) {
    'use strict';
    
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Module definition
    window.BCGOV.DocumentManager.Metadata = {
        init: function() {
            this.initEventHandlers();
        },
        
        initEventHandlers: function() {
            // Handle adding new metadata field
            $('#add-metadata-form').on('submit', function(e) {
                e.preventDefault();
                
                var formData = new FormData(this);
                formData.append('action', 'save_metadata_settings');
                formData.append('security', documentManager.nonces.metadata_settings);
                
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function() {
                        $('#add-metadata-form button[type="submit"]')
                            .prop('disabled', true)
                            .text('Adding...');
                    },
                    success: function(response) {
                        if (response.success) {
                            window.location.reload();
                        } else {
                            alert('Error: ' + (response.data || 'Unknown error occurred'));
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('Error: ' + error);
                    },
                    complete: function() {
                        $('#add-metadata-form button[type="submit"]')
                            .prop('disabled', false)
                            .text('Add Field');
                    }
                });
            });

            // Handle metadata field deletion
            $(document).on('click', '.delete-metadata', function(e) {
                e.preventDefault();
                
                if (!confirm('Are you sure you want to delete this metadata field? This will remove all associated metadata from documents.')) {
                    return;
                }

                const $button = $(this);
                const metaKey = $button.data('meta-key');
                const $row = $button.closest('tr');
                
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'delete_metadata',
                        security: documentManager.nonces.metadata_settings,
                        meta_key: metaKey
                    },
                    beforeSend: function() {
                        $button.prop('disabled', true);
                        $row.addClass('deleting');
                    },
                    success: function(response) {
                        if (response.success) {
                            $row.fadeOut(400, function() {
                                $(this).remove();
                            });
                        } else {
                            alert('Error: ' + (response.data || 'Failed to delete metadata field'));
                            $row.removeClass('deleting');
                            $button.prop('disabled', false);
                        }
                    },
                    error: function(xhr, status, error) {
                        alert('Error: ' + error);
                        $row.removeClass('deleting');
                        $button.prop('disabled', false);
                    }
                });
            });
        }
    };
    
})(jQuery); 