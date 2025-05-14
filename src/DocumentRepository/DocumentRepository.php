<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

use Bcgov\DesignSystemPlugin\DocumentRepository\RepositoryConfig;
use Bcgov\DesignSystemPlugin\DocumentRepository\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentRepository\DocumentUploader;
use Bcgov\DesignSystemPlugin\DocumentRepository\AdminUIManager;
use Bcgov\DesignSystemPlugin\DocumentRepository\RestApiController;
use Bcgov\DesignSystemPlugin\DocumentRepository\DocumentMetadataManager;

/**
 * DocumentRepository - Main Plugin Class
 *
 * This class serves as the central coordinator for the Document Repository system.
 * It manages service instantiation, WordPress integration, and overall architecture.
 */
class DocumentRepository {
    /**
     * Configuration instance.
     *
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;

    /**
     * Document post type service instance.
     *
     * @var DocumentPostType|null
     */
    private ?DocumentPostType $post_type = null;

    /**
     * Document uploader service instance.
     *
     * @var DocumentUploader|null
     */
    private ?DocumentUploader $uploader = null;

    /**
     * Admin UI manager service instance.
     *
     * @var AdminUIManager|null
     */
    private ?AdminUIManager $admin_ui = null;

    /**
     * REST API controller service instance.
     *
     * @var RestApiController|null
     */
    private ?RestApiController $rest_api = null;

    /**
     * Metadata manager service instance.
     *
     * @var DocumentMetadataManager|null
     */
    private ?DocumentMetadataManager $metadata_manager = null;

    /**
     * Constructor.
     *
     * @param RepositoryConfig|null $config Optional config instance for dependency injection.
     */
    public function __construct( RepositoryConfig $config = null ) {
        // Initialize configuration or use provided one.
        $this->config = $config ?? new RepositoryConfig();
    }

    /**
     * Initialize the plugin by registering WordPress hooks and integrations.
     *
     * @return void
     */
    public function init(): void {
        // Core WordPress integration hooks.
        add_action( 'init', [ $this, 'register_post_types' ] );
        add_action( 'rest_api_init', [ $this, 'register_rest_routes' ], 10 );
        add_action( 'admin_menu', [ $this, 'register_admin_menus' ] );
        add_action( 'admin_enqueue_scripts', [ $this->get_admin_ui(), 'enqueue_admin_scripts' ] );

        // Event listeners.
        add_action(
            'bcgov_document_repository_document_uploaded',
            [ $this->get_metadata_manager(), 'clear_cache' ]
        );

        // Migrate existing files to the new direct path structure.
        add_action( 'admin_init', [ $this, 'migrate_existing_files' ] );
    }

    /**
     * Register custom post type for documents.
     */
    public function register_post_types(): void {
        $this->get_post_type()->register();
    }

    /**
     * Log a debug message if WP_DEBUG is enabled.
     *
     * @param string $message The message to log.
     * @param string $level The log level (default: 'debug').
     * @return void
     */
    private function log( string $message, string $level = 'debug' ): void {
        // In production, we disable all logging.
        if ( defined( 'WP_ENVIRONMENT_TYPE' ) && WP_ENVIRONMENT_TYPE === 'production' ) {
            return;
        }

        if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            if ( function_exists( 'wp_debug_log' ) ) {
                wp_debug_log( $message, $level );
            } elseif ( defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
                // Fallback for older WordPress versions.
                $this->log_to_error_log( $message, $level );
            }
        }
    }

    /**
     * Log a message using WordPress's built-in logging functions.
     *
     * @param string $message The message to log.
     * @param string $level The log level.
     * @return void
     */
    private function log_to_error_log( string $message, string $level ): void {
        if ( function_exists( 'wp_debug_log' ) ) {
            wp_debug_log( $message, $level );
        } elseif ( function_exists( 'wp_log' ) ) {
            wp_log( $message, $level );
        } else {
            // If no logging functions are available, silently fail.
            // This is better than using error_log in production.
            return;
        }
    }

    /**
     * Register REST API routes.
     *
     * @return void
     */
    public function register_rest_routes(): void {
        // Add logging to help debug REST API issues.
        $this->log( 'Registering Document Repository REST API routes' );

        // Add CORS headers.
        remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
        add_filter(
            'rest_pre_serve_request',
            function ( $value ) {
                header( 'Access-Control-Allow-Origin: *' );
                header( 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' );
                header( 'Access-Control-Allow-Credentials: true' );
                header( 'Access-Control-Allow-Headers: Authorization, X-WP-Nonce, Content-Type, X-Requested-With' );

                // Handle preflight requests.
                if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
                    status_header( 200 );
                    exit();
                }

                return $value;
            }
        );

        // Log authentication info for debugging.
        if ( is_user_logged_in() ) {
            $this->log( sprintf( 'REST API - User logged in, ID: %d', get_current_user_id() ) );
            $this->log( sprintf( 'REST API - Nonce: %s', wp_create_nonce( 'wp_rest' ) ) );
        } else {
            $this->log( 'REST API - No user logged in' );
        }

        // Register the routes.
        $this->get_rest_api()->register_routes();

        // Log registered routes for debugging.
        global $wp_rest_server;
        if ( $wp_rest_server ) {
            $routes = $wp_rest_server->get_routes();
            foreach ( $routes as $route => $handlers ) {
                if ( strpos( $route, 'bcgov-document-repository' ) !== false ) {
                    $this->log( sprintf( 'Registered route: %s', $route ) );
                }
            }
        }
    }

    /**
     * Register admin menus and submenus.
     */
    public function register_admin_menus(): void {
        $this->get_admin_ui()->add_repository_menu();
        $this->get_admin_ui()->add_metadata_settings_submenu();
    }

    /**
     * Get the document post type service.
     *
     * @return DocumentPostType
     */
    public function get_post_type(): DocumentPostType {
        if ( null === $this->post_type ) {
            $this->post_type = new DocumentPostType( $this->config );
        }
        return $this->post_type;
    }

    /**
     * Get the document uploader service.
     *
     * @return DocumentUploader
     */
    public function get_uploader(): DocumentUploader {
        if ( null === $this->uploader ) {
            $this->uploader = new DocumentUploader( $this->config );
        }
        return $this->uploader;
    }

    /**
     * Get the admin UI manager service.
     *
     * @return AdminUIManager
     */
    public function get_admin_ui(): AdminUIManager {
        if ( null === $this->admin_ui ) {
            $this->admin_ui = new AdminUIManager(
                $this->config,
                $this->get_uploader(),
                $this->get_metadata_manager()
            );
        }
        return $this->admin_ui;
    }

    /**
     * Get the REST API controller service.
     *
     * @return RestApiController
     */
    public function get_rest_api(): RestApiController {
        if ( null === $this->rest_api ) {
            $this->rest_api = new RestApiController(
                $this->config,
                $this->get_uploader(),
                $this->get_metadata_manager()
            );
        }
        return $this->rest_api;
    }

    /**
     * Get the metadata manager service.
     *
     * @return DocumentMetadataManager
     */
    public function get_metadata_manager(): DocumentMetadataManager {
        if ( null === $this->metadata_manager ) {
            $this->metadata_manager = new DocumentMetadataManager( $this->config );
        }
        return $this->metadata_manager;
    }

    /**
     * Migrate existing document files to the new direct path.
     * This runs on plugin activation or update to ensure all files use the new structure.
     */
    public function migrate_existing_files() {
        // Get the target direct path.
        $wp_content_dir = WP_CONTENT_DIR;
        $direct_path    = $wp_content_dir . '/uploads/dswp-documents';

        // Create directory if it doesn't exist.
        if ( ! file_exists( $direct_path ) ) {
            wp_mkdir_p( $direct_path );
        }

        // Get all document posts.
        $post_type = $this->config->get_post_type();
        $documents = get_posts(
            [
				'post_type'      => $post_type,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			]
        );

        if ( empty( $documents ) ) {
            return;
        }

        foreach ( $documents as $document ) {
            // Get attachment ID.
            $attachment_id = get_post_meta( $document->ID, 'document_file_id', true );

            if ( ! $attachment_id ) {
                continue;
            }

            // Get attachment URL.
            $url = wp_get_attachment_url( $attachment_id );

            // Check if URL contains /sites/ pattern.
            if ( strpos( $url, '/sites/' ) !== false && strpos( $url, 'dswp-documents' ) !== false ) {
                // Extract filename.
                $filename = basename( $url );

                // Source path (multisite).
                $url_path    = wp_parse_url( $url, PHP_URL_PATH );
                $source_path = ABSPATH . ltrim( $url_path, '/' );

                // Target path (direct).
                $target_path = $direct_path . '/' . $filename;

                // Copy file if it exists.
                if ( file_exists( $source_path ) && ! file_exists( $target_path ) ) {
                    copy( $source_path, $target_path );
                }
            }
        }
    }
}
