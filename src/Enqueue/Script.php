<?php

namespace Bcgov\DesignSystemPlugin\Enqueue;

/**
 * Class Script
 *
 * This class handles the enqueueing of the design system's global js scripts
 * for both the frontend and the admin areas of the WordPress site.
 * the appropriate script is loaded by WordPress and provides a mechanism for
 * versioning the script based on its file modification time.
 *
 * @package Bcgov\DesignSystemPlugin\Enqueue
 * @since 1.0.0
 */
class Script {

    /**
     * Enqueues the design system Java Script on the frontend of the WordPress site.
     *
     * This method retrieves the Java Script file from the plugin's `dist` directory, determines
     * its file modification time to set a proper cache-busting version, and then enqueues
     * the  for use in the frontend of the site.
     *
     * It also handles the enqueuing for the admin area.
     *
     * @since 1.0.0
     */
    public function enqueue_global_scripts() {
        // Define the path to the JS file.
        $_file = plugin_dir_path( dirname( dirname( __FILE__ ) ) ) . 'dist/index.js';

        // Get the file modification time to use as the version for cache busting.
        $version = filemtime( $_file );

        // Enqueue the  with a version parameter to prevent caching issues.
        wp_enqueue_script( 'design-system-plugin-scripts', plugin_dir_url( dirname( dirname( __FILE__ ) ) ) . 'dist/index.js', array(), $version, true );    }

    /**
     * Initializes the class by hooking into WordPress actions to enqueue the scripts.
     *
     * This method registers the `enqueue_global_scripts` method to be called during the
     * `wp_enqueue_scripts` action (for frontend) and the `admin_enqueue_scripts` action
     * (for the admin area).
     *
     * @since 1.0.0
     */
    public function init() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_global_scripts' ] );
        add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_global_scripts' ] );
    }
}
