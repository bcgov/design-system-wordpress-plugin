/**
 * WordPress dependencies
 */
import { useEntityBlockEditor } from "@wordpress/core-data";
import {
	useInnerBlocksProps,
	InnerBlocks,
	store as blockEditorStore,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";

/**
 * Internal dependencies
 */
import { DEFAULT_BLOCK, PRIORITIZED_INSERTER_BLOCKS } from "../constants";

export default function NavigationInnerBlocks({
	clientId,
	orientation,
	templateLock,
}) {
	const {
		isImmediateParentOfSelectedBlock,
		selectedBlockHasChildren,
		isSelected,
	} = useSelect(
		(select) => {
			const { getBlockCount, hasSelectedInnerBlock, getSelectedBlockClientId } =
				select(blockEditorStore);
			const selectedBlockId = getSelectedBlockClientId();

			return {
				isImmediateParentOfSelectedBlock: hasSelectedInnerBlock(
					clientId,
					false
				),
				selectedBlockHasChildren: !!getBlockCount(selectedBlockId),

				// This prop is already available but computing it here ensures it's
				// fresh compared to isImmediateParentOfSelectedBlock.
				isSelected: selectedBlockId === clientId,
			};
		},
		[clientId]
	);

	const [blocks, onInput, onChange] = useEntityBlockEditor(
		"postType",
		"wp_navigation"
	);

	// When the block is selected itself or has a top level item selected that
	// doesn't itself have children, show the standard appender. Else show no
	// appender.
	const parentOrChildHasSelection =
		isSelected ||
		(isImmediateParentOfSelectedBlock && !selectedBlockHasChildren);


	const hasMenuItems = !!blocks?.length;

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: "dswp-block-navigation-container",
		},
		{
			value: blocks,
			onInput,
			onChange,
			prioritizedInserterBlocks: PRIORITIZED_INSERTER_BLOCKS,
			defaultBlock: DEFAULT_BLOCK,
			directInsert: true,
			orientation,
			templateLock,

			// As an exception to other blocks which feature nesting, show
			// the block appender even when a child block is selected.
			// This should be a temporary fix, to be replaced by improvements to
			// the sibling inserter.
			// See https://github.com/WordPress/gutenberg/issues/37572.
			renderAppender:
				isSelected ||
				(isImmediateParentOfSelectedBlock && !selectedBlockHasChildren) ||
				// Show the appender while dragging to allow inserting element between item and the appender.
				parentOrChildHasSelection
					? InnerBlocks.ButtonBlockAppender
					: false,
			__experimentalCaptureToolbars: true,
			__unstableDisableLayoutClassNames: true,
		}
	);

	return <div {...innerBlocksProps} />;
}
