<?php
/**
 * Navigation Block Render Template
 *
 * Dynamically renders navigation menu from wp_navigation post type
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Navigation
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content (empty for dynamic blocks).
 * @var WP_Block $block      Block instance.
 */

$menu_id           = isset( $attributes['menuId'] ) ? (int) $attributes['menuId'] : 0;
$overlay_menu      = isset( $attributes['overlayMenu'] ) ? $attributes['overlayMenu'] : 'mobile';
$mobile_breakpoint = isset( $attributes['mobileBreakpoint'] ) ? (int) $attributes['mobileBreakpoint'] : 768;
$show_in_desktop   = isset( $attributes['showInDesktop'] ) ? (bool) $attributes['showInDesktop'] : true;
$show_in_mobile    = isset( $attributes['showInMobile'] ) ? (bool) $attributes['showInMobile'] : false;

$class_names = array(
	'wp-block-design-system-wordpress-plugin-navigation',
	'dswp-block-navigation-is-' . esc_attr( $overlay_menu ) . '-overlay',
);

// Load navigation menu content from wp_navigation post type.
$navigation_content = '';
if ( $menu_id > 0 ) {
	$navigation_post = get_post( $menu_id );
	if ( $navigation_post && 'wp_navigation' === $navigation_post->post_type ) {
		$navigation_content = $navigation_post->post_content;
	}
}

$parsed_blocks = array();
if ( ! empty( $navigation_content ) ) {
	$parsed_blocks = parse_blocks( $navigation_content );
}

?>
<nav class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>" data-dswp-mobile-breakpoint="<?php echo esc_attr( (string) $mobile_breakpoint ); ?>" data-show-in-desktop="<?php echo esc_attr( $show_in_desktop ? 'true' : 'false' ); ?>" data-show-in-mobile="<?php echo esc_attr( $show_in_mobile ? 'true' : 'false' ); ?>">
	<button class="dswp-nav-mobile-toggle-icon" aria-label="<?php echo esc_attr__( 'Toggle menu', 'dswp' ); ?>" aria-expanded="false">
		<span class="dswp-nav-mobile-menu-icon-text"><?php echo esc_html__( 'Menu', 'dswp' ); ?></span>
		<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar" d="M3,6h13" stroke-width="1" stroke="currentColor"></path>
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar" d="M3,12h13" stroke-width="1" stroke="currentColor"></path>
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar" d="M3,18h13" stroke-width="1" stroke="currentColor"></path>
		</svg>
	</button>
	<ul class="dswp-block-navigation__container">
		<?php
		if ( ! empty( $parsed_blocks ) ) {
			foreach ( $parsed_blocks as $inner_block ) {
				$block_output = render_block( $inner_block );
				echo wp_kses_post( $block_output );
			}
		}
		?>
	</ul>
</nav>
