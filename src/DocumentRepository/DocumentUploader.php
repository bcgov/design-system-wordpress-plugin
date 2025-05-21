<?php

namespace src\DocumentRepository;

use src\DocumentRepository\RepositoryConfig;
use WP_Error;

/**
 * DocumentUploader - File Upload Handler
 *
 * This service handles file uploads, attachment creation, and document post creation.
 */
class DocumentUploader {
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

        // Add filter for custom upload directory.
        add_filter( 'upload_dir', [ $this, 'custom_upload_dir' ] );

        // Add filter to modify attachment URLs for our documents.
        add_filter( 'wp_get_attachment_url', [ $this, 'fix_attachment_url' ], 10, 2 );
    }

    /**
     * Custom upload directory filter.
     *
     * @param array $uploads WordPress upload directory settings.
     * @return array Modified upload directory settings.
     */
    public function custom_upload_dir( $uploads ) {
        // Only modify upload directory for document repository uploads
        if ( empty( $_POST['metadata'] ) || strpos( $_POST['metadata'], 'document_repository' ) === false ) {
            return $uploads;
        }

        // For multisite, use the standard WordPress upload path with the current blog ID
        if ( is_multisite() ) {
            $uploads['subdir'] = '/documents';
            $uploads['path'] = $uploads['basedir'] . $uploads['subdir'];
            $uploads['url'] = $uploads['baseurl'] . $uploads['subdir'];
        }

        // Create directory if it doesn't exist
        if ( ! file_exists( $uploads['path'] ) ) {
            wp_mkdir_p( $uploads['path'] );
        }

        return $uploads;
    }

    /**
     * Fix attachment URLs for consistency.
     *
     * Instead of modifying URLs, ensure files are properly stored in the site-specific upload directory.
     *
     * @param string $url The attachment URL.
     * @param int    $attachment_id The attachment ID.
     * @return string The URL.
     */
    public function fix_attachment_url( $url, $attachment_id ) {
        // Check if this is a document repository attachment
        $post_id = get_post_meta( $attachment_id, '_document_repository_post_id', true );
        if ( ! $post_id ) {
            return $url;
        }

        // In multisite, WordPress already handles the correct URL structure with the site ID
        return $url;
    }

    /**
     * Upload a document file and create a document post.
     *
     * @param array $file File data from $_FILES.
     * @param array $metadata Document metadata.
     * @return array|WP_Error Document data or error.
     */
    public function upload_document( array $file, array $metadata = [] ) {
        // Add a flag to identify this as a document repository upload.
        $_POST['metadata'] = wp_json_encode( array_merge( $metadata, [ 'document_repository' => true ] ) );

        // Ensure our custom upload directory exists.
        $upload_dir = wp_upload_dir();
        $custom_dir = $upload_dir['basedir'] . '/documents';

        if ( ! file_exists( $custom_dir ) ) {
            wp_mkdir_p( $custom_dir );
        }

        // Check if file data is properly formed.
        if ( ! isset( $file['tmp_name'] ) || ! isset( $file['name'] ) || ! isset( $file['size'] ) || ! isset( $file['error'] ) ) {
            return new WP_Error(
                'invalid_file_data',
                'Invalid file data structure',
                [ 'file_data' => $file ]
            );
        }

        // Check for file upload errors.
        if ( UPLOAD_ERR_OK !== $file['error'] ) {
            return new WP_Error(
                'upload_error',
                $this->get_upload_error_message( $file['error'] ),
                [ 'error_code' => $file['error'] ]
            );
        }

        // Validate file size.
        if ( $file['size'] > $this->config->get( 'max_file_size' ) ) {
            return new WP_Error(
                'file_too_large',
                sprintf(
                    'File size exceeds the maximum allowed size of %s MB. The file is %s MB.',
                    number_format( $this->config->get( 'max_file_size' ) / ( 1024 * 1024 ), 2 ),
                    number_format( $file['size'] / ( 1024 * 1024 ), 2 )
                ),
                [
                    'max_size'  => $this->config->get( 'max_file_size' ),
                    'file_size' => $file['size'],
                ]
            );
        }

        // Check if file type is allowed.
        $file_type = wp_check_filetype( basename( $file['name'] ), null );
        if ( empty( $file_type['type'] ) || ! $this->config->is_allowed_mime_type( $file_type['type'] ) ) {
            return new WP_Error(
                'invalid_file_type',
                'This file type is not allowed. Please upload a valid document file.',
                [
                    'file_type'     => $file_type,
                    'allowed_types' => $this->config->get( 'allowed_mime_types' ),
                ]
            );
        }

        // Check for duplicate title if provided in metadata.
        if ( ! empty( $metadata['title'] ) ) {
            $duplicate = $this->check_for_duplicate( $metadata['title'] );
            if ( $duplicate ) {
                return new WP_Error(
                    'duplicate_document',
                    'A document with this title already exists.',
                    [ 'duplicate_id' => $duplicate->ID ]
                );
            }
        }

        // Set default title if not provided.
        if ( empty( $metadata['title'] ) ) {
            $metadata['title'] = pathinfo( $file['name'], PATHINFO_FILENAME );
        }

        // Handle file upload to media library.
        require_once ABSPATH . 'wp-admin/includes/file.php';
        require_once ABSPATH . 'wp-admin/includes/image.php';
        require_once ABSPATH . 'wp-admin/includes/media.php';

        // Add error handling for media_handle_upload.
        add_filter(
            'wp_media_upload_handler',
            function ( $handler ) {
                return function ( $file, $info ) use ( $handler ) {
                    try {
                        return $handler( $file, $info );
                    } catch ( \Exception $e ) {
                        return new WP_Error( 'upload_exception', $e->getMessage() );
                    }
                };
            }
        );

        // Use WordPress upload handling.
        $attachment_id = media_handle_upload(
            'file',
            0,
            [
                'post_title' => $metadata['title'],
            ]
        );

        if ( is_wp_error( $attachment_id ) ) {
            return new WP_Error(
                'attachment_creation_failed',
                'Failed to create attachment: ' . $attachment_id->get_error_message(),
                [ 'original_error' => $attachment_id->get_error_data() ]
            );
        }

        // Create document post.
        $document_id = $this->create_document_post( $attachment_id, $metadata );

        if ( is_wp_error( $document_id ) ) {
            // Clean up attachment if document creation failed.
            wp_delete_attachment( $attachment_id, true );
            return new WP_Error(
                'document_creation_failed',
                'Failed to create document: ' . $document_id->get_error_message(),
                [ 'original_error' => $document_id->get_error_data() ]
            );
        }

        // Store reference to document post in attachment meta
        update_post_meta( $attachment_id, '_document_repository_post_id', $document_id );

        // Trigger document uploaded action.
        do_action( 'bcgov_document_repository_document_uploaded', $document_id );

        // Get full document data.
        return $this->get_document_data( $document_id );
    }

    /**
     * Create a document post with metadata.
     *
     * @param int   $attachment_id Attachment ID.
     * @param array $metadata Document metadata.
     * @return int|WP_Error Document post ID or error.
     */
    private function create_document_post( int $attachment_id, array $metadata ) {
        // Create post array.
        $post_data = [
            'post_title'  => sanitize_text_field( $metadata['title'] ),
            'post_status' => 'publish',
            'post_type'   => $this->config->get_post_type(),
        ];

        // Insert post.
        $post_id = wp_insert_post( $post_data, true );

        if ( is_wp_error( $post_id ) ) {
            return $post_id;
        }

        // Save attachment ID as post meta.
        update_post_meta( $post_id, 'document_file_id', $attachment_id );

        // Save metadata.
        foreach ( $metadata as $key => $value ) {
            if ( 'title' !== $key ) {
                update_post_meta( $post_id, $key, $value );
            }
        }

        // Set document categories if provided.
        if ( ! empty( $metadata['categories'] ) ) {
            $categories = is_array( $metadata['categories'] )
                ? $metadata['categories']
                : explode( ',', $metadata['categories'] );

            wp_set_object_terms( $post_id, $categories, 'document_category' );
        }

        // Set document tags if provided.
        if ( ! empty( $metadata['tags'] ) ) {
            $tags = is_array( $metadata['tags'] )
                ? $metadata['tags']
                : explode( ',', $metadata['tags'] );

            wp_set_object_terms( $post_id, $tags, 'document_tag' );
        }

        return $post_id;
    }

    /**
     * Get document data including metadata.
     *
     * @param int $document_id Document post ID.
     * @return array Document data.
     */
    public function get_document_data( int $document_id ): array {
        $post = get_post( $document_id );

        if ( ! $post ) {
            return [];
        }

        // Get metadata manager.
        $metadata_manager = new DocumentMetadataManager( $this->config );

        // Return document data.
        return [
            'id'       => $post->ID,
            'title'    => $post->post_title,
            'date'     => $post->post_date,
            'author'   => get_the_author_meta( 'display_name', $post->post_author ),
            'metadata' => $metadata_manager->get_document_metadata( $post->ID ),
        ];
    }

    /**
     * Check for duplicate document title.
     *
     * @param string $title Document title to check.
     * @return \WP_Post|null Duplicate post or null if none found.
     */
    private function check_for_duplicate( string $title ) {
        $query = new \WP_Query(
            [
                'post_type'      => $this->config->get_post_type(),
                'post_status'    => 'publish',
                'title'          => $title,
                'posts_per_page' => 1,
                'fields'         => 'ids',
            ]
        );

        if ( $query->have_posts() ) {
            return get_post( $query->posts[0] );
        }

        return null;
    }

    /**
     * Get human-readable error message for upload error code.
     *
     * @param int $error_code PHP upload error code.
     * @return string Error message.
     */
    private function get_upload_error_message( int $error_code ): string {
        $upload_errors = [
            UPLOAD_ERR_INI_SIZE   => 'The uploaded file exceeds the upload_max_filesize directive in php.ini.',
            UPLOAD_ERR_FORM_SIZE  => 'The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form.',
            UPLOAD_ERR_PARTIAL    => 'The uploaded file was only partially uploaded.',
            UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder.',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
            UPLOAD_ERR_EXTENSION  => 'A PHP extension stopped the file upload.',
        ];

        return $upload_errors[ $error_code ] ?? 'Unknown upload error.';
    }

    /**
     * Delete a document and its attachment.
     *
     * @param int $document_id Document post ID.
     * @return bool Whether the deletion was successful.
     */
    public function delete_document( int $document_id ): bool {
        // Get attachment ID.
        $attachment_id = get_post_meta( $document_id, 'document_file_id', true );

        // Delete document post.
        $result = wp_delete_post( $document_id, true );

        if ( ! $result ) {
            return false;
        }

        // Delete attachment if it exists.
        if ( $attachment_id ) {
            wp_delete_attachment( $attachment_id, true );
        }

        return true;
    }
}
