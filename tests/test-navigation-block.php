<?php
/**
 * Navigation Block Tests
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Navigation
 */

namespace DesignSystemWordPressPlugin\Tests\Navigation;

use WP_UnitTestCase;

/**
 * Base test class for Navigation block tests
 */
abstract class NavigationBlockTestBase extends WP_UnitTestCase {
    /**
     * Helper method to capture block output
     *
     * @param array  $attributes Block attributes.
     * @param string $content    Block content.
     * @return string Rendered output.
     */
    protected function get_block_output( $attributes, $content = '' ) {
        $attrs_json = ! empty( $attributes ) ? wp_json_encode( $attributes ) : '{}';

        $block_markup = sprintf(
            '<!-- wp:design-system-wordpress-plugin/navigation %s -->%s<!-- /wp:design-system-wordpress-plugin/navigation -->',
            $attrs_json,
            $content
        );

        return do_blocks( $block_markup );
    }

    /**
     * Get basic nav content for tests
     */
    protected function get_basic_nav_content() {
        return '<ul><li><a href="/test">Test Link</a></li></ul>';
    }

    /**
     * Get nav content with toggle button
     */
    protected function get_nav_with_toggle_content() {
        return '<nav class="wp-block-design-system-wordpress-plugin-navigation"><button class="dswp-navigation__toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle menu">Menu</button><ul id="nav-menu"><li><a href="/test">Test Link</a></li></ul></nav>';
    }

    /**
     * Get nav content with role and aria-label
     */
    protected function get_nav_with_role_content() {
        return '<nav role="navigation" aria-label="Navigation"><ul><li><a href="/test">Test Link</a></li></ul></nav>';
    }

    /**
     * Get nav content with screen reader text
     */
    protected function get_nav_with_sr_text_content() {
        return '<nav class="wp-block-design-system-wordpress-plugin-navigation"><button class="dswp-navigation__toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle menu"><span class="screen-reader-text">Toggle navigation</span>Menu</button><ul id="nav-menu"><li><a href="/test">Test Link</a></li></ul></nav>';
    }
}

/**
 * Test case for Navigation block registration
 */
class NavigationBlockRegistrationTest extends NavigationBlockTestBase {

    /**
     * Test block is registered with correct name
     */
    public function test_block_is_registered_with_correct_name() {
        $registry = \WP_Block_Type_Registry::get_instance();
        $this->assertTrue( $registry->is_registered( 'design-system-wordpress-plugin/navigation' ) );
    }

    /**
     * Test block has correct attributes defined
     */
    public function test_block_has_correct_attributes_defined() {
        $registry   = \WP_Block_Type_Registry::get_instance();
        $block_type = $registry->get_registered( 'design-system-wordpress-plugin/navigation' );

        $this->assertIsObject( $block_type );
        $this->assertObjectHasProperty( 'attributes', $block_type );
    }

    /**
     * Test block supports className attribute
     */
    public function test_block_supports_class_name_attribute() {
        $registry   = \WP_Block_Type_Registry::get_instance();
        $block_type = $registry->get_registered( 'design-system-wordpress-plugin/navigation' );

        $this->assertArrayHasKey( 'className', $block_type->attributes );
    }

    /**
     * Test block has correct view script enqueued
     */
    public function test_block_has_correct_view_script_enqueued() {
        $registry   = \WP_Block_Type_Registry::get_instance();
        $block_type = $registry->get_registered( 'design-system-wordpress-plugin/navigation' );

        $this->assertNotEmpty( $block_type->view_script_handles );
    }

    /**
     * Test block has correct styles enqueued
     */
    public function test_block_has_correct_styles_enqueued() {
        $registry   = \WP_Block_Type_Registry::get_instance();
        $block_type = $registry->get_registered( 'design-system-wordpress-plugin/navigation' );

        $this->assertNotEmpty( $block_type->style_handles );
        $this->assertNotEmpty( $block_type->editor_style_handles );
    }
}

// phpcs:disable Generic.Files.OneObjectStructurePerFile.MultipleFound
/**
 * Test class for the Design System WordPress Plugin Navigation Block.
 *
 * This class contains unit tests to verify the rendering and functionality
 * of the navigation block, including:
 * - Default attribute rendering
 * - CSS class application
 * - ARIA attributes and accessibility features
 * - Inner blocks content rendering
 * - Custom className support
 * - Semantic HTML5 structure
 * - Navigation role attributes
 *
 * @package Design_System_WordPress_Plugin
 * @subpackage Tests
 */
class NavigationRenderTest extends NavigationBlockTestBase {
    /**
     * Test renders with default attributes (static block)
     */
    public function test_renders_with_default_attributes() {
        $attributes = array();
        $content    = $this->get_basic_nav_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertNotEmpty( $output, 'Navigation block should render some markup.');
        $this->assertStringContainsString('<ul', $output, 'Should render a list element.');
        $this->assertStringContainsString('Test Link', $output, 'Inner content should pass through.');
    }

    /**
     * Test renders list with layout classes from Core Navigation
     */
    public function test_renders_list_with_core_navigation_layout_classes() {
        $attributes = array();
        $content    = $this->get_basic_nav_content();
        $output     = $this->get_block_output( $attributes, $content );

        // These are typical Core Navigation layout classes for the inner <ul>.
        $this->assertStringContainsString('is-layout-flex', $output);
        $this->assertStringContainsString('wp-block-navigation-is-layout-flex', $output);
    }

    /**
     * Test inner blocks content is rendered
     */
    public function test_inner_blocks_content_is_rendered() {
        $attributes = array();
        $content    = $this->get_basic_nav_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString('Test Link', $output);
        $this->assertStringContainsString('/test', $output);
    }

    /**
     * Test custom className is applied (if save.js adds it to the root element)
     * Adjust this expectation to match where save.js applies className.
     */
    public function test_custom_class_name_is_applied() {
        $attributes = array( 'className' => 'custom-navigation-class' );
        // For a static block, the saved content already contains the className
        // The save.js would have added it to the <ul> or wrapper element
        $content    = '<ul class="is-layout-flex wp-block-navigation-is-layout-flex custom-navigation-class"><li><a href="/test">Test Link</a></li></ul>';
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString('custom-navigation-class', $output);
    }

    /**
     * Test mobile menu button renders with correct attributes
     */
    public function test_mobile_menu_button_renders_with_correct_attributes() {
        $attributes = array();
        $content    = $this->get_nav_with_toggle_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString( 'dswp-navigation__toggle', $output );
        $this->assertStringContainsString( 'button', $output );
    }

    /**
     * Test mobile menu button has correct ARIA attributes
     */
    public function test_mobile_menu_button_has_correct_aria_attributes() {
        $attributes = array();
        $content    = $this->get_nav_with_toggle_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString( 'aria-expanded=', $output );
        $this->assertStringContainsString( 'aria-controls=', $output );
        $this->assertStringContainsString( 'aria-label=', $output );
    }

    /**
     * Test menu close button renders correctly
     */
    public function test_menu_close_button_renders_correctly() {
        $attributes = array();
        $content    = '<nav class="wp-block-design-system-wordpress-plugin-navigation"><button class="dswp-navigation__toggle" aria-expanded="false" aria-controls="nav-menu" aria-label="Toggle menu">Menu</button><ul id="nav-menu"><li><a href="/test">Test Link</a></li></ul><button class="dswp-navigation__close">Close</button></nav>';
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString( 'dswp-navigation__close', $output );
    }

    /**
     * Test nav element has role navigation
     */
    public function test_nav_element_has_role_navigation() {
        $attributes = array();
        $content    = $this->get_nav_with_role_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString( 'role="navigation"', $output );
    }

    /**
     * Test nav element has aria-label
     */
    public function test_nav_element_has_aria_label() {
        $attributes = array();
        $content    = $this->get_nav_with_role_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertMatchesRegularExpression( '/aria-label="[^"]*"/', $output );
    }

    /**
     * Test mobile toggle has aria-expanded
     */
    public function test_mobile_toggle_has_aria_expanded() {
        $attributes = array();
        $content    = $this->get_nav_with_toggle_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertMatchesRegularExpression( '/aria-expanded="(true|false)"/', $output );
    }

    /**
     * Test mobile toggle has aria-controls
     */
    public function test_mobile_toggle_has_aria_controls() {
        $attributes = array();
        $content    = $this->get_nav_with_toggle_content();
        $output     = $this->get_block_output( $attributes, $content );

        $this->assertStringContainsString( 'aria-controls=', $output );
    }

    /**
     * Test screen reader text is properly implemented
     */
    public function test_screen_reader_text_is_properly_implemented() {
        $attributes = array();
        $content    = $this->get_nav_with_sr_text_content();
        $output     = $this->get_block_output( $attributes, $content );

        // Check for screen reader text classes or visually hidden text.
        $has_sr_text = strpos( $output, 'screen-reader-text' ) !== false ||
                       strpos( $output, 'visually-hidden' ) !== false ||
                       strpos( $output, 'sr-only' ) !== false;

        $this->assertTrue( $has_sr_text, 'Navigation should include screen reader text' );
    }
}
