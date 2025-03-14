<?php

namespace Bcgov\DesignSystemPlugin\InPageNav;

/**
 * Handles style enqueuing for the In-Page Navigation feature
 */
class Style {
    /**
     * Initialize hooks for style enqueuing
     */
    public function init() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_frontend_styles' ] );
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_styles' ] );
    }

    /**
     * Enqueues frontend styles for in-page navigation
     */
    public function enqueue_frontend_styles() {
        if ( ! is_page() ) {
            return;
        }

        $show_nav = get_post_meta( get_the_ID(), 'show_inpage_nav', true );
        if ( ! $show_nav ) {
            return;
        }

        $asset_file = include plugin_dir_path( __FILE__ ) . '../../../../dist/in-page-nav.asset.php';

        wp_enqueue_style(
            'in-page-nav-styles',
            plugin_dir_url( __FILE__ ) . '../../../../dist/in-page-nav.css',
            array(),
            $asset_file['version']
        );
    }

    /**
     * Enqueues editor styles for in-page navigation
     */
    public function enqueue_editor_styles() {
        $asset_file = include plugin_dir_path( __FILE__ ) . '../../../../dist/in-page-nav.asset.php';

        wp_enqueue_style(
            'in-page-nav-styles',
            plugin_dir_url( __FILE__ ) . '../../../../dist/in-page-nav.css',
            array(),
            $asset_file['version']
        );
    }
}
