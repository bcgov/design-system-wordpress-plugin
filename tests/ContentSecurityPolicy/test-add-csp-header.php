<?php
/**
 * Tests for CSP header generation.
 *
 * @package DesignSystemWordPressPlugin\Tests\ContentSecurityPolicy
 */

namespace DesignSystemWordPressPlugin\Tests\ContentSecurityPolicy;

use Bcgov\DesignSystemPlugin\ContentSecurityPolicy;

/**
 * Tests for add_csp_header method.
 */
class ContentSecurityPolicyHeaderTest extends \WP_UnitTestCase {

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
     * Test: CSP and HSTS headers are added.
     */
    public function test_csp_and_hsts_headers_added() {
        $headers = $this->csp->add_csp_header( [] );

        $this->assertArrayHasKey( 'Content-Security-Policy', $headers );
        $this->assertArrayHasKey( 'Strict-Transport-Security', $headers );
        $this->assertEquals( 'max-age=10886400; preload', $headers['Strict-Transport-Security'] );
    }

    /**
     * Data provider for CSP directives.
     *
     * @return array
     */
    public static function cspDirectivesProvider() {
        return [
            [ 'default-src' ],
            [ 'script-src' ],
            [ 'style-src' ],
            [ 'connect-src' ],
            [ 'img-src' ],
            [ 'font-src' ],
            [ 'media-src' ],
            [ 'frame-src' ],
            [ 'upgrade-insecure-requests' ],
            [ "frame-ancestors 'self'" ],
        ];
    }

    /**
     * Test: All CSP directives are included.
     *
     * @dataProvider cspDirectivesProvider
     *
     * @param string $directive The directive to check for.
     */
    public function test_csp_directives_included( $directive ) {
        $headers = $this->csp->add_csp_header( [] );
        $this->assertStringContainsString( $directive, $headers['Content-Security-Policy'] );
    }

    /**
     * Data provider for expected default domains.
     *
     * @return array
     */
    public static function defaultDomainsProvider() {
        return [
            [ 'gov.bc.ca' ],
            [ '*.gov.bc.ca' ],
            [ 'youtube.com' ],
        ];
    }

    /**
     * Test: Default domains are included.
     *
     * @dataProvider defaultDomainsProvider
     *
     * @param string $domain The domain to check for.
     */
    public function test_default_domains_included( $domain ) {
        $headers = $this->csp->add_csp_header( [] );
        $this->assertStringContainsString( $domain, $headers['Content-Security-Policy'] );
    }

    /**
     * Test: Custom option values are appended to defaults.
     */
    public function test_custom_options_appended() {
        update_option( 'dswp_csp_default_src', 'customdomain.com' );
        update_option( 'dswp_csp_script_src', 'scripts.example.com' );

        $headers = $this->csp->add_csp_header( [] );
        $csp     = $headers['Content-Security-Policy'];

        $this->assertStringContainsString( 'customdomain.com', $csp );
        $this->assertStringContainsString( 'scripts.example.com', $csp );
        $this->assertStringContainsString( 'gov.bc.ca', $csp, 'Defaults should still be present' );
    }

    /**
     * Test: CSP directives are properly formatted.
     */
    public function test_csp_formatting() {
        $headers = $this->csp->add_csp_header( [] );
        $csp     = $headers['Content-Security-Policy'];
        $this->assertMatchesRegularExpression( '/default-src [^;]+;/', $csp );
        $this->assertStringEndsWith( ';', $csp );
    }

    /**
     * Test: Existing headers are preserved.
     */
    public function test_existing_headers_preserved() {
        $existing = [
            'X-Custom-Header' => 'custom-value',
            'Cache-Control'   => 'no-cache',
        ];
        $headers  = $this->csp->add_csp_header( $existing );

        $this->assertEquals( 'custom-value', $headers['X-Custom-Header'] );
        $this->assertEquals( 'no-cache', $headers['Cache-Control'] );
        $this->assertArrayHasKey( 'Content-Security-Policy', $headers );
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
        parent::tear_down();
    }
}
