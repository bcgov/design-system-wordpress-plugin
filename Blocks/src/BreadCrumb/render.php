<?php
/**
 * Breadcrumb Block Render Template
 *
 * Dynamically generates a breadcrumb navigation based on the current page hierarchy.
 * On a single post: shows post title. Otherwise: shows the appropriate "page" title
 * (page title, blog index page title, search results, or archive title).
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Breadcrumb
 */

namespace DesignSystemWordPressPlugin\Breadcrumb;

// Do not display breadcrumb on the home/front page.
if ( is_front_page() ) {
	return '';
}

/**
 * Determine current item title and URL (and optional post ID for ancestors).
 * On a post: use post title. On blog index, search, archive: use the title that exists for that context.
 */
$current_title   = '';
$current_url     = '';
$current_page_id = 0;

if ( is_singular() ) {
	// Single post or page: use the post/page title.
	$current_page_id = get_the_ID();
	$current_title   = get_the_title( $current_page_id );
	$current_url     = get_permalink( $current_page_id );
} elseif ( is_home() ) {
	// Blog index: use the "Posts page" title if set, otherwise a fallback label.
	$page_for_posts = (int) get_option( 'page_for_posts', 0 );
	if ( $page_for_posts > 0 ) {
		$current_page_id = $page_for_posts;
		$current_title   = get_the_title( $current_page_id );
		$current_url     = get_permalink( $current_page_id );
	} else {
		$current_title = __( 'Blog', 'design-system-wordpress-plugin' );
		$current_url   = home_url( '/' );
	}
} elseif ( is_search() ) {
	$search_query  = trim( (string) get_search_query() );
	$current_title = '' !== $search_query
		? sprintf(
			/* translators: %s: search query */
			__( 'Search results for "%s"', 'design-system-wordpress-plugin' ),
			$search_query
		)
		: __( 'Search results', 'design-system-wordpress-plugin' );
	$current_url = get_search_link();
} elseif ( is_archive() ) {
	$current_title = wp_strip_all_tags( get_the_archive_title() );
	$queried       = get_queried_object();
	$archive_link  = '';
	if ( $queried instanceof \WP_Term ) {
		$archive_link = get_term_link( $queried );
	} elseif ( $queried instanceof \WP_Post_Type ) {
		$archive_link = get_post_type_archive_link( $queried->name );
	} elseif ( $queried instanceof \WP_User ) {
		$archive_link = get_author_posts_url( $queried->ID );
	}
	$current_url = ( is_string( $archive_link ) && '' !== $archive_link && ! is_wp_error( $archive_link ) )
		? $archive_link
		: '';
} else {
	// Fallback: e.g. 404 or other template — use queried object or generic.
	$current_page_id = get_queried_object_id();
	if ( $current_page_id > 0 ) {
		$current_title = get_the_title( $current_page_id );
		$current_url   = get_permalink( $current_page_id );
	} else {
		$current_title = __( 'Page', 'design-system-wordpress-plugin' );
		$current_url   = '';
	}
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

// Add ancestors only when the current context is a post or page (has a hierarchy).
if ( $current_page_id > 0 ) {
	$ancestors = get_post_ancestors( $current_page_id );
	if ( ! empty( $ancestors ) ) {
		$ancestors = array_reverse( $ancestors );
		foreach ( $ancestors as $ancestor_id ) {
			$hierarchy[] = array(
				'title' => get_the_title( $ancestor_id ),
				'url'   => get_permalink( $ancestor_id ),
			);
		}
	}
}

// Append current item to the hierarchy (last item is not linkable).
$hierarchy[] = array(
	'title' => $current_title,
	'url'   => $current_url,
);

/**
 * Render Breadcrumb Navigation
 * Outputs the complete breadcrumb with appropriate links and separators.
 * Desktop: left/right arrows appear when content overflows for scroll.
 */
?>
<div class="wp-block-design-system-wordpress-plugin-breadcrumb">
    <button type="button" class="dswp-breadcrumb-arrow dswp-breadcrumb-arrow--left" aria-label="<?php esc_attr_e( 'Scroll breadcrumb left', 'design-system-wordpress-plugin' ); ?>">
        <span class="dswp-breadcrumb-chevron" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    </button>
    <div class="dswp-breadcrumb__scroll-wrap">
    <div class="dswp-block-breadcrumb__container is-loaded">
        <div class="dswp-breadcrumb__track">
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
    </div>
    <button type="button" class="dswp-breadcrumb-arrow dswp-breadcrumb-arrow--right" aria-label="<?php esc_attr_e( 'Scroll breadcrumb right', 'design-system-wordpress-plugin' ); ?>">
        <span class="dswp-breadcrumb-chevron" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    </button>
</div>