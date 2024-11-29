import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const blockProps = useBlockProps.save({
        className: `wp-block-navigation-is-${attributes.overlayMenu}-overlay`,
    });
    
    const innerBlocksProps = useInnerBlocksProps.save({
        className: 'wp-block-navigation__container',
    });

    return (
        <nav {...blockProps}>
            <div {...innerBlocksProps} />
        </nav>
    );
}