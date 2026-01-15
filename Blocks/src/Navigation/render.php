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

// Get block attributes with defaults
$menu_id          = isset( $attributes['menuId'] ) ? (int) $attributes['menuId'] : 0;
$overlay_menu     = isset( $attributes['overlayMenu'] ) ? $attributes['overlayMenu'] : 'never';
$mobile_breakpoint = isset( $attributes['mobileBreakpoint'] ) ? (int) $attributes['mobileBreakpoint'] : 768;
$show_in_desktop  = isset( $attributes['showInDesktop'] ) ? (bool) $attributes['showInDesktop'] : true;
$show_in_mobile   = isset( $attributes['showInMobile'] ) ? (bool) $attributes['showInMobile'] : true;

// Build class names
$class_names = array(
	'wp-block-design-system-wordpress-plugin-navigation',
	'dswp-block-navigation-is-' . esc_attr( $overlay_menu ) . '-overlay',
);

$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class'                      => implode( ' ', $class_names ),
		'data-dswp-mobile-breakpoint' => $mobile_breakpoint,
		'data-show-in-desktop'       => $show_in_desktop ? 'true' : 'false',
		'data-show-in-mobile'        => $show_in_mobile ? 'true' : 'false',
	)
);

// Get navigation menu content from wp_navigation post type
$navigation_content = '';
if ( $menu_id > 0 ) {
	$navigation_post = get_post( $menu_id );
	if ( $navigation_post && 'wp_navigation' === $navigation_post->post_type ) {
		$navigation_content = $navigation_post->post_content;
	}
}

// Parse and render the navigation blocks
$parsed_blocks = array();
if ( ! empty( $navigation_content ) ) {
	$parsed_blocks = parse_blocks( $navigation_content );
}

?>
<nav <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<button class="dswp-nav-mobile-toggle-icon" aria-label="Toggle menu" aria-expanded="false">
		<span class="dswp-nav-mobile-menu-icon-text">Menu</span>
		<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar" d="M3,6h13" stroke-width="1" stroke="currentColor"></path>
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar" d="M3,12h13" stroke-width="1" stroke="currentColor"></path>
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar" d="M3,18h13" stroke-width="1" stroke="currentColor"></path>
		</svg>
	</button>
	<ul class="dswp-block-navigation__container">
		<?php
		// Render inner blocks from wp_navigation
		if ( ! empty( $parsed_blocks ) ) {
			foreach ( $parsed_blocks as $inner_block ) {
				echo render_block( $inner_block ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
		}
		?>
	</ul>
</nav>
