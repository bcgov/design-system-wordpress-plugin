<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

use Bcgov\DesignSystemPlugin\DocumentRepository\MediaUploadHelper;
use Bcgov\DesignSystemPlugin\DocumentRepository\RepositoryConfig;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * RestApiController - REST API Endpoints Handler
 *
 * This service registers and processes all REST API endpoints for the Document Repository.
 */
class RestApiController {
    /**
     * Configuration service.
     *
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;

    /**
     * Document uploader service.
     *
     * @var DocumentUploader
     */
    private DocumentUploader $uploader;

    /**
     * Metadata manager service.
     *
     * @var DocumentMetadataManager
     */
    private DocumentMetadataManager $metadata_manager;

    /**
     * Constructor.
     *
     * @param RepositoryConfig        $config Configuration service.
     * @param DocumentUploader        $uploader Document uploader service.
     * @param DocumentMetadataManager $metadata_manager Metadata manager service.
     */
    public function __construct(
        RepositoryConfig $config,
        DocumentUploader $uploader,
        DocumentMetadataManager $metadata_manager
    ) {
        $this->config           = $config;
        $this->uploader         = $uploader;
        $this->metadata_manager = $metadata_manager;
    }

    /**
     * Register REST API routes.
     */
    public function register_routes(): void {
        $namespace = $this->config->get_api_namespace();

        // Documents endpoints.
        register_rest_route(
            $namespace,
            '/documents',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_documents' ],
                    'permission_callback' => [ $this, 'check_read_permission' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'create_document' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
            ]
        );

        register_rest_route(
            $namespace,
            '/documents/(?P<id>\d+)',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_document' ],
                    'permission_callback' => [ $this, 'check_read_permission' ],
                ],
                [
                    'methods'             => 'PUT',
                    'callback'            => [ $this, 'update_document' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
                [
                    'methods'             => 'DELETE',
                    'callback'            => [ $this, 'delete_document' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
            ]
        );

        // Add new endpoint for updating document metadata.
        register_rest_route(
            $namespace,
            '/documents/(?P<id>\d+)/metadata',
            [
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'update_document_metadata' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
            ]
        );

        // Metadata settings endpoints.
        register_rest_route(
            $namespace,
            '/metadata-fields',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_metadata_fields' ],
                    'permission_callback' => [ $this, 'check_read_permission' ],
                ],
                [
                    'methods'             => 'POST',
                    'callback'            => [ $this, 'add_metadata_field' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
                [
                    'methods'             => 'PUT',
                    'callback'            => [ $this, 'update_metadata_fields' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
            ]
        );

        register_rest_route(
            $namespace,
            '/metadata-fields/(?P<id>[a-z0-9_]+)',
            [
                [
                    'methods'             => 'DELETE',
                    'callback'            => [ $this, 'delete_metadata_field' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
            ]
        );

        // Add cleanup endpoint for metadata fields.
        register_rest_route(
            $namespace,
            '/metadata-fields/(?P<id>[a-z0-9_]+)/cleanup',
            [
                [
                    'methods'             => 'DELETE',
                    'callback'            => [ $this, 'cleanup_metadata_field' ],
                    'permission_callback' => [ $this, 'check_edit_permission' ],
                ],
            ]
        );

        // Categories and tags endpoints.
        register_rest_route(
            $namespace,
            '/categories',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_categories' ],
                    'permission_callback' => [ $this, 'check_read_permission' ],
                ],
            ]
        );

        register_rest_route(
            $namespace,
            '/tags',
            [
                [
                    'methods'             => 'GET',
                    'callback'            => [ $this, 'get_tags' ],
                    'permission_callback' => [ $this, 'check_read_permission' ],
                ],
            ]
        );
    }

    /**
     * Check if user has read permission.
     *
     * @return bool Whether the user has permission.
     */
    public function check_read_permission(): bool {
        // First check if user is logged in.
        if ( ! is_user_logged_in() ) {
            return false;
        }

        // Check if user has the required capability.
        $capability     = $this->config->get_capability();
        $has_capability = current_user_can( $capability );

        // Log permission check for debugging.
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            _doing_it_wrong(
                __METHOD__,
                sprintf(
                    'Document Repository - Read Permission Check - User ID: %d, Capability: %s, Has Capability: %s',
                    absint( get_current_user_id() ),
                    esc_html( $capability ),
                    $has_capability ? 'true' : 'false'
                ),
                '1.0.0'
            );
        }

        return $has_capability;
    }

    /**
     * Check if user has edit permission.
     *
     * @return bool Whether the user has permission.
     */
    public function check_edit_permission(): bool {
        // First check if user is logged in.
        if ( ! is_user_logged_in() ) {
            return false;
        }

        // Check if user has the required capability.
        $capability     = $this->config->get_capability();
        $has_capability = current_user_can( $capability );

        // Log permission check for debugging.
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            _doing_it_wrong(
                __METHOD__,
                sprintf(
                    'Document Repository - Edit Permission Check - User ID: %d, Capability: %s, Has Capability: %s',
                    absint( get_current_user_id() ),
                    esc_html( $capability ),
                    $has_capability ? 'true' : 'false'
                ),
                '1.0.0'
            );
        }

        return $has_capability;
    }

    /**
     * Get documents with pagination.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response The response object.
     */
    public function get_documents( WP_REST_Request $request ): WP_REST_Response {
        $page     = $request->get_param( 'page' ) ?? 1;
        $per_page = $request->get_param( 'per_page' ) ?? $this->config->get( 'per_page' );
        $search   = $request->get_param( 'search' ) ?? '';
        $orderby  = $request->get_param( 'orderby' ) ?? 'date';
        $order    = $request->get_param( 'order' ) ?? 'DESC';

        // Build meta query if filters are provided.
        $meta_query = [];

        $metadata_fields = $this->metadata_manager->get_metadata_fields();
        foreach ( $metadata_fields as $field ) {
            $field_id     = $field['id'];
            $filter_value = $request->get_param( $field_id );

            if ( $filter_value ) {
                $meta_query[] = [
                    'key'     => $field_id,
                    'value'   => $filter_value,
                    'compare' => 'LIKE',
                ];
            }
        }

        // Get documents.
        $result = $this->metadata_manager->get_documents(
            [
                'paged'      => $page,
                'per_page'   => $per_page,
                'search'     => $search,
                'orderby'    => $orderby,
                'order'      => $order,
                'meta_query' => $meta_query,
            ]
        );

        return new WP_REST_Response( $result, 200 );
    }

    /**
     * Get a single document.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function get_document( WP_REST_Request $request ) {
        $id = (int) $request->get_param( 'id' );

        $document = $this->uploader->get_document_data( $id );

        if ( empty( $document ) ) {
            return new WP_Error(
                'document_not_found',
                'Document not found',
                [ 'status' => 404 ]
            );
        }

        return new WP_REST_Response( $document, 200 );
    }

    /**
     * Create a new document.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function create_document( WP_REST_Request $request ) {
        try {
            // Verify nonce for file upload.
            if ( ! wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ) {
                return new WP_Error(
                    'invalid_nonce',
                    'Invalid security token',
                    [ 'status' => 403 ]
                );
            }

            // Extract the file data.
            $file = $request->get_file_params()['file'] ?? null;

            if ( ! $file ) {
                // Try to get it from $_FILES directly as a fallback.
                if ( ! empty( $_FILES['file'] ) && is_array( $_FILES['file'] ) ) {
                    $file = $_FILES['file'];
                } else {
                    return new WP_Error(
                        'missing_file',
                        'No file was uploaded',
                        [ 'status' => 400 ]
                    );
                }
            }

            // Get metadata from request.
            $metadata      = [];
            $json_metadata = $request->get_param( 'metadata' );

            if ( $json_metadata ) {
                // Try to decode metadata JSON.
                $metadata = json_decode( $json_metadata, true );

                if ( json_last_error() !== JSON_ERROR_NONE ) {
                    return new WP_Error(
                        'invalid_metadata',
                        'Invalid metadata JSON: ' . json_last_error_msg(),
                        [ 'status' => 400 ]
                    );
                }
            }

            // Add title from request if provided.
            $title = $request->get_param( 'title' );
            if ( $title ) {
                $metadata['title'] = $title;
            }

            // Upload document.
            $result = $this->uploader->upload_document( $file, $metadata );

            if ( is_wp_error( $result ) ) {
                return $result;
            }

            return new WP_REST_Response( $result, 201 );
        } catch ( \Exception $e ) {
            return new WP_Error(
                'document_upload_exception',
                'An unexpected error occurred during document upload: ' . $e->getMessage(),
                [ 'status' => 500 ]
            );
        }
    }

    /**
     * Update an existing document.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function update_document( WP_REST_Request $request ) {
        $id   = (int) $request->get_param( 'id' );
        $post = get_post( $id );

        if ( ! $post || $post->post_type !== $this->config->get_post_type() ) {
            return new WP_Error(
                'document_not_found',
                'Document not found',
                [ 'status' => 404 ]
            );
        }

        // Get metadata from request.
        $params   = $request->get_params();
        $metadata = [];

        // Update title if provided.
        if ( isset( $params['title'] ) ) {
            wp_update_post(
                [
                    'ID'         => $id,
                    'post_title' => sanitize_text_field( $params['title'] ),
                ]
            );
        }

        // Process metadata fields.
        $metadata_fields = $this->metadata_manager->get_metadata_fields();
        foreach ( $metadata_fields as $field ) {
            $field_id = $field['id'];
            if ( isset( $params[ $field_id ] ) ) {
                $metadata[ $field_id ] = $params[ $field_id ];
            }
        }

        // File replacement if provided.
        $file = $request->get_file_params()['file'] ?? null;
        if ( $file && UPLOAD_ERR_OK === $file['error'] ) {
            // Use WordPress upload handling.
            $attachment_id = MediaUploadHelper::handle_upload( [ 'post_title' => $post->$post_title ] );

            if ( is_wp_error( $attachment_id ) ) {
                return $attachment_id;
            }

            // Delete old attachment.
            $old_attachment_id = get_post_meta( $id, 'document_file_id', true );
            if ( $old_attachment_id ) {
                wp_delete_attachment( $old_attachment_id, true );
            }

            // Save new attachment ID.
            update_post_meta( $id, 'document_file_id', $attachment_id );
        }

        // Save metadata.
        if ( ! empty( $metadata ) ) {
            $this->metadata_manager->save_document_metadata( $id, $metadata );
        }

        // Update categories if provided.
        if ( isset( $params['categories'] ) ) {
            $categories = is_array( $params['categories'] )
                ? $params['categories']
                : explode( ',', $params['categories'] );

            wp_set_object_terms( $id, $categories, 'document_category' );
        }

        // Update tags if provided.
        if ( isset( $params['tags'] ) ) {
            $tags = is_array( $params['tags'] )
                ? $params['tags']
                : explode( ',', $params['tags'] );

            wp_set_object_terms( $id, $tags, 'document_tag' );
        }

        // Clear cache.
        $this->metadata_manager->clear_cache();

        // Return updated document.
        return new WP_REST_Response( $this->uploader->get_document_data( $id ), 200 );
    }

    /**
     * Delete a document.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function delete_document( WP_REST_Request $request ) {
        $id   = (int) $request->get_param( 'id' );
        $post = get_post( $id );

        if ( ! $post || $post->post_type !== $this->config->get_post_type() ) {
            return new WP_Error(
                'document_not_found',
                'Document not found',
                [ 'status' => 404 ]
            );
        }

        $result = $this->uploader->delete_document( $id );

        if ( ! $result ) {
            return new WP_Error(
                'delete_failed',
                'Failed to delete document',
                [ 'status' => 500 ]
            );
        }

        // Clear cache.
        $this->metadata_manager->clear_cache();

        return new WP_REST_Response( null, 204 );
    }

    /**
     * Get metadata fields.
     *
     * @return WP_REST_Response The response object.
     */
    public function get_metadata_fields(): WP_REST_Response {
        $fields = $this->metadata_manager->get_metadata_fields();
        return new WP_REST_Response( $fields, 200 );
    }

    /**
     * Add a new metadata field.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function add_metadata_field( WP_REST_Request $request ) {
        $field = $request->get_params();

        if ( ! isset( $field['id'] ) || ! isset( $field['label'] ) || ! isset( $field['type'] ) ) {
            return new WP_Error(
                'invalid_field',
                'Field must have id, label, and type',
                [ 'status' => 400 ]
            );
        }

        $result = $this->metadata_manager->add_metadata_field( $field );

        if ( ! $result ) {
            return new WP_Error(
                'field_exists',
                'A field with this ID already exists',
                [ 'status' => 409 ]
            );
        }

        return new WP_REST_Response( $field, 201 );
    }

    /**
     * Update metadata fields.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function update_metadata_fields( WP_REST_Request $request ) {
        $fields = $request->get_param( 'fields' );

        if ( ! is_array( $fields ) ) {
            return new WP_Error(
                'invalid_fields',
                'Fields must be an array',
                [ 'status' => 400 ]
            );
        }

        $result = $this->metadata_manager->save_metadata_fields( $fields );

        if ( ! $result ) {
            return new WP_Error(
                'update_failed',
                'Failed to update metadata fields',
                [ 'status' => 500 ]
            );
        }

        return new WP_REST_Response( $fields, 200 );
    }

    /**
     * Delete a metadata field.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function delete_metadata_field( WP_REST_Request $request ) {
        $id = $request->get_param( 'id' );

        $result = $this->metadata_manager->delete_metadata_field( $id );

        if ( ! $result ) {
            return new WP_Error(
                'field_not_found',
                'Field not found',
                [ 'status' => 404 ]
            );
        }

        return new WP_REST_Response( null, 204 );
    }

    /**
     * Clean up a metadata field from all documents.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function cleanup_metadata_field( WP_REST_Request $request ) {
        $field_id = $request->get_param( 'id' );

        // Get all documents.
        $args = [
            'post_type'      => $this->config->get_post_type(),
            'posts_per_page' => -1,
            'post_status'    => 'any',
            'fields'         => 'ids',
        ];

        $query        = new \WP_Query( $args );
        $document_ids = $query->posts;

        // Delete the metadata from each document.
        foreach ( $document_ids as $doc_id ) {
            delete_post_meta( $doc_id, $field_id );
        }

        /* translators: 1: Field ID, 2: Number of documents. */
        $message = __( 'Metadata field "%1$s" has been removed from %2$d documents', 'bcgov-design-system' );
        $message = sprintf( $message, $field_id, count( $document_ids ) );

        return new WP_REST_Response(
            [
                'message' => $message,
            ],
            200
        );
    }

    /**
     * Get document categories.
     *
     * @return WP_REST_Response The response object.
     */
    public function get_categories(): WP_REST_Response {
        $terms = get_terms(
            [
                'taxonomy'   => 'document_category',
                'hide_empty' => false,
            ]
        );

        if ( is_wp_error( $terms ) ) {
            return new WP_REST_Response( [], 200 );
        }

        return new WP_REST_Response( $terms, 200 );
    }

    /**
     * Get document tags.
     *
     * @return WP_REST_Response The response object.
     */
    public function get_tags(): WP_REST_Response {
        $terms = get_terms(
            [
                'taxonomy'   => 'document_tag',
                'hide_empty' => false,
            ]
        );

        if ( is_wp_error( $terms ) ) {
            return new WP_REST_Response( [], 200 );
        }

        return new WP_REST_Response( $terms, 200 );
    }

    /**
     * Update document metadata.
     *
     * @param WP_REST_Request $request The request object.
     * @return WP_REST_Response|WP_Error The response object or error.
     */
    public function update_document_metadata( WP_REST_Request $request ) {
        $document_id = (int) $request->get_param( 'id' );
        $metadata    = $request->get_json_params();

        // Verify nonce for metadata update.
        if ( ! wp_verify_nonce( $request->get_header( 'X-WP-Nonce' ), 'wp_rest' ) ) {
            /* translators: %s: Security token. */
            $error_message = __( 'Invalid security token: %s', 'bcgov-design-system' );
            return new WP_Error(
                'invalid_nonce',
                sprintf( $error_message, $request->get_header( 'X-WP-Nonce' ) ),
                [ 'status' => 403 ]
            );
        }

        // Verify document exists.
        $document = get_post( $document_id );
        if ( ! $document || $document->post_type !== $this->config->get_post_type() ) {
            /* translators: %s: Document ID. */
            $error_message = __( 'Document not found: %s', 'bcgov-design-system' );
            return new WP_Error(
                'document_not_found',
                sprintf( $error_message, $document_id ),
                [ 'status' => 404 ]
            );
        }

        if ( empty( $metadata ) || ! is_array( $metadata ) ) {
            /* translators: %s: Metadata format. */
            $error_message = __( 'Invalid metadata format: %s', 'bcgov-design-system' );
            return new WP_Error(
                'invalid_metadata',
                sprintf( $error_message, wp_json_encode( $metadata ) ),
                [ 'status' => 400 ]
            );
        }

        // Validate metadata fields.
        $metadata_fields   = $this->metadata_manager->get_metadata_fields();
        $field_map         = array_column( $metadata_fields, null, 'id' );
        $validation_errors = [];

        foreach ( $metadata as $field_id => $value ) {
            if ( isset( $field_map[ $field_id ] ) ) {
                $field = $field_map[ $field_id ];

                // Required field validation.
                if ( ! empty( $field['required'] ) && empty( $value ) ) {
                    /* translators: %s: Field label. */
                    $error_message                  = __( '%s is required', 'bcgov-design-system' );
                    $validation_errors[ $field_id ] = sprintf( $error_message, $field['label'] );
                    continue;
                }

                // Select field validation.
                if ( 'select' === $field['type'] && ! empty( $field['options'] ) && ! empty( $value ) ) {
                    if ( ! in_array( $value, $field['options'], true ) ) {
                        /* translators: %s: Field label. */
                        $error_message                  = __( 'Invalid option for %s', 'bcgov-design-system' );
                        $validation_errors[ $field_id ] = sprintf( $error_message, $field['label'] );
                    }
                }

                // Date field validation.
                if ( 'date' === $field['type'] && ! empty( $value ) ) {
                    if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $value ) ) {
                        /* translators: %s: Field label. */
                        $error_message                  = __( 'Invalid date format for %s. Use YYYY-MM-DD', 'bcgov-design-system' );
                        $validation_errors[ $field_id ] = sprintf( $error_message, $field['label'] );
                    }
                }
            }
        }

        // Return validation errors if any.
        if ( ! empty( $validation_errors ) ) {
            /* translators: %s: Error message. */
            $error_message = __( 'Metadata validation failed: %s', 'bcgov-design-system' );
            return new WP_Error(
                'validation_failed',
                sprintf( $error_message, implode( ', ', $validation_errors ) ),
                [
                    'status' => 400,
                    'errors' => $validation_errors,
                ]
            );
        }

        // Update metadata using the metadata manager.
        $result = $this->metadata_manager->save_document_metadata( $document_id, $metadata );

        if ( ! $result ) {
            /* translators: %s: Document ID. */
            $error_message = __( 'Failed to save metadata for document %s', 'bcgov-design-system' );
            return new WP_Error(
                'update_failed',
                sprintf( $error_message, $document_id ),
                [ 'status' => 500 ]
            );
        }

        // Get updated document data.
        $updated_document = $this->uploader->get_document_data( $document_id );

        if ( ! $updated_document ) {
            /* translators: %s: Document ID. */
            $error_message = __( 'Failed to get updated document data for document %s', 'bcgov-design-system' );
            return new WP_Error(
                'update_failed',
                sprintf( $error_message, $document_id ),
                [ 'status' => 500 ]
            );
        }

        return new WP_REST_Response( $updated_document, 200 );
    }
}
