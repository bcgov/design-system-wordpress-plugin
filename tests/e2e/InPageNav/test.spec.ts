import { test, expect, Editor } from '@wordpress/e2e-test-utils-playwright';
import { Page } from '@playwright/test';

// TODO: Future tests: mobile functionality.

test.describe('InPageNav', () => {
    test.describe('Visibility', () => {
        test('should not appear when enabled without h2s', async ({ admin, editor }) => {
            await admin.createNewPost({
                showWelcomeGuide: false
            });
            await editor.setContent(`
                <!-- wp:heading {"level":3} -->
                <h3 class="wp-block-heading">Heading</h3>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await getPreviewPage(editor);
            await expect(preview.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
        });

        test('should not appear on a non-page post type', async ({ admin, editor }) => {
            await admin.createNewPost({
                showWelcomeGuide: false
            });
            await editor.setContent(`
                <!-- wp:heading -->
                <h2 class="wp-block-heading">Heading</h2>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await getPreviewPage(editor);
            await expect(preview.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
        });

        test('should not appear when option is not enabled', async ({ admin, editor }) => {
            await admin.createNewPost({
                showWelcomeGuide: false
            });
            await editor.setContent(`
                <!-- wp:heading -->
                <h2 class="wp-block-heading">Heading</h2>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await editor.openPreviewPage();
            await expect(preview.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
        });
    });

    test.describe('Functionality', () => {
        test.beforeEach(async ({ admin }) => {
            // Create a new post before each test
            await admin.createNewPost({
                postType: 'page',
                title: 'Test page',
                // This doesn't seem to work.
                excerpt: 'This is a test excerpt.',
                showWelcomeGuide: false
            });
        });

        /**
         * TODO: Test that excerpt appears in InPageNav. The test environment currently doesn't seem to let excerpts be set.
         */
        test('should create links for h2s and scroll to them when clicked, keyboard', async ({ editor }) => {
            await editor.setContent(`
                <!-- wp:heading -->
                <h2 class="wp-block-heading">Heading 1</h2>
                <!-- /wp:heading -->

                <!-- wp:heading -->
                <h2 class="wp-block-heading">Heading 2</h2>
                <!-- /wp:heading -->

                <!-- wp:heading {"level":1} -->
                <h1 class="wp-block-heading">H1</h1>
                <!-- /wp:heading -->

                <!-- wp:heading {"level":3} -->
                <h3 class="wp-block-heading">H3</h3>
                <!-- /wp:heading -->

                <!-- wp:heading {"level":4} -->
                <h4 class="wp-block-heading">H4</h4>
                <!-- /wp:heading -->

                <!-- wp:heading {"level":5} -->
                <h5 class="wp-block-heading">H5</h5>
                <!-- /wp:heading -->

                <!-- wp:heading {"level":6} -->
                <h6 class="wp-block-heading">H6</h6>
                <!-- /wp:heading -->

                <!-- wp:heading -->
                <h2 class="wp-block-heading">Heading 3</h2>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await getPreviewPage(editor);

            // Link visibility.
            await expect(preview.getByRole('navigation', { name: 'On this page' })).toHaveCount(1);
            await expect(preview.getByRole('link', { name: 'Heading 1' })).toBeVisible();
            await expect(preview.getByRole('link', { name: 'Heading 2' })).toBeVisible();
            await expect(preview.getByRole('link', { name: 'Heading 3' })).toBeVisible();

            // Click navigation.
            await preview.getByRole('link', { name: 'Heading 1' }).click();
            await expect(preview.url()).toContain('#section-heading-1-0');

            await preview.getByRole('link', { name: 'Heading 2' }).click();
            await expect(preview.url()).toContain('#section-heading-2-1');

            await preview.getByRole('link', { name: 'Heading 3' }).click();
            await expect(preview.url()).toContain('#section-heading-3-2');

            // Keyboard navigation.
            await preview.getByRole('heading', { name: 'On this page:' }).click();
            await preview.keyboard.press('Tab');
            await preview.keyboard.press('Enter');
            await expect(preview.url()).toContain('#section-heading-1-0');

            await preview.keyboard.press('Tab');
            await preview.keyboard.press('Enter');
            await expect(preview.url()).toContain('#section-heading-2-1');

            await preview.keyboard.press('Tab');
            await preview.keyboard.press('Enter');
            await expect(preview.url()).toContain('#section-heading-3-2');
        });

        test('should prevent duplicate ids with same heading names', async ({ editor }) => {
            await editor.setContent(`
                <!-- wp:heading -->
                <h2 class="wp-block-heading">Duplicate Heading</h2>
                <!-- /wp:heading -->

                <!-- wp:heading -->
                <h2 class="wp-block-heading">Duplicate Heading</h2>
                <!-- /wp:heading -->

                <!-- wp:heading -->
                <h2 class="wp-block-heading">Duplicate Heading</h2>
                <!-- /wp:heading -->

                <!-- wp:heading -->
                <h2 class="wp-block-heading">Duplicate Heading</h2>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await getPreviewPage(editor);

            await expect(preview.locator('#section-duplicate-heading-0')).toHaveCount(1);
            await expect(preview.locator('#section-duplicate-heading-1')).toHaveCount(1);
            await expect(preview.locator('#section-duplicate-heading-2')).toHaveCount(1);
            await expect(preview.locator('#section-duplicate-heading-3')).toHaveCount(1);
        });

        test('should not overwrite existing ids', async ({ editor }) => {
            await editor.setContent(`
                <!-- wp:heading -->
                <h2 class="wp-block-heading">Heading 1</h2>
                <!-- /wp:heading -->

                <!-- wp:heading -->
                <h2 class="wp-block-heading" id="existing-id">Heading 2</h2>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await getPreviewPage(editor);

            await expect(preview.getByRole('heading', { name: 'Heading 1' })).toHaveId('section-heading-1-0');
            await expect(preview.getByRole('heading', { name: 'Heading 2' })).toHaveId('existing-id');
        });

        test('should replace special characters in ids', async ({ editor }) => {
            await editor.setContent(`
                <!-- wp:heading -->
                <h2 class="wp-block-heading">Québec & Māori – Intro/Overview</h2>
                <!-- /wp:heading -->
            `);
            await closeChoosePatternModal(editor);
            const preview = await getPreviewPage(editor);

            // TODO: Fix special character handling so that, for example é -> e in the id.
            await expect(preview.getByRole('heading', { name: 'Québec & Māori – Intro/' })).toHaveId('section-qu-bec-m-ori-intro-overview-0');
        });
    })

    /**
     * Close the "choose a pattern" modal.
     * This modal appears when creating a new page and it must
     * be closed before we can interact with the editor.
     * 
     * @todo Set the "enablePatternModal" preference instead of closing it manually. 
     * @param editor 
     */
    async function closeChoosePatternModal(editor: Editor) {
        const choosePatternModal = await editor.page.getByLabel('Choose a pattern');
        const choosePatternModalIsVisible = await choosePatternModal.isVisible();
        if (choosePatternModalIsVisible) {
            await choosePatternModal.getByRole('button', { name: 'Close' }).click();
        }
    };

    /**
     * Perform the necessary actions to enable the InPageNav and open the
     * preview page.
     * 
     * @param editor 
     * @returns The preview Page object.
     */
    async function getPreviewPage(editor: Editor): Promise<Page> {
        await editor.openDocumentSettingsSidebar();
        let enableCheckbox = await editor.page.getByRole('checkbox', { name: 'Enable in-page navigation' });
        const checkboxIsVisible = await enableCheckbox.isVisible();
        if (!checkboxIsVisible) {
            await editor.page.getByRole('button', { name: 'In-page Navigation' }).click();
            enableCheckbox = await editor.page.getByRole('checkbox', { name: 'Enable in-page navigation' });
        }
        await enableCheckbox.check();
        return await editor.openPreviewPage();
    }
});