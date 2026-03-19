<?php
/**
 * Content Security Policy Integration Tests
 *
 * Tests for the Content Security Policy functionality to ensure:
 * - CSP input validation and sanitization
 * - Disallowed keywords are detected and removed
 * - Invalid characters are filtered
 * - Error messages are displayed appropriately
 * - Valid input is preserved correctly
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Tests
 */

namespace DesignSystemWordPressPlugin\Tests\ContentSecurityPolicy;

use Bcgov\DesignSystemPlugin\ContentSecurityPolicy;

/**
 * ContentSecurityPolicy Test Class
 *
 * @package DesignSystemWordPressPlugin\Tests\ContentSecurityPolicy
 */
class ContentSecurityPolicyTest extends \WP_UnitTestCase {

    /**
     * Instance of ContentSecurityPolicy class for testing.
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
        $this->clear_settings_errors(); // eliminate manual error clearing in tests.
    }

    /**
     * Data provider for valid CSP value tests.
     *
     * @return array
     */
    public static function valid_csp_provider() {
        return [
            [ '', '' ],  // Empty input.
            [ "'self' example.com", "'self' example.com" ],
            [ "'SeLF' *.gov.bc.ca", "'self' *.gov.bc.ca" ],
            [ 'https://example.com:8080/path', 'https://example.com:8080/path' ],
            [ 'cdn1.example.com v2.api.example.com', 'cdn1.example.com v2.api.example.com' ],
            [ "   'self' example.com   ", "'self' example.com" ],  // Whitespace trimmed.
        ];
    }

    /**
     * Test: Valid CSP values are preserved.
     *
     * @dataProvider valid_csp_provider
     *
     * @param string $input    The input CSP value.
     * @param string $expected The expected output.
     */
    public function test_valid_csp_values_are_preserved( $input, $expected ) {
        $this->assertEquals( $expected, $this->csp->validate_csp_input( $input ) );
    }

    /**
     * Data provider for disallowed keyword tests.
     *
     * @return array
     */
    public static function disallowed_keyword_provider() {
        return [
            [ "'unsafe-inline' example.com", 'example.com', "'unsafe-inline' should be removed" ],
            [ "'unsafe-eval' 'self' example.com", "'self' example.com", "'unsafe-eval' should be removed" ],
            [ "example.com data: 'self'", "example.com data: 'self'", "'data:' scheme should be preserved" ],
        ];
    }

    /**
     * Test: Disallowed keywords are removed.
     *
     * @dataProvider disallowed_keyword_provider
     *
     * @param string $input    The input CSP value.
     * @param string $expected The expected output.
     * @param string $message  The assertion message.
     */
    public function test_disallowed_keywords_are_removed( $input, $expected, $message ) {
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( $expected, $result, $message );
    }

    /**
     * Data provider for case insensitivity tests.
     *
     * @return array
     */
    public static function case_insensitive_provider() {
        return [
            [ "'SELF' example.com", "'self' example.com", "Uppercase 'SELF' converted to lowercase" ],
            [ "'DATA:' *.gov.bc.ca", "'data:' *.gov.bc.ca", "Uppercase 'DATA:' scheme converted to lowercase" ],
            [ "'Self' EXAMPLE.COM data:", "'self' example.com data:", 'Mixed case domains and schemes normalized' ],
            [ 'HTTPS://CDN.EXAMPLE.COM/path', 'https://cdn.example.com/path', 'Full URL with uppercase scheme and domain' ],
            [ "'SELF' 'NONE'", "'self' 'none'", 'Multiple uppercase CSP keywords' ],
            [ 'BLOB: *.CLOUDFRONT.NET', 'blob: *.cloudfront.net', 'Scheme and wildcard domain in uppercase' ],
        ];
    }

    /**
     * Test: Input is case-insensitive for keyword matching.
     *
     * @dataProvider case_insensitive_provider
     *
     * @param string $input    The input CSP value.
     * @param string $expected The expected output.
     * @param string $message  The assertion message.
     */
    public function test_input_is_case_insensitive_for_keyword_matching( $input, $expected, $message ) {
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( $expected, $result, $message );
    }

    /**
     * Data provider for character validation tests.
     *
     * @return array
     */
    public static function character_validation_provider() {
        return [
            [ 'example@com#test$value%test', 'examplecomtestvaluetest', 'Invalid chars removed' ],
            [ 'example.com sub-domain/path:8080', 'example.com sub-domain/path:8080', 'Valid chars preserved' ],
            [ "'*.example.com'", "'*.example.com'", 'Single quotes and asterisk preserved' ],
            [ '"example.com" test.com', 'example.com test.com', 'Double quotes removed' ],
        ];
    }

    /**
     * Test: Invalid characters are removed and valid ones preserved.
     *
     * @dataProvider character_validation_provider
     *
     * @param string $input    The input CSP value.
     * @param string $expected The expected output.
     * @param string $message  The assertion message.
     */
    public function test_invalid_characters_are_removed( $input, $expected, $message ) {
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( $expected, $result, $message );
    }

    /**
     * Data provider for disallowed keywords only tests.
     *
     * @return array
     */
    public static function disallowed_keywords_only_provider() {
        return [
            [ "'unsafe-inline'", 'Single unsafe-inline keyword' ],
            [ "'unsafe-eval'", 'Single unsafe-eval keyword' ],
            [ "'unsafe-inline' 'unsafe-eval'", 'All disallowed keywords combined' ],
            [ "'UNSAFE-INLINE' 'UNSAFE-EVAL'", 'Uppercase disallowed keywords' ],
        ];
    }

    /**
     * Test: Only disallowed keywords result in empty string and error
     *
     * What this tests:
     * - When only disallowed keywords are in input, result is empty string
     * - An error is displayed
     * - No error is shown if valid values remain after keyword removal
     *
     * @dataProvider disallowed_keywords_only_provider
     *
     * @param string $input   The input containing only disallowed keywords.
     * @param string $message The assertion message.
     */
    public function test_only_disallowed_keywords_returns_empty_and_error( $input, $message ) {
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( '', $result, $message . ' should return empty string' );

        // Verify error was added.
        $errors = get_settings_errors( 'dswp_options_group' );
        $this->assertNotEmpty( $errors, $message . ' should add settings error' );
    }

    /**
     * Data provider for real-world CSP scenarios.
     *
     * @return array
     */
    public static function real_world_csp_values_provider() {
        return [
            [
                "'self' data: gov.bc.ca *.gov.bc.ca *.twimg.com *.staticflickr.com",
                "'self' data: gov.bc.ca *.gov.bc.ca *.twimg.com *.staticflickr.com",
                'Real-world img-src with data: scheme preserved',
            ],
            [
                "'self' gov.bc.ca *.gov.bc.ca youtube.com *.youtube.com youtu.be",
                "'self' gov.bc.ca *.gov.bc.ca youtube.com *.youtube.com youtu.be",
                'Real-world frame-src with multiple domains',
            ],
            [
                "https://cdn.example.com:8080/path 'self' *.gov.bc.ca",
                "https://cdn.example.com:8080/path 'self' *.gov.bc.ca",
                'Real-world with full URL including port and path',
            ],
            [
                "'self' data: blob: *.cloudfront.net",
                "'self' data: blob: *.cloudfront.net",
                'Real-world with multiple schemes and CDN',
            ],
        ];
    }

    /**
     * Test: Real-world CSP values are handled correctly.
     *
     * @dataProvider real_world_csp_values_provider
     *
     * @param string $input    The input CSP value.
     * @param string $expected The expected output.
     * @param string $message  The assertion message.
     */
    public function test_real_world_csp_values( $input, $expected, $message ) {
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( $expected, $result, $message );
    }

    /**
     * Clear settings errors for testing.
     *
     * @return void
     */
    private function clear_settings_errors() {
        $GLOBALS['wp_settings_errors'] = array();
    }

    /**
     * Tear down the test fixture.
     *
     * @return void
     */
    public function tear_down() {
        // Clear any settings errors.
        $this->clear_settings_errors();
        parent::tear_down();
    }
}
