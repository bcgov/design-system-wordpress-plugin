<?php
namespace Bcgov\DesignSystemPlugin\Tests\AutoAnchor;

use Bcgov\DesignSystemPlugin\AutoAnchor\Settings;
use WP_UnitTestCase;

/**
 * @group dswp
 * @group auto-anchor
 */
class AutoAnchorViewTest extends WP_UnitTestCase {

    private $view_path;

    public function setUp(): void {
        parent::setUp();

        $this->view_path = dirname( __DIR__ ) . '/src/AutoAnchor/View.php';

        // Ensure view file exists
        $this->assertFileExists( $this->view_path, 'View.php file should exist' );
    }

    public function tearDown(): void {
        parent::tearDown();
        delete_option( Settings::OPTION_NAME );
    }

    public function test_view_renders_wrapper_div() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( '<div class="wrap">', $output );
        $this->assertStringContainsString( '</div>', $output );
    }

    public function test_view_renders_page_title() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( '<h1>', $output );
        $this->assertStringContainsString( 'Auto Anchor Settings', $output );
    }

    public function test_view_renders_form_with_correct_action() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( '<form method="post" action="options.php">', $output );
        $this->assertStringContainsString( '</form>', $output );
    }

    public function test_view_calls_settings_fields() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // settings_fields outputs nonce and referrer fields
        $this->assertStringContainsString( 'option_page', $output );
        $this->assertStringContainsString( 'dswp_options_group', $output );
    }

    public function test_view_renders_checkbox_input_with_correct_name() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( 'type="checkbox"', $output );
        $this->assertStringContainsString( 'name="' . Settings::OPTION_NAME . '"', $output );
        $this->assertStringContainsString( 'value="1"', $output );
    }

    public function test_view_renders_checkbox_unchecked_when_option_is_disabled() {
        update_option( Settings::OPTION_NAME, '0' );

        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // When unchecked, no 'checked' attribute should be present
        $this->assertStringNotContainsString( 'checked=\'checked\'', $output );
        $this->assertStringNotContainsString( 'checked="checked"', $output );
    }

    public function test_view_renders_checkbox_checked_when_option_is_enabled() {
        update_option( Settings::OPTION_NAME, '1' );

        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // When checked, 'checked' attribute should be present
        $this->assertMatchesRegularExpression( '/checked\s*=\s*["\']checked["\']/', $output );
    }

    public function test_view_renders_toggle_switch_classes() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( 'class="dswp-toggle-switch"', $output );
        $this->assertStringContainsString( 'class="dswp-toggle-slider"', $output );
        $this->assertStringContainsString( 'class="dswp-toggle-label"', $output );
    }

    public function test_view_renders_form_table_structure() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( '<table class="form-table">', $output );
        $this->assertStringContainsString( '<tr>', $output );
        $this->assertStringContainsString( '<th scope="row">', $output );
        $this->assertStringContainsString( '<td>', $output );
    }

    public function test_view_renders_field_label() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( 'Auto Anchor Headings', $output );
    }

    public function test_view_renders_toggle_label_text() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( 'Automatically generate anchor IDs for headings', $output );
    }

    public function test_view_renders_description_text() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( '<p class="description">', $output );
        $this->assertStringContainsString( 'When enabled, this will automatically generate anchor IDs for heading blocks based on their content.', $output );
    }

    public function test_view_renders_submit_button() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // submit_button() outputs a submit input
        $this->assertStringContainsString( 'type="submit"', $output );
        $this->assertStringContainsString( 'class="button button-primary"', $output );
    }

    public function test_view_escapes_output_properly() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // Check that esc_attr is used for attribute values
        $this->assertStringContainsString( 'name="' . Settings::OPTION_NAME . '"', $output );

        // No unescaped PHP tags or variables should remain
        $this->assertStringNotContainsString( '<?php', $output );
    }

    public function test_view_uses_wordpress_i18n_functions() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // Verify translatable strings are present
        $this->assertStringContainsString( 'Auto Anchor Settings', $output );
        $this->assertStringContainsString( 'Auto Anchor Headings', $output );
        $this->assertStringContainsString( 'Automatically generate anchor IDs for headings', $output );
    }

    public function test_view_has_inline_flex_styling() {
        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        $this->assertStringContainsString( 'style="display: flex; align-items: center;"', $output );
    }

    public function test_view_option_defaults_to_zero_when_not_set() {
        delete_option( Settings::OPTION_NAME );

        ob_start();
        include $this->view_path;
        $output = ob_get_clean();

        // Should not be checked when option doesn't exist
        $this->assertStringNotContainsString( 'checked=\'checked\'', $output );
        $this->assertStringNotContainsString( 'checked="checked"', $output );
    }

    public function test_view_handles_abspath_check() {
        // This tests that the ABSPATH check is present
        $file_contents = file_get_contents( $this->view_path );

        $this->assertStringContainsString( 'if ( ! defined( \'ABSPATH\' ) )', $file_contents );
        $this->assertStringContainsString( 'exit;', $file_contents );
    }

    public function test_view_includes_namespace() {
        $file_contents = file_get_contents( $this->view_path );

        $this->assertStringContainsString( 'namespace Bcgov\DesignSystemPlugin\AutoAnchor;', $file_contents );
    }

    public function test_view_uses_settings_class_constant() {
        $file_contents = file_get_contents( $this->view_path );

        $this->assertStringContainsString( 'use Bcgov\DesignSystemPlugin\AutoAnchor\Settings;', $file_contents );
        $this->assertStringContainsString( 'Settings::OPTION_NAME', $file_contents );
    }
}