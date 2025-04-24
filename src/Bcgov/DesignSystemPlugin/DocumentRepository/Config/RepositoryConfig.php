<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository\Config;

/**
 * RepositoryConfig - Configuration Service
 * 
 * This class holds all configuration settings for the Document Repository system.
 * It provides a central place to manage constants, options, and plugin settings.
 */
class RepositoryConfig {
    /**
     * Default configuration settings
     * 
     * @var array
     */
    private array $settings = [
        // Post type settings
        'post_type' => 'dswp_document',
        'post_type_label' => 'Documents',
        'post_type_singular' => 'Document',
        
        // Menu settings
        'menu_position' => 20,
        'menu_icon' => 'dashicons-media-document',
        'menu_slug' => 'document-repository',
        'metadata_slug' => 'document-repository-metadata',
        
        // Security settings
        'nonce_key' => 'document_repository_nonce',
        'capability' => 'manage_options',
        
        // File upload settings
        'allowed_mime_types' => [
            'pdf' => 'application/pdf'
        ],
        'max_file_size' => 20 * 1024 * 1024, // 20MB
        
        // REST API settings
        'api_namespace' => 'bcgov-document-repository/v1',
        'per_page' => 20,
        
        // Frontend scripts
        'js_handle' => 'document-repository',
        'css_handle' => 'document-repository-styles',
        
        // Cache settings
        'cache_ttl' => 60 * 60, // 1 hour
        'cache_enabled' => true,
    ];
    
    /**
     * Constructor
     * 
     * @param array $overrides Optional configuration overrides
     */
    public function __construct(array $overrides = []) {
        $this->settings = array_merge($this->settings, $overrides);
        
        // Allow configuration to be filtered by other plugins
        $this->settings = apply_filters('bcgov_document_repository_settings', $this->settings);
    }
    
    /**
     * Get a configuration setting
     * 
     * @param string $key Setting key to retrieve
     * @return mixed The setting value
     */
    public function get(string $key) {
        return $this->settings[$key] ?? null;
    }
    
    /**
     * Get all configuration settings
     * 
     * @return array All configuration settings
     */
    public function get_all(): array {
        return $this->settings;
    }
    
    /**
     * Check if a mime type is allowed for upload
     * 
     * @param string $mime_type The mime type to check
     * @return bool Whether the mime type is allowed
     */
    public function is_allowed_mime_type(string $mime_type): bool {
        return in_array($mime_type, $this->settings['allowed_mime_types'], true);
    }
    
    /**
     * Get the post type name
     * 
     * @return string The post type name
     */
    public function get_post_type(): string {
        return $this->settings['post_type'];
    }
    
    /**
     * Get the REST API namespace
     * 
     * @return string The REST API namespace
     */
    public function get_api_namespace(): string {
        return $this->settings['api_namespace'];
    }
    
    /**
     * Get the capability required for document operations
     * 
     * @return string The required capability
     */
    public function get_capability(): string {
        return $this->settings['capability'];
    }
} 