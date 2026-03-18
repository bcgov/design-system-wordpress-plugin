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

// Support both 'ref' (WordPress core standard) and 'menuId' (backward compatibility).
$menu_id = (int) ($attributes['ref'] ?? $attributes['menuId'] ?? 0);
$overlay_menu = isset($attributes['overlayMenu']) ? $attributes['overlayMenu'] : 'never';
$mobile_breakpoint = isset($attributes['mobileBreakpoint']) ? (int) $attributes['mobileBreakpoint'] : 768;
$show_in_desktop = isset($attributes['showInDesktop']) ? (bool) $attributes['showInDesktop'] : true;
$show_in_mobile = isset($attributes['showInMobile']) ? (bool) $attributes['showInMobile'] : false;

/**
 * Fallback resolution when no menu is explicitly set
 */
if ($menu_id === 0) {

	// 1. Try navigation posts (wp_navigation) — Gutenberg-native menus
	$navigation_posts = get_posts([
		'post_type' => 'wp_navigation',
		'posts_per_page' => 1,
		'post_status' => 'publish',
	]);

	if (!empty($navigation_posts)) {
		$menu_id = (int) $navigation_posts[0]->ID;
	}
}

/**
 * Optional: fallback to classic menus if no navigation posts exist
 */
if ($menu_id === 0) {

	$menus = wp_get_nav_menus();

	if (!empty($menus)) {
		// You cannot directly use term_id as a wp_navigation post,
		// so only use this if your system supports classic menus elsewhere
		$menu_id = (int) $menus[0]->term_id;
	}
}

// Load navigation menu content from wp_navigation post type.
$navigation_content = '';
if ($menu_id > 0) {
	$navigation_post = get_post($menu_id);
	if ($navigation_post && 'wp_navigation' === $navigation_post->post_type) {
		$navigation_content = $navigation_post->post_content;
	}
}

$parsed_blocks = array();
if (!empty($navigation_content)) {
	// Filter out empty/null blocks (parse_blocks includes null blocks for whitespace).
	$parsed_blocks = block_core_navigation_filter_out_empty_blocks(parse_blocks($navigation_content));

	// Only allow navigation-specific blocks.
	$allowed_blocks = array('core/navigation-link', 'core/navigation-submenu', 'core/spacer');
	$parsed_blocks = array_filter(
		$parsed_blocks,
		static function ($block) use ($allowed_blocks) {
			return isset($block['blockName']) && in_array($block['blockName'], $allowed_blocks, true);
		}
	);
	$parsed_blocks = array_values($parsed_blocks); // Reset array keys.
}

$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => "dswp-block-navigation-is-$overlay_menu-overlay",
		'data-dswp-mobile-breakpoint' => $mobile_breakpoint,
		'data-show-in-desktop' => $show_in_desktop ? 'true' : 'false',
		'data-show-in-mobile' => $show_in_mobile ? 'true' : 'false',
	]
);

?>
<nav <?php echo wp_kses_data($wrapper_attributes); ?>>
	<button class="dswp-nav-mobile-toggle-icon" aria-label="<?php echo esc_attr__('Toggle menu', 'dswp'); ?>"
		aria-expanded="false">
		<span class="dswp-nav-mobile-menu-icon-text"><?php echo esc_html__('Menu', 'dswp'); ?></span>
		<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-top-bar" d="M3,6h13" stroke-width="1"
				stroke="currentColor"></path>
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-middle-bar" d="M3,12h13" stroke-width="1"
				stroke="currentColor"></path>
			<path class="dswp-nav-mobile-bar dswp-nav-mobile-menu-bottom-bar" d="M3,18h13" stroke-width="1"
				stroke="currentColor"></path>
		</svg>
	</button>
	<ul class="dswp-block-navigation__container is-layout-flex wp-block-navigation-is-layout-flex">
		<?php
		if (!empty($parsed_blocks)) {
			foreach ($parsed_blocks as $inner_block) {
				$block_output = render_block($inner_block);
				echo wp_kses_post($block_output);
			}
		} else {

			// Final fallback: page list (matches core/navigation behavior)
			echo wp_list_pages([
				'title_li' => '',
				'echo' => false,
			]);

		}
		?>
	</ul>
</nav>