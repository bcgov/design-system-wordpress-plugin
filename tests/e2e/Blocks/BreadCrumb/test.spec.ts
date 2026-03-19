import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { Page } from '@playwright/test';
import { closeChoosePatternModal } from '../../helpers';

test.describe( 'Breadcrumb Block', () => {
	const BLOCK_NAME = 'design-system-wordpress-plugin/breadcrumb';

	/**
	 * Set the parent page of the current page in the editor.
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

	test( 'complete breadcrumb workflow - parent only and full hierarchy on frontend', async ( {
		admin,
		editor,
		page,
		requestUtils,
	} ) => {
		const mainContent = page.locator( '#main-content' );

		// --- 1. Parent + Child: breadcrumb shows Parent (link) and Child (current page as text) ---
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
		const childPageId = await editor.publishPost();
		expect( childPageId ).toBeTruthy();

		await page.goto( `/?page_id=${ childPageId }` );
		await page.waitForLoadState( 'networkidle' );

		// Breadcrumb shows Parent (link) and current page (Child) in the trail
		const breadcrumb = mainContent.locator(
			'.wp-block-design-system-wordpress-plugin-breadcrumb'
		);
		await expect(
			breadcrumb.getByRole( 'link', { name: 'Parent page', exact: true } )
		).toHaveCount( 1 );
		await expect(
			breadcrumb.getByText( 'Child page', { exact: true } )
		).toBeVisible();

		// --- 2. Grandparent → Middle → Leaf: full hierarchy ---
		await admin.createNewPost( {
			postType: 'page',
			title: 'Grandparent page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await editor.publishPost();

		await admin.createNewPost( {
			postType: 'page',
			title: 'Middle page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await setParentPage( editor.page, 'Grandparent page' );
		await editor.publishPost();

		await admin.createNewPost( {
			postType: 'page',
			title: 'Leaf page',
			showWelcomeGuide: false,
		} );
		await closeChoosePatternModal( editor );
		await setParentPage( editor.page, 'Middle page' );
		await editor.insertBlock( { name: BLOCK_NAME } );
		const leafPageId = await editor.publishPost();
		expect( leafPageId ).toBeTruthy();

		await page.goto( `/?page_id=${ leafPageId }` );
		await page.waitForLoadState( 'networkidle' );

		// Breadcrumb: Home > Grandparent > Middle > Leaf (ancestors as links, current page in trail)
		const breadcrumbHierarchy = mainContent.locator(
			'.wp-block-design-system-wordpress-plugin-breadcrumb'
		);
		await expect(
			breadcrumbHierarchy.getByRole( 'link', {
				name: 'Grandparent page',
				exact: true,
			} )
		).toHaveCount( 1 );
		await expect(
			breadcrumbHierarchy.getByRole( 'link', {
				name: 'Middle page',
				exact: true,
			} )
		).toHaveCount( 1 );
		await expect(
			breadcrumbHierarchy.getByText( 'Leaf page', { exact: true } )
		).toBeVisible();

		// Cleanup
		await requestUtils.deleteAllPages();
	} );

	test( 'typography settings are applied to frontend', async ( {
		admin,
		editor,
	} ) => {
		await admin.createNewPost( {
			showWelcomeGuide: false,
		} );

		await editor.insertBlock( { name: BLOCK_NAME } );

		await editor.page.getByRole( 'tab', { name: 'Styles' } ).click();
		await editor.page
			.getByRole( 'radio', { name: 'Large', exact: true } )
			.click();

		const preview = await editor.openPreviewPage();

		await expect(
			preview
				.locator(
					'.wp-block-design-system-wordpress-plugin-breadcrumb'
				)
				.first()
		).toContainClass( 'has-large-font-size' );
	} );
} );
