<?php

namespace src;

/**
 * Class SkipNavigation
 *
 * This class handles adding a Skip Navigation for the Design System Plugin.
 */
class SkipNavigation {


    /** A variable to hold the state to determine the main element.
     *
     * @var bool is main element.
     */
    private $main_content_added = false;

    /**
     * Initializes the SkipNavigation class by adding necessary hooks.
     *
     * @return void
     */
    public function init() {
        add_action( 'wp_body_open', [ $this, 'add_skip_nav' ] );
        remove_action( 'wp_footer', 'the_block_template_skip_link' );
        add_filter( 'render_block', [ $this, 'modify_block_render' ], 10, 2 );
    }

    /**
     * Modifies the render output of specified blocks by adding an HTML element with an id attribute.
     *
     * @param string|null $block_content The content of the block. Can be null if no content exists.
     * @param array       $block The block data, including its name and attributes.
     * @return string|null Modified block content or null if no content.
     */
    public function modify_block_render( $block_content, $block ) {
        // Log the block array for more details.
        if ( is_null( $block_content ) ) {
            return null;
        }

        // Check for core/post-content first.
        if ( isset( $block['blockName'] ) && 'core/post-content' === $block['blockName'] && ! $this->main_content_added ) {
            $block_content            = preg_replace( '/<div/', '<div id="main-content"', $block_content, 1 );
            $this->main_content_added = true; // Mark as added.
        } elseif ( isset( $block['attrs']['tagName'] ) && 'main' === $block['attrs']['tagName'] && ! $this->main_content_added ) { // Check for <main> tag if main-content hasn't been added yet.
            $block_content            = preg_replace( '/<main([^>]*)>/', '<main$1 id="main-content">', $block_content );
            $this->main_content_added = true; // Mark as added.
        }

        // Always add id="main-navigation" to the navigation block.
        if ( isset( $block['blockName'] ) && 'core/navigation' === $block['blockName'] ) {
            $block_content = preg_replace( '/<nav([^>]*)>/', '<nav id="main-navigation"$1>', $block_content );
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
