<?php
/**
 * Breadcrumb Block Integration Tests
 *
 * Tests for the breadcrumb block to ensure:
 * - HTML structure is correct
 * - URLs and content are properly escaped
 * - Block configurations work as expected
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Tests
 */

namespace DesignSystemWordPressPlugin\Tests\Blocks\BreadCrumb;

/**
 * Breadcrumb Block Test Class
 *
 * @package DesignSystemWordPressPlugin\Tests\Blocks\BreadCrumb
 */
class BreadCrumbTest extends \WP_UnitTestCase {

	/**
	 * Set up test environment
	 */
	public function set_up() {
		parent::set_up();

		// Register the breadcrumb block.
		// __DIR__ = tests/Blocks/BreadCrumb.
		// dirname(__DIR__) = tests/Blocks.
		// dirname(dirname(__DIR__)) = tests.
		// dirname(dirname(dirname(__DIR__))) = plugin root.
		$plugin_root = dirname( dirname( dirname( __DIR__ ) ) );
		require_once $plugin_root . '/design-system-wordpress-plugin.php';
	}


	/**
	 * Test: Single page breadcrumb renders correct HTML structure
	 *
	 * What this tests:
	 * - Main container div with correct class
	 * - Container div with is-loaded class
	 * - Current page as span (not link) when currentAsLink is false
	 * - Proper nesting of HTML elements
	 */
	public function test_single_page_renders_correct_html_structure() {
		// Create a test page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify main container structure.
		$this->assertStringContainsString( '<div class="wp-block-design-system-wordpress-plugin-breadcrumb">', $output, 'Should contain main block wrapper class' );
		$this->assertStringContainsString( '<div class="dswp-block-breadcrumb__container is-loaded">', $output, 'Should contain container with is-loaded class' );

		// Verify current page is rendered as span (not link).
		$this->assertStringContainsString( '<span class="current-page">', $output, 'Should render current page as span when currentAsLink is false' );
		$this->assertStringNotContainsString( '<a href', $output, 'Should not contain links when only one page exists' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $page_id, true );
	}

	/**
	 * Test: Page hierarchy breadcrumb renders correct HTML structure
	 *
	 * What this tests:
	 * - Main container and wrapper divs
	 * - Parent page as clickable link
	 * - Separator between parent and child
	 * - Current (child) page as span (not link)
	 * - Proper hierarchy order (parent before child)
	 */
	public function test_page_hierarchy_renders_correct_html_structure() {
		// Create parent page.
		$parent_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Parent Page',
				'post_name'  => 'parent-page',
			)
		);

		// Create child page.
		$child_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_name'   => 'child-page',
				'post_parent' => $parent_id,
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $child_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify structure.
		$this->assertStringContainsString( '<div class="wp-block-design-system-wordpress-plugin-breadcrumb">', $output, 'Should contain main block wrapper class' );
		$this->assertStringContainsString( '<div class="dswp-block-breadcrumb__container is-loaded">', $output, 'Should contain container with is-loaded class' );

		// Verify parent link exists.
		$this->assertStringContainsString( '<a href', $output, 'Should contain parent page as clickable link' );
		$this->assertStringContainsString( 'Parent Page', $output, 'Should display parent page title' );

		// Verify separator exists.
		$this->assertStringContainsString( '<span class="dswp-breadcrumb-separator">', $output, 'Should contain separator element' );
		$this->assertStringContainsString( '/', $output, 'Should contain separator character' );

		// Verify current page is rendered as span.
		$this->assertStringContainsString( '<span class="current-page">', $output, 'Should render current page as span when currentAsLink is false' );
		$this->assertStringContainsString( 'Child Page', $output, 'Should display child page title' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $child_id, true );
		wp_delete_post( $parent_id, true );
	}

	/**
	 * Test: URLs in breadcrumb links are properly escaped
	 *
	 * What this tests:
	 * - URLs are sanitized using esc_url()
	 * - XSS protection in URL attributes
	 * - Valid HTML attribute formatting
	 * - No unescaped special characters that could break HTML
	 */
	public function test_urls_in_links_are_properly_escaped() {
		// Create a page with special characters in URL.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Create child page.
		$child_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_name'   => 'child-page',
				'post_parent' => $page_id,
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $child_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Get the parent page URL.
		$parent_url = get_permalink( $page_id );

		// Verify URL is properly escaped using esc_url.
		$escaped_url = esc_url( $parent_url );
		$this->assertStringContainsString( 'href="' . $escaped_url . '"', $output, 'Should use esc_url() to escape URLs in href attributes' );

		// Verify URL is properly escaped (esc_url sanitizes URLs).
		// Check that the href attribute is properly formatted.
		$this->assertMatchesRegularExpression( '/href="[^"]*"/', $output, 'URL should be properly escaped in href attribute' );
		// Verify no unescaped ampersands or other dangerous characters.
		$this->assertStringNotContainsString( '<a href="&', $output, 'Should not contain unescaped ampersands in URLs' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $child_id, true );
		wp_delete_post( $page_id, true );
	}

	/**
	 * Test: Page titles with dangerous content are properly escaped
	 *
	 * What this tests:
	 * - Page titles containing HTML/JavaScript are escaped using esc_html()
	 * - XSS protection against script tag injection
	 * - Script tags cannot execute in the browser
	 * - Proper HTML entity encoding
	 */
	public function test_dangerous_content_in_titles_is_properly_escaped() {
		// Create a page with potentially dangerous content.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => '<script>alert("XSS")</script>Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify content is properly escaped.
		$escaped_title = esc_html( get_the_title( $page_id ) );
		$this->assertStringContainsString( $escaped_title, $output, 'Should use esc_html() to escape page titles' );

		// Verify script tags are escaped and not executed.
		// esc_html() converts <script> to &lt;script&gt; so it won't execute.
		$this->assertStringNotContainsString( '<script>', $output, 'Should escape opening script tags' );
		$this->assertStringNotContainsString( '</script>', $output, 'Should escape closing script tags' );
		// Verify that dangerous content cannot execute (script tags are HTML entities).
		// The exact format may vary, but the key is that <script> is not present as raw HTML.
		$this->assertStringNotContainsString( 'alert("XSS")', $output, 'Raw JavaScript should not be present in output' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $page_id, true );
	}

	/**
	 * Test: Dangerous content in breadcrumb links is properly escaped
	 *
	 * What this tests:
	 * - Page titles in links containing dangerous HTML are escaped using esc_html()
	 * - XSS protection against image tag injection with onerror attributes
	 * - Malicious code cannot execute in the browser
	 * - Attribute values are properly escaped
	 */
	public function test_dangerous_content_in_links_is_properly_escaped() {
		// Create parent page with potentially dangerous content.
		$parent_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Parent <img src="x" onerror="alert(1)"> Page',
				'post_name'  => 'parent-page',
			)
		);

		// Create child page.
		$child_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_name'   => 'child-page',
				'post_parent' => $parent_id,
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $child_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify parent title is properly escaped in link.
		$escaped_title = esc_html( get_the_title( $parent_id ) );
		$this->assertStringContainsString( $escaped_title, $output, 'Should use esc_html() to escape titles in links' );

		// Verify dangerous HTML is escaped and cannot execute.
		// esc_html() converts <img to &lt;img so it won't render as an image tag.
		$this->assertStringNotContainsString( '<img', $output, 'Should escape image tags to prevent XSS' );
		$this->assertStringNotContainsString( 'onerror=', $output, 'Should escape onerror attributes to prevent XSS' );
		// Verify that the escaped version is present (esc_html converts < to &lt;).
		$this->assertStringNotContainsString( 'src="x"', $output, 'Attribute values should be escaped' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $child_id, true );
		wp_delete_post( $parent_id, true );
	}

	/**
	 * Test: currentAsLink=false renders current page as text (not link)
	 *
	 * What this tests:
	 * - When currentAsLink attribute is false (default), current page is rendered as <span>
	 * - Current page is not a clickable link
	 * - No link elements are present in single-page breadcrumb
	 */
	public function test_current_as_link_false_renders_current_page_as_text() {
		// Create a test page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );

		// Capture output with currentAsLink = false.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify current page is rendered as span (not link).
		$this->assertStringContainsString( '<span class="current-page">', $output, 'Should render current page as span when currentAsLink is false' );
		$this->assertStringNotContainsString( '<a href', $output, 'Should not contain links when currentAsLink is false' );
		$this->assertStringNotContainsString( 'current-page-link', $output, 'Should not have current-page-link class when currentAsLink is false' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $page_id, true );
	}

	/**
	 * Test: currentAsLink=true renders current page as clickable link
	 *
	 * What this tests:
	 * - When currentAsLink attribute is true, current page is rendered as <a> link
	 * - Link has proper URL escaping using esc_url()
	 * - Link has correct CSS class (current-page-link)
	 * - Current page is clickable
	 */
	public function test_current_as_link_true_renders_current_page_as_link() {
		// Create a test page.
		$page_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Test Page',
				'post_name'  => 'test-page',
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $page_id );
		setup_postdata( $post );

		// Capture output with currentAsLink = true.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => true ) );
		$output = ob_get_clean();

		// Verify current page is rendered as link.
		$this->assertStringContainsString( '<a href', $output, 'Should render current page as link when currentAsLink is true' );
		$this->assertStringContainsString( 'class="current-page-link"', $output, 'Should have current-page-link class when currentAsLink is true' );
		$this->assertStringNotContainsString( '<span class="current-page">', $output, 'Should not render as span when currentAsLink is true' );

		// Verify URL is properly escaped.
		$page_url = get_permalink( $page_id );
		$this->assertStringContainsString( 'href="' . esc_url( $page_url ) . '"', $output, 'Should use esc_url() to escape current page URL' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $page_id, true );
	}

	/**
	 * Test: currentAsLink configuration works correctly with page hierarchy
	 *
	 * What this tests:
	 * - currentAsLink setting affects only the current page, not ancestors
	 * - Ancestor pages always remain as links regardless of currentAsLink setting
	 * - Both false and true values work correctly with hierarchies
	 * - Correct number of links based on configuration
	 */
	public function test_current_as_link_configuration_works_with_page_hierarchy() {
		// Create parent page.
		$parent_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Parent Page',
				'post_name'  => 'parent-page',
			)
		);

		// Create child page.
		$child_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_name'   => 'child-page',
				'post_parent' => $parent_id,
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $child_id );
		setup_postdata( $post );

		// Test with currentAsLink = false.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output_false = ob_get_clean();

		// Verify parent is link, child is span.
		$this->assertStringContainsString( '<a href', $output_false, 'Parent should always be a link' );
		$this->assertStringContainsString( '<span class="current-page">', $output_false, 'Child should be span when currentAsLink is false' );
		$this->assertStringNotContainsString( 'current-page-link', $output_false, 'Should not have current-page-link class when currentAsLink is false' );

		// Test with currentAsLink = true.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => true ) );
		$output_true = ob_get_clean();

		// Verify both parent and child are links.
		$link_count = substr_count( $output_true, '<a href' );
		$this->assertEquals( 2, $link_count, 'Should have 2 links (parent and child) when currentAsLink is true' );
		$this->assertStringContainsString( 'class="current-page-link"', $output_true, 'Should have current-page-link class when currentAsLink is true' );
		$this->assertStringNotContainsString( '<span class="current-page">', $output_true, 'Should not render as span when currentAsLink is true' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $child_id, true );
		wp_delete_post( $parent_id, true );
	}

	/**
	 * Test: Breadcrumb separators render correctly between items
	 *
	 * What this tests:
	 * - Separators (/) are rendered between parent and child pages
	 * - Separators are not rendered after the last (current) page
	 * - Correct HTML structure and positioning
	 * - Separator appears after links, before next item
	 */
	public function test_separators_render_correctly_between_breadcrumb_items() {
		// Create parent page.
		$parent_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Parent Page',
				'post_name'  => 'parent-page',
			)
		);

		// Create child page.
		$child_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_name'   => 'child-page',
				'post_parent' => $parent_id,
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $child_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify separator is present.
		$this->assertStringContainsString( '<span class="dswp-breadcrumb-separator">', $output, 'Should contain separator element' );
		$this->assertStringContainsString( '/', $output, 'Should contain separator character' );

		// Verify separator is between parent and child (not after child).
		$separator_position = strpos( $output, '<span class="dswp-breadcrumb-separator">' );
		$parent_link_end    = strpos( $output, '</a>' );
		$child_span_start   = strpos( $output, '<span class="current-page">' );

		$this->assertGreaterThan( $parent_link_end, $separator_position, 'Separator should be after parent link' );
		$this->assertLessThan( $child_span_start, $separator_position, 'Separator should be before child span' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $child_id, true );
		wp_delete_post( $parent_id, true );
	}

	/**
	 * Test: Deep page hierarchy (3+ levels) renders correctly
	 *
	 * What this tests:
	 * - Breadcrumbs with multiple levels (grandparent > parent > child) render correctly
	 * - All ancestor pages appear in correct order (top to bottom)
	 * - Correct number of separators (n-1 for n levels)
	 * - Proper hierarchy structure maintained
	 */
	public function test_deep_page_hierarchy_renders_all_levels_correctly() {
		// Create grandparent page.
		$grandparent_id = $this->factory->post->create(
			array(
				'post_type'  => 'page',
				'post_title' => 'Grandparent Page',
				'post_name'  => 'grandparent-page',
			)
		);

		// Create parent page.
		$parent_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Parent Page',
				'post_name'   => 'parent-page',
				'post_parent' => $grandparent_id,
			)
		);

		// Create child page.
		$child_id = $this->factory->post->create(
			array(
				'post_type'   => 'page',
				'post_title'  => 'Child Page',
				'post_name'   => 'child-page',
				'post_parent' => $parent_id,
			)
		);

		// Set up global post.
		global $post;
		$post = get_post( $child_id );
		setup_postdata( $post );

		// Capture output.
		ob_start();
		$this->render_breadcrumb_block( array( 'currentAsLink' => false ) );
		$output = ob_get_clean();

		// Verify all ancestors are present.
		$this->assertStringContainsString( 'Grandparent Page', $output, 'Should contain grandparent page title' );
		$this->assertStringContainsString( 'Parent Page', $output, 'Should contain parent page title' );
		$this->assertStringContainsString( 'Child Page', $output, 'Should contain child page title' );

		// Verify correct order (grandparent -> parent -> child).
		$grandparent_pos = strpos( $output, 'Grandparent Page' );
		$parent_pos      = strpos( $output, 'Parent Page' );
		$child_pos       = strpos( $output, 'Child Page' );

		$this->assertLessThan( $parent_pos, $grandparent_pos, 'Grandparent should come before parent in hierarchy' );
		$this->assertLessThan( $child_pos, $parent_pos, 'Parent should come before child in hierarchy' );

		// Verify correct number of separators (2 for 3 levels).
		$separator_count = substr_count( $output, '<span class="dswp-breadcrumb-separator">' );
		$this->assertEquals( 2, $separator_count, 'Should have 2 separators for 3-level hierarchy (n-1 separators for n levels)' );

		// Clean up.
		wp_reset_postdata();
		wp_delete_post( $child_id, true );
		wp_delete_post( $parent_id, true );
		wp_delete_post( $grandparent_id, true );
	}

	/**
	 * Helper method to render the breadcrumb block
	 *
	 * @param array $attributes Block attributes.
	 */
	private function render_breadcrumb_block( $attributes = array() ) {
		// Set up attributes for the render template.
		$attributes = wp_parse_args(
			$attributes,
			array(
				'currentAsLink' => false,
			)
		);

		// Get plugin root directory.
		// __DIR__ = tests/Blocks/BreadCrumb.
		// dirname(__DIR__) = tests/Blocks.
		// dirname(dirname(__DIR__)) = tests.
		// dirname(dirname(dirname(__DIR__))) = plugin root.
		$plugin_root = dirname( dirname( dirname( __DIR__ ) ) );

		// Include the render template.
		// Try build path first (production), then src path (development).
		$render_path = $plugin_root . '/Blocks/build/BreadCrumb/render.php';

		if ( ! file_exists( $render_path ) ) {
			// Try src path if build doesn't exist.
			$render_path = $plugin_root . '/Blocks/src/BreadCrumb/render.php';
		}

		if ( file_exists( $render_path ) ) {
			// The render template expects $attributes to be in scope.
			include $render_path;
		} else {
			$this->fail( 'Breadcrumb render template not found at: ' . $render_path );
		}
	}
}
