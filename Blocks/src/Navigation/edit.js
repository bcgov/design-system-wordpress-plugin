import { getBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit(props) {
	const {
		name,
		isSelected,
		attributes,
		setAttributes,
		insertBlocksAfter,
		onReplace,
		onRemove,
		mergeBlocks,
		clientId,
		isSelectionEnabled,
		toggleSelection,
		__unstableLayoutClassNames,
		__unstableParentLayout,
		context,
	} = props;

	const coreNavigationBlockSettings = getBlockType("core/navigation");


	return (
		<div className="custom-navigation-edit" {...useBlockProps()}>
			{/* Use the core navigation block's edit function */}
			{coreNavigationBlockSettings?.edit && (
				<coreNavigationBlockSettings.edit
					name={name}
					isSelected={isSelected}
					attributes={attributes}
					setAttributes={setAttributes}
					insertBlocksAfter={insertBlocksAfter}
					onReplace={onReplace}
					onRemove={onRemove}
					mergeBlocks={mergeBlocks}
					clientId={clientId}
					isSelectionEnabled={isSelectionEnabled}
					toggleSelection={toggleSelection}
					__unstableLayoutClassNames={__unstableLayoutClassNames}
					__unstableParentLayout={__unstableParentLayout}
					context={context}
				/>
			)}
		</div>
	);
}