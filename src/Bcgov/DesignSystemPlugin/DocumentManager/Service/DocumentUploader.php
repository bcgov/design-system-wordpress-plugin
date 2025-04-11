<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class DocumentUploader {
    private $config;

    public function __construct(DocumentManagerConfig $config) {
        $this->config = $config;
    }

    /**
     * Handle single file upload
     * 
     * @param array $file Single file from $_FILES
     * @param array $metadata Document metadata
     * @return array Upload result with post ID and file URL
     * @throws \Exception
     */
    public function uploadSingle(array $file, array $metadata = []) {
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new \Exception($this->getUploadErrorMessage($file['error']));
        }

        // Check file size
        if ($file['size'] > $this->config->get('max_file_size')) {
            throw new \Exception('File size exceeds maximum limit.');
        }

        // Check file type
        $file_type = wp_check_filetype($file['name']);
        if (!in_array($file_type['ext'], $this->config->get('allowed_file_types'))) {
            throw new \Exception('File type not allowed.');
        }

        // Get the filename without extension for title comparison
        $title = pathinfo($file['name'], PATHINFO_FILENAME);
        
        // Debug log
        error_log('Checking for duplicate document with title: ' . $title);
        
        // Check if a document with this title already exists
        $existing_docs = get_posts([
            'post_type' => $this->config->get('post_type'),
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'title' => $title
        ]);

        // Debug log
        error_log('Found existing docs: ' . print_r($existing_docs, true));

        foreach ($existing_docs as $doc) {
            if (strtolower($doc->post_title) === strtolower($title)) {
                throw new \Exception('A document with the name "' . $title . '" already exists. Please choose a different name.');
            }
        }

        // Set up upload directory
        $upload_dir = wp_upload_dir();
        $document_dir = $upload_dir['basedir'] . '/documents/' . date('Y/m');
        wp_mkdir_p($document_dir);
        
        // Use original filename without modification
        $filename = sanitize_file_name($file['name']);
        $file_path = $document_dir . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $file_path)) {
            throw new \Exception('Failed to move uploaded file.');
        }

        // Create post
        $post_data = array(
            'post_title' => $title,
            'post_status' => 'publish',
            'post_type' => $this->config->get('post_type'),
            'post_excerpt' => isset($metadata['description']) ? sanitize_textarea_field($metadata['description']) : ''
        );

        // Debug logging for post data
        error_log('Creating post with data: ' . print_r($post_data, true));

        $post_id = wp_insert_post($post_data);
        if (is_wp_error($post_id)) {
            throw new \Exception('Failed to create document post.');
        }

        // Save file metadata
        $file_url = $upload_dir['baseurl'] . '/documents/' . date('Y/m') . '/' . $filename;
        update_post_meta($post_id, '_document_file_url', $file_url);
        update_post_meta($post_id, '_document_file_type', $file_type['type']);

        // Get all custom columns
        $custom_columns = get_option('document_custom_columns', array());
        $all_meta = array();

        // Initialize all custom columns with empty values
        foreach ($custom_columns as $meta_key => $column) {
            $all_meta[$meta_key] = '';
        }

        // Update with provided metadata
        if (isset($metadata['meta']) && is_array($metadata['meta'])) {
            foreach ($metadata['meta'] as $meta_key => $value) {
                if (array_key_exists($meta_key, $custom_columns)) {
                    $value = sanitize_text_field($value);
                    $all_meta[$meta_key] = $value;
                    update_post_meta($post_id, $meta_key, $value);
                }
            }
        }

        // Save empty values for any remaining metadata fields
        foreach ($all_meta as $meta_key => $value) {
            if (!isset($metadata['meta'][$meta_key])) {
                update_post_meta($post_id, $meta_key, '');
            }
        }
        
        // Clear document caches after upload
        $this->clearDocumentCaches();

        return [
            'post_id' => $post_id,
            'file_url' => $file_url,
            'title' => $title,
            'description' => $post_data['post_excerpt'],
            'file_type' => $file_type['type'],
            'meta' => $all_meta
        ];
    }

    /**
     * Get upload error message
     *
     * @param int $error_code PHP upload error code
     * @return string Error message
     */
    private function getUploadErrorMessage($error_code) {
        $upload_errors = array(
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive in php.ini',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive specified in the HTML form',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing a temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
        );

        return isset($upload_errors[$error_code]) 
            ? $upload_errors[$error_code] 
            : 'Unknown upload error';
    }
    
    /**
     * Clear all document-related caches
     */
    private function clearDocumentCaches() {
        global $wpdb;
        
        // Clear document count cache
        delete_transient('document_manager_count');
        
        // Get all document pagination caches
        $transient_like = $wpdb->esc_like('_transient_document_manager_documents_page_') . '%';
        $transients = $wpdb->get_col(
            $wpdb->prepare(
                "SELECT option_name FROM $wpdb->options WHERE option_name LIKE %s",
                $transient_like
            )
        );
        
        // Delete each pagination cache
        foreach ($transients as $transient) {
            // Extract the transient name by removing the '_transient_' prefix
            $transient_name = str_replace('_transient_', '', $transient);
            delete_transient($transient_name);
        }
        
        error_log('Document Manager: Cleared caches after document upload');
    }
} 