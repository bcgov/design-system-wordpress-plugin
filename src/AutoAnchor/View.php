<?php
namespace Bcgov\DesignSystemPlugin\AutoAnchor;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use Bcgov\DesignSystemPlugin\AutoAnchor\Settings;
?>
<div class="wrap">
    <h1><?php esc_html_e( 'Auto Anchor Settings', 'dswp' ); ?></h1>
    <form method="post" action="options.php">
        <?php
        settings_fields( 'dswp_options_group' );
        $value = get_option( Settings::OPTION_NAME, '0' );
        ?>
        <table class="form-table">
            <tr>
                <th scope="row"><?php esc_html_e( 'Auto Anchor Headings', 'dswp' ); ?></th>
                <td>
                    <div style="display: flex; align-items: center;">
                        <label class="dswp-toggle-switch">
                            <input type="checkbox" 
                                   name="<?php echo esc_attr( Settings::OPTION_NAME ); ?>" 
                                   value="1" 
                                   <?php checked( '1', $value ); ?>>
                            <span class="dswp-toggle-slider"></span>
                        </label>
                        <span class="dswp-toggle-label">
                            <?php esc_html_e( 'Automatically generate anchor IDs for headings', 'dswp' ); ?>
                        </span>
                    </div>
                    <p class="description">
                        <?php esc_html_e( 'When enabled, this will automatically generate anchor IDs for heading blocks based on their content.', 'dswp' ); ?>
                    </p>
                </td>
            </tr>
        </table>
        <?php submit_button(); ?>
    </form>
</div>