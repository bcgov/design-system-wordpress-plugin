<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Config;

/**
 * Configuration class for the Document Manager
 *
 * Handles default settings and allows for external configuration through filters.
 *
 * This class centralizes all configuration settings for the Document Manager plugin
 * and provides methods to retrieve these settings securely.
 */
class DocumentManagerConfig {
    /**
     * Configuration settings storage.
     *
     * @var array<string, mixed> Configuration settings
     *
     * This array stores all configuration settings for the Document Manager plugin:
     * - allowed_file_types: File extensions that can be uploaded
     * - max_file_size: Maximum file size in bytes
     * - nonce_key: Security token name for AJAX operations
     * - post_type: WordPress custom post type name for documents
     */
    private array $settings;

    /**
     * Constructor - initializes default settings and applies any filters
     *
     * When this object is created, it:
     * 1. Sets up default configuration values
     * 2. Allows other plugins to modify these settings via WordPress filters
     *
     * Using a filter makes the plugin extensible without modifying source code.
     */
    public function __construct() {
        // Set default configuration values.
        $this->settings = [
            'allowed_file_types' => [ 'pdf' ],      // Only allow PDF files by default.
            'max_file_size'      => 10485760,          // 10MB in bytes.
            'nonce_key'          => 'document_upload_nonce', // Security token name.
            'post_type'          => 'document',             // Custom post type name.
        ];

        // Allow settings to be filtered by other plugins
        // This enables extensibility without modifying core code.
        $this->settings = apply_filters( 'bcgov_document_manager_settings', $this->settings );
    }

    /**
     * Get a configuration value
     *
     * Retrieves a single setting by its key name. Uses the null coalescing
     * operator (??) to safely return null if the key doesn't exist.
     *
     * @param string $key The configuration key.
     * @return mixed|null The configuration value or null if key doesn't exist
     */
    public function get( string $key ) {
        return $this->settings[ $key ] ?? null;
    }

    /**
     * Get all configuration values
     *
     * Returns the entire settings array. Useful when multiple
     * configuration values are needed at once.
     *
     * @return array<string, mixed> All configuration settings
     */
    public function get_all(): array {
        return $this->settings;
    }
}
