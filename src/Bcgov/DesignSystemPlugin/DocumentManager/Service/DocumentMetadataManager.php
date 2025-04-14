<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * DocumentMetadataManager Service
 *
 * This service is a central component in the Document Manager architecture,
 * acting as the data layer between WordPress post/meta storage and the rest of the
 * application. It encapsulates all metadata operations and document file management.
 *
 * Key responsibilities:
 * - Document metadata CRUD operations
 * - Document file handling (renaming, deletion)
 * - Custom column/field configuration management
 * - Performance optimization through strategic caching
 * - Database transaction management for complex operations
 *
 * The class follows the repository pattern, providing a clean API for
 * document data operations while hiding the complexities of WordPress
 * post/postmeta storage and file system operations.
 */
class DocumentMetadataManager {
    /**
     * Plugin configuration service
     *
     * Provides access to plugin-wide settings like the document post type,
     * upload directory configurations, and other configurable parameters.
     *
     * @var DocumentManagerConfig
     */
    private DocumentManagerConfig $config;

    /**
     * Constructor
     *
     * Initializes the manager with its dependencies.
     * Using dependency injection to improve testability and reduce coupling.
     *
     * @param DocumentManagerConfig $config Configuration service.
     */
    public function __construct( DocumentManagerConfig $config ) {
        $this->config = $config;
    }

    /**
     * Update document title and file
     *
     * This method updates both the post title in the database and
     * the corresponding file name in the file system to keep them in sync.
     *
     * The synchronized file name is crucial for:
     * - Better user experience when downloading files
     * - Improved file organization on the server
     * - Easier file identification in the uploads directory
     *
     * @param int    $post_id Post ID of the document.
     * @param string $new_title New title to set.
     * @return bool Success status
     */
    public function update_document_title( int $post_id, string $new_title ): bool {
        // Security: Sanitize input before updating database.
        // Update post title.
        $update_result = wp_update_post(
            [
				'ID'         => $post_id,
				'post_title' => sanitize_text_field( $new_title ),
			]
        );

        if ( is_wp_error( $update_result ) ) {
            return false;
        }

        // Rename the corresponding file to match the new title.
        $new_file_url = $this->rename_document_file( $post_id, $new_title );
        if ( $new_file_url ) {
            // Update file URL in metadata to reflect the new path.
            update_post_meta( $post_id, '_document_file_url', $new_file_url );
        }

        return true;
    }

    /**
     * Rename a document file
     *
     * Handles the file system operations to rename a document file
     * while maintaining its location and extension. Includes safeguards for:
     * - File existence checking
     * - Filename conflict resolution
     * - Proper path handling for WordPress uploads directory
     * - URL conversion for database storage
     *
     * @param int    $post_id Post ID.
     * @param string $new_title New title to use for filename.
     * @return bool|string New file URL on success, false on failure
     */
    public function rename_document_file( int $post_id, string $new_title ) {
        // Get current file URL from post metadata.
        $current_file_url = get_post_meta( $post_id, '_document_file_url', true );
        if ( ! $current_file_url ) {
            return false;
        }

        // Get WordPress upload directory information.
        $upload_dir = wp_upload_dir();
        // Convert URL to server path for file operations.
        $current_file_path = str_replace( $upload_dir['baseurl'], $upload_dir['basedir'], $current_file_url );

        // Security: Verify file exists before attempting operations.
        if ( ! file_exists( $current_file_path ) ) {
            return false;
        }

        // Get file information (directory, filename, extension).
        $file_info = pathinfo( $current_file_path );

        // Create new filename from title.
        // Security: Sanitize filename to prevent path traversal and invalid characters.
        $new_filename  = sanitize_file_name( $new_title . '.' . $file_info['extension'] );
        $new_file_path = $file_info['dirname'] . '/' . $new_filename;

        // Handle filename conflicts - avoid overwriting existing files.
        if ( file_exists( $new_file_path ) && $new_file_path !== $current_file_path ) {
            $base    = sanitize_file_name( $new_title );
            $ext     = isset( $file_info['extension'] ) ? '.' . $file_info['extension'] : '';
            $counter = 1;

            // Append incremental numbers until we find an available filename.
            while ( file_exists( $file_info['dirname'] . '/' . $base . '-' . $counter . $ext ) &&
                  ( $file_info['dirname'] . '/' . $base . '-' . $counter . $ext ) !== $current_file_path ) {
                ++$counter;
            }

            $new_filename  = $base . '-' . $counter . $ext;
            $new_file_path = $file_info['dirname'] . '/' . $new_filename;
        }

        // Performance optimization: Skip rename if paths are identical.
        if ( $new_file_path === $current_file_path ) {
            return $current_file_url;
        }

        // Use WordPress Filesystem API for file operations.
        global $wp_filesystem;
        if ( ! function_exists( 'WP_Filesystem' ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }
        WP_Filesystem();

        // Perform the file rename operation.
        if ( ! $wp_filesystem->move( $current_file_path, $new_file_path, true ) ) {
            return false;
        }

        // Convert server path back to URL for database storage.
        return str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $new_file_path );
    }

    /**
     * Update document metadata
     *
     * Comprehensive method to update all document data including:
     * - Post title (with corresponding file rename)
     * - Post description (excerpt)
     * - Custom metadata fields
     *
     * Uses WordPress transactional approach where possible
     * and clears relevant caches after updates.
     *
     * @param int   $post_id Post ID.
     * @param array $metadata Document metadata array.
     * @return bool Success status
     * @throws \Exception If document update fails.
     */
    public function update_document_metadata( int $post_id, array $metadata ): bool {
        // Security: Verify post exists and is the correct post type.
        $post = get_post( $post_id );
        if ( ! $post || $post->post_type !== $this->config->get( 'post_type' ) ) {
            throw new \Exception( 'Invalid document.' );
        }

        // Prepare data for post update.
        $update_data = array(
            'ID' => $post_id,
        );

        // Handle title updates with special file rename logic.
        if ( isset( $metadata['title'] ) ) {
            $new_title = sanitize_text_field( $metadata['title'] );
            if ( ! $this->update_document_title( $post_id, $new_title ) ) {
                throw new \Exception( 'Failed to update document title.' );
            }
        }

        // Handle description updates.
        if ( isset( $metadata['description'] ) ) {
            $update_data['post_excerpt'] = sanitize_textarea_field( $metadata['description'] );
        }

        // Performance optimization: Only update post if there are changes.
        if ( count( $update_data ) > 1 ) {
            // Update the post.
            $result = wp_update_post( $update_data );
            if ( is_wp_error( $result ) ) {
                throw new \Exception( esc_html( $result->get_error_message() ) );
            }
        }

        // Update custom metadata fields.
        if ( isset( $metadata['meta'] ) && is_array( $metadata['meta'] ) ) {
            foreach ( $metadata['meta'] as $meta_key => $value ) {
                // Security: Sanitize all metadata values.
                update_post_meta( $post_id, $meta_key, sanitize_text_field( $value ) );
            }
        }

        // Performance: Clear caches to ensure data consistency.
        $this->clear_cache();

        return true;
    }

    /**
     * Delete a document
     *
     * Performs a complete document deletion including:
     * - Post data in the database
     * - Associated file in the uploads directory
     * - All related metadata
     * - Cache clearing
     *
     * @param int $post_id Post ID.
     * @return bool Success status
     * @throws \Exception If document deletion fails.
     */
    public function delete_document( int $post_id ): bool {
        // Security: Verify post exists and is correct type.
        $post = get_post( $post_id );
        if ( ! $post || $post->post_type !== $this->config->get( 'post_type' ) ) {
            throw new \Exception( 'Invalid document.' );
        }

        // Get file information before deleting post.
        $file_url = get_post_meta( $post_id, '_document_file_url', true );
        if ( $file_url ) {
            $upload_dir = wp_upload_dir();
            $file_path  = str_replace( $upload_dir['baseurl'], $upload_dir['basedir'], $file_url );
        }

        // Delete the post and all its metadata.
        $result = wp_delete_post( $post_id, true );
        if ( ! $result ) {
            throw new \Exception( 'Failed to delete document.' );
        }

        // Delete the physical file if it exists.
        // Note: Use WordPress file deletion functions for proper handling.
        if ( ! empty( $file_path ) && file_exists( $file_path ) ) {
            wp_delete_file( $file_path );
        }

        // Performance: Clear caches to ensure data consistency.
        $this->clear_cache();

        return true;
    }

    /**
     * Get column settings
     *
     * Retrieves custom column configurations with caching
     * to optimize performance for this frequently accessed data.
     *
     * Uses WordPress transient API for caching with automatic
     * expiration and cache invalidation on settings changes.
     *
     * @return array Column settings
     */
    public function get_column_settings(): array {
        // Performance optimization: Check for cached column settings.
        $cache_key = 'document_manager_columns';
        $columns   = get_transient( $cache_key );

        // If no cache or cache expired, fetch from database.
        if ( false === $columns ) {
            // Get settings from WordPress options table.
            $columns = get_option( 'document_custom_columns', array() );

            // Cache the column settings for 1 hour (3600 seconds).
            // This significantly reduces database queries for this frequently accessed data.
            set_transient( $cache_key, $columns, 3600 );

            // Debugging: Log cache miss using WordPress filter system.
            do_action( 'bcgov_document_manager_log', 'Document Manager: Column settings cache miss', 'debug' );
        } else {
            // Debugging: Log cache hit using WordPress filter system.
            do_action( 'bcgov_document_manager_log', 'Document Manager: Column settings cache hit', 'debug' );
        }

        return $columns;
    }

    /**
     * Clear all document-related caches
     *
     * Comprehensive cache management method that can target specific
     * cache types or clear all document manager caches.
     *
     * Uses direct SQL for efficient bulk cache clearing of pagination caches
     * and notifies other components via WordPress action hooks.
     *
     * @param string|array<string> $types Cache types to clear ('count', 'listings', 'columns', 'all').
     * @return void
     */
    public function clear_cache( $types = 'all' ): void {
        global $wpdb;

        // Convert string parameter to array for consistent processing.
        $types = (array) $types;

        // Clear document count cache.
        if ( in_array( 'all', $types, true ) || in_array( 'count', $types, true ) ) {
            delete_transient( 'document_manager_count' );
        }

        // Clear document listing caches (pagination pages).
        if ( in_array( 'all', $types, true ) || in_array( 'listings', $types, true ) ) {
            // Performance optimization: Use direct SQL to clear multiple caches at once.
            // This is much faster than calling delete_transient multiple times.
            $transient_like = $wpdb->esc_like( '_transient_document_manager_documents_page_' ) . '%';
            $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM $wpdb->options WHERE option_name LIKE %s",
                    $transient_like
                )
            );
        }

        // Clear column settings cache.
        if ( in_array( 'all', $types, true ) || in_array( 'columns', $types, true ) ) {
            delete_transient( 'document_manager_columns' );
        }

        // Integration point: Allow other components to respond to cache clearing.
        // This follows WordPress patterns for extensibility.
        do_action( 'bcgov_document_manager_cache_cleared', $types );

        // Debugging: Log cache clearing event using WordPress filter system.
        do_action( 'bcgov_document_manager_log', 'Document Manager: Cache cleared - ' . implode( ', ', $types ), 'debug' );
    }

    /**
     * Save column settings
     *
     * Creates or updates custom metadata column configurations
     * for the document manager admin UI. Handles:
     * - Column creation with proper key generation
     * - Type-specific settings (like options for select fields)
     * - Cache invalidation after settings changes
     *
     * @param string $label User-friendly column label.
     * @param string $type Column data type (text, number, date, select, etc.).
     * @param array  $options Options for select type.
     * @return array Updated column settings
     * @throws \Exception If saving fails.
     */
    public function save_column_settings( string $label, string $type, array $options = [] ): array {
        // Validate inputs.
        if ( empty( $label ) ) {
            throw new \Exception( 'Column label is required.' );
        }

        // Generate a consistent meta key from the label.
        // This ensures meta keys are valid for WordPress and unique.
        $meta_key = 'document_' . sanitize_title( $label );

        // Get existing custom columns configuration.
        $custom_columns = get_option( 'document_custom_columns', array() );

        // Prepare the new column configuration.
        $custom_columns[ $meta_key ] = array(
            'label' => $label,
            'type'  => $type,
        );

        // Handle select field options.
        if ( 'select' === $type && ! empty( $options ) ) {
            $custom_columns[ $meta_key ]['options'] = $options;
        } elseif ( 'select' === $type ) {
            // Default options if none provided for select type.
            $custom_columns[ $meta_key ]['options'] = array( 'Option 1', 'Option 2', 'Option 3' );
        }

        // Save to database.
        if ( ! update_option( 'document_custom_columns', $custom_columns ) ) {
            throw new \Exception( 'Failed to save column settings.' );
        }

        // Performance: Clear only the relevant caches.
        $this->clear_cache( [ 'listings', 'columns' ] );

        return $custom_columns;
    }

    /**
     * Delete a column
     *
     * Removes a custom metadata column and all associated data:
     * - Removes column configuration from settings
     * - Deletes all metadata values for this column across all documents
     * - Clears relevant caches
     *
     * @param string $meta_key Meta key to delete.
     * @return bool True if successful
     * @throws \Exception If deletion fails.
     */
    public function delete_column( string $meta_key ): bool {
        // Get existing custom columns.
        $custom_columns = get_option( 'document_custom_columns', array() );

        // Verify column exists.
        if ( ! isset( $custom_columns[ $meta_key ] ) ) {
            throw new \Exception( 'Column does not exist.' );
        }

        // Remove the column configuration.
        unset( $custom_columns[ $meta_key ] );

        // Update settings in database.
        if ( ! update_option( 'document_custom_columns', $custom_columns ) ) {
            throw new \Exception( 'Failed to delete column.' );
        }

        // Data cleanup: Remove all metadata values for this column.
        $this->delete_meta_for_all_documents( $meta_key );

        // Performance: Clear affected caches.
        $this->clear_cache( [ 'listings', 'columns' ] );

        return true;
    }

    /**
     * Bulk update documents
     *
     * High-performance method to update multiple documents at once
     * using database transactions and minimizing queries through:
     * - Batched SQL statements where possible
     * - Transaction management for atomicity
     * - Targeted post cache clearing
     *
     * This is significantly faster than updating documents one by one,
     * especially for large batch operations.
     *
     * @param array $updates Associative array of document updates keyed by post ID.
     * @return array Result with updated posts
     * @throws \Exception If bulk update fails.
     */
    public function bulk_update_documents( array $updates ): array {
        global $wpdb;

        // Validate input data.
        if ( ! $updates || ! is_array( $updates ) ) {
            throw new \Exception( 'No valid update data received.' );
        }

        // Performance & Data Integrity: Use a database transaction.
        // This ensures all updates succeed or fail together.
        $wpdb->query( 'START TRANSACTION' );

        try {
            $success       = true;
            $updated_posts = [];

            // Prepare data for batch operations.
            $title_updates   = [];
            $excerpt_updates = [];
            $meta_updates    = [];

            // Process each document update.
            foreach ( $updates as $post_id => $data ) {
                $post_id = intval( $post_id );

                // Security: Verify post exists and is correct type.
                $post = get_post( $post_id );
                if ( ! $post || $post->post_type !== $this->config->get( 'post_type' ) ) {
                    continue;
                }

                // Collect title updates for batch processing.
                if ( isset( $data['title'] ) ) {
                    $title_updates[] = $wpdb->prepare(
                        '(%d, %s)',
                        $post_id,
                        sanitize_text_field( $data['title'] )
                    );
                }

                // Collect description updates for batch processing.
                if ( isset( $data['description'] ) ) {
                    $excerpt_updates[] = $wpdb->prepare(
                        '(%d, %s)',
                        $post_id,
                        sanitize_textarea_field( $data['description'] )
                    );
                }

                // Collect metadata updates.
                if ( isset( $data['meta'] ) && is_array( $data['meta'] ) ) {
                    foreach ( $data['meta'] as $meta_key => $value ) {
                        $meta_updates[] = [
                            'post_id'    => $post_id,
                            'meta_key'   => sanitize_key( $meta_key ),
                            'meta_value' => sanitize_text_field( $value ),
                        ];
                    }
                }

                $updated_posts[] = $post_id;
            }

            // Execute batch title updates.
            if ( ! empty( $title_updates ) ) {
                // Each title update is already individually prepared for SQL safety.
                foreach ( $title_updates as $prepared_value ) {
                    // Use direct, safe INSERT...ON DUPLICATE KEY UPDATE query.
                    // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery
                    // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
                    $result = $wpdb->query(
                        "INSERT INTO {$wpdb->posts} (ID, post_title) VALUES " . $prepared_value .
                        ' ON DUPLICATE KEY UPDATE post_title = VALUES(post_title)'
                    );
                    // phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
                    // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery

                    if ( false === $result ) {
                        $success = false;
                    }
                }
            }

            // Execute batch excerpt updates.
            if ( ! empty( $excerpt_updates ) ) {
                // Each excerpt update is already individually prepared for SQL safety.
                foreach ( $excerpt_updates as $prepared_value ) {
                    // Use direct, safe INSERT...ON DUPLICATE KEY UPDATE query.
                    // phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery
                    // phpcs:disable WordPress.DB.PreparedSQL.NotPrepared
                    $result = $wpdb->query(
                        "INSERT INTO {$wpdb->posts} (ID, post_excerpt) VALUES " . $prepared_value .
                        ' ON DUPLICATE KEY UPDATE post_excerpt = VALUES(post_excerpt)'
                    );
                    // phpcs:enable WordPress.DB.PreparedSQL.NotPrepared
                    // phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery

                    if ( false === $result ) {
                        $success = false;
                    }
                }
            }

            // Execute metadata updates.
            // Note: Using WordPress API here because meta tables have variable
            // structure and direct SQL becomes complex with serialized data.
            if ( ! empty( $meta_updates ) ) {
                foreach ( $meta_updates as $meta ) {
                    update_post_meta( $meta['post_id'], $meta['meta_key'], $meta['meta_value'] );
                }
            }

            // If all operations succeeded, commit the transaction.
            if ( $success ) {
                $wpdb->query( 'COMMIT' );

                // Performance: Clear only the affected post caches.
                foreach ( $updated_posts as $post_id ) {
                    clean_post_cache( $post_id );
                }

                // Clear document cache after bulk updates.
                $this->clear_cache();

                return [
                    'message' => 'Changes saved successfully.',
                    'updated' => $updated_posts,
                ];
            } else {
                throw new \Exception( 'Failed to save some changes.' );
            }
        } catch ( \Exception $e ) {
            // Rollback all changes if any part of the update failed.
            $wpdb->query( 'ROLLBACK' );
            throw $e;
        }
    }

    /**
     * Delete all metadata for a specific key across all documents
     *
     * Helper method that efficiently removes all instances of a
     * specific metadata field from all documents. Used during
     * column deletion to maintain data consistency.
     *
     * @param string $meta_key The meta key to delete.
     * @return int Number of rows affected
     */
    protected function delete_meta_for_all_documents( string $meta_key ): int {
        global $wpdb;

        // Get all document post IDs.
        $post_ids = get_posts(
            array(
				'post_type'      => $this->config->get( 'post_type' ),
				'posts_per_page' => -1,
				'fields'         => 'ids',
            )
        );

        if ( empty( $post_ids ) ) {
            return 0;
        }

        // Delete metadata from all documents.
        $count = 0;
        foreach ( $post_ids as $post_id ) {
            if ( delete_post_meta( $post_id, $meta_key ) ) {
                ++$count;
            }
        }

        return $count;
    }
}

/**
 * Handle Document Manager logging
 *
 * Centralizes logging for the Document Manager with environment awareness.
 * Only logs in development environments when debugging is enabled.
 *
 * @param string $message The message to log
 * @param string $level The log level (debug, info, warning, error)
 */
add_action(
    'bcgov_document_manager_log',
    function ( $message, $level = 'info' ) {
		// Only log when WordPress debugging is enabled.
		if ( defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
			$timestamp = gmdate( 'Y-m-d H:i:s' );
			// Format: [timestamp][level] message.
			do_action( 'bcgov_document_manager_write_log', "[Document Manager][$timestamp][$level] $message" );
		}
	},
    10,
    2
);

/**
 * Low-level logging handler that actually writes to the log
 *
 * This separate action allows for testing and potentially
 * replacing the logging mechanism without changing the logging API.
 *
 * @param string $log_message The formatted message to write to the log
 */
add_action(
    'bcgov_document_manager_write_log',
    function ( $log_message ) {
        if ( defined( 'WP_DEBUG' ) && WP_DEBUG && defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
            // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            error_log( $log_message );
        }
    }
);
