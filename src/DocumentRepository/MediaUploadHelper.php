<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

use WP_Error;

/**
 * MediaUploadHelper - Shared Media Upload Utilities
 *
 * This service provides static helper methods to ensure WordPress media upload dependencies
 * are loaded and to handle media uploads in a DRY, reusable way across the plugin.
 */
class MediaUploadHelper {
    /**
     * Ensure WordPress media upload dependencies are loaded.
     */
    private static function ensure_media_dependencies(): void {
        if ( ! function_exists( 'media_handle_upload' ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';
            require_once ABSPATH . 'wp-admin/includes/media.php';
        }
    }

    /**
     * Handle a media upload in a DRY way.
     *
     * @param array  $attachment_data Attachment post data.
     * @param string $file_input_name The input name for the file.
     * @param int    $parent_post_id  The parent post ID.
     * @return int|WP_Error Attachment ID or error.
     */
    public static function handle_upload( array $attachment_data = [], string $file_input_name = 'file', int $parent_post_id = 0 ) {
        self::ensure_media_dependencies();
        return media_handle_upload( $file_input_name, $parent_post_id, $attachment_data );
    }
}
