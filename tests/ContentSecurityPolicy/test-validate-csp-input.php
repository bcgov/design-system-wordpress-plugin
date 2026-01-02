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
    }

    /**
     * Test: Valid CSP values are preserved
     *
     * What this tests:
     * - Valid domain names and URLs are preserved
     * - Wildcards and subdomains are preserved
     * - Multiple values separated by spaces are preserved
     * - Numbers, hyphens, colons, dots, slashes are allowed
     */
    public function test_valid_csp_values_are_preserved() {
        // Test simple domain.
        $input    = 'self example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self example.com';
        $this->assertEquals( $expected, $result, 'Valid domain should be preserved' );

        // Test domain with subdomain wildcard.
        $input    = 'self *.gov.bc.ca';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self *.gov.bc.ca';
        $this->assertEquals( $expected, $result, 'Wildcard subdomains should be preserved' );

        // Test multiple domains.
        $input    = 'self example.com cdn.example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self example.com cdn.example.com';
        $this->assertEquals( $expected, $result, 'Multiple domains should be preserved' );

        // Test domain with dots.
        $input    = 'example.com subdomain.example.co.uk';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'example.com subdomain.example.co.uk';
        $this->assertEquals( $expected, $result, 'Domains with multiple dots should be preserved' );

        // Test with ports and paths.
        $input    = 'https://example.com:8080/path';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'https://example.com:8080/path';
        $this->assertEquals( $expected, $result, 'URLs with ports and paths should be preserved' );

        // Test with numbers in domain.
        $input    = 'cdn1.example.com v2.api.example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'cdn1.example.com v2.api.example.com';
        $this->assertEquals( $expected, $result, 'Domains with numbers should be preserved' );
    }

    /**
     * Test: Disallowed keyword 'unsafe-inline' is removed
     *
     * What this tests:
     * - 'unsafe-inline' keyword is detected and removed
     * - Other valid values in the same input are preserved
     */
    public function test_disallowed_keyword_unsafe_inline_is_removed() {
        $input  = 'unsafe-inline example.com';
        $result = $this->csp->validate_csp_input( $input );
        // After removing 'unsafe-inline', we should get 'example.com' (trimmed).
        $expected = 'example.com';
        $this->assertEquals( $expected, $result, "'unsafe-inline' should be removed from input" );
    }

    /**
     * Test: Disallowed keyword 'unsafe-eval' is removed
     *
     * What this tests:
     * - 'unsafe-eval' keyword is detected and removed
     */
    public function test_disallowed_keyword_unsafe_eval_is_removed() {
        $input  = 'unsafe-eval self example.com';
        $result = $this->csp->validate_csp_input( $input );
        // After removing 'unsafe-eval', we should get "self example.com".
        $expected = 'self example.com';
        $this->assertEquals( $expected, $result, "'unsafe-eval' should be removed from input" );
    }

    /**
     * Test: Disallowed keyword 'none' is removed
     *
     * What this tests:
     * - 'none' keyword is detected and removed
     * - Returns empty string when input becomes empty after removal
     */
    public function test_disallowed_keyword_none_is_removed() {
        $input  = 'none';
        $result = $this->csp->validate_csp_input( $input );
        // After removing 'none', the input becomes empty.
        $expected = '';
        $this->assertEquals( $expected, $result, "'none' keyword should result in empty return" );
    }

    /**
     * Test: Disallowed keyword 'data' is removed
     *
     * What this tests:
     * - 'data' keyword is detected and removed
     * - 'data:' protocol is also removed due to containing 'data'
     */
    public function test_disallowed_keyword_data_is_removed() {
        $input  = 'example.com data self';
        $result = $this->csp->validate_csp_input( $input );
        // After removing 'data', we should preserve other values.
        $this->assertStringContainsString( 'example.com', $result, 'Valid domains should be preserved' );
        $this->assertStringContainsString( 'self', $result, 'Valid values should be preserved' );
        $this->assertStringNotContainsString( 'data', $result, "'data' should be removed" );
    }

    /**
     * Test: Multiple disallowed keywords are detected and removed
     *
     * What this tests:
     * - Multiple disallowed keywords in same input are all detected
     * - All disallowed keywords are removed
     */
    public function test_multiple_disallowed_keywords_are_detected() {
        $input  = 'unsafe-inline unsafe-eval example.com';
        $result = $this->csp->validate_csp_input( $input );
        // Both disallowed keywords should be removed.
        $expected = 'example.com';
        $this->assertEquals( $expected, $result, 'All disallowed keywords should be removed' );
    }

    /**
     * Test: Input is case-insensitive for keyword matching
     *
     * What this tests:
     * - Uppercase variants of disallowed keywords are detected
     * - Mixed case variants are detected
     * - Input is converted to lowercase for processing
     */
    public function test_input_is_case_insensitive_for_keyword_matching() {
        // Clear previous errors.
        $GLOBALS['wp_settings_errors'] = array();

        // Test uppercase.
        $input    = 'UNSAFE-INLINE example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'example.com';
        $this->assertEquals( $expected, $result, 'Uppercase disallowed keyword should be detected' );

        // Clear for next test.
        $GLOBALS['wp_settings_errors'] = array();

        // Test mixed case.
        $input    = 'Unsafe-Eval example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'example.com';
        $this->assertEquals( $expected, $result, 'Mixed case disallowed keyword should be detected' );
    }

    /**
     * Test: Invalid characters are removed from input.
     *
     * What this tests:
     * - Special characters like @, #, $, %, &, quotes are removed
     * - Valid special characters like hyphens, dots, slashes, asterisk, colons are preserved
     * - The regex filter allows only: a-z, 0-9, space, hyphen, colon, dot, slash, asterisk
     */
    public function test_invalid_characters_are_removed() {
        // Test special characters removal - quotes, @, #, $, %, &, etc.
        $input    = 'example@com#test$value%test';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'examplecomtestvaluetest';
        $this->assertEquals( $expected, $result, 'Invalid special characters should be removed' );

        // Test valid special characters are preserved.
        $input    = 'example.com sub-domain/path:8080';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'example.com sub-domain/path:8080';
        $this->assertEquals( $expected, $result, 'Valid special characters should be preserved' );

        // Test asterisk is allowed.
        $input    = '*.example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = '*.example.com';
        $this->assertEquals( $expected, $result, 'Asterisk should be preserved' );

        // Test single quotes are removed as invalid.
        $input    = "'self' example.com";
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self example.com';
        $this->assertEquals( $expected, $result, 'Single quotes should be removed' );
    }

    /**
     * Test: Empty input returns empty string
     *
     * What this tests:
     * - Empty string input returns empty string
     * - No error is displayed for empty input
     */
    public function test_empty_input_returns_empty_string() {
        // Clear any previous settings errors.
        $GLOBALS['wp_settings_errors'] = array();

        $input  = '';
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( '', $result, 'Empty input should return empty string' );

        // Verify no error is added for just empty input.
        $errors = get_settings_errors( 'dswp_options_group' );
        $this->assertEmpty( $errors, 'No error should be added for simply empty input' );
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
        // Clear previous errors.
        $GLOBALS['wp_settings_errors'] = array();

        $input  = 'unsafe-inline unsafe-eval';
        $result = $this->csp->validate_csp_input( $input );
        $this->assertEquals( '', $result, 'Input with only disallowed keywords should return empty string' );

        // Verify error was added.
        $errors = get_settings_errors( 'dswp_options_group' );
        $this->assertNotEmpty( $errors, 'Settings error should be added when only disallowed keywords present' );
    }

    /**
     * Test: Valid values with disallowed keywords returns valid values
     *
     * What this tests:
     * - When input has both valid and disallowed keywords, valid ones are kept
     * - Disallowed keywords are removed
     */
    public function test_valid_and_disallowed_keywords_keeps_valid() {
        $input    = 'unsafe-inline self example.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self example.com';
        $this->assertEquals( $expected, $result, 'Valid values should be preserved, disallowed removed' );
    }

    /**
     * Test: Whitespace is trimmed correctly
     *
     * What this tests:
     * - Leading whitespace is removed
     * - Trailing whitespace is removed
     * - Multiple spaces between values are handled (trimmed by sanitize_text_field)
     */
    public function test_whitespace_is_trimmed_correctly() {
        // Test leading and trailing spaces.
        $input  = '   self example.com   ';
        $result = $this->csp->validate_csp_input( $input );
        // sanitize_text_field will trim and normalize spaces.
        $this->assertStringContainsString( 'self', $result, 'Content should be preserved' );
        $this->assertStringContainsString( 'example.com', $result, 'Content should be preserved' );
        $this->assertFalse( str_starts_with( $result, ' ' ), 'Result should not start with space' );
        $this->assertFalse( str_ends_with( $result, ' ' ), 'Result should not end with space' );
    }

    /**
     * Test: Real-world CSP values are handled correctly
     *
     * What this tests:
     * - Default CSP values from the settings work correctly
     * - Complex real-world scenarios
     */
    public function test_real_world_csp_values() {
        // Test default-src value (without disallowed keywords).
        $input    = 'self gov.bc.ca *.gov.bc.ca *.twimg.com';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self gov.bc.ca *.gov.bc.ca *.twimg.com';
        $this->assertEquals( $expected, $result, 'Real-world default-src value should be preserved' );

        // Test img-src value (with data: which is disallowed).
        $input  = 'self data gov.bc.ca *.gov.bc.ca *.twimg.com *.staticflickr.com';
        $result = $this->csp->validate_csp_input( $input );
        $this->assertStringContainsString( 'gov.bc.ca', $result, 'Valid domains should be preserved' );
        $this->assertStringNotContainsString( 'data', $result, "Disallowed 'data' should be removed" );

        // Test connect-src value.
        $input    = 'self gov.bc.ca *.gov.bc.ca';
        $result   = $this->csp->validate_csp_input( $input );
        $expected = 'self gov.bc.ca *.gov.bc.ca';
        $this->assertEquals( $expected, $result, 'Connect-src value should be preserved' );
    }

    /**
     * Tear down the test fixture.
     *
     * @return void
     */
    public function tear_down() {
        // Clear any settings errors.
        $GLOBALS['wp_settings_errors'] = array();
        parent::tear_down();
    }
}
