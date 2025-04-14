<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentUploader;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\AdminUIManager;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\AjaxHandler;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentMetadataManager;

/**
 * Main DocumentManager class that coordinates various document management services
 */
class DocumentManager {
    private const NONCE_KEY = 'document_upload_nonce';
    private const POST_TYPE = 'document';
    
    /** @var DocumentManagerConfig */
    private DocumentManagerConfig $config;
    
    /** @var DocumentPostType|null */
    private ?DocumentPostType $postType = null;
    
    /** @var DocumentUploader|null */
    private ?DocumentUploader $uploader = null;
    
    /** @var AdminUIManager|null */
    private ?AdminUIManager $adminUI = null;
    
    /** @var AjaxHandler|null */
    private ?AjaxHandler $ajaxHandler = null;
    
    /** @var DocumentMetadataManager|null */
    private ?DocumentMetadataManager $metadataManager = null;
    
    /**
     * Constructor
     * 
     * @param DocumentManagerConfig|null $config Optional config instance
     */
    public function __construct(DocumentManagerConfig $config = null) {
        // Initialize the config
        $this->config = $config ?: new DocumentManagerConfig();
        
        // Register hooks and filters
        $this->register();
    }
    
    /**
     * Register hooks and filters
     *
     * @return void
     */
    public function register(): void {
        add_action('init', [$this, 'registerPostTypes']);
        add_action('admin_menu', [$this, 'registerAdminMenus']);
        add_action('admin_enqueue_scripts', [$this->getAdminUI(), 'enqueue_admin_scripts']);
        
        // Register event handlers for cache clearing
        add_action('bcgov_document_manager_document_uploaded', [$this->getMetadataManager(), 'clearCache']);
        
        $this->registerAjaxHandlers();
        $this->registerShortcodes();
        $this->registerFilters();
    }
    
    /**
     * Register admin menus and submenus
     *
     * @return void
     */
    public function registerAdminMenus(): void {
        $this->getAdminUI()->add_documents_menu();
        $this->getAdminUI()->add_metadata_settings_submenu();
    }
    
    /**
     * Register AJAX handlers
     *
     * @return void
     */
    private function registerAjaxHandlers(): void {
        $ajax = $this->getAjaxHandler();
        
        add_action('wp_ajax_upload_document', [$ajax, 'handle_document_upload']);
        add_action('wp_ajax_nopriv_upload_document', [$ajax, 'handle_unauthorized_access']);
        add_action('wp_ajax_save_document_metadata', [$ajax, 'save_document_metadata']);
        add_action('wp_ajax_delete_document', [$ajax, 'delete_document']);
        add_action('wp_ajax_save_metadata_settings', [$ajax, 'save_metadata_settings']);
        add_action('wp_ajax_delete_metadata', [$ajax, 'delete_metadata']);
        add_action('wp_ajax_save_bulk_edit', [$ajax, 'save_bulk_edit']);
    }
    
    /**
     * Get the PostType service
     *
     * @return DocumentPostType
     */
    public function getPostType(): DocumentPostType {
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
    public function getUploader(): DocumentUploader {
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
    public function getMetadataManager(): DocumentMetadataManager {
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
    public function getAdminUI(): AdminUIManager {
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
    public function getAjaxHandler(): AjaxHandler {
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
     *
     * @return void
     */
    public function registerPostTypes(): void {
        $this->getPostType()->register();
    }
    
    /**
     * Register shortcodes if any
     *
     * @return void
     */
    public function registerShortcodes(): void {
        // No shortcodes implemented yet
    }
    
    /**
     * Register filters if any
     *
     * @return void
     */
    public function registerFilters(): void {
        // No filters implemented yet
    }
} 