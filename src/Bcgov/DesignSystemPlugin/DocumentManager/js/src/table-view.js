/**
 * Table View functionality for Document Manager
 * Handles rendering and updating document rows in the table
 */

(function ($) {
    'use strict';
    
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Module definition
    window.BCGOV.DocumentManager.TableView = {
        init: function() {
            // Nothing to initialize if no table exists
            if ($('.wp-list-table').length === 0) {
                return;
            }
            
            this.initEventHandlers();
        },
        
        initEventHandlers: function() {
            // Handle document deletion
            $(document).on('click', '.delete-document', function(e) {
                e.preventDefault();
                
                var $button = $(this);
                var postId = $button.data('post-id');
                
                // Debug logging (without logging the actual nonce value)
                console.log('Delete button clicked');
                console.log('Post ID:', postId);
                
                if (!confirm(documentManager.messages.deleteConfirm)) {
                    return;
                }
                
                $.ajax({
                    url: documentManager.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'delete_document',
                        post_id: postId,
                        security: documentManager.nonces.delete
                    },
                    beforeSend: function() {
                        $button.prop('disabled', true);
                    },
                    success: function(response) {
                        if (response.success) {
                            $button.closest('tr').fadeOut(400, function() {
                                $(this).remove();
                            });
                            window.BCGOV.DocumentManager.utils.showNotification(response.data.message);
                        } else {
                            window.BCGOV.DocumentManager.utils.showNotification(response.data.message, 'error');
                        }
                    },
                    error: function(xhr, status, error) {
                        window.BCGOV.DocumentManager.utils.showNotification('Error: ' + error, 'error');
                    },
                    complete: function() {
                        $button.prop('disabled', false);
                    }
                });
            });
        },
        
        // Helper function to get custom column configuration
        getCustomColumns: function() {
            var columns = [];
            $('.wp-list-table thead th').each(function(index) {
                var $th = $(this);
                // Skip non-metadata columns (icon, title, description, file type, date, actions)
                if (index > 4 && !$th.is(':last-child')) {
                    columns.push({
                        label: $th.text().trim(),
                        key: $th.attr('data-meta-key') || ('doc_' + $th.text().trim().toLowerCase().replace(/[^a-z0-9]/g, '_'))
                    });
                }
            });
            return columns;
        },
        
        // Create a document row for the table
        createDocumentRow: function(document) {
            console.log('Creating row with document data:', document);
            
            // Get the icon class based on file type
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
            
            // Start the row HTML with the icon column
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

            // Get all custom columns by counting header cells and subtracting standard columns
            const headerCells = $('.wp-list-table thead tr th').length;
            const standardColumns = 7; // icon, title, description, file type, date, actions
            const customColumnCount = headerCells - standardColumns;

            // Get the custom column headers (skipping the standard columns)
            const customColumns = [];
            $('.wp-list-table thead tr th').each(function(index) {
                // Skip standard columns (icon, title, description, file type, date)
                if (index > 4 && index < headerCells - 1) { // -1 to skip actions column
                    customColumns.push({
                        key: $(this).text().trim().toLowerCase().replace(/\s+/g, '_'),
                        label: $(this).text().trim()
                    });
                }
            });

            console.log('Custom columns found:', customColumns);

            // Add cells for all custom columns (always as text type)
            customColumns.forEach(column => {
                document.meta = document.meta || {};
                const value = document.meta[column.key] || '';
                
                row += `
                    <td class="column-${column.key} editable" data-field="${column.key}">
                        <span class="view-mode">${window.BCGOV.DocumentManager.utils.formatDisplayValue(value)}</span>
                        <input type="text" class="edit-mode" value="${value}" style="display: none;">
                    </td>`;
            });

            // Add action buttons
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
        
        // Helper function to update a field in the table
        updateField: function($row, fieldName, newValue) {
            console.log('Updating field:', fieldName, 'with value:', newValue);
            
            var $field = $row.find('[data-field="' + fieldName + '"]');
            if (!$field.length) {
                console.log('Field not found:', fieldName);
                return;
            }

            // Update the view mode text
            var $viewMode = $field.find('.view-mode');
            var displayValue = window.BCGOV.DocumentManager.utils.formatDisplayValue(newValue);
            $viewMode.text(displayValue);
            console.log('Updated view mode:', fieldName, 'to:', displayValue);

            // Update the edit mode value
            var $editMode = $field.find('.edit-mode');
            $editMode.val(newValue);
            console.log('Updated edit mode:', fieldName, 'to:', newValue);

            // Show/hide appropriate elements
            $viewMode.show();
            $editMode.hide();
        },
        
        // Helper function to update row metadata
        updateRowMetadata: function($row, updates) {
            console.log('Updating row metadata:', updates);
            
            var $editButton = $row.find('.edit-metadata');
            var currentMetadata = {};
            
            try {
                // Always get the current metadata from the attribute, not jQuery data
                currentMetadata = JSON.parse($editButton.attr('data-metadata') || '{}');
                console.log('Current metadata:', currentMetadata);
            } catch (e) {
                console.error('Error parsing current metadata:', e);
                currentMetadata = {};
            }

            // Update the metadata
            var newMetadata = { ...currentMetadata, ...updates };
            console.log('New metadata:', newMetadata);

            // Update the edit button attributes
            $editButton.attr('data-metadata', JSON.stringify(newMetadata));

            // Update both view and edit mode fields
            Object.keys(newMetadata).forEach(function(key) {
                var value = newMetadata[key];
                var $field = $row.find('[data-field="' + key + '"]');
                
                if ($field.length) {
                    // Update view mode
                    $field.find('.view-mode').text(window.BCGOV.DocumentManager.utils.formatDisplayValue(value));
                    
                    // Update edit mode
                    var $editMode = $field.find('.edit-mode');
                    $editMode.val(value);
                }
            });

            return newMetadata;
        },
        
        // Helper function to highlight updated row
        highlightUpdatedRow: function($row) {
            $row.css('background-color', '#f7fcfe')
                .animate({ backgroundColor: 'transparent' }, 2000);
        }
    };
    
})(jQuery); 