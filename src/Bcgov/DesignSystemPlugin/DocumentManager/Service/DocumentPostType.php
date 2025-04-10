<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class DocumentPostType {
    private $config;

    public function __construct(DocumentManagerConfig $config) {
        $this->config = $config;
        add_action('init', array($this, 'register'));
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
            'supports'            => array('title', 'author'),
            'has_archive'         => true,
            'rewrite'             => array('slug' => 'documents'),
            'show_in_rest'        => true,
        );

        register_post_type($this->config->get('post_type'), $args);
    }
}
