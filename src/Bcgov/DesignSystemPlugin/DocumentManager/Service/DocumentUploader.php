<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentMetadataManager;

/**
 * DocumentUploader Service
 *
 * This service handles secure file uploads for the Document Manager system.
 * It acts as a specialized file handling layer that implements a robust set
 * of security checks, validation rules, and file processing operations.
 *
 * Key responsibilities:
 * - Validates file uploads (size, type, errors)
 * - Handles file naming conflicts securely
 * - Creates document posts in WordPress database
 * - Manages file metadata and custom fields
 * - Interacts with the DocumentMetadataManager for cache management
 *
 * Security considerations:
 * - Validates file types against allowed list
 * - Sanitizes filenames
 * - Checks for malicious uploads
 * - Enforces file size limits
 * - Prevents duplicate document names
 * - Sanitizes all metadata before database insertion
 */
class DocumentUploader {
    /**
     * Configuration service
     *
     * Provides access to upload-related settings including:
     * - Maximum file size
     * - Allowed file types
     * - Upload directory paths
     * - Post type configuration
     *
     * @var DocumentManagerConfig
     */
    private DocumentManagerConfig $config;

    /**
     * Constructor
     *
     * Initializes the uploader with its required dependencies.
     * Using dependency injection for better testability and reduced coupling.
     *
     * @param DocumentManagerConfig $config Configuration object.
     */
    public function __construct( DocumentManagerConfig $config ) {
        $this->config = $config;
    }

    /**
     * Handle single file upload
     *
     * This is the main method for processing a document upload. It performs
     * a series of validations and operations:
     *
     * 1. Validates the uploaded file (error status, size, type)
     * 2. Checks for duplicate document names to prevent conflicts
     * 3. Creates a secure upload directory if needed
     * 4. Handles filename conflicts with incremental numbering
     * 5. Moves the uploaded file to its permanent location
     * 6. Creates a WordPress post to represent the document
     * 7. Associates metadata with the document
     * 8. Clears caches to ensure data consistency
     *
     * Error handling is robust, with specific exceptions for each possible
     * failure mode and cleanup of temporary files when problems occur.
     *
     * @param array                        $file Single file from $_FILES array.
     * @param array                        $metadata Document metadata (title, description, custom fields).
     * @param DocumentMetadataManager|null $metadata_manager Optional metadata manager for cache clearing.
     * @return array{post_id: int, file_url: string, title: string, description: string, file_type: string, meta: array<string, string>}
     *         Upload result with post ID and file URL
     * @throws \Exception If file upload fails for any reason.
     */
    public function upload_single( array $file, array $metadata = [], ?DocumentMetadataManager $metadata_manager = null ): array {
        // Security: Validate file for PHP upload errors.
        if ( UPLOAD_ERR_OK !== $file['error'] ) {
            throw new \Exception( esc_html( $this->get_upload_error_message( $file['error'] ) ) );
        }

        // Security: Enforce file size limits.
        if ( $file['size'] > $this->config->get( 'max_file_size' ) ) {
            throw new \Exception( 'File size exceeds maximum limit.' );
        }

        // Security: Validate file type against allowed list.
        $file_type = wp_check_filetype( $file['name'] );
        if ( ! in_array( $file_type['ext'], $this->config->get( 'allowed_file_types' ), true ) ) {
            throw new \Exception( 'File type not allowed.' );
        }

        // Extract filename for document title.
        $title = pathinfo( $file['name'], PATHINFO_FILENAME );

        // Debugging: Log duplicate document check via WordPress action.
        do_action( 'bcgov_document_manager_log', 'Checking for duplicate document with title: ' . $title, 'debug' );

        // Security: Check for duplicate document names.
        // This prevents overwriting existing documents and user confusion.
        $existing_docs = get_posts(
            [
				'post_type'      => $this->config->get( 'post_type' ),
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'title'          => $title,
			]
        );

        // Debugging: Log existing documents found via WordPress action.
        do_action( 'bcgov_document_manager_log', 'Found existing docs: ' . wp_json_encode( $existing_docs ), 'debug' );

        // Case-insensitive comparison to prevent similar-named duplicates.
        foreach ( $existing_docs as $doc ) {
            if ( strtolower( $doc->post_title ) === strtolower( $title ) ) {
                throw new \Exception( 'A document with the name "' . esc_html( $title ) . '" already exists. Please choose a different name.' );
            }
        }

        // Set up dedicated document upload directory.
        $upload_dir   = wp_upload_dir();
        $document_dir = $upload_dir['basedir'] . '/documents';

        // Create directory with proper permissions if it doesn't exist.
        if ( ! wp_mkdir_p( $document_dir ) ) {
            throw new \Exception( 'Failed to create upload directory.' );
        }

        // Security: Sanitize filename to prevent path traversal and invalid characters.
        $filename  = sanitize_file_name( $file['name'] );
        $file_path = $document_dir . '/' . $filename;

        // Handle filename conflicts with incremental numbering.
        // This preserves the original name while ensuring uniqueness.
        if ( file_exists( $file_path ) ) {
            $file_info = pathinfo( $filename );
            $base      = $file_info['filename'];
            $ext       = isset( $file_info['extension'] ) ? '.' . $file_info['extension'] : '';
            $counter   = 1;

            // Find an available filename by incrementing counter.
            while ( file_exists( $document_dir . '/' . $base . '-' . $counter . $ext ) ) {
                ++$counter;
            }

            $filename  = $base . '-' . $counter . $ext;
            $file_path = $document_dir . '/' . $filename;
        }

        // Security: Use move_uploaded_file which performs additional security checks.
        // This verifies the file was actually uploaded via HTTP POST.
        if ( ! move_uploaded_file( $file['tmp_name'], $file_path ) ) {
            throw new \Exception( 'Failed to move uploaded file.' );
        }

        // Prepare WordPress post data for the document.
        // This creates the database record that represents the document.
        $post_data = array(
            'post_title'   => $title,
            'post_status'  => 'publish',
            'post_type'    => $this->config->get( 'post_type' ),
            'post_excerpt' => isset( $metadata['description'] ) ? sanitize_textarea_field( $metadata['description'] ) : '',
        );

        // Debugging: Log post creation data via WordPress action.
        do_action( 'bcgov_document_manager_log', 'Creating post with data: ' . wp_json_encode( $post_data ), 'debug' );

        // Create the WordPress post.
        $post_id = wp_insert_post( $post_data );
        if ( is_wp_error( $post_id ) ) {
            // Error handling: Clean up the uploaded file if post creation fails.
            // This prevents orphaned files in the file system.
            wp_delete_file( $file_path );
            throw new \Exception( esc_html( $post_id->get_error_message() ) );
        }

        // Store file metadata in WordPress post meta.
        $file_url = $upload_dir['baseurl'] . '/documents/' . $filename;
        update_post_meta( $post_id, '_document_file_url', $file_url );
        update_post_meta( $post_id, '_document_file_type', $file_type['type'] );

        // Load custom metadata field definitions.
        $custom_columns = get_option( 'document_custom_columns', array() );
        $all_meta       = array();

        // Initialize all custom fields with empty values.
        // This ensures consistency in the metadata structure.
        foreach ( $custom_columns as $meta_key => $column ) {
            $all_meta[ $meta_key ] = '';
        }

        // Process and store provided custom metadata.
        if ( isset( $metadata['meta'] ) && is_array( $metadata['meta'] ) ) {
            foreach ( $metadata['meta'] as $meta_key => $value ) {
                if ( array_key_exists( $meta_key, $custom_columns ) ) {
                    // Security: Sanitize all user-provided metadata.
                    $value                 = sanitize_text_field( $value );
                    $all_meta[ $meta_key ] = $value;
                    update_post_meta( $post_id, $meta_key, $value );
                }
            }
        }

        // Store empty values for any fields not provided in metadata.
        // This ensures all expected metadata fields exist.
        foreach ( $all_meta as $meta_key => $value ) {
            if ( ! isset( $metadata['meta'][ $meta_key ] ) ) {
                update_post_meta( $post_id, $meta_key, '' );
            }
        }

        // Performance: Clear caches after document upload.
        // This can be done directly via the manager or through WordPress actions.
        if ( $metadata_manager ) {
            $metadata_manager->clear_cache();
        } else {
            do_action( 'bcgov_document_manager_document_uploaded', $post_id );
        }

        // Return comprehensive result data for API response.
        return [
            'post_id'     => $post_id,
            'file_url'    => $file_url,
            'title'       => $title,
            'description' => $post_data['post_excerpt'],
            'file_type'   => $file_type['type'],
            'meta'        => $all_meta,
        ];
    }

    /**
     * Get human-readable upload error message
     *
     * Translates PHP's numeric upload error codes into clear,
     * user-friendly error messages. This improves the debugging
     * experience when uploads fail due to server constraints.
     *
     * These error messages can be safely displayed to users as
     * they don't contain sensitive system information but provide
     * enough detail for troubleshooting common issues.
     *
     * @param int $error_code PHP upload error code from $_FILES['error'].
     * @return string Human-readable error message
     */
    private function get_upload_error_message( int $error_code ): string {
        $upload_errors = array(
            UPLOAD_ERR_INI_SIZE   => 'File exceeds upload_max_filesize directive in php.ini',
            UPLOAD_ERR_FORM_SIZE  => 'File exceeds MAX_FILE_SIZE directive specified in the HTML form',
            UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE    => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload',
        );

        return isset( $upload_errors[ $error_code ] )
            ? $upload_errors[ $error_code ]
            : 'Unknown upload error';
    }
}
