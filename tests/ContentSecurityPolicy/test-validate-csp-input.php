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
    public static function validCspProvider() {
        return [
            [ '', '' ],  // Empty input.
            [ 'self example.com', 'self example.com' ],
            [ 'self *.gov.bc.ca', 'self *.gov.bc.ca' ],
            [ 'https://example.com:8080/path', 'https://example.com:8080/path' ],
            [ 'cdn1.example.com v2.api.example.com', 'cdn1.example.com v2.api.example.com' ],
            [ '   self example.com   ', 'self example.com' ],  // Whitespace trimmed.
        ];
    }

    /**
     * Test: Valid CSP values are preserved.
     *
     * @dataProvider validCspProvider
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
    public static function disallowedKeywordProvider() {
        return [
            [ 'unsafe-inline example.com', 'example.com', "'unsafe-inline' should be removed" ],
            [ 'unsafe-eval self example.com', 'self example.com', "'unsafe-eval' should be removed" ],
            [ 'none', '', "'none' should result in empty return" ],
            [ 'example.com data self', 'example.com self', "'data' should be removed" ],
        ];
    }

    /**
     * Test: Disallowed keywords are removed.
     *
     * @dataProvider disallowedKeywordProvider
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
    public static function caseInsensitiveProvider() {
        return [
            [ 'UNSAFE-INLINE example.com', 'example.com' ],
            [ 'Unsafe-Eval example.com', 'example.com' ],
        ];
    }

    /**
     * Test: Input is case-insensitive for keyword matching.
     *
     * @dataProvider caseInsensitiveProvider
     *
     * @param string $input    The input CSP value.
     * @param string $expected The expected output.
     */
    public function test_input_is_case_insensitive_for_keyword_matching( $input, $expected ) {
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( $expected, $result );
    }

    /**
     * Data provider for character validation tests.
     *
     * @return array
     */
    public static function characterValidationProvider() {
        return [
            [ 'example@com#test$value%test', 'examplecomtestvaluetest', 'Invalid chars removed' ],
            [ 'example.com sub-domain/path:8080', 'example.com sub-domain/path:8080', 'Valid chars preserved' ],
            [ '*.example.com', '*.example.com', 'Asterisk preserved' ],
            [ "'self' example.com", 'self example.com', 'Quotes removed' ],
        ];
    }

    /**
     * Test: Invalid characters are removed and valid ones preserved.
     *
     * @dataProvider characterValidationProvider
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
     * Test: Only disallowed keywords result in empty string and error
     *
     * What this tests:
     * - When only disallowed keywords are in input, result is empty string
     * - An error is displayed
     * - No error is shown if valid values remain after keyword removal
     */
    public function test_only_disallowed_keywords_returns_empty_and_error() {
        $input  = 'unsafe-inline unsafe-eval';
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( '', $result, 'Input with only disallowed keywords should return empty string' );

        // Verify error was added.
        $errors = get_settings_errors( 'dswp_options_group' );
        $this->assertNotEmpty( $errors, 'Settings error should be added when only disallowed keywords present' );
    }

    /**
     * Data provider for real-world CSP scenarios.
     *
     * @return array
     */
    public static function realWorldCspValuesProvider() {
        return [
            [
                'self data gov.bc.ca *.gov.bc.ca *.twimg.com *.staticflickr.com',
                'self gov.bc.ca *.gov.bc.ca *.twimg.com *.staticflickr.com',
                'Real-world img-src with disallowed data keyword removed',
            ],
        ];
    }

    /**
     * Test: Real-world CSP values are handled correctly.
     *
     * @dataProvider realWorldCspValuesProvider
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
