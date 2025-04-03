<?php
/**
 * Search Block Render Template
 *
 * This template renders the frontend search block with a form that integrates with WordPress's native search functionality.
 * When submitted, the form redirects to WordPress's search results page with the search query.
 *
 * @package DesignSystemWordPressPlugin
 * @subpackage Search
 */

namespace DesignSystemWordPressPlugin\Search;
?>
<div class="wp-block-design-system-wordpress-plugin-search">
    <div class="dswp-search__container">
        <?php
        /**
         * Search Form
         * 
         * @param string role    Accessibility role attribute for screen readers
         * @param string method  GET method ensures search query appears in URL
         * @param string action  Redirects to site root where WordPress handles the search
         */
        ?>
        <form role="search" method="get" class="dswp-search__form" action="<?php echo esc_url(home_url('/')); ?>">
            <div class="dswp-search__input-container">
                <input
                    type="search"
                    name="s"
                    placeholder="Search..."
                    class="dswp-search__input"
                    value="<?php echo esc_attr(get_search_query()); ?>"
                    required
                />
                <button type="submit" class="dswp-search__button dswp-search__button--primary dswp-search__button--right">
                    Search
                </button>
            </div>
        </form>
    </div>
</div>