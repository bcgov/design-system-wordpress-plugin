<?php

namespace Bcgov\DesignSystemPlugin;

class InPageNav {
    private $version;

    public function __construct() {
        // Get plugin version from main plugin file
        $plugin_data = get_file_data(WP_PLUGIN_DIR . '/design-system-wordpress-plugin/design-system-wordpress-plugin.php', [
            'Version' => 'Version'
        ]);
        $this->version = $plugin_data['Version'] ?: '1.0.0';
        
        $this->init();
    }

    public function init() {
        add_action('init', [$this, 'register_meta']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
    }

    public function register_meta() {
        register_post_meta('page', 'show_inpage_nav', [
            'show_in_rest' => true,
            'single' => true,
            'type' => 'boolean',
            'default' => false,
            'auth_callback' => function() {
                return current_user_can('edit_posts');
            }
        ]);
    }

    public function enqueue_assets() {
        if (!is_page()) return;

        $show_nav = get_post_meta(get_the_ID(), 'show_inpage_nav', true);
        if (!$show_nav) return;

        // Enqueue styles
        wp_enqueue_style(
            'dswp-in-page-nav',
            plugin_dir_url(__FILE__) . '../../../dist/in-page-nav.css',
            [],
            $this->version
        );

        // Enqueue script
        wp_enqueue_script(
            'dswp-in-page-nav',
            plugin_dir_url(__FILE__) . '../../../dist/in-page-nav.js',
            [],
            $this->version,
            true
        );

        // Pass settings to JavaScript
        wp_localize_script('dswp-in-page-nav', 'dswpInPageNav', [
            'options' => [
                'mobile_breakpoint' => 1800,
                'scroll_offset' => 60,
                'heading_selectors' => ['h2', 'h3']
            ]
        ]);
    }

    public function enqueue_editor_assets() {
        $asset_file = include plugin_dir_path(__FILE__) . '../../../dist/in-page-nav-editor.asset.php';
        
        wp_enqueue_script(
            'dswp-in-page-nav-editor',
            plugin_dir_url(__FILE__) . '../../../dist/in-page-nav-editor.js',
            array_merge(
                $asset_file['dependencies'],
                ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data']
            ),
            $this->version,
            true
        );
    }
} 