<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

use Bcgov\DesignSystemPlugin\DocumentRepository\src\Config\RepositoryConfig;
use Bcgov\DesignSystemPlugin\DocumentRepository\src\Service\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentRepository\src\Service\DocumentUploader;
use Bcgov\DesignSystemPlugin\DocumentRepository\src\Service\AdminUIManager;
use Bcgov\DesignSystemPlugin\DocumentRepository\src\Service\RestApiController;
use Bcgov\DesignSystemPlugin\DocumentRepository\src\Service\DocumentMetadataManager;

/**
 * DocumentRepository - Main Plugin Class
 * 
 * This class serves as the central coordinator for the Document Repository system.
 * It manages service instantiation, WordPress integration, and overall architecture.
 */
class DocumentRepository {
    /**
     * Configuration instance
     * 
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;
    
    /**
     * Service instances
     */
    private ?DocumentPostType $post_type = null;
    private ?DocumentUploader $uploader = null;
    private ?AdminUIManager $admin_ui = null;
    private ?RestApiController $rest_api = null;
    private ?DocumentMetadataManager $metadata_manager = null;
    
    /**
     * Constructor
     * 
     * @param RepositoryConfig|null $config Optional config instance for dependency injection
     */
    public function __construct(RepositoryConfig $config = null) {
        // Initialize configuration or use provided one
        $this->config = $config ?? new RepositoryConfig();
        
        // Register all WordPress hooks
        $this->register();
    }
    
    /**
     * Register WordPress hooks and integrations
     */
    public function register(): void {
        // Core WordPress integration hooks
        add_action('init', [$this, 'register_post_types']);
        add_action('rest_api_init', [$this, 'register_rest_routes'], 10);
        add_action('admin_menu', [$this, 'register_admin_menus']);
        add_action('admin_enqueue_scripts', [$this->get_admin_ui(), 'enqueue_admin_scripts']);
        
        // Event listeners
        add_action('bcgov_document_repository_document_uploaded', 
                  [$this->get_metadata_manager(), 'clear_cache']);
    }
    
    /**
     * Register custom post type for documents
     */
    public function register_post_types(): void {
        $this->get_post_type()->register();
    }
    
    /**
     * Register REST API endpoints
     */
    public function register_rest_routes(): void {
        // Add logging to help debug REST API issues
        error_log('Registering Document Repository REST API routes');
        
        // Add CORS headers
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        add_filter('rest_pre_serve_request', function($value) {
            header('Access-Control-Allow-Origin: *');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, X-Requested-With');
            
            // Handle preflight requests
            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                status_header(200);
                exit();
            }
            
            return $value;
        });
        
        // Log authentication info for debugging
        if (is_user_logged_in()) {
            error_log('REST API - User logged in, ID: ' . get_current_user_id());
            error_log('REST API - Nonce: ' . wp_create_nonce('wp_rest'));
        } else {
            error_log('REST API - No user logged in');
        }
        
        // Register the routes
        $this->get_rest_api()->register_routes();
        
        // Log registered routes for debugging
        global $wp_rest_server;
        if ($wp_rest_server) {
            $routes = $wp_rest_server->get_routes();
            foreach ($routes as $route => $handlers) {
                if (strpos($route, 'bcgov-document-repository') !== false) {
                    error_log('Registered route: ' . $route);
                }
            }
        }
    }
    
    /**
     * Register admin menus and submenus
     */
    public function register_admin_menus(): void {
        $this->get_admin_ui()->add_repository_menu();
        $this->get_admin_ui()->add_metadata_settings_submenu();
    }
    
    /**
     * Get the document post type service
     * 
     * @return DocumentPostType
     */
    public function get_post_type(): DocumentPostType {
        if (null === $this->post_type) {
            $this->post_type = new DocumentPostType($this->config);
        }
        return $this->post_type;
    }
    
    /**
     * Get the document uploader service
     * 
     * @return DocumentUploader
     */
    public function get_uploader(): DocumentUploader {
        if (null === $this->uploader) {
            $this->uploader = new DocumentUploader($this->config);
        }
        return $this->uploader;
    }
    
    /**
     * Get the admin UI manager service
     * 
     * @return AdminUIManager
     */
    public function get_admin_ui(): AdminUIManager {
        if (null === $this->admin_ui) {
            $this->admin_ui = new AdminUIManager(
                $this->config,
                $this->get_uploader(),
                $this->get_metadata_manager()
            );
        }
        return $this->admin_ui;
    }
    
    /**
     * Get the REST API controller service
     * 
     * @return RestApiController
     */
    public function get_rest_api(): RestApiController {
        if (null === $this->rest_api) {
            $this->rest_api = new RestApiController(
                $this->config,
                $this->get_uploader(),
                $this->get_metadata_manager()
            );
        }
        return $this->rest_api;
    }
    
    /**
     * Get the metadata manager service
     * 
     * @return DocumentMetadataManager
     */
    public function get_metadata_manager(): DocumentMetadataManager {
        if (null === $this->metadata_manager) {
            $this->metadata_manager = new DocumentMetadataManager($this->config);
        }
        return $this->metadata_manager;
    }
} 