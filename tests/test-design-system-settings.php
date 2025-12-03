<?php

namespace Bcgov\DesignSystemPlugin\Tests;

use Bcgov\DesignSystemPlugin\DesignSystemSettings;
use WP_UnitTestCase;

class DesignSystemSettingsTest extends WP_UnitTestCase {

    protected DesignSystemSettings $settings;

    protected function setUp(): void {
        parent::setUp();
        $this->settings = new DesignSystemSettings();

        // Reset global menu to avoid cross-test contamination.
        // Note: WordPress tests may pre-populate globals; we ensure we start clean where possible.
        $GLOBALS['menu']    = $GLOBALS['menu'] ?? [];
        $GLOBALS['submenu'] = $GLOBALS['submenu'] ?? [];
    }

    public function test_add_menu_registers_page() {
        // Act: directly invoke add_menu to register the page.
        $this->settings->add_menu();

        // Assert: find menu item with slug 'dswp-admin-menu'.
        $found = false;
        foreach ( $GLOBALS['menu'] as $item ) {
            // Typical structure: [0] page title, [1] capability, [2] menu slug, ...
            if ( isset( $item[2] ) && $item[2] === 'dswp-admin-menu' ) {
                $found = true;
                break;
            }
        }

        $this->assertTrue($found, 'Design System menu page not registered with expected slug.');
    }

    public function test_render_settings_page_outputs_expected_markup() {
        ob_start();
        $this->settings->render_settings_page();
        $output = ob_get_clean();

        $this->assertStringContainsString('<div class="wrap">', $output);
        $this->assertStringContainsString('Design System Settings', $output);
        $this->assertStringContainsString('Welcome to the BC Government Design System settings', $output);
    }
}