<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentUploader;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\AdminUIManager;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\AjaxHandler;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentMetadataManager;

/**
 * DocumentManager - Core Orchestrator Class
 *
 * This class serves as the central coordinator and service container for the
 * Document Manager system. It implements several architectural patterns:
 *
 * 1. Facade Pattern: Provides a simplified interface to the complex subsystem
 *    of document management services and components.
 *
 * 2. Service Container: Acts as a registry for all service instances, managing
 *    their lifecycle and dependencies.
 *
 * 3. Lazy Loading: Services are instantiated only when needed, improving
 *    performance and resource usage.
 *
 * 4. Plugin Integration: Connects the Document Manager system to WordPress
 *    through hooks, filters, and actions.
 *
 * The DocumentManager initializes the plugin, coordinates service interactions,
 * and provides organized access to the various specialized components that make
 * up the document management system.
 */
class DocumentManager {
    /**
     * Security nonce key for document operations
     *
     * Used to generate and verify nonces for document operations
     * to prevent CSRF attacks.
     */
    private const NONCE_KEY = 'document_upload_nonce';

    /**
     * WordPress custom post type name for documents
     *
     * Defines the post type identifier used throughout the system
     * for querying and storing documents.
     */
    private const POST_TYPE = 'document';

    /**
     * Configuration service
     *
     * Central configuration provider that supplies settings
     * to all other services in the system.
     *
     * @var DocumentManagerConfig
     */
    private DocumentManagerConfig $config;

    /**
     * Document post type service
     *
     * Handles registration and configuration of the custom post type.
     * Loaded on demand through lazy loading.
     *
     * @var DocumentPostType|null
     */
    private ?DocumentPostType $post_type = null;

    /**
     * Document uploader service
     *
     * Handles file uploads and document creation.
     * Loaded on demand through lazy loading.
     *
     * @var DocumentUploader|null
     */
    private ?DocumentUploader $uploader = null;

    /**
     * Admin UI manager service
     *
     * Handles admin interface rendering and asset management.
     * Loaded on demand through lazy loading.
     *
     * @var AdminUIManager|null
     */
    private ?AdminUIManager $admin_ui = null;

    /**
     * AJAX handler service
     *
     * Processes AJAX requests from the frontend.
     * Loaded on demand through lazy loading.
     *
     * @var AjaxHandler|null
     */
    private ?AjaxHandler $ajax_handler = null;

    /**
     * Document metadata manager service
     *
     * Handles document metadata operations and caching.
     * Loaded on demand through lazy loading.
     *
     * @var DocumentMetadataManager|null
     */
    private ?DocumentMetadataManager $metadata_manager = null;

    /**
     * Constructor
     *
     * Initializes the Document Manager system with optional configuration override.
     * Immediately registers WordPress hooks to integrate with the CMS.
     *
     * The optional config parameter allows for dependency injection during testing
     * or for custom configuration scenarios.
     *
     * @param DocumentManagerConfig|null $config Optional config instance.
     */
    public function __construct( DocumentManagerConfig $config = null ) {
        // Initialize the configuration service, using the provided config or creating a new one.
        $this->config = $config ? $config : new DocumentManagerConfig();

        // Register all WordPress integration points.
        $this->register();
    }

    /**
     * Register WordPress hooks and filters
     *
     * This is the primary integration point with WordPress, registering all hooks
     * necessary for the Document Manager to function. It follows WordPress
     * plugin architecture best practices by:
     *
     * - Using action hooks for initialization and setup
     * - Delegating specialized functionality to appropriate services
     * - Maintaining clean separation between WordPress and business logic
     * - Organizing related hooks by functionality
     *
     * @return void
     */
    public function register(): void {
        // Core WordPress integration points.
        add_action( 'init', [ $this, 'register_post_types' ] );
        add_action( 'admin_menu', [ $this, 'register_admin_menus' ] );
        add_action( 'admin_enqueue_scripts', [ $this->get_admin_ui(), 'enqueue_admin_scripts' ] );

        // Cache management integration through WordPress actions.
        add_action( 'bcgov_document_manager_document_uploaded', [ $this->get_metadata_manager(), 'clearCache' ] );

        // Register subcomponents.
        $this->register_ajax_handlers();
        $this->register_shortcodes();
        $this->register_filters();
    }

    /**
     * Register admin menus and submenus
     *
     * Creates the WordPress admin menu structure for the Document Manager.
     * Delegates the actual menu creation to the AdminUIManager service,
     * which handles the presentation aspects.
     *
     * @return void
     */
    public function register_admin_menus(): void {
        $this->get_admin_ui()->add_documents_menu();
        $this->get_admin_ui()->add_metadata_settings_submenu();
    }

    /**
     * Register AJAX handlers
     *
     * Connects the Document Manager's AJAX endpoints to WordPress's
     * admin-ajax.php system. Each endpoint is mapped to a specific
     * method in the AjaxHandler service.
     *
     * Security considerations:
     * - All admin endpoints require authentication
     * - Public-facing endpoints use the unauthorized handler
     * - Each handler has internal security checks
     *
     * @return void
     */
    private function register_ajax_handlers(): void {
        $ajax = $this->get_ajax_handler();

        // Document operations AJAX endpoints.
        add_action( 'wp_ajax_upload_document', [ $ajax, 'handle_document_upload' ] );
        add_action( 'wp_ajax_nopriv_upload_document', [ $ajax, 'handle_unauthorized_access' ] );
        add_action( 'wp_ajax_save_document_metadata', [ $ajax, 'save_document_metadata' ] );
        add_action( 'wp_ajax_delete_document', [ $ajax, 'delete_document' ] );

        // Metadata settings AJAX endpoints.
        add_action( 'wp_ajax_save_metadata_settings', [ $ajax, 'save_metadata_settings' ] );
        add_action( 'wp_ajax_delete_metadata', [ $ajax, 'delete_metadata' ] );

        // Bulk operations AJAX endpoint.
        add_action( 'wp_ajax_save_bulk_edit', [ $ajax, 'save_bulk_edit' ] );
    }

    /**
     * Get the PostType service
     *
     * Implements lazy loading pattern to instantiate the service
     * only when needed. This improves performance by avoiding
     * unnecessary object creation.
     *
     * @return DocumentPostType
     */
    public function get_post_type(): DocumentPostType {
        // Lazy loading: Only create the service if not already instantiated.
        if ( null === $this->post_type ) {
            $this->post_type = new DocumentPostType( $this->config );
        }

        return $this->post_type;
    }

    /**
     * Get the Uploader service
     *
     * Implements lazy loading pattern to instantiate the service
     * only when needed. This service handles file uploads and
     * document creation.
     *
     * @return DocumentUploader
     */
    public function get_uploader(): DocumentUploader {
        // Lazy loading: Only create the service if not already instantiated.
        if ( null === $this->uploader ) {
            $this->uploader = new DocumentUploader( $this->config );
        }

        return $this->uploader;
    }

    /**
     * Get the MetadataManager service
     *
     * Implements lazy loading pattern to instantiate the service
     * only when needed. This service handles all document metadata
     * operations and caching strategies.
     *
     * @return DocumentMetadataManager
     */
    public function get_metadata_manager(): DocumentMetadataManager {
        // Lazy loading: Only create the service if not already instantiated.
        if ( null === $this->metadata_manager ) {
            $this->metadata_manager = new DocumentMetadataManager( $this->config );
        }

        return $this->metadata_manager;
    }

    /**
     * Get the AdminUI service
     *
     * Implements lazy loading pattern to instantiate the service
     * only when needed. This service handles the admin interface
     * rendering and asset management.
     *
     * Note that this service has dependencies on other services,
     * demonstrating the dependency injection pattern in action.
     *
     * @return AdminUIManager
     */
    public function get_admin_ui(): AdminUIManager {
        // Lazy loading: Only create the service if not already instantiated.
        if ( null === $this->admin_ui ) {
            // Dependency injection: AdminUI requires uploader and metadata manager.
            $this->admin_ui = new AdminUIManager(
                $this->config,
                $this->get_uploader(),
                $this->get_metadata_manager()
            );
        }

        return $this->admin_ui;
    }

    /**
     * Get the AjaxHandler service
     *
     * Implements lazy loading pattern to instantiate the service
     * only when needed. This service processes all AJAX requests
     * from the frontend JavaScript.
     *
     * Like AdminUI, this service demonstrates dependency injection
     * by receiving other required services in its constructor.
     *
     * @return AjaxHandler
     */
    public function get_ajax_handler(): AjaxHandler {
        // Lazy loading: Only create the service if not already instantiated.
        if ( null === $this->ajax_handler ) {
            // Dependency injection: AjaxHandler requires uploader and metadata manager.
            $this->ajax_handler = new AjaxHandler(
                $this->config,
                $this->get_uploader(),
                $this->get_metadata_manager()
            );
        }

        return $this->ajax_handler;
    }

    /**
     * Register Document post type
     *
     * Integration point for WordPress post type registration.
     * Delegates to the PostType service to handle the actual
     * registration details.
     *
     * @return void
     */
    public function register_post_types(): void {
        $this->get_post_type()->register();
    }

    /**
     * Register shortcodes if any
     *
     * Placeholder for future shortcode registration.
     * Currently no shortcodes are implemented, but this
     * provides the extension point for adding them.
     *
     * @return void
     */
    public function register_shortcodes(): void {
        // No shortcodes implemented yet.
        // Future shortcodes might include:
        // - [document_list] - to display documents on the frontend.
        // - [document_search] - to add a document search interface.
        // - [document_upload] - to allow frontend uploads.
    }

    /**
     * Register filters if any
     *
     * Placeholder for future WordPress filter registration.
     * Currently no custom filters are implemented, but this
     * provides the extension point for adding them.
     *
     * @return void
     */
    public function register_filters(): void {
        // No filters implemented yet.
        // Future filters might include:
        // - Content filters for document display
        // - Search result modifications for documents.
        // - Permission/capability filters for document access.
    }
}
