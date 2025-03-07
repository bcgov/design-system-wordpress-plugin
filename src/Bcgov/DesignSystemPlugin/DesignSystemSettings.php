<?php

namespace Bcgov\DesignSystemPlugin;

/**
 * Class DesignSystemSettings
 *
 * This class handles the main Design System settings page in the WordPress admin.
 * It provides the base menu that other Design System components can add their
 * submenu pages to.
 *
 * @package Bcgov\DesignSystemPlugin
 */
class DesignSystemSettings {

    /**
     * Initialize the class by registering WordPress hooks.
     *
     * @return void
     */
    public function init() {
        add_action( 'admin_menu', [ $this, 'add_menu' ] );
    }

    /**
     * Add the main Design System menu page.
     *
     * @return void
     */
    public function add_menu() {
        add_menu_page(
            __( 'Design System', 'dswp' ),
            __( 'Design System', 'dswp' ),
            'manage_options',
            'dswp-admin-menu',
            [ $this, 'render_settings_page' ],
            'dashicons-admin-generic',
            6
        );
    }

    /**
     * Render the main Design System settings page.
     *
     * @return void
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Design System Settings', 'dswp' ); ?></h1>
            <p><?php esc_html_e( 'Welcome to the BC Government Design System settings. Use the submenu items to configure various components of the design system.', 'dswp' ); ?></p>
        </div>
        <?php
    }
}
