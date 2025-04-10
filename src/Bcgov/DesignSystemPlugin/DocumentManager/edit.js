jQuery(document).ready(function($) {
    // Add console log to check if script is loading
    console.log('Document Manager script loaded');

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
        formData.append('nonce', documentManager.nonce);
        
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
        formData.append('nonce', documentManager.nonce);
        
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
                nonce: documentManager.nonce
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

    // Handle edit button click
    $(document).on('click', '.edit-metadata', function(e) {
        console.log('Edit button clicked');
        e.preventDefault();
        
        var $button = $(this);
        var postId = $button.data('id');
        var title = $button.data('title');
        var description = $button.data('description');
        var metadata = $button.data('metadata');
        
        console.log('Raw metadata:', metadata); // Debug log
        
        // Check if metadata is already an object
        if (typeof metadata === 'string') {
            try {
                metadata = JSON.parse(metadata);
            } catch (e) {
                console.error('Error parsing metadata:', e);
                metadata = {};
            }
        }
        
        console.log('Processed metadata:', metadata); // Debug log

        // Populate the modal form
        $('#edit-post-id').val(postId);
        $('#edit_document_title').val(title);
        $('#edit_document_description').val(description);
        
        // Populate metadata fields
        if (metadata && typeof metadata === 'object') {
            Object.keys(metadata).forEach(function(key) {
                var $field = $('#edit_' + key);
                if ($field.length) {
                    $field.val(metadata[key]);
                }
            });
        }
        
        // Before showing modal
        console.log('Modal element exists:', $('#edit-document-modal').length > 0);
        console.log('Current modal display:', $('#edit-document-modal').css('display'));
        
        // Show the modal
        $('#edit-document-modal').show();
        
        // After showing modal
        console.log('Modal display after show:', $('#edit-document-modal').css('display'));
    });

    // Handle modal close
    $('.close-modal, .cancel-edit').on('click', function() {
        $('#edit-document-modal').hide();
    });

    // Close modal when clicking outside
    $(window).on('click', function(event) {
        if ($(event.target).hasClass('metadata-modal')) {
            $(event.target).hide();
        }
    });

    // Handle form submission
    $('#edit-document-form').on('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        var $form = $(this);
        var $submitButton = $form.find('button[type="submit"]');
        var postId = $('#edit-post-id').val();
        
        // Show saving state
        $submitButton.prop('disabled', true).text('Saving...');
        
        // Collect form data
        var formData = {
            action: 'save_document_metadata',
            post_id: postId,
            nonce: documentManager.nonce,
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
        
        console.log('Sending form data:', formData);
        
        // Make the AJAX request
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: formData,
            success: function(response) {
                console.log('Save response:', response);
                if (response.success) {
                    // Update the row in the table
                    var $row = $('tr[data-id="' + postId + '"]');
                    
                    // Update title and description
                    $row.find('[data-field="title"] .view-mode').text(formData.title);
                    $row.find('[data-field="description"] .view-mode').text(formData.description);
                    
                    // Update metadata fields
                    Object.keys(formData.meta).forEach(function(key) {
                        $row.find('[data-field="' + key + '"] .view-mode').text(formData.meta[key]);
                    });
                    
                    // Update the edit button data
                    var $editButton = $row.find('.edit-metadata');
                    $editButton.data('title', formData.title);
                    $editButton.data('description', formData.description);
                    $editButton.data('metadata', formData.meta);
                    
                    // Close modal and show success message
                    $('#edit-document-modal').hide();
                    showNotification('Document updated successfully!', 'success');
                    
                    // Highlight the updated row
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

    // Handle document deletion
    $('.delete-document').on('click', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var postId = $button.data('post-id');
        
        if (!confirm(documentManager.messages.deleteConfirm)) {
            return;
        }
        
        $.ajax({
            url: documentManager.ajaxurl,
            type: 'POST',
            data: {
                action: 'delete_document',
                post_id: postId,
                nonce: documentManager.nonce
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
        resetBulkEditMode();
    });

    // Handle bulk edit save
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
                var oldValue = $viewMode.text().trim();

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
                nonce: documentManager.nonce,
                updates: JSON.stringify(updates)
            },
            success: function(response) {
                if (response.success) {
                    // Update the UI with new values
                    Object.keys(updates).forEach(function(postId) {
                        var data = updates[postId];
                        var $row = $('tr[data-id="' + postId + '"]');
                        
                        // Update fields
                        if (data.title) {
                            updateField($row, 'title', data.title);
                        }
                        if (data.description) {
                            updateField($row, 'description', data.description);
                        }
                        if (data.meta) {
                            Object.keys(data.meta).forEach(function(metaKey) {
                                updateField($row, metaKey, data.meta[metaKey]);
                            });
                        }
                        
                        highlightUpdatedRow($row);
                    });

                    // Make sure we exit bulk edit mode
                    exitBulkEditMode();
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
                // Also ensure we exit bulk edit mode even if there was an error
                exitBulkEditMode();
            }
        });
    });

    // Helper function to update a single field
    function updateField($row, fieldName, newValue) {
        var $field = $row.find('[data-field="' + fieldName + '"]');
        
        // Update the view mode text
        $field.find('.view-mode')
            .text(newValue)
            .show(); // Make sure view mode is visible
        
        // Update the edit mode value and hide it
        $field.find('.edit-mode')
            .val(newValue)
            .hide(); // Make sure edit mode is hidden
    }

    // Helper function to highlight updated row
    function highlightUpdatedRow($row) {
        $row.addClass('updated-row');
        setTimeout(function() {
            $row.removeClass('updated-row');
        }, 2000);
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
    $(window).on('beforeunload', function() {
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
    `;
    document.head.appendChild(style);
}); 