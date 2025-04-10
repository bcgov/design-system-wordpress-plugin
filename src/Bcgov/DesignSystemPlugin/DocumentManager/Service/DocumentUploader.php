<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;
use Bcgov\DesignSystemPlugin\DocumentManager\Exception\DocumentException;

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
     * @throws DocumentException
     */
    public function uploadSingle(array $file, array $metadata = []) {
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new DocumentException($this->getUploadErrorMessage($file['error']));
        }

        // Check file size
        if ($file['size'] > $this->config->get('max_file_size')) {
            throw new DocumentException('File size exceeds maximum limit.');
        }

        // Check file type
        $file_type = wp_check_filetype($file['name']);
        if (!in_array($file_type['ext'], $this->config->get('allowed_file_types'))) {
            throw new DocumentException('File type not allowed.');
        }

        // Prepare upload directory
        $upload_dir = wp_upload_dir();
        $document_dir = $upload_dir['basedir'] . '/documents/' . date('Y/m');
        wp_mkdir_p($document_dir);

        // Generate unique filename
        $filename = wp_unique_filename($document_dir, $file['name']);
        $file_path = $document_dir . '/' . $filename;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $file_path)) {
            throw new DocumentException('Failed to move uploaded file.');
        }

        // Create post
        $post_data = array(
            'post_title' => !empty($metadata['title']) ? $metadata['title'] : $filename,
            'post_status' => 'publish',
            'post_type' => $this->config->get('post_type')
        );

        $post_id = wp_insert_post($post_data);
        if (is_wp_error($post_id)) {
            throw new DocumentException('Failed to create document post.');
        }

        // Save file metadata
        $file_url = $upload_dir['baseurl'] . '/documents/' . date('Y/m') . '/' . $filename;
        update_post_meta($post_id, '_document_file_url', $file_url);
        update_post_meta($post_id, '_document_file_type', $file_type['type']);

        return [
            'post_id' => $post_id,
            'file_url' => $file_url,
            'file_type' => $file_type['type']
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
} 