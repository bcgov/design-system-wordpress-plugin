<?php

namespace Bcgov\DesignSystemPlugin\InPageNav;

/**
 * Handles script enqueuing for the In-Page Navigation feature
 */
class Script {
    /**
     * Initialize hooks for script enqueuing
     */
    public function init() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_scripts' ] );
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_scripts' ] );
    }

    /**
     * Enqueues frontend scripts for in-page navigation
     */
    public function enqueue_frontend_scripts() {
        if ( ! is_page() ) {
            return;
        }

        $show_nav = get_post_meta( get_the_ID(), 'show_inpage_nav', true );
        if ( ! $show_nav ) {
            return;
        }

        $_file      = plugin_dir_path( __FILE__ ) . '../../../../dist/in-page-nav.asset.php';
        $asset_file = include $_file;

        wp_enqueue_script(
            'in-page-nav',
            plugin_dir_url( __FILE__ ) . '../../../../dist/in-page-nav.js',
            $asset_file['dependencies'] ?? [],
            $asset_file['version'] ?? '1.0.0',
            true
        );
    }

    /**
     * Enqueues editor scripts for in-page navigation
     */
    public function enqueue_editor_scripts() {
        $_file      = plugin_dir_path( __FILE__ ) . '../../../../dist/in-page-nav-page-settings.asset.php';
        $asset_file = include $_file;

        wp_enqueue_script(
            'inpage-nav-editor',
            plugin_dir_url( __FILE__ ) . '../../../../dist/in-page-nav-page-settings.js',
            $asset_file['dependencies'] ?? [],
            $asset_file['version'] ?? '1.0.0',
            true
        );
    }
}
