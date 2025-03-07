<?php

namespace Bcgov\DesignSystemPlugin;

/**
 * Class NotificationBanner
 *
 * This class handles the admin menu for the Design System Plugin.
 */
class NotificationBanner {


    /**
     * Color mapping for different states of the notification banner.
     *
     * @var array
     */
    const COLOR_MAP = [
        'var(--dswp-icons-color-warning)' => 'black',
        'var(--dswp-icons-color-danger)'  => 'white',
        'var(--dswp-icons-color-success)' => 'white',
        'var(--dswp-icons-color-info)'    => 'white',
    ];

    /**
     * NotificationBanner constructor.
     */
    public function init() {
        add_action( 'admin_menu', [ $this, 'add_menu' ] );
        add_action( 'admin_init', [ $this, 'register_settings' ] );
        add_action( 'wp_head', [ $this, 'display_banner' ] );
    }

    /**
     * Adds the admin menu and submenu.
     */
    public function add_menu() {
        add_submenu_page(
            'dswp-admin-menu',
            __( 'Notification Banner', 'dswp' ),
            __( 'Notification Banner', 'dswp' ),
            'manage_options',
            'dswp-notification-menu',
            [ $this, 'render_notification_banner_page' ]
        );
    }

    /**
     * Registers settings for the notification banner.
     */
    public function register_settings() {
        register_setting( 'dswp_options_group', 'dswp_notification_banner_notification', 'wp_kses_post' );
        register_setting( 'dswp_options_group', 'dswp_notification_banner_enabled', 'sanitize_text_field' );
        register_setting( 'dswp_options_group', 'dswp_notification_banner_color' );

        add_settings_section( 'dswp_notification_menu_settings_section', __( 'Notification Banner Settings', 'dswp' ), null, 'dswp-notification-menu' );

        add_settings_field( 'banner_enabled', __( 'Enable Banner', 'dswp' ), [ $this, 'render_banner_enabled_field' ], 'dswp-notification-menu', 'dswp_notification_menu_settings_section' );
        add_settings_field( 'banner_content', __( 'Banner Content (HTML allowed)', 'dswp' ), [ $this, 'render_banner_content_field' ], 'dswp-notification-menu', 'dswp_notification_menu_settings_section' );
        add_settings_field( 'banner_color', __( 'Banner Color', 'dswp' ), [ $this, 'render_banner_color_field' ], 'dswp-notification-menu', 'dswp_notification_menu_settings_section' );
    }

    /**
     * Renders the notification banner settings page.
     */
    public function render_notification_banner_page() {
        ?>
        <div class="wrap">
            <?php settings_errors(); ?>
            <form method="post" action="options.php">
                <?php
                settings_fields( 'dswp_options_group' );
                do_settings_sections( 'dswp-notification-menu' );
                submit_button( __( 'Save Settings', 'dswp' ) );
                ?>
            </form>
    
            <h2><?php esc_html_e( 'Banner Preview', 'dswp' ); ?></h2>
            <div id="dswp-banner-preview" style="padding: 10px; text-align: center; border: 1px solid #ccc;">
                <?php
                // Fetch saved options.
                $banner_enabled       = get_option( 'dswp_notification_banner_enabled', '0' );
                $banner_color         = get_option( 'dswp_notification_banner_color', '#FFA500' );
                $notification_message = get_option( 'dswp_notification_banner_notification', '' );

                // Display the banner preview only if enabled.
                if ( '1' === $banner_enabled ) {
                    $text_color = $this->get_text_color( $banner_color ); // Get appropriate text color.
                    echo '<div style="background-color: ' . esc_attr( $banner_color ) . '; color: ' . esc_attr( $text_color ) . '; padding: 10px; text-align: center;">';
                    echo wp_kses_post( $notification_message );
                    echo '</div>';
                } else {
                    echo '<p>' . esc_html__( 'The banner is disabled. Enable it to see the preview.', 'dswp' ) . '</p>';
                }
                ?>
            </div>
        </div>
        <?php
    }

    /**
     * Renders the field to enable/disable the banner.
     */
    public function render_banner_enabled_field() {
        $banner_enabled = get_option( 'dswp_notification_banner_enabled', '0' );
		?>
        <label>
            <input type="radio" name="dswp_notification_banner_enabled" value="1" <?php checked( $banner_enabled, '1' ); ?> />
            <?php esc_html_e( 'Enable', 'dswp' ); ?>
        </label>
        <label>
            <input type="radio" name="dswp_notification_banner_enabled" value="0" <?php checked( $banner_enabled, '0' ); ?> />
            <?php esc_html_e( 'Disable', 'dswp' ); ?>
        </label>
		<?php
    }

    /**
     * Renders the field for the banner content.
     */
    public function render_banner_content_field() {
        $notification_message = get_option( 'dswp_notification_banner_notification', '' );
		?>
        <textarea name="dswp_notification_banner_notification" rows="5" cols="50"><?php echo esc_textarea( $notification_message ); ?></textarea>
        <p class="description"><?php esc_html_e( 'You can add HTML content here, such as <strong>&lt;b&gt;bold&lt;/b&gt;</strong> text or <em>&lt;i&gt;italic&lt;/i&gt;</em>.', 'dswp' ); ?></p>
		<?php
    }

    /**
     * Renders the field for selecting the banner color.
     */
    public function render_banner_color_field() {
        $banner_color = get_option( 'dswp_notification_banner_color', '#FFA500' );

        $color_options = [
            'var(--dswp-icons-color-warning)' => __( 'Warning', 'dswp' ),
            'var(--dswp-icons-color-danger)'  => __( 'Danger', 'dswp' ),
            'var(--dswp-icons-color-success)' => __( 'Success', 'dswp' ),
            'var(--dswp-icons-color-info)'    => __( 'Info', 'dswp' ),
        ];

        foreach ( $color_options as $color => $label ) {
            echo '<label>
                    <input type="radio" name="dswp_notification_banner_color" value="' . esc_attr( $color ) . '" ' . checked( $banner_color, $color, false ) . ' />
                    <span style="display:inline-block; width: 20px; height: 20px; background-color: ' . esc_attr( $color ) . ';"></span> ' . esc_html( $label ) . '
                  </label><br />';
        }
    }

    /**
     * Displays the notification banner on the front end.
     */
    public function display_banner() {
        $banner_enabled       = get_option( 'dswp_notification_banner_enabled', '0' );
        $banner_color         = get_option( 'dswp_notification_banner_color', '#000000' );
        $notification_message = get_option( 'dswp_notification_banner_notification', '' );

        if ( '1' === $banner_enabled ) {
            $text_color = $this->get_text_color( $banner_color );
            echo '<div style="background-color: ' . esc_attr( $banner_color ) . '; padding: 10px; color: ' . esc_attr( $text_color ) . '; text-align: center;">';
            echo wp_kses_post( $notification_message );
            echo '</div>';
        }
    }

    /**
     * Gets the text color based on the background color.
     *
     * @param string $background_color The background color.
     * @return string The text color.
     */
    private function get_text_color( $background_color ) {
        return isset( self::COLOR_MAP[ $background_color ] ) ? self::COLOR_MAP[ $background_color ] : 'black';
    }
}
