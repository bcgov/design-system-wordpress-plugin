<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentUploader;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\AdminUIManager;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\AjaxHandler;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentMetadataManager;

class DocumentManager {
    private const NONCE_KEY = 'document_upload_nonce';
    private const POST_TYPE = 'document';
    
    private $config;
    private $postType;
    private $uploader;
    private $adminUI;
    private $ajaxHandler;
    private $metadataManager;
    
    public function __construct() {
        // Only initialize the config in the constructor
        $this->config = new DocumentManagerConfig();
        
        // Initialize the plugin
        $this->init();
    }
    
    /**
     * Initialize the DocumentManager plugin
     */
    private function init() {
        // Register hooks and filters
        $this->register();
    }
    
    /**
     * Register hooks and filters
     */
    public function register() {
        add_action('init', array($this, 'registerPostTypes'));
        add_action('admin_menu', array($this, 'registerAdminMenus'));
        add_action('admin_enqueue_scripts', array($this->getAdminUI(), 'enqueue_admin_scripts'));
        
        $this->registerAjaxHandlers();
        $this->registerShortcodes();
        $this->registerFilters();
    }
    
    /**
     * Register admin menus and submenus
     */
    public function registerAdminMenus() {
        $this->getAdminUI()->add_documents_menu();
        $this->getAdminUI()->add_metadata_settings_submenu();
    }
    
    /**
     * Register AJAX handlers
     */
    private function registerAjaxHandlers() {
        add_action('wp_ajax_upload_document', array($this->getAjaxHandler(), 'handle_document_upload'));
        add_action('wp_ajax_nopriv_upload_document', array($this->getAjaxHandler(), 'handle_unauthorized_access'));
        add_action('wp_ajax_save_document_metadata', array($this->getAjaxHandler(), 'save_document_metadata'));
        add_action('wp_ajax_delete_document', array($this->getAjaxHandler(), 'delete_document'));
        add_action('wp_ajax_save_metadata_settings', array($this->getAjaxHandler(), 'save_metadata_settings'));
        add_action('wp_ajax_delete_metadata', array($this->getAjaxHandler(), 'delete_metadata'));
        add_action('wp_ajax_save_bulk_edit', array($this->getAjaxHandler(), 'save_bulk_edit'));
    }
    
    /**
     * Get the PostType service
     *
     * @return DocumentPostType
     */
    public function getPostType() {
        if (null === $this->postType) {
            $this->postType = new DocumentPostType($this->config);
        }
        
        return $this->postType;
    }
    
    /**
     * Get the Uploader service
     *
     * @return DocumentUploader
     */
    public function getUploader() {
        if (null === $this->uploader) {
            $this->uploader = new DocumentUploader($this->config);
        }
        
        return $this->uploader;
    }
    
    /**
     * Get the MetadataManager service
     *
     * @return DocumentMetadataManager
     */
    public function getMetadataManager() {
        if (null === $this->metadataManager) {
            $this->metadataManager = new DocumentMetadataManager($this->config);
        }
        
        return $this->metadataManager;
    }
    
    /**
     * Get the AdminUI service
     *
     * @return AdminUIManager
     */
    public function getAdminUI() {
        if (null === $this->adminUI) {
            $this->adminUI = new AdminUIManager(
                $this->config, 
                $this->getUploader(), 
                $this->getMetadataManager()
            );
        }
        
        return $this->adminUI;
    }
    
    /**
     * Get the AjaxHandler service
     *
     * @return AjaxHandler
     */
    public function getAjaxHandler() {
        if (null === $this->ajaxHandler) {
            $this->ajaxHandler = new AjaxHandler(
                $this->config,
                $this->getUploader(),
                $this->getMetadataManager()
            );
        }
        
        return $this->ajaxHandler;
    }
    
    /**
     * Register Document post type
     */
    public function registerPostTypes() {
        $this->getPostType()->register();
    }
    
    /**
     * Register shortcodes if any
     */
    public function registerShortcodes() {
        // No shortcodes implemented yet
    }
    
    /**
     * Register filters if any
     */
    public function registerFilters() {
        // No filters implemented yet
    }
} 