/**
 * Bulk Edit functionality for Document Manager
 * Handles bulk editing of documents in the table
 */

(function ($) {
    'use strict';
    
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Private variables
    var hasUnsavedChanges = false;
    var $table;
    var $bulkEditBtn;
    var $saveChangesBtn;
    var $cancelBulkEditBtn;
    
    // Module definition
    window.BCGOV.DocumentManager.BulkEdit = {
        init: function() {
            $table = $('.wp-list-table');
            $bulkEditBtn = $('.toggle-bulk-edit');
            $saveChangesBtn = $('.save-bulk-edit');
            $cancelBulkEditBtn = $('.cancel-bulk-edit');
            
            if ($table.length === 0) {
                return;
            }
            
            this.initEventHandlers();
        },
        
        initEventHandlers: function() {
            // Enable bulk edit mode
            $bulkEditBtn.on('click', function(e) {
                e.preventDefault();
                window.BCGOV.DocumentManager.BulkEdit.enterBulkEditMode();
            });

            // Track changes in editable fields
            $table.on('input change', '.edit-mode', function() {
                $(this).addClass('changed');
                hasUnsavedChanges = true;
            });

            // Cancel bulk edit
            $cancelBulkEditBtn.on('click', function(e) {
                e.preventDefault();
                if (hasUnsavedChanges) {
                    if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                        return;
                    }
                }
                window.BCGOV.DocumentManager.BulkEdit.exitBulkEditMode();
                hasUnsavedChanges = false; // Reset the changes flag
            });
            
            // Warn user about unsaved changes when leaving page
            $(window).on('beforeunload', function(e) {
                if (hasUnsavedChanges) {
                    return 'You have unsaved changes. Are you sure you want to leave?';
                }
            });
            
            // Update the bulk edit save handler
            $('.save-bulk-edit').on('click', function() {
                window.BCGOV.DocumentManager.BulkEdit.saveBulkEdits();
            });
        },
        
        // Helper function to enter bulk edit mode
        enterBulkEditMode: function() {
            $('.view-mode').hide();
            $('.edit-mode').show();
            $('.toggle-bulk-edit').hide();
            $('.save-bulk-edit, .cancel-bulk-edit').show();
            $table.addClass('bulk-edit-mode');
        },
        
        // Helper function to exit bulk edit mode
        exitBulkEditMode: function() {
            // First hide all edit mode inputs
            $('.edit-mode').each(function() {
                $(this).hide();
            });
            
            // Then show all view mode spans
            $('.view-mode').each(function() {
                $(this).show();
            });
            
            // Reset button states
            $('.toggle-bulk-edit').show();
            $('.save-bulk-edit, .cancel-bulk-edit').hide();
            
            // Remove any edit mode classes
            $('.bulk-edit-mode').removeClass('bulk-edit-mode');
            
            // Reset the changes flag
            hasUnsavedChanges = false;
        },
        
        // Save bulk edits
        saveBulkEdits: function() {
            var $saveButton = $('.save-bulk-edit');
            var updates = {};
            
            // Collect all changes
            $('.wp-list-table tbody tr').each(function() {
                var $row = $(this);
                var postId = $row.data('id');
                var hasChanges = false;
                var rowData = {
                    meta: {}
                };

                // Check each editable field in the row
                $row.find('.editable').each(function() {
                    var $field = $(this);
                    var fieldName = $field.data('field');
                    var $input = $field.find('.edit-mode');
                    var $viewMode = $field.find('.view-mode');
                    var newValue = $input.val().trim();
                    var oldValue = $viewMode.text().trim() === '—' ? '' : $viewMode.text().trim();

                    if (newValue !== oldValue) {
                        hasChanges = true;
                        if (fieldName === 'title' || fieldName === 'description') {
                            rowData[fieldName] = newValue;
                        } else {
                            rowData.meta[fieldName] = newValue;
                        }
                    }
                });

                if (hasChanges) {
                    updates[postId] = rowData;
                }
            });

            // If no changes, don't make the request
            if (Object.keys(updates).length === 0) {
                window.BCGOV.DocumentManager.utils.showNotification('No changes to save.', 'info');
                this.exitBulkEditMode();
                hasUnsavedChanges = false;
                return;
            }

            // Show saving state
            $saveButton.prop('disabled', true).text('Saving...');
            window.BCGOV.DocumentManager.utils.showNotification('Saving changes...', 'info');

            // Make the AJAX request
            $.ajax({
                url: documentManager.ajaxurl,
                type: 'POST',
                data: {
                    action: 'save_bulk_edit',
                    security: documentManager.nonces.bulk_edit,
                    updates: JSON.stringify(updates)
                },
                success: function(response) {
                    if (response.success) {
                        Object.keys(updates).forEach(function(postId) {
                            var data = updates[postId];
                            var $row = $('tr[data-id="' + postId + '"]');
                            
                            if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
                                // Update all metadata at once
                                if (data.meta) {
                                    window.BCGOV.DocumentManager.TableView.updateRowMetadata($row, data.meta);
                                }

                                // Update title and description if changed
                                if (data.title) {
                                    $row.find('.edit-metadata').attr('data-title', data.title);
                                    window.BCGOV.DocumentManager.TableView.updateField($row, 'title', data.title);
                                }
                                if (data.description) {
                                    $row.find('.edit-metadata').attr('data-description', data.description);
                                    window.BCGOV.DocumentManager.TableView.updateField($row, 'description', data.description);
                                }
                                
                                window.BCGOV.DocumentManager.TableView.highlightUpdatedRow($row);
                            }
                        });

                        window.BCGOV.DocumentManager.BulkEdit.exitBulkEditMode();
                        hasUnsavedChanges = false;
                        window.BCGOV.DocumentManager.utils.showNotification('Changes saved successfully!', 'success');
                    } else {
                        window.BCGOV.DocumentManager.utils.showNotification(response.data.message || 'Error saving changes.', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Save error:', {xhr, status, error});
                    window.BCGOV.DocumentManager.utils.showNotification('Error saving changes. Please try again.', 'error');
                },
                complete: function() {
                    $saveButton.prop('disabled', false).text('Save Changes');
                }
            });
        }
    };
    
})(jQuery); 