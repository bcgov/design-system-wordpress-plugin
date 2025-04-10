<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager;

use \WP_Query;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentUploader;
use Bcgov\DesignSystemPlugin\DocumentManager\Exception\DocumentException;

class DocumentManager {
    private const NONCE_KEY = 'document_upload_nonce';
    private const POST_TYPE = 'document';
    
    private $config;
    private $postType;
    private $uploader;
    
    public function __construct() {
        $this->config = new DocumentManagerConfig();
        $this->postType = new DocumentPostType($this->config);
        $this->uploader = new DocumentUploader($this->config);
        
        add_action('admin_menu', array($this, 'add_documents_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        // Add both logged in and logged out AJAX actions
        add_action('wp_ajax_handle_document_upload', array($this, 'handle_document_upload'));
        add_action('wp_ajax_nopriv_handle_document_upload', array($this, 'handle_unauthorized_access'));
        add_action('admin_menu', array($this, 'add_column_settings_submenu'));
        add_action('wp_ajax_save_column_settings', array($this, 'save_column_settings'));
        add_action('wp_ajax_delete_column', array($this, 'delete_column'));
        add_action('wp_ajax_save_document_metadata', array($this, 'save_document_metadata'));
        add_action('wp_ajax_delete_document', array($this, 'delete_document'));
        add_action('wp_ajax_save_bulk_edit', array($this, 'save_bulk_edit'));
    }

    /**
     * Add Documents menu to WordPress admin
     */
    public function add_documents_menu() {
        add_menu_page(
            'Document Manager',
            'Documents',
            'manage_options',
            'document-manager',
            array($this, 'render_document_page'),
            'dashicons-media-document',
            20
        );
    }

    /**
     * Enqueue necessary scripts and styles
     */
    public function enqueue_admin_scripts($hook) {
        $valid_pages = array('toplevel_page_document-manager', 'documents_page_document-columns');
        if (!in_array($hook, $valid_pages)) {
            return;
        }

        // Get the correct plugin directory path and URL
        $plugin_dir = plugin_dir_path(dirname(dirname(dirname(__FILE__))));
        $plugin_url = plugin_dir_url(dirname(dirname(dirname(__FILE__))));
        
        // Remove the extra 'src' from the paths
        $relative_path = 'Bcgov/DesignSystemPlugin/DocumentManager/';
        
        // Construct file paths
        $style_path = $plugin_dir . $relative_path . 'style.css';
        $js_path = $plugin_dir . $relative_path . 'edit.js';
        
        // Construct URLs
        $style_url = $plugin_url . $relative_path . 'style.css';
        $js_url = $plugin_url . $relative_path . 'edit.js';

        // Get file versions
        $style_version = file_exists($style_path) ? filemtime($style_path) : '1.0';
        $js_version = file_exists($js_path) ? filemtime($js_path) : '1.0';

        // Debug information
        error_log('Style path: ' . $style_path);
        error_log('Style URL: ' . $style_url);
        error_log('JS path: ' . $js_path);
        error_log('JS URL: ' . $js_url);

        wp_enqueue_style('document-manager-styles', $style_url, array(), $style_version);
        wp_enqueue_script('document-manager-script', $js_url, array('jquery'), $js_version, true);
        
        // Generate nonce and store it for debugging
        $nonce_key = $this->config->get('nonce_key');
        $nonce = wp_create_nonce($nonce_key);
        
        // Add debug output
        error_log('Enqueuing scripts for bulk edit');
        error_log('Nonce Key: ' . $nonce_key);
        error_log('Generated Nonce: ' . $nonce);

        wp_localize_script('document-manager-script', 'documentManager', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => $nonce,
            'isAdmin' => current_user_can('manage_options'),
            'messages' => $this->getLocalizedMessages()
        ));
    }

    /**
     * Get localized messages for JavaScript
     *
     * @return array
     */
    private function getLocalizedMessages() {
        return array(
            'unauthorized' => __('You do not have permission to perform this action.', 'design-system'),
            'uploadError' => __('Error uploading file.', 'design-system'),
            'success' => __('Document uploaded successfully.', 'design-system'),
            'deleteConfirm' => __('Are you sure you want to delete this document?', 'design-system'),
            'saving' => __('Saving changes...', 'design-system'),
            'saved' => __('Changes saved successfully.', 'design-system'),
        );
    }

    /**
     * Render the document manager page
     */
    public function render_document_page() {
        $custom_columns = get_option('document_custom_columns', array());
        ?>
        <div class="wrap">
            <h1>Document Manager</h1>
            
            <div class="document-upload-section">
                <h2>Upload New Documents</h2>
                <form id="document-upload-form" method="post" enctype="multipart/form-data">
                    <div class="drag-drop-zone" id="drag-drop-zone">
                        <div class="drag-drop-content">
                            <i class="dashicons dashicons-upload"></i>
                            <p>Drag and drop your documents here</p>
                            <p class="drag-drop-or">or</p>
                            <label for="document_file" class="button">Choose Files</label>
                            <input type="file" 
                                   name="document_file[]" 
                                   id="document_file" 
                                   class="file-input-hidden" 
                                   multiple 
                                   required 
                                   accept=".pdf,application/pdf">
                            <p class="selected-file-name"></p>
                        </div>
                    </div>
                    <?php wp_nonce_field('document_upload_nonce', 'document_upload_nonce'); ?>
                </form>
            </div>

            <!-- Upload Metadata Modal -->
            <div id="upload-metadata-modal" class="metadata-modal" style="display: none;">
                <div class="metadata-modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Document Details</h2>
                    <p class="description">These details will be applied to all uploaded documents. You can edit individual documents after upload.</p>
                    <form id="upload-metadata-form">
                        <div class="form-section">
                            <h3>Document Details</h3>
                            <div class="custom-field">
                                <label for="document_description">Description</label>
                                <textarea name="document_description" id="document_description"></textarea>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Additional Information</h3>
                            <?php foreach ($custom_columns as $meta_key => $column): ?>
                                <div class="custom-field">
                                    <label for="<?php echo esc_attr($meta_key); ?>"><?php echo esc_html($column['label']); ?></label>
                                    <?php if ($column['type'] === 'select'): ?>
                                        <select name="meta[<?php echo esc_attr($meta_key); ?>]" id="<?php echo esc_attr($meta_key); ?>">
                                            <option value="">Select <?php echo esc_html($column['label']); ?></option>
                                            <?php foreach ($column['options'] as $option): ?>
                                                <option value="<?php echo esc_attr($option); ?>"><?php echo esc_html($option); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    <?php else: ?>
                                        <input type="<?php echo esc_attr($column['type']); ?>" 
                                               name="meta[<?php echo esc_attr($meta_key); ?>]" 
                                               id="<?php echo esc_attr($meta_key); ?>">
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <button type="submit" class="button button-primary">Upload Documents</button>
                        <button type="button" class="button cancel-upload">Cancel</button>
                    </form>
                </div>
            </div>

            <div class="document-library-section">
                <h2>Document Library</h2>
                <?php
                $documents = new \WP_Query(array(
                    'post_type' => 'document',
                    'posts_per_page' => -1,
                ));

                if ($documents->have_posts()) : ?>
                    <div class="table-actions">
                        <button type="button" class="button toggle-bulk-edit">Enable Bulk Edit Mode</button>
                        <button type="button" class="button button-primary save-bulk-edit" style="display: none;">Save Changes</button>
                        <button type="button" class="button cancel-bulk-edit" style="display: none;">Cancel</button>
                    </div>
                    <form id="bulk-edit-form">
                        <table class="wp-list-table widefat fixed striped">
                            <thead>
                                <tr>
                                    <th class="column-icon" style="width: 30px;"></th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>File Type</th>
                                    <th>Upload Date</th>
                                    <?php foreach ($custom_columns as $meta_key => $column): ?>
                                        <th><?php echo esc_html($column['label']); ?></th>
                                    <?php endforeach; ?>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php while ($documents->have_posts()) : $documents->the_post(); 
                                    $file_url = get_post_meta(get_the_ID(), '_document_file_url', true);
                                    $file_type = get_post_meta(get_the_ID(), '_document_file_type', true);
                                ?>
                                    <tr data-id="<?php echo get_the_ID(); ?>">
                                        <td class="column-icon">
                                            <?php 
                                            $icon_class = 'dashicons ';
                                            switch ($file_type) {
                                                case 'application/pdf':
                                                    $icon_class .= 'dashicons-pdf';
                                                    break;
                                                case 'application/msword':
                                                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                                                    $icon_class .= 'dashicons-media-document';
                                                    break;
                                                case 'application/vnd.ms-excel':
                                                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                                    $icon_class .= 'dashicons-spreadsheet';
                                                    break;
                                                default:
                                                    $icon_class .= 'dashicons-media-default';
                                            }
                                            ?>
                                            <span class="<?php echo esc_attr($icon_class); ?>"></span>
                                        </td>
                                        <td class="editable" data-field="title">
                                            <span class="view-mode"><?php the_title(); ?></span>
                                            <input type="text" class="edit-mode" value="<?php echo esc_attr(get_the_title()); ?>" style="display: none;">
                                        </td>
                                        <td class="editable" data-field="description">
                                            <span class="view-mode"><?php echo esc_html(get_the_excerpt()); ?></span>
                                            <textarea class="edit-mode" style="display: none;"><?php echo esc_textarea(get_the_excerpt()); ?></textarea>
                                        </td>
                                        <td><?php echo esc_html($file_type); ?></td>
                                        <td><?php echo get_the_date(); ?></td>
                                        <?php foreach ($custom_columns as $meta_key => $column): 
                                            $value = get_post_meta(get_the_ID(), $meta_key, true);
                                        ?>
                                            <td class="editable" data-field="<?php echo esc_attr($meta_key); ?>">
                                                <span class="view-mode"><?php echo esc_html($value ?: '—'); ?></span>
                                                <?php if ($column['type'] === 'select'): ?>
                                                    <select class="edit-mode" style="display: none;">
                                                        <option value="">Select <?php echo esc_html($column['label']); ?></option>
                                                        <?php foreach ($column['options'] as $option): ?>
                                                            <option value="<?php echo esc_attr($option); ?>" <?php selected($value, $option); ?>>
                                                                <?php echo esc_html($option); ?>
                                                            </option>
                                                        <?php endforeach; ?>
                                                    </select>
                                                <?php elseif ($column['type'] === 'date'): ?>
                                                    <input type="date" class="edit-mode" value="<?php echo esc_attr($value); ?>" style="display: none;">
                                                <?php elseif ($column['type'] === 'number'): ?>
                                                    <input type="number" class="edit-mode" value="<?php echo esc_attr($value); ?>" style="display: none;">
                                                <?php else: ?>
                                                    <input type="text" class="edit-mode" value="<?php echo esc_attr($value); ?>" style="display: none;">
                                                <?php endif; ?>
                                            </td>
                                        <?php endforeach; ?>
                                        <td>
                                            <a href="<?php echo esc_url($file_url); ?>" class="button button-small" target="_blank">Download</a>
                                            <button type="button" 
                                                    class="button button-small edit-metadata" 
                                                    data-id="<?php echo get_the_ID(); ?>"
                                                    data-title="<?php echo esc_attr(get_the_title()); ?>"
                                                    data-description="<?php echo esc_attr(get_the_excerpt()); ?>"
                                                    data-slug="<?php echo esc_attr(get_post_field('post_name')); ?>"
                                                    data-metadata="<?php 
                                                        $metadata = array();
                                                        foreach ($custom_columns as $meta_key => $column) {
                                                            $metadata[$meta_key] = get_post_meta(get_the_ID(), $meta_key, true);
                                                        }
                                                        echo esc_attr(json_encode($metadata));
                                                    ?>">
                                                Edit
                                            </button>
                                            <button type="button" 
                                                    class="button button-small button-link-delete delete-document" 
                                                    data-post-id="<?php echo get_the_ID(); ?>"
                                                    data-title="<?php echo esc_attr(get_the_title()); ?>">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                        <?php 
                        // Change this line from using 'document_upload_nonce' to using the config nonce key
                        wp_nonce_field($this->config->get('nonce_key'), 'bulk_edit_nonce'); 
                        ?>
                    </form>
                <?php else : ?>
                    <p>No documents found.</p>
                <?php endif; 
                wp_reset_postdata();
                ?>
            </div>

            <!-- Single Document Edit Modal -->
            <div id="edit-document-modal" class="metadata-modal">
                <div class="metadata-modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Edit Document</h2>
                    <form id="edit-document-form">
                        <input type="hidden" name="post_id" id="edit-post-id">
                        
                        <div class="form-section">
                            <h3>Document Details</h3>
                            <div class="custom-field">
                                <label for="edit_document_title">Title</label>
                                <input type="text" name="title" id="edit_document_title" required>
                                <p class="description">The name of your document</p>
                            </div>
                            <div class="custom-field">
                                <label for="edit_document_description">Description</label>
                                <textarea name="description" id="edit_document_description"></textarea>
                                <p class="description">A brief description of the document (optional)</p>
                            </div>
                        </div>

                        <div class="form-section">
                            <h3>Additional Information</h3>
                            <?php foreach ($custom_columns as $meta_key => $column): ?>
                                <div class="custom-field">
                                    <label for="edit_<?php echo esc_attr($meta_key); ?>"><?php echo esc_html($column['label']); ?></label>
                                    <?php if ($column['type'] === 'select'): ?>
                                        <select name="meta[<?php echo esc_attr($meta_key); ?>]" id="edit_<?php echo esc_attr($meta_key); ?>">
                                            <option value="">Select <?php echo esc_html($column['label']); ?></option>
                                            <?php foreach ($column['options'] as $option): ?>
                                                <option value="<?php echo esc_attr($option); ?>"><?php echo esc_html($option); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    <?php elseif ($column['type'] === 'date'): ?>
                                        <input type="date" name="meta[<?php echo esc_attr($meta_key); ?>]" id="edit_<?php echo esc_attr($meta_key); ?>">
                                    <?php elseif ($column['type'] === 'number'): ?>
                                        <input type="number" name="meta[<?php echo esc_attr($meta_key); ?>]" id="edit_<?php echo esc_attr($meta_key); ?>">
                                    <?php else: ?>
                                        <input type="text" name="meta[<?php echo esc_attr($meta_key); ?>]" id="edit_<?php echo esc_attr($meta_key); ?>">
                                    <?php endif; ?>
                                    <?php if (!empty($column['description'])): ?>
                                        <p class="description"><?php echo esc_html($column['description']); ?></p>
                                    <?php endif; ?>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="button button-primary">Save Changes</button>
                            <button type="button" class="button cancel-edit">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <?php
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
                throw new DocumentException('Invalid security token. Please refresh the page and try again.');
            }

            if (!current_user_can('upload_files')) {
                throw new DocumentException('You do not have permission to upload files.');
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
        } catch (DocumentException $e) {
            error_log('Document upload error: ' . $e->getMessage());
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }

    // Add this new method to handle unauthorized access
    public function handle_unauthorized_access() {
        wp_send_json_error('You must be logged in to upload documents.', 403);
    }

    /**
     * Add Column Settings submenu
     */
    public function add_column_settings_submenu() {
        add_submenu_page(
            'document-manager',
            'Column Settings',
            'Column Settings',
            'manage_options',
            'document-columns',
            array($this, 'render_column_settings_page')
        );
    }

    /**
     * Render Column Settings page
     */
    public function render_column_settings_page() {
        $custom_columns = get_option('document_custom_columns', array());
        ?>
        <div class="wrap">
            <h1>Document Library Column Settings</h1>
            
            <div class="column-manager-section">
                <h2>Add New Column</h2>
                <form id="add-column-form" method="post">
                    <table class="form-table">
                        <tr>
                            <th><label for="column_label">Column Label</label></th>
                            <td>
                                <input type="text" id="column_label" name="column_label" class="regular-text" required>
                                <p class="description">Enter a label for your new column</p>
                            </td>
                        </tr>
                    </table>
                    <input type="hidden" name="column_type" value="text">
                    <button type="submit" class="button button-primary">Add Column</button>
                </form>
            </div>

            <div class="existing-columns-section">
                <h2>Existing Columns</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Column Label</th>
                            <th>Meta Key</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($custom_columns as $meta_key => $column): ?>
                        <tr>
                            <td><?php echo esc_html($column['label']); ?></td>
                            <td><?php echo esc_html($meta_key); ?></td>
                            <td>
                                <button class="button button-small delete-column" 
                                    data-meta-key="<?php echo esc_attr($meta_key); ?>">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
    }

    /**
     * Save column settings via AJAX
     */
    public function save_column_settings() {
        // Debug logging
        error_log('Save column settings request received');
        error_log('POST data: ' . print_r($_POST, true));

        // Verify nonce
        if (!check_ajax_referer('document_upload_nonce', 'security', false)) {
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

        if (empty($label)) {
            wp_send_json_error('Column label is required.');
            return;
        }

        // Generate a unique meta key based on the label
        $meta_key = 'doc_' . sanitize_key($label);

        // Get existing columns
        $custom_columns = get_option('document_custom_columns', array());

        // Check if meta key already exists
        if (isset($custom_columns[$meta_key])) {
            wp_send_json_error('A column with this name already exists.');
            return;
        }

        // Add new column (always as text type)
        $custom_columns[$meta_key] = array(
            'label' => $label,
            'type' => 'text'
        );

        // Update custom columns option
        if (update_option('document_custom_columns', $custom_columns)) {
            wp_send_json_success(array(
                'message' => 'Column added successfully.',
                'meta_key' => $meta_key
            ));
        } else {
            wp_send_json_error('Failed to save column settings.');
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

            // Check nonce
            if (!check_ajax_referer($this->config->get('nonce_key'), 'nonce', false)) {
                throw new DocumentException('Security check failed.');
            }

            // Check permissions
        if (!current_user_can('manage_options')) {
                throw new DocumentException('You do not have permission to delete columns.');
        }

            // Get meta key
            $meta_key = isset($_POST['meta_key']) ? sanitize_key($_POST['meta_key']) : '';
        if (empty($meta_key)) {
                throw new DocumentException('No column key provided.');
        }

            // Get existing columns
        $custom_columns = get_option('document_custom_columns', array());

        // Check if column exists
        if (!isset($custom_columns[$meta_key])) {
                throw new DocumentException('Column not found.');
        }

            // Delete the column
        unset($custom_columns[$meta_key]);

            // Update the option
        if (update_option('document_custom_columns', $custom_columns)) {
                // Delete all metadata for this column
                global $wpdb;
                $wpdb->delete($wpdb->postmeta, array('meta_key' => $meta_key));

            wp_send_json_success(array(
                    'message' => 'Column deleted successfully.'
            ));
        } else {
                throw new DocumentException('Failed to delete column.');
            }

        } catch (DocumentException $e) {
            error_log('Column deletion error: ' . $e->getMessage());
            wp_send_json_error(array(
                'message' => $e->getMessage()
            ));
        }
    }

    /**
     * Rename a document file
     *
     * @param int $post_id Post ID
     * @param string $new_title New title
     * @return bool|string New file URL on success, false on failure
     */
    private function rename_document_file($post_id, $new_title) {
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
     * Update document title and file
     *
     * @param int $post_id Post ID
     * @param string $new_title New title
     * @return bool Success status
     */
    private function update_document_title($post_id, $new_title) {
        // Update post title
        $update_result = wp_update_post([
            'ID' => $post_id,
            'post_title' => sanitize_text_field($new_title)
        ]);
        
        if (is_wp_error($update_result)) {
            return false;
        }
        
        // Rename the file
        $new_file_url = $this->rename_document_file($post_id, $new_title);
        if ($new_file_url) {
            // Update file URL in metadata
            update_post_meta($post_id, '_document_file_url', $new_file_url);
        }
        
        return true;
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
                throw new DocumentException('Security check failed.');
            }

            // Check permissions
            if (!current_user_can('edit_posts')) {
                throw new DocumentException('You do not have permission to edit documents.');
            }

            // Get post ID
            $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
            if (!$post_id) {
                throw new DocumentException('No document ID provided.');
            }

            // Verify post exists and is correct type
            $post = get_post($post_id);
            if (!$post || $post->post_type !== $this->config->get('post_type')) {
                throw new DocumentException('Invalid document.');
            }

            // Update title and description
            $update_data = array(
                'ID' => $post_id
            );

            if (isset($_POST['title'])) {
                $new_title = sanitize_text_field($_POST['title']);
                if (!$this->update_document_title($post_id, $new_title)) {
                    throw new DocumentException('Failed to update document title.');
                }
            }

            if (isset($_POST['description'])) {
                $update_data['post_excerpt'] = sanitize_textarea_field($_POST['description']);
            }

            // Update the post
            $result = wp_update_post($update_data);
            if (is_wp_error($result)) {
                throw new DocumentException('Failed to update document.');
            }

            // Update metadata
            if (isset($_POST['meta']) && is_array($_POST['meta'])) {
                foreach ($_POST['meta'] as $meta_key => $value) {
                    update_post_meta($post_id, $meta_key, sanitize_text_field($value));
            }
        }

        wp_send_json_success(array(
            'message' => 'Document updated successfully.'
        ));

        } catch (DocumentException $e) {
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
                throw new DocumentException('Security check failed.');
            }

            if (!current_user_can('delete_posts')) {
                throw new DocumentException('You do not have permission to delete documents.');
            }

            // Get post ID
            $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
            if (!$post_id) {
                throw new DocumentException('No document ID provided.');
            }

            // Verify post exists and is correct type
            $post = get_post($post_id);
            if (!$post || $post->post_type !== $this->config->get('post_type')) {
                throw new DocumentException('Invalid document.');
            }

            // Delete the post
            $result = wp_delete_post($post_id, true);
        if (!$result) {
                throw new DocumentException('Failed to delete document.');
        }

        wp_send_json_success(array(
            'message' => 'Document deleted successfully.'
        ));
        } catch (DocumentException $e) {
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
            global $wpdb;
            
            // Debug logging
            error_log('Bulk edit request received');
            error_log('POST data: ' . print_r($_POST, true));
            error_log('Security token received: ' . ($_REQUEST['security'] ?? 'no_nonce'));
            
            // Security checks - Change 'nonce' to 'security'
            if (!check_ajax_referer($this->config->get('nonce_key'), 'security', false)) {
                throw new DocumentException('Invalid security token. Please refresh the page and try again.');
            }

            if (!current_user_can('edit_posts')) {
                throw new DocumentException('You do not have permission to edit documents.');
            }

            $updates = isset($_POST['updates']) ? json_decode(stripslashes($_POST['updates']), true) : null;
            if (!$updates || !is_array($updates)) {
                throw new DocumentException('No valid update data received.');
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

                    wp_send_json_success([
                        'message' => 'Changes saved successfully.',
                        'updated' => $updated_posts
                    ]);
                } else {
                    throw new DocumentException('Failed to save some changes.');
                }
            } catch (Exception $e) {
                $wpdb->query('ROLLBACK');
                throw $e;
            }
        } catch (Exception $e) {
            error_log('Bulk edit error: ' . $e->getMessage());
            wp_send_json_error(['message' => $e->getMessage()]);
        }
    }
} 