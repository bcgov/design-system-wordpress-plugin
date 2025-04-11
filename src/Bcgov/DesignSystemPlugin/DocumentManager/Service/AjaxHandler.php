<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class AjaxHandler {
    private $config;
    private $uploader;
    private $metadataManager;
    
    public function __construct(
        DocumentManagerConfig $config, 
        DocumentUploader $uploader,
        DocumentMetadataManager $metadataManager
    ) {
        $this->config = $config;
        $this->uploader = $uploader;
        $this->metadataManager = $metadataManager;
    }
    
    /**
     * Handle document upload AJAX action
     */
    public function handle_document_upload() {
        try {
            $nonce_key = $this->config->get('nonce_key');
            $received_nonce = $_REQUEST['security'] ?? 'no_nonce';
            
            // Add debug output
            error_log('Received Nonce: ' . $received_nonce);
            error_log('Nonce Key Used: ' . $nonce_key);
            error_log('Nonce Verification Result: ' . (wp_verify_nonce($received_nonce, $nonce_key) ? 'true' : 'false'));

            if (!check_ajax_referer($nonce_key, 'security', false)) {
                throw new \Exception('Invalid security token. Please refresh the page and try again.');
            }

            if (!current_user_can('upload_files')) {
                throw new \Exception('You do not have permission to upload files.');
            }

            $files = $_FILES['document_file'];
            $metadata = isset($_POST['metadata']) ? json_decode(stripslashes($_POST['metadata']), true) : [];
            
            // Ensure metadata is an array even if json_decode fails
            if (!is_array($metadata)) {
                error_log('Failed to parse metadata JSON: ' . ($_POST['metadata'] ?? 'none'));
                $metadata = [];
            }

            $results = [];

            // Handle multiple file uploads
            for ($i = 0; $i < count($files['name']); $i++) {
                $file = array(
                    'name' => $files['name'][$i],
                    'type' => $files['type'][$i],
                    'tmp_name' => $files['tmp_name'][$i],
                    'error' => $files['error'][$i],
                    'size' => $files['size'][$i]
                );

                $results[] = $this->uploader->uploadSingle($file, $metadata);
            }

            wp_send_json_success($results);
        } catch (\Exception $e) {
            error_log('Document upload error: ' . $e->getMessage());
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    /**
     * Handle unauthorized access 
     */
    public function handle_unauthorized_access() {
        wp_send_json_error('You must be logged in to upload documents.', 403);
    }

    /**
     * Save column settings via AJAX
     */
    public function save_column_settings() {
        try {
            // Debug logging
            error_log('Save column settings request received');
            error_log('POST data: ' . print_r($_POST, true));

            // Verify nonce
            if (!check_ajax_referer($this->config->get('nonce_key'), 'security', false)) {
                wp_send_json_error('Invalid security token.', 403);
                return;
            }

            // Check user capabilities
            if (!current_user_can('manage_options')) {
                wp_send_json_error('You do not have permission to save column settings.', 403);
                return;
            }

            // Validate and sanitize input
            $label = isset($_POST['column_label']) ? sanitize_text_field($_POST['column_label']) : '';
            $type = isset($_POST['column_type']) ? sanitize_text_field($_POST['column_type']) : 'text';

            $result = $this->metadataManager->saveColumnSettings($label, $type);
            wp_send_json_success($result);

        } catch (\Exception $e) {
            wp_send_json_error($e->getMessage());
        }
    }

    /**
     * Handle column deletion
     */
    public function delete_column() {
        try {
            // Debug logging
            error_log('Delete column request received');
            error_log('POST data: ' . print_r($_POST, true));

            // Check nonce using 'security' parameter
            if (!check_ajax_referer($this->config->get('nonce_key'), 'security', false)) {
                throw new \Exception('Security check failed.');
            }

            // Check permissions
            if (!current_user_can('manage_options')) {
                throw new \Exception('You do not have permission to delete columns.');
            }

            // Get meta key
            $meta_key = isset($_POST['meta_key']) ? sanitize_key($_POST['meta_key']) : '';
            
            $this->metadataManager->deleteColumn($meta_key);
            
            wp_send_json_success(array(
                'message' => 'Column deleted successfully.'
            ));

        } catch (\Exception $e) {
            error_log('Column deletion error: ' . $e->getMessage());
            wp_send_json_error(array(
                'message' => $e->getMessage()
            ));
        }
    }

    /**
     * Handle saving document metadata via AJAX
     */
    public function save_document_metadata() {
        try {
            // Debug logging
            error_log('Save metadata request received');
            error_log('POST data: ' . print_r($_POST, true));
            error_log('Security token received: ' . ($_REQUEST['security'] ?? 'no_nonce'));
            error_log('Nonce key used: ' . $this->config->get('nonce_key'));
            error_log('Nonce verification result: ' . (wp_verify_nonce($_REQUEST['security'] ?? '', $this->config->get('nonce_key')) ? 'true' : 'false'));
            
            if (!check_ajax_referer($this->config->get('nonce_key'), 'security', false)) {
                throw new \Exception('Security check failed.');
            }

            // Check permissions
            if (!current_user_can('edit_posts')) {
                throw new \Exception('You do not have permission to edit documents.');
            }

            // Get post ID
            $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
            if (!$post_id) {
                throw new \Exception('No document ID provided.');
            }

            // Prepare metadata
            $metadata = [];
            
            if (isset($_POST['title'])) {
                $metadata['title'] = $_POST['title'];
            }
            
            if (isset($_POST['description'])) {
                $metadata['description'] = $_POST['description'];
            }
            
            if (isset($_POST['meta']) && is_array($_POST['meta'])) {
                $metadata['meta'] = $_POST['meta'];
            }
            
            $this->metadataManager->updateDocumentMetadata($post_id, $metadata);
            
            wp_send_json_success(array(
                'message' => 'Document updated successfully.'
            ));

        } catch (\Exception $e) {
            error_log('Document metadata save error: ' . $e->getMessage());
            wp_send_json_error(array(
                'message' => $e->getMessage()
            ));
        }
    }

    /**
     * Handle document deletion
     */
    public function delete_document() {
        try {
            // Debug logging
            error_log('Delete document request received');
            error_log('POST data: ' . print_r($_POST, true));
            error_log('Nonce received: ' . ($_REQUEST['security'] ?? 'no_nonce'));
            error_log('Nonce key used: ' . $this->config->get('nonce_key'));
            
            // Check nonce and capabilities
            if (!check_ajax_referer($this->config->get('nonce_key'), 'security', false)) {
                throw new \Exception('Security check failed.');
            }

            if (!current_user_can('delete_posts')) {
                throw new \Exception('You do not have permission to delete documents.');
            }

            // Get post ID
            $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
            if (!$post_id) {
                throw new \Exception('No document ID provided.');
            }

            $this->metadataManager->deleteDocument($post_id);
            
            wp_send_json_success(array(
                'message' => 'Document deleted successfully.'
            ));
        } catch (\Exception $e) {
            error_log('Document deletion error: ' . $e->getMessage());
            wp_send_json_error(array(
                'message' => $e->getMessage()
            ));
        }
    }

    /**
     * Handle bulk edit save action
     */
    public function save_bulk_edit() {
        try {
            // Debug logging
            error_log('Bulk edit request received');
            error_log('POST data: ' . print_r($_POST, true));
            error_log('Security token received: ' . ($_REQUEST['security'] ?? 'no_nonce'));
            
            // Security checks
            if (!check_ajax_referer($this->config->get('nonce_key'), 'security', false)) {
                throw new \Exception('Invalid security token. Please refresh the page and try again.');
            }

            if (!current_user_can('edit_posts')) {
                throw new \Exception('You do not have permission to edit documents.');
            }

            $updates = isset($_POST['updates']) ? json_decode(stripslashes($_POST['updates']), true) : null;
            $result = $this->metadataManager->bulkUpdateDocuments($updates);
            
            wp_send_json_success($result);
            
        } catch (\Exception $e) {
            error_log('Bulk edit error: ' . $e->getMessage());
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }
} 