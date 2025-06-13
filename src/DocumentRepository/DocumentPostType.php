<?php

namespace Bcgov\DesignSystemPlugin\DocumentRepository;

use Bcgov\DesignSystemPlugin\DocumentRepository\RepositoryConfig;

/**
 * DocumentPostType - Custom Post Type Handler
 *
 * This service handles the registration and configuration of the custom post type
 * used to store documents in the repository.
 */
class DocumentPostType {
    /**
     * Configuration service.
     *
     * @var RepositoryConfig
     */
    private RepositoryConfig $config;

    /**
     * Constructor.
     *
     * @param RepositoryConfig $config Configuration service.
     */
    public function __construct( RepositoryConfig $config ) {
        $this->config = $config;
    }

    /**
     * Register the document custom post type.
     */
    public function register(): void {
        $post_type = $this->config->get_post_type();
        $label     = $this->config->get( 'post_type_label' );
        $singular  = $this->config->get( 'post_type_singular' );

        $labels = [
            'name'                  => $label,
            'singular_name'         => $singular,
            'menu_name'             => $label,
            'name_admin_bar'        => $singular,
            'add_new'               => 'Add New',
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
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => false,
            'query_var'          => false,
            'rewrite'            => false,
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'menu_position'      => $this->config->get( 'menu_position' ),
            'menu_icon'          => $this->config->get( 'menu_icon' ),
            'supports'           => [ 'title', 'author', 'custom-fields' ],
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

        register_post_type( $post_type, $args );

        // Register custom taxonomies if needed.
        $this->register_taxonomies();

        // Register metadata fields with WordPress REST API.
        $this->register_metadata_rest_fields();

        // Hide document attachments from media library.
        add_filter( 'ajax_query_attachments_args', [ $this, 'hide_document_attachments' ] );
    }

    /**
     * Register metadata fields with WordPress REST API.
     * This makes the metadata accessible through the default WordPress REST API endpoints.
     *
     * This is a public method that can be called to re-register metadata fields
     * when they are updated.
     */
    public function register_metadata_fields(): void {
        $this->register_metadata_rest_fields();
    }

    /**
     * Register metadata fields with WordPress REST API.
     * This makes the metadata accessible through the default WordPress REST API endpoints.
     */
    private function register_metadata_rest_fields(): void {
        $post_type = $this->config->get_post_type();

        // Get configured metadata fields from the options table.
        $metadata_fields = get_option( 'document_repository_metadata_fields', [] );

        // Register each metadata field with WordPress REST API.
        foreach ( $metadata_fields as $field ) {
            $field_id   = $field['id'];
            $field_type = $field['type'];

            // Determine the proper schema type for REST API.
            $schema_type   = 'string'; // Default.
            $schema_format = null;

            switch ( $field_type ) {
                case 'date':
                    $schema_type   = 'string';
                    $schema_format = 'date';
                    break;
                case 'select':
                    $schema_type = 'string';
                    break;
                case 'text':
                default:
                    $schema_type = 'string';
                    break;
            }

            // Build the schema.
            $schema = [
                'type'         => $schema_type,
                'description'  => $field['label'] ?? $field_id,
                'show_in_rest' => true,
                'single'       => true,
            ];

            if ( $schema_format ) {
                $schema['format'] = $schema_format;
            }

            // Add enum for select fields.
            if ( 'select' === $field_type && ! empty( $field['options'] ) ) {
                $schema['enum'] = is_array( $field['options'] ) ? $field['options'] : array_keys( $field['options'] );
            }

            // Register the meta field.
            register_post_meta( $post_type, $field_id, $schema );
        }

        // Also register the document file ID field.
        register_post_meta(
            $post_type,
            'document_file_id',
            [
				'type'         => 'integer',
				'description'  => 'Document file attachment ID',
				'show_in_rest' => true,
				'single'       => true,
			]
        );

        // Register other standard document metadata fields.
        $standard_fields = [
            'document_file_url'  => [
                'type'         => 'string',
                'description'  => 'Document file URL',
                'show_in_rest' => true,
                'single'       => true,
            ],
            'document_file_name' => [
                'type'         => 'string',
                'description'  => 'Document file name',
                'show_in_rest' => true,
                'single'       => true,
            ],
            'document_file_type' => [
                'type'         => 'string',
                'description'  => 'Document file MIME type',
                'show_in_rest' => true,
                'single'       => true,
            ],
            'document_file_size' => [
                'type'         => 'integer',
                'description'  => 'Document file size in bytes',
                'show_in_rest' => true,
                'single'       => true,
            ],
        ];

        foreach ( $standard_fields as $field_id => $schema ) {
            register_post_meta( $post_type, $field_id, $schema );
        }
    }

    /**
     * Register any custom taxonomies for documents.
     */
    private function register_taxonomies(): void {
        $post_type = $this->config->get_post_type();

        // Document categories.
        register_taxonomy(
            'document_category',
            $post_type,
            [
                'labels'            => [
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

        // Document tags.
        register_taxonomy(
            'document_tag',
            $post_type,
            [
                'labels'            => [
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
     * Add custom meta boxes for the document post type.
     */
    public function add_meta_boxes(): void {
        add_meta_box(
            'document_file_meta_box',
            'Document File',
            [ $this, 'render_file_meta_box' ],
            $this->config->get_post_type(),
            'normal',
            'high'
        );
    }

    /**
     * Render the document file meta box.
     *
     * @param \WP_Post $post Current post object.
     */
    public function render_file_meta_box( \WP_Post $post ): void {
        // This is just a placeholder - with our React app, we don't need PHP templates.
        echo '<div id="document-repository-file-metabox" data-post-id="' . esc_attr( $post->ID ) . '"></div>';

        // Add nonce field for security.
        wp_nonce_field( 'document_file_meta_box', 'document_file_meta_box_nonce' );
    }

    /**
     * Hide document attachments from the media library.
     *
     * @param array $query The query arguments.
     * @return array Modified query arguments.
     */
    public function hide_document_attachments( $query ): array {
        // Get all document post IDs.
        $document_ids = get_posts(
            [
				'post_type'      => $this->config->get_post_type(),
				'fields'         => 'ids',
				'posts_per_page' => -1,
			]
        );

        if ( ! empty( $document_ids ) ) {
            // Get all attachment IDs associated with documents.
            $attachment_ids = [];
            foreach ( $document_ids as $doc_id ) {
                $file_id = get_post_meta( $doc_id, 'document_file_id', true );
                if ( $file_id ) {
                    $attachment_ids[] = $file_id;
                }
            }

            if ( ! empty( $attachment_ids ) ) {
                $query['post__not_in'] = isset( $query['post__not_in'] )
                    ? array_merge( $query['post__not_in'], $attachment_ids )
                    : $attachment_ids;
            }
        }

        return $query;
    }
}
