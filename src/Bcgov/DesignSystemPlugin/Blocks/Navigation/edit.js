import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    const addItem = () => {
        const newItem = { label: `Item ${attributes.items.length + 1}`, link: '#' };
        setAttributes({ items: [...attributes.items, newItem] });
    };

    return (
        <div {...blockProps}>
            <h3>{__('Custom Navigation', 'design-system-wordpress-plugin')}</h3>
            <ul>
                {attributes.items.map((item, index) => (
                    <li key={index}>
                        {item.label} - {item.link}
                    </li>
                ))}
            </ul>
            <Button onClick={addItem} isPrimary>
                {__('Add Item', 'design-system-wordpress-plugin')}
            </Button>
        </div>
    );
}
