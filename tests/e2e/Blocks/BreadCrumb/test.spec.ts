import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { Page } from '@playwright/test';
import { closeChoosePatternModal } from '../../helpers';

test.describe( 'BreadCrumb', () => {
	const BLOCK_NAME = 'design-system-wordpress-plugin/breadcrumb';
	const BLOCK_LABEL = 'Block: Breadcrumb';

	test( 'should not display when no parent page is set', async ( {
		admin,
		editor,
	} ) => {
		await admin.createNewPost( {
			postType: 'page',
			title: 'Test page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await editor.insertBlock( { name: BLOCK_NAME } );
		await expect( editor.canvas.getByLabel( BLOCK_LABEL ) ).toBeVisible();
		const preview = await editor.openPreviewPage();

		await expect(
			preview.locator( '#main-content' ).getByText( 'Test page' )
		).toHaveCount( 0 );
	} );

	test( 'should display parent page', async ( { admin, editor } ) => {
		await admin.createNewPost( {
			postType: 'page',
			title: 'Parent page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await editor.publishPost();

		await admin.createNewPost( {
			postType: 'page',
			title: 'Child page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await setParentPage( editor.page, 'Parent page' );
		await editor.insertBlock( { name: BLOCK_NAME } );
		let preview = await editor.openPreviewPage();

		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Parent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Child page', exact: true } )
		).toHaveCount( 0 );
		await preview.close();

		await editor.canvas.getByText( 'Grandparent / Parent / Child' ).click();
		await editor.page.getByRole( 'tab', { name: 'Block' } ).click();
		await editor.page
			.getByRole( 'tabpanel', { name: 'Settings' } )
			.getByLabel( '', { exact: true } )
			.check();
		preview = await editor.openPreviewPage();

		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Parent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Child page', exact: true } )
		).toHaveCount( 1 );
	} );

	test( 'should display all ancestors', async ( { admin, editor } ) => {
		await admin.createNewPost( {
			postType: 'page',
			title: 'Grandparent page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await editor.publishPost();

		await admin.createNewPost( {
			postType: 'page',
			title: 'Parent page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await setParentPage( editor.page, 'Grandparent page' );
		await editor.publishPost();

		await admin.createNewPost( {
			postType: 'page',
			title: 'Child page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await setParentPage( editor.page, 'Parent page' );
		await editor.insertBlock( { name: BLOCK_NAME } );
		let preview = await editor.openPreviewPage();

		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Grandparent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Parent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Child page', exact: true } )
		).toHaveCount( 0 );
		await preview.close();

		await editor.canvas.getByText( 'Grandparent / Parent / Child' ).click();
		await editor.page.getByRole( 'tab', { name: 'Block' } ).click();
		await editor.page
			.getByRole( 'tabpanel', { name: 'Settings' } )
			.getByLabel( '', { exact: true } )
			.check();
		preview = await editor.openPreviewPage();

		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Grandparent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Parent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			preview
				.locator( '#main-content' )
				.getByRole( 'link', { name: 'Child page', exact: true } )
		).toHaveCount( 1 );
	} );

	/**
	 * Clean up ancestor pages created during tests.
	 */
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPages();
	} );

	/**
	 * Set the parent page of the given Page.
	 * @param page
	 * @param pageTitle
	 */
	async function setParentPage(
		page: Page,
		pageTitle: string
	): Promise< void > {
		await page
			.getByRole( 'button', { name: 'Change parent: None' } )
			.click();
		await page
			.getByRole( 'combobox', { name: 'Parent' } )
			.fill( pageTitle );
		await page.getByText( pageTitle, { exact: true } ).first().click();
	}
} );
