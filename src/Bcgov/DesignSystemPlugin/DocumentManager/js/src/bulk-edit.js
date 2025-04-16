/**
 * Bulk Edit functionality for Document Manager
 * Handles bulk editing of documents in the table
 * 
 * This module provides an interface for users to modify multiple document records
 * simultaneously. Features include:
 * - Toggle between view/edit modes
 * - Track unsaved changes to warn users
 * - Collect changes from the UI and submit via AJAX
 * - Visual feedback during save operations
 */

(function ($) {
    'use strict';
    
    // Create namespaces if they don't already exist
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Private module variables for state management and UI elements
    let hasUnsavedChanges = false;  // Tracks if any fields have been modified
    let $table;                    // The document table element
    let $bulkEditBtn;              // The button to enter bulk edit mode
    let $saveChangesBtn;           // The button to save changes
    let $cancelBulkEditBtn;        // The button to cancel edit mode
    
    // Module definition with public methods
    window.BCGOV.DocumentManager.BulkEdit = {
        /**
         * Initialize the bulk edit functionality
         * Caches DOM elements and sets up event handlers
         */
        init: function() {
            // Cache DOM elements for better performance
            $table = $('.wp-list-table');
            $bulkEditBtn = $('.toggle-bulk-edit');
            $saveChangesBtn = $('.save-bulk-edit');
            $cancelBulkEditBtn = $('.cancel-bulk-edit');
            
            // Only initialize if we're on a page with the document table
            if ($table.length === 0) {
                return;
            }
            
            this.initEventHandlers();
        },
        
        /**
         * Set up all event handlers for the bulk edit UI
         * Manages clicks on buttons and tracks user input
         */
        initEventHandlers: function() {
            // Enter bulk edit mode when the toggle button is clicked
            $bulkEditBtn.on('click', function(e) {
                e.preventDefault();
                window.BCGOV.DocumentManager.BulkEdit.enterBulkEditMode();
            });

            // Track when users make changes to any editable field
            // This updates visual indicators and the change tracking flag
            $table.on('input change', '.edit-mode', function() {
                $(this).addClass('changed');  // Add visual indicator to changed fields
                hasUnsavedChanges = true;     // Update the global state
            });

            // Handle cancellation of bulk edit mode with confirmation if changes exist
            $cancelBulkEditBtn.on('click', function(e) {
                e.preventDefault();
                // Prompt for confirmation if there are unsaved changes
                if (hasUnsavedChanges) {
                    if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                        return;
                    }
                }
                window.BCGOV.DocumentManager.BulkEdit.exitBulkEditMode();
                hasUnsavedChanges = false; // Reset the changes flag
            });
            
            // Provide a warning when navigating away with unsaved changes
            // This uses the browser's built-in beforeunload confirmation
            $(window).on('beforeunload', function(e) {
                if (hasUnsavedChanges) {
                    return 'You have unsaved changes. Are you sure you want to leave?';
                }
            });
            
            // Handle save button clicks
            $('.save-bulk-edit').on('click', function() {
                window.BCGOV.DocumentManager.BulkEdit.saveBulkEdits();
            });
        },
        
        /**
         * Switch the UI into bulk edit mode
         * Hides view elements and displays editable form controls
         */
        enterBulkEditMode: function() {
            // Hide static content and show editable fields
            $('.view-mode').hide();
            $('.edit-mode').show();
            
            // Update button visibility
            $('.toggle-bulk-edit').hide();
            $('.save-bulk-edit, .cancel-bulk-edit').show();
            
            // Add a class to the table for potential styling
            $table.addClass('bulk-edit-mode');
        },
        
        /**
         * Exit bulk edit mode
         * Reverts the UI back to view-only state
         */
        exitBulkEditMode: function() {
            // Hide all edit mode inputs
            $('.edit-mode').each(function() {
                $(this).hide();
            });
            
            // Show the view mode content
            $('.view-mode').each(function() {
                $(this).show();
            });
            
            // Reset UI button states
            $('.toggle-bulk-edit').show();
            $('.save-bulk-edit, .cancel-bulk-edit').hide();
            
            // Remove any edit mode classes
            $('.bulk-edit-mode').removeClass('bulk-edit-mode');
            
            // Reset the changes tracking flag
            hasUnsavedChanges = false;
        },
        
        /**
         * Save all bulk edits via AJAX
         * Collects changes from the UI, submits to server, and updates the display
         */
        saveBulkEdits: function() {
            const $saveButton = $('.save-bulk-edit');
            const updates = {};  // Will hold all changes keyed by document ID
            
            // Step 1: Collect all changes from the table rows
            $('.wp-list-table tbody tr').each(function() {
                const $row = $(this);
                const postId = $row.data('id');
                let hasChanges = false;
                const rowData = {
                    meta: {}  // Container for custom metadata field changes
                };

                // Check each editable field in the row for changes
                $row.find('.editable').each(function() {
                    const $field = $(this);
                    const fieldName = $field.data('field');
                    const $input = $field.find('.edit-mode');
                    const $viewMode = $field.find('.view-mode');
                    
                    // Get current values, handling the em-dash placeholder for empty values
                    const newValue = $input.val().trim();
                    const oldValue = $viewMode.text().trim() === '—' ? '' : $viewMode.text().trim();

                    // Only include fields that actually changed
                    if (newValue !== oldValue) {
                        hasChanges = true;
                        
                        // Handle different field types appropriately
                        if (fieldName === 'title' || fieldName === 'description') {
                            // Core WordPress fields
                            rowData[fieldName] = newValue;
                        } else {
                            // Custom metadata fields
                            rowData.meta[fieldName] = newValue;
                        }
                    }
                });

                // Only include rows with actual changes
                if (hasChanges) {
                    updates[postId] = rowData;
                }
            });

            // If no changes detected, exit without making a request
            if (Object.keys(updates).length === 0) {
                window.BCGOV.DocumentManager.utils.showNotification('No changes to save.', 'info');
                this.exitBulkEditMode();
                hasUnsavedChanges = false;
                return;
            }

            // Step 2: Update UI to show saving state
            $saveButton.prop('disabled', true).text('Saving...');
            window.BCGOV.DocumentManager.utils.showNotification('Saving changes...', 'info');

            // Step 3: Send AJAX request to save changes
            $.ajax({
                url: documentManager.ajaxurl,  // WordPress AJAX endpoint
                type: 'POST',
                data: {
                    action: 'save_bulk_edit',  // WordPress AJAX action
                    security: documentManager.nonces.bulk_edit,  // Security nonce
                    updates: JSON.stringify(updates)  // Changes data as JSON
                },
                success: function(response) {
                    if (response.success) {
                        // Step 4: Update the UI with saved values
                        Object.keys(updates).forEach(function(postId) {
                            const data = updates[postId];
                            const $row = $('tr[data-id="' + postId + '"]');
                            
                            // Use the TableView module to update row display
                            if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
                                // Update all custom metadata fields
                                if (data.meta) {
                                    window.BCGOV.DocumentManager.TableView.updateRowMetadata($row, data.meta);
                                }

                                // Update core WordPress fields if changed
                                if (data.title) {
                                    $row.find('.edit-metadata').attr('data-title', data.title);
                                    window.BCGOV.DocumentManager.TableView.updateField($row, 'title', data.title);
                                }
                                if (data.description) {
                                    $row.find('.edit-metadata').attr('data-description', data.description);
                                    window.BCGOV.DocumentManager.TableView.updateField($row, 'description', data.description);
                                }
                                
                                // Provide visual feedback for the updated row
                                window.BCGOV.DocumentManager.TableView.highlightUpdatedRow($row);
                            }
                        });

                        // Exit edit mode and show success message
                        window.BCGOV.DocumentManager.BulkEdit.exitBulkEditMode();
                        hasUnsavedChanges = false;
                        window.BCGOV.DocumentManager.utils.showNotification('Changes saved successfully!', 'success');
                    } else {
                        // Handle error response from server
                        window.BCGOV.DocumentManager.utils.showNotification(response.data.message || 'Error saving changes.', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    // Handle AJAX errors (network issues, server errors)
                    console.error('Save error:', {xhr, status, error});
                    window.BCGOV.DocumentManager.utils.showNotification('Error saving changes. Please try again.', 'error');
                },
                complete: function() {
                    // Reset button state regardless of success/failure
                    $saveButton.prop('disabled', false).text('Save Changes');
                }
            });
        }
    };
    
})(jQuery); 