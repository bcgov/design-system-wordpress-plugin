<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use \WP_Query;
use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

class AdminUIManager {
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
     * Add Metadata Settings submenu
     */
    public function add_metadata_settings_submenu() {
        add_submenu_page(
            'document-manager',
            'Metadata Settings',
            'Metadata Settings',
            'manage_options',
            'document-metadata',
            array($this, 'render_metadata_settings_page')
        );
    }

    /**
     * Enqueue necessary scripts and styles
     */
    public function enqueue_admin_scripts($hook) {
        $valid_pages = array('toplevel_page_document-manager', 'documents_page_document-metadata');
        if (!in_array($hook, $valid_pages)) {
            return;
        }

        // Get the correct plugin directory path and URL
        $plugin_dir = plugin_dir_path(dirname(dirname(dirname(dirname(__FILE__)))));
        $plugin_url = plugin_dir_url(dirname(dirname(dirname(dirname(__FILE__)))));
        
        // Remove the extra 'src' from the paths
        $relative_path = 'Bcgov/DesignSystemPlugin/DocumentManager/';
        
        // Construct file paths
        $style_path = $plugin_dir . $relative_path . 'style.css';
        
        // Define JavaScript modules
        $js_modules = array(
            'core' => array(
                'file' => 'js/src/core.js',
                'deps' => array('jquery')
            ),
            'table-view' => array(
                'file' => 'js/src/table-view.js',
                'deps' => array('jquery', 'document-manager-core')
            ),
            'upload' => array(
                'file' => 'js/src/upload.js',
                'deps' => array('jquery', 'document-manager-core', 'document-manager-table-view')
            ),
            'edit-document' => array(
                'file' => 'js/src/edit-document.js',
                'deps' => array('jquery', 'document-manager-core', 'document-manager-table-view')
            ),
            'bulk-edit' => array(
                'file' => 'js/src/bulk-edit.js',
                'deps' => array('jquery', 'document-manager-core', 'document-manager-table-view')
            ),
            'metadata' => array(
                'file' => 'js/src/metadata.js',
                'deps' => array('jquery', 'document-manager-core')
            )
        );
        
        // Enqueue each module
        foreach ($js_modules as $name => $module) {
            $file_path = $plugin_dir . $relative_path . $module['file'];
            $file_url = $plugin_url . $relative_path . $module['file'];
            $version = file_exists($file_path) ? filemtime($file_path) : '1.0';
            
            wp_enqueue_script(
                'document-manager-' . $name, 
                $file_url, 
                $module['deps'], 
                $version, 
                true
            );
        }
        
        // Enqueue styles
        $style_url = $plugin_url . $relative_path . 'style.css';
        $style_version = file_exists($style_path) ? filemtime($style_path) : '1.0';
        wp_enqueue_style('document-manager-styles', $style_url, array(), $style_version);
        
        // Generate nonce and store it for debugging
        $nonce_key = $this->config->get('nonce_key');
        $nonce = wp_create_nonce($nonce_key);
        
        // Add debug output
        error_log('Enqueuing scripts for document manager');
        error_log('Nonce Key: ' . $nonce_key);
        error_log('Generated Nonce: ' . $nonce);

        // Add localized script data to the core module
        wp_localize_script('document-manager-core', 'documentManager', array(
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
        
        // Pagination settings
        $per_page = 20; // Documents per page
        $current_page = isset($_GET['paged']) ? max(1, intval($_GET['paged'])) : 1;
        
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
                // First, get total count of documents for pagination
                $cache_key_count = 'document_manager_count';
                $total_documents = get_transient($cache_key_count);
                
                if (false === $total_documents) {
                    $count_query = new \WP_Query(array(
                        'post_type' => 'document',
                        'posts_per_page' => -1,
                        'fields' => 'ids', // Only get post IDs for faster count
                    ));
                    $total_documents = $count_query->found_posts;
                    
                    // Cache the count for 5 minutes
                    set_transient($cache_key_count, $total_documents, 300);
                    
                    // Free up memory
                    wp_reset_postdata();
                }
                
                // Calculate pagination
                $total_pages = ceil($total_documents / $per_page);
                
                // Check for cached documents
                $cache_key = 'document_manager_documents_page_' . $current_page;
                $documents = get_transient($cache_key);
                
                // If no cache or cache expired
                if (false === $documents) {
                    $documents = new \WP_Query(array(
                        'post_type' => 'document',
                        'posts_per_page' => $per_page,
                        'paged' => $current_page,
                    ));
                    
                    // Cache the query results for 5 minutes (300 seconds)
                    set_transient($cache_key, $documents, 300);
                    
                    // Log cache miss
                    error_log('Document Manager: Cache miss - documents query executed for page ' . $current_page);
                } else {
                    // Log cache hit
                    error_log('Document Manager: Cache hit - used cached documents for page ' . $current_page);
                }

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
                                            <a href="<?php echo esc_url($file_url); ?>" class="button button-small" target="_blank">View</a>
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
                    
                    <?php if ($total_pages > 1) : ?>
                    <div class="tablenav">
                        <div class="tablenav-pages">
                            <span class="displaying-num"><?php printf(_n('%s item', '%s items', $total_documents), number_format_i18n($total_documents)); ?></span>
                            <span class="pagination-links">
                                <?php
                                $base_url = add_query_arg('page', 'document-manager', admin_url('admin.php'));
                                
                                // First page link
                                if ($current_page > 2) {
                                    echo '<a class="first-page button" href="' . esc_url(add_query_arg('paged', 1, $base_url)) . '"><span class="screen-reader-text">First page</span><span aria-hidden="true">&laquo;</span></a>';
                                } else {
                                    echo '<span class="first-page button disabled"><span class="screen-reader-text">First page</span><span aria-hidden="true">&laquo;</span></span>';
                                }
                                
                                // Previous page link
                                if ($current_page > 1) {
                                    echo '<a class="prev-page button" href="' . esc_url(add_query_arg('paged', $current_page - 1, $base_url)) . '"><span class="screen-reader-text">Previous page</span><span aria-hidden="true">&lsaquo;</span></a>';
                                } else {
                                    echo '<span class="prev-page button disabled"><span class="screen-reader-text">Previous page</span><span aria-hidden="true">&lsaquo;</span></span>';
                                }
                                
                                echo '<span class="paging-input">' . $current_page . ' of <span class="total-pages">' . $total_pages . '</span></span>';
                                
                                // Next page link
                                if ($current_page < $total_pages) {
                                    echo '<a class="next-page button" href="' . esc_url(add_query_arg('paged', $current_page + 1, $base_url)) . '"><span class="screen-reader-text">Next page</span><span aria-hidden="true">&rsaquo;</span></a>';
                                } else {
                                    echo '<span class="next-page button disabled"><span class="screen-reader-text">Next page</span><span aria-hidden="true">&rsaquo;</span></span>';
                                }
                                
                                // Last page link
                                if ($current_page < $total_pages - 1) {
                                    echo '<a class="last-page button" href="' . esc_url(add_query_arg('paged', $total_pages, $base_url)) . '"><span class="screen-reader-text">Last page</span><span aria-hidden="true">&raquo;</span></a>';
                                } else {
                                    echo '<span class="last-page button disabled"><span class="screen-reader-text">Last page</span><span aria-hidden="true">&raquo;</span></span>';
                                }
                                ?>
                            </span>
                        </div>
                    </div>
                    <?php endif; ?>
                    
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
     * Render Metadata Settings page
     */
    public function render_metadata_settings_page() {
        $custom_metadata = get_option('document_custom_columns', array());
        ?>
        <div class="wrap">
            <h1>Document Library Metadata Settings</h1>
            
            <div class="metadata-manager-section">
                <h2>Add New Metadata Field</h2>
                <form id="add-metadata-form" method="post">
                    <table class="form-table">
                        <tr>
                            <th><label for="column_label">Field Label</label></th>
                            <td>
                                <input type="text" id="column_label" name="column_label" class="regular-text" required>
                                <p class="description">Enter a label for your new metadata field</p>
                            </td>
                        </tr>
                    </table>
                    <input type="hidden" name="column_type" value="text">
                    <button type="submit" class="button button-primary">Add Field</button>
                </form>
            </div>

            <div class="existing-metadata-section">
                <h2>Existing Metadata Fields</h2>
                <table class="wp-list-table widefat fixed striped">
                    <thead>
                        <tr>
                            <th>Field Label</th>
                            <th>Meta Key</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($custom_metadata as $meta_key => $metadata_field): ?>
                        <tr>
                            <td><?php echo esc_html($metadata_field['label']); ?></td>
                            <td><?php echo esc_html($meta_key); ?></td>
                            <td>
                                <button class="button button-small delete-metadata" 
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
} 