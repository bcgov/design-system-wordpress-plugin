<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

/**
 * Class Settings
 *
 * This class handles the settings for the Document Repository feature.
 *
 * @package Bcgov\DesignSystemPlugin\DocumentRepository
 */
class Settings {
    /**
     * The option name used to store the setting in WordPress options table.
     */
    const OPTION_NAME = 'dswp_document_repository_enabled';

    /**
     * Initialize the class by registering WordPress hooks.
     *
     * @return void
     */
    public function init() {
        add_action( 'admin_menu', [ $this, 'add_menu' ], 20 );
        add_action( 'admin_init', [ $this, 'register_settings' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'add_toggle_styles' ] );
    }

    /**
     * Add CSS styles for the toggle switch.
     *
     * @param string $hook The current admin page hook suffix.
     * @return void
     */
    public function add_toggle_styles( $hook ) {
        // Check if we're on our settings page.
        if ( 'design-system_page_dswp-document-repository-settings' !== $hook ) {
            return;
        }

        wp_enqueue_style(
            'dswp-document-repository-toggle',
            plugin_dir_url( __FILE__ ) . 'assets/scss/styles.css',
            [],
            '1.0.0'
        );
    }

    /**
     * Register the settings for the document repository feature.
     *
     * @return void
     */
    public function register_settings() {
        register_setting(
            'dswp_options_group',
            self::OPTION_NAME,
            [
                'type'              => 'string',
                'default'           => '0',
                'show_in_rest'      => true,
                'sanitize_callback' => function ( $value ) {
                    return $value ? '1' : '0';
                },
            ]
        );
    }

    /**
     * Add the submenu page to the Design System menu.
     *
     * @return void
     */
    public function add_menu() {
        add_submenu_page(
            'dswp-admin-menu',
            __( 'Document Repository Settings', 'dswp' ),
            __( 'Document Repository', 'dswp' ),
            'manage_options',
            'dswp-document-repository-settings',
            [ $this, 'render_settings_page' ]
        );
    }

    /**
     * Render the settings page HTML.
     *
     * @return void
     */
    public function render_settings_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        // Include the template file.
        require_once __DIR__ . '/View/settings.php';
    }
}
