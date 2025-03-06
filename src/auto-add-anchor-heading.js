import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { createElement, useEffect } from '@wordpress/element';

// Function to create a valid HTML anchor from text
const createAnchorFromText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};


// Higher-order component to handle the anchor updates
const withAutoAnchor = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { name, attributes, setAttributes } = props;

        useEffect(() => {
            if (name === 'core/heading' && attributes.content) {
                const newAnchor = createAnchorFromText(attributes.content);
                if (newAnchor !== attributes.anchor) {
                    setAttributes({ anchor: newAnchor });
                }
            }
        }, [attributes.content]); // This will run whenever content changes

        // Return the original block edit component
        return createElement(BlockEdit, props);
    };
}, 'withAutoAnchor');

// Add the filter for the editor
addFilter(
    'editor.BlockEdit',
    'bcgov/auto-anchor',
    withAutoAnchor
);
