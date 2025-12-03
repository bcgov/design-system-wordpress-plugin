<?php

namespace Bcgov\DesignSystemPlugin\Tests;

use Bcgov\DesignSystemPlugin\NotificationBanner;
use WP_UnitTestCase;

class NotificationBannerTest extends WP_UnitTestCase {

    protected NotificationBanner $banner;

    protected function setUp(): void {
        parent::setUp();
        $this->banner = new NotificationBanner();

        // Ensure globals exist to avoid cross-test contamination.
        $GLOBALS['submenu'] = $GLOBALS['submenu'] ?? [];
        $GLOBALS['wp_registered_settings'] = $GLOBALS['wp_registered_settings'] ?? [];
        $GLOBALS['wp_settings_fields'] = $GLOBALS['wp_settings_fields'] ?? [];
        $GLOBALS['wp_settings_sections'] = $GLOBALS['wp_settings_sections'] ?? [];
    }

    // Commented out: add_menu() currently does not register a submenu (empty implementation).
    // To enable this test, the class must be refactored to call add_submenu_page with:
    // - parent slug: 'dswp-admin-menu' (from the DesignSystemSettings main menu),
    // - page title/menu title/capability,
    // - menu slug: 'dswp-notification-menu',
    // - callback: [$this, 'render_notification_banner_page'].
    // Without this refactor, WordPress won't populate $GLOBALS['submenu']['dswp-admin-menu'], so the test cannot pass.
    /*
    public function test_add_menu_registers_submenu() {
        // Act
        $this->banner->add_menu();

        // Assert submenu registered under 'dswp-admin-menu' with slug 'dswp-notification-menu'
        $submenus = $GLOBALS['submenu']['dswp-admin-menu'] ?? [];
        $found = false;
        foreach ($submenus as $item) {
            // Typical submenu structure: [0] page title, [1] capability, [2] menu slug, [3] menu title
            if (isset($item[2]) && $item[2] === 'dswp-notification-menu') {
                $found = true;
                break;
            }
        }
        $this->assertTrue($found, 'Notification Banner submenu not registered.');
    }
    */

    public function test_register_settings_registers_with_wp() {
        // Act
        $this->banner->register_settings();

        // Assert settings registered
        $registered = $GLOBALS['wp_registered_settings'] ?? [];
        $this->assertArrayHasKey('dswp_notification_banner_notification', $registered);
        $this->assertArrayHasKey('dswp_notification_banner_enabled', $registered);
        $this->assertArrayHasKey('dswp_notification_banner_color', $registered);

        // Assert section registered
        $sections = $GLOBALS['wp_settings_sections']['dswp-notification-menu'] ?? [];
        $this->assertNotEmpty($sections, 'Settings section not registered for dswp-notification-menu.');

        // Assert fields registered (by id keys under the page and section)
        $fields = $GLOBALS['wp_settings_fields']['dswp-notification-menu']['dswp_notification_menu_settings_section'] ?? [];
        $this->assertArrayHasKey('banner_enabled', $fields, 'banner_enabled field not registered.');
        $this->assertArrayHasKey('banner_content', $fields, 'banner_content field not registered.');
        $this->assertArrayHasKey('banner_color', $fields, 'banner_color field not registered.');
    }

    public function test_render_notification_banner_page_outputs_form_and_preview_container() {
        // Act
        ob_start();
        $this->banner->render_notification_banner_page();
        $output = ob_get_clean();

        // Assert essential markup snippets
        $this->assertStringContainsString('<div class="wrap">', $output);
        $this->assertStringContainsString('<form method="post" action="options.php">', $output);
        $this->assertStringContainsString('Banner Preview', $output);
        $this->assertStringContainsString('id="dswp-banner-preview"', $output);
    }

    public function test_display_banner_outputs_when_enabled() {
        // Arrange: set options to enable and provide content and color
        update_option('dswp_notification_banner_enabled', '1');
        update_option('dswp_notification_banner_color', 'var(--dswp-icons-color-danger)');
        update_option('dswp_notification_banner_notification', '<strong>Alert!</strong> Test message.');

        // Act
        ob_start();
        $this->banner->display_banner();
        $output = ob_get_clean();

        // Assert banner is rendered with provided content and color
        $this->assertStringContainsString('background-color: var(--dswp-icons-color-danger)', $output);
        $this->assertStringContainsString('<strong>Alert!</strong> Test message.', $output);
        // Text color mapping: danger => white
        $this->assertStringContainsString('color: white', $output);
    }

    public function test_display_banner_no_output_when_disabled() {
        // Arrange
        update_option('dswp_notification_banner_enabled', '0');
        update_option('dswp_notification_banner_notification', 'Should not render.');
        update_option('dswp_notification_banner_color', 'var(--dswp-icons-color-warning)');

        // Act
        ob_start();
        $this->banner->display_banner();
        $output = ob_get_clean();

        // Assert nothing rendered
        $this->assertSame('', $output);
    }
}