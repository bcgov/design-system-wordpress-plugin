jQuery(document).ready(function($) {
    // Drag and drop functionality
    var dropZone = $('#drag-drop-zone');
    var fileInput = $('#document_file');
    var fileNameDisplay = $('.selected-file-name');
    var uploadModal = $('#upload-metadata-modal');
    var selectedFiles = null;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone[0].addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone[0].addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone[0].addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone[0].addEventListener('drop', handleDrop, false);

    // Handle file input change
    fileInput.on('change', function(e) {
        handleFiles(e.target.files);
    });

    // Click anywhere in drop zone to trigger file input
    dropZone.on('click', function(e) {
        if (e.target !== fileInput[0]) {
            fileInput.trigger('click');
        }
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.addClass('drag-over');
    }

    function unhighlight(e) {
        dropZone.removeClass('drag-over');
    }

    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            selectedFiles = files;
            updateFileList(files);
            showUploadModal();
        }
    }

    function updateFileList(files) {
        if (files.length === 0) {
            fileNameDisplay.empty();
            return;
        }

        var fileList = $('<ul class="selected-files-list"></ul>');
        for (var i = 0; i < files.length; i++) {
            fileList.append($('<li></li>').text(files[i].name));
        }

        fileNameDisplay
            .empty()
            .append($('<strong></strong>').text('Selected Files (' + files.length + '):'))
            .append(fileList);
    }

    function showUploadModal() {
        uploadModal.show();
        // Reset form
        $('#upload-metadata-form')[0].reset();
    }

    // Handle upload metadata form submission
    $('#upload-metadata-form').on('submit', function(e) {
        e.preventDefault();
        
        if (!selectedFiles || selectedFiles.length === 0) {
            showNotification('No files selected.', 'error');
            return;
        }

        var formData = new FormData();
        
        // Add metadata
        $(this).serializeArray().forEach(function(item) {
            formData.append(item.name, item.value);
        });
        
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
                if (response.success) {
                    showNotification(response.data.message);
                    window.location.reload();
                } else {
                    var errorMessage = response.data.message || 'Unknown error occurred';
                    if (response.data.errors && response.data.errors.length > 0) {
                        errorMessage += '\n\nDetails:\n' + response.data.errors.join('\n');
                    }
                    showNotification(errorMessage, 'error');
                }
            },
            error: function(xhr, status, error) {
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
    $('.close-modal, .cancel-upload').on('click', function() {
        var $modal = $(this).closest('.metadata-modal');
        $modal.hide();
        if ($modal.is('#upload-metadata-modal')) {
            // Reset file selection
            fileInput.val('');
            fileNameDisplay.empty();
            selectedFiles = null;
        }
    });

    $(window).on('click', function(event) {
        if (event.target.classList.contains('metadata-modal')) {
            event.target.style.display = 'none';
            if (event.target.id === 'upload-metadata-modal') {
                // Reset file selection
                fileInput.val('');
                fileNameDisplay.empty();
                selectedFiles = null;
            }
        }
    });

    // Show/hide select options based on field type
    $('#column_type').on('change', function() {
        if ($(this).val() === 'select') {
            $('.select-options-row').show();
        } else {
            $('.select-options-row').hide();
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

    // Handle deleting column
    $('.delete-column').on('click', function(e) {
        e.preventDefault();
        
        if (!confirm('Are you sure you want to delete this column? This will remove all associated metadata from documents.')) {
            return;
        }

        var metaKey = $(this).data('meta-key');
        var $row = $(this).closest('tr');
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'delete_column',
                meta_key: metaKey,
                security: documentManager.nonce
            },
            beforeSend: function() {
                $row.addClass('deleting');
            },
            success: function(response) {
                if (response.success) {
                    $row.fadeOut(400, function() {
                        $(this).remove();
                        showNotification(response.data.message);
                        
                        // If no columns left, show message
                        if ($('.existing-columns-section tbody tr').length === 0) {
                            $('.existing-columns-section tbody').append(
                                '<tr><td colspan="4">No custom columns found.</td></tr>'
                            );
                        }
                    });
                } else {
                    showNotification(response.data.message, 'error');
                    $row.removeClass('deleting');
                }
            },
            error: function(xhr, status, error) {
                showNotification('Error: ' + error, 'error');
                $row.removeClass('deleting');
            }
        });
    });

    // Handle metadata modal
    var modal = $('#edit-metadata-modal');
    var closeBtn = $('.close-modal');

    // Open modal when clicking Edit Document button
    $('.edit-metadata').on('click', function() {
        var documentId = $(this).data('id');
        var metadata = $(this).data('metadata');
        
        // Set document ID in form
        $('#document_id').val(documentId);
        
        // Set core document fields
        $('#edit_title').val($(this).data('title'));
        $('#edit_description').val($(this).data('description'));
        $('#edit_slug').val($(this).data('slug'));
        
        // Fill form with current metadata values
        Object.keys(metadata).forEach(function(key) {
            $('#edit_' + key).val(metadata[key]);
        });
        
        // Show modal
        modal.show();
    });

    // Close modal when clicking close button or outside modal
    closeBtn.on('click', function() {
        modal.hide();
    });

    $(window).on('click', function(event) {
        if (event.target == modal[0]) {
            modal.hide();
        }
    });

    // Handle metadata form submission
    $('#edit-metadata-form').on('submit', function(e) {
        e.preventDefault();
        
        var formData = new FormData(this);
        formData.append('action', 'save_document_metadata');
        formData.append('security', documentManager.nonce);
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function() {
                $('#edit-metadata-form button[type="submit"]')
                    .prop('disabled', true)
                    .text('Saving...');
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
                $('#edit-metadata-form button[type="submit"]')
                    .prop('disabled', false)
                    .text('Save Changes');
            }
        });
    });

    // Handle document deletion
    $('.delete-document').on('click', function() {
        var button = $(this);
        var documentId = button.data('id');
        var documentTitle = button.data('title');
        
        if (!confirm('Are you sure you want to delete "' + documentTitle + '"? This action cannot be undone.')) {
            return;
        }
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'delete_document',
                document_id: documentId,
                security: documentManager.nonce
            },
            beforeSend: function() {
                button.prop('disabled', true)
                    .text('Deleting...');
            },
            success: function(response) {
                if (response.success) {
                    // Remove the row from the table
                    button.closest('tr').fadeOut(400, function() {
                        $(this).remove();
                        
                        // Check if there are any documents left
                        if ($('.wp-list-table tbody tr').length === 0) {
                            // Replace table with "No documents found" message
                            $('.wp-list-table').replaceWith('<p>No documents found.</p>');
                        }
                    });
                } else {
                    alert('Error: ' + (response.data || 'Failed to delete document'));
                    button.prop('disabled', false)
                        .text('Delete');
                }
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
                button.prop('disabled', false)
                    .text('Delete');
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
        resetBulkEditMode();
    });

    // Initialize notification system
    function showNotification(message, type = 'success') {
        // Remove any existing notification
        $('.notification').remove();

        // Create new notification
        const $notification = $(`
            <div class="notification ${type}">
                ${type === 'success' ? '<div class="success-icon"></div>' : ''}
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            </div>
        `).appendTo('body');

        // Show notification
        setTimeout(() => $notification.addClass('show'), 10);

        // Auto hide after 3 seconds
        const hideTimeout = setTimeout(() => {
            $notification.removeClass('show');
            setTimeout(() => $notification.remove(), 300);
        }, 3000);

        // Handle manual close
        $notification.find('.close-notification').on('click', () => {
            clearTimeout(hideTimeout);
            $notification.removeClass('show');
            setTimeout(() => $notification.remove(), 300);
        });
    }

    // Save bulk edit changes
    $saveChangesBtn.on('click', function(e) {
        e.preventDefault();
        const $button = $(this);
        const changes = {};

        // Collect all changed fields
        $('.edit-mode.changed').each(function() {
            const $field = $(this);
            const $row = $field.closest('tr');
            const $cell = $field.closest('td.editable');
            const postId = $row.data('id');
            const fieldName = $cell.data('field');
            
            if (!changes[postId]) {
                changes[postId] = {};
            }
            changes[postId][fieldName] = $field.val();
        });

        if (Object.keys(changes).length === 0) {
            showNotification('No changes to save.', 'error');
            return;
        }

        // Disable buttons and show loading state
        $button.prop('disabled', true);
        $table.addClass('saving-changes');

        // Send AJAX request
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'save_bulk_edit',
                security: documentManager.nonce,
                changes: JSON.stringify(changes)
            },
            success: function(response) {
                if (response.success) {
                    // Update view mode values
                    Object.entries(changes).forEach(([postId, fields]) => {
                        const $row = $table.find(`tr[data-id="${postId}"]`);
                        Object.entries(fields).forEach(([fieldName, value]) => {
                            const $viewField = $row.find(`td[data-field="${fieldName}"] .view-mode`);
                            const $editField = $row.find(`td[data-field="${fieldName}"] .edit-mode`);
                            
                            // Update both view and edit mode values
                            $viewField.text(value);
                            if ($editField.is('textarea, input[type="text"]')) {
                                $editField.val(value);
                            } else if ($editField.is('select')) {
                                $editField.find('option').prop('selected', false);
                                $editField.find(`option[value="${value}"]`).prop('selected', true);
                            }
                        });
                    });
                    
                    resetBulkEditMode();
                    showNotification('Changes saved successfully!');
                } else {
                    showNotification(response.data.message || 'Error saving changes.', 'error');
                    $('.edit-mode.changed').addClass('edit-error');
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX Error:', {
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
                showNotification('Error saving changes. Please try again.', 'error');
                $('.edit-mode.changed').addClass('edit-error');
            },
            complete: function() {
                $button.prop('disabled', false);
                $table.removeClass('saving-changes');
            }
        });
    });

    // Helper function to reset bulk edit mode
    function resetBulkEditMode() {
        $table.removeClass('bulk-edit-mode');
        $('.view-mode').show();
        $('.edit-mode').hide().removeClass('changed edit-error');
        $bulkEditBtn.show();
        $saveChangesBtn.hide();
        $cancelBulkEditBtn.hide();
        hasUnsavedChanges = false;
    }

    // Warn user about unsaved changes when leaving page
    $(window).on('beforeunload', function() {
        if (hasUnsavedChanges) {
            return 'You have unsaved changes. Are you sure you want to leave?';
        }
    });
}); 