/**
 * Columns functionality for Document Manager
 * Handles custom columns management
 */

(function ($) {
    'use strict';
    
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Module definition
    window.BCGOV.DocumentManager.Columns = {
        init: function() {
            this.initEventHandlers();
        },
        
        initEventHandlers: function() {
            // Handle adding new column
            $('#add-column-form').on('submit', function(e) {
                e.preventDefault();
                
                var formData = new FormData(this);
                formData.append('action', 'save_column_settings');
                formData.append('security', documentManager.nonce);
                
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function() {
                        $('#add-column-form button[type="submit"]')
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
                        $('#add-column-form button[type="submit"]')
                            .prop('disabled', false)
                            .text('Add Column');
                    }
                });
            });

            // Handle column deletion
            $(document).on('click', '.delete-column', function(e) {
                e.preventDefault();
                
                if (!confirm('Are you sure you want to delete this column? This will remove all associated metadata from documents.')) {
                    return;
                }

                const $button = $(this);
                const metaKey = $button.data('meta-key');
                const $row = $button.closest('tr');
                
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'delete_column',
                        security: documentManager.nonce,
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
                            alert('Error: ' + (response.data || 'Failed to delete column'));
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