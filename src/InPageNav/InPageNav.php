<?php

namespace Bcgov\DesignSystemPlugin\InPageNav;

/**
 * In-Page Navigation Handler Class
 *
 * Manages the WordPress integration of the in-page navigation feature, including:
 * - Asset loading (CSS/JS)
 * - Meta field registration
 * - Editor integration
 * - Configuration options
 *
 * @package src\InPageNav
 * @since 1.0.0
 */
class InPageNav {

    /**
     * Plugin version number.
     *
     * @var string
     */
    private $version;

    /**
     * Initialize the in-page navigation functionality.
     */
    public function __construct() {
        // Get plugin version from main plugin file.

        $plugin_dir  = plugin_dir_path( dirname( __DIR__ ) ) . 'design-system-wordpress-plugin.php';
        $plugin_data = get_file_data(
            $plugin_dir,
            [
                'Version' => 'Version',
            ]
        );

        $this->version = isset( $plugin_data['Version'] ) ? $plugin_data['Version'] : '1.0.0';

        $this->init();
    }

    /**
     * Register WordPress hooks and actions.
     *
     * @return void
     */
    public function init() {
        add_action( 'init', [ $this, 'register_meta' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_assets' ] );
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_editor_assets' ] );
    }

    /**
     * Register the meta field for enabling/disabling in-page navigation.
     *
     * Creates a boolean meta field that can be toggled in the WordPress REST API
     * and is accessible in the block editor.
     *
     * @return void
     */
    public function register_meta() {
        register_post_meta(
            'page',
            'show_inpage_nav',
            [
				'show_in_rest'  => true,
				'single'        => true,
				'type'          => 'boolean',
				'default'       => false,
				'auth_callback' => function () {
					return current_user_can( 'edit_posts' );
				},
			]
        );
    }

    /**
     * Enqueue frontend assets for in-page navigation.
     *
     * Loads required CSS and JavaScript files only when in-page navigation
     * is enabled for the current page.
     *
     * @return void
     */
    public function enqueue_assets() {
        // Only load assets on single pages.
        if ( ! is_page() ) {
            return;
        }

        // Check if in-page navigation is enabled for this page.
        $show_nav = get_post_meta( get_the_ID(), 'show_inpage_nav', true );
        if ( ! $show_nav ) {
            return;
        }

        // Get the plugin root directory.
        $plugin_dir = plugin_dir_path( dirname( __DIR__ ) );
        $plugin_url = plugin_dir_url( dirname( __DIR__ ) );

        // Register and enqueue the stylesheet.
        wp_enqueue_style(
            'dswp-in-page-nav-styles',
            $plugin_url . 'dist/style-in-page-nav.css',
            array(),
            $this->version
        );

        // Register and enqueue the script.
        wp_enqueue_script(
            'dswp-in-page-nav-script',
            $plugin_url . 'dist/in-page-nav.js',
            array(),
            $this->version,
            true
        );

        		// Get page excerpt if available.
		$page_excerpt = '';
		if ( is_page() ) {
			$post = get_post();
			if ( $post && ! empty( $post->post_excerpt ) ) {
				$page_excerpt = wp_strip_all_tags( $post->post_excerpt );
			} elseif ( $post && ! empty( $post->post_content ) ) {
				// Fallback to first paragraph if no excerpt.
				$content         = wp_strip_all_tags( $post->post_content );
				$first_paragraph = strtok( $content, "\n" );
				if ( strlen( $first_paragraph ) > 20 ) {
					$page_excerpt = $first_paragraph;
				}
			}
		}

		// Pass configuration options and excerpt to JavaScript.
		wp_localize_script(
			'dswp-in-page-nav-script',
			'dswpInPageNav',
			[
				'options'      => [
					'mobile_breakpoint' => 1800,
					'scroll_offset'     => 60,
					'heading_selectors' => [ 'h2' ],
				],
				'page_excerpt' => $page_excerpt,
			]
		);
    }

    /**
     * Enqueue editor-specific assets.
     *
     * Loads the JavaScript required for the WordPress block editor interface,
     * including the toggle control for enabling/disabling in-page navigation.
     *
     * @return void
     */
    public function enqueue_editor_assets() {
        // Get the plugin root directory.
        $plugin_dir = plugin_dir_path( dirname( __DIR__ ) );
        $plugin_url = plugin_dir_url( dirname( __DIR__ ) );

        // Determine script file locations.
        $script_path     = $plugin_dir . 'dist/in-page-nav-editor.js';
        $script_url      = $plugin_url . 'dist/in-page-nav-editor.js';
        $asset_file_path = $plugin_dir . 'dist/in-page-nav-editor.asset.php';

        // Set up dependencies with fallback.
        $asset_file = file_exists( $asset_file_path )
            ? include $asset_file_path
            : [
                'dependencies' => [
                    'wp-plugins',
                    'wp-editor',
                    'wp-edit-post',
                    'wp-element',
                    'wp-components',
                    'wp-data',
                ],
                'version'      => $this->version,
            ];

        // Enqueue editor script if it exists.
        if ( file_exists( $script_path ) ) {
            wp_enqueue_script(
                'dswp-in-page-nav-editor',
                $script_url,
                $asset_file['dependencies'],
                $asset_file['version'],
                true
            );
        }
    }
}
