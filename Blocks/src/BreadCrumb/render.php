<?php
/**
 * Breadcrumb Block Render Template
 *
 * Dynamically generates a breadcrumb navigation based on the current page hierarchy
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Breadcrumb
 */


namespace DesignSystemWordPressPlugin\Breadcrumb;

// Get current page context.
$current_page_id = get_the_ID();

// Extract block attributes with default fallbacks.
$divider_type    = isset( $attributes['dividerType'] ) ? $attributes['dividerType'] : 'slash';
$current_as_link = isset( $attributes['currentAsLink'] ) ? $attributes['currentAsLink'] : false;

/**
 * Define separator icons using Dashicons
 * Allows for dynamic selection between slash and chevron separators
 */
$chevron_svg = '<span class="dashicons dashicons-arrow-right-alt2"></span>';
$slash_svg   = '<span class="dashicons dashicons-minus dswp-forward-slash"></span>';

// Select appropriate divider based on block settings.
$divider = 'chevron' === $divider_type ? $chevron_svg : $slash_svg;

/**
 * Build Page Hierarchy
 * Constructs an array representing the page's ancestral path
 */
$hierarchy = [];
$ancestors = get_post_ancestors( $current_page_id );

// Add ancestors to the hierarchy in correct order.
if ( ! empty( $ancestors ) ) {
    // Reverse ancestors to display from top-level to current page.
    $ancestors = array_reverse( $ancestors );
    foreach ( $ancestors as $ancestor_id ) {
        $hierarchy[] = array(
            'title' => get_the_title( $ancestor_id ),
            'url'   => get_permalink( $ancestor_id ),
        );
    }
}

// Append current page to the hierarchy.
$hierarchy[] = array(
    'title' => get_the_title( $current_page_id ),
    'url'   => get_permalink( $current_page_id ),
);

/**
 * Render Breadcrumb Navigation
 * Outputs the complete breadcrumb with appropriate links and separators
 */
?>
<div class="wp-block-design-system-wordpress-plugin-breadcrumb">
    <div class="dswp-block-breadcrumb__container is-loaded">
        <?php
        foreach ( $hierarchy as $index => $item ) :
            // Determine if this is the last item in the hierarchy.
            $is_last = count( $hierarchy ) - 1 === $index;

            // Render last item differently based on 'current as link' setting.
            if ( $is_last ) :
                if ( $current_as_link ) :
					?>
                    <a href="<?php echo esc_url( $item['url'] ); ?>" class="current-page-link">
                        <?php echo esc_html( $item['title'] ); ?>
                    </a>
                <?php else : ?>
                    <span class="current-page">
                        <?php echo esc_html( $item['title'] ); ?>
                    </span>
					<?php
                endif;

				// Render non-last items as links with separators.
            else :
				?>
                <a href="<?php echo esc_url( $item['url'] ); ?>">
                    <?php echo esc_html( $item['title'] ); ?>
                </a>
                <span class="dswp-breadcrumb-separator">
                    <?php
                    echo wp_kses(
                        $divider,
                        array(
							'span' => array(
								'class' => true,
							),
                        )
                    );
                    ?>
                </span>
				<?php
            endif;
        endforeach;
        ?>
    </div>
</div>