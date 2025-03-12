import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save({
		className: 'wp-block-design-system-wordpress-plugin-in-page-navigation'
	});

	return (
		<div {...blockProps}>
			<h6 className='in-page-nav-title'>On this page</h6>
			<ul></ul>
		</div>
	);
}
