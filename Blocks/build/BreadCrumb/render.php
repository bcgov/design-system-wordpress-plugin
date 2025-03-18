<?php
function get_page_hierarchy() {
    global $post;
    
    if (!$post) {
        return [];
    }

    $hierarchy = [];
    $current = $post;

    // Add current page
    $hierarchy[] = [
        'title' => get_the_title($current),
        'url' => get_permalink($current),
        'id' => $current->ID
    ];

    // Get ancestors
    while ($current->post_parent) {
        $parent = get_post($current->post_parent);
        if ($parent) {
            array_unshift($hierarchy, [
                'title' => get_the_title($parent),
                'url' => get_permalink($parent),
                'id' => $parent->ID
            ]);
            $current = $parent;
        } else {
            break;
        }
    }

    return $hierarchy;
}

function render_breadcrumb_block($attributes) {
    $hierarchy = get_page_hierarchy();
    if (empty($hierarchy)) {
        return '';
    }

    $divider = isset($attributes['dividerType']) && $attributes['dividerType'] === 'chevron' ? ' > ' : ' / ';
    $current_as_link = isset($attributes['currentAsLink']) ? $attributes['currentAsLink'] : false;

    $output = '<div class="dswp-block-breadcrumb__container">';

    $count = count($hierarchy);
    foreach ($hierarchy as $index => $item) {
        $is_last = ($index === $count - 1);

        if ($is_last) {
            // Handle current page
            if ($current_as_link) {
                $output .= sprintf(
                    '<a href="%s" class="current-page-link">%s</a>',
                    esc_url($item['url']),
                    esc_html($item['title'])
                );
            } else {
                $output .= sprintf(
                    '<span class="current-page">%s</span>',
                    esc_html($item['title'])
                );
            }
        } else {
            // Handle ancestors
            $output .= sprintf(
                '<a href="%s">%s</a><span class="separator">%s</span>',
                esc_url($item['url']),
                esc_html($item['title']),
                esc_html($divider)
            );
        }
    }

    $output .= '</div>';
    return $output;
}

/**
 * Registers the block and sets up the callback for rendering on the front end.
 */
function register_breadcrumb_block() {
    register_block_type(__DIR__, array(
        'render_callback' => 'render_breadcrumb_block'
    ));
}
add_action('init', 'register_breadcrumb_block'); 