<?php
use PHPUnit\Framework\AssertionFailedError;
use Bcgov\DesignSystemPlugin\AutoAnchor\Settings;

/**
 * @group dswp
 */
class AutoAnchorSettingsTest extends WP_UnitTestCase {

    /** @var Settings */
    private $settings;

    public function setUp(): void {
        parent::setUp();

        // Ensure an admin user is active for menu registration and capability checks.
        $admin_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
        wp_set_current_user( $admin_id );

        $this->settings = new Settings();

        // Reset globals for clean state.
        global $admin_page_hooks, $submenu, $menu, $wp_registered_settings, $_registered_pages;

        $admin_page_hooks     = [];
        $submenu              = [];
        $menu                 = [];
        $wp_registered_settings = [];
        $_registered_pages    = [];

        // Remove possibly pre-existing hooks to avoid interference.
        remove_all_actions( 'admin_menu' );
        remove_all_actions( 'admin_init' );
        remove_all_actions( 'admin_enqueue_scripts' );
    }

    public function tearDown(): void {
        parent::tearDown();
    }

    private function assertSubmenuRegisteredUnderParent( string $parent, string $submenuSlug ) : void {
        global $_registered_pages;

        // Load helper
        if ( ! function_exists( 'get_plugin_page_hookname' ) ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $candidates = [];
        // 1) Computed by WP
        $candidates[] = get_plugin_page_hookname( $submenuSlug, $parent );
        // 2) Common patterns seen in tests/environments
        $candidates[] = "{$parent}_page_{$submenuSlug}";
        $candidates[] = "design-system_page_{$submenuSlug}";
        // 3) Numeric variant sometimes seen
        $candidates[] = "1_page_{$submenuSlug}";

        $found = false;
        foreach ( array_unique( $candidates ) as $hook ) {
            if ( isset( $_registered_pages[ $hook ] ) ) {
                $found = true;
                break;
            }
        }

        $this->assertTrue(
            $found,
            'Submenu hook not found. Tried: ' . implode( ', ', array_unique( $candidates ) )
        );
    }

    public function test_init_registers_expected_hooks() {
        $this->settings->init();

        // admin_menu with priority 20
        $this->assertTrue( has_action( 'admin_menu', [ $this->settings, 'add_menu' ] ) !== false, 'admin_menu action not added' );
        $this->assertSame( 20, has_action( 'admin_menu', [ $this->settings, 'add_menu' ] ) );

        // admin_init
        $this->assertNotFalse( has_action( 'admin_init', [ $this->settings, 'register_settings' ] ) );

        // admin_enqueue_scripts
        $this->assertNotFalse( has_action( 'admin_enqueue_scripts', [ $this->settings, 'add_toggle_styles' ] ) );
    }

    public function test_register_settings_registers_option_with_expected_args() {
        $this->settings->init();
        do_action( 'admin_init' );

        global $wp_registered_settings;

        $this->assertArrayHasKey( Settings::OPTION_NAME, $wp_registered_settings );
        $args = $wp_registered_settings[ Settings::OPTION_NAME ];

        $this->assertSame( 'string', $args['type'] ?? null );
        $this->assertSame( '0', $args['default'] ?? null );
        $this->assertTrue( (bool) ( $args['show_in_rest'] ?? false ) );

        $this->assertIsCallable( $args['sanitize_callback'] ?? null );

        $sanitize = $args['sanitize_callback'];

        $this->assertSame( '1', $sanitize( 'anything' ) );
        $this->assertSame( '1', $sanitize( 123 ) );
        $this->assertSame( '0', $sanitize( '' ) );
        $this->assertSame( '0', $sanitize( 0 ) );
        $this->assertSame( '0', $sanitize( null ) );
    }

    public function test_add_menu_creates_parent_and_submenu_when_parent_missing() {
        global $admin_page_hooks;

        unset( $admin_page_hooks['dswp-admin-menu'] );

        // Run via WP's hook to mimic real behavior.
        $this->settings->init();
        do_action( 'admin_menu' );

        $this->assertArrayHasKey( 'dswp-admin-menu', $admin_page_hooks );

        $this->assertSubmenuRegisteredUnderParent( 'dswp-admin-menu', 'dswp-auto-anchor-menu' );
    }

    public function test_add_menu_adds_submenu_when_parent_exists() {
        // Create a real parent menu page so WordPress computes proper hooknames.
        if ( ! function_exists( 'add_menu_page' ) || ! function_exists( 'add_submenu_page' ) ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
            require_once ABSPATH . 'wp-admin/includes/menu.php';
        }

        // Register a parent page with slug 'dswp-admin-menu'
        add_menu_page(
            'Design System',
            'Design System',
            'manage_options',
            'dswp-admin-menu',
            '__return_null',
            'dashicons-admin-customizer',
            60
        );

        // Now call the plugin's menu registration to add its submenu.
        $this->settings->add_menu();

        // Verify submenu is registered under the existing parent.
        $this->assertSubmenuRegisteredUnderParent( 'dswp-admin-menu', 'dswp-auto-anchor-menu' );
    }

    public function test_add_toggle_styles_only_enqueues_on_settings_page() {
        // Wrong hook: should not enqueue
        $this->settings->add_toggle_styles( 'some_other_hook' );
        $this->assertFalse( wp_style_is( 'dswp-auto-anchor-toggle', 'enqueued' ), 'Style should not be enqueued for other hooks.' );

        // Try computed hook first
        if ( ! function_exists( 'get_plugin_page_hookname' ) ) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $computed = get_plugin_page_hookname( 'dswp-auto-anchor-menu', 'dswp-admin-menu' );

        // Try known literals if computed doesn't match plugin check
        $candidates = [
            $computed,
            'dswp-admin-menu_page_dswp-auto-anchor-menu',
            'design-system_page_dswp-auto-anchor-menu',
            '1_page_dswp-auto-anchor-menu',
        ];

        $enqueued = false;
        foreach ( array_unique( $candidates ) as $hook ) {
            // Reset styles between attempts
            wp_dequeue_style( 'dswp-auto-anchor-toggle' );
            wp_deregister_style( 'dswp-auto-anchor-toggle' );

            $this->settings->add_toggle_styles( $hook );
            if ( wp_style_is( 'dswp-auto-anchor-toggle', 'enqueued' ) ) {
                $enqueued = true;
                break;
            }
        }

        $this->assertTrue( $enqueued, 'Style should be enqueued for settings page hook.' );

        $styles = wp_styles();
        $reg    = $styles->registered['dswp-auto-anchor-toggle'] ?? null;
        $this->assertNotNull( $reg, 'Style handle should be registered.' );
        $this->assertStringEndsWith( '/styles.css', $reg->src );
    }

    public function test_render_settings_page_outputs_view_for_admin() {
        $admin_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
        wp_set_current_user( $admin_id );

        ob_start();
        $this->settings->render_settings_page();
        $output = ob_get_clean();

        // Assert against real template content.
        $this->assertStringContainsString( '<h1>Auto Anchor Settings</h1>', $output );
        $this->assertStringContainsString( 'name="dswp_auto_anchor_enabled"', $output );
    }

    public function test_render_settings_page_outputs_nothing_for_non_admin() {
        // Create subscriber user and set current
        $user_id = self::factory()->user->create( [ 'role' => 'subscriber' ] );
        wp_set_current_user( $user_id );

        ob_start();
        $this->settings->render_settings_page();
        $output = ob_get_clean();

        $this->assertSame( '', $output, 'Non-admin should not see settings output.' );
    }
}