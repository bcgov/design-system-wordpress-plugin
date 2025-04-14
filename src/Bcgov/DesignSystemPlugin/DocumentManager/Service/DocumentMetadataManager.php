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
        $this->clearCache();
        
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
        $this->clearCache();
        
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
     * Clear all document-related caches
     * 
     * @param string|array $types Cache types to clear ('count', 'listings', 'columns', 'all')
     */
    public function clearCache($types = 'all') {
        global $wpdb;
        
        $types = (array)$types;
        
        if (in_array('all', $types) || in_array('count', $types)) {
            delete_transient('document_manager_count');
        }
        
        if (in_array('all', $types) || in_array('listings', $types)) {
            // Clear all page caches using a single SQL query
            $transient_like = $wpdb->esc_like('_transient_document_manager_documents_page_') . '%';
            $wpdb->query(
                $wpdb->prepare(
                    "DELETE FROM $wpdb->options WHERE option_name LIKE %s",
                    $transient_like
                )
            );
        }
        
        if (in_array('all', $types) || in_array('columns', $types)) {
            delete_transient('document_manager_columns');
        }
        
        do_action('bcgov_document_manager_cache_cleared', $types);
        
        error_log('Document Manager: Cache cleared - ' . implode(', ', $types));
    }
    
    /**
     * Alias for backward compatibility
     */
    private function clearDocumentCache() {
        $this->clearCache(['count', 'listings']);
    }
    
    /**
     * Alias for backward compatibility
     */
    public function clearDocumentListCache() {
        $this->clearCache(['count', 'listings']);
    }
    
    /**
     * Alias for backward compatibility
     */
    private function clearColumnSettingsCache() {
        $this->clearCache('columns');
    }
    
    /**
     * Save column settings
     *
     * @param string $label Column label
     * @param string $type Column type (text, number, date, select, etc.)
     * @param array $options Options for select type
     * @return array Updated column settings
     */
    public function saveColumnSettings($label, $type, $options = array()) {
        // Validate inputs
        if (empty($label)) {
            throw new \Exception('Column label is required.');
        }

        // Sanitize the meta key by creating a slug from the label
        $meta_key = 'document_' . sanitize_title($label);

        // Get existing custom columns
        $custom_columns = get_option('document_custom_columns', array());

        // Save the new column settings
        $custom_columns[$meta_key] = array(
            'label' => $label,
            'type' => $type,
        );

        if ($type === 'select' && !empty($options)) {
            $custom_columns[$meta_key]['options'] = $options;
        } else if ($type === 'select') {
            // Default options if none provided for select type
            $custom_columns[$meta_key]['options'] = array('Option 1', 'Option 2', 'Option 3');
        }

        // Save to database
        if (!update_option('document_custom_columns', $custom_columns)) {
            throw new \Exception('Failed to save column settings.');
        }
        
        // Clear document list cache
        $this->clearDocumentListCache();
        
        // Clear column settings cache
        $this->clearColumnSettingsCache();

        return $custom_columns;
    }
    
    /**
     * Delete a column
     *
     * @param string $meta_key Meta key to delete
     * @return bool True if successful
     */
    public function deleteColumn($meta_key) {
        // Get existing custom columns
        $custom_columns = get_option('document_custom_columns', array());

        // Check if column exists
        if (!isset($custom_columns[$meta_key])) {
            throw new \Exception('Column does not exist.');
        }

        // Remove the column
        unset($custom_columns[$meta_key]);

        // Update database
        if (!update_option('document_custom_columns', $custom_columns)) {
            throw new \Exception('Failed to delete column.');
        }
        
        // Delete all post meta with this key
        $this->deleteMetaForAllDocuments($meta_key);
        
        // Clear document list cache
        $this->clearDocumentListCache();
        
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
                $this->clearCache();

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
     * Delete all metadata for a specific key across all documents
     * 
     * @param string $meta_key The meta key to delete
     * @return int|false Number of rows affected or false on error
     */
    protected function deleteMetaForAllDocuments($meta_key) {
        global $wpdb;
        
        // Get all document post IDs
        $post_ids = get_posts(array(
            'post_type' => $this->config->get('post_type'),
            'posts_per_page' => -1,
            'fields' => 'ids',
        ));
        
        if (empty($post_ids)) {
            return 0;
        }
        
        // Delete all metadata for the given meta key
        $count = 0;
        foreach ($post_ids as $post_id) {
            if (delete_post_meta($post_id, $meta_key)) {
                $count++;
            }
        }
        
        return $count;
    }
} 