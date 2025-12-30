import { Editor } from '@wordpress/e2e-test-utils-playwright';

/**
 * Close the "choose a pattern" modal.
 * This modal appears when creating a new page and it must
 * be closed before we can interact with the editor.
 *
 * @todo Set the "enablePatternModal" preference instead of closing it manually.
 * @param editor
 */
export async function closeChoosePatternModal( editor: Editor ) {
	const choosePatternModal =
		await editor.page.getByLabel( 'Choose a pattern' );
	const choosePatternModalIsVisible = await choosePatternModal.isVisible();
	if ( choosePatternModalIsVisible ) {
		await choosePatternModal
			.getByRole( 'button', { name: 'Close' } )
			.click();
	}
}
