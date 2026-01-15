/**
 * Navigation Block Save Component
 *
 * Returns null because this is a dynamic block.
 * Inner blocks are managed via wp_navigation post type, not post content.
 * The block is rendered server-side via render.php
 *
 * @return {null} This block is dynamic and does not save content to post content.
 */
export default function save() {
	return null;
}
