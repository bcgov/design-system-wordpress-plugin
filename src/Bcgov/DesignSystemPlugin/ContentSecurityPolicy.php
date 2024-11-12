<?php

namespace Bcgov\DesignSystemPlugin;

/**
 * Class ContentSecurityPolicy
 *
 * This class manages the Content Security Policy settings for the Design System Plugin.
 */
class ContentSecurityPolicy {



    const OPTION_PREFIX = 'dswp_csp_';

    const CSP_SETTINGS = [
        'default-src' => [
            'option'      => 'default_src',
            'title'       => 'Default-src Policy',
            'description' => 'Fallback whitelist item for most sources. Default includes: ',
            'default'     => "'self' gov.bc.ca *.gov.bc.ca data: *.twimg.com",
        ],
        'script-src'  => [
            'option'      => 'script_src',
            'title'       => 'Script-src Policy',
            'description' => 'Allowlist for script sources. Default includes: ',
            'default'     => "'self' 'unsafe-inline' 'unsafe-eval' gov.bc.ca *.gov.bc.ca *.twimg.com *.flickr.com",
        ],
        'style-src'   => [
            'option'      => 'style_src',
            'title'       => 'Style-src Policy',
            'description' => 'Allowlist for CSS stylesheet sources. Default includes: ',
            'default'     => "'self' 'unsafe-inline' *.twimg.com",
        ],
        'connect-src' => [
            'option'      => 'connect_src',
            'title'       => 'Connect-src Policy',
            'description' => 'Permitted origins for direct JavaScript connections. Default includes: ',
            'default'     => "'self' gov.bc.ca *.gov.bc.ca *.flickr.com",
        ],
        'img-src'     => [
            'option'      => 'img_src',
            'title'       => 'Img-src Policy',
            'description' => 'Restrict image sources. Default includes: ',
            'default'     => "'self' data: gov.bc.ca *.gov.bc.ca *.twimg.com *.staticflickr.com",
        ],
        'font-src'    => [
            'option'      => 'font_src',
            'title'       => 'Font-src Policy',
            'description' => 'Permitted sources for loading fonts. Default includes: ',
            'default'     => "'self' 'unsafe-inline' data:",
        ],
        'media-src'   => [
            'option'      => 'media_src',
            'title'       => 'Media-src Policy',
            'description' => 'Restrict origins for loading sound and video resources. Default includes: ',
            'default'     => "'self' 'unsafe-inline'",
        ],
        'frame-src'   => [
            'option'      => 'frame_src',
            'title'       => 'Frame-src Policy',
            'description' => 'Restrict permitted URLs for JavaScript workers and embedded frame contents. Default includes: ',
            'default'     => "'self' gov.bc.ca *.gov.bc.ca youtube.com *.youtube.com youtu.be",
        ],
    ];

    /**
     * Registers settings for the Content Security Policy.
     */
    public function register_settings() {
        foreach ( self::CSP_SETTINGS as $setting ) {
            // Register each CSP setting with validation logic.
            register_setting( 'dswp_options_group', self::OPTION_PREFIX . $setting['option'], [ $this, 'validate_csp_input' ] );
        }
    }

    /**
     * Validates the CSP input values.
     *
     * @param string $input The input value to validate.
     * @return string The sanitized and validated input value.
     */
    public function validate_csp_input( $input ) {
        // Convert the input to lowercase for consistent validation.
        $input = strtolower( $input );

        // Define CSP keywords that should not be allowed.
        $disallowed_keywords = [ 'unsafe-inline', 'unsafe-eval', 'none', 'data' ];

        // Find and remove disallowed keywords from the input.
        $found_keywords = array_filter(
            $disallowed_keywords,
            function ( $keyword ) use ( &$input ) {
                if ( strpos( $input, $keyword ) !== false ) {
                    $input = str_replace( $keyword, '', $input );
                    return true; // Keep this keyword in the found list.
                }
                return false; // Ignore this keyword.
            }
        );

        // Trim the input to check if it's empty after removing disallowed keywords.
        $input = trim( $input );

        // If the input is empty after removing disallowed keywords, show an error.
        if ( '' === $input && $found_keywords ) {
            add_settings_error(
                'dswp_options_group',
                'invalid_csp',
                sprintf(
                    /* translators: %s: List of disallowed keywords */
                    __( 'Disallowed keyword(s) found: %s', 'dswp' ),
                    implode( ', ', $found_keywords ) // Join found keywords into a string.
                ),
                'error'
            );
            return '';  // Return an empty string if no valid input remains.
        }

        // Sanitize the input by removing invalid characters.
        // We are allowing letters, digits, spaces, hyphens, colons, dots, slashes, and asterisk.
        $input = preg_replace( '/[^a-z0-9 \-:\.\/\*]/i', '', $input );

        // Return the sanitized input (if valid).
        return sanitize_text_field( $input );
    }

    /**
     * Initializes the class by adding necessary actions and filters.
     */
    public function init() {
        add_action( 'admin_menu', [ $this, 'add_menu' ] );
        add_action( 'admin_init', [ $this, 'register_settings' ] );
        add_filter( 'wp_headers', [ $this, 'add_csp_header' ] );
    }

    /**
     * Adds the admin menu and submenu for CSP settings.
     */
    public function add_menu() {
        add_submenu_page(
            'dswp-admin-menu',
            __( 'Content Security Policy', 'dswp' ),
            __( 'Content Security Policy', 'dswp' ),
            'manage_options',
            'dswp-content-security-policy-menu',
            [ $this, 'render_content_security_policy_page' ]
        );
    }

    /**
     * Renders the Content Security Policy settings page.
     */
    public function render_content_security_policy_page() {
        ?>
        <div class="wrap">
            <?php settings_errors(); ?>
            <h1><?php esc_html_e( 'Content Security Policy Settings', 'dswp' ); ?></h1>
            <form method="post" action="options.php">
                <?php settings_fields( 'dswp_options_group' ); ?>
                <?php foreach ( self::CSP_SETTINGS as $setting ) : ?>
                    <?php
                        $option_name = esc_attr( self::OPTION_PREFIX . $setting['option'] );
                    ?>
                    <h2><?php echo esc_html( $setting['title'] ); ?></h2>
                    <p><?php echo esc_html( $setting['description'] . ' ' . $setting['default'] ); ?></p>
                    <input class="admin-form-inputs"
                        type="text"
                        name="<?php echo esc_attr( $option_name ); ?>" 
                        value="<?php echo esc_attr( get_option( $option_name, $setting['default'] ) ); ?>" />
                <?php endforeach; ?>
                <?php submit_button( __( 'Save Settings', 'dswp' ) ); ?>
            </form>
        </div>
        <?php
    }

    /**
     * Adds the Content Security Policy header to the response.
     *
     * @param array $headers Existing headers.
     * @return array Modified headers with CSP.
     */
    public function add_csp_header( $headers ) {
        $csp        = '';
        $white_list = [
            'upgrade-insecure-requests',
            'frame-ancestors' => "'self'",
        ];

        foreach ( self::CSP_SETTINGS as $key => $value ) {
            $option_value       = get_option( self::OPTION_PREFIX . $value['option'] );
            $white_list[ $key ] = sprintf( '%s %s', $value['default'], esc_attr( $option_value ) );
        }

        foreach ( $white_list as $white_list_item => $rule ) {
            $csp .= sprintf( ' %s %s; ', is_string( $white_list_item ) ? $white_list_item : '', $rule );
        }
        $headers['Content-Security-Policy']   = trim( $csp );
        $headers['Strict-Transport-Security'] = 'max-age=10886400; preload';
        return $headers;
    }
}
