<?php

namespace Bcgov\DesignSystemPlugin\InPageNav;

/**
 * Handles meta registration for the In-Page Navigation feature
 */
class Meta {
    /**
     * Initialize hooks for meta registration
     */
    public function init() {
        add_action( 'init', [ $this, 'register_meta' ] );
    }

    /**
     * Registers the meta field for the in-page navigation toggle
     */
    public function register_meta() {
        register_post_meta(
            'page',
            'show_inpage_nav',
            array(
                'show_in_rest' => true,
                'single'       => true,
                'type'         => 'boolean',
                'default'      => false,
            )
        );
    }
}
