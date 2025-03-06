<?php

namespace Bcgov\DesignSystemPlugin;

/**
 * Class AutoAnchorSettings
 *
 * This class handles the settings for automatically generating anchor IDs for heading blocks.
 *
 * @package Bcgov\DesignSystemPlugin
 */
class AutoAnchorSettings {
    /**
     * The option name used to store the setting in WordPress options table.
     */
    const OPTION_NAME = 'dswp_auto_anchor_enabled';

    /**
     * Initialize the class by registering WordPress hooks.
     *
     * @return void
     */
    public function init() {
        add_action('admin_menu', [$this, 'add_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('rest_api_init', [$this, 'register_rest_field']);
        add_action('admin_head', [$this, 'add_toggle_styles']);
    }

    /**
     * Add CSS styles for the toggle switch.
     *
     * @return void
     */
    public function add_toggle_styles() {
        // Only add styles on our settings page
        $screen = get_current_screen();
        if ($screen && $screen->id === 'design-system_page_dswp-auto-anchor-menu') {
            ?>
            <style>
                .dswp-toggle-switch {
                    position: relative;
                    display: inline-block;
                    width: 40px;  /* Reduced from 60px */
                    height: 22px; /* Reduced from 34px */
                    vertical-align: middle;
                }
                
                .dswp-toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                
                .dswp-toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: #ccc;
                    transition: .3s;
                    border-radius: 22px; /* Adjusted for smaller size */
                }
                
                .dswp-toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px; /* Reduced from 26px */
                    width: 16px;  /* Reduced from 26px */
                    left: 3px;    /* Adjusted position */
                    bottom: 3px;  /* Adjusted position */
                    background-color: white;
                    transition: .3s;
                    border-radius: 50%;
                }
                
                input:checked + .dswp-toggle-slider {
                    background-color: #2271b1;
                }
                
                input:focus + .dswp-toggle-slider {
                    box-shadow: 0 0 1px #2271b1;
                }
                
                input:checked + .dswp-toggle-slider:before {
                    transform: translateX(18px); /* Adjusted for smaller size */
                }
                
                .dswp-toggle-label {
                    margin-left: 10px;
                    font-weight: normal;
                    vertical-align: middle;
                }
            </style>
            <?php
        }
    }

    /**
     * Register the REST API field for the auto anchor setting.
     *
     * @return void
     */
    public function register_rest_field() {
        register_rest_field('site', self::OPTION_NAME, [
            'get_callback' => function () {
                return get_option(self::OPTION_NAME, "1");
            },
            'schema' => [
                'type' => 'string',
                'description' => 'Auto anchor heading setting'
            ]
        ]);
    }

    /**
     * Register the settings for the auto anchor feature.
     *
     * @return void
     */
    public function register_settings() {
        register_setting(
            'dswp_options_group',
            self::OPTION_NAME,
            [
                'type' => 'string',
                'default' => "1",
                'show_in_rest' => true,
                'sanitize_callback' => function($value) {
                    return $value ? "1" : "0";
                }
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
            'dswp-admin-menu',                    // Parent slug
            __('Auto Anchor Settings', 'dswp'),   // Page title
            __('Auto Anchor', 'dswp'),           // Menu title
            'manage_options',                     // Capability required
            'dswp-auto-anchor-menu',             // Menu slug
            [$this, 'render_settings_page']      // Callback function
        );
    }

    /**
     * Render the settings page HTML.
     *
     * @return void
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Auto Anchor Settings', 'dswp'); ?></h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('dswp_options_group');
                $value = get_option(self::OPTION_NAME, "1");
                ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php esc_html_e('Auto Anchor Headings', 'dswp'); ?></th>
                        <td>
                            <div style="display: flex; align-items: center;">
                                <label class="dswp-toggle-switch">
                                    <input type="checkbox" 
                                           name="<?php echo esc_attr(self::OPTION_NAME); ?>" 
                                           value="1" 
                                           <?php checked("1", $value); ?>>
                                    <span class="dswp-toggle-slider"></span>
                                </label>
                                <span class="dswp-toggle-label">
                                    <?php esc_html_e('Automatically generate anchor IDs for headings', 'dswp'); ?>
                                </span>
                            </div>
                            <p class="description">
                                <?php esc_html_e('When enabled, this will automatically generate anchor IDs for heading blocks based on their content.', 'dswp'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
        </div>
        <?php
    }
}