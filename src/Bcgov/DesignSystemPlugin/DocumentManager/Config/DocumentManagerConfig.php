<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Config;

class DocumentManagerConfig {
    private $settings;

    public function __construct() {
        $this->settings = [
            'allowed_file_types' => ['pdf'],
            'max_file_size' => 10485760, // 10MB in bytes
            'nonce_key' => 'document_upload_nonce',
            'post_type' => 'document'
        ];

        // Allow settings to be filtered by other plugins
        $this->settings = apply_filters('bcgov_document_manager_settings', $this->settings);
    }

    /**
     * Get a configuration value
     *
     * @param string $key The configuration key
     * @return mixed The configuration value
     */
    public function get($key) {
        return $this->settings[$key] ?? null;
    }

    /**
     * Get all configuration values
     *
     * @return array
     */
    public function getAll() {
        return $this->settings;
    }
} 