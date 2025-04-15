/**
 * Upload functionality for Document Manager
 * Handles drag and drop, file selection, and document uploads
 * 
 * This module provides a complete file upload solution with:
 * - Modern drag and drop interface
 * - File type validation
 * - Duplicate document detection
 * - Custom metadata collection via modal form
 * - Asynchronous upload via AJAX
 * - Live UI updates without page reload
 * 
 * The upload process preserves document metadata and updates
 * the document list in real-time for immediate visibility.
 */

(function ($) {
    'use strict';
    
    // Establish namespaces if they don't exist
    window.BCGOV = window.BCGOV || {};
    window.BCGOV.DocumentManager = window.BCGOV.DocumentManager || {};
    
    // Private module variables to cache DOM elements and store state
    let $dropZone;         // The drag and drop zone element
    let $fileInput;        // The hidden file input element
    let $fileNameDisplay;  // Element to display selected filenames
    let $uploadModal;      // The metadata collection modal
    let selectedFiles = null; // Currently selected files for upload
    
    /**
     * Upload module definition
     * Provides comprehensive file upload functionality
     */
    window.BCGOV.DocumentManager.Upload = {
        /**
         * Initialize the upload module
         * Sets up DOM element references and initializes functionality
         */
        init: function() {
            // Cache DOM elements for better performance
            $dropZone = $('#drag-drop-zone');
            $fileInput = $('#document_file');
            $fileNameDisplay = $('.selected-file-name');
            $uploadModal = $('#upload-metadata-modal');
            
            // Only initialize if the upload interface exists on this page
            if ($dropZone.length) {
                this.initDragAndDrop();
                this.initEventHandlers();
            }
        },
        
        /**
         * Initialize drag and drop functionality
         * Sets up event handlers for the drag and drop interface
         */
        initDragAndDrop: function() {
            // Prevent browser's default drag and drop behaviors
            // This ensures consistent handling across browsers
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

            // Add visual feedback when files are dragged over the drop zone
            // This helps users understand where to drop files
            ['dragenter', 'dragover'].forEach(eventName => {
                $(document).on(eventName, '#drag-drop-zone', function() {
                    $dropZone.addClass('drag-over');
                });
            });

            // Remove visual feedback when files leave the drop zone or are dropped
            ['dragleave', 'drop'].forEach(eventName => {
                $(document).on(eventName, '#drag-drop-zone', function() {
                    $dropZone.removeClass('drag-over');
                });
            });
        },
        
        /**
         * Initialize all other event handlers
         * Sets up file drop, selection, form submission, and modal interactions
         */
        initEventHandlers: function() {
            // Handle files dropped on the drop zone
            $(document).on('drop', '#drag-drop-zone', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $dropZone.removeClass('drag-over');
                
                // Get files from the drop event
                var files = e.originalEvent.dataTransfer.files;
                window.BCGOV.DocumentManager.Upload.handleFiles(files);
            });

            // Handle files selected via the file input
            $fileInput.on('change', function(e) {
                window.BCGOV.DocumentManager.Upload.handleFiles(this.files);
            });

            // Map button click to file input activation
            // This creates a custom styled upload button
            $('.button[for="document_file"]').on('click', function(e) {
                e.preventDefault();
                $fileInput.trigger('click');
            });
            
            // Handle the metadata form submission
            // This triggers the actual file upload with metadata
            $('#upload-metadata-form').on('submit', function(e) {
                e.preventDefault();
                
                // Validate that files are selected
                if (!selectedFiles || selectedFiles.length === 0) {
                    window.BCGOV.DocumentManager.utils.showNotification('No files selected.', 'error');
                    return;
                }

                // Create FormData object to hold both files and metadata
                var formData = new FormData();
                
                // Structure the metadata in the expected format
                // This includes document description and custom metadata fields
                var metadata = {
                    description: $('#document_description').val(),
                    meta: {}
                };
                
                // Collect all custom metadata fields from the form
                // These fields are named with the pattern meta[field_name]
                $(this).find('[name^="meta["]').each(function() {
                    var $field = $(this);
                    var key = $field.attr('name').match(/meta\[(.*?)\]/)[1];
                    metadata.meta[key] = $field.val();
                });
                
                // Add the complete metadata object as JSON string
                // This simplifies server-side processing
                formData.append('metadata', JSON.stringify(metadata));
                
                // Add all selected files to the FormData
                // This supports multiple file uploads in one request
                for (var i = 0; i < selectedFiles.length; i++) {
                    formData.append('document_file[]', selectedFiles[i]);
                }
                
                // Add AJAX action and security nonce
                formData.append('action', 'upload_document');
                formData.append('security', documentManager.nonces.upload);
                
                // Submit the upload to the server
                window.BCGOV.DocumentManager.Upload.submitUpload(formData);
            });
            
            // Handle modal close via close button or cancel button
            $(document).on('click', '.close-modal, .cancel-upload', function() {
                var $modal = $(this).closest('.metadata-modal');
                $modal.hide();
                if ($modal.is('#upload-metadata-modal')) {
                    // Reset file selection when closing the upload modal
                    $fileInput.val('');
                    $fileNameDisplay.empty();
                    selectedFiles = null;
                }
            });

            // Handle modal close when clicking outside the modal content
            $(window).on('click', function(event) {
                if (event.target.classList.contains('metadata-modal')) {
                    event.target.style.display = 'none';
                    if (event.target.id === 'upload-metadata-modal') {
                        // Reset file selection when closing the upload modal
                        $fileInput.val('');
                        $fileNameDisplay.empty();
                        selectedFiles = null;
                    }
                }
            });
        },
        
        /**
         * Validate file types against allowed types
         * Currently only allows PDF files
         * 
         * @param {FileList} files - The list of files to validate
         * @return {boolean} True if all files are valid, false otherwise
         */
        validateFiles: function(files) {
            for (var i = 0; i < files.length; i++) {
                if (files[i].type !== 'application/pdf') {
                    window.BCGOV.DocumentManager.utils.showNotification('Only PDF files are allowed.', 'error');
                    return false;
                }
            }
            return true;
        },
        
        /**
         * Get a map of existing document titles
         * Used to check for duplicates before upload
         * 
         * @return {Map} Map of lowercase titles to original titles
         */
        getExistingDocumentTitles: function() {
            const existingTitles = new Map(); // Using Map to store both lowercase and original titles
            
            // Extract titles from the document table
            $('.wp-list-table tbody tr').each(function() {
                const title = $(this).find('td.column-title .view-mode').text().trim();
                if (title) {
                    // Store with lowercase key for case-insensitive comparison
                    existingTitles.set(title.toLowerCase(), title);
                }
            });
            return existingTitles;
        },
        
        /**
         * Check for duplicate file names in the existing documents
         * Prevents uploading files that would create duplicates
         * 
         * @param {FileList} files - The files to check for duplicates
         * @return {Array} Array of objects with details about duplicate files
         */
        checkForDuplicates: function(files) {
            const existingTitles = this.getExistingDocumentTitles();
            const duplicates = [];

            for (let i = 0; i < files.length; i++) {
                // Remove file extension for comparison with document titles
                const fileName = files[i].name.replace(/\.[^/.]+$/, "");
                const fileNameLower = fileName.toLowerCase();

                // Check if the filename (without extension) matches any existing title
                if (existingTitles.has(fileNameLower)) {
                    duplicates.push({
                        fileName: files[i].name,
                        existingTitle: existingTitles.get(fileNameLower)
                    });
                }
            }

            return duplicates;
        },
        
        /**
         * Process files after selection or drop
         * Validates files, checks for duplicates, and shows the upload modal
         * 
         * @param {FileList} files - The files selected or dropped by the user
         */
        handleFiles: function(files) {
            if (!files || files.length === 0) {
                return;
            }

            // Step 1: Validate file types
            if (!this.validateFiles(files)) {
                // Clear the file input if validation fails
                $fileInput.val(''); 
                $fileNameDisplay.empty();
                selectedFiles = null;
                return;
            }

            // Step 2: Check for duplicate file names
            const duplicates = this.checkForDuplicates(files);
            if (duplicates.length > 0) {
                // Create detailed error message listing all duplicates
                const duplicateMessages = duplicates.map(d => 
                    `"${d.fileName}" (conflicts with existing document "${d.existingTitle}")`
                );
                
                // Show error notification with duplicate details
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

            // Step 3: Store files and update UI
            selectedFiles = files;
            this.updateFileList(files);
            this.showUploadModal();
        },
        
        /**
         * Update the file list display in the UI
         * Shows the names of all selected files
         * 
         * @param {FileList} files - The files to display in the list
         */
        updateFileList: function(files) {
            if (files.length === 0) {
                $fileNameDisplay.empty();
                return;
            }

            // Create a list of selected filenames
            var fileList = $('<ul class="selected-files-list"></ul>');
            for (var i = 0; i < files.length; i++) {
                fileList.append($('<li></li>').text(files[i].name));
            }

            // Update the file name display area
            $fileNameDisplay
                .empty()
                .append($('<strong></strong>').text('Selected Files (' + files.length + '):'))
                .append(fileList);
        },
        
        /**
         * Display the metadata collection modal
         * Shows the form to collect metadata before upload
         */
        showUploadModal: function() {
            if ($uploadModal.length) {
                $uploadModal.show();
                // Reset form fields to ensure clean state
                $('#upload-metadata-form')[0].reset();
            }
        },
        
        /**
         * Submit the upload to the server
         * Handles the AJAX request and response
         * 
         * @param {FormData} formData - The form data containing files and metadata
         */
        submitUpload: function(formData) {
            $.ajax({
                url: documentManager.ajaxurl,
                type: 'POST',
                data: formData,
                processData: false,  // Don't process the FormData object
                contentType: false,  // Let the browser set content type with boundary
                
                // Update UI to show upload in progress
                beforeSend: function() {
                    $('#upload-metadata-form button[type="submit"]')
                        .prop('disabled', true)
                        .text('Uploading...');
                },
                
                // Handle successful upload
                success: function(response) {
                    if (response.success) {
                        var $documentSection = $('.document-library-section');
                        var noDocumentsMessage = $documentSection.find('p:contains("No documents found")');
                        
                        // Special case: if this is the first document, reload page
                        // This ensures we get the table structure
                        if (noDocumentsMessage.length || $('.wp-list-table tbody tr').length === 0) {
                            // The page is in a "no documents" state - reload the page to get the proper table
                            window.location.reload();
                            return;
                        }
                        
                        // Update the existing table with new rows
                        var $tbody = $('.wp-list-table tbody');
                        
                        // Add each uploaded document to the table
                        response.data.forEach(function(document) {
                            if (typeof window.BCGOV.DocumentManager.TableView !== 'undefined') {
                                // Create and insert new row using TableView helper
                                var newRowHtml = window.BCGOV.DocumentManager.TableView.createDocumentRow(document);
                                var $newRow = $(newRowHtml);
                                
                                // Insert at top of table for visibility
                                $tbody.prepend($newRow);
                                
                                // Highlight to provide visual feedback
                                window.BCGOV.DocumentManager.TableView.highlightUpdatedRow($newRow);
                            }
                        });

                        // Reset UI after successful upload
                        $('#upload-metadata-modal').hide();
                        $('#upload-metadata-form')[0].reset();
                        $fileInput.val('');
                        $fileNameDisplay.empty();
                        selectedFiles = null;

                        // Show success notification
                        window.BCGOV.DocumentManager.utils.showNotification('Documents uploaded successfully.');
                    } else {
                        // Show error message from server
                        window.BCGOV.DocumentManager.utils.showNotification(response.data.message || 'Error uploading documents.', 'error');
                    }
                },
                
                // Handle AJAX errors (network issues, server errors)
                error: function(xhr, status, error) {
                    console.error('Upload error:', {xhr, status, error});
                    window.BCGOV.DocumentManager.utils.showNotification('Error: ' + error, 'error');
                },
                
                // Always restore the button state when complete
                complete: function() {
                    $('#upload-metadata-form button[type="submit"]')
                        .prop('disabled', false)
                        .text('Upload Documents');
                }
            });
        }
    };
    
})(jQuery); 