import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();
	
	return (
		<nav {...blockProps}>
			<ul className="wp-block-design-system-wordpress-plugin-in-page-navigation-list"></ul>
		</nav>
	);
}
