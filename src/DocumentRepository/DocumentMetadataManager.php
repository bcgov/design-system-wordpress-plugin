<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

use Bcgov\DesignSystemPlugin\DocumentRepository\RepositoryConfig;
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
        // Get fields from database or default to empty array if none exist.
        return get_option( 'document_repository_metadata_fields', [] );
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
        $valid_types = [ 'text', 'date', 'taxonomy' ];
        if ( ! in_array( $field['type'], $valid_types, true ) ) {
            $errors[] = __( 'Invalid field type', 'bcgov-design-system' );
        }

        // Validate taxonomy options.
        if ( 'taxonomy' === $field['type'] && empty( $field['options'] ) ) {
            $errors[] = __( 'Taxonomy fields require at least one term', 'bcgov-design-system' );
        }

        return $errors;
    }

    /**
     * Save metadata fields configuration.
     *
     * @param array $fields Metadata field definitions to save.
     * @return bool Whether the save was successful.
     */
    public function save_metadata_fields( array $fields ) {
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

        // Handle taxonomy fields
        if ( $result ) {
            foreach ( $fields as $field ) {
                if ( 'taxonomy' === $field['type'] ) {
                    $this->create_taxonomy_for_field( $field );
                }
            }
        }

        // Trigger re-registration of metadata fields with WordPress REST API.
        if ( $result ) {
            do_action( 'document_repository_metadata_fields_updated' );
        }

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

        $result = $this->save_metadata_fields( $fields );
        
        // Handle taxonomy field updates
        if ( $result && 'taxonomy' === $field['type'] ) {
            $this->update_taxonomy_terms( $field );
        }
        
        return $result;
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
            $metadata['document_file_id'] = $file_id;

            // Get the file path and URL.
            $file_path = get_attached_file( $file_id );
            $file_url  = wp_get_attachment_url( $file_id );

            // If the file is in the documents directory, update the URL.
            if ( strpos( $file_path, '/documents/' ) !== false ) {
                $upload_dir = wp_upload_dir();
                $file_url   = $upload_dir['baseurl'] . '/documents/' . basename( $file_path );
            }

            $metadata['document_file_url']  = $file_url;
            $metadata['document_file_name'] = basename( $file_path );
            $metadata['document_file_type'] = get_post_mime_type( $file_id );
            $metadata['document_file_size'] = filesize( $file_path );
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
                    case 'date':
                        $value = sanitize_text_field( $value );
                        break;
                    default:
                        $value = sanitize_text_field( $value );
                        break;
                }
            } else {
                $value = sanitize_text_field( $value );
            }

            // Save the sanitized value.
            update_post_meta( $post_id, $field_id, $value );
        }

        // Update file-related metadata to ensure it's current in REST API.
        $this->update_file_metadata( $post_id );

        return true;
    }

    /**
     * Update file-related metadata for a document.
     * This ensures file data is current and available via REST API.
     *
     * @param int $post_id Document post ID.
     */
    private function update_file_metadata( int $post_id ): void {
        $file_id = get_post_meta( $post_id, 'document_file_id', true );
        if ( $file_id ) {
            // Get the file path and URL.
            $file_path = get_attached_file( $file_id );
            $file_url  = wp_get_attachment_url( $file_id );

            // If the file is in the documents directory, update the URL.
            if ( $file_path && strpos( $file_path, '/documents/' ) !== false ) {
                $upload_dir = wp_upload_dir();
                $file_url   = $upload_dir['baseurl'] . '/documents/' . basename( $file_path );
            }

            // Update file metadata.
            if ( $file_url ) {
                update_post_meta( $post_id, 'document_file_url', $file_url );
            }
            if ( $file_path ) {
                update_post_meta( $post_id, 'document_file_name', basename( $file_path ) );
                if ( file_exists( $file_path ) ) {
                    update_post_meta( $post_id, 'document_file_size', filesize( $file_path ) );
                }
            }

            $mime_type = get_post_mime_type( $file_id );
            if ( $mime_type ) {
                update_post_meta( $post_id, 'document_file_type', $mime_type );
            }
        }
    }

    /**
     * Get documents with pagination.
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

        $args = wp_parse_args( $args, $defaults );

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

        return [
            'documents'    => $documents,
            'total'        => $query->found_posts,
            'total_pages'  => $query->max_num_pages,
            'current_page' => $args['paged'],
        ];
    }

    /**
     * Clear cache - now a no-op function for backward compatibility.
     */
    public function clear_cache(): void {
        // This function is kept for backward compatibility but does nothing.
        $this->log( 'Cache clearing requested but caching is disabled', 'debug' );
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

    /**
     * Create and register a taxonomy for a metadata field.
     *
     * @param array $field Metadata field definition.
     * @return bool Whether the taxonomy was created successfully.
     */
    public function create_taxonomy_for_field( array $field ): bool {
        if ( 'taxonomy' !== $field['type'] ) {
            return false;
        }

        // Register the taxonomy with terms
        return $this->register_field_taxonomy( $field['id'], $field['label'], $field['options'] ?? [] );
    }

    /**
     * Get the taxonomy name for a metadata field.
     *
     * @param string $field_id Field ID.
     * @return string Taxonomy name.
     */
    public function get_taxonomy_name_for_field( string $field_id ): string {
        return 'doc_' . $field_id;
    }

    /**
     * Register a taxonomy for a metadata field.
     *
     * @param string $field_id Field ID.
     * @param string $field_label Field label.
     * @param array  $field_options Optional. Field options/terms to create.
     * @return bool Whether the taxonomy was registered.
     */
    public function register_field_taxonomy( string $field_id, string $field_label, array $field_options = [] ): bool {
        $taxonomy_name = $this->get_taxonomy_name_for_field( $field_id );
        $post_type = $this->config->get_post_type();

        // Check if taxonomy is already registered
        if ( taxonomy_exists( $taxonomy_name ) ) {
            // If taxonomy exists, still try to create any missing terms
            if ( ! empty( $field_options ) ) {
                $this->create_taxonomy_terms( $taxonomy_name, $field_options );
            }
            return true;
        }

        $labels = [
            'name'              => $field_label,
            'singular_name'     => $field_label,
            'search_items'      => sprintf( 'Search %s', $field_label ),
            'all_items'         => sprintf( 'All %s', $field_label ),
            'edit_item'         => sprintf( 'Edit %s', $field_label ),
            'update_item'       => sprintf( 'Update %s', $field_label ),
            'add_new_item'      => sprintf( 'Add New %s', $field_label ),
            'new_item_name'     => sprintf( 'New %s Name', $field_label ),
            'menu_name'         => $field_label,
        ];

        $args = [
            'labels'            => $labels,
            'hierarchical'      => false,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => false,
            'rewrite'           => false,
            'show_in_rest'      => true,
            'meta_box_cb'       => false, // We'll handle the UI ourselves
        ];

        $result = register_taxonomy( $taxonomy_name, $post_type, $args );
        
        if ( ! is_wp_error( $result ) && ! empty( $field_options ) ) {
            // Create terms after successful taxonomy registration
            $this->create_taxonomy_terms( $taxonomy_name, $field_options );
        }
        
        return ! is_wp_error( $result );
    }

    /**
     * Create terms for a taxonomy.
     *
     * @param string $taxonomy_name Taxonomy name.
     * @param array  $terms Array of term names.
     * @return bool Whether terms were created successfully.
     */
    public function create_taxonomy_terms( string $taxonomy_name, array $terms ): bool {
        foreach ( $terms as $term_name ) {
            $term_name = trim( $term_name );
            if ( empty( $term_name ) ) {
                continue;
            }

            // Check if term already exists
            $existing_term = get_term_by( 'name', $term_name, $taxonomy_name );
            if ( ! $existing_term ) {
                $result = wp_insert_term( $term_name, $taxonomy_name );
                if ( is_wp_error( $result ) ) {
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * Update taxonomy terms for a field.
     *
     * @param array $field Metadata field definition.
     * @return bool Whether terms were updated successfully.
     */
    public function update_taxonomy_terms( array $field ): bool {
        if ( 'taxonomy' !== $field['type'] ) {
            return false;
        }

        $taxonomy_name = $this->get_taxonomy_name_for_field( $field['id'] );
        
        // Get existing terms
        $existing_terms = get_terms( [
            'taxonomy' => $taxonomy_name,
            'hide_empty' => false,
        ] );

        if ( is_wp_error( $existing_terms ) ) {
            return false;
        }

        $existing_term_names = array_map( function( $term ) {
            return $term->name;
        }, $existing_terms );

        $new_term_names = array_map( 'trim', $field['options'] );
        $new_term_names = array_filter( $new_term_names ); // Remove empty values

        // Delete terms that are no longer in the options
        $terms_to_delete = array_diff( $existing_term_names, $new_term_names );
        foreach ( $terms_to_delete as $term_name ) {
            $term = get_term_by( 'name', $term_name, $taxonomy_name );
            if ( $term ) {
                wp_delete_term( $term->term_id, $taxonomy_name );
            }
        }

        // Add new terms
        $terms_to_add = array_diff( $new_term_names, $existing_term_names );
        $this->create_taxonomy_terms( $taxonomy_name, $terms_to_add );

        return true;
    }
}
