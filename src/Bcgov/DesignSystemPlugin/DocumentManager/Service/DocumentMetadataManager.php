<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class DocumentMetadataManager {
    private $config;
    
    public function __construct(DocumentManagerConfig $config) {
        $this->config = $config;
    }
    
    /**
     * Update document title and file
     *
     * @param int $post_id Post ID
     * @param string $new_title New title
     * @return bool Success status
     */
    public function updateDocumentTitle($post_id, $new_title) {
        // Update post title
        $update_result = wp_update_post([
            'ID' => $post_id,
            'post_title' => sanitize_text_field($new_title)
        ]);
        
        if (is_wp_error($update_result)) {
            return false;
        }
        
        // Rename the file
        $new_file_url = $this->renameDocumentFile($post_id, $new_title);
        if ($new_file_url) {
            // Update file URL in metadata
            update_post_meta($post_id, '_document_file_url', $new_file_url);
        }
        
        return true;
    }
    
    /**
     * Rename a document file
     *
     * @param int $post_id Post ID
     * @param string $new_title New title
     * @return bool|string New file URL on success, false on failure
     */
    public function renameDocumentFile($post_id, $new_title) {
        // Get current file URL
        $current_file_url = get_post_meta($post_id, '_document_file_url', true);
        if (!$current_file_url) {
            return false;
        }

        // Get file info
        $upload_dir = wp_upload_dir();
        $current_file_path = str_replace($upload_dir['baseurl'], $upload_dir['basedir'], $current_file_url);
        $file_info = pathinfo($current_file_path);
        
        // Create new filename
        $new_filename = sanitize_file_name($new_title . '.' . $file_info['extension']);
        $new_file_path = $file_info['dirname'] . '/' . $new_filename;
        
        // Don't rename if the file already exists
        if (file_exists($new_file_path) && $new_file_path !== $current_file_path) {
            return false;
        }
        
        // Rename the file
        if (!rename($current_file_path, $new_file_path)) {
            return false;
        }
        
        // Return new URL
        return str_replace($upload_dir['basedir'], $upload_dir['baseurl'], $new_file_path);
    }
    
    /**
     * Update document metadata
     *
     * @param int $post_id Post ID
     * @param array $metadata Document metadata
     * @return bool Success status
     * @throws \Exception
     */
    public function updateDocumentMetadata($post_id, $metadata) {
        // Verify post exists and is correct type
        $post = get_post($post_id);
        if (!$post || $post->post_type !== $this->config->get('post_type')) {
            throw new \Exception('Invalid document.');
        }

        // Update title and description
        $update_data = array(
            'ID' => $post_id
        );

        if (isset($metadata['title'])) {
            $new_title = sanitize_text_field($metadata['title']);
            if (!$this->updateDocumentTitle($post_id, $new_title)) {
                throw new \Exception('Failed to update document title.');
            }
        }

        if (isset($metadata['description'])) {
            $update_data['post_excerpt'] = sanitize_textarea_field($metadata['description']);
        }

        // Update the post
        $result = wp_update_post($update_data);
        if (is_wp_error($result)) {
            throw new \Exception('Failed to update document.');
        }

        // Update custom metadata
        if (isset($metadata['meta']) && is_array($metadata['meta'])) {
            foreach ($metadata['meta'] as $meta_key => $value) {
                update_post_meta($post_id, $meta_key, sanitize_text_field($value));
            }
        }
        
        // Clear document cache when metadata is updated
        $this->clearDocumentCache();
        
        return true;
    }
    
    /**
     * Delete a document
     *
     * @param int $post_id Post ID
     * @return bool Success status
     * @throws \Exception
     */
    public function deleteDocument($post_id) {
        // Verify post exists and is correct type
        $post = get_post($post_id);
        if (!$post || $post->post_type !== $this->config->get('post_type')) {
            throw new \Exception('Invalid document.');
        }

        // Delete the post
        $result = wp_delete_post($post_id, true);
        if (!$result) {
            throw new \Exception('Failed to delete document.');
        }
        
        // Clear document cache when a document is deleted
        $this->clearDocumentCache();
        
        return true;
    }
    
    /**
     * Get column settings
     *
     * @return array Column settings
     */
    public function getColumnSettings() {
        // Check for cached column settings
        $cache_key = 'document_manager_columns';
        $columns = get_transient($cache_key);
        
        // If no cache or cache expired
        if (false === $columns) {
            $columns = get_option('document_custom_columns', array());
            
            // Cache the column settings for 1 hour (3600 seconds)
            set_transient($cache_key, $columns, 3600);
            
            // Log cache miss
            error_log('Document Manager: Column settings cache miss');
        } else {
            // Log cache hit
            error_log('Document Manager: Column settings cache hit');
        }
        
        return $columns;
    }
    
    /**
     * Save column settings
     *
     * @param string $label Column label
     * @param string $type Column type (text, select, etc.)
     * @return array Updated column settings
     * @throws \Exception
     */
    public function saveColumnSettings($label, $type = 'text') {
        if (empty($label)) {
            throw new \Exception('Column label is required.');
        }

        // Generate a unique meta key based on the label
        $meta_key = 'doc_' . sanitize_key($label);

        // Get existing columns
        $custom_columns = $this->getColumnSettings();

        // Check if meta key already exists
        if (isset($custom_columns[$meta_key])) {
            throw new \Exception('A column with this name already exists.');
        }

        // Add new column
        $custom_columns[$meta_key] = array(
            'label' => $label,
            'type' => $type
        );

        // Update custom columns option
        if (!update_option('document_custom_columns', $custom_columns)) {
            throw new \Exception('Failed to save column settings.');
        }
        
        // Clear column settings cache
        $this->clearColumnSettingsCache();
        
        return array(
            'message' => 'Column added successfully.',
            'meta_key' => $meta_key
        );
    }
    
    /**
     * Delete a column
     *
     * @param string $meta_key Column meta key
     * @return bool Success status
     * @throws \Exception
     */
    public function deleteColumn($meta_key) {
        if (empty($meta_key)) {
            throw new \Exception('No column key provided.');
        }

        // Get existing columns
        $custom_columns = $this->getColumnSettings();

        // Check if column exists
        if (!isset($custom_columns[$meta_key])) {
            throw new \Exception('Column not found.');
        }

        // Delete the column
        unset($custom_columns[$meta_key]);

        // Update the option
        if (!update_option('document_custom_columns', $custom_columns)) {
            throw new \Exception('Failed to delete column.');
        }
        
        // Delete all metadata for this column
        global $wpdb;
        $wpdb->delete($wpdb->postmeta, array('meta_key' => $meta_key));
        
        // Clear column settings cache
        $this->clearColumnSettingsCache();
        
        return true;
    }
    
    /**
     * Bulk update documents
     *
     * @param array $updates Document updates
     * @return array Result with updated posts
     * @throws \Exception
     */
    public function bulkUpdateDocuments($updates) {
        global $wpdb;
        
        if (!$updates || !is_array($updates)) {
            throw new \Exception('No valid update data received.');
        }

        // Start transaction
        $wpdb->query('START TRANSACTION');
        
        try {
            $success = true;
            $updated_posts = [];

            // Prepare bulk queries
            $title_updates = [];
            $excerpt_updates = [];
            $meta_updates = [];

            foreach ($updates as $post_id => $data) {
                $post_id = intval($post_id);
                
                // Verify post exists and is correct type
                $post = get_post($post_id);
                if (!$post || $post->post_type !== $this->config->get('post_type')) {
                    continue;
                }

                // Collect title updates
                if (isset($data['title'])) {
                    $title_updates[] = $wpdb->prepare(
                        "(%d, %s)",
                        $post_id,
                        sanitize_text_field($data['title'])
                    );
                }

                // Collect description updates
                if (isset($data['description'])) {
                    $excerpt_updates[] = $wpdb->prepare(
                        "(%d, %s)",
                        $post_id,
                        sanitize_textarea_field($data['description'])
                    );
                }

                // Collect metadata updates
                if (isset($data['meta']) && is_array($data['meta'])) {
                    foreach ($data['meta'] as $meta_key => $value) {
                        $meta_updates[] = [
                            'post_id' => $post_id,
                            'meta_key' => sanitize_key($meta_key),
                            'meta_value' => sanitize_text_field($value)
                        ];
                    }
                }

                $updated_posts[] = $post_id;
            }

            // Execute bulk title updates
            if (!empty($title_updates)) {
                $query = "INSERT INTO $wpdb->posts (ID, post_title) VALUES " . 
                        implode(', ', $title_updates) . 
                        " ON DUPLICATE KEY UPDATE post_title = VALUES(post_title)";
                $success = $success && ($wpdb->query($query) !== false);
            }

            // Execute bulk excerpt updates
            if (!empty($excerpt_updates)) {
                $query = "INSERT INTO $wpdb->posts (ID, post_excerpt) VALUES " . 
                        implode(', ', $excerpt_updates) . 
                        " ON DUPLICATE KEY UPDATE post_excerpt = VALUES(post_excerpt)";
                $success = $success && ($wpdb->query($query) !== false);
            }

            // Execute bulk meta updates
            if (!empty($meta_updates)) {
                foreach ($meta_updates as $meta) {
                    update_post_meta($meta['post_id'], $meta['meta_key'], $meta['meta_value']);
                }
            }

            if ($success) {
                $wpdb->query('COMMIT');
                
                // Clear caches for updated posts
                foreach ($updated_posts as $post_id) {
                    clean_post_cache($post_id);
                }
                
                // Clear document cache after bulk updates
                $this->clearDocumentCache();

                return [
                    'message' => 'Changes saved successfully.',
                    'updated' => $updated_posts
                ];
            } else {
                throw new \Exception('Failed to save some changes.');
            }
        } catch (\Exception $e) {
            $wpdb->query('ROLLBACK');
            throw $e;
        }
    }
    
    /**
     * Clear the document cache
     * 
     * @return bool True if at least one cache was cleared
     */
    private function clearDocumentCache() {
        global $wpdb;
        $result = false;
        
        // Clear document count cache
        $count_cache_key = 'document_manager_count';
        $count_result = delete_transient($count_cache_key);
        $result = $result || $count_result;
        
        if ($count_result) {
            error_log('Document Manager: Document count cache cleared');
        }
        
        // Get all document pagination caches
        // This gets all transients that start with 'document_manager_documents_page_'
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
            $page_result = delete_transient($transient_name);
            $result = $result || $page_result;
        }
        
        if (!empty($transients)) {
            error_log('Document Manager: Cleared ' . count($transients) . ' pagination caches');
        }
        
        return $result;
    }
    
    /**
     * Clear the column settings cache
     * 
     * @return bool True if the cache was cleared
     */
    private function clearColumnSettingsCache() {
        $cache_key = 'document_manager_columns';
        $result = delete_transient($cache_key);
        
        if ($result) {
            error_log('Document Manager: Column settings cache cleared');
        }
        
        return $result;
    }
} 