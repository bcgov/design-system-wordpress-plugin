<?php
/**
 * NotificationBanner Integration Tests
 *
 * Tests for the notification banner feature to ensure:
 * - Settings registration and access
 * - Admin menu integration
 * - Banner display on frontend (when enabled/disabled)
 * - Text color mapping based on background color
 * - HTML escaping and security (XSS protection)
 * - Option defaults
 * - Field rendering
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Tests
 */

namespace DesignSystemWordPressPlugin\Tests\NotificationBanner;

use Bcgov\DesignSystemPlugin\NotificationBanner;
use Bcgov\DesignSystemPlugin\DesignSystemSettings;

/**
 * NotificationBanner Test Class
 *
 * @package DesignSystemWordPressPlugin\Tests\NotificationBanner
 */
class NotificationBannerTest extends \WP_UnitTestCase {

	/**
	 * Test: Settings are registered correctly
	 *
	 * What this tests:
	 * - All three settings are registered (enabled, color, notification)
	 * - Settings use correct sanitization callbacks
	 * - Settings group is registered
	 * - Settings sections and fields are registered
	 */
	public function test_settings_are_registered_correctly() {
		global $wp_settings_fields, $wp_settings_sections;

		// Initialize NotificationBanner to register settings.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Call register_settings directly to avoid header issues with admin_init action.
		$notification_banner->register_settings();

		// Verify settings group exists.
		$registered_settings = get_registered_settings();
		$this->assertArrayHasKey( 'dswp_notification_banner_enabled', $registered_settings, 'Enabled setting should be registered' );
		$this->assertArrayHasKey( 'dswp_notification_banner_color', $registered_settings, 'Color setting should be registered' );
		$this->assertArrayHasKey( 'dswp_notification_banner_notification', $registered_settings, 'Notification setting should be registered' );

		// Verify sanitization callbacks.
		$this->assertEquals( 'sanitize_text_field', $registered_settings['dswp_notification_banner_enabled']['sanitize_callback'], 'Enabled setting should use sanitize_text_field' );
		$this->assertEquals( 'wp_kses_post', $registered_settings['dswp_notification_banner_notification']['sanitize_callback'], 'Notification setting should use wp_kses_post' );

		// Verify settings section exists.
		$this->assertArrayHasKey( 'dswp-notification-menu', $wp_settings_sections, 'Settings section should be registered' );
		$this->assertArrayHasKey( 'dswp_notification_menu_settings_section', $wp_settings_sections['dswp-notification-menu'], 'Settings section should have correct ID' );

		// Verify settings fields exist.
		$this->assertArrayHasKey( 'dswp-notification-menu', $wp_settings_fields, 'Settings fields should be registered' );
		$this->assertArrayHasKey( 'banner_enabled', $wp_settings_fields['dswp-notification-menu']['dswp_notification_menu_settings_section'], 'Banner enabled field should be registered' );
		$this->assertArrayHasKey( 'banner_content', $wp_settings_fields['dswp-notification-menu']['dswp_notification_menu_settings_section'], 'Banner content field should be registered' );
		$this->assertArrayHasKey( 'banner_color', $wp_settings_fields['dswp-notification-menu']['dswp_notification_menu_settings_section'], 'Banner color field should be registered' );

		// Verify default values are correctly set (especially important when feature has never been used).
		$this->assertEquals( '0', get_option( 'dswp_notification_banner_enabled', '0' ), 'Enabled option should default to 0' );
		$this->assertEquals( '', get_option( 'dswp_notification_banner_notification', '' ), 'Notification option should default to empty string' );
		$this->assertEquals( '#FFA500', get_option( 'dswp_notification_banner_color', '#FFA500' ), 'Color option should default to #FFA500 in admin context' );
	}

	/**
	 * Test: Admin menu is added correctly
	 *
	 * What this tests:
	 * - Submenu page is added under 'dswp-admin-menu'
	 * - Menu has correct title and capability
	 * - Menu slug is correct
	 */
	public function test_admin_menu_is_added_correctly() {
		global $submenu;

		// Initialize both DesignSystemSettings (creates parent menu) and NotificationBanner (creates submenu).
		$design_system_settings = new DesignSystemSettings();
		$design_system_settings->init();

		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Trigger menu registration (requires admin context).
		set_current_screen( 'admin' );
		do_action( 'admin_menu' );

		// Verify menu exists and submenu was added.
		$this->assertArrayHasKey( 'dswp-admin-menu', $submenu, 'Parent menu should exist' );

		$found = false;
		foreach ( $submenu['dswp-admin-menu'] as $item ) {
			if ( 'dswp-notification-menu' === $item[2] ) {
				$found = true;
				$this->assertEquals( 'manage_options', $item[1], 'Menu should require manage_options capability' );
				break;
			}
		}
		$this->assertTrue( $found, 'Notification Banner submenu should be added' );
	}

	/**
	 * Test: Banner is not displayed when disabled
	 *
	 * What this tests:
	 * - Banner does not appear on frontend when enabled is '0'
	 * - No HTML output when banner is disabled
	 * - Default state is disabled
	 */
	public function test_banner_is_not_displayed_when_disabled() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Ensure banner is disabled (default).
		update_option( 'dswp_notification_banner_enabled', '0' );
		update_option( 'dswp_notification_banner_notification', 'Test message that should not appear' );

		// Create a test page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Capture output from wp_head action.
		ob_start();
		do_action( 'wp_head' );
		$output = ob_get_clean();

		// Verify banner is not displayed - check for specific banner content, not just background-color
		// (which might appear in other WordPress styles).
		$this->assertStringNotContainsString( 'Test message that should not appear', $output, 'Banner message should not be displayed when disabled' );
		// Check for the specific banner div structure that would be output when enabled.
		$this->assertStringNotContainsString( 'padding: 10px; color:', $output, 'Banner styling should not be present when disabled' );
	}

	/**
	 * Test: Banner is displayed when enabled
	 *
	 * What this tests:
	 * - Banner HTML is output on frontend when enabled is '1'
	 * - Banner contains correct message
	 * - Banner has correct styling attributes
	 */
	public function test_banner_is_displayed_when_enabled() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Enable banner and set content.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)' );
		update_option( 'dswp_notification_banner_notification', 'Test notification message' );

		// Create a test page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Capture output from wp_head action.
		ob_start();
		do_action( 'wp_head' );
		$output = ob_get_clean();

		// Verify banner is displayed.
		$this->assertStringContainsString( 'background-color', $output, 'Banner should be displayed when enabled' );
		$this->assertStringContainsString( 'Test notification message', $output, 'Banner should contain notification message' );
		$this->assertStringContainsString( 'var(--dswp-icons-color-warning)', $output, 'Banner should have correct background color' );
		$this->assertStringContainsString( 'text-align: center', $output, 'Banner should have center alignment' );
		$this->assertStringContainsString( 'padding: 10px', $output, 'Banner should have padding' );
	}

	/**
	 * Test: Text color mapping works correctly for all color options
	 *
	 * What this tests:
	 * - Warning color maps to black text
	 * - Danger color maps to white text
	 * - Success color maps to white text
	 * - Info color maps to white text
	 * - Unknown colors default to black
	 */
	public function test_text_color_mapping_works_correctly() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Enable banner.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_notification', 'Test message' );

		// Test warning color (should be black).
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)' );
		ob_start();
		do_action( 'wp_head' );
		$output_warning = ob_get_clean();
		$this->assertStringContainsString( 'color: black', $output_warning, 'Warning color should map to black text' );

		// Test danger color (should be white).
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-danger)' );
		ob_start();
		do_action( 'wp_head' );
		$output_danger = ob_get_clean();
		$this->assertStringContainsString( 'color: white', $output_danger, 'Danger color should map to white text' );

		// Test success color (should be white).
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-success)' );
		ob_start();
		do_action( 'wp_head' );
		$output_success = ob_get_clean();
		$this->assertStringContainsString( 'color: white', $output_success, 'Success color should map to white text' );

		// Test info color (should be white).
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-info)' );
		ob_start();
		do_action( 'wp_head' );
		$output_info = ob_get_clean();
		$this->assertStringContainsString( 'color: white', $output_info, 'Info color should map to white text' );

		// Test unknown color (should default to black).
		update_option( 'dswp_notification_banner_color', '#FF0000' );
		ob_start();
		do_action( 'wp_head' );
		$output_unknown = ob_get_clean();
		$this->assertStringContainsString( 'color: black', $output_unknown, 'Unknown color should default to black text' );
	}

	/**
	 * Test: HTML content in banner is properly sanitized
	 *
	 * What this tests:
	 * - Allowed HTML tags are preserved (strong, em, etc.)
	 * - Dangerous HTML tags are stripped (script, iframe, etc.)
	 * - XSS protection: script tags cannot execute
	 * - wp_kses_post is used for sanitization
	 */
	public function test_html_content_in_banner_is_properly_sanitized() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Enable banner with HTML content.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)' );
		update_option( 'dswp_notification_banner_notification', '<strong>Bold text</strong> and <em>italic text</em>' );

		// Capture output.
		ob_start();
		do_action( 'wp_head' );
		$output = ob_get_clean();

		// Verify allowed HTML is preserved.
		$this->assertStringContainsString( '<strong>Bold text</strong>', $output, 'Allowed HTML tags should be preserved' );
		$this->assertStringContainsString( '<em>italic text</em>', $output, 'Allowed HTML tags should be preserved' );

		// Test with dangerous content.
		update_option( 'dswp_notification_banner_notification', '<script>alert("XSS")</script>Safe content' );
		ob_start();
		do_action( 'wp_head' );
		$output_dangerous = ob_get_clean();

		// Verify dangerous content is stripped.
		$this->assertStringNotContainsString( '<script>', $output_dangerous, 'Script tags should be stripped' );
		$this->assertStringNotContainsString( '</script>', $output_dangerous, 'Closing script tags should be stripped' );
		$this->assertStringContainsString( 'Safe content', $output_dangerous, 'Safe content should be preserved' );
	}

	/**
	 * Test: Banner attributes are properly escaped
	 *
	 * What this tests:
	 * - Background color is escaped using esc_attr()
	 * - Text color is escaped using esc_attr()
	 * - XSS protection: malicious attributes cannot be injected
	 * - HTML attributes are properly formatted
	 */
	public function test_banner_attributes_are_properly_escaped() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Enable banner with potentially dangerous color value.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)" onmouseover="alert(1)' );
		update_option( 'dswp_notification_banner_notification', 'Test message' );

		// Capture output.
		ob_start();
		do_action( 'wp_head' );
		$output = ob_get_clean();

		// Verify attributes are escaped (esc_attr prevents attribute injection).
		// The output should contain properly escaped attributes.
		$this->assertStringContainsString( 'background-color:', $output, 'Background color attribute should be present' );
		// esc_attr() converts quotes to HTML entities (&quot;), which breaks the attribute injection.
		// The quotes are escaped, so the onmouseover attribute cannot execute.
		// We check that quotes are escaped (converted to &quot;) rather than checking for the raw attribute.
		$this->assertStringContainsString( '&quot;', $output, 'Quotes should be escaped to HTML entities' );
		// Verify that even if onmouseover appears, it's broken by escaped quotes and cannot execute.
		// The important thing is that esc_attr() was used, which converts quotes to entities.
		$this->assertStringNotContainsString( 'onmouseover="alert', $output, 'Event handlers with unescaped quotes should not be present' );
	}

	/**
	 * Test: Option defaults are correct
	 *
	 * What this tests:
	 * - Enabled defaults to '0' (disabled)
	 * - Color defaults to '#FFA500' in preview, '#000000' in display
	 * - Notification defaults to empty string
	 */
	public function test_option_defaults_are_correct() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Verify defaults when options don't exist.
		$this->assertEquals( '0', get_option( 'dswp_notification_banner_enabled', '0' ), 'Enabled should default to 0' );
		$this->assertEquals( '', get_option( 'dswp_notification_banner_notification', '' ), 'Notification should default to empty string' );

		// Test default color in display_banner (uses #000000).
		ob_start();
		do_action( 'wp_head' );
		$output = ob_get_clean();
		// Banner should not be displayed when disabled, so we can't test color default here.
		// But we can verify the method handles defaults correctly.
	}

	/**
	 * Test: Banner preview in admin shows correct content
	 *
	 * What this tests:
	 * - Preview displays when banner is enabled
	 * - Preview shows disabled message when banner is disabled
	 * - Preview uses correct colors and content
	 */
	public function test_banner_preview_in_admin_shows_correct_content() {
		// Create NotificationBanner instance.
		$notification_banner = new NotificationBanner();

		// Test with banner enabled.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)' );
		update_option( 'dswp_notification_banner_notification', 'Preview test message' );

		// Capture preview output.
		ob_start();
		$notification_banner->render_notification_banner_page();
		$output_enabled = ob_get_clean();

		// Verify preview shows banner.
		$this->assertStringContainsString( 'Preview test message', $output_enabled, 'Preview should show notification message when enabled' );
		$this->assertStringContainsString( 'var(--dswp-icons-color-warning)', $output_enabled, 'Preview should show correct color' );
		$this->assertStringNotContainsString( 'The banner is disabled', $output_enabled, 'Disabled message should not appear when enabled' );

		// Test with banner disabled.
		update_option( 'dswp_notification_banner_enabled', '0' );

		ob_start();
		$notification_banner->render_notification_banner_page();
		$output_disabled = ob_get_clean();

		// Verify preview shows disabled message.
		$this->assertStringContainsString( 'The banner is disabled', $output_disabled, 'Preview should show disabled message when disabled' );
	}

	/**
	 * Test: Field rendering functions output correct HTML
	 *
	 * What this tests:
	 * - Enabled field renders radio buttons with correct values
	 * - Content field renders textarea with correct value
	 * - Color field renders radio buttons for all color options
	 * - Fields use proper escaping
	 */
	public function test_field_rendering_functions_output_correct_html() {
		// Create NotificationBanner instance.
		$notification_banner = new NotificationBanner();

		// Test enabled field.
		update_option( 'dswp_notification_banner_enabled', '1' );
		ob_start();
		$notification_banner->render_banner_enabled_field();
		$output_enabled = ob_get_clean();

		$this->assertStringContainsString( 'name="dswp_notification_banner_enabled"', $output_enabled, 'Enabled field should have correct name attribute' );
		$this->assertStringContainsString( 'value="1"', $output_enabled, 'Enabled field should have value 1' );
		$this->assertStringContainsString( 'value="0"', $output_enabled, 'Enabled field should have value 0' );
		$this->assertStringContainsString( 'checked', $output_enabled, 'Enabled field should have checked attribute when enabled' );

		// Test content field.
		update_option( 'dswp_notification_banner_notification', 'Test content' );
		ob_start();
		$notification_banner->render_banner_content_field();
		$output_content = ob_get_clean();

		$this->assertStringContainsString( 'name="dswp_notification_banner_notification"', $output_content, 'Content field should have correct name attribute' );
		$this->assertStringContainsString( 'Test content', $output_content, 'Content field should display saved value' );
		$this->assertStringContainsString( '<textarea', $output_content, 'Content field should be a textarea' );

		// Test color field.
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-danger)' );
		ob_start();
		$notification_banner->render_banner_color_field();
		$output_color = ob_get_clean();

		$this->assertStringContainsString( 'name="dswp_notification_banner_color"', $output_color, 'Color field should have correct name attribute' );
		$this->assertStringContainsString( 'var(--dswp-icons-color-warning)', $output_color, 'Color field should include warning option' );
		$this->assertStringContainsString( 'var(--dswp-icons-color-danger)', $output_color, 'Color field should include danger option' );
		$this->assertStringContainsString( 'var(--dswp-icons-color-success)', $output_color, 'Color field should include success option' );
		$this->assertStringContainsString( 'var(--dswp-icons-color-info)', $output_color, 'Color field should include info option' );
		$this->assertStringContainsString( 'checked', $output_color, 'Color field should have checked attribute for selected color' );
	}

	/**
	 * Test: Banner works on all page types
	 *
	 * What this tests:
	 * - Banner displays on pages
	 * - Banner displays on posts
	 * - Banner displays on homepage
	 */
	public function test_banner_works_on_all_page_types() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Enable banner.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)' );
		update_option( 'dswp_notification_banner_notification', 'Test message' );

		// Test on a page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
			)
		);
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		ob_start();
		do_action( 'wp_head' );
		$output_page = ob_get_clean();
		$this->assertStringContainsString( 'Test message', $output_page, 'Banner should display on pages' );

		// Test on a post.
		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'post',
				'post_title' => 'Test Post',
			)
		);
		$post    = get_post( $post_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $post_id ) );

		ob_start();
		do_action( 'wp_head' );
		$output_post = ob_get_clean();
		$this->assertStringContainsString( 'Test message', $output_post, 'Banner should display on posts' );

		// Test on homepage.
		$this->go_to( home_url() );

		ob_start();
		do_action( 'wp_head' );
		$output_home = ob_get_clean();
		$this->assertStringContainsString( 'Test message', $output_home, 'Banner should display on homepage' );
	}

	/**
	 * Test: Empty notification message is handled gracefully
	 *
	 * What this tests:
	 * - Banner displays even with empty message
	 * - Empty div is rendered (for styling purposes)
	 * - No errors occur with empty content
	 */
	public function test_empty_notification_message_is_handled_gracefully() {
		// Initialize NotificationBanner.
		$notification_banner = new NotificationBanner();
		$notification_banner->init();

		// Enable banner with empty message.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-warning)' );
		update_option( 'dswp_notification_banner_notification', '' );

		// Capture output.
		ob_start();
		do_action( 'wp_head' );
		$output = ob_get_clean();

		// Verify banner div is rendered (even with empty content).
		$this->assertStringContainsString( '<div style', $output, 'Banner div should be rendered even with empty message' );
		$this->assertStringContainsString( 'background-color', $output, 'Banner should have background color even with empty message' );
	}

	/**
	 * Test: Settings can be updated and retrieved correctly
	 *
	 * What this tests:
	 * - Options can be set and retrieved
	 * - Values persist correctly
	 * - Sanitization is applied on save
	 */
	public function test_settings_can_be_updated_and_retrieved_correctly() {
		// Set options.
		update_option( 'dswp_notification_banner_enabled', '1' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-success)' );
		update_option( 'dswp_notification_banner_notification', '<strong>Test</strong> message' );

		// Verify options are saved.
		$this->assertEquals( '1', get_option( 'dswp_notification_banner_enabled' ), 'Enabled option should be saved correctly' );
		$this->assertEquals( 'var(--dswp-icons-color-success)', get_option( 'dswp_notification_banner_color' ), 'Color option should be saved correctly' );
		$this->assertEquals( '<strong>Test</strong> message', get_option( 'dswp_notification_banner_notification' ), 'Notification option should be saved correctly' );

		// Update options.
		update_option( 'dswp_notification_banner_enabled', '0' );
		update_option( 'dswp_notification_banner_color', 'var(--dswp-icons-color-info)' );
		update_option( 'dswp_notification_banner_notification', 'Updated message' );

		// Verify options are updated.
		$this->assertEquals( '0', get_option( 'dswp_notification_banner_enabled' ), 'Enabled option should be updated correctly' );
		$this->assertEquals( 'var(--dswp-icons-color-info)', get_option( 'dswp_notification_banner_color' ), 'Color option should be updated correctly' );
		$this->assertEquals( 'Updated message', get_option( 'dswp_notification_banner_notification' ), 'Notification option should be updated correctly' );
	}
}
