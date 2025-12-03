<?php

namespace Bcgov\DesignSystemPlugin\Tests;

use Bcgov\DesignSystemPlugin\SkipNavigation;
use WP_UnitTestCase;

class SkipNavigationTest extends WP_UnitTestCase {

    protected SkipNavigation $skip;

    protected function setUp(): void {
        parent::setUp();
        $this->skip = new SkipNavigation();
    }

    public function test_modify_block_render_returns_null_when_content_is_null() {
        $result = $this->skip->modify_block_render(null, []);
        $this->assertNull($result);
    }

    public function test_modify_block_render_adds_id_for_core_post_content() {
        $content = '<div class="wp-block-post-content"><p>Hello</p></div>';
        $block   = [ 'blockName' => 'core/post-content' ];

        $result = $this->skip->modify_block_render($content, $block);

        // Only assert that id attribute appears; exact spacing may differ.
        $this->assertStringContainsString('id="main-content"', $result);
        $this->assertStringContainsString('<div', $result);
        $this->assertStringContainsString('</div>', $result);
    }

    public function test_modify_block_render_adds_id_for_main_tag() {
        $content = '<main class="site-main"><p>Body</p></main>';
        $block   = [ 'attrs' => [ 'tagName' => 'main' ] ];

        $result = $this->skip->modify_block_render($content, $block);

        $this->assertStringContainsString('<main', $result);
        $this->assertStringContainsString('class="site-main"', $result);
        $this->assertStringContainsString('id="main-content"', $result);
        $this->assertStringContainsString('</main>', $result);
    }

    public function test_modify_block_render_adds_id_for_navigation_block() {
        $content = '<nav class="primary-nav"><ul><li>Item</li></ul></nav>';
        $block   = [ 'blockName' => 'core/navigation' ];

        $result = $this->skip->modify_block_render($content, $block);

        $this->assertStringContainsString('<nav', $result);
        $this->assertStringContainsString('id="main-navigation"', $result);
        $this->assertStringContainsString('class="primary-nav"', $result);
        $this->assertStringContainsString('</nav>', $result);
    }

    public function test_modify_block_render_adds_main_id_only_once() {
        // First call adds id for core/post-content
        $content1 = '<div class="wp-block-post-content"><p>One</p></div>';
        $block1   = [ 'blockName' => 'core/post-content' ];
        $result1  = $this->skip->modify_block_render($content1, $block1);
        $this->assertStringContainsString('id="main-content"', $result1);

        // Second call should not add again because internal flag is set
        $content2 = '<div class="wp-block-post-content"><p>Two</p></div>';
        $block2   = [ 'blockName' => 'core/post-content' ];
        $result2  = $this->skip->modify_block_render($content2, $block2);

        // Expect unmodified second content (no id attribute)
        $this->assertStringNotContainsString('id="main-content"', $result2);
        $this->assertSame($content2, $result2);
    }

    public function test_add_skip_nav_outputs_expected_links() {
        ob_start();
        $this->skip->add_skip_nav();
        $output = ob_get_clean();

        $this->assertStringContainsString('<ul class="dswp-skip-nav-list">', $output);
        $this->assertStringContainsString('href="#main-content"', $output);
        $this->assertStringContainsString('href="#main-navigation"', $output);
        $this->assertStringContainsString('https://www2.gov.bc.ca/gov/content/home/accessible-government', $output);
        $this->assertStringContainsString('Skip to main content', $output);
        $this->assertStringContainsString('Skip to main navigation', $output);
        $this->assertStringContainsString('Accessibility Statement', $output);
    }
}