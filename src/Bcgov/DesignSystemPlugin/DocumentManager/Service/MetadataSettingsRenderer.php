<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * MetadataSettingsRenderer Service
 *
 * This specialized renderer is part of the presentation layer in the Document Manager
 * architecture, focused exclusively on the metadata configuration interface.
 *
 * Architectural benefits:
 * - Separates UI rendering from data operations (Single Responsibility Principle)
 * - Encapsulates admin interface complexity
 * - Allows for UI changes without affecting business logic
 * - Creates a clean separation between presentation and data layers
 *
 * This service generates the administrative interface where site administrators can
 * configure custom metadata fields for documents. These fields define additional
 * properties that can be attached to each document in the system, enabling:
 * - Custom document categorization
 * - Organization-specific metadata tagging
 * - Flexible search and filtering capabilities
 */
class MetadataSettingsRenderer {
    /**
     * Configuration settings
     *
     * Provides access to global Document Manager configuration
     * including capability checks, post type names, and
     * other system-wide settings.
     *
     * @var DocumentManagerConfig
     */
    private $config;

    /**
     * Metadata manager service
     *
     * Handles the data operations for metadata fields including:
     * - Creating new metadata fields
     * - Deleting existing fields
     * - Fetching current field configurations
     *
     * This renderer delegates all data operations to this service,
     * maintaining proper separation of concerns.
     *
     * @var DocumentMetadataManager
     */
    private $metadata_manager;

    /**
     * Constructor
     *
     * Initializes the renderer with its required dependencies.
     * Uses dependency injection pattern for better testability and looser coupling.
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
     * Render Metadata Settings page
     *
     * Generates the complete admin interface for metadata field management.
     * This interface follows WordPress admin UI patterns and conventions while
     * providing a specialized experience for document metadata configuration.
     *
     * UI/UX considerations:
     * - Follows WordPress admin UI patterns for consistency
     * - Provides clear section organization with headings
     * - Includes helpful descriptions for form fields
     * - Uses familiar table layout for existing fields
     * - Implements intuitive AJAX-based operations for better user experience
     *
     * Security considerations:
     * - All output is properly escaped using WordPress esc_* functions
     * - User capability checks occur in the parent AdminUIManager class
     * - Form submissions are handled via AJAX with proper nonce verification
     * - Metadata keys are sanitized before database storage
     *
     * Integration points:
     * - Form submissions processed by AjaxHandler.php via admin-ajax.php
     * - JavaScript in metadata.js handles the AJAX interactions
     * - DocumentMetadataManager performs the actual data operations
     * - Custom fields appear in document forms via DocumentFormRenderer
     */
    public function render() {
        // Fetch existing metadata field configurations from the database.
        // This represents all custom fields currently available for documents.
        $custom_metadata = get_option( 'document_custom_columns', array() );
        ?>
        <div class="wrap">
            <h1>Document Library Metadata Settings</h1>
            
            <!-- 
            * Add New Metadata Field Section
            *
            * This section provides the form interface for administrators to create
            * new custom metadata fields for documents. Each field created here will:
            * 
            * - Appear in the document upload form
            * - Be available in document edit forms
            * - Show as a column in the document listing table
            * - Be available for filtering and sorting in the admin interface
            *
            * Current limitations:
            * - Only text field type is currently supported
            * - Field labels must be unique to avoid conflicts
            * - System automatically generates meta_key from label
            *
            * Future enhancements:
            * - Support for select, checkbox, date and other field types
            * - Field validation rules configuration
            * - Default value settings
            * - Required field toggles
            -->
            <div class="metadata-manager-section">
                <h2>Add New Metadata Field</h2>
                <form id="add-metadata-form" method="post">
                    <table class="form-table">
                        <tr>
                            <th><label for="column_label">Field Label</label></th>
                            <td>
                                <input type="text" id="column_label" name="column_label" class="regular-text" required>
                                <p class="description">Enter a label for your new metadata field</p>
                            </td>
                        </tr>
                    </table>
                    <input type="hidden" name="column_type" value="text">
                    <button type="submit" class="button button-primary">Add Field</button>
                </form>
            </div>

            <!-- 
            * Existing Metadata Fields Section
            *
            * This table displays all configured metadata fields in the system.
            * It provides administrators with:
            * 
            * - Visibility into all available custom fields
            * - The system meta_key used in database queries
            * - Delete capability for removing unused fields
            * 
            * Implementation notes:
            * - Delete operations are handled asynchronously with AJAX
            * - Confirmation is requested before deletion
            * - When a field is deleted, its values are removed from all documents
            * - Table follows WordPress admin UI conventions
            * - All displayed values are properly escaped for security
            -->
            <div class="existing-metadata-section">
                <h2>Existing Metadata Fields</h2>
                <?php if ( empty( $custom_metadata ) ) : ?>
                    <p>No custom metadata fields have been created yet. Use the form above to add your first field.</p>
                <?php else : ?>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Field Label</th>
                            <th>Meta Key</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ( $custom_metadata as $meta_key => $metadata_field ) : ?>
                        <tr>
                            <td><?php echo esc_html( $metadata_field['label'] ); ?></td>
                            <td><?php echo esc_html( $meta_key ); ?></td>
                            <td>
                                <button class="button button-small delete-metadata" 
                                    data-meta-key="<?php echo esc_attr( $meta_key ); ?>">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
                <?php endif; ?>
            </div>
        </div>
        <?php
    }
}
