jQuery(document).ready(function($) {
    // Add console log to check if script is loading
    console.log('Document Manager script loaded');

    // Only initialize drag and drop if the upload zone exists
    var $dropZone = $('#drag-drop-zone');
    var $fileInput = $('#document_file');
    var $fileNameDisplay = $('.selected-file-name');
    var $uploadModal = $('#upload-metadata-modal');
    var selectedFiles = null;

    if ($dropZone.length) {
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            $(document).on(eventName, '#drag-drop-zone', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
            
            $(document).on(eventName, 'body', function(e) {
                e.preventDefault();
                e.stopPropagation();
            });
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
            $(document).on(eventName, '#drag-drop-zone', function() {
                $dropZone.addClass('drag-over');
            });
    });

    ['dragleave', 'drop'].forEach(eventName => {
            $(document).on(eventName, '#drag-drop-zone', function() {
                $dropZone.removeClass('drag-over');
            });
    });

    // Handle dropped files
        $(document).on('drop', '#drag-drop-zone', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $dropZone.removeClass('drag-over');
            
            var files = e.originalEvent.dataTransfer.files;
            handleFiles(files);
        });

    // Handle file input change
        $fileInput.on('change', function(e) {
            handleFiles(this.files);
        });

        // Replace the dropzone click handler with a button-specific handler
        $('.button[for="document_file"]').on('click', function(e) {
            e.preventDefault();
            $fileInput.trigger('click');
        });
    }

    // Add this function to validate file types
    function validateFiles(files) {
        for (var i = 0; i < files.length; i++) {
            if (files[i].type !== 'application/pdf') {
                showNotification('Only PDF files are allowed.', 'error');
                return false;
            }
        }
        return true;
    }

    // Add this function after the validateFiles function
    function checkForDuplicateNames(files) {
        // Get all existing document titles from the table
        var existingTitles = [];
        $('.wp-list-table tbody tr').each(function() {
            var title = $(this).find('td:first').text().trim();
            existingTitles.push(title.toLowerCase());
        });

        // Check each file
        for (var i = 0; i < files.length; i++) {
            // Get filename without extension
            var fileName = files[i].name.replace(/\.[^/.]+$/, "").toLowerCase();
            if (existingTitles.includes(fileName)) {
                showNotification('A document with the name "' + files[i].name + '" already exists. Please choose a different name.', 'error');
                return false;
            }
        }
        return true;
    }

    // Add this function to check for existing documents
    function getExistingDocumentTitles() {
        const existingTitles = new Map(); // Using Map to store both lowercase and original titles
        $('.wp-list-table tbody tr').each(function() {
            const title = $(this).find('td.column-title .view-mode').text().trim();
            if (title) {
                existingTitles.set(title.toLowerCase(), title);
            }
        });
        return existingTitles;
    }

    // Update the file handling code
    function handleFiles(files) {
        if (!files || files.length === 0) {
            return;
        }

        // Validate file types first
        if (!validateFiles(files)) {
            $fileInput.val(''); // Clear the file input
            $fileNameDisplay.empty();
            selectedFiles = null;
            return;
        }

        // Get existing document titles
        const existingTitles = getExistingDocumentTitles();
        let hasDuplicates = false;
        let duplicateNames = [];

        // Check each file for duplicates
        for (let i = 0; i < files.length; i++) {
            // Get filename without extension
            const fileName = files[i].name.replace(/\.[^/.]+$/, "");
            const fileNameLower = fileName.toLowerCase();

            // Check for exact match (case-insensitive)
            if (existingTitles.has(fileNameLower)) {
                hasDuplicates = true;
                duplicateNames.push(`"${files[i].name}" (conflicts with "${existingTitles.get(fileNameLower)}")`);
            }
        }

        // If duplicates found, show error and stop
        if (hasDuplicates) {
            showNotification(
                `Cannot upload duplicate document${duplicateNames.length > 1 ? 's' : ''}: ${duplicateNames.join(', ')}`, 
                'error'
            );
            $fileInput.val(''); // Clear the file input
            $fileNameDisplay.empty();
            selectedFiles = null;
            return;
        }

        // If we get here, no duplicates were found
            selectedFiles = files;
            updateFileList(files);
            showUploadModal();
    }

    function updateFileList(files) {
        if (files.length === 0) {
            $fileNameDisplay.empty();
            return;
        }

        var fileList = $('<ul class="selected-files-list"></ul>');
        for (var i = 0; i < files.length; i++) {
            fileList.append($('<li></li>').text(files[i].name));
        }

        $fileNameDisplay
            .empty()
            .append($('<strong></strong>').text('Selected Files (' + files.length + '):'))
            .append(fileList);
    }

    function showUploadModal() {
        if ($uploadModal.length) {
            $uploadModal.show();
        // Reset form
        $('#upload-metadata-form')[0].reset();
    }
    }

    // Helper function to format the date
    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    // Helper function to format empty values
    function formatDisplayValue(value) {
        if (value === null || value === undefined || value === '') {
            return '—';  // Use em dash for empty values
        }
        return value;
    }

    // Helper function to get custom column configuration
    function getCustomColumns() {
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
    }

    // Update the createDocumentRow function
    function createDocumentRow(document) {
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
                <span class="view-mode">${formatDisplayValue(document.description)}</span>
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
                    <span class="view-mode">${formatDisplayValue(value)}</span>
                    <input type="text" class="edit-mode" value="${value}" style="display: none;">
                </td>`;
        });

        // Add action buttons
        row += `
            <td class="actions column-actions">
                <a href="${document.file_url}" class="button button-small" target="_blank">Download</a>
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
    }

    // Update the form submission handler
    $('#upload-metadata-form').on('submit', function(e) {
        e.preventDefault();
        
        if (!selectedFiles || selectedFiles.length === 0) {
            showNotification('No files selected.', 'error');
            return;
        }

        var formData = new FormData();
        
        // Structure the metadata properly
        var metadata = {
            description: $('#document_description').val(),
            meta: {}
        };
        
        // Add custom fields to metadata
        $(this).find('[name^="meta["]').each(function() {
            var $field = $(this);
            var key = $field.attr('name').match(/meta\[(.*?)\]/)[1];
            metadata.meta[key] = $field.val();
        });
        
        console.log('Sending metadata:', metadata);
        
        // Add structured metadata to form data
        formData.append('metadata', JSON.stringify(metadata));
        
        // Add files
        for (var i = 0; i < selectedFiles.length; i++) {
            formData.append('document_file[]', selectedFiles[i]);
        }
        
        formData.append('action', 'handle_document_upload');
        formData.append('security', documentManager.nonce);
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function() {
                $('#upload-metadata-form button[type="submit"]')
                    .prop('disabled', true)
                    .text('Uploading...');
            },
            success: function(response) {
                console.log('Upload response:', response);
                if (response.success) {
                    var $tbody = $('.wp-list-table tbody');
                    
                    // Remove "No documents found" message if it exists
                    if ($tbody.find('tr td:contains("No documents found")').length) {
                        $tbody.empty();
                    }

                    // Add each uploaded document to the table
                    response.data.forEach(function(document) {
                        console.log('Creating row for document:', document);
                        var newRowHtml = createDocumentRow(document);
                        var $newRow = $(newRowHtml);
                        $tbody.prepend($newRow);
                        highlightUpdatedRow($newRow);
                    });

                    $('#upload-metadata-modal').hide();
                    $('#upload-metadata-form')[0].reset();
                    $fileInput.val('');
                    $fileNameDisplay.empty();
                    selectedFiles = null;

                    showNotification('Documents uploaded successfully.');
                } else {
                    showNotification(response.data.message || 'Error uploading documents.', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Upload error:', {xhr, status, error});
                showNotification('Error: ' + error, 'error');
            },
            complete: function() {
                $('#upload-metadata-form button[type="submit"]')
                    .prop('disabled', false)
                    .text('Upload Documents');
            }
        });
    });

    // Handle modal close
    $(document).on('click', '.close-modal, .cancel-upload', function() {
        var $modal = $(this).closest('.metadata-modal');
        $modal.hide();
        if ($modal.is('#upload-metadata-modal')) {
            // Reset file selection
            $fileInput.val('');
            $fileNameDisplay.empty();
            selectedFiles = null;
        }
    });

    $(window).on('click', function(event) {
        if (event.target.classList.contains('metadata-modal')) {
            event.target.style.display = 'none';
            if (event.target.id === 'upload-metadata-modal') {
                // Reset file selection
                $fileInput.val('');
                $fileNameDisplay.empty();
                selectedFiles = null;
            }
        }
    });

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
        console.log('Delete column clicked');

        var $button = $(this);
        var metaKey = $button.data('meta-key');
        var $row = $button.closest('tr');
        
        if (!confirm('Are you sure you want to delete this column? This will remove all associated metadata from documents.')) {
            return;
        }

        // Show loading state
        $button.prop('disabled', true).text('Deleting...');
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'delete_column',
                security: documentManager.nonce,
                meta_key: metaKey
            },
            success: function(response) {
                console.log('Delete response:', response);
                if (response.success) {
                    // Remove the row with animation
                    $row.fadeOut(400, function() {
                        $(this).remove();
                        
                        // If no columns left, show message
                        if ($('.existing-columns-section tbody tr').length === 0) {
                            $('.existing-columns-section tbody').append(
                                '<tr><td colspan="4">No custom columns found.</td></tr>'
                            );
                        }
                    });
                    
                    showNotification('Column deleted successfully.', 'success');
                } else {
                    showNotification(response.data.message || 'Error deleting column.', 'error');
                    // Reset button state
                    $button.prop('disabled', false).text('Delete');
                }
            },
            error: function(xhr, status, error) {
                console.error('Delete error:', {xhr, status, error});
                showNotification('Error deleting column. Please try again.', 'error');
                // Reset button state
                $button.prop('disabled', false).text('Delete');
            }
        });
    });

    // Helper function to ensure metadata consistency
    function updateRowMetadata($row, updates) {
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
                $field.find('.view-mode').text(formatDisplayValue(value));
                
                // Update edit mode
                var $editMode = $field.find('.edit-mode');
                $editMode.val(value);
            }
        });

        return newMetadata;
    }

    // Update the bulk edit save handler
    $('.save-bulk-edit').on('click', function() {
        var $saveButton = $(this);
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
            showNotification('No changes to save.', 'info');
            exitBulkEditMode();
            hasUnsavedChanges = false;
            return;
        }

        // Show saving state
        $saveButton.prop('disabled', true).text('Saving...');
        showNotification('Saving changes...', 'info');

        // Make the AJAX request
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_bulk_edit',
                security: documentManager.nonce,
                updates: JSON.stringify(updates)
            },
            success: function(response) {
                if (response.success) {
                    Object.keys(updates).forEach(function(postId) {
                        var data = updates[postId];
                        var $row = $('tr[data-id="' + postId + '"]');
                        
                        // Update all metadata at once
                        if (data.meta) {
                            updateRowMetadata($row, data.meta);
                        }

                        // Update title and description if changed
                        if (data.title) {
                            $row.find('.edit-metadata').attr('data-title', data.title);
                            updateField($row, 'title', data.title);
                        }
                        if (data.description) {
                            $row.find('.edit-metadata').attr('data-description', data.description);
                            updateField($row, 'description', data.description);
                        }
                        
                        highlightUpdatedRow($row);
                    });

                    exitBulkEditMode();
                    hasUnsavedChanges = false;
                    showNotification('Changes saved successfully!', 'success');
                } else {
                    showNotification(response.data.message || 'Error saving changes.', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Save error:', {xhr, status, error});
                showNotification('Error saving changes. Please try again.', 'error');
            },
            complete: function() {
                $saveButton.prop('disabled', false).text('Save Changes');
            }
        });
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
                    updateRowMetadata($row, formData.meta);

                    // Update title and description
                    var $editButton = $row.find('.edit-metadata');
                    $editButton.attr({
                        'data-title': formData.title,
                        'data-description': formData.description
                    });
                    
                    updateField($row, 'title', formData.title);
                    updateField($row, 'description', formData.description);
                    
                    $('#edit-document-modal').hide();
                    showNotification('Document updated successfully!', 'success');
                    highlightUpdatedRow($row);
                } else {
                    showNotification(response.data.message || 'Error updating document.', 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error('Save error:', {xhr, status, error});
                showNotification('Error saving changes. Please try again.', 'error');
            },
            complete: function() {
                $submitButton.prop('disabled', false).text('Save Changes');
            }
        });
    });

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

    // Handle document deletion
    $(document).on('click', '.delete-document', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var postId = $button.data('post-id');
        
        // Debug logging
        console.log('Delete button clicked');
        console.log('Post ID:', postId);
        console.log('Nonce:', documentManager.nonce);
        
        if (!confirm(documentManager.messages.deleteConfirm)) {
            return;
        }
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'delete_document',
                post_id: postId,
                security: documentManager.nonce
            },
            beforeSend: function() {
                $button.prop('disabled', true);
            },
            success: function(response) {
                if (response.success) {
                    $button.closest('tr').fadeOut(400, function() {
                        $(this).remove();
                    });
                    showNotification(response.data.message);
                } else {
                    showNotification(response.data.message, 'error');
                }
            },
            error: function(xhr, status, error) {
                showNotification('Error: ' + error, 'error');
            },
            complete: function() {
                $button.prop('disabled', false);
            }
        });
    });

    // Bulk Edit Mode
    let hasUnsavedChanges = false;
    const $table = $('.wp-list-table');
    const $bulkEditBtn = $('.toggle-bulk-edit');
    const $saveChangesBtn = $('.save-bulk-edit');
    const $cancelBulkEditBtn = $('.cancel-bulk-edit');

    // Enable bulk edit mode
    $bulkEditBtn.on('click', function(e) {
        e.preventDefault();
        $table.addClass('bulk-edit-mode');
        $('.view-mode').hide();
        $('.edit-mode').show();
        $(this).hide();
        $saveChangesBtn.show();
        $cancelBulkEditBtn.show();
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
        exitBulkEditMode();
        hasUnsavedChanges = false; // Reset the changes flag
    });

    // Helper function to update a field in the table
    function updateField($row, fieldName, newValue) {
        console.log('Updating field:', fieldName, 'with value:', newValue);
        
        var $field = $row.find('[data-field="' + fieldName + '"]');
        if (!$field.length) {
            console.log('Field not found:', fieldName);
            return;
        }

        // Update the view mode text
        var $viewMode = $field.find('.view-mode');
        var displayValue = formatDisplayValue(newValue);
        $viewMode.text(displayValue);
        console.log('Updated view mode:', fieldName, 'to:', displayValue);

        // Update the edit mode value
        var $editMode = $field.find('.edit-mode');
        $editMode.val(newValue);
        console.log('Updated edit mode:', fieldName, 'to:', newValue);

        // Show/hide appropriate elements
        $viewMode.show();
        $editMode.hide();
    }

    // Helper function to highlight updated row
    function highlightUpdatedRow($row) {
        $row.css('background-color', '#f7fcfe')
            .animate({ backgroundColor: 'transparent' }, 2000);
    }

    // Helper function to exit bulk edit mode
    function exitBulkEditMode() {
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
    }

    // Helper function to show notifications (replace any existing notification)
    function showNotification(message, type = 'success') {
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

    // Handle entering bulk edit mode
    $('.toggle-bulk-edit').on('click', function() {
        enterBulkEditMode();
    });

    // Handle canceling bulk edit
    $('.cancel-bulk-edit').on('click', function() {
        exitBulkEditMode();
    });

    // Helper function to enter bulk edit mode
    function enterBulkEditMode() {
        $('.view-mode').hide();
        $('.edit-mode').show();
        $('.toggle-bulk-edit').hide();
        $('.save-bulk-edit, .cancel-bulk-edit').show();
    }

    // Warn user about unsaved changes when leaving page
    $(window).on('beforeunload', function(e) {
        if (hasUnsavedChanges) {
            return 'You have unsaved changes. Are you sure you want to leave?';
        }
    });

    // Add CSS to ensure proper display
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
}); 