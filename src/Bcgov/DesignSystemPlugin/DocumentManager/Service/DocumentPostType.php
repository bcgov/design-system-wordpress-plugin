<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * DocumentPostType Service
 *
 * This service is responsible for registering and configuring the Document custom post type
 * in WordPress. It creates the foundation for storing and managing documents within
 * the WordPress content management system.
 *
 * Key responsibilities:
 * - Register custom post type with appropriate capabilities and features
 * - Modify document behavior for frontend and search integration
 * - Handle direct file access through URL redirection
 * - Customize search result presentation for document types
 *
 * This class bridges WordPress's content system with the Document Manager's
 * specialized functionality, leveraging WordPress's built-in content features
 * while adapting them for document management.
 */
class DocumentPostType {
    /**
     * Configuration service
     *
     * Provides access to document manager settings including post type name,
     * capabilities, and feature flags.
     *
     * @var DocumentManagerConfig
     */
    private $config;

    /**
     * Constructor
     *
     * Initializes the post type service and registers WordPress hooks to:
     * - Redirect single document views to the actual file
     * - Modify document permalinks to point to files
     * - Customize search result display for documents
     *
     * These hooks integrate the document post type with WordPress's frontend
     * routing and search functionality.
     *
     * @param DocumentManagerConfig $config Configuration service.
     */
    public function __construct( DocumentManagerConfig $config ) {
        $this->config = $config;

        // Add filter to redirect single document views to the file.
        add_action( 'template_redirect', array( $this, 'redirect_document_to_file' ) );

        // Modify search results display for documents.
        add_filter( 'post_type_link', array( $this, 'modify_document_permalink' ), 10, 2 );
        add_filter( 'get_the_excerpt', array( $this, 'modify_document_excerpt_in_search' ), 10, 2 );
    }

    /**
     * Register the Document custom post type
     *
     * Creates a new post type in WordPress to store document information.
     * The post type is configured with specific capabilities and supports
     * features needed for document management while disabling unnecessary
     * WordPress editor features.
     *
     * Key configurations:
     * - Public visibility for search integration
     * - Custom admin UI labels
     * - Support for title, excerpt and author (but not content editor)
     * - Search integration for document discovery
     * - Block editor (Gutenberg) disabled for this post type
     * - Archive page support for document listings
     *
     * This post type serves as the data storage mechanism for documents,
     * using WordPress's database schema but with customized behavior.
     */
    public function register() {
        // Customize labels for admin UI.
        $labels = array(
            'name'               => 'Documents',
            'singular_name'      => 'Document',
            'menu_name'          => 'Documents',
            'add_new'            => 'Add New',
            'add_new_item'       => 'Add New Document',
            'edit_item'          => 'Edit Document',
            'new_item'           => 'New Document',
            'view_item'          => 'View Document',
            'search_items'       => 'Search Documents',
            'not_found'          => 'No documents found',
            'not_found_in_trash' => 'No documents found in Trash',
        );

        // Define post type capabilities and behavior.
        $args = array(
            'labels'              => $labels,
            'public'              => true,  // Make publicly visible for SEO and discovery.
            'show_ui'             => true,  // Show in admin UI.
            'show_in_menu'        => false, // We'll add our own specialized menu.
            'capability_type'     => 'post', // Use default post capabilities.
            'hierarchical'        => false,  // Documents are not hierarchical.
            'supports'            => array( 'title', 'excerpt', 'author' ), // Remove 'editor' support.
            'has_archive'         => true,   // Enable archive pages for listings.
            'rewrite'             => array( 'slug' => 'documents' ), // URL structure.
            'show_in_rest'        => false,  // Disable Gutenberg/block editor.
            'publicly_queryable'  => true,   // Allow front-end queries for search.
            'exclude_from_search' => false,  // Include in site search results.
        );

        // Register the post type with WordPress.
        register_post_type( $this->config->get( 'post_type' ), $args );
    }

    /**
     * Redirect single document views to the actual file
     *
     * When a visitor accesses a single document URL, this method
     * redirects them directly to the document file instead of
     * showing a WordPress content page.
     *
     * This creates a seamless experience where document links
     * behave like direct file links while still maintaining:
     * - WordPress's permissioning system
     * - Search indexing capabilities
     * - Download tracking potential
     *
     * The method checks if the current view is a single document page
     * and performs a redirect to the stored file URL.
     */
    public function redirect_document_to_file() {
        // Only run on single document pages.
        if ( is_singular( $this->config->get( 'post_type' ) ) ) {
            $post_id = get_the_ID();
            // Get the file URL from post metadata.
            $file_url = get_post_meta( $post_id, '_document_file_url', true );

            // Redirect to file if available.
            if ( $file_url ) {
                wp_safe_redirect( $file_url );
                exit;
            }
        }
    }

    /**
     * Modify document permalink to point directly to file
     *
     * Changes the default WordPress permalink for documents to
     * point directly to the file URL instead of the post view.
     *
     * This affects:
     * - Links generated by get_permalink()
     * - Links in search results
     * - Links in archives or listings
     *
     * Benefits include:
     * - More intuitive user experience (clicking goes straight to file)
     * - Proper behavior in search results
     * - Consistency with the redirect behavior
     *
     * @param string $permalink The default WordPress permalink.
     * @param object $post The post object.
     * @return string Modified permalink URL
     */
    public function modify_document_permalink( $permalink, $post ) {
        // Only modify for our document post type.
        if ( $post->post_type === $this->config->get( 'post_type' ) ) {
            // Get file URL from post metadata.
            $file_url = get_post_meta( $post->ID, '_document_file_url', true );
            if ( $file_url ) {
                return $file_url;
            }
        }
        return $permalink;
    }

    /**
     * Modify document excerpt display in search results
     *
     * Enhances the default excerpt in search results to include
     * document-specific metadata like file type. This provides
     * more context about the document directly in search results.
     *
     * The customization only applies in search contexts to maintain
     * normal behavior in other areas of the site.
     *
     * SEO considerations:
     * - Adds valuable metadata to search results
     * - Improves user experience by showing document type
     * - Maintains proper context for document listings
     *
     * @param string $excerpt The default WordPress excerpt.
     * @param object $post The post object.
     * @return string Modified excerpt with document metadata
     */
    public function modify_document_excerpt_in_search( $excerpt, $post ) {
        // Only modify for our document post type.
        if ( is_object( $post ) && $post->post_type === $this->config->get( 'post_type' ) ) {
            // Only add type information if we're in a search context.
            if ( is_search() ) {
                // Get document file type from metadata.
                $file_type      = get_post_meta( $post->ID, '_document_file_type', true );
                $custom_excerpt = '';

                // Add file type information when available.
                if ( $file_type ) {
                    $custom_excerpt .= '<span class="document-type">Type: ' . esc_html( $file_type ) . '</span>';
                }

                // Add the original description.
                if ( $excerpt ) {
                    $custom_excerpt .= ' <span class="document-description">' . $excerpt . '</span>';
                }

                return $custom_excerpt;
            }
            // For all other contexts, just return the excerpt as is.
            return $excerpt;
        }
        return $excerpt;
    }
}
