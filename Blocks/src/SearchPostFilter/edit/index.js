import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import '../editor.scss'; 


export default function Edit() {
    // Get the block props which include the necessary editor attributes and classes
    const blockProps = useBlockProps();
    
    // Get post types using the WordPress data API
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
