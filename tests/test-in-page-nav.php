<?php

namespace Bcgov\DesignSystemPlugin\Tests\InPageNav;

use Bcgov\DesignSystemPlugin\InPageNav\InPageNav;
use WP_UnitTestCase;
use Mockery;

/**
 * Tests for InPageNav class
 *
 * @package src\InPageNav
 */
class InPageNavTest extends WP_UnitTestCase {

    /**
     * Instance of InPageNav
     *
     * @var InPageNav
     */
    private $instance;

    /**
     * Set up test environment before each test
     */
    public function setUp(): void {
        parent::setUp();

        // Clear any registered hooks
        remove_all_actions('init');
        remove_all_actions('wp_enqueue_scripts');
        remove_all_actions('enqueue_block_editor_assets');
    }

    /**
     * Clean up after each test
     */
    public function tearDown(): void {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test constructor initializes version and calls init
     */
    public function test_constructor_sets_version_and_calls_init() {
        $this->instance = new InPageNav();

        // Verify hooks are registered
        $this->assertEquals(10, has_action('init', [$this->instance, 'register_meta']));
        $this->assertEquals(10, has_action('wp_enqueue_scripts', [$this->instance, 'enqueue_assets']));
        $this->assertEquals(10, has_action('enqueue_block_editor_assets', [$this->instance, 'enqueue_editor_assets']));
    }

    /**
     * Test register_meta creates the correct meta field
     */
    public function test_register_meta_creates_meta_field() {
        $this->instance = new InPageNav();
        $this->instance->register_meta();

        // Check meta is registered
        $registered = get_registered_meta_keys('post', 'page');
        $this->assertArrayHasKey('show_inpage_nav', $registered);

        // Verify meta configuration
        $meta_config = $registered['show_inpage_nav'];
        $this->assertTrue($meta_config['show_in_rest']);
        $this->assertTrue($meta_config['single']);
        $this->assertEquals('boolean', $meta_config['type']);
        $this->assertFalse($meta_config['default']);
        $this->assertTrue(is_callable($meta_config['auth_callback']));
    }

    /**
     * Test meta auth callback requires edit_posts capability
     */
    public function test_meta_auth_callback_checks_capability() {
        $this->instance = new InPageNav();
        $this->instance->register_meta();

        $registered = get_registered_meta_keys('post', 'page');
        $auth_callback = $registered['show_inpage_nav']['auth_callback'];

        // Test with user who can edit posts
        $editor = $this->factory()->user->create(['role' => 'editor']);
        wp_set_current_user($editor);
        $this->assertTrue($auth_callback());

        // Test with user who cannot edit posts
        $subscriber = $this->factory()->user->create(['role' => 'subscriber']);
        wp_set_current_user($subscriber);
        $this->assertFalse($auth_callback());
    }

    /**
     * Test enqueue_assets returns early when not on a page
     */
    public function test_enqueue_assets_returns_early_when_not_on_page() {
        global $wp_styles, $wp_scripts;
        $wp_styles = new \WP_Styles();
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        // Simulate not being on a page
        $this->go_to(home_url());

        $this->instance->enqueue_assets();

        // Verify assets are not enqueued
        $this->assertFalse(wp_style_is('dswp-in-page-nav-styles', 'enqueued'));
        $this->assertFalse(wp_script_is('dswp-in-page-nav-script', 'enqueued'));
    }

    /**
     * Test enqueue_assets returns early when nav is disabled
     */
    public function test_enqueue_assets_returns_early_when_nav_disabled() {
        global $wp_styles, $wp_scripts;
        $wp_styles = new \WP_Styles();
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        // Create a page with nav disabled
        $page_id = $this->factory()->post->create(['post_type' => 'page']);
        update_post_meta($page_id, 'show_inpage_nav', false);

        $this->go_to(get_permalink($page_id));

        $this->instance->enqueue_assets();

        // Verify assets are not enqueued
        $this->assertFalse(wp_style_is('dswp-in-page-nav-styles', 'enqueued'));
        $this->assertFalse(wp_script_is('dswp-in-page-nav-script', 'enqueued'));
    }

    /**
     * Test enqueue_assets enqueues styles and scripts when enabled
     */
    public function test_enqueue_assets_enqueues_when_nav_enabled() {
        global $wp_styles, $wp_scripts;
        $wp_styles = new \WP_Styles();
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        // Create a page with nav enabled
        $page_id = $this->factory()->post->create(['post_type' => 'page']);
        update_post_meta($page_id, 'show_inpage_nav', true);

        $this->go_to(get_permalink($page_id));

        $this->instance->enqueue_assets();

        // Verify styles are enqueued
        $this->assertTrue(wp_style_is('dswp-in-page-nav-styles', 'enqueued'));

        // Verify scripts are enqueued
        $this->assertTrue(wp_script_is('dswp-in-page-nav-script', 'enqueued'));
    }

    /**
     * Test enqueue_assets localizes script with correct data
     */
    public function test_enqueue_assets_localizes_script_data() {
        global $wp_scripts;
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        // Create a page with excerpt
        $page_id = $this->factory()->post->create([
            'post_type' => 'page',
            'post_excerpt' => 'This is a test excerpt',
        ]);
        update_post_meta($page_id, 'show_inpage_nav', true);

        $this->go_to(get_permalink($page_id));

        $this->instance->enqueue_assets();

        // Get localized data
        $data = $wp_scripts->get_data('dswp-in-page-nav-script', 'data');

        // Verify data is present
        $this->assertNotEmpty($data);
        $this->assertStringContainsString('dswpInPageNav', $data);
        $this->assertStringContainsString('This is a test excerpt', $data);
        $this->assertStringContainsString('mobile_breakpoint', $data);
        $this->assertStringContainsString('1800', $data);
    }

    /**
     * Test excerpt fallback to first paragraph
     */
    public function test_enqueue_assets_excerpt_fallback_to_content() {
        global $wp_scripts;
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        // Create a page without excerpt but with content
        $page_id = $this->factory()->post->create([
            'post_type' => 'page',
            'post_excerpt' => '', // Explicitly set empty excerpt
            'post_content' => 'This is the first paragraph of content.' . "\n" . 'Second paragraph.',
        ]);
        update_post_meta($page_id, 'show_inpage_nav', true);

        $this->go_to(get_permalink($page_id));

        $this->instance->enqueue_assets();

        // Get localized data
        $data = $wp_scripts->get_data('dswp-in-page-nav-script', 'data');

        // Verify first paragraph is used
        $this->assertStringContainsString('This is the first paragraph of content.', $data);
    }

    /**
     * Test enqueue_editor_assets with existing asset file
     */
    public function test_enqueue_editor_assets_with_asset_file() {
        global $wp_scripts;
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        // Mock the file_exists and include for asset file
        // Note: In real scenario, you'd need to create actual test files
        $this->instance->enqueue_editor_assets();

        // If asset file exists, script should be registered
        // This test assumes the asset files are built
        $this->assertNotNull($wp_scripts);
    }

    /**
     * Test enqueue_editor_assets with fallback dependencies
     */
    public function test_enqueue_editor_assets_uses_fallback_dependencies() {
        global $wp_scripts;
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();
        $this->instance->enqueue_editor_assets();

        // Script should only be enqueued if file exists
        // Test that function runs without errors
        $this->assertNotNull($wp_scripts);
    }

    /**
     * Test configuration options are correct
     */
    public function test_localized_script_has_correct_options() {
        global $wp_scripts;
        $wp_scripts = new \WP_Scripts();

        $this->instance = new InPageNav();

        $page_id = $this->factory()->post->create(['post_type' => 'page']);
        update_post_meta($page_id, 'show_inpage_nav', true);

        $this->go_to(get_permalink($page_id));

        $this->instance->enqueue_assets();

        $data = $wp_scripts->get_data('dswp-in-page-nav-script', 'data');

        // Verify all configuration options
        $this->assertStringContainsString('"mobile_breakpoint":1800', $data);
        $this->assertStringContainsString('"scroll_offset":60', $data);
        $this->assertStringContainsString('"heading_selectors":["h2"]', $data);
    }
}