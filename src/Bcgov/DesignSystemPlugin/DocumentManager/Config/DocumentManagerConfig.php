<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Config;

class DocumentManagerConfig {
    private const DEFAULT_SETTINGS = [
        'allowed_file_types' => ['pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx'],
        'max_file_size' => 10485760, // 10MB in bytes
        'nonce_key' => 'document_upload_nonce',
        'post_type' => 'document'
    ];

    /**
     * Get a configuration value
     *
     * @param string $key The configuration key
     * @return mixed The configuration value
     */
    public function get($key) {
        return self::DEFAULT_SETTINGS[$key] ?? null;
    }

    /**
     * Get all configuration values
     *
     * @return array
     */
    public function getAll() {
        return self::DEFAULT_SETTINGS;
    }
} 