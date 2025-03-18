import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps();
	
	// Separate the data fetching logic
	const parentPost = useSelect(select => {
		try {
			if (!select || !select('core/editor')) {
				return null;
			}

			const postId = select('core/editor').getCurrentPostId();
			const postType = select('core/editor').getCurrentPostType();
			
			if (!postId || !postType) {
				return null;
			}

			const post = select(coreStore).getEntityRecord('postType', postType, postId);
			
			if (!post?.parent) {
				return null;
			}

			return select(coreStore).getEntityRecord('postType', postType, post.parent);
		} catch (error) {
			console.error('Error fetching parent post:', error);
			return null;
		}
	}, []);

	// Update attributes in a separate effect
	useEffect(() => {
		if (parentPost) {
			setAttributes({
				parentTitle: parentPost.title?.rendered || '',
				parentUrl: parentPost.link || ''
			});
		}
	}, [parentPost, setAttributes]);

	return (
		<div {...blockProps}>
			test
		</div>
	);
}
