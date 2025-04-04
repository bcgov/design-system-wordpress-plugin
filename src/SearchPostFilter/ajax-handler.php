<?php
namespace DesignSystemWordPressPlugin\SearchPostFilter;

// Add the AJAX handlers
add_action('wp_ajax_custom_search_results', __NAMESPACE__ . '\handle_search_results');
add_action('wp_ajax_nopriv_custom_search_results', __NAMESPACE__ . '\handle_search_results');

function handle_search_results() {
    // Get search parameters
    $search_query = sanitize_text_field($_GET['s'] ?? '');
    $post_type = sanitize_key($_GET['post_type'] ?? 'any');

    // Perform the search
    $args = array(
        's' => $search_query,
        'post_type' => $post_type,
        'posts_per_page' => get_option('posts_per_page'),
    );

    $search_query = new \WP_Query($args);
    
    ob_start();
    if ($search_query->have_posts()) :
        while ($search_query->have_posts()) : $search_query->the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class('search-result-item'); ?>>
                <header class="entry-header">
                    <h2 class="entry-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                </header>
                <div class="entry-summary">
                    <?php the_excerpt(); ?>
                </div>
            </article>
            <?php
        endwhile;
        wp_reset_postdata();
    else :
        ?>
        <p class="no-results">No results found for your search.</p>
        <?php
    endif;
    
    $html = ob_get_clean();
    
    wp_send_json(array(
        'html' => $html,
        'found_posts' => $search_query->found_posts
    ));
} 