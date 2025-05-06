<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository\src\Service;

use Bcgov\DesignSystemPlugin\DocumentRepository\src\Config\RepositoryConfig;
use WP_Query;
use WP_Error;

/**
 * DocumentMetadataManager - Metadata and Cache Handler
 *
 * This service manages document metadata, custom fields, and caching for
 * document queries and metadata settings.
 */
class DocumentMetadataManager {
    /**
     * Configuration service.
     *
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;

    private const CACHE_KEY        = 'document_repository_metadata_fields';
    private const CACHE_EXPIRATION = 3600; // 1 hour.

    /**
     * Constructor.
     *
     * @param RepositoryConfig $config Configuration service.
     */
    public function __construct( RepositoryConfig $config ) {
        $this->config = $config;
    }

    /**
     * Get metadata fields configuration.
     *
     * @return array Metadata field definitions.
     */
    public function get_metadata_fields(): array {
        // Try to get from cache first.
        $cached_fields = wp_cache_get( self::CACHE_KEY );
        if ( false !== $cached_fields ) {
            return $cached_fields;
        }

        $fields = get_option( 'document_repository_metadata_fields', $this->get_default_metadata_fields() );

        // Cache the result.
        wp_cache_set( self::CACHE_KEY, $fields, '', self::CACHE_EXPIRATION );

        return $fields;
    }

    /**
     * Get default metadata fields.
     *
     * @return array Default metadata field definitions.
     */
    public function get_default_metadata_fields(): array {
        return [
            [
                'id'         => 'document_description',
                'label'      => 'Description',
                'type'       => 'textarea',
                'order'      => 0,
                'filterable' => true,
            ],
            [
                'id'         => 'document_version',
                'label'      => 'Version',
                'type'       => 'text',
                'order'      => 1,
                'filterable' => true,
            ],
            [
                'id'         => 'document_status',
                'label'      => 'Status',
                'type'       => 'select',
                'options'    => [
                    'draft'    => 'Draft',
                    'review'   => 'Under Review',
                    'approved' => 'Approved',
                    'archived' => 'Archived',
                ],
                'order'      => 2,
                'filterable' => true,
            ],
        ];
    }

    /**
     * Validate a metadata field definition.
     *
     * @param array $field Field definition to validate.
     * @return array Array of validation errors.
     */
    private function validate_field( array $field ): array {
        $errors = [];

        // Required fields.
        if ( empty( $field['id'] ) ) {
            $errors[] = __( 'Field ID is required', 'bcgov-design-system' );
        }
        if ( empty( $field['label'] ) ) {
            $errors[] = __( 'Field label is required', 'bcgov-design-system' );
        }
        if ( empty( $field['type'] ) ) {
            $errors[] = __( 'Field type is required', 'bcgov-design-system' );
        }

        // Validate type.
        $valid_types = [ 'text', 'select', 'date' ];
        if ( ! in_array( $field['type'], $valid_types, true ) ) {
            $errors[] = __( 'Invalid field type', 'bcgov-design-system' );
        }

        // Validate select options.
        if ( 'select' === $field['type'] && empty( $field['options'] ) ) {
            $errors[] = __( 'Select fields require at least one option', 'bcgov-design-system' );
        }

        return $errors;
    }

    /**
     * Save metadata fields configuration.
     *
     * @param array $fields Metadata field definitions to save.
     * @return bool Whether the save was successful.
     */
    public function save_metadata_fields( array $fields ): bool {
        // Validate all fields.
        $all_errors = [];
        foreach ( $fields as $index => $field ) {
            $errors = $this->validate_field( $field );
            if ( ! empty( $errors ) ) {
                $all_errors[ $index ] = $errors;
            }
        }

        if ( ! empty( $all_errors ) ) {
            return new WP_Error(
                'validation_failed',
                __( 'Field validation failed', 'bcgov-design-system' ),
                [ 'errors' => $all_errors ]
            );
        }

        // Sort fields by order.
        usort(
            $fields,
            function ( $a, $b ) {
                return ( $a['order'] ?? 0 ) - ( $b['order'] ?? 0 );
            }
        );

        // Save fields.
        $result = update_option( 'document_repository_metadata_fields', $fields );

        // Clear cache.
        wp_cache_delete( self::CACHE_KEY );

        return $result;
    }

    /**
     * Add a new metadata field.
     *
     * @param array $field Field definition.
     * @return bool Whether the addition was successful.
     */
    public function add_metadata_field( array $field ): bool {
        if ( ! isset( $field['id'] ) || ! isset( $field['label'] ) || ! isset( $field['type'] ) ) {
            return false;
        }

        $fields = $this->get_metadata_fields();

        // Check for duplicate ID.
        foreach ( $fields as $existing ) {
            if ( $existing['id'] === $field['id'] ) {
                return false;
            }
        }

        // Add new field.
        $fields[] = $field;

        return $this->save_metadata_fields( $fields );
    }

    /**
     * Update an existing metadata field.
     *
     * @param string $field_id Field ID to update.
     * @param array  $field New field definition.
     * @return bool Whether the update was successful.
     */
    public function update_metadata_field( string $field_id, array $field ): bool {
        $fields  = $this->get_metadata_fields();
        $updated = false;

        foreach ( $fields as $key => $existing ) {
            if ( $existing['id'] === $field_id ) {
                $fields[ $key ] = $field;
                $updated        = true;
                break;
            }
        }

        if ( ! $updated ) {
            return false;
        }

        return $this->save_metadata_fields( $fields );
    }

    /**
     * Delete a metadata field.
     *
     * @param string $field_id Field ID to delete.
     * @return bool Whether the deletion was successful.
     */
    public function delete_metadata_field( string $field_id ): bool {
        $fields  = $this->get_metadata_fields();
        $updated = false;

        foreach ( $fields as $key => $field ) {
            if ( $field['id'] === $field_id ) {
                unset( $fields[ $key ] );
                $updated = true;
                break;
            }
        }

        if ( ! $updated ) {
            return false;
        }

        // Reindex array.
        $fields = array_values( $fields );

        return $this->save_metadata_fields( $fields );
    }

    /**
     * Get document metadata.
     *
     * @param int $post_id Document post ID.
     * @return array Document metadata.
     */
    public function get_document_metadata( int $post_id ): array {
        // Get all metadata for the post.
        $all_meta = get_post_meta( $post_id );
        $metadata = [];

        // Convert single value arrays to scalar values.
        foreach ( $all_meta as $key => $values ) {
            $metadata[ $key ] = is_array( $values ) && 1 === count( $values ) ? $values[0] : $values;
        }

        // Add file data.
        $file_id = get_post_meta( $post_id, 'document_file_id', true );
        if ( $file_id ) {
            $metadata['document_file_id']   = $file_id;
            $metadata['document_file_url']  = wp_get_attachment_url( $file_id );
            $metadata['document_file_name'] = basename( get_attached_file( $file_id ) );
            $metadata['document_file_type'] = get_post_mime_type( $file_id );
            $metadata['document_file_size'] = filesize( get_attached_file( $file_id ) );
        }

        return $metadata;
    }

    /**
     * Save document metadata.
     *
     * @param int   $post_id Document post ID.
     * @param array $metadata Metadata to save.
     * @return bool Whether the save was successful.
     */
    public function save_document_metadata( int $post_id, array $metadata ): bool {
        $fields    = $this->get_metadata_fields();
        $field_map = array_column( $fields, null, 'id' );

        foreach ( $metadata as $field_id => $value ) {
            // Skip if not a registered field.
            if ( ! isset( $field_map[ $field_id ] ) && 'document_file_id' !== $field_id ) {
                continue;
            }

            // Sanitize value based on field type.
            if ( isset( $field_map[ $field_id ] ) ) {
                $field = $field_map[ $field_id ];
                switch ( $field['type'] ) {
                    case 'text':
                        $value = sanitize_text_field( $value );
                        break;
                    case 'textarea':
                        $value = sanitize_textarea_field( $value );
                        break;
                    case 'select':
                        // Validate against allowed options.
                        if ( ! empty( $field['options'] ) && ! in_array( $value, $field['options'], true ) ) {
                            $value = ''; // Set to empty if invalid.
                            break;
                        }
                        $value = sanitize_text_field( $value );
                        break;
                    case 'date':
                        // Basic date format validation.
                        if ( ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $value ) ) {
                            $value = ''; // Set to empty if invalid.
                            break;
                        }
                        break;
                }
            }

            // Save the sanitized value.
            update_post_meta( $post_id, $field_id, $value );
        }

        // Clear cache.
        $this->clear_cache( [ 'documents' ] );

        return true;
    }

    /**
     * Get documents with pagination and caching.
     *
     * @param array $args Query arguments.
     * @return array Documents and pagination info.
     */
    public function get_documents( array $args = [] ): array {
        $defaults = [
            'paged'      => 1,
            'per_page'   => $this->config->get( 'per_page' ),
            'orderby'    => 'date',
            'order'      => 'DESC',
            'search'     => '',
            'meta_query' => [],
            'tax_query'  => [],
        ];

        $args      = wp_parse_args( $args, $defaults );
        $cache_key = 'document_repository_documents_page_' . wp_json_encode( $args );

        // Check cache if enabled.
        if ( $this->config->get( 'cache_enabled' ) ) {
            $cached = get_transient( $cache_key );
            if ( false !== $cached ) {
                return $cached;
            }
        }

        // Build query.
        $query_args = [
            'post_type'      => $this->config->get_post_type(),
            'posts_per_page' => $args['per_page'],
            'paged'          => $args['paged'],
            'orderby'        => $args['orderby'],
            'order'          => $args['order'],
            'post_status'    => 'publish',
        ];

        // Add search.
        if ( ! empty( $args['search'] ) ) {
            $query_args['s'] = $args['search'];
        }

        // Add meta query.
        if ( ! empty( $args['meta_query'] ) ) {
            $query_args['meta_query'] = $args['meta_query'];
        }

        // Add taxonomy query.
        if ( ! empty( $args['tax_query'] ) ) {
            $query_args['tax_query'] = $args['tax_query'];
        }

        // Run query.
        $query = new WP_Query( $query_args );

        // Format results.
        $documents = [];
        foreach ( $query->posts as $post ) {
            $documents[] = [
                'id'       => $post->ID,
                'title'    => $post->post_title,
                'date'     => $post->post_date,
                'author'   => get_the_author_meta( 'display_name', $post->post_author ),
                'metadata' => $this->get_document_metadata( $post->ID ),
            ];
        }

        $result = [
            'documents'    => $documents,
            'total'        => $query->found_posts,
            'total_pages'  => $query->max_num_pages,
            'current_page' => $args['paged'],
        ];

        // Cache results.
        if ( $this->config->get( 'cache_enabled' ) ) {
            set_transient( $cache_key, $result, $this->config->get( 'cache_ttl' ) );
        }

        $this->log( 'Documents query executed', 'debug' );
        return $result;
    }

    /**
     * Clear cache.
     *
     * @param array|int $types Cache types to clear (documents, columns, etc.) or document ID.
     */
    public function clear_cache( $types = [ 'documents', 'columns' ] ): void {
        global $wpdb;

        // If $types is an integer (document ID), convert it to default array.
        if ( is_int( $types ) || is_numeric( $types ) ) {
            $this->log( 'Cache cleared for document ID: ' . $types, 'debug' );
            $types = [ 'documents', 'columns' ];
        }

        // Ensure $types is an array.
        if ( ! is_array( $types ) ) {
            $types = [ 'documents', 'columns' ];
        }

        foreach ( $types as $type ) {
            switch ( $type ) {
                case 'documents':
                    // Clear document count cache.
                    delete_transient( 'document_repository_count' );

                    // Clear document pages cache.
                    $transient_like = $wpdb->esc_like( '_transient_document_repository_documents_page_' ) . '%';
                    $wpdb->query(
                        $wpdb->prepare(
                            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
                            '%' . $transient_like
                        )
                    );
                    break;

                case 'columns':
                    // Clear columns cache.
                    delete_transient( 'document_repository_columns' );
                    break;
            }
        }

        do_action( 'document_repository_cache_cleared', $types );
        $this->log( 'Cache cleared: ' . ( is_array( $types ) ? implode( ', ', $types ) : $types ), 'debug' );
    }

    /**
     * Log message to WordPress log.
     *
     * @param string $message Message to log.
     * @param string $level Log level.
     */
    private function log( string $message, string $level = 'info' ): void {
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            do_action( 'document_repository_log', $message, $level );
        }
    }
}
