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

// Do not display breadcrumb on the home/front page.
if ( is_front_page() ) {
	return '';
}

/**
 * Build Page Hierarchy
 * Constructs an array representing the page's ancestral path, starting with Home.
 */
$hierarchy = [];

// Home is always the first item and is always linkable.
$hierarchy[] = array(
    'title' => __( 'Home', 'design-system-wordpress-plugin' ),
    'url'   => home_url( '/' ),
);

$ancestors = get_post_ancestors( $current_page_id );

// Add ancestors to the hierarchy in correct order (when page has a parent).
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

// Append current page to the hierarchy (only this item will not be linkable).
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
            $is_last = count( $hierarchy ) - 1 === $index;

            if ( $is_last ) :
                ?>
                <span class="current-page">
                    <?php echo esc_html( $item['title'] ); ?>
                </span>
                <?php
            else :
                ?>
                <a href="<?php echo esc_url( $item['url'] ); ?>">
                    <?php echo esc_html( $item['title'] ); ?>
                </a>
                <span class="dswp-breadcrumb-separator">
                    <?php
                    echo wp_kses(
                        '/',
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