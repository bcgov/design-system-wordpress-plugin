<?php
/**
 * Server-side rendering of the breadcrumb block.
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Renders the breadcrumb block.
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 * @return string Rendered block HTML.
 */
function render_breadcrumb_block($attributes, $content, $block) {
    // Add more comprehensive logging
    error_log('Render Breadcrumb Block Called');
    error_log('Current Page ID: ' . get_the_ID());
    error_log('Attributes: ' . print_r($attributes, true));

    // Extract attributes
    $divider_type = isset($attributes['dividerType']) ? $attributes['dividerType'] : 'slash';
    $current_as_link = isset($attributes['currentAsLink']) ? $attributes['currentAsLink'] : false;
    
    // Set divider character based on type
    $divider = $divider_type === 'chevron' ? ' &gt; ' : ' / ';
    
    // Get current page ID
    $current_page_id = get_the_ID();
    if (!$current_page_id) {
        return '<div class="wp-block-design-system-wordpress-plugin-breadcrumb"><div class="dswp-block-breadcrumb__container is-loaded"><span class="breadcrumb-error">Navigation</span></div></div>';
    }
    
    // Build the hierarchy of pages
    $hierarchy = array();
    $ancestors = get_post_ancestors($current_page_id);
    
    // Add the current page to the hierarchy
    $current_page = get_post($current_page_id);
    $hierarchy[] = array(
        'title' => get_the_title($current_page_id),
        'url' => get_permalink($current_page_id),
        'id' => $current_page_id
    );
    
    // Add ancestors to the hierarchy (if any)
    if (!empty($ancestors)) {
        // Reverse the array to display ancestors in the correct order
        $ancestors = array_reverse($ancestors);
        
        foreach ($ancestors as $ancestor_id) {
            $hierarchy[] = array(
                'title' => get_the_title($ancestor_id),
                'url' => get_permalink($ancestor_id),
                'id' => $ancestor_id
            );
        }
        
        // Reverse the hierarchy so ancestors come first
        $hierarchy = array_reverse($hierarchy);
    }
    
    // Start building the HTML
    $wrapper_attributes = get_block_wrapper_attributes(array(
        'data-divider-type' => $divider_type,
        'data-current-as-link' => $current_as_link ? 'true' : 'false',
    ));
    
    $html = '<div ' . $wrapper_attributes . '>';
    $html .= '<div class="dswp-block-breadcrumb__container is-loaded">';
    
    // Build the breadcrumb links
    foreach ($hierarchy as $index => $item) {
        $is_last = $index === count($hierarchy) - 1;
        
        if ($is_last) {
            // Handle the current page differently based on settings
            if ($current_as_link) {
                $html .= '<a href="' . esc_url($item['url']) . '" class="current-page-link">' . esc_html($item['title']) . '</a>';
            } else {
                $html .= '<span class="current-page">' . esc_html($item['title']) . '</span>';
            }
        } else {
            $html .= '<a href="' . esc_url($item['url']) . '">' . esc_html($item['title']) . '</a>';
            $html .= '<span class="separator">' . $divider . '</span>';
        }
    }
    
    $html .= '</div>'; // Close .dswp-block-breadcrumb__container
    $html .= '</div>'; // Close main wrapper
    
    return $html;
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 */
function register_breadcrumb_block() {
    register_block_type(
        __DIR__,
        array(
            'render_callback' => 'render_breadcrumb_block',
        )
    );
}

// This registration would typically happen in the plugin's init function
// but we're doing it here as part of the render file to keep everything in one place
add_action('init', 'register_breadcrumb_block');

// Add this at the END of the file
function design_system_register_breadcrumb_block() {
    // Explicitly log the registration attempt
    error_log('Attempting to register Breadcrumb Block');
    
    register_block_type(
        __DIR__,
        array(
            'render_callback' => 'render_breadcrumb_block'
        )
    );
}
add_action('init', 'design_system_register_breadcrumb_block', 100); 