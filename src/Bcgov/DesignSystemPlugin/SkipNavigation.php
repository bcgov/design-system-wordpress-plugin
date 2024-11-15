<?php

namespace Bcgov\DesignSystemPlugin;

/**
 * Class SkipNavigation
 *
 * This class handles adding a Skip Navigation for the Design System Plugin.
 */
class SkipNavigation {


    /**
     * Initializes the SkipNavigation class by adding necessary hooks.
     *
     * @return void
     */
    public function init() {
        add_action( 'wp_body_open', [ $this, 'add_skip_nav' ] );

        // Using closures to pass custom parameters.
        add_filter(
            'render_block',
            function ( $block_content, $block ) {
                return $this->modify_block_render( $block_content, $block, '<nav id="main-navigation"$1>', 'core/navigation', '/<nav([^>]*)>/' );
            },
            10,
            2
        );

        add_filter(
            'render_block',
            function ( $block_content, $block ) {
                return $this->modify_block_render( $block_content, $block, '<div class="$1entry-content wp-block-post-content$2" id="main-content"', 'core/post-content', '/<div class="([^"]*)entry-content wp-block-post-content([^"]*)"/', '<div class="$1entry-content wp-block-post-content$2" id="main-content"' );
            },
            10,
            2
        );
    }

    /**
     * Modifies the render output of specified blocks by adding an HTML element with an id attribute.
     *
     * @param string|null $block_content The content of the block. Can be null if no content exists.
     * @param array       $block The block data, including its name and attributes.
     * @param string      $html The HTML element with the id attribute to prepend to the block content.
     * @param string      $block_name The name of the block to check against for modification.
     * @param string      $regex The regex to determine which block to replace.
     * @return string|null Modified block content or null if no content.
     */
    public function modify_block_render( $block_content, $block, $html, $block_name, $regex ) {
        if ( is_null( $block_content ) ) {
            return null;
        }

        // Check if the block name matches the passed block name.
        if ( isset( $block['blockName'] ) && $block_name === $block['blockName'] ) {
            // Modify the block content to include the id attribute.
            $block_content = preg_replace( $regex, $html, $block_content );
        }

        return $block_content;
    }

    /**
     * Outputs the HTML elements for skip navigation.
     *
     * @return void
     */
    public function add_skip_nav() {
        echo '
        <ul class="dswp-skip-nav-list">
            <li aria-label="Skip to main content">
                <a class="dswp-skip-nav" href="#main-content">Skip to main content</a>
            </li>
            <li aria-label="Skip to main navigation">
                <a class="dswp-skip-nav" href="#main-navigation">Skip to main navigation</a>
            </li>
            <li aria-label="Accessibility Statement">
                <a class="dswp-skip-nav" href="https://www2.gov.bc.ca/gov/content/home/accessible-government">Accessibility Statement</a>
            </li>
        </ul>        
       ';
    }
}
