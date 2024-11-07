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

// Include autoload.
require __DIR__ . '/vendor/autoload.php';

use Bcgov\DesignSystemPlugin\NotificationBanner;

// Initialize the custom banner class.
new NotificationBanner();
