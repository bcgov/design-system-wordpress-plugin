<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * DocumentFormRenderer Service
 *
 * This specialized renderer is part of the presentation layer in the Document Manager's
 * service-oriented architecture. It encapsulates all form-related HTML generation,
 * which improves maintainability by separating UI rendering from business logic.
 *
 * Architectural benefits:
 * - Single Responsibility Principle: This class only handles form rendering
 * - Separation of Concerns: UI generation is isolated from data operations
 * - Improved testability: Form rendering can be tested independently
 * - Better maintainability: UI changes are localized to this class
 *
 * This renderer handles:
 * - Document upload interface with drag-and-drop functionality
 * - Document upload metadata modal for batch metadata application
 * - Document edit modal for individual document editing
 *
 * Each rendering method adheres to WordPress UI conventions while implementing
 * modern UX patterns like drag-and-drop, modals, and responsive form layouts.
 */
class DocumentFormRenderer {
    /**
     * Configuration settings
     *
     * Used to access plugin-wide configurations like file types,
     * nonce keys, and other settings.
     *
     * @var DocumentManagerConfig
     */
    private $config;

    /**
     * Metadata manager service
     *
     * Used to fetch and manage custom metadata fields that
     * should appear in document forms.
     *
     * @var DocumentMetadataManager
     */
    private $metadata_manager;

    /**
     * Constructor
     *
     * Initializes the form renderer with its required dependencies.
     * Following dependency injection pattern for better testability
     * and looser coupling between components.
     *
     * @param DocumentManagerConfig   $config Configuration service.
     * @param DocumentMetadataManager $metadata_manager Metadata manager service.
     */
    public function __construct(
        DocumentManagerConfig $config,
        DocumentMetadataManager $metadata_manager
    ) {
        $this->config           = $config;
        $this->metadata_manager = $metadata_manager;
    }

    /**
     * Render the document upload section
     *
     * Creates a modern drag-and-drop upload interface that provides multiple
     * ways for users to upload files (drag-drop or file selection).
     *
     * UX considerations:
     * - Accessible button alternative to drag-drop
     * - Visual feedback during drag operations
     * - Clear instructions for users
     * - File type restrictions for better user guidance
     *
     * Security implementations:
     * - WordPress nonce field for CSRF protection
     * - File type restrictions via accept attribute
     * - Multipart form encoding for secure file uploads
     */
    public function render_upload_section() {
        ?>
        <!-- 
        * Document Upload Section
        * 
        * This section handles file uploads with a modern drag-and-drop interface.
        * Key features:
        * - Supports dropping files directly onto the upload zone
        * - Also supports traditional file input via "Choose Files" button
        * - The file input is hidden but accessible via the button for better UX
        * - Multiple file upload is enabled with the "multiple" attribute
        * - Only accepts PDF files by default (controlled by accept attribute)
        * - Includes WordPress security nonce field for CSRF protection.
        -->
        <div class="document-upload-section">
            <h2>Upload New Documents</h2>
            <form id="document-upload-form" method="post" enctype="multipart/form-data">
                <div class="drag-drop-zone" id="drag-drop-zone">
                    <div class="drag-drop-content">
                        <i class="dashicons dashicons-upload"></i>
                        <p>Drag and drop your documents here</p>
                        <p class="drag-drop-or">or</p>
                        <label for="document_file" class="button">Choose Files</label>
                        <input type="file" 
                               name="document_file[]" 
                               id="document_file" 
                               class="file-input-hidden" 
                               multiple 
                               required 
                               accept=".pdf,application/pdf">
                        <p class="selected-file-name"></p>
                    </div>
                </div>
                <?php
                // Security: Add WordPress nonce field to prevent CSRF attacks.
                wp_nonce_field( 'document_upload_nonce', 'document_upload_nonce' );
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Render the upload metadata modal
     *
     * Generates a modal dialog that appears after files are selected but before
     * they're uploaded. This allows users to add metadata to all uploaded
     * documents at once, improving efficiency for batch uploads.
     *
     * The modal dynamically generates form fields based on the custom metadata
     * columns configured in the plugin settings.
     *
     * UX considerations:
     * - Modal appears at the appropriate step in the workflow
     * - Clear section organization with headings
     * - Field types appropriate to the data being collected
     * - Cancel option to abort the upload process
     *
     * Integration points:
     * - JavaScript in upload.js populates and submits this form
     * - Form data is sent to AjaxHandler.php via AJAX
     * - Custom metadata fields from DocumentMetadataManager
     */
    public function render_upload_metadata_modal() {
        // Get custom metadata fields from WordPress options.
        $custom_columns = get_option( 'document_custom_columns', array() );
        ?>
        <!-- 
        * Upload Metadata Modal
        *
        * This modal appears after files are selected for upload but before they're submitted.
        * It allows users to add metadata to all uploaded documents at once:
        * - Document description
        * - Custom metadata fields defined in the plugin settings
        * - Handles different field types (text, select, etc.)
        * - The form is submitted via AJAX by JavaScript in upload.js.
        -->
        <div id="upload-metadata-modal" class="metadata-modal" style="display: none;">
            <div class="metadata-modal-content">
                <span class="close-modal">&times;</span>
                <h2>Document Details</h2>
                <p class="description">These details will be applied to all uploaded documents. You can edit individual documents after upload.</p>
                <form id="upload-metadata-form">
                    <div class="form-section">
                        <h3>Document Details</h3>
                        <div class="custom-field">
                            <label for="document_description">Description</label>
                            <textarea name="document_description" id="document_description"></textarea>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Additional Information</h3>
                        <?php foreach ( $custom_columns as $meta_key => $column ) : ?>
                            <div class="custom-field">
                                <label for="<?php echo esc_attr( $meta_key ); ?>"><?php echo esc_html( $column['label'] ); ?></label>
                                <?php if ( 'select' === $column['type'] ) : ?>
                                    <select name="meta[<?php echo esc_attr( $meta_key ); ?>]" id="<?php echo esc_attr( $meta_key ); ?>">
                                        <option value="">Select <?php echo esc_html( $column['label'] ); ?></option>
                                        <?php foreach ( $column['options'] as $option ) : ?>
                                            <option value="<?php echo esc_attr( $option ); ?>"><?php echo esc_html( $option ); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                <?php else : ?>
                                    <input type="<?php echo esc_attr( $column['type'] ); ?>" 
                                           name="meta[<?php echo esc_attr( $meta_key ); ?>]" 
                                           id="<?php echo esc_attr( $meta_key ); ?>">
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <button type="submit" class="button button-primary">Upload Documents</button>
                    <button type="button" class="button cancel-upload">Cancel</button>
                </form>
            </div>
        </div>
        <?php
    }

    /**
     * Render the document edit modal
     *
     * Generates a modal dialog for editing an existing document's metadata.
     * This modal supports all custom metadata fields configured in the plugin,
     * and dynamically renders appropriate input types based on field configuration.
     *
     * Advanced features:
     * - Supports different field types (text, select, date, number)
     * - Field-specific help text when available
     * - Required field validation
     * - Hidden ID field for document identification
     *
     * Security considerations:
     * - All form values are escaped using WordPress esc_* functions
     * - AJAX submission includes nonce verification (handled by JavaScript)
     * - Input sanitization occurs on the server side in AjaxHandler
     *
     * Accessibility features:
     * - Proper label associations with form controls
     * - Semantic HTML structure with appropriate headings
     * - Color contrast following WordPress admin UI standards
     */
    public function render_edit_modal() {
        // Get custom metadata fields from WordPress options.
        $custom_columns = get_option( 'document_custom_columns', array() );
        ?>
        <!-- 
        * Single Document Edit Modal
        *
        * This modal appears when editing a single document:
        * - Provides fields for all document properties
        * - Populated with current values via JavaScript
        * - Supports all field types (text, select, date, number)
        * - Form is submitted via AJAX in edit-document.js
        * - Has both save and cancel options.
        -->
        <div id="edit-document-modal" class="metadata-modal">
            <div class="metadata-modal-content">
                <span class="close-modal">&times;</span>
                <h2>Edit Document</h2>
                <form id="edit-document-form">
                    <!-- Hidden field to store the document ID. -->
                    <input type="hidden" name="post_id" id="edit-post-id">
                    
                    <div class="form-section">
                        <h3>Document Details</h3>
                        <div class="custom-field">
                            <label for="edit_document_title">Title</label>
                            <input type="text" name="title" id="edit_document_title" required>
                            <p class="description">The name of your document</p>
                        </div>
                        <div class="custom-field">
                            <label for="edit_document_description">Description</label>
                            <textarea name="description" id="edit_document_description"></textarea>
                            <p class="description">A brief description of the document (optional)</p>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>Additional Information</h3>
                        <?php
                        // Dynamic generation of custom metadata fields.
                        foreach ( $custom_columns as $meta_key => $column ) :
                            // Each metadata field gets rendered based on its configured type.
							?>
                            <div class="custom-field">
                                <label for="edit_<?php echo esc_attr( $meta_key ); ?>"><?php echo esc_html( $column['label'] ); ?></label>
                                <?php if ( 'select' === $column['type'] ) : ?>
                                    <select name="meta[<?php echo esc_attr( $meta_key ); ?>]" id="edit_<?php echo esc_attr( $meta_key ); ?>">
                                        <option value="">Select <?php echo esc_html( $column['label'] ); ?></option>
                                        <?php foreach ( $column['options'] as $option ) : ?>
                                            <option value="<?php echo esc_attr( $option ); ?>"><?php echo esc_html( $option ); ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                <?php elseif ( 'date' === $column['type'] ) : ?>
                                    <input type="date" name="meta[<?php echo esc_attr( $meta_key ); ?>]" id="edit_<?php echo esc_attr( $meta_key ); ?>">
                                <?php elseif ( 'number' === $column['type'] ) : ?>
                                    <input type="number" name="meta[<?php echo esc_attr( $meta_key ); ?>]" id="edit_<?php echo esc_attr( $meta_key ); ?>">
                                <?php else : ?>
                                    <input type="text" name="meta[<?php echo esc_attr( $meta_key ); ?>]" id="edit_<?php echo esc_attr( $meta_key ); ?>">
                                <?php endif; ?>
                                <?php if ( ! empty( $column['description'] ) ) : ?>
                                    <p class="description"><?php echo esc_html( $column['description'] ); ?></p>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="button button-primary">Save Changes</button>
                        <button type="button" class="button cancel-edit">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
        <?php
    }
}
