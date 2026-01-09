import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { Page } from '@playwright/test';

test.describe( 'NotificationBanner', () => {
	// =====================
	// Constants
	// =====================

	const BANNER_COLORS = [
		{ name: 'Warning', cssVar: '--dswp-icons-color-warning' },
		{ name: 'Danger', cssVar: '--dswp-icons-color-danger' },
		{ name: 'Success', cssVar: '--dswp-icons-color-success' },
		{ name: 'Info', cssVar: '--dswp-icons-color-info' },
	];

	const SELECTORS = {
		banner: '#dswp-notification-banner',
		previewSection: '#dswp-banner-preview',
		enableRadio: { role: 'radio' as const, name: 'Enable' },
		disableRadio: { role: 'radio' as const, name: 'Disable' },
		contentTextarea: { role: 'textbox' as const },
		saveButton: { role: 'button' as const, name: 'Save Settings' },
	};

	const MESSAGES = {
		testMessage: 'Test Notification Message',
		customMessage: 'This is a custom notification',
		disabledPreview: 'This is a disabled banner preview',
		htmlContent: '<span><b>Test</b></span> message with <em>emphasis</em>',
	};

	// =====================
	// Helper Functions
	// =====================

	async function saveSettingsAndWait( page: Page ) {
		await page
			.getByRole( SELECTORS.saveButton.role, {
				name: SELECTORS.saveButton.name,
			} )
			.click();
		await page.locator( '.notice-success, .updated.notice' ).first();
	}

	async function enableBanner( page: Page ) {
		await page
			.getByRole( SELECTORS.enableRadio.role, {
				name: SELECTORS.enableRadio.name,
			} )
			.check();
	}

	async function disableBanner( page: Page ) {
		await page
			.getByRole( SELECTORS.disableRadio.role, {
				name: SELECTORS.disableRadio.name,
			} )
			.check();
	}

	async function selectColor( page: Page, colorName: string ) {
		await page.getByRole( 'radio', { name: colorName } ).check();
	}

	async function fillContent( page: Page, content: string ) {
		await page.getByRole( SELECTORS.contentTextarea.role ).fill( content );
	}

	async function visitFrontend( page: Page ) {
		const frontend = await page.context().newPage();
		await frontend.goto( '/' );
		return frontend;
	}

	async function assertBannerVisible( frontend: any ) {
		const banner = frontend.locator( SELECTORS.banner );
		await expect( banner ).toBeVisible();
		return banner;
	}

	async function assertBannerNotRendered( frontend: any ) {
		const banner = frontend.locator( SELECTORS.banner );
		await expect( banner ).toHaveCount( 0 );
	}

	function getBackgroundColorRegex( cssVar: string ): RegExp {
		return new RegExp( `background-color:\\s*var\\(${ cssVar }\\)` );
	}

	// =====================
	// Tests
	// =====================

	test.beforeEach( async ( { admin } ) => {
		// Navigate to the notification banner settings page
		await admin.visitAdminPage( 'admin.php?page=dswp-notification-menu' );
	} );

	test.describe( 'Visibility', () => {
		test( 'Banner should not display when disabled', async ( { page } ) => {
			await disableBanner( page );
			await saveSettingsAndWait( page );

			const frontend = await visitFrontend( page );
			await assertBannerNotRendered( frontend );
			await frontend.close();
		} );

		test( 'Banner should not render if it has empty content', async ( {
			page,
		} ) => {
			await enableBanner( page );
			await fillContent( page, '' );
			await saveSettingsAndWait( page );

			const frontend = await visitFrontend( page );
			const banner = frontend.locator( '#dswp-notification-banner' );
			await expect( banner ).toHaveCount( 0, { timeout: 10000 } );
			await frontend.close();
		} );

		test( 'Banner should display with message and default color', async ( {
			page,
		} ) => {
			await enableBanner( page );
			await selectColor( page, 'Warning' );
			await fillContent( page, MESSAGES.testMessage );
			await saveSettingsAndWait( page );

			const frontend = await visitFrontend( page );
			await expect(
				frontend.locator( `text=${ MESSAGES.testMessage }` )
			).toBeVisible();
			const banner = await assertBannerVisible( frontend );
			await expect( banner ).toHaveAttribute(
				'style',
				getBackgroundColorRegex( BANNER_COLORS[ 0 ].cssVar )
			);
			await frontend.close();
		} );
	} );

	test( 'Banner should display with message and each color', async ( {
		page,
	} ) => {
		for ( const color of BANNER_COLORS ) {
			await enableBanner( page );
			await selectColor( page, color.name );
			const message = `${ MESSAGES.testMessage } - ${ color.name }`;
			await fillContent( page, message );
			await saveSettingsAndWait( page );

			const frontend = await visitFrontend( page );
			await expect(
				frontend.locator( `text=${ message }` )
			).toBeVisible();
			const banner = await assertBannerVisible( frontend );
			await expect( banner ).toHaveAttribute(
				'style',
				getBackgroundColorRegex( color.cssVar )
			);
			await frontend.close();
		}
	} );

	test.describe( 'Admin Preview', () => {
		test( 'Preview should be displayed even if banner is disabled', async ( {
			page,
		} ) => {
			await disableBanner( page );
			await selectColor( page, 'Danger' );
			await fillContent( page, MESSAGES.disabledPreview );
			await saveSettingsAndWait( page );

			const preview = page.locator( '#dswp-banner-preview' );
			await expect( preview ).toBeVisible();
			const previewBanner = preview.locator(
				'div[style*="background-color"]'
			);
			await expect( previewBanner ).toBeVisible();
			await expect( previewBanner ).toContainText(
				MESSAGES.disabledPreview
			);
			await expect(
				page.locator(
					'text=/This banner is disabled and will NOT display/'
				)
			).toBeVisible();
		} );
	} );

	test.describe( 'Content', () => {
		test( 'should display banner with custom message', async ( {
			page,
		} ) => {
			await enableBanner( page );
			await fillContent( page, MESSAGES.customMessage );
			await saveSettingsAndWait( page );

			const frontend = await visitFrontend( page );
			await expect(
				frontend.locator( `text=${ MESSAGES.customMessage }` )
			).toBeVisible();
			await frontend.close();
		} );

		test( 'should render HTML content correctly in banner', async ( {
			page,
		} ) => {
			await enableBanner( page );
			await fillContent( page, MESSAGES.htmlContent );
			await saveSettingsAndWait( page );

			const frontend = await visitFrontend( page );
			const banner = await assertBannerVisible( frontend );
			await expect( banner.locator( 'b' ) ).toContainText( 'Test' );
			await expect( banner.locator( 'em' ) ).toContainText( 'emphasis' );
			await expect( banner ).toContainText( 'Test' );
			await expect( banner ).toContainText( 'message with' );
			await frontend.close();
		} );
	} );
} );
