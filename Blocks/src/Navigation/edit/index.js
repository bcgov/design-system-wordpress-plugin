import {
	PanelBody,
	SelectControl,
	Spinner,
	ButtonGroup,
	Button,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useMemo, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import {
	store as coreStore,
	EntityProvider,
	useEntityBlockEditor,
} from '@wordpress/core-data';
import MobileMenuIcon from './mobile-menu-icon';

const ALLOWED_BLOCKS = [
	'core/navigation-link',
	'core/navigation-submenu',
	'core/spacer',
];

/**
 * Navigation Inner Blocks Component
 * Uses EntityProvider context to get blocks from wp_navigation
 * This matches WordPress core's navigation block structure exactly
 * Must be defined outside Edit component to avoid hook ordering issues
 *
 * @param {Object}  props                     - Component properties
 * @param {boolean} props.isMenuOpen          - Whether the menu is currently open
 * @param {boolean} props.shouldShowHamburger - Whether the hamburger menu should be visible
 */
function NavigationInnerBlocks( { isMenuOpen, shouldShowHamburger } ) {
	// Get blocks from EntityProvider context - no id parameter needed
	// The EntityProvider context provides the entity ID automatically
	const [ blocks, onInput, onChange ] = useEntityBlockEditor(
		'postType',
		'wp_navigation'
	);

	const containerClassName = [
		'dswp-block-navigation__container',
		shouldShowHamburger && isMenuOpen ? 'is-menu-open' : '',
		shouldShowHamburger && ! isMenuOpen ? 'is-menu-closed' : '',
	]
		.filter( Boolean )
		.join( ' ' );

	const innerBlocksProps = useInnerBlocksProps(
		{ className: containerClassName },
		{
			value: blocks,
			onInput,
			onChange,
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'horizontal',
			templateLock: false,
			__experimentalCaptureToolbars: true,
		}
	);

	return <ul { ...innerBlocksProps } />;
}

/**
 * Navigation Block Edit Component
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update block attributes
 * @return {JSX.Element} Navigation block editor interface
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		menuId, // Keep menuId for backward compatibility, but also support ref
		ref, // WordPress core uses 'ref'
		overlayMenu = 'mobile',
		mobileBreakpoint = 768,
		showInDesktop,
		showInMobile,
	} = attributes;

	// State to track if menu is open in editor
	const [ isMenuOpen, setIsMenuOpen ] = useState( false );

	// Determine if hamburger should be visible
	const shouldShowHamburger =
		overlayMenu === 'mobile' || overlayMenu === 'always';

	// Use ref if available, otherwise fall back to menuId
	const navigationMenuId = ref || menuId;

	/**
	 * WordPress dispatch hooks
	 */

	/**
	 * Block props with dynamic className and mobile breakpoint styling
	 * Memoized to prevent unnecessary re-renders
	 */
	const blockProps = useBlockProps( {
		className: `dswp-block-navigation-is-${ overlayMenu }-overlay`,
		'data-dswp-mobile-breakpoint': mobileBreakpoint,
	} );

	/**
	 * Combined selector hook for retrieving menu data
	 * Optimized to reduce re-renders by combining multiple selectors
	 */
	const { menus, hasResolvedMenus } = useSelect( ( select ) => {
		const { getEntityRecords, hasFinishedResolution } = select( coreStore );
		const query = { per_page: -1, status: [ 'publish', 'draft' ] };

		return {
			menus: getEntityRecords( 'postType', 'wp_navigation', query ),
			hasResolvedMenus: hasFinishedResolution( 'getEntityRecords', [
				'postType',
				'wp_navigation',
				query,
			] ),
		};
	}, [] );

	/**
	 * Handles menu selection changes
	 * @param {string} value - The selected menu ID
	 */
	const handleMenuSelect = ( value ) => {
		const newMenuId = parseInt( value );
		// Set both ref (WordPress core standard) and menuId (for backward compatibility)
		setAttributes( {
			ref: newMenuId || undefined,
			menuId: newMenuId || undefined,
		} );
	};

	/**
	 * Memoize menu options to avoid recalculating on every render
	 */
	const menuOptions = useMemo( () => {
		if ( ! menus?.length ) {
			return [
				{
					label: __( 'Select a menu', 'dswp' ),
					value: 0,
				},
			];
		}

		return [
			{
				label: __( 'Select a menu', 'dswp' ),
				value: 0,
			},
			...menus.map( ( menu ) => ( {
				label: menu.title.rendered || __( '(no title)', 'dswp' ),
				value: menu.id,
			} ) ),
		];
	}, [ menus ] );

	// Early return for loading state
	if ( ! hasResolvedMenus ) {
		return <Spinner />;
	}

	// If no menu is selected, show empty container
	if ( ! navigationMenuId ) {
		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Navigation Settings', 'dswp' ) }>
						<ToggleControl
							label={ __( 'Show in Desktop', 'dswp' ) }
							checked={ showInDesktop }
							onChange={ ( value ) => {
								if ( value ) {
									// Turning Desktop ON: turn Mobile OFF
									setAttributes( {
										showInDesktop: true,
										showInMobile: false,
									} );
								} else {
									// Turning Desktop OFF: turn Mobile ON
									setAttributes( {
										showInDesktop: false,
										showInMobile: true,
									} );
								}
							} }
						/>
						<ToggleControl
							label={ __( 'Show in Mobile', 'dswp' ) }
							checked={ showInMobile }
							onChange={ ( value ) => {
								if ( value ) {
									// Turning Mobile ON: turn Desktop OFF
									setAttributes( {
										showInMobile: true,
										showInDesktop: false,
									} );
								} else {
									// Turning Mobile OFF: turn Desktop ON
									setAttributes( {
										showInMobile: false,
										showInDesktop: true,
									} );
								}
							} }
						/>
						<SelectControl
							label={ __( 'Select Menu', 'dswp' ) }
							value={ 0 }
							options={ menuOptions }
							onChange={ handleMenuSelect }
						/>

						<ButtonGroup>
							<span
								className="components-base-control__label"
								style={ {
									display: 'block',
									marginBottom: '8px',
								} }
							>
								{ __( 'Overlay Menu', 'dswp' ) }
							</span>
							<Button
								variant={
									overlayMenu === 'mobile'
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									setAttributes( { overlayMenu: 'mobile' } )
								}
							>
								{ __( 'Mobile', 'dswp' ) }
							</Button>
							<Button
								variant={
									overlayMenu === 'always'
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									setAttributes( { overlayMenu: 'always' } )
								}
							>
								{ __( 'Always', 'dswp' ) }
							</Button>
							<Button
								variant={
									overlayMenu === 'never'
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									setAttributes( { overlayMenu: 'never' } )
								}
							>
								{ __( 'Never', 'dswp' ) }
							</Button>
						</ButtonGroup>

						{ ( showInDesktop ||
							showInMobile ||
							overlayMenu === 'mobile' ) && (
							<div style={ { marginTop: '1rem' } }>
								<RangeControl
									label={ __(
										'Mobile Breakpoint (px)',
										'dswp'
									) }
									value={ mobileBreakpoint }
									onChange={ ( value ) =>
										setAttributes( {
											mobileBreakpoint: value,
										} )
									}
									min={ 320 }
									max={ 1200 }
									step={ 1 }
								/>
							</div>
						) }
					</PanelBody>
				</InspectorControls>
				<nav { ...blockProps }>
					<MobileMenuIcon
						isVisible={ shouldShowHamburger }
						isOpen={ isMenuOpen }
						onClick={ () => setIsMenuOpen( ! isMenuOpen ) }
					/>
					<ul
						className={ [
							'dswp-block-navigation__container',
							shouldShowHamburger && isMenuOpen
								? 'is-menu-open'
								: '',
							shouldShowHamburger && ! isMenuOpen
								? 'is-menu-closed'
								: '',
						]
							.filter( Boolean )
							.join( ' ' ) }
					/>
				</nav>
			</>
		);
	}

	// Wrap entire block content with EntityProvider for real-time sync
	// This matches WordPress core's pattern exactly
	// All instances with the same navigationMenuId will share this context and update in real-time
	return (
		<EntityProvider
			kind="postType"
			type="wp_navigation"
			id={ navigationMenuId }
		>
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Navigation Settings', 'dswp' ) }>
						<ToggleControl
							label={ __( 'Show in Desktop', 'dswp' ) }
							checked={ showInDesktop }
							onChange={ ( value ) => {
								if ( value ) {
									// Turning Desktop ON: turn Mobile OFF
									setAttributes( {
										showInDesktop: true,
										showInMobile: false,
									} );
								} else {
									// Turning Desktop OFF: turn Mobile ON
									setAttributes( {
										showInDesktop: false,
										showInMobile: true,
									} );
								}
							} }
						/>
						<ToggleControl
							label={ __( 'Show in Mobile', 'dswp' ) }
							checked={ showInMobile }
							onChange={ ( value ) => {
								if ( value ) {
									// Turning Mobile ON: turn Desktop OFF
									setAttributes( {
										showInMobile: true,
										showInDesktop: false,
									} );
								} else {
									// Turning Mobile OFF: turn Desktop ON
									setAttributes( {
										showInMobile: false,
										showInDesktop: true,
									} );
								}
							} }
						/>
						<SelectControl
							label={ __( 'Select Menu', 'dswp' ) }
							value={ navigationMenuId || 0 }
							options={ menuOptions }
							onChange={ handleMenuSelect }
						/>

						<ButtonGroup>
							<span
								className="components-base-control__label"
								style={ {
									display: 'block',
									marginBottom: '8px',
								} }
							>
								{ __( 'Overlay Menu', 'dswp' ) }
							</span>
							<Button
								variant={
									overlayMenu === 'mobile'
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									setAttributes( { overlayMenu: 'mobile' } )
								}
							>
								{ __( 'Mobile', 'dswp' ) }
							</Button>
							<Button
								variant={
									overlayMenu === 'always'
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									setAttributes( { overlayMenu: 'always' } )
								}
							>
								{ __( 'Always', 'dswp' ) }
							</Button>
							<Button
								variant={
									overlayMenu === 'never'
										? 'primary'
										: 'secondary'
								}
								onClick={ () =>
									setAttributes( { overlayMenu: 'never' } )
								}
							>
								{ __( 'Never', 'dswp' ) }
							</Button>
						</ButtonGroup>

						{ ( showInDesktop ||
							showInMobile ||
							overlayMenu === 'mobile' ) && (
							<div style={ { marginTop: '1rem' } }>
								<RangeControl
									label={ __(
										'Mobile Breakpoint (px)',
										'dswp'
									) }
									value={ mobileBreakpoint }
									onChange={ ( value ) =>
										setAttributes( {
											mobileBreakpoint: value,
										} )
									}
									min={ 320 }
									max={ 1200 }
									step={ 1 }
								/>
							</div>
						) }
					</PanelBody>
				</InspectorControls>

				<nav { ...blockProps }>
					<MobileMenuIcon
						isVisible={ shouldShowHamburger }
						isOpen={ isMenuOpen }
						onClick={ () => setIsMenuOpen( ! isMenuOpen ) }
					/>
					<NavigationInnerBlocks
						isMenuOpen={ isMenuOpen }
						shouldShowHamburger={ shouldShowHamburger }
					/>
				</nav>
			</>
		</EntityProvider>
	);
}
