<?php
// Get current page ID
$current_page_id = get_the_ID();
$divider_type = isset($attributes['dividerType']) ? $attributes['dividerType'] : 'slash';
$current_as_link = isset($attributes['currentAsLink']) ? $attributes['currentAsLink'] : false;
$divider = $divider_type === 'chevron' ? ' &gt; ' : ' / ';

// Get the hierarchy
$hierarchy = array();
$ancestors = get_post_ancestors($current_page_id);

// Add ancestors to the hierarchy (if any)
if (!empty($ancestors)) {
    // Reverse the array to display ancestors in the correct order
    $ancestors = array_reverse($ancestors);
    foreach ($ancestors as $ancestor_id) {
        $hierarchy[] = array(
            'title' => get_the_title($ancestor_id),
            'url' => get_permalink($ancestor_id)
        );
    }
}

// Add the current page
$hierarchy[] = array(
    'title' => get_the_title($current_page_id),
    'url' => get_permalink($current_page_id)
);
?>
<div class="wp-block-design-system-wordpress-plugin-breadcrumb">
    <div class="dswp-block-breadcrumb__container is-loaded">
        <?php foreach ($hierarchy as $index => $item): 
            $is_last = $index === count($hierarchy) - 1;
            if ($is_last): 
                if ($current_as_link): ?>
                    <a href="<?php echo esc_url($item['url']); ?>" class="current-page-link"><?php echo esc_html($item['title']); ?></a>
                <?php else: ?>
                    <span class="current-page"><?php echo esc_html($item['title']); ?></span>
                <?php endif;
            else: ?>
                <a href="<?php echo esc_url($item['url']); ?>"><?php echo esc_html($item['title']); ?></a>
                <span class="separator"><?php echo $divider; ?></span>
            <?php endif;
        endforeach; ?>
    </div>
</div>