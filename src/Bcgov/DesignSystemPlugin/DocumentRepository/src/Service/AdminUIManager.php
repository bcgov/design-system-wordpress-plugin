<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository\src\Service;

use Bcgov\DesignSystemPlugin\DocumentRepository\src\Config\RepositoryConfig;

/**
 * AdminUIManager - Admin UI Integration
 *
 * This service handles all aspects of the WordPress admin UI integration,
 * including menus, asset loading, and React app initialization.
 */
class AdminUIManager {
    /**
     * Configuration service.
     *
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;

    /**
     * Document uploader service.
     *
     * @var DocumentUploader
     */
    private DocumentUploader $uploader;

    /**
     * Metadata manager service.
     *
     * @var DocumentMetadataManager
     */
    private DocumentMetadataManager $metadata_manager;

    /**
     * Constructor.
     *
     * @param RepositoryConfig        $config Configuration service.
     * @param DocumentUploader        $uploader Document uploader service.
     * @param DocumentMetadataManager $metadata_manager Metadata manager service.
     */
    public function __construct(
        RepositoryConfig $config,
        DocumentUploader $uploader,
        DocumentMetadataManager $metadata_manager
    ) {
        $this->config           = $config;
        $this->uploader         = $uploader;
        $this->metadata_manager = $metadata_manager;
    }

    /**
     * Add the document repository menu to the WordPress admin.
     */
    public function add_repository_menu(): void {
        add_menu_page(
            'Document Repository',
            'Document Repository',
            $this->config->get_capability(),
            $this->config->get( 'menu_slug' ),
            [ $this, 'render_repository_page' ],
            $this->config->get( 'menu_icon' ),
            $this->config->get( 'menu_position' )
        );
    }

    /**
     * Add the metadata settings submenu.
     */
    public function add_metadata_settings_submenu(): void {
        add_submenu_page(
            $this->config->get( 'menu_slug' ),
            'Metadata Settings',
            'Metadata Settings',
            $this->config->get_capability(),
            $this->config->get( 'metadata_slug' ),
            [ $this, 'render_metadata_settings_page' ]
        );
    }

    /**
     * Enqueue admin scripts and styles.
     *
     * @param string $hook Current admin page hook.
     */
    public function enqueue_admin_scripts( string $hook ): void {
        // Only load on our plugin pages.
        $valid_hooks = [
            'toplevel_page_' . $this->config->get( 'menu_slug' ),
            'document-repository_page_' . $this->config->get( 'metadata_slug' ),
        ];

        if ( ! in_array( $hook, $valid_hooks, true ) ) {
            return;
        }

        // Register and enqueue scripts.
        $this->register_admin_scripts();

        // Load the appropriate script for the current page.
        if ( 'toplevel_page_' . $this->config->get( 'menu_slug' ) === $hook ) {
            wp_enqueue_script( 'dswp-document-repository-app' );
        } else {
            wp_enqueue_script( 'dswp-document-repository-metadata-app' );
        }

        // Always load the main styles.
        wp_enqueue_style( $this->config->get( 'css_handle' ) );

        // Localize script with data.
        $this->localize_scripts( $hook );
    }

    /**
     * Register all admin scripts and styles.
     */
    private function register_admin_scripts(): void {
        // Get the plugin root directory URL using WordPress constants.
        $plugin_dir = WP_PLUGIN_DIR . '/design-system-wordpress-plugin';
        $plugin_url = WP_PLUGIN_URL . '/design-system-wordpress-plugin';
        $build_path = $plugin_dir . '/src/Bcgov/DesignSystemPlugin/DocumentRepository/build';

        // Get version from file modification time, or use fallback if file doesn't exist.
        $js_file = $build_path . '/document-repository.js';
        $version = file_exists( $js_file ) ? filemtime( $js_file ) : time();

        // Add nonce to script data.
        $script_data = [
            'nonce'        => wp_create_nonce( 'wp_rest' ),
            'apiRoot'      => esc_url_raw( rest_url() ),
            'apiNamespace' => $this->config->get_api_namespace(),
        ];

        // Main app bundle.
        wp_register_script(
            'dswp-document-repository-app',
            $plugin_url . '/src/Bcgov/DesignSystemPlugin/DocumentRepository/build/document-repository.js',
            [ 'wp-element', 'wp-api-fetch', 'wp-components', 'wp-i18n' ],
            $version,
            true
        );
        wp_add_inline_script(
            'dswp-document-repository-app',
            'window.documentRepositorySettings = ' . wp_json_encode( $script_data ) . ';',
            'before'
        );

        // Metadata settings app bundle.
        wp_register_script(
            'dswp-document-repository-metadata-app',
            $plugin_url . '/src/Bcgov/DesignSystemPlugin/DocumentRepository/build/metadata-settings.js',
            [ 'wp-element', 'wp-api-fetch', 'wp-components', 'wp-i18n' ],
            $version,
            true
        );

        // Styles.
        wp_register_style(
            $this->config->get( 'css_handle' ),
            $plugin_url . '/src/Bcgov/DesignSystemPlugin/DocumentRepository/build/document-repository.css',
            [ 'wp-components' ],
            $version
        );
    }

    /**
     * Localize scripts with data.
     *
     * @param string $hook Current admin page hook.
     */
    public function localize_scripts( string $hook ): void {
        $data = [
            'apiRoot'           => esc_url_raw( rest_url() ),
            'apiNamespace'      => $this->config->get_api_namespace(),
            'nonce'             => wp_create_nonce( 'wp_rest' ),
            'postType'          => $this->config->get_post_type(),
            'perPage'           => $this->config->get( 'per_page' ),
            'maxFileSize'       => $this->config->get( 'max_file_size' ),
            'allowedMimeTypes'  => $this->config->get( 'allowed_mime_types' ),
            'userCapability'    => $this->config->get_capability(),
            'hasEditCapability' => current_user_can( $this->config->get_capability() ),
            'userID'            => get_current_user_id(),
        ];

        // Get the current user role.
        $user             = wp_get_current_user();
        $data['userRole'] = ! empty( $user->roles ) ? $user->roles[0] : '';

        // Add page-specific data.
        if ( 'toplevel_page_' . $this->config->get( 'menu_slug' ) === $hook ) {
            // For main repository page.
            $data['metadataFields'] = $this->metadata_manager->get_metadata_fields();
        } else {
            // For metadata settings page.
            $data['currentFields'] = $this->metadata_manager->get_metadata_fields();
            $data['fieldTypes']    = [
                'text'   => 'Text',
                'select' => 'Select',
                'date'   => 'Date',
            ];
        }

        wp_localize_script(
            'toplevel_page_' . $this->config->get( 'menu_slug' ) === $hook ? 'dswp-document-repository-app' : 'dswp-document-repository-metadata-app',
            'documentRepositorySettings',
            $data
        );
    }

    /**
     * Render the main repository page.
     */
    public function render_repository_page(): void {
        // We just need to output the container for our React app to mount to.
        echo '<div class="wrap">';
        echo '<h1>Document Repository</h1>';
        echo '<div id="dswp-document-repository-app"></div>';
        echo '</div>';
    }

    /**
     * Render the metadata settings page.
     */
    public function render_metadata_settings_page(): void {
        // We just need to output the container for our React app to mount to.
        echo '<div class="wrap">';
        echo '<h1>Metadata Settings</h1>';
        echo '<div id="dswp-document-repository-metadata-app"></div>';
        echo '</div>';
    }
}
