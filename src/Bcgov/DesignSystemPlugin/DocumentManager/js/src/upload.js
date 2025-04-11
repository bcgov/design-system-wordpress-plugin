/**
 * Upload functionality for Document Manager
 * Handles drag and drop, file selection, and document uploads
 */

(function ($) {
    'use strict';
    
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Private variables
    var $dropZone;
    var $fileInput;
    var $fileNameDisplay;
    var $uploadModal;
    var selectedFiles = null;
    
    // Module definition
    window.BCGOV.DocumentManager.Upload = {
        init: function() {
            // Initialize upload functionality only if the upload zone exists
            $dropZone = $('#drag-drop-zone');
            $fileInput = $('#document_file');
            $fileNameDisplay = $('.selected-file-name');
            $uploadModal = $('#upload-metadata-modal');
            
            if ($dropZone.length) {
                this.initDragAndDrop();
                this.initEventHandlers();
            }
        },
        
        initDragAndDrop: function() {
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
        },
        
        initEventHandlers: function() {
            // Handle dropped files
            $(document).on('drop', '#drag-drop-zone', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $dropZone.removeClass('drag-over');
                
                var files = e.originalEvent.dataTransfer.files;
                window.BCGOV.DocumentManager.Upload.handleFiles(files);
            });

            // Handle file input change
            $fileInput.on('change', function(e) {
                window.BCGOV.DocumentManager.Upload.handleFiles(this.files);
            });

            // Replace the dropzone click handler with a button-specific handler
            $('.button[for="document_file"]').on('click', function(e) {
                e.preventDefault();
                $fileInput.trigger('click');
            });
            
            // Upload form submission
            $('#upload-metadata-form').on('submit', function(e) {
                e.preventDefault();
                
                if (!selectedFiles || selectedFiles.length === 0) {
                    window.BCGOV.DocumentManager.utils.showNotification('No files selected.', 'error');
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
                
                window.BCGOV.DocumentManager.Upload.submitUpload(formData);
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
        },
        
        // Validate file types
        validateFiles: function(files) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].type !== 'application/pdf') {
                    window.BCGOV.DocumentManager.utils.showNotification('Only PDF files are allowed.', 'error');
                    return false;
                }
            }
            return true;
        },
        
        // Function to get existing document titles
        getExistingDocumentTitles: function() {
            const existingTitles = new Map(); // Using Map to store both lowercase and original titles
            $('.wp-list-table tbody tr').each(function() {
                const title = $(this).find('td.column-title .view-mode').text().trim();
                if (title) {
                    existingTitles.set(title.toLowerCase(), title);
                }
            });
            return existingTitles;
        },
        
        // Function to check for duplicates
        checkForDuplicates: function(files) {
            const existingTitles = this.getExistingDocumentTitles();
            const duplicates = [];

            for (let i = 0; i < files.length; i++) {
                // Get filename without extension
                const fileName = files[i].name.replace(/\.[^/.]+$/, "");
                const fileNameLower = fileName.toLowerCase();

                if (existingTitles.has(fileNameLower)) {
                    duplicates.push({
                        fileName: files[i].name,
                        existingTitle: existingTitles.get(fileNameLower)
                    });
                }
            }

            return duplicates;
        },
        
        // Handle files (validate and check for duplicates)
        handleFiles: function(files) {
            if (!files || files.length === 0) {
                return;
            }

            // First validate file types
            if (!this.validateFiles(files)) {
                $fileInput.val(''); // Clear the file input
                $fileNameDisplay.empty();
                selectedFiles = null;
                return;
            }

            // Check for duplicates
            const duplicates = this.checkForDuplicates(files);
            if (duplicates.length > 0) {
                // Create detailed error message
                const duplicateMessages = duplicates.map(d => 
                    `"${d.fileName}" (conflicts with existing document "${d.existingTitle}")`
                );
                
                window.BCGOV.DocumentManager.utils.showNotification(
                    `Cannot upload duplicate document${duplicates.length > 1 ? 's' : ''}: ${duplicateMessages.join(', ')}`, 
                    'error'
                );
                
                // Clear the input and selection
                $fileInput.val('');
                $fileNameDisplay.empty();
                selectedFiles = null;
                return;
            }

            // If we get here, no duplicates were found
            selectedFiles = files;
            this.updateFileList(files);
            this.showUploadModal();
        },
        
        // Update the file list UI
        updateFileList: function(files) {
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
        },
        
        // Show the upload modal
        showUploadModal: function() {
            if ($uploadModal.length) {
                $uploadModal.show();
                // Reset form
                $('#upload-metadata-form')[0].reset();
            }
        },
        
        // Submit the upload
        submitUpload: function(formData) {
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
                            if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
                                var newRowHtml = window.BCGOV.DocumentManager.TableView.createDocumentRow(document);
                                var $newRow = $(newRowHtml);
                                $tbody.prepend($newRow);
                                window.BCGOV.DocumentManager.TableView.highlightUpdatedRow($newRow);
                            }
                        });

                        $('#upload-metadata-modal').hide();
                        $('#upload-metadata-form')[0].reset();
                        $fileInput.val('');
                        $fileNameDisplay.empty();
                        selectedFiles = null;

                        window.BCGOV.DocumentManager.utils.showNotification('Documents uploaded successfully.');
                    } else {
                        window.BCGOV.DocumentManager.utils.showNotification(response.data.message || 'Error uploading documents.', 'error');
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Upload error:', {xhr, status, error});
                    window.BCGOV.DocumentManager.utils.showNotification('Error: ' + error, 'error');
                },
                complete: function() {
                    $('#upload-metadata-form button[type="submit"]')
                        .prop('disabled', false)
                        .text('Upload Documents');
                }
            });
        }
    };
    
})(jQuery); 