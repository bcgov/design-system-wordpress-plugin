<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager;

use \WP_Query;
use Bcgov\DesignSystemPlugin\DocumentManager\Service\DocumentPostType;
use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class DocumentManager {
    private $config;
    private $postType;
    
    public function __construct() {
        $this->config = new DocumentManagerConfig();
        $this->postType = new DocumentPostType();
        
        // Admin menu and scripts
        add_action('admin_menu', array($this, 'add_documents_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        // AJAX handlers
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
        // Check if we're on either the main document page or column settings page
        if (!in_array($hook, array('toplevel_page_document-manager', 'documents_page_document-columns'))) {
            return;
        }

        wp_enqueue_style('document-manager-styles', plugin_dir_url(__FILE__) . './style.css');
        wp_enqueue_script('document-manager-script', plugin_dir_url(__FILE__) . './edit.js', array('jquery'), '1.0.0', true);
        
        // Add more specific data to the localized script
        wp_localize_script('document-manager-script', 'documentManager', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('document_upload_nonce'),
            'isAdmin' => current_user_can('manage_options'),
            'messages' => array(
                'unauthorized' => 'You do not have permission to perform this action.',
                'uploadError' => 'Error uploading file.',
                'success' => 'Document uploaded successfully.'
            )
        ));
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
                            <input type="file" name="document_file[]" id="document_file" class="file-input-hidden" multiple required>
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
                                <label for="document_title">Title Base</label>
                                <input type="text" name="document_title" id="document_title" required>
                                <p class="description">Individual numbers will be added for multiple files</p>
                            </div>
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
                                        <select name="<?php echo esc_attr($meta_key); ?>" id="<?php echo esc_attr($meta_key); ?>">
                                            <option value="">Select <?php echo esc_html($column['label']); ?></option>
                                            <?php foreach ($column['options'] as $option): ?>
                                                <option value="<?php echo esc_attr($option); ?>"><?php echo esc_html($option); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    <?php elseif ($column['type'] === 'date'): ?>
                                        <input type="date" name="<?php echo esc_attr($meta_key); ?>" id="<?php echo esc_attr($meta_key); ?>">
                                    <?php elseif ($column['type'] === 'number'): ?>
                                        <input type="number" name="<?php echo esc_attr($meta_key); ?>" id="<?php echo esc_attr($meta_key); ?>">
                                    <?php else: ?>
                                        <input type="text" name="<?php echo esc_attr($meta_key); ?>" id="<?php echo esc_attr($meta_key); ?>">
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
                                        <td class="editable" data-field="title">
                                            <span class="view-mode"><?php the_title(); ?></span>
                                            <input type="text" class="edit-mode" value="<?php echo esc_attr(get_the_title()); ?>" style="display: none;">
                                        </td>
                                        <td class="editable" data-field="description">
                                            <span class="view-mode"><?php echo get_the_excerpt(); ?></span>
                                            <textarea class="edit-mode" style="display: none;"><?php echo esc_textarea(get_the_excerpt()); ?></textarea>
                                        </td>
                                        <td><?php echo esc_html($file_type); ?></td>
                                        <td><?php echo get_the_date(); ?></td>
                                        <?php foreach ($custom_columns as $meta_key => $column): 
                                            $value = get_post_meta(get_the_ID(), $meta_key, true);
                                        ?>
                                            <td class="editable" data-field="<?php echo esc_attr($meta_key); ?>">
                                                <span class="view-mode"><?php echo esc_html($value); ?></span>
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
                                                Edit Document
                                            </button>
                                            <button type="button" 
                                                    class="button button-small button-link-delete delete-document" 
                                                    data-id="<?php echo get_the_ID(); ?>"
                                                    data-title="<?php echo esc_attr(get_the_title()); ?>">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                        <?php wp_nonce_field('document_upload_nonce', 'bulk_edit_nonce'); ?>
                    </form>
                <?php else : ?>
                    <p>No documents found.</p>
                <?php endif; 
                wp_reset_postdata();
                ?>
            </div>
        </div>
        <?php
    }

    /**
     * Handle document upload via AJAX
     */
    public function handle_document_upload() {
        // First check if user is logged in
        if (!is_user_logged_in()) {
            wp_send_json_error('You must be logged in to upload documents.', 403);
            return;
        }

        // Verify nonce
        if (!check_ajax_referer('document_upload_nonce', 'security', false)) {
            wp_send_json_error('Invalid security token.', 403);
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to upload documents.', 403);
            return;
        }

        // Check if files were uploaded
        if (!isset($_FILES['document_file'])) {
            wp_send_json_error('No files were uploaded.', 400);
            return;
        }

        // Validate and sanitize input
        $base_title = isset($_POST['document_title']) ? sanitize_text_field($_POST['document_title']) : '';
        $description = isset($_POST['document_description']) ? sanitize_textarea_field($_POST['document_description']) : '';

        if (empty($base_title)) {
            wp_send_json_error('Document title is required.', 400);
            return;
        }

        // Get custom columns for metadata
        $custom_columns = get_option('document_custom_columns', array());
        $metadata = array();
        foreach ($custom_columns as $meta_key => $column) {
            if (isset($_POST[$meta_key])) {
                $value = $_POST[$meta_key];
                
                // Sanitize based on field type
                switch ($column['type']) {
                    case 'number':
                        $value = floatval($value);
                        break;
                    case 'date':
                        $value = sanitize_text_field($value);
                        break;
                    case 'select':
                        if (!in_array($value, $column['options'])) {
                            $value = ''; // Invalid option
                        }
                        break;
                    default:
                        $value = sanitize_text_field($value);
                }
                
                $metadata[$meta_key] = $value;
            }
        }

        // Handle multiple file uploads
        $uploaded_files = $_FILES['document_file'];
        $success_count = 0;
        $error_messages = array();
        $uploaded_documents = array();

        // Reorganize files array if multiple files
        $files = array();
        $file_count = is_array($uploaded_files['name']) ? count($uploaded_files['name']) : 1;
        
        for ($i = 0; $i < $file_count; $i++) {
            $files[$i] = array(
                'name' => is_array($uploaded_files['name']) ? $uploaded_files['name'][$i] : $uploaded_files['name'],
                'type' => is_array($uploaded_files['type']) ? $uploaded_files['type'][$i] : $uploaded_files['type'],
                'tmp_name' => is_array($uploaded_files['tmp_name']) ? $uploaded_files['tmp_name'][$i] : $uploaded_files['tmp_name'],
                'error' => is_array($uploaded_files['error']) ? $uploaded_files['error'][$i] : $uploaded_files['error'],
                'size' => is_array($uploaded_files['size']) ? $uploaded_files['size'][$i] : $uploaded_files['size']
            );
        }

        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');
        require_once(ABSPATH . 'wp-admin/includes/image.php');

        foreach ($files as $index => $file) {
            // Skip if there was an upload error
            if ($file['error'] !== UPLOAD_ERR_OK) {
                $error_messages[] = "Error uploading file {$file['name']}: " . $this->get_upload_error_message($file['error']);
                continue;
            }

            // Prepare file for upload
            $_FILES['document_file'] = $file;

            // Handle the file upload
            $file_id = media_handle_upload('document_file', 0);

            if (is_wp_error($file_id)) {
                $error_messages[] = "Error processing file {$file['name']}: " . $file_id->get_error_message();
                continue;
            }

            // Create document title with index if multiple files
            $title = $file_count > 1 ? $base_title . ' ' . ($index + 1) : $base_title;

            // Create document post
            $document_post = array(
                'post_title'    => $title,
                'post_content'  => $description,
                'post_status'   => 'publish',
                'post_type'     => 'document',
                'post_author'   => get_current_user_id()
            );

            $post_id = wp_insert_post($document_post);

            if (is_wp_error($post_id)) {
                // Clean up the uploaded file if post creation fails
                wp_delete_attachment($file_id, true);
                $error_messages[] = "Error creating document post for {$file['name']}: " . $post_id->get_error_message();
                continue;
            }

            // Add file metadata
            $file_url = wp_get_attachment_url($file_id);
            $file_type = wp_check_filetype(basename($file_url))['ext'];
            
            update_post_meta($post_id, '_document_file_url', $file_url);
            update_post_meta($post_id, '_document_file_type', $file_type);
            update_post_meta($post_id, '_document_file_id', $file_id);

            // Add custom metadata
            foreach ($metadata as $meta_key => $value) {
                update_post_meta($post_id, $meta_key, $value);
            }

            $success_count++;
            $uploaded_documents[] = array(
                'title' => $title,
                'id' => $post_id
            );
        }

        // Prepare response
        if ($success_count === 0) {
            wp_send_json_error(array(
                'message' => 'No documents were uploaded successfully.',
                'errors' => $error_messages
            ));
            return;
        }

        wp_send_json_success(array(
            'message' => sprintf(
                '%d document%s uploaded successfully%s', 
                $success_count,
                $success_count > 1 ? 's were' : ' was',
                !empty($error_messages) ? ' with some errors' : ''
            ),
            'uploaded_documents' => $uploaded_documents,
            'errors' => $error_messages,
            'redirect' => admin_url('admin.php?page=document-manager')
        ));
    }

    /**
     * Get upload error message
     */
    private function get_upload_error_message($error_code) {
        switch ($error_code) {
            case UPLOAD_ERR_INI_SIZE:
                return 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
            case UPLOAD_ERR_FORM_SIZE:
                return 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
            case UPLOAD_ERR_PARTIAL:
                return 'The uploaded file was only partially uploaded';
            case UPLOAD_ERR_NO_FILE:
                return 'No file was uploaded';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Missing a temporary folder';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Failed to write file to disk';
            case UPLOAD_ERR_EXTENSION:
                return 'A PHP extension stopped the file upload';
            default:
                return 'Unknown upload error';
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
                            </td>
                        </tr>
                        <tr>
                            <th><label for="column_type">Field Type</label></th>
                            <td>
                                <select id="column_type" name="column_type" required>
                                    <option value="text">Text</option>
                                    <option value="date">Date</option>
                                    <option value="number">Number</option>
                                    <option value="select">Dropdown</option>
                                </select>
                            </td>
                        </tr>
                        <tr class="select-options-row" style="display: none;">
                            <th><label for="select_options">Options</label></th>
                            <td>
                                <textarea id="select_options" name="select_options" 
                                    placeholder="Enter options, one per line"></textarea>
                                <p class="description">Enter one option per line</p>
                            </td>
                        </tr>
                    </table>
                    <button type="submit" class="button button-primary">Add Column</button>
                </form>
            </div>

            <div class="existing-columns-section">
                <h2>Existing Columns</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Column Label</th>
                            <th>Field Type</th>
                            <th>Meta Key</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($custom_columns as $meta_key => $column): ?>
                        <tr>
                            <td><?php echo esc_html($column['label']); ?></td>
                            <td><?php echo esc_html($column['type']); ?></td>
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
        $type = isset($_POST['column_type']) ? sanitize_text_field($_POST['column_type']) : '';
        $options = isset($_POST['select_options']) ? array_map('trim', array_filter(explode("\n", sanitize_textarea_field($_POST['select_options'])))) : array();

        if (empty($label)) {
            wp_send_json_error('Column label is required.');
            return;
        }

        if (empty($type) || !in_array($type, array('text', 'number', 'select', 'date'))) {
            wp_send_json_error('Invalid column type.');
            return;
        }

        if ($type === 'select' && empty($options)) {
            wp_send_json_error('Options are required for select type columns.');
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

        // Add new column
        $custom_columns[$meta_key] = array(
            'label' => $label,
            'type' => $type,
            'options' => $options
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
     * Delete column via AJAX
     */
    public function delete_column() {
        // Verify nonce
        if (!check_ajax_referer('document_upload_nonce', 'security', false)) {
            wp_send_json_error(array(
                'message' => 'Invalid security token.'
            ), 403);
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array(
                'message' => 'You do not have permission to delete columns.'
            ), 403);
            return;
        }

        // Validate and sanitize input
        $meta_key = isset($_POST['meta_key']) ? sanitize_text_field($_POST['meta_key']) : '';

        if (empty($meta_key)) {
            wp_send_json_error(array(
                'message' => 'Column meta key is required.'
            ), 400);
            return;
        }

        // Get custom columns
        $custom_columns = get_option('document_custom_columns', array());

        // Check if column exists
        if (!isset($custom_columns[$meta_key])) {
            wp_send_json_error(array(
                'message' => 'Column not found.'
            ), 404);
            return;
        }

        // Remove column from custom columns
        unset($custom_columns[$meta_key]);

        // Update custom columns option
        if (update_option('document_custom_columns', $custom_columns)) {
            wp_send_json_success(array(
                'message' => 'Column deleted successfully'
            ));
        } else {
            wp_send_json_error(array(
                'message' => 'Failed to delete column.'
            ));
        }
    }

    /**
     * Save document metadata via AJAX
     */
    public function save_document_metadata() {
        // Verify nonce
        if (!check_ajax_referer('document_upload_nonce', 'security', false)) {
            wp_send_json_error('Invalid security token.', 403);
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to edit document metadata.', 403);
            return;
        }

        // Get and validate document ID
        $document_id = isset($_POST['document_id']) ? intval($_POST['document_id']) : 0;
        if (!$document_id || get_post_type($document_id) !== 'document') {
            wp_send_json_error('Invalid document ID.');
            return;
        }

        // Update post data
        $post_data = array(
            'ID' => $document_id,
            'post_title' => sanitize_text_field($_POST['document_title']),
            'post_excerpt' => sanitize_textarea_field($_POST['document_description'])
        );

        // Only update slug if provided
        if (!empty($_POST['document_slug'])) {
            $post_data['post_name'] = sanitize_title($_POST['document_slug']);
        }

        // Update the post
        $result = wp_update_post($post_data, true);
        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
            return;
        }

        // Get custom columns
        $custom_columns = get_option('document_custom_columns', array());
        
        // Update each meta field
        foreach ($custom_columns as $meta_key => $column) {
            if (isset($_POST[$meta_key])) {
                $value = $_POST[$meta_key];
                
                // Sanitize based on field type
                switch ($column['type']) {
                    case 'number':
                        $value = floatval($value);
                        break;
                    case 'date':
                        $value = sanitize_text_field($value);
                        break;
                    case 'select':
                        if (!in_array($value, $column['options'])) {
                            $value = ''; // Invalid option
                        }
                        break;
                    default:
                        $value = sanitize_text_field($value);
                }
                
                update_post_meta($document_id, $meta_key, $value);
            }
        }

        wp_send_json_success(array(
            'message' => 'Document updated successfully.'
        ));
    }

    /**
     * Delete document via AJAX
     */
    public function delete_document() {
        // Verify nonce
        if (!check_ajax_referer('document_upload_nonce', 'security', false)) {
            wp_send_json_error('Invalid security token.', 403);
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to delete documents.', 403);
            return;
        }

        // Get and validate document ID
        $document_id = isset($_POST['document_id']) ? intval($_POST['document_id']) : 0;
        if (!$document_id || get_post_type($document_id) !== 'document') {
            wp_send_json_error('Invalid document ID.');
            return;
        }

        // Get associated file ID
        $file_id = get_post_meta($document_id, '_document_file_id', true);

        // Delete the document post
        $result = wp_delete_post($document_id, true);
        if (!$result) {
            wp_send_json_error('Failed to delete document.');
            return;
        }

        // Delete the associated file
        if ($file_id) {
            wp_delete_attachment($file_id, true);
        }

        wp_send_json_success(array(
            'message' => 'Document deleted successfully.'
        ));
    }

    /**
     * Save bulk edit changes via AJAX
     */
    public function save_bulk_edit() {
        // Verify nonce
        if (!check_ajax_referer('document_upload_nonce', 'security', false)) {
            wp_send_json_error('Invalid security token.', 403);
            return;
        }

        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error('You do not have permission to edit documents.', 403);
            return;
        }

        // Get and decode changes
        $raw_changes = isset($_POST['changes']) ? stripslashes($_POST['changes']) : '';
        $changes = json_decode($raw_changes, true);
        
        if (empty($changes) || !is_array($changes)) {
            wp_send_json_error(array(
                'message' => 'No valid changes to save.',
                'debug' => array(
                    'raw' => $raw_changes,
                    'decoded' => $changes
                )
            ));
            return;
        }

        $custom_columns = get_option('document_custom_columns', array());
        $success_count = 0;
        $error_messages = array();

        foreach ($changes as $document_id => $fields) {
            $document_id = intval($document_id);
            if (!$document_id || get_post_type($document_id) !== 'document') {
                $error_messages[] = "Invalid document ID: {$document_id}";
                continue;
            }

            $post_data = array('ID' => $document_id);
            $meta_updates = array();

            foreach ($fields as $field => $value) {
                if ($field === 'title') {
                    $post_data['post_title'] = sanitize_text_field($value);
                } elseif ($field === 'description') {
                    $post_data['post_excerpt'] = sanitize_textarea_field($value);
                } elseif (isset($custom_columns[$field])) {
                    // Sanitize based on field type
                    switch ($custom_columns[$field]['type']) {
                        case 'number':
                            $value = floatval($value);
                            break;
                        case 'date':
                            $value = sanitize_text_field($value);
                            break;
                        case 'select':
                            if (!in_array($value, $custom_columns[$field]['options'])) {
                                $value = ''; // Invalid option
                            }
                            break;
                        default:
                            $value = sanitize_text_field($value);
                    }
                    $meta_updates[$field] = $value;
                }
            }

            // Update post if there are changes to core fields
            if (count($post_data) > 1) {
                $result = wp_update_post($post_data, true);
                if (is_wp_error($result)) {
                    $error_messages[] = "Error updating document {$document_id}: " . $result->get_error_message();
                    continue;
                }
            }

            // Update meta fields
            foreach ($meta_updates as $meta_key => $value) {
                update_post_meta($document_id, $meta_key, $value);
            }

            $success_count++;
        }

        if ($success_count === 0) {
            wp_send_json_error(array(
                'message' => 'Failed to save changes.',
                'errors' => $error_messages
            ));
            return;
        }

        wp_send_json_success(array(
            'message' => sprintf(
                'Successfully updated %d document%s%s',
                $success_count,
                $success_count !== 1 ? 's' : '',
                !empty($error_messages) ? ' with some errors' : ''
            ),
            'errors' => $error_messages
        ));
    }
} 