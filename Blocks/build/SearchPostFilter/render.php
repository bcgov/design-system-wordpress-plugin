<?php
/**
 * Search Post Filter Block - Frontend Render
 *
 * Renders the frontend interface for the Search Post Filter block.
 * This file handles the server-side rendering of the post type filter buttons,
 * managing the active states and URL generation for filtering.
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage SearchPostFilter
 */

namespace DesignSystemWordPressPlugin\SearchPostFilter;

/**
 * Fetch all available public post types from WordPress
 *
 * @var WP_Post_Type[] Array of post type objects that are set to public
 */
$post_types = get_post_types(
    [
		'public' => true,
	],
    'objects'
);

/**
 * Get the currently selected post type from URL parameters
 * Defaults to 'any' if no post type is specified
 *
 * @var string Sanitized post type name
 */
$current_post_type = isset( $_GET['post_type'] ) ? sanitize_key( $_GET['post_type'] ) : 'any';
?>

<div class="wp-block-design-system-wordpress-plugin-search-post-filter">
    <div class="dswp-search-post-filter__container">
        <?php
        /**
         * Loop through each public post type and create a filter button
         * Each button includes:
         * - Dynamic active state based on current selection
         * - URL with post_type parameter
         * - Escaped post type label for display
         */
        foreach ( $post_types as $current_post_type_object ) :
            $is_active    = $current_post_type === $current_post_type_object->name;
            $button_class = 'dswp-search-post-filter__button';
            if ( $is_active ) {
                $button_class .= ' dswp-search-post-filter__button--active';
            }
			?>
            <a 
                href="<?php echo esc_url( add_query_arg( 'post_type', $current_post_type_object->name ) ); ?>" 
                class="<?php echo esc_attr( $button_class ); ?>"
            >
                <?php echo esc_html( $current_post_type_object->labels->name ); ?>
            </a>
        <?php endforeach; ?>
    </div>
</div>