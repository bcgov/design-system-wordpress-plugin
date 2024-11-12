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
 * Version: 1.0.0
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

use Bcgov\DesignSystemPlugin\{
    NotificationBanner,
    ContentSecurityPolicy
};

use Bcgov\DesignSystemPlugin\Enqueue\Style;

// Initialize the custom banner class.
$notification_banner = new NotificationBanner();
$notification_banner->init();

// Initialize the content security policy class.
$content_security_policy = new ContentSecurityPolicy();
$content_security_policy->init();


// Initialize the enqueueing styles class.
$enque_styles = new Style();
$enque_styles->init();
