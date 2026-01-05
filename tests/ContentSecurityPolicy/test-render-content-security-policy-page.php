<?php
/**
 * Content Security Policy page rendering tests.
 *
 * @package DesignSystemWordPressPlugin\Tests\ContentSecurityPolicy
 */

namespace DesignSystemWordPressPlugin\Tests\ContentSecurityPolicy;

use Bcgov\DesignSystemPlugin\ContentSecurityPolicy;

/**
 * Tests for rendering the CSP settings page.
 *
 * @covers \Bcgov\DesignSystemPlugin\ContentSecurityPolicy::render_content_security_policy_page
 */
class ContentSecurityPolicyRenderPageTest extends \WP_UnitTestCase {

    /**
     * Instance of ContentSecurityPolicy for testing.
     *
     * @var ContentSecurityPolicy
     */
    private $csp;

    /**
     * Set up the test fixture.
     *
     * @return void
     */
    public function set_up() {
        parent::set_up();
        $this->csp = new ContentSecurityPolicy();
    }

    /**
     * Build data provider rows from the CSP settings definition.
     *
     * @return array
     */
    public static function cspSettingsProvider() {
        $data = [];
        foreach ( ContentSecurityPolicy::CSP_SETTINGS as $key => $setting ) {
            $data[ $key ] = [
                $key,
                $setting['option'],
                $setting['title'],
                $setting['description'],
                $setting['default'],
            ];
        }
        return $data;
    }

    /**
     * Ensure each CSP field renders with the saved value and falls back to the default when unset.
     *
     * @dataProvider cspSettingsProvider
     *
     * @param string $key              Settings array key (e.g., default-src).
     * @param string $option           Option suffix (e.g., default_src).
     * @param string $title            Field title displayed as heading.
     * @param string $description      Field description text.
     * @param string $default_value    Default value for the field.
     */
    public function test_render_outputs_saved_and_default_values( $key, $option, $title, $description, $default_value ) {
        $option_name  = 'dswp_csp_' . $option;
        $custom_value = 'custom-' . $key;

        update_option( $option_name, $custom_value );

        ob_start();
        $this->csp->render_content_security_policy_page();
        $output_saved = ob_get_clean();

        $this->assertStringContainsString( '<h2>' . esc_html( $title ) . '</h2>', $output_saved, 'Title should render' );
        $this->assertStringContainsString( esc_html( $description . ' ' . $default_value ), $output_saved, 'Description with default should render' );
        $this->assertStringContainsString( 'name="' . esc_attr( $option_name ) . '"', $output_saved, 'Input name should match option' );
        $this->assertStringContainsString( 'value="' . esc_attr( $custom_value ) . '"', $output_saved, 'Saved value should render' );

        delete_option( $option_name );

        ob_start();
        $this->csp->render_content_security_policy_page();
        $output_default = ob_get_clean();

        $this->assertStringContainsString( 'value="' . esc_attr( $default_value ) . '"', $output_default, 'Default value should render when option is unset' );
    }

    /**
     * Ensure the settings error output is rendered when present.
     */
    public function test_render_outputs_settings_errors() {
        add_settings_error( 'dswp_options_group', 'test_csp_error', 'CSP error message', 'error' );

        ob_start();
        $this->csp->render_content_security_policy_page();
        $output = ob_get_clean();

        $this->assertStringContainsString( 'CSP error message', $output, 'Settings errors should be printed' );
    }

    /**
     * Ensure the form includes the settings fields nonce for the options group.
     */
    public function test_render_outputs_settings_fields_nonce() {
        ob_start();
        $this->csp->render_content_security_policy_page();
        $output = ob_get_clean();

        $this->assertStringContainsString( "name='option_page'", $output, 'Option page field should render' );
        $this->assertStringContainsString( "value='dswp_options_group'", $output, 'Option page should target dswp_options_group' );
    }

    /**
     * Tear down the test fixture.
     *
     * @return void
     */
    public function tear_down() {
        foreach ( ContentSecurityPolicy::CSP_SETTINGS as $setting ) {
            delete_option( 'dswp_csp_' . $setting['option'] );
        }
        $GLOBALS['wp_settings_errors'] = array();
        parent::tear_down();
    }
}
