<?php

namespace Bcgov\DesignSystemPlugin\DocumentManager\Service;

use WP_Query;
use Bcgov\DesignSystemPlugin\DocumentManager\Config\DocumentManagerConfig;

/**
 * AdminUIManager Service
 *
 * This class is the central coordinator for the Document Manager's admin interface.
 * After refactoring, it follows a "facade" design pattern, delegating specialized
 * rendering tasks to focused renderer classes while maintaining a simple API.
 *
 * Architecture:
 * - AdminUIManager: Coordinates the overall UI and WordPress integration
 * - DocumentManagerScripts: Handles all JS/CSS loading
 * - DocumentFormRenderer: Renders all document-related forms
 * - MetadataSettingsRenderer: Renders the metadata settings page
 *
 * This structure provides better separation of concerns, more maintainable code,
 * and smaller, more focused classes.
 *
 * Responsibilities:
 * - Admin menu and submenu registration with WordPress
 * - Coordinating specialized renderers for different UI components
 * - Managing document listing with pagination and caching
 * - Orchestrating the overall admin page structure
 */
class AdminUIManager {
    /**
     * Configuration settings
     *
     * @var DocumentManagerConfig
     */
    private $config;

    /**
     * Document uploader service
     * Used for file upload operations
     *
     * @var DocumentUploader
     */
    private $uploader;

    /**
     * Metadata manager service
     * Used for document metadata operations
     *
     * @var DocumentMetadataManager
     */
    private $metadata_manager;

    /**
     * Scripts manager service
     * Handles all JavaScript and CSS resources
     *
     * @var DocumentManagerScripts
     */
    private $scripts;

    /**
     * Metadata settings renderer service
     * Responsible for the metadata settings admin page
     *
     * @var MetadataSettingsRenderer
     */
    private $metadata_renderer;

    /**
     * Document form renderer service
     * Handles all document-related forms and modals
     *
     * @var DocumentFormRenderer
     */
    private $form_renderer;

    /**
     * Constructor - initializes the admin UI manager with required services
     *
     * This class uses dependency injection for core services and creates specialized
     * renderer instances internally. This approach:
     *
     * 1. Makes testing easier by allowing mock services to be injected
     * 2. Keeps the external API simple while using specialized renderers internally
     * 3. Creates a clear separation between coordination and rendering responsibilities
     *
     * @param DocumentManagerConfig   $config Configuration service.
     * @param DocumentUploader        $uploader Document upload service.
     * @param DocumentMetadataManager $metadata_manager Metadata management service.
     */
    public function __construct(
        DocumentManagerConfig $config,
        DocumentUploader $uploader,
        DocumentMetadataManager $metadata_manager
    ) {
        $this->config           = $config;
        $this->uploader         = $uploader;
        $this->metadata_manager = $metadata_manager;

        // Initialize specialized renderers that this class will coordinate.
        $this->scripts           = new DocumentManagerScripts( $config );
        $this->metadata_renderer = new MetadataSettingsRenderer( $config, $metadata_manager );
        $this->form_renderer     = new DocumentFormRenderer( $config, $metadata_manager );
    }

    /**
     * Add Documents menu to WordPress admin
     *
     * Creates the main "Documents" menu item in the WordPress admin sidebar.
     * Uses WordPress's add_menu_page() function with the following parameters:
     * - Page title: What appears in the browser tab
     * - Menu title: What's shown in the admin menu
     * - Capability: Permission level required (manage_options = admin level)
     * - Menu slug: URL identifier for the page
     * - Callback: Function that renders the page content
     * - Icon: Dashicon to use for the menu
     * - Position: Where in the menu order this should appear (20 is below Posts)
     */
    public function add_documents_menu() {
        add_menu_page(
            'Document Manager',
            'Documents',
            'manage_options',
            'document-manager',
            array( $this, 'render_document_page' ),
            'dashicons-media-document',
            20
        );
    }

    /**
     * Add Metadata Settings submenu
     *
     * Creates a submenu under the Documents menu for managing metadata fields.
     * Uses WordPress's add_submenu_page() function with these parameters:
     * - Parent slug: Which menu this is a submenu of
     * - Page title: What appears in the browser tab
     * - Menu title: What's shown in the admin menu
     * - Capability: Permission level required (manage_options = admin level)
     * - Menu slug: URL identifier for the page
     * - Callback: Function that renders the page content
     */
    public function add_metadata_settings_submenu() {
        add_submenu_page(
            'document-manager',
            'Metadata Settings',
            'Metadata Settings',
            'manage_options',
            'document-metadata',
            array( $this, 'render_metadata_settings_page' )
        );
    }

    /**
     * Enqueue necessary scripts and styles
     *
     * Delegates to the DocumentManagerScripts service
     *
     * @param string $hook The current admin page hook suffix.
     */
    public function enqueue_admin_scripts( $hook ) {
        $this->scripts->enqueue_admin_scripts( $hook );
    }

    /**
     * Render the document manager page
     *
     * This method coordinates the rendering of the main document manager page,
     * delegating form rendering to specialized renderers while handling the
     * document table and pagination directly.
     *
     * Implementation note: The document table remains in this class rather than
     * being extracted to a dedicated renderer for several reasons:
     *
     * 1. The table interacts closely with caching and pagination logic
     * 2. Table data retrieval is tied to WordPress query and transient APIs
     * 3. The table structure and its bulk edit functionality form a cohesive unit
     *
     * In future refactoring, this could potentially be extracted to a
     * DocumentTableRenderer class, but would require careful coordination with
     * the pagination and caching systems.
     */
    public function render_document_page() {
        // Get custom metadata fields configured for documents.
        $custom_columns = get_option( 'document_custom_columns', array() );

        // Pagination settings.
        $per_page     = 20; // Documents per page.
        $current_page = 1; // Default to first page.

        // Verify nonce before processing any GET parameters.
        if ( isset( $_GET['paged'] ) && check_admin_referer( 'document_pagination', 'pagination_nonce', false ) ) {
            $current_page = max( 1, intval( $_GET['paged'] ) );
        }

        ?>
        <div class="wrap">
            <h1>Document Manager</h1>
            
            <?php
            // Render the upload section.
            $this->form_renderer->render_upload_section();

            // Render the upload metadata modal.
            $this->form_renderer->render_upload_metadata_modal();
            ?>

            <!-- 
            * Document Library Section
            * 
            * The document table and related functionality remain in this class
            * because they form the core of the document manager's primary function.
            * This section showcases two WordPress performance optimization techniques:
            * 
            * 1. Transients API for caching query results
            * 2. Optimized WP_Query usage for counting and retrieving documents
            *
            * These optimizations are especially important for large document libraries.
            -->
            <div class="document-library-section">
                <h2>Document Library</h2>
                <?php
                // First, get total count of documents for pagination.
                // Uses WordPress transients API for caching to improve performance.
                $cache_key_count = 'document_manager_count';
                $total_documents = get_transient( $cache_key_count );

                if ( false === $total_documents ) {
                    // Cache miss - need to query the database.
                    $count_query     = new \WP_Query(
                        array(
							'post_type'      => 'document',
							'posts_per_page' => -1,
							'fields'         => 'ids', // Only get post IDs for faster count.
                        )
                    );
                    $total_documents = $count_query->found_posts;

                    // Cache the count for 5 minutes.
                    set_transient( $cache_key_count, $total_documents, 300 );

                    // Free up memory.
                    wp_reset_postdata();
                }

                // Calculate pagination.
                $total_pages = ceil( $total_documents / $per_page );

                // Check for cached documents for the current page.
                $cache_key = 'document_manager_documents_page_' . $current_page;
                $documents = get_transient( $cache_key );

                // If no cache or cache expired.
                if ( false === $documents ) {
                    // Cache miss - perform the database query.
                    $documents = new \WP_Query(
                        array(
							'post_type'      => 'document',
							'posts_per_page' => $per_page,
							'paged'          => $current_page,
                        )
                    );

                    // Cache the query results for 5 minutes (300 seconds).
                    set_transient( $cache_key, $documents, 300 );

                    // Log cache miss.
                    do_action( 'bcgov_document_manager_log', 'Document Manager: Cache miss - documents query executed for page ' . $current_page, 'debug' );
                } else {
                    // Log cache hit.
                    do_action( 'bcgov_document_manager_log', 'Document Manager: Cache hit - used cached documents for page ' . $current_page, 'debug' );
                }

                if ( $documents->have_posts() ) :
					?>
                    <!-- 
                    * Bulk Edit Controls
                    *
                    * These buttons toggle between normal view and bulk edit mode:
                    * - "Enable Bulk Edit Mode" makes all fields editable at once
                    * - "Save Changes" button appears only in bulk edit mode
                    * - "Cancel" button reverts changes without saving
                    * 
                    * Bulk edit functionality is handled by JavaScript (bulk-edit.js).
                    -->
                    <div class="table-actions">
                        <button type="button" class="button toggle-bulk-edit">Enable Bulk Edit Mode</button>
                        <button type="button" class="button button-primary save-bulk-edit" style="display: none;">Save Changes</button>
                        <button type="button" class="button cancel-bulk-edit" style="display: none;">Cancel</button>
                    </div>
                    <form id="bulk-edit-form">
                        <!-- 
                        * Document Table
                        *
                        * Displays all documents with:
                        * - File type icon
                        * - Document title and description (editable)
                        * - File type and upload date
                        * - Custom metadata fields (editable)
                        * - Action buttons (View/Edit/Delete)
                        * 
                        * Table styling uses WordPress admin UI classes.
                        -->
                        <table class="wp-list-table widefat fixed striped">
                            <thead>
                                <tr>
                                    <th class="column-icon" style="width: 30px;"></th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>File Type</th>
                                    <th>Upload Date</th>
                                    <?php foreach ( $custom_columns as $meta_key => $column ) : ?>
                                        <th><?php echo esc_html( $column['label'] ); ?></th>
                                    <?php endforeach; ?>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                while ( $documents->have_posts() ) : $documents->the_post();
                                    $file_url  = get_post_meta( get_the_ID(), '_document_file_url', true );
                                    $file_type = get_post_meta( get_the_ID(), '_document_file_type', true );
									?>
                                    <tr data-id="<?php echo esc_attr( get_the_ID() ); ?>">
                                        <td class="column-icon">
                                            <?php
                                            // Choose appropriate icon based on file type.
                                            $icon_class = 'dashicons ';
                                            switch ( $file_type ) {
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
                                            <span class="<?php echo esc_attr( $icon_class ); ?>"></span>
                                        </td>
                                        <!-- 
                                        * Editable Fields
                                        * 
                                        * Each editable cell contains:
                                        * - View mode span: shown by default, displays the current value
                                        * - Edit mode input: hidden initially, appears in edit/bulk edit mode
                                        * - data-field attribute: identifies which field this cell represents
                                        * 
                                        * The toggle between modes is handled by JavaScript.
                                        -->
                                        <td class="editable" data-field="title">
                                            <span class="view-mode"><?php the_title(); ?></span>
                                            <input type="text" class="edit-mode" value="<?php echo esc_attr( get_the_title() ); ?>" style="display: none;">
                                        </td>
                                        <td class="editable" data-field="description">
                                            <span class="view-mode"><?php echo esc_html( get_the_excerpt() ); ?></span>
                                            <textarea class="edit-mode" style="display: none;"><?php echo esc_textarea( get_the_excerpt() ); ?></textarea>
                                        </td>
                                        <td><?php echo esc_html( $file_type ); ?></td>
                                        <td><?php echo get_the_date(); ?></td>
                                        <?php
                                        foreach ( $custom_columns as $meta_key => $column ) :
                                            $value = get_post_meta( get_the_ID(), $meta_key, true );
											?>
                                            <td class="editable" data-field="<?php echo esc_attr( $meta_key ); ?>">
                                                <span class="view-mode"><?php echo esc_html( $value ? $value : '—' ); ?></span>
                                                <?php if ( 'select' === $column['type'] ) : ?>
                                                    <select class="edit-mode" style="display: none;">
                                                        <option value="">Select <?php echo esc_html( $column['label'] ); ?></option>
                                                        <?php foreach ( $column['options'] as $option ) : ?>
                                                            <option value="<?php echo esc_attr( $option ); ?>" <?php selected( $value, $option ); ?>>
                                                                <?php echo esc_html( $option ); ?>
                                                            </option>
                                                        <?php endforeach; ?>
                                                    </select>
                                                <?php elseif ( 'date' === $column['type'] ) : ?>
                                                    <input type="date" class="edit-mode" value="<?php echo esc_attr( $value ); ?>" style="display: none;">
                                                <?php elseif ( 'number' === $column['type'] ) : ?>
                                                    <input type="number" class="edit-mode" value="<?php echo esc_attr( $value ); ?>" style="display: none;">
                                                <?php else : ?>
                                                    <input type="text" class="edit-mode" value="<?php echo esc_attr( $value ); ?>" style="display: none;">
                                                <?php endif; ?>
                                            </td>
                                        <?php endforeach; ?>
                                        <!-- 
                                        * Action Buttons
                                        * 
                                        * Each document row has three action buttons:
                                        * - View: Opens the document file in a new tab
                                        * - Edit: Opens the edit modal with all document fields
                                        * - Delete: Removes the document after confirmation
                                        * 
                                        * Button data attributes store the information needed for JS handlers.
                                        -->
                                        <td>
                                            <a href="<?php echo esc_url( $file_url ); ?>" class="button button-small" target="_blank">View</a>
                                            <button type="button" 
                                                    class="button button-small edit-metadata" 
                                                    data-id="<?php echo esc_attr( get_the_ID() ); ?>"
                                                    data-title="<?php echo esc_attr( get_the_title() ); ?>"
                                                    data-description="<?php echo esc_attr( get_the_excerpt() ); ?>"
                                                    data-slug="<?php echo esc_attr( get_post_field( 'post_name' ) ); ?>"
                                                    data-metadata="
                                                    <?php
                                                        $metadata = array();
													foreach ( $custom_columns as $meta_key => $column ) {
														$metadata[ $meta_key ] = get_post_meta( get_the_ID(), $meta_key, true );
													}
                                                        echo esc_attr( wp_json_encode( $metadata ) );
                                                    ?>
                                                    ">
                                                Edit
                                            </button>
                                            <button type="button" 
                                                    class="button button-small button-link-delete delete-document" 
                                                    data-post-id="<?php echo esc_attr( get_the_ID() ); ?>"
                                                    data-title="<?php echo esc_attr( get_the_title() ); ?>">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                <?php endwhile; ?>
                            </tbody>
                        </table>
                        <?php
                        // Security nonce for bulk edits.
                        // Uses the nonce key from configuration instead of hardcoded value.
                        wp_nonce_field( $this->config->get( 'nonce_key' ), 'bulk_edit_nonce' );
                        ?>
                    </form>
                    
                    <?php if ( $total_pages > 1 ) : ?>
                    <!-- 
                    * Pagination Controls
                    *
                    * This pagination implementation follows WordPress admin UI conventions,
                    * making it familiar to users and consistent with core WordPress interfaces.
                    * 
                    * Key features:
                    * - Implements WordPress admin-style pagination controls
                    * - Uses accessible markup with screen-reader text
                    * - Handles edge cases like first/last page disabling
                    * - Preserves URL parameters for reliable navigation
                    * 
                    * This could be extracted to a PaginationRenderer in the future,
                    * but is kept inline for direct access to pagination variables.
                    -->
                    <div class="tablenav">
                        <div class="tablenav-pages">
                            <?php
                            /* translators: %s: Number of items (documents) displayed in the document manager table. */
                            echo '<span class="displaying-num">' . esc_html( sprintf( _n( '%s item', '%s items', $total_documents, 'design-system' ), number_format_i18n( $total_documents ) ) ) . '</span>';
                            ?>
                            <span class="pagination-links">
                                <?php
                                $base_url = add_query_arg( 'page', 'document-manager', admin_url( 'admin.php' ) );

                                // First page link.
                                if ( $current_page > 2 ) {
                                    // Translators: This is a screen reader text for navigating to the first page.
                                    echo '<a class="first-page button" href="' . esc_url( add_query_arg( 'paged', 1, $base_url ) ) . '"><span class="screen-reader-text">' . esc_html__( 'First page', 'design-system' ) . '</span><span aria-hidden="true">&laquo;</span></a>';
                                } else {
                                    // Translators: This is a screen reader text for the disabled first page button.
                                    echo '<span class="first-page button disabled"><span class="screen-reader-text">' . esc_html__( 'First page', 'design-system' ) . '</span><span aria-hidden="true">&laquo;</span></span>';
                                }

                                // Previous page link.
                                if ( $current_page > 1 ) {
                                    // Translators: This is a screen reader text for navigating to the previous page.
                                    echo '<a class="prev-page button" href="' . esc_url( add_query_arg( 'paged', $current_page - 1, $base_url ) ) . '"><span class="screen-reader-text">' . esc_html__( 'Previous page', 'design-system' ) . '</span><span aria-hidden="true">&lsaquo;</span></a>';
                                } else {
                                    // Translators: This is a screen reader text for the disabled previous page button.
                                    echo '<span class="prev-page button disabled"><span class="screen-reader-text">' . esc_html__( 'Previous page', 'design-system' ) . '</span><span aria-hidden="true">&lsaquo;</span></span>';
                                }

                                echo '<span class="paging-input">' . esc_html( $current_page ) . ' of <span class="total-pages">' . esc_html( $total_pages ) . '</span></span>';

                                // Next page link.
                                if ( $current_page < $total_pages ) {
                                    // Translators: This is a screen reader text for navigating to the next page.
                                    echo '<a class="next-page button" href="' . esc_url( add_query_arg( 'paged', $current_page + 1, $base_url ) ) . '"><span class="screen-reader-text">' . esc_html__( 'Next page', 'design-system' ) . '</span><span aria-hidden="true">&rsaquo;</span></a>';
                                } else {
                                    // Translators: This is a screen reader text for the disabled next page button.
                                    echo '<span class="next-page button disabled"><span class="screen-reader-text">' . esc_html__( 'Next page', 'design-system' ) . '</span><span aria-hidden="true">&rsaquo;</span></span>';
                                }

                                // Last page link.
                                if ( $current_page < $total_pages - 1 ) {
                                    // Translators: This is a screen reader text for navigating to the last page.
                                    echo '<a class="last-page button" href="' . esc_url( add_query_arg( 'paged', $total_pages, $base_url ) ) . '"><span class="screen-reader-text">' . esc_html__( 'Last page', 'design-system' ) . '</span><span aria-hidden="true">&raquo;</span></a>';
                                } else {
                                    // Translators: This is a screen reader text for the disabled last page button.
                                    echo '<span class="last-page button disabled"><span class="screen-reader-text">' . esc_html__( 'Last page', 'design-system' ) . '</span><span aria-hidden="true">&raquo;</span></span>';
                                }
                                ?>
                            </span>
                        </div>
                    </div>
                    <?php endif; ?>
                    
                <?php else : ?>
                    <p>No documents found.</p>
					<?php
                endif;
                wp_reset_postdata();
                ?>
            </div>

            <?php
            // Render the edit document modal.
            $this->form_renderer->render_edit_modal();
            ?>
        </div>
        <?php
    }

    /**
     * Render Metadata Settings page
     *
     * This method demonstrates the delegation pattern used throughout this class.
     * Instead of implementing the UI rendering directly, it delegates to a specialized
     * renderer class (MetadataSettingsRenderer) that's focused solely on that task.
     *
     * Benefits of this delegation approach:
     * - Clear separation of responsibilities
     * - Better organization of code by function
     * - Smaller, more maintainable class files
     * - Easier unit testing of isolated components
     *
     * This pattern represents modern PHP development practices compared to the
     * original monolithic class approach.
     */
    public function render_metadata_settings_page() {
        $this->metadata_renderer->render();
    }
}
