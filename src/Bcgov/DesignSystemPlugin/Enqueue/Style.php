<?php

namespace Bcgov\DesignSystemPlugin\Enqueue;

/**
 * Class Style
 *
 * This class handles the enqueueing of the design system's global CSS stylesheets
 * for both the frontend and the admin areas of the WordPress site. It ensures that
 * the appropriate stylesheet is loaded by WordPress and provides a mechanism for
 * versioning the stylesheet based on its file modification time.
 *
 * @package Bcgov\DesignSystemPlugin\Enqueue
 * @since 1.0.0
 */
class Style {

    /**
     * Enqueues the design system CSS stylesheet on the frontend of the WordPress site.
     *
     * This method retrieves the CSS file from the plugin's `dist` directory, determines
     * its file modification time to set a proper cache-busting version, and then enqueues
     * the stylesheet for use in the frontend of the site.
     *
     * It also handles the enqueuing for the admin area.
     *
     * @since 1.0.0
     */
    public function enqueue_global_styles() {
        // Define the path to the CSS file.
        $css_file = plugin_dir_path( __FILE__ ) . '../../../../dist/index.css';

        // Get the file modification time to use as the version for cache busting.
        $version = filemtime( $css_file );

        // Enqueue the stylesheet with a version parameter to prevent caching issues.
        wp_enqueue_style( 'design-system-plugin-styles', plugin_dir_url( __FILE__ ) . '../../../../dist/index.css', array(), $version );
    }

    /**
     * Initializes the class by hooking into WordPress actions to enqueue the styles.
     *
     * This method registers the `enqueue_global_styles` method to be called during the
     * `wp_enqueue_scripts` action (for frontend) and the `admin_enqueue_scripts` action
     * (for the admin area).
     *
     * @since 1.0.0
     */
    public function init() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_global_styles' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_global_styles' ] );
    }
}
