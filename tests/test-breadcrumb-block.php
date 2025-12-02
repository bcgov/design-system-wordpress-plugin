<?php
/**
 * Breadcrumb Block Render Tests
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Breadcrumb
 */

namespace DesignSystemWordPressPlugin\Tests\Breadcrumb;

use WP_UnitTestCase;

/**
 * Test case for Breadcrumb block rendering
 */
class BreadcrumbRenderTest extends WP_UnitTestCase {

    /**
     * Test page IDs
     */
    private $grandparent_id;
    private $parent_id;
    private $child_id;

    /**
     * Set up test pages hierarchy
     */
    public function setUp(): void {
        parent::setUp();

        // Create page hierarchy: Grandparent > Parent > Child
        $this->grandparent_id = $this->factory->post->create(
            array(
                'post_type'  => 'page',
                'post_title' => 'Grandparent Page',
            )
        );

        $this->parent_id = $this->factory->post->create(
            array(
                'post_type'   => 'page',
                'post_title'  => 'Parent Page',
                'post_parent' => $this->grandparent_id,
            )
        );

        $this->child_id = $this->factory->post->create(
            array(
                'post_type'   => 'page',
                'post_title'  => 'Child Page',
                'post_parent' => $this->parent_id,
            )
        );
    }

    /**
     * Test breadcrumb renders with default slash divider
     */
    public function test_renders_with_default_slash_divider() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        $this->assertStringContainsString( 'dashicons-minus', $output );
        $this->assertStringContainsString( 'dswp-forward-slash', $output );
        $this->assertStringNotContainsString( 'dashicons-arrow-right-alt2', $output );

        wp_reset_postdata();
    }

    /**
     * Test breadcrumb renders with chevron divider
     */
    public function test_renders_with_chevron_divider() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array( 'dividerType' => 'chevron' );
        $output     = $this->get_block_output( $attributes );

        $this->assertStringContainsString( 'dashicons-arrow-right-alt2', $output );
        $this->assertStringNotContainsString( 'dswp-forward-slash', $output );

        wp_reset_postdata();
    }

    /**
     * Test current page renders as plain text by default
     */
    public function test_current_page_as_text_by_default() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        $this->assertStringContainsString( '<span class="current-page">', $output );
        $this->assertStringContainsString( 'Child Page', $output );
        $this->assertStringNotContainsString( 'current-page-link', $output );

        wp_reset_postdata();
    }

    /**
     * Test current page renders as link when enabled
     */
    public function test_current_page_as_link_when_enabled() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array( 'currentAsLink' => true );
        $output     = $this->get_block_output( $attributes );

        $this->assertStringContainsString( 'current-page-link', $output );
        $this->assertStringContainsString( '<a href="', $output );
        $this->assertStringNotContainsString( '<span class="current-page">', $output );

        wp_reset_postdata();
    }

    /**
     * Test breadcrumb builds correct hierarchy
     */
    public function test_builds_correct_hierarchy() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        // Check all pages appear in order
        $this->assertStringContainsString( 'Grandparent Page', $output );
        $this->assertStringContainsString( 'Parent Page', $output );
        $this->assertStringContainsString( 'Child Page', $output );

        // Check order is correct
        $grandparent_pos = strpos( $output, 'Grandparent Page' );
        $parent_pos      = strpos( $output, 'Parent Page' );
        $child_pos       = strpos( $output, 'Child Page' );

        $this->assertLessThan( $parent_pos, $grandparent_pos );
        $this->assertLessThan( $child_pos, $parent_pos );

        wp_reset_postdata();
    }

    /**
     * Test breadcrumb with no ancestors
     */
    public function test_renders_with_no_ancestors() {
        global $post;
        $post = get_post( $this->grandparent_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        $this->assertStringContainsString( 'Grandparent Page', $output );
        $this->assertStringNotContainsString( 'dswp-breadcrumb-separator', $output );

        wp_reset_postdata();
    }

    /**
     * Test correct number of separators
     */
    public function test_correct_number_of_separators() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        // Should have 2 separators for 3-level hierarchy
        $separator_count = substr_count( $output, 'dswp-breadcrumb-separator' );
        $this->assertEquals( 2, $separator_count );

        wp_reset_postdata();
    }

    /**
     * Test all URLs are properly escaped
     */
    public function test_urls_are_escaped() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array( 'currentAsLink' => true );
        $output     = $this->get_block_output( $attributes );

        // Count href attributes
        $href_count = substr_count( $output, 'href="' );
        $this->assertEquals( 3, $href_count );

        // Verify all hrefs contain valid URLs
        preg_match_all( '/href="([^"]+)"/', $output, $matches );
        foreach ( $matches[1] as $url ) {
            $this->assertStringStartsWith( 'http', $url );
        }

        wp_reset_postdata();
    }

    /**
     * Test HTML structure and classes
     */
    public function test_html_structure_and_classes() {
        global $post;
        $post = get_post( $this->child_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        $this->assertStringContainsString( 'wp-block-design-system-wordpress-plugin-breadcrumb', $output );
        $this->assertStringContainsString( 'dswp-block-breadcrumb__container', $output );
        $this->assertStringContainsString( 'is-loaded', $output );

        wp_reset_postdata();
    }

    /**
     * Test title escaping
     */
    public function test_titles_are_escaped() {
        $malicious_id = $this->factory->post->create(
            array(
                'post_type'  => 'page',
                'post_title' => '<script>alert("xss")</script>',
            )
        );

        global $post;
        $post = get_post( $malicious_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        $this->assertStringNotContainsString( '<script>', $output );
        $this->assertStringContainsString( '&lt;script&gt;', $output );

        wp_reset_postdata();
    }

    /**
     * Test with parent page
     */
    public function test_renders_parent_page_correctly() {
        global $post;
        $post = get_post( $this->parent_id );
        setup_postdata( $post );

        $attributes = array();
        $output     = $this->get_block_output( $attributes );

        // Should have grandparent and parent
        $this->assertStringContainsString( 'Grandparent Page', $output );
        $this->assertStringContainsString( 'Parent Page', $output );
        $this->assertStringNotContainsString( 'Child Page', $output );

        // Should have 1 separator
        $separator_count = substr_count( $output, 'dswp-breadcrumb-separator' );
        $this->assertEquals( 1, $separator_count );

        wp_reset_postdata();
    }

    /**
     * Helper method to capture block output
     *
     * @param array $attributes Block attributes.
     * @return string Rendered output.
     */
    private function get_block_output( $attributes ) {
        ob_start();
        include __DIR__ . '/../Blocks/src/BreadCrumb/render.php';
        return ob_get_clean();
    }
}
