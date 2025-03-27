<?php

namespace Bcgov\DesignSystemPlugin\InPageNav;

class Settings {
    
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

        // Get plugin root directory
        $plugin_dir = WP_PLUGIN_DIR . '/design-system-wordpress-plugin';
        $plugin_url = plugins_url('', $plugin_dir . '/design-system-wordpress-plugin.php');

        // Enqueue styles
        wp_enqueue_style(
            'dswp-in-page-nav',
            $plugin_url . '/dist/in-page-nav.css',
            [],
            $this->version
        );

        // Enqueue script
        wp_enqueue_script(
            'dswp-in-page-nav',
            $plugin_url . '/dist/in-page-nav.js',
            ['wp-element'],
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
        // Get the main plugin file path/url (similar to auto-anchor script)
        $script_path = plugin_dir_path(dirname(dirname(dirname(__DIR__)))) . 'dist/in-page-nav-editor.js';
        $script_url = plugin_dir_url(dirname(dirname(dirname(__DIR__)))) . 'dist/in-page-nav-editor.js';

        $asset_file_path = plugin_dir_path(dirname(dirname(dirname(__DIR__)))) . 'dist/in-page-nav-editor.asset.php';
        
        // Default dependencies if asset file is missing
        $asset_file = file_exists($asset_file_path) 
            ? include $asset_file_path
            : [
                'dependencies' => ['wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data'],
                'version' => $this->version
            ];

        if (file_exists($script_path)) {
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