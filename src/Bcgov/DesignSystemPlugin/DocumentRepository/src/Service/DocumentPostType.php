<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository\src\Service;

use Bcgov\DesignSystemPlugin\DocumentRepository\src\Config\RepositoryConfig;

/**
 * DocumentPostType - Custom Post Type Handler
 * 
 * This service handles the registration and configuration of the custom post type
 * used to store documents in the repository.
 */
class DocumentPostType {
    /**
     * Configuration service
     * 
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;
    
    /**
     * Constructor
     * 
     * @param RepositoryConfig $config Configuration service
     */
    public function __construct(RepositoryConfig $config) {
        $this->config = $config;
    }
    
    /**
     * Register the document custom post type
     */
    public function register(): void {
        $post_type = $this->config->get_post_type();
        $label = $this->config->get('post_type_label');
        $singular = $this->config->get('post_type_singular');
        
        $labels = [
            'name'                  => $label,
            'singular_name'         => $singular,
            'menu_name'             => $label,
            'name_admin_bar'        => $singular,
            'add_new'               => "Add New",
            'add_new_item'          => "Add New $singular",
            'new_item'              => "New $singular",
            'edit_item'             => "Edit $singular",
            'view_item'             => "View $singular",
            'all_items'             => "All $label",
            'search_items'          => "Search $label",
            'parent_item_colon'     => "Parent $label:",
            'not_found'             => "No $label found.",
            'not_found_in_trash'    => "No $label found in Trash.",
            'archives'              => "$singular Archives",
            'insert_into_item'      => "Insert into $singular",
            'uploaded_to_this_item' => "Uploaded to this $singular",
            'filter_items_list'     => "Filter $label list",
            'items_list_navigation' => "$label list navigation",
            'items_list'            => "$label list",
        ];
        
        $args = [
            'labels'             => $labels,
            'public'             => false,
            'publicly_queryable' => false,
            'show_ui'            => true,
            'show_in_menu'       => false,
            'query_var'          => false,
            'rewrite'            => false,
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'menu_position'      => $this->config->get('menu_position'),
            'menu_icon'          => $this->config->get('menu_icon'),
            'supports'           => ['title', 'author', 'custom-fields'],
            'capabilities'       => [
                'create_posts'       => $this->config->get_capability(),
                'edit_post'          => $this->config->get_capability(),
                'read_post'          => $this->config->get_capability(),
                'delete_post'        => $this->config->get_capability(),
                'edit_posts'         => $this->config->get_capability(),
                'edit_others_posts'  => $this->config->get_capability(),
                'publish_posts'      => $this->config->get_capability(),
                'read_private_posts' => $this->config->get_capability(),
            ],
            'show_in_rest'       => true,
        ];
        
        register_post_type($post_type, $args);
        
        // Register custom taxonomies if needed
        $this->register_taxonomies();
    }
    
    /**
     * Register any custom taxonomies for documents
     */
    private function register_taxonomies(): void {
        $post_type = $this->config->get_post_type();
        
        // Document categories
        register_taxonomy(
            'document_category',
            $post_type,
            [
                'labels' => [
                    'name'                       => 'Categories',
                    'singular_name'              => 'Category',
                    'search_items'               => 'Search Categories',
                    'popular_items'              => 'Popular Categories',
                    'all_items'                  => 'All Categories',
                    'parent_item'                => 'Parent Category',
                    'parent_item_colon'          => 'Parent Category:',
                    'edit_item'                  => 'Edit Category',
                    'update_item'                => 'Update Category',
                    'add_new_item'               => 'Add New Category',
                    'new_item_name'              => 'New Category Name',
                    'separate_items_with_commas' => 'Separate categories with commas',
                    'add_or_remove_items'        => 'Add or remove categories',
                    'choose_from_most_used'      => 'Choose from the most used categories',
                    'menu_name'                  => 'Categories',
                ],
                'hierarchical'      => true,
                'show_ui'           => true,
                'show_admin_column' => true,
                'query_var'         => false,
                'rewrite'           => false,
                'show_in_rest'      => true,
            ]
        );
        
        // Document tags
        register_taxonomy(
            'document_tag',
            $post_type,
            [
                'labels' => [
                    'name'                       => 'Tags',
                    'singular_name'              => 'Tag',
                    'search_items'               => 'Search Tags',
                    'popular_items'              => 'Popular Tags',
                    'all_items'                  => 'All Tags',
                    'parent_item'                => null,
                    'parent_item_colon'          => null,
                    'edit_item'                  => 'Edit Tag',
                    'update_item'                => 'Update Tag',
                    'add_new_item'               => 'Add New Tag',
                    'new_item_name'              => 'New Tag Name',
                    'separate_items_with_commas' => 'Separate tags with commas',
                    'add_or_remove_items'        => 'Add or remove tags',
                    'choose_from_most_used'      => 'Choose from the most used tags',
                    'menu_name'                  => 'Tags',
                ],
                'hierarchical'      => false,
                'show_ui'           => true,
                'show_admin_column' => true,
                'query_var'         => false,
                'rewrite'           => false,
                'show_in_rest'      => true,
            ]
        );
    }
    
    /**
     * Add custom meta boxes for the document post type
     */
    public function add_meta_boxes(): void {
        add_meta_box(
            'document_file_meta_box',
            'Document File',
            [$this, 'render_file_meta_box'],
            $this->config->get_post_type(),
            'normal',
            'high'
        );
    }
    
    /**
     * Render the document file meta box
     * 
     * @param \WP_Post $post Current post object
     */
    public function render_file_meta_box(\WP_Post $post): void {
        // This is just a placeholder - with our React app, we don't need PHP templates
        echo '<div id="document-repository-file-metabox" data-post-id="' . esc_attr($post->ID) . '"></div>';
        
        // Add nonce field for security
        wp_nonce_field('document_file_meta_box', 'document_file_meta_box_nonce');
    }
} 