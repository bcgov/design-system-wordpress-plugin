/**
 * Table View functionality for Document Manager
 * Handles rendering and updating document rows in the table
 * 
 * This module manages the document list table, providing functionality to:
 * - Handle document deletion with confirmation
 * - Create new table rows dynamically when documents are added
 * - Update existing rows when document metadata changes
 * - Manage visual feedback for user actions
 * 
 * The TableView works closely with other modules like BulkEdit and EditDocument
 * to provide a cohesive interface for document management operations.
 */

(function ($) {
    'use strict';
    
    // Establish namespaces if they don't exist
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    /**
     * TableView module definition
     * Core functionality for document table management
     */
    window.BCGOV.DocumentManager.TableView = {
        /**
         * Initialize the table view functionality
         * Only proceeds if a document table exists on the page
         */
        init: function() {
            // Exit early if we're not on a page with the document table
            // This prevents unnecessary event binding
            if ($('.wp-list-table').length === 0) {
                return;
            }
            
            this.initEventHandlers();
        },
        
        /**
         * Set up all table-related event handlers
         * Currently handles document deletion with confirmation
         */
        initEventHandlers: function() {
            // Handle document deletion via delete button clicks
            $(document).on('click', '.delete-document', function(e) {
                e.preventDefault();
                
                var $button = $(this);
                var postId = $button.data('post-id');
                
                // Show confirmation dialog before proceeding
                // Uses the localized message from WordPress for consistency
                if (!confirm(documentManager.messages.deleteConfirm)) {
                    return;
                }
                
                // Send AJAX request to delete the document
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'delete_document',      // WordPress AJAX action
                        post_id: postId,                // Document to delete
                        security: documentManager.nonces.delete  // Security nonce
                    },
                    
                    // Show processing state by disabling the button
                    beforeSend: function() {
                        $button.prop('disabled', true);
                    },
                    
                    // Handle the server response
                    success: function(response) {
                        if (response.success) {
                            // Animate the row removal for better UX
                            $button.closest('tr').fadeOut(400, function() {
                                $(this).remove();
                            });
                            // Show success message
                            window.BCGOV.DocumentManager.utils.showNotification(response.data.message);
                        } else {
                            // Show error message from server
                            window.BCGOV.DocumentManager.utils.showNotification(response.data.message, 'error');
                        }
                    },
                    
                    // Handle AJAX errors (network issues, server errors)
                    error: function(xhr, status, error) {
                        window.BCGOV.DocumentManager.utils.showNotification('Error: ' + error, 'error');
                    },
                    
                    // Always re-enable the button when complete
                    complete: function() {
                        $button.prop('disabled', false);
                    }
                });
            });
        },
        
        /**
         * Get custom column configuration from the table header
         * Analyzes the table headers to identify custom metadata columns
         * 
         * @return {Array} Array of column objects with label and key properties
         */
        getCustomColumns: function() {
            var columns = [];
            
            // Iterate through table headers to find custom columns
            $('.wp-list-table thead th').each(function(index) {
                var $th = $(this);
                
                // Skip standard columns and only process custom metadata columns
                // Standard columns: icon, title, description, file type, date, actions
                if (index > 4 && !$th.is(':last-child')) {
                    columns.push({
                        label: $th.text().trim(),
                        // Use data-meta-key attribute if available, otherwise generate a key from the label
                        key: $th.attr('data-meta-key') || ('doc_' + $th.text().trim().toLowerCase().replace(/[^a-z0-9]/g, '_'))
                    });
                }
            });
            
            return columns;
        },
        
        /**
         * Create HTML for a new document row
         * Dynamically generates a table row with all columns and action buttons
         * 
         * @param {Object} document - The document data object
         * @return {string} HTML for the new table row
         */
        createDocumentRow: function(document) {
            // Select appropriate icon based on the file type
            // This provides visual cues about document types
            let iconClass = 'dashicons ';
            switch (document.file_type) {
                case 'application/pdf':
                    iconClass += 'dashicons-pdf';
                    break;
                case 'application/msword':
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    iconClass += 'dashicons-media-document';
                    break;
                case 'application/vnd.ms-excel':
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    iconClass += 'dashicons-spreadsheet';
                    break;
                default:
                    iconClass += 'dashicons-media-default';
            }
            
            // Start building the row HTML with standard columns
            // Each field has both view and edit modes for bulk editing
            let row = `<tr data-id="${document.post_id}">
                <td class="column-icon">
                    <span class="${iconClass}"></span>
                </td>
                <td class="title column-title editable" data-field="title">
                    <span class="view-mode">${document.title}</span>
                    <input type="text" class="edit-mode" value="${document.title}" style="display: none;">
                </td>
                <td class="description column-description editable" data-field="description">
                    <span class="view-mode">${window.BCGOV.DocumentManager.utils.formatDisplayValue(document.description)}</span>
                    <textarea class="edit-mode" style="display: none;">${document.description || ''}</textarea>
                </td>
                <td class="filetype column-filetype">${document.file_type}</td>
                <td class="date column-date">${new Date().toLocaleDateString()}</td>`;

            // Determine the number of custom columns by counting table headers
            const headerCells = $('.wp-list-table thead tr th').length;
            const standardColumns = 7; // icon, title, description, file type, date, actions
            const customColumnCount = headerCells - standardColumns;

            // Get all custom column definitions from the table headers
            const customColumns = [];
            $('.wp-list-table thead tr th').each(function(index) {
                // Skip standard columns (icon, title, description, file type, date)
                // Only process metadata columns (not the actions column)
                if (index > 4 && index < headerCells - 1) { // -1 to skip actions column
                    customColumns.push({
                        key: $(this).text().trim().toLowerCase().replace(/\s+/g, '_'),
                        label: $(this).text().trim()
                    });
                }
            });

            // Add cells for each custom metadata column
            // Each cell has both view mode and edit mode elements
            customColumns.forEach(column => {
                document.meta = document.meta || {};
                const value = document.meta[column.key] || '';
                
                row += `
                    <td class="column-${column.key} editable" data-field="${column.key}">
                        <span class="view-mode">${window.BCGOV.DocumentManager.utils.formatDisplayValue(value)}</span>
                        <input type="text" class="edit-mode" value="${value}" style="display: none;">
                    </td>`;
            });

            // Add action buttons (View, Edit, Delete)
            // Store document metadata as data attributes for easy access
            row += `
                <td class="actions column-actions">
                    <a href="${document.file_url}" class="button button-small" target="_blank">View</a>
                    <button type="button" 
                            class="button button-small edit-metadata" 
                            data-id="${document.post_id}"
                            data-title="${document.title}"
                            data-description="${document.description || ''}"
                            data-metadata='${JSON.stringify(document.meta || {})}'>
                        Edit
                    </button>
                    <button type="button" 
                            class="button button-small button-link-delete delete-document" 
                            data-post-id="${document.post_id}"
                            data-title="${document.title}">
                        Delete
                    </button>
                </td>
            </tr>`;

            return row;
        },
        
        /**
         * Update a specific field in a table row
         * Updates both view mode and edit mode elements
         * 
         * @param {jQuery} $row - The table row jQuery object
         * @param {string} fieldName - The field name to update
         * @param {string} newValue - The new value for the field
         */
        updateField: function($row, fieldName, newValue) {
            // Find the table cell for this field
            var $field = $row.find('[data-field="' + fieldName + '"]');
            
            // If no matching field, exit early
            if (!$field.length) {
                return;
            }

            // Update the view mode text with formatted value
            var $viewMode = $field.find('.view-mode');
            var displayValue = window.BCGOV.DocumentManager.utils.formatDisplayValue(newValue);
            $viewMode.text(displayValue);

            // Update the edit mode input value
            var $editMode = $field.find('.edit-mode');
            $editMode.val(newValue);

            // Ensure correct display mode (view mode visible, edit mode hidden)
            $viewMode.show();
            $editMode.hide();
        },
        
        /**
         * Update multiple metadata fields for a table row
         * Updates both the visible row and the stored metadata
         * 
         * @param {jQuery} $row - The table row jQuery object
         * @param {Object} updates - Object containing field updates (key-value pairs)
         * @return {Object} The new metadata object after updates
         */
        updateRowMetadata: function($row, updates) {
            // Find the edit button which stores the full metadata
            var $editButton = $row.find('.edit-metadata');
            var currentMetadata = {};
            
            // Get current metadata from the data attribute
            try {
                // Always get from attribute not jQuery.data() to avoid caching issues
                currentMetadata = JSON.parse($editButton.attr('data-metadata') || '{}');
            } catch (e) {
                console.error('Error parsing current metadata:', e);
                currentMetadata = {};
            }

            // Merge current metadata with updates using object spread
            var newMetadata = { ...currentMetadata, ...updates };

            // Store updated metadata in the edit button's data attribute
            $editButton.attr('data-metadata', JSON.stringify(newMetadata));

            // Update all table cells to reflect the new metadata
            Object.keys(newMetadata).forEach(function(key) {
                var value = newMetadata[key];
                var $field = $row.find('[data-field="' + key + '"]');
                
                if ($field.length) {
                    // Update the view mode display with formatted value
                    $field.find('.view-mode').text(window.BCGOV.DocumentManager.utils.formatDisplayValue(value));
                    
                    // Update the edit mode input value
                    var $editMode = $field.find('.edit-mode');
                    $editMode.val(value);
                }
            });

            return newMetadata;
        },
        
        /**
         * Highlight a row that has been updated
         * Provides visual feedback after a successful update
         * 
         * @param {jQuery} $row - The table row jQuery object to highlight
         */
        highlightUpdatedRow: function($row) {
            // Temporarily change background color and animate back to normal
            // This creates a subtle "flash" effect to show changes
            $row.css('background-color', '#f7fcfe')  // Soft blue highlight
                .animate({ backgroundColor: 'transparent' }, 2000);  // Fade back over 2 seconds
        }
    };
    
})(jQuery); 