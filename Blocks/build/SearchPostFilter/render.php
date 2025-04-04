<?php
namespace DesignSystemWordPressPlugin\SearchPostFilter;

// Get all public post types
$post_types = get_post_types([
    'public' => true
], 'objects');

// Get the current post type from the URL if it exists
$current_post_type = isset($_GET['post_type']) ? sanitize_key($_GET['post_type']) : 'any';
?>

<div class="wp-block-design-system-wordpress-plugin-search-post-filter">
    <div class="dswp-search-post-filter__container">
        <?php foreach ($post_types as $post_type) : 
            $is_active = $current_post_type === $post_type->name;
            $button_class = 'dswp-search-post-filter__button';
            if ($is_active) {
                $button_class .= ' dswp-search-post-filter__button--active';
            }
        ?>
            <a 
                href="<?php echo esc_url(add_query_arg('post_type', $post_type->name)); ?>" 
                class="<?php echo esc_attr($button_class); ?>"
            >
                <?php echo esc_html($post_type->labels->name); ?>
            </a>
        <?php endforeach; ?>
    </div>
</div>