<?php
/**
 * Plugin Name: Design System Plugin
 * Plugin URI: https://github.com/bcgov/design-system-wordpress-plugin
 * Author: govwordpress@gov.bc.ca
 * Author URI: https://apps.itsm.gov.bc.ca/jira/browse/ENG-138
 * Description: WordPress Design System plugin is a plugin that adds custom functionality to your WordPress site.
 * Requires at least: 6.4.4
 * Tested up to: 6.5
 * Requires PHP: 7.4
 * Version: 2.17.0
 * License: Apache License Version 2.0
 * License URI: LICENSE
 * Text Domain: design-system-wordpress-plugin
 * Tags:
 *
 * @package DesignSystemPlugin
 */
use Bcgov\DesignSystemPlugin\{
    ContentSecurityPolicy,
    DesignSystemSettings,
    NotificationBanner,
    SkipNavigation,
};
use Bcgov\DesignSystemPlugin\Enqueue\{
    Script,
    Style
};
use Bcgov\DesignSystemPlugin\InPageNav\InPageNav;

/**
 * Load Composer autoloader and verify required class exists.
 * If the autoloader or the required class is missing, halt plugin execution.
 */
$autoloader_path = __DIR__ . '/vendor/autoload.php';
if ( file_exists( $autoloader_path ) ) {
    require_once $autoloader_path;
}
if ( ! class_exists( 'Bcgov\\DesignSystemPlugin\\DesignSystemSettings' ) ) {
    return;
}

/**
 * Make dashicons available to public views for use in breadcrumbs.
 */
add_action(
    'wp_enqueue_scripts',
    function () {
		if ( has_block( 'design-system-wordpress-plugin/breadcrumb' ) ) {
			wp_enqueue_style( 'dashicons' );
		}
	}
);

/**
 * The function design_system_register_blocks registers block types from metadata in block.json files
 * found in subdirectories of the Blocks/build folder.
 */
function design_system_register_blocks() {
    // Define the path to the build directory.
    $build_dir = plugin_dir_path( __FILE__ ) . 'Blocks/build/';

    // Use glob to find all block.json files in the subdirectories of the build folder.
    $block_files = glob( $build_dir . '*/block.json' );
    // Loop through each block.json file.
    foreach ( $block_files as $block_file ) {
        // Register the block type from the metadata in block.json.
        register_block_type_from_metadata( $block_file );
    }
}
// Hook the function into the 'init' action.
add_action( 'init', 'design_system_register_blocks' );




/**
 * Adds a new block category for Design System blocks
 *
 * This function adds a new category to the WordPress block editor (Gutenberg)
 * that will contain all Design System blocks. The category is added to the
 * beginning of the categories list using array_unshift.
 *
 * @since 1.0.0
 *
 * @param array $categories Array of block categories.
 * @return array   Modified array of block categories.
 */
function dswp_add_new_block_category( $categories ) {
    array_unshift(
        $categories,
        array(
            'slug'  => 'design-system',
            'title' => 'Design System',
        )
    );

    return $categories;
}
add_filter( 'block_categories_all', 'dswp_add_new_block_category', 10, 2 );

// Design System Plugin
// When the plugin is enabled, the 'design-system-wordpress-theme//header-content' is unregistered,
// and updated with plugin which calls the appropriate template part based on other plugins.
add_action( 'init', 'design_system_register_header_template', 99 );
/**
 * Registers the Design System Plugin header template.
 *
 * Unregisters the default design system header template and registers
 * the plugin's header template. If Search Plugin is also enabled, registers
 * the combined template part.
 */
function design_system_register_header_template() {
	$block_registry = \WP_Block_Type_Registry::get_instance();
	$search_plugin_active = $block_registry->is_registered( 'wordpress-search/search-bar' );
	
	// Only unregister if the template is registered (check to avoid errors)
	$template_registry = \WP_Block_Templates_Registry::get_instance();
	$all_templates = $template_registry->get_all_registered();
	$template_id = 'design-system-wordpress-theme//header-content';
	if ( isset( $all_templates[ $template_id ] ) ) {
		unregister_block_template( $template_id );
	}
	
	if ( $search_plugin_active ) {
		// Both plugins active - use combined template
		register_block_template(
			'design-system-wordpress-plugin//header-content',
			[
				'title'       => __( 'Header with Design System Plugin', 'design-system-wordpress-plugin' ),
				'description' => __( 'Header content', 'design-system-wordpress-plugin' ),
				'content'     => '<!-- wp:template-part {"slug":"header-with-both-plugins","area":"header"} /-->',
			],
		);
	} else {
		// Only Design System Plugin active
		register_block_template(
			'design-system-wordpress-plugin//header-content',
			[
				'title'       => __( 'Header with Design System Plugin', 'design-system-wordpress-plugin' ),
				'description' => __( 'Header content', 'design-system-wordpress-plugin' ),
				'content'     => '<!-- wp:template-part {"slug":"header-with-design-system-plugin","area":"header"} /-->',
			],
		);
	}
}

/**
 * Design System settings
 */

// Initialize the main Design System settings page.
$design_system_settings = new DesignSystemSettings();
$design_system_settings->init();

/**
 * Custom banner
 */

// Initialize the custom banner class.
$notification_banner = new NotificationBanner();
$notification_banner->init();


/**
 * Content security policy
 */

// Initialize the content security policy class.
$content_security_policy = new ContentSecurityPolicy();
$content_security_policy->init();


// Initialize the content security policy class.
$skip_navigation = new SkipNavigation();
$skip_navigation->init();

/**
 * Enqueueing scripts and styles.
 */

// Initialize the enqueueing styles class.
$enqueue_styles = new Style();
$enqueue_styles->init();

// Initialize the enqueueing scripts class.
$enqueue_scripts = new Script();
$enqueue_scripts->init();



/**
 * InPageNav.
 */

// Initialize InPageNav.
$in_page_nav = new InPageNav();
