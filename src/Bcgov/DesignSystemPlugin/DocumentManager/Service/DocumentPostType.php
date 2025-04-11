<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class DocumentPostType {
    private $config;

    public function __construct(DocumentManagerConfig $config) {
        $this->config = $config;
        
        // Add filter to redirect single document views to the file
        add_action('template_redirect', array($this, 'redirect_document_to_file'));
        
        // Modify search results display for documents
        add_filter('post_type_link', array($this, 'modify_document_permalink'), 10, 2);
        add_filter('get_the_excerpt', array($this, 'modify_document_excerpt_in_search'), 10, 2);
    }

    /**
     * Register the Document custom post type
     */
    public function register() {
        $labels = array(
            'name'               => 'Documents',
            'singular_name'      => 'Document',
            'menu_name'          => 'Documents',
            'add_new'           => 'Add New',
            'add_new_item'      => 'Add New Document',
            'edit_item'         => 'Edit Document',
            'new_item'          => 'New Document',
            'view_item'         => 'View Document',
            'search_items'      => 'Search Documents',
            'not_found'         => 'No documents found',
            'not_found_in_trash'=> 'No documents found in Trash'
        );

        $args = array(
            'labels'              => $labels,
            'public'              => true,
            'show_ui'             => true,
            'show_in_menu'        => false, // We'll add our own menu
            'capability_type'     => 'post',
            'hierarchical'        => false,
            'supports'            => array('title', 'excerpt', 'author'), // Remove 'editor' support
            'has_archive'         => true,
            'rewrite'             => array('slug' => 'documents'),
            'show_in_rest'        => false, // Disable Gutenberg/block editor
            'publicly_queryable'  => true,  // Keep this true for search functionality
            'exclude_from_search' => false,  // Keep documents in search results
        );

        register_post_type($this->config->get('post_type'), $args);
    }

    /**
     * Redirect single document views to the actual file
     */
    public function redirect_document_to_file() {
        if (is_singular($this->config->get('post_type'))) {
            $post_id = get_the_ID();
            $file_url = get_post_meta($post_id, '_document_file_url', true);
            
            if ($file_url) {
                wp_redirect($file_url);
                exit;
            }
        }
    }

    /**
     * Modify document permalink to point directly to file
     */
    public function modify_document_permalink($permalink, $post) {
        if ($post->post_type === $this->config->get('post_type')) {
            $file_url = get_post_meta($post->ID, '_document_file_url', true);
            if ($file_url) {
                return $file_url;
            }
        }
        return $permalink;
    }

    /**
     * Modify document excerpt display in search results
     */
    public function modify_document_excerpt_in_search($excerpt, $post) {
        if (is_object($post) && $post->post_type === $this->config->get('post_type')) {
            // Only add type information if we're in a search context
            if (is_search()) {
                $file_type = get_post_meta($post->ID, '_document_file_type', true);
                $custom_excerpt = '';
                if ($file_type) {
                    $custom_excerpt .= '<span class="document-type">Type: ' . esc_html($file_type) . '</span>';
                }
                if ($excerpt) {
                    $custom_excerpt .= ' <span class="document-description">' . $excerpt . '</span>';
                }
                return $custom_excerpt;
            }
            // For all other contexts, just return the excerpt as is
            return $excerpt;
        }
        return $excerpt;
    }
}
