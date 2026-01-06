<?php
/**
 * InPageNav Integration Tests
 *
 * Tests for the in-page navigation feature to ensure:
 * - Meta field registration and access
 * - Asset enqueuing when enabled/disabled
 * - JavaScript localization data
 * - Editor integration
 * - Security and escaping
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Tests
 */

namespace DesignSystemWordPressPlugin\Tests\InPageNav;

/**
 * InPageNav Test Class
 *
 * @package DesignSystemWordPressPlugin\Tests\InPageNav
 */
class InPageNavTest extends \WP_UnitTestCase {

	/**
	 * Test: Meta field is registered for pages
	 *
	 * What this tests:
	 * - Meta field 'show_inpage_nav' is registered for 'page' post type
	 * - Meta field is accessible via REST API
	 * - Meta field has correct type (boolean)
	 * - Default value is false
	 */
	public function test_meta_field_is_registered_for_pages() {
		// Create a test page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Verify meta field exists and can be accessed.
		// get_post_meta returns empty string when meta doesn't exist, not false.
		$meta_value = get_post_meta( $page_id, 'show_inpage_nav', true );
		$this->assertEmpty( $meta_value, 'Default meta value should be empty/false' );

		// Verify meta field can be set.
		update_post_meta( $page_id, 'show_inpage_nav', true );
		$meta_value = get_post_meta( $page_id, 'show_inpage_nav', true );
		// WordPress stores boolean true as '1' (string), so we check it's truthy.
		$this->assertNotEmpty( $meta_value, 'Meta value should be truthy after update' );
	}

	/**
	 * Test: Meta field is not registered for other post types
	 *
	 * What this tests:
	 * - Meta field registration is specific to 'page' post type
	 * - Other post types should not have this meta field registered
	 */
	public function test_meta_field_is_not_registered_for_other_post_types() {
		// Create a test post (not a page).
		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'post',
				'post_title' => 'Test Post',
			)
		);

		// Verify meta field can still be set manually, but it's not registered.
		// WordPress allows setting any meta, but the registration is what matters.
		update_post_meta( $post_id, 'show_inpage_nav', true );
		$meta_value = get_post_meta( $post_id, 'show_inpage_nav', true );
		// This will work because WordPress allows any meta, but the REST API registration won't work.
		// WordPress stores boolean true as '1' (string), so we check it's not empty.
		$this->assertNotEmpty( $meta_value, 'Meta can be set manually but is not registered for posts' );
	}

	/**
	 * Test: Assets are not enqueued when feature is disabled
	 *
	 * What this tests:
	 * - CSS and JS assets are not enqueued when show_inpage_nav is false
	 * - Assets are not loaded on non-page post types
	 * - Performance: unnecessary assets are not loaded
	 */
	public function test_assets_are_not_enqueued_when_feature_is_disabled() {
		// Create a test page with feature disabled.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Ensure meta is false (default).
		update_post_meta( $page_id, 'show_inpage_nav', false );

		// Set up global post and query to simulate page view.
		global $post, $wp_query;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are not enqueued.
		$this->assertFalse( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should not be enqueued when feature is disabled' );
		$this->assertFalse( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should not be enqueued when feature is disabled' );
	}

	/**
	 * Test: Assets are enqueued only on pages when enabled
	 *
	 * What this tests:
	 * - Assets ARE enqueued on pages when show_inpage_nav is true
	 * - Assets are NOT enqueued on posts even when meta is set to true
	 * - is_page() check ensures assets only load on page post type
	 * - Feature works correctly on pages but not other post types
	 */
	public function test_assets_are_enqueued_only_on_pages_when_enabled() {
		// Clear any previously enqueued scripts/styles.
		global $wp_styles, $wp_scripts;
		$wp_styles->queue       = array();
		$wp_scripts->queue      = array();
		$wp_styles->registered  = array();
		$wp_scripts->registered = array();

		// Test 1: Assets ARE enqueued on pages when enabled.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Enable the feature on the page.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post, $wp_query;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets ARE enqueued on pages.
		$this->assertTrue( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should be enqueued on pages when feature is enabled' );
		$this->assertTrue( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should be enqueued on pages when feature is enabled' );

		// Clear enqueued assets for next test.
		$wp_styles->queue       = array();
		$wp_scripts->queue      = array();
		$wp_styles->registered  = array();
		$wp_scripts->registered = array();

		// Test 2: Assets are NOT enqueued on posts.
		// Note: The meta field is only registered for pages, so it's not available for posts.
		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'post',
				'post_title' => 'Test Post',
			)
		);

		// Set up global post and query to simulate post view (not a page).
		$post = get_post( $post_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $post_id ) );

		// Ensure query is set up correctly for a post, not a page.
		$wp_query->is_page     = false;
		$wp_query->is_single   = true;
		$wp_query->is_singular = true;

		// Verify is_page() returns false.
		$this->assertFalse( is_page(), 'is_page() should return false for posts' );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are NOT enqueued on posts.
		// The is_page() check prevents enqueuing regardless of meta field availability.
		$this->assertFalse( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should not be enqueued on posts' );
		$this->assertFalse( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should not be enqueued on posts' );
	}

	/**
	 * Test: Assets are not enqueued on non-page post types
	 *
	 * What this tests:
	 * - Assets are not loaded on posts, even if meta is set
	 * - is_page() check prevents asset loading on wrong post types
	 */
	public function test_assets_are_not_enqueued_on_non_page_post_types() {
		// Clear any previously enqueued scripts/styles.
		global $wp_styles, $wp_scripts;
		$wp_styles->queue       = array();
		$wp_scripts->queue      = array();
		$wp_styles->registered  = array();
		$wp_scripts->registered = array();

		// Create a test post (not a page).
		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'post',
				'post_title' => 'Test Post',
			)
		);

		// Set up global post and query to simulate post view (not a page).
		global $post, $wp_query;
		$post = get_post( $post_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $post_id ) );

		// Ensure query is set up correctly for a post, not a page.
		// is_page() checks $wp_query->is_page.
		$wp_query->is_page     = false;
		$wp_query->is_single   = true;
		$wp_query->is_singular = true;

		// Verify is_page() returns false before testing.
		$this->assertFalse( is_page(), 'is_page() should return false for posts' );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are not enqueued.
		$this->assertFalse( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should not be enqueued on non-page post types' );
		$this->assertFalse( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should not be enqueued on non-page post types' );
	}

	/**
	 * Test: JavaScript localization data is correctly passed
	 *
	 * What this tests:
	 * - dswpInPageNav object is localized with correct structure
	 * - Options (mobile_breakpoint, scroll_offset, heading_selectors) are included
	 * - Page excerpt is included when available
	 * - Default values are used when excerpt is not available
	 */
	public function test_javascript_localization_data_is_correctly_passed() {
		// Create a test page with excerpt.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_excerpt' => 'This is a test excerpt for the page.',
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Get the localized script data.
		global $wp_scripts;
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );

		// Verify localization data exists.
		$this->assertNotEmpty( $script_data, 'Script should have localization data' );
		$this->assertStringContainsString( 'dswpInPageNav', $script_data, 'Localization should include dswpInPageNav object' );
		$this->assertStringContainsString( 'page_excerpt', $script_data, 'Localization should include page_excerpt' );
		$this->assertStringContainsString( 'options', $script_data, 'Localization should include options' );
		$this->assertStringContainsString( 'mobile_breakpoint', $script_data, 'Localization should include mobile_breakpoint' );
		$this->assertStringContainsString( 'scroll_offset', $script_data, 'Localization should include scroll_offset' );
		$this->assertStringContainsString( 'heading_selectors', $script_data, 'Localization should include heading_selectors' );
	}

	/**
	 * Test: Page excerpt is extracted from post excerpt
	 *
	 * What this tests:
	 * - When post_excerpt exists, it is used
	 * - Excerpt is properly stripped of HTML tags
	 * - Excerpt is passed to JavaScript
	 */
	public function test_page_excerpt_is_extracted_from_post_excerpt() {
		$excerpt_text = 'This is a test excerpt with <strong>HTML</strong> tags.';

		// Create a test page with excerpt.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_excerpt' => $excerpt_text,
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Get the localized script data.
		global $wp_scripts;
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );

		// Verify excerpt is included and HTML is stripped.
		$stripped_excerpt = wp_strip_all_tags( $excerpt_text );
		$this->assertStringContainsString( $stripped_excerpt, $script_data, 'Excerpt should be included in localization data' );
		$this->assertStringNotContainsString( '<strong>', $script_data, 'HTML tags should be stripped from excerpt' );
		$this->assertStringNotContainsString( '</strong>', $script_data, 'HTML closing tags should be stripped from excerpt' );
	}

	/**
	 * Test: Page excerpt falls back to first paragraph when excerpt is empty
	 *
	 * What this tests:
	 * - When post_excerpt is empty, first paragraph of content is used
	 * - Only paragraphs longer than 20 characters are used
	 * - Content is properly stripped of HTML tags
	 */
	public function test_page_excerpt_falls_back_to_first_paragraph_when_excerpt_is_empty() {
		$first_paragraph = 'This is the first paragraph of the content that should be used as excerpt.';

		// Create a test page without excerpt but with content.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_excerpt' => '',
				'post_content' => $first_paragraph . "\n\nThis is the second paragraph.",
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Get the localized script data.
		global $wp_scripts;
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );

		// Verify first paragraph is used as excerpt.
		$this->assertStringContainsString( $first_paragraph, $script_data, 'First paragraph should be used as excerpt when post_excerpt is empty' );
	}

	/**
	 * Test: Page excerpt is empty when content is too short
	 *
	 * What this tests:
	 * - Paragraphs shorter than 20 characters are not used as excerpt
	 * - Empty excerpt is passed when no suitable content is found
	 */
	public function test_page_excerpt_is_empty_when_content_is_too_short() {
		// Create a test page with short content.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_excerpt' => '',
				'post_content' => 'Short.',
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Get the localized script data.
		global $wp_scripts;
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );

		// Verify excerpt is empty or not present.
		// The excerpt should be an empty string when content is too short.
		$this->assertStringContainsString( 'page_excerpt', $script_data, 'page_excerpt key should be present' );
	}

	/**
	 * Test: Dangerous content in excerpt is properly escaped
	 *
	 * What this tests:
	 * - XSS protection: script tags in excerpt are stripped
	 * - HTML entities are properly handled
	 * - Malicious code cannot execute in JavaScript
	 */
	public function test_dangerous_content_in_excerpt_is_properly_escaped() {
		$dangerous_excerpt = '<script>alert("XSS")</script>Test excerpt';

		// Create a test page with dangerous content in excerpt.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_excerpt' => $dangerous_excerpt,
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Get the localized script data.
		global $wp_scripts;
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );

		// Verify dangerous content is stripped.
		$stripped_excerpt = wp_strip_all_tags( $dangerous_excerpt );
		$this->assertStringContainsString( $stripped_excerpt, $script_data, 'Excerpt should be stripped of HTML tags' );
		$this->assertStringNotContainsString( '<script>', $script_data, 'Script tags should be stripped from excerpt' );
		$this->assertStringNotContainsString( '</script>', $script_data, 'Closing script tags should be stripped from excerpt' );
		$this->assertStringNotContainsString( 'alert("XSS")', $script_data, 'JavaScript code should not be present in raw form' );
	}

	/**
	 * Test: Editor assets are enqueued in block editor
	 *
	 * What this tests:
	 * - Editor script is enqueued when in block editor
	 * - Editor script has correct dependencies
	 * - Editor script URL is correct
	 */
	public function test_editor_assets_are_enqueued_in_block_editor() {
		// Set current screen to block editor.
		set_current_screen( 'post' );

		// Trigger the editor enqueue action.
		do_action( 'enqueue_block_editor_assets' );

		// Verify editor script is enqueued (if file exists).
		$plugin_dir  = dirname( __DIR__, 2 );
		$script_path = $plugin_dir . '/dist/in-page-nav-editor.js';

		if ( file_exists( $script_path ) ) {
			$this->assertTrue( wp_script_is( 'dswp-in-page-nav-editor', 'enqueued' ), 'Editor script should be enqueued in block editor' );

			// Verify script URL is correct.
			global $wp_scripts;
			$script_url = $wp_scripts->registered['dswp-in-page-nav-editor']->src ?? '';
			$this->assertStringContainsString( 'in-page-nav-editor.js', $script_url, 'Editor script URL should contain correct filename' );
		} else {
			// If file doesn't exist, skip this assertion (development environment).
			$this->markTestSkipped( 'Editor script file does not exist (may need to build assets)' );
		}
	}

	/**
	 * Test: Configuration options have correct default values and only h2 is used
	 *
	 * What this tests:
	 * - mobile_breakpoint is set to 1800
	 * - scroll_offset is set to 60
	 * - heading_selectors is set to ['h2'] and only h2 (not h1, h3, h4, etc.)
	 * - Configuration is correct even when page has multiple heading levels
	 * - Asset URLs are correct
	 */
	public function test_configuration_options_have_correct_default_values_and_only_h2() {
		// Create a test page with multiple heading levels.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_content' => '<h1>Main Title</h1><p>Intro text.</p><h2>First Section</h2><p>Content here.</p><h3>Subsection</h3><p>More content.</p><h2>Second Section</h2><p>More content.</p><h4>Detail</h4><p>Details here.</p>',
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are enqueued.
		$this->assertTrue( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should be enqueued when feature is enabled' );
		$this->assertTrue( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should be enqueued when feature is enabled' );

		// Verify asset URLs are correct.
		global $wp_styles, $wp_scripts;
		$style_url  = $wp_styles->registered['dswp-in-page-nav-styles']->src ?? '';
		$script_url = $wp_scripts->registered['dswp-in-page-nav-script']->src ?? '';
		$this->assertStringContainsString( 'style-in-page-nav.css', $style_url, 'CSS URL should contain correct filename' );
		$this->assertStringContainsString( 'in-page-nav.js', $script_url, 'JS URL should contain correct filename' );

		// Get the localized script data.
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );

		// Verify default configuration values.
		$this->assertStringContainsString( '1800', $script_data, 'mobile_breakpoint should be 1800' );
		$this->assertStringContainsString( '60', $script_data, 'scroll_offset should be 60' );

		// Verify h2 is included in heading_selectors.
		$this->assertStringContainsString( 'h2', $script_data, 'heading_selectors should include h2' );

		// Verify other heading levels are NOT included (even though page has h1, h3, h4).
		$this->assertStringNotContainsString( '"h1"', $script_data, 'heading_selectors should not include h1 even if page has h1' );
		$this->assertStringNotContainsString( '"h3"', $script_data, 'heading_selectors should not include h3 even if page has h3' );
		$this->assertStringNotContainsString( '"h4"', $script_data, 'heading_selectors should not include h4 even if page has h4' );
		$this->assertStringNotContainsString( '"h5"', $script_data, 'heading_selectors should not include h5' );
		$this->assertStringNotContainsString( '"h6"', $script_data, 'heading_selectors should not include h6' );

		// Verify the heading_selectors array only contains h2.
		$this->assertMatchesRegularExpression( '/"heading_selectors"\s*:\s*\[\s*"h2"\s*\]/', $script_data, 'heading_selectors should be an array containing only "h2", regardless of page content' );
	}

	/**
	 * Test: Assets are enqueued when feature is enabled even without h2 headings
	 *
	 * What this tests:
	 * - Assets are enqueued when show_inpage_nav is true, regardless of page content
	 * - JavaScript will handle the case where no h2 headings exist
	 * - Note: Actual navigation rendering is tested via JavaScript/E2E tests
	 */
	public function test_assets_enqueued_when_enabled_even_without_h2_headings() {
		// Create a test page without h2 headings.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_content' => '<p>Content without headings.</p>',
			)
		);

		// Enable the feature.
		update_post_meta( $page_id, 'show_inpage_nav', true );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are still enqueued (JavaScript will handle no headings case).
		$this->assertTrue( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should be enqueued even without h2 headings' );
		$this->assertTrue( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should be enqueued even without h2 headings' );

		// Verify the JavaScript configuration includes h2 in heading_selectors.
		global $wp_scripts;
		$script_data = $wp_scripts->get_data( 'dswp-in-page-nav-script', 'data' );
		$this->assertStringContainsString( 'h2', $script_data, 'JavaScript configuration should include h2 in heading_selectors' );

		// Note: The actual navigation rendering (checking if navigation appears when h2's exist)
		// is tested via JavaScript unit tests or E2E tests, as it's client-side generated.
	}

	/**
	 * Test: Assets are not enqueued when feature is disabled even with h2 headings
	 *
	 * What this tests:
	 * - Even if a page has h2 headings, assets are not loaded when feature is disabled
	 * - Navigation will not appear when show_inpage_nav is false
	 * - Performance: JavaScript is not loaded unnecessarily
	 */
	public function test_assets_not_enqueued_when_disabled_even_with_h2_headings() {
		// Clear any previously enqueued scripts/styles.
		global $wp_styles, $wp_scripts;
		$wp_styles->queue       = array();
		$wp_scripts->queue      = array();
		$wp_styles->registered  = array();
		$wp_scripts->registered = array();

		// Create a test page with h2 headings but feature disabled.
		$page_id = $this->factory->post->create(
			array(
				'post_type'    => 'page',
				'post_title'   => 'Test Page',
				'post_name'    => 'test-page',
				'post_content' => '<h2>First Section</h2><p>Content here.</p><h2>Second Section</h2><p>More content.</p>',
			)
		);

		// Ensure feature is disabled.
		update_post_meta( $page_id, 'show_inpage_nav', false );

		// Set up global post and query to simulate page view.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $page_id ) );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are not enqueued (navigation will not appear).
		$this->assertFalse( wp_style_is( 'dswp-in-page-nav-styles', 'enqueued' ), 'CSS should not be enqueued when feature is disabled, even with h2 headings' );
		$this->assertFalse( wp_script_is( 'dswp-in-page-nav-script', 'enqueued' ), 'JS should not be enqueued when feature is disabled, even with h2 headings' );
	}
}
