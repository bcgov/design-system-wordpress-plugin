import { useBlockProps } from '@wordpress/block-editor';
export default function save() {
    const currentYear = new Date().getFullYear().toString();

    return (
        <p { ...useBlockProps.save() }>©shawn turple { currentYear }</p>
    );
}