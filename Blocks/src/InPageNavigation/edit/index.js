import { useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps();

	// Get all blocks and filter for H2s with anchors
	const headingBlocks = useSelect(
		(select) => {
			const { getBlocks } = select(blockEditorStore);
			return getBlocks().filter(block => 
				block.name === 'core/heading' && 
				block.attributes.level === 2 && 
				block.attributes.anchor
			);
		},
		[]
	);

	return (
		<nav {...blockProps}>
			{headingBlocks.length === 0 ? (
				<p>No H2 headings with anchors found. Add anchors to H2 headings to generate navigation.</p>
			) : (
				<ul>
					{headingBlocks.map((block, index) => (
						<li key={index}>
							<a href={`#${block.attributes.anchor}`}>
								{block.attributes.content.originalHTML}
							</a>
						</li>
					))}
				</ul>
			)}
		</nav>
	);
}
