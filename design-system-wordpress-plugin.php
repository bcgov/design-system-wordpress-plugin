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
 * Version: 2.2.0
 * License: Apache License Version 2.0
 * License URI: LICENSE
 * Text Domain: design-system-wordpress-plugin
 * Tags:
 *
 * @package DesignSystemPlugin
 */

/**
 * Loads the autoloader.
 */
if ( ! class_exists( 'Bcgov\\DesignSystemPlugin\\NotificationBanner' ) ) {
    $local_composer  = __DIR__ . '/vendor/autoload.php';
    $server_composer = __DIR__ . '/../../../../vendor/autoload.php';
    if ( file_exists( $local_composer ) || file_exists( $server_composer ) ) {
        if ( file_exists( $server_composer ) ) {
            require_once $server_composer;
        }
        if ( ! class_exists( 'Bcgov\\DesignSystemPlugin\\NotificationBanner' ) ) {
            require_once $local_composer;
        }
    }
}

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


use Bcgov\DesignSystemPlugin\{
    NotificationBanner,
    ContentSecurityPolicy,
    SkipNavigation
};

use Bcgov\DesignSystemPlugin\Enqueue\{
    Style,
    Script
};


// Initialize the custom banner class.
$notification_banner = new NotificationBanner();
$notification_banner->init();

// Initialize the content security policy class.
$content_security_policy = new ContentSecurityPolicy();
$content_security_policy->init();


// Initialize the content security policy class.
$skip_navigation = new SkipNavigation();
$skip_navigation->init();

// Initialize the enqueueing styles class.
$enque_styles = new Style();
$enque_styles->init();

// Initialize the enqueueing scripts class.
$enqueue_scripts = new Script();
$enqueue_scripts->init();
