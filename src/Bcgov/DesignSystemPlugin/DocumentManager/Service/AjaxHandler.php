<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * AjaxHandler Service
 *
 * This class is responsible for processing all AJAX requests from the Document Manager's
 * JavaScript front-end. It acts as the bridge between client-side interactions and
 * server-side data operations.
 *
 * Security implementation:
 * - All methods implement WordPress nonce verification to prevent CSRF attacks
 * - User capability checks ensure proper authorization for each action
 * - Input sanitization is applied to all user-provided data
 * - Exception handling with appropriate error messages
 *
 * The handler delegates actual data operations to specialized services:
 * - Document uploads are handled by DocumentUploader
 * - Metadata operations are handled by DocumentMetadataManager
 *
 * This service-based architecture promotes separation of concerns and maintainability.
 */
class AjaxHandler {
    /**
     * Configuration settings
     *
     * @var DocumentManagerConfig
     */
    private $config;

    /**
     * Document uploader service
     *
     * @var DocumentUploader
     */
    private $uploader;

    /**
     * Metadata manager service
     *
     * @var DocumentMetadataManager
     */
    private $metadata_manager;

    /**
     * Constructor - initializes the AJAX handler with required services
     *
     * This class relies on dependency injection to receive the services it needs,
     * which improves testability and reduces tight coupling. Each service handles
     * a specific aspect of document management.
     *
     * @param DocumentManagerConfig   $config Configuration service.
     * @param DocumentUploader        $uploader Document upload service.
     * @param DocumentMetadataManager $metadata_manager Metadata management service.
     */
    public function __construct(
        DocumentManagerConfig $config,
        DocumentUploader $uploader,
        DocumentMetadataManager $metadata_manager
    ) {
        $this->config           = $config;
        $this->uploader         = $uploader;
        $this->metadata_manager = $metadata_manager;
    }

    /**
     * Handle document upload AJAX action
     *
     * Processes file uploads from the document upload form. This method:
     * 1. Verifies the security nonce to prevent CSRF attacks
     * 2. Checks user capabilities to ensure proper authorization
     * 3. Processes uploaded files (supports multiple file upload)
     * 4. Applies metadata to each uploaded document
     * 5. Returns JSON response with success or error information
     *
     * File processing is delegated to the DocumentUploader service.
     *
     * @throws \Exception If security checks fail or file upload fails.
     */
    public function handle_document_upload() {
        try {
            $nonce_key      = $this->config->get( 'nonce_key' );
            $received_nonce = isset( $_REQUEST['security'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['security'] ) ) : 'no_nonce';

            // Add debug output via action hook.
            do_action( 'bcgov_document_manager_log', 'Received Nonce: ' . $received_nonce, 'debug' );
            do_action( 'bcgov_document_manager_log', 'Nonce Key Used: ' . $nonce_key, 'debug' );
            do_action( 'bcgov_document_manager_log', 'Nonce Verification Result: ' . ( wp_verify_nonce( $received_nonce, $nonce_key ) ? 'true' : 'false' ), 'debug' );

            // Security check: Verify nonce.
            if ( ! check_ajax_referer( $nonce_key, 'security', false ) ) {
                throw new \Exception( 'Invalid security token. Please refresh the page and try again.' );
            }

            // Security check: Verify user capabilities.
            if ( ! current_user_can( 'upload_files' ) ) {
                throw new \Exception( 'You do not have permission to upload files.' );
            }

            // Process file upload data.
            $files    = isset( $_FILES['document_file'] ) ? $_FILES['document_file'] : array();
            $metadata = array();

            if ( isset( $_POST['metadata'] ) ) {
                $metadata_json = sanitize_text_field( wp_unslash( $_POST['metadata'] ) );
                $metadata      = json_decode( stripslashes( $metadata_json ), true );
            }

            // Ensure metadata is an array even if json_decode fails.
            if ( ! is_array( $metadata ) ) {
                do_action( 'bcgov_document_manager_log', 'Failed to parse metadata JSON: ' . ( isset( $_POST['metadata'] ) ? wp_json_encode( $_POST['metadata'] ) : 'none' ), 'error' );
                $metadata = [];
            }

            $results = [];

            // Handle multiple file uploads.
            $file_count = count( $files['name'] );
            for ( $i = 0; $i < $file_count; $i++ ) {
                $file = array(
                    'name'     => $files['name'][ $i ],
                    'type'     => $files['type'][ $i ],
                    'tmp_name' => $files['tmp_name'][ $i ],
                    'error'    => $files['error'][ $i ],
                    'size'     => $files['size'][ $i ],
                );

                // Delegate file handling to uploader service.
                $results[] = $this->uploader->upload_single( $file, $metadata, $this->metadata_manager );
            }

            // Return success response with upload results.
            wp_send_json_success( $results );
        } catch ( \Exception $e ) {
            // Log error via action hook.
            do_action( 'bcgov_document_manager_log', 'Document upload error: ' . $e->getMessage(), 'error' );
            wp_send_json_error( [ 'message' => $e->getMessage() ] );
        }
    }

    /**
     * Handle unauthorized access
     *
     * This method runs when non-logged-in users attempt to access
     * AJAX endpoints that require authentication. It returns a
     * standardized error response with 403 Forbidden status.
     *
     * Used with wp_ajax_nopriv_ hooks for security.
     */
    public function handle_unauthorized_access() {
        wp_send_json_error( 'You must be logged in to upload documents.', 403 );
    }

    /**
     * Save metadata settings via AJAX
     *
     * Handles requests to create new metadata fields for documents.
     * Each metadata field becomes a column in the document table and
     * a field in document forms.
     *
     * Security:
     * - Verifies nonce to prevent CSRF attacks
     * - Requires manage_options capability (admin level)
     * - Sanitizes input fields
     *
     * @throws \Exception If saving the metadata settings fails.
     */
    public function save_metadata_settings() {
        try {
            // Verify nonce before processing any data.
            if ( ! check_ajax_referer( $this->config->get( 'nonce_key' ), 'security', false ) ) {
                wp_send_json_error( 'Invalid security token.', 403 );
                return;
            }

            // Debug logging via action hook.
            do_action( 'bcgov_document_manager_log', 'Save metadata settings request received', 'debug' );
            do_action( 'bcgov_document_manager_log', 'POST data: ' . wp_json_encode( $_POST ), 'debug' );

            // Check user capabilities.
            if ( ! current_user_can( 'manage_options' ) ) {
                wp_send_json_error( 'You do not have permission to save metadata settings.', 403 );
                return;
            }

            // Validate and sanitize input.
            $label = isset( $_POST['column_label'] ) ? sanitize_text_field( wp_unslash( $_POST['column_label'] ) ) : '';
            $type  = isset( $_POST['column_type'] ) ? sanitize_text_field( wp_unslash( $_POST['column_type'] ) ) : 'text';

            // Delegate to metadata manager service.
            $result = $this->metadata_manager->save_column_settings( $label, $type );
            wp_send_json_success( $result );

        } catch ( \Exception $e ) {
            do_action( 'bcgov_document_manager_log', 'Metadata settings error: ' . $e->getMessage(), 'error' );
            wp_send_json_error( $e->getMessage() );
        }
    }

    /**
     * Handle metadata field deletion
     *
     * Processes requests to delete a custom metadata field.
     * This removes the field from all documents and from the
     * document table structure.
     *
     * Security:
     * - Verifies nonce to prevent CSRF attacks
     * - Requires manage_options capability (admin level)
     * - Sanitizes input fields
     *
     * @throws \Exception If deletion of the metadata field fails.
     */
    public function delete_metadata() {
        try {
            // Verify nonce before processing any data.
            if ( ! check_ajax_referer( $this->config->get( 'nonce_key' ), 'security', false ) ) {
                throw new \Exception( 'Security check failed.' );
            }

            // Debug logging via action hook.
            do_action( 'bcgov_document_manager_log', 'Delete metadata field request received', 'debug' );
            do_action( 'bcgov_document_manager_log', 'POST data: ' . wp_json_encode( $_POST ), 'debug' );

            // Check permissions.
            if ( ! current_user_can( 'manage_options' ) ) {
                throw new \Exception( 'You do not have permission to delete metadata fields.' );
            }

            // Get meta key.
            $meta_key = isset( $_POST['meta_key'] ) ? sanitize_key( wp_unslash( $_POST['meta_key'] ) ) : '';

            // Delegate to metadata manager service.
            $this->metadata_manager->delete_column( $meta_key );

            wp_send_json_success(
                array(
					'message' => 'Metadata field deleted successfully.',
                )
            );

        } catch ( \Exception $e ) {
            do_action( 'bcgov_document_manager_log', 'Metadata deletion error: ' . $e->getMessage(), 'error' );
            wp_send_json_error(
                array(
					'message' => $e->getMessage(),
                )
            );
        }
    }

    /**
     * Handle saving document metadata via AJAX
     *
     * Processes requests to update a single document's metadata from the
     * document edit modal. This includes the document title, description,
     * and all custom metadata fields.
     *
     * Security:
     * - Verifies nonce to prevent CSRF attacks
     * - Requires edit_posts capability
     * - Validates document ID
     * - Delegates sanitization to DocumentMetadataManager
     *
     * @throws \Exception If saving the document metadata fails.
     */
    public function save_document_metadata() {
        try {
            // Verify nonce before processing any data.
            if ( ! check_ajax_referer( $this->config->get( 'nonce_key' ), 'security', false ) ) {
                throw new \Exception( 'Security check failed.' );
            }

            // Debug logging via action hook.
            do_action( 'bcgov_document_manager_log', 'Save metadata request received', 'debug' );
            do_action( 'bcgov_document_manager_log', 'POST data: ' . wp_json_encode( $_POST ), 'debug' );
            do_action( 'bcgov_document_manager_log', 'Security token received: ' . ( isset( $_REQUEST['security'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['security'] ) ) : 'no_nonce' ), 'debug' );
            do_action( 'bcgov_document_manager_log', 'Nonce key used: ' . $this->config->get( 'nonce_key' ), 'debug' );
            do_action( 'bcgov_document_manager_log', 'Nonce verification result: ' . ( wp_verify_nonce( isset( $_REQUEST['security'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['security'] ) ) : '', $this->config->get( 'nonce_key' ) ) ? 'true' : 'false' ), 'debug' );

            // Security check: Verify user capabilities.
            if ( ! current_user_can( 'edit_posts' ) ) {
                throw new \Exception( 'You do not have permission to edit documents.' );
            }

            // Get post ID.
            $post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
            if ( ! $post_id ) {
                throw new \Exception( 'No document ID provided.' );
            }

            // Prepare metadata.
            $metadata = [];

            if ( isset( $_POST['title'] ) ) {
                $metadata['title'] = sanitize_text_field( wp_unslash( $_POST['title'] ) );
            }

            if ( isset( $_POST['description'] ) ) {
                $metadata['description'] = sanitize_textarea_field( wp_unslash( $_POST['description'] ) );
            }

            if ( isset( $_POST['meta'] ) && is_array( $_POST['meta'] ) ) {
                $metadata['meta'] = array_map( 'sanitize_text_field', wp_unslash( $_POST['meta'] ) );
            }

            // Delegate to metadata manager service.
            $this->metadata_manager->update_document_metadata( $post_id, $metadata );

            wp_send_json_success(
                array(
					'message' => 'Document updated successfully.',
                )
            );

        } catch ( \Exception $e ) {
            do_action( 'bcgov_document_manager_log', 'Document metadata save error: ' . $e->getMessage(), 'error' );
            wp_send_json_error(
                array(
					'message' => $e->getMessage(),
                )
            );
        }
    }

    /**
     * Handle document deletion
     *
     * Processes requests to delete a document, removing both the post
     * from the database and the associated file from the filesystem.
     *
     * Security:
     * - Verifies nonce to prevent CSRF attacks
     * - Requires delete_posts capability
     * - Validates document ID
     * - Delegates actual deletion to DocumentMetadataManager
     *
     * @throws \Exception If document deletion fails.
     */
    public function delete_document() {
        try {
            // Verify nonce before processing any data.
            if ( ! check_ajax_referer( $this->config->get( 'nonce_key' ), 'security', false ) ) {
                throw new \Exception( 'Security check failed.' );
            }

            // Debug logging via action hook.
            do_action( 'bcgov_document_manager_log', 'Delete document request received', 'debug' );
            do_action( 'bcgov_document_manager_log', 'POST data: ' . wp_json_encode( $_POST ), 'debug' );
            do_action( 'bcgov_document_manager_log', 'Nonce received: ' . ( isset( $_REQUEST['security'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['security'] ) ) : 'no_nonce' ), 'debug' );
            do_action( 'bcgov_document_manager_log', 'Nonce key used: ' . $this->config->get( 'nonce_key' ), 'debug' );

            if ( ! current_user_can( 'delete_posts' ) ) {
                throw new \Exception( 'You do not have permission to delete documents.' );
            }

            // Get post ID.
            $post_id = isset( $_POST['post_id'] ) ? intval( $_POST['post_id'] ) : 0;
            if ( ! $post_id ) {
                throw new \Exception( 'No document ID provided.' );
            }

            // Delegate to metadata manager service.
            $this->metadata_manager->delete_document( $post_id );

            wp_send_json_success(
                array(
					'message' => 'Document deleted successfully.',
                )
            );
        } catch ( \Exception $e ) {
            do_action( 'bcgov_document_manager_log', 'Document deletion error: ' . $e->getMessage(), 'error' );
            wp_send_json_error(
                array(
					'message' => $e->getMessage(),
                )
            );
        }
    }

    /**
     * Handle bulk edit save action
     *
     * Processes requests to update multiple documents at once from
     * the bulk edit mode in the document table. This can modify
     * multiple documents with a single request.
     *
     * Security:
     * - Verifies nonce to prevent CSRF attacks
     * - Requires edit_posts capability
     * - Validates update data
     * - Delegates processing to DocumentMetadataManager
     *
     * @throws \Exception If the bulk edit operation fails.
     */
    public function save_bulk_edit() {
        try {
            // Verify nonce before processing any data.
            if ( ! check_ajax_referer( $this->config->get( 'nonce_key' ), 'security', false ) ) {
                throw new \Exception( 'Invalid security token. Please refresh the page and try again.' );
            }

            // Debug logging via action hook.
            do_action( 'bcgov_document_manager_log', 'Bulk edit request received', 'debug' );
            do_action( 'bcgov_document_manager_log', 'POST data: ' . wp_json_encode( $_POST ), 'debug' );
            do_action( 'bcgov_document_manager_log', 'Security token received: ' . ( isset( $_REQUEST['security'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['security'] ) ) : 'no_nonce' ), 'debug' );

            if ( ! current_user_can( 'edit_posts' ) ) {
                throw new \Exception( 'You do not have permission to edit documents.' );
            }

            // Process update data.
            $updates = null;
            if ( isset( $_POST['updates'] ) ) {
                $updates_json = sanitize_text_field( wp_unslash( $_POST['updates'] ) );
                $updates      = json_decode( stripslashes( $updates_json ), true );
            }

            // Delegate to metadata manager service.
            $result = $this->metadata_manager->bulk_update_documents( $updates );

            wp_send_json_success( $result );

        } catch ( \Exception $e ) {
            do_action( 'bcgov_document_manager_log', 'Bulk edit error: ' . $e->getMessage(), 'error' );
            wp_send_json_error( [ 'message' => $e->getMessage() ] );
        }
    }
}
