/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import '../editor.scss'; 

/**
 * Search Post Filter Block Editor Component
 * 
 * Renders the editor interface for the Search Post Filter block.
 * This component displays a preview of how the post type filter buttons
 * will appear on the frontend, using actual post types from the site.
 * 
 * @return {JSX.Element} The editor interface for the block.
 */
export default function Edit() {
    // Get the block props which include the necessary editor attributes and classes
    const blockProps = useBlockProps();
    
    /**
     * Fetch available post types from WordPress core data
     * 
     * Uses the WordPress data API to get all registered post types
     * and filters them to only include viewable ones.
     */
    const postTypes = useSelect((select) => {
        const types = select('core').getPostTypes();
        return types?.filter(type => type.viewable) || [];
    }, []);

    return (
        <div {...blockProps}>
            <div className="dswp-search-post-filter__container dswp-search-post-filter__container--editor">
                {postTypes.map((postType) => (
                    <button 
                        key={postType.slug}
                        className="dswp-search-post-filter__button"
                        onClick={(e) => e.preventDefault()}
                        disabled
                    >
                        {postType.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
