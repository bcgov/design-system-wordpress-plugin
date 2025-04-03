/**
 * WordPress Block Editor Dependencies
 * 
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal Style Dependencies
 * Editor-specific styles for the search block
 */
import '../editor.scss'; 

/**
 * Search Block Edit Component
 * 
 * Renders the search block interface in the WordPress block editor.
 * This is a static preview of how the search block will appear on the frontend.
 * The form elements are intentionally disabled as they are for display purposes only.
 * 
 * @return {JSX.Element} The editor interface for the search block
 */
export default function Edit() {
    // Get the block props which include the necessary editor attributes and classes
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <div className="dswp-search__container dswp-search__container--editor">
                <div className="dswp-search__preview-overlay">
                    <form role="search" method="get" className="dswp-search__form">
                        <div className="dswp-search__input-container">
                            <input
                                type="search"
                                name="s"
                                placeholder="Search..."
                                className="dswp-search__input"
                                disabled
                                required
                            />
                            <button 
                                type="submit" 
                                className="dswp-search__button dswp-search__button--primary dswp-search__button--right"
                                disabled
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
