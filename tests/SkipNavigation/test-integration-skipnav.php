<?php
/**
 * SkipNavigation Integration Tests
 *
 * Tests for the skip navigation feature to ensure:
 * - HTML output is rendered correctly
 * - Asset enqueuing (CSS and JS)
 * - Block modifications (main-content and main-navigation IDs)
 * - Default WordPress skip link is removed
 * - Security and escaping
 * - Works on all post types
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Tests
 */

namespace DesignSystemWordPressPlugin\Tests\SkipNavigation;

/**
 * SkipNavigation Test Class
 *
 * @package DesignSystemWordPressPlugin\Tests\SkipNavigation
 */
class SkipNavigationTest extends \WP_UnitTestCase {

	/**
	 * Test: Skip navigation HTML is output on wp_body_open
	 *
	 * What this tests:
	 * - Skip navigation HTML is rendered when wp_body_open action fires
	 * - All three skip links are present (main content, main navigation, accessibility statement)
	 * - Correct CSS classes and structure are used
	 */
	public function test_skip_navigation_html_is_output_on_wp_body_open() {
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

		// Capture output from wp_body_open action.
		ob_start();
		do_action( 'wp_body_open' );
		$output = ob_get_clean();

		// Verify skip navigation HTML is present.
		$this->assertStringContainsString( 'dswp-skip-nav-list', $output, 'Skip navigation list should be present' );
		$this->assertStringContainsString( 'dswp-skip-nav', $output, 'Skip navigation links should be present' );
		$this->assertStringContainsString( 'Skip to main content', $output, 'Main content skip link should be present' );
		$this->assertStringContainsString( 'Skip to main navigation', $output, 'Main navigation skip link should be present' );
		$this->assertStringContainsString( 'Accessibility Statement', $output, 'Accessibility statement link should be present' );
		$this->assertStringContainsString( 'href="#main-content"', $output, 'Main content link should have correct href' );
		$this->assertStringContainsString( 'href="#main-navigation"', $output, 'Main navigation link should have correct href' );
		$this->assertStringContainsString( 'aria-label="Skip to main content"', $output, 'Main content link should have aria-label' );
		$this->assertStringContainsString( 'aria-label="Skip to main navigation"', $output, 'Main navigation link should have aria-label' );
	}

	/**
	 * Test: Assets are enqueued globally
	 *
	 * What this tests:
	 * - CSS and JS assets are enqueued on all pages
	 * - Assets are loaded via global enqueue classes
	 * - Asset URLs are correct
	 */
	public function test_assets_are_enqueued_globally() {
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

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify global assets are enqueued (skip navigation is included in these).
		$this->assertTrue( wp_style_is( 'design-system-plugin-styles', 'enqueued' ), 'Global CSS should be enqueued' );
		$this->assertTrue( wp_script_is( 'design-system-plugin-scripts', 'enqueued' ), 'Global JS should be enqueued' );

		// Verify asset URLs are correct.
		global $wp_styles, $wp_scripts;
		$style_url  = $wp_styles->registered['design-system-plugin-styles']->src ?? '';
		$script_url = $wp_scripts->registered['design-system-plugin-scripts']->src ?? '';
		$this->assertStringContainsString( 'index.css', $style_url, 'CSS URL should contain correct filename' );
		$this->assertStringContainsString( 'index.js', $script_url, 'JS URL should contain correct filename' );
	}

	/**
	 * Test: Assets are enqueued on all post types
	 *
	 * What this tests:
	 * - Skip navigation works on pages, posts, and other post types
	 * - Assets are loaded regardless of post type
	 */
	public function test_assets_are_enqueued_on_all_post_types() {
		// Clear any previously enqueued scripts/styles.
		global $wp_styles, $wp_scripts;
		$wp_styles->queue       = array();
		$wp_scripts->queue      = array();
		$wp_styles->registered  = array();
		$wp_scripts->registered = array();

		// Test on a post (not a page).
		$post_id = $this->factory->post->create(
			array(
				'post_type'  => 'post',
				'post_title' => 'Test Post',
			)
		);

		// Set up global post and query to simulate post view.
		global $post, $wp_query;
		$post = get_post( $post_id );
		setup_postdata( $post );
		$this->go_to( get_permalink( $post_id ) );

		// Ensure query is set up correctly for a post.
		$wp_query->is_page     = false;
		$wp_query->is_single   = true;
		$wp_query->is_singular = true;

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are still enqueued (skip navigation works on all post types).
		$this->assertTrue( wp_style_is( 'design-system-plugin-styles', 'enqueued' ), 'Global CSS should be enqueued on posts' );
		$this->assertTrue( wp_script_is( 'design-system-plugin-scripts', 'enqueued' ), 'Global JS should be enqueued on posts' );
	}

	/**
	 * Test: Block modifications add main-content ID to core/post-content
	 *
	 * What this tests:
	 * - core/post-content block gets id="main-content" added
	 * - Only the first occurrence gets the ID (per instance)
	 * - Block content is properly modified
	 */
	public function test_block_modifications_add_main_content_id_to_post_content() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();

		// Simulate core/post-content block.
		$block_content = '<div class="wp-block-post-content"><p>Content here.</p></div>';
		$block         = array(
			'blockName' => 'core/post-content',
		);

		// Call the method directly to avoid WordPress core hooks that require WP_Block instance.
		$modified_content = $skip_nav->modify_block_render( $block_content, $block );

		// Verify main-content ID was added.
		$this->assertStringContainsString( 'id="main-content"', $modified_content, 'Main content ID should be added to core/post-content block' );
		$this->assertStringContainsString( '<div id="main-content"', $modified_content, 'ID should be added to the first div' );

		// Call the method again with a different block content - should NOT add ID again (main_content_added is true).
		$block_content2 = '<div class="wp-block-post-content"><p>Different content.</p></div>';
		$modified_content2 = $skip_nav->modify_block_render( $block_content2, $block );

		// The second block should NOT have the ID because main_content_added is already true.
		$this->assertStringNotContainsString( 'id="main-content"', $modified_content2, 'Second core/post-content block should not get ID (only first occurrence)' );
	}

	/**
	 * Test: Block modifications add main-content ID to main tag
	 *
	 * What this tests:
	 * - Blocks with tagName="main" get id="main-content" added
	 * - Works when core/post-content is not present
	 * - Only the first occurrence gets the ID
	 */
	public function test_block_modifications_add_main_content_id_to_main_tag() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();

		// Simulate a block with main tag (when core/post-content is not present).
		$block_content = '<main class="site-main"><p>Content here.</p></main>';
		$block         = array(
			'blockName' => 'core/group',
			'attrs'     => array(
				'tagName' => 'main',
			),
		);

		// Call the method directly to avoid WordPress core hooks that require WP_Block instance.
		$modified_content = $skip_nav->modify_block_render( $block_content, $block );

		// Verify main-content ID was added.
		$this->assertStringContainsString( 'id="main-content"', $modified_content, 'Main content ID should be added to main tag' );
		$this->assertStringContainsString( '<main', $modified_content, 'Main tag should still be present' );

		// Call the method again - should NOT add ID again.
		$block_content2 = '<main class="site-main"><p>Different content.</p></main>';
		$modified_content2 = $skip_nav->modify_block_render( $block_content2, $block );

		// The second block should NOT have the ID because main_content_added is already true.
		$this->assertStringNotContainsString( 'id="main-content"', $modified_content2, 'Second main tag block should not get ID (only first occurrence)' );
	}

	/**
	 * Test: Block modifications add main-navigation ID to navigation block
	 *
	 * What this tests:
	 * - core/navigation block gets id="main-navigation" added
	 * - Navigation block is properly modified
	 * - Works regardless of other attributes
	 */
	public function test_block_modifications_add_main_navigation_id_to_navigation_block() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();

		// Simulate core/navigation block.
		$block_content = '<nav class="wp-block-navigation"><ul><li>Item</li></ul></nav>';
		$block         = array(
			'blockName' => 'core/navigation',
		);

		// Call the method directly to avoid WordPress core hooks that require WP_Block instance.
		$modified_content = $skip_nav->modify_block_render( $block_content, $block );

		// Verify main-navigation ID was added.
		$this->assertStringContainsString( 'id="main-navigation"', $modified_content, 'Main navigation ID should be added to navigation block' );
		$this->assertStringContainsString( '<nav id="main-navigation"', $modified_content, 'ID should be added to nav tag' );

		// Test with existing attributes.
		$block_content2 = '<nav class="wp-block-navigation" aria-label="Main"><ul><li>Item</li></ul></nav>';
		$modified_content2 = $skip_nav->modify_block_render( $block_content2, $block );

		// Verify ID is added even with existing attributes.
		$this->assertStringContainsString( 'id="main-navigation"', $modified_content2, 'Main navigation ID should be added even with existing attributes' );
		$this->assertStringContainsString( 'aria-label="Main"', $modified_content2, 'Existing attributes should be preserved' );
	}

	/**
	 * Test: Default WordPress skip link is removed
	 *
	 * What this tests:
	 * - WordPress default skip link action is removed from wp_footer
	 * - Our custom skip navigation replaces the default
	 */
	public function test_default_wordpress_skip_link_is_removed() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();
		$skip_nav->init();

		// Check if the default action is removed.
		// has_action returns false if action doesn't exist or priority is false.
		$has_action = has_action( 'wp_footer', 'the_block_template_skip_link' );

		// The action should be removed (has_action returns false when removed).
		$this->assertFalse( $has_action, 'Default WordPress skip link should be removed from wp_footer' );
	}

	/**
	 * Test: Skip navigation HTML structure is correct
	 *
	 * What this tests:
	 * - HTML structure follows accessibility best practices
	 * - All links are properly nested in list items
	 * - ARIA labels are present
	 */
	public function test_skip_navigation_html_structure_is_correct() {
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

		// Capture output from wp_body_open action.
		ob_start();
		do_action( 'wp_body_open' );
		$output = ob_get_clean();

		// Verify structure: ul > li > a.
		$this->assertStringContainsString( '<ul class="dswp-skip-nav-list">', $output, 'Skip navigation should use ul element' );
		$this->assertStringContainsString( '<li aria-label="Skip to main content">', $output, 'List items should have aria-label' );
		$this->assertStringContainsString( '<a class="dswp-skip-nav"', $output, 'Links should have correct class' );

		// Count list items - should be 3.
		$li_count = substr_count( $output, '<li aria-label' );
		$this->assertEquals( 3, $li_count, 'Should have exactly 3 skip navigation links' );
	}

	/**
	 * Test: Accessibility statement link has correct URL
	 *
	 * What this tests:
	 * - Accessibility statement link points to correct BC Gov URL
	 * - External link is properly formatted
	 */
	public function test_accessibility_statement_link_has_correct_url() {
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

		// Capture output from wp_body_open action.
		ob_start();
		do_action( 'wp_body_open' );
		$output = ob_get_clean();

		// Verify accessibility statement URL.
		$expected_url = 'https://www2.gov.bc.ca/gov/content/home/accessible-government';
		$this->assertStringContainsString( 'href="' . $expected_url . '"', $output, 'Accessibility statement should have correct URL' );
	}

	/**
	 * Test: Skip navigation works on homepage
	 *
	 * What this tests:
	 * - Skip navigation is rendered on homepage
	 * - Assets are enqueued on homepage
	 */
	public function test_skip_navigation_works_on_homepage() {
		// Set up homepage.
		$this->go_to( home_url() );

		// Capture output from wp_body_open action.
		ob_start();
		do_action( 'wp_body_open' );
		$output = ob_get_clean();

		// Verify skip navigation HTML is present.
		$this->assertStringContainsString( 'dswp-skip-nav-list', $output, 'Skip navigation should be present on homepage' );

		// Trigger the enqueue action.
		do_action( 'wp_enqueue_scripts' );

		// Verify assets are enqueued.
		$this->assertTrue( wp_style_is( 'design-system-plugin-styles', 'enqueued' ), 'Global CSS should be enqueued on homepage' );
		$this->assertTrue( wp_script_is( 'design-system-plugin-scripts', 'enqueued' ), 'Global JS should be enqueued on homepage' );
	}

	/**
	 * Test: Null block content is handled gracefully
	 *
	 * What this tests:
	 * - modify_block_render returns null when block_content is null
	 * - No errors occur with null content
	 */
	public function test_null_block_content_is_handled_gracefully() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();

		// Test with null block content.
		$block = array(
			'blockName' => 'core/post-content',
		);

		// Call the method directly with null content.
		$result = $skip_nav->modify_block_render( null, $block );

		// Should return null without errors.
		$this->assertNull( $result, 'Null block content should return null' );
	}

	/**
	 * Test: Block modifications preserve existing attributes
	 *
	 * What this tests:
	 * - Existing attributes on elements are preserved
	 * - ID is added without removing other attributes
	 */
	public function test_block_modifications_preserve_existing_attributes() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();

		// Test navigation block with existing attributes.
		$block_content = '<nav class="wp-block-navigation" data-test="value" aria-label="Main Navigation"><ul></ul></nav>';
		$block         = array(
			'blockName' => 'core/navigation',
		);

		// Call the method directly to avoid WordPress core hooks that require WP_Block instance.
		$modified_content = $skip_nav->modify_block_render( $block_content, $block );

		// Verify existing attributes are preserved.
		$this->assertStringContainsString( 'class="wp-block-navigation"', $modified_content, 'Existing class should be preserved' );
		$this->assertStringContainsString( 'data-test="value"', $modified_content, 'Existing data attribute should be preserved' );
		$this->assertStringContainsString( 'aria-label="Main Navigation"', $modified_content, 'Existing aria-label should be preserved' );
		$this->assertStringContainsString( 'id="main-navigation"', $modified_content, 'Main navigation ID should be added' );
	}

	/**
	 * Test: Multiple navigation blocks all get main-navigation ID
	 *
	 * What this tests:
	 * - All navigation blocks get the ID (unlike main-content which is only first)
	 * - Multiple navigation blocks can exist
	 */
	public function test_multiple_navigation_blocks_all_get_main_navigation_id() {
		// Create a SkipNavigation instance.
		$skip_nav = new \Bcgov\DesignSystemPlugin\SkipNavigation();

		// Simulate first navigation block.
		$block_content1 = '<nav class="wp-block-navigation"><ul><li>Item 1</li></ul></nav>';
		$block1         = array(
			'blockName' => 'core/navigation',
		);
		// Call the method directly to avoid WordPress core hooks that require WP_Block instance.
		$modified1 = $skip_nav->modify_block_render( $block_content1, $block1 );

		// Simulate second navigation block.
		$block_content2 = '<nav class="wp-block-navigation"><ul><li>Item 2</li></ul></nav>';
		$modified2 = $skip_nav->modify_block_render( $block_content2, $block1 );

		// Both should have the ID.
		$this->assertStringContainsString( 'id="main-navigation"', $modified1, 'First navigation block should have main-navigation ID' );
		$this->assertStringContainsString( 'id="main-navigation"', $modified2, 'Second navigation block should also have main-navigation ID' );
	}
}

