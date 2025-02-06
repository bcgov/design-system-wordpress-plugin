import {
	PanelBody,
	SelectControl,
	Spinner,
	ButtonGroup,
	Button,
	RangeControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useCallback, useMemo } from '@wordpress/element';
import { useDispatch, useSelect, useRegistry } from '@wordpress/data';
import {
	store as blockEditorStore,
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
} from '@wordpress/block-editor';
import { store as coreStore } from '@wordpress/core-data';
import { createBlock, serialize, parse } from '@wordpress/blocks';
import MobileMenuIcon from './mobile-menu-icon';

const ALLOWED_BLOCKS = [
	'core/navigation-link',
	'core/navigation-submenu',
	'core/spacer',
];

/**
 * Navigation Block Edit Component
 *
 * @param {Object}   props               - Component properties
 * @param {Object}   props.attributes    - Block attributes
 * @param {Function} props.setAttributes - Function to update block attributes
 * @param {string}   props.clientId      - Unique block identifier
 * @return {JSX.Element} Navigation block editor interface
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const { menuId, overlayMenu, mobileBreakpoint = 768 } = attributes;

	/**
	 * WordPress dispatch and registry hooks for block manipulation
	 */
	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const { editEntityRecord, saveEditedEntityRecord } =
		useDispatch( coreStore );
	const registry = useRegistry();

	/**
	 * Block props with dynamic className and mobile breakpoint styling
	 * Memoized to prevent unnecessary re-renders
	 */
	const blockProps = useBlockProps( {
		className: `dswp-block-navigation-is-${ overlayMenu }-overlay`,
		'data-dswp-mobile-breakpoint': mobileBreakpoint,
	} );

	/**
	 * Combined selector hook for retrieving menu data and block state
	 * Optimized to reduce re-renders by combining multiple selectors
	 */
	const {
		menus,
		hasResolvedMenus,
		selectedMenu,
		currentBlocks,
		isCurrentPostSaving,
	} = useSelect(
		( select ) => {
			const {
				getEntityRecords,
				hasFinishedResolution,
				getEditedEntityRecord,
			} = select( coreStore );
			const query = { per_page: -1, status: [ 'publish', 'draft' ] };

			return {
				menus: getEntityRecords( 'postType', 'wp_navigation', query ),
				hasResolvedMenus: hasFinishedResolution( 'getEntityRecords', [
					'postType',
					'wp_navigation',
					query,
				] ),
				selectedMenu: menuId
					? getEditedEntityRecord(
							'postType',
							'wp_navigation',
							menuId
					  )
					: null,
				currentBlocks: select( blockEditorStore ).getBlocks( clientId ),
				isCurrentPostSaving: select( 'core/editor' )?.isSavingPost(),
			};
		},
		[ menuId, clientId ]
	);

	/**
	 * Refs for tracking content state and initialization
	 */
	const lastSavedContent = useRef( null );
	const isInitialLoad = useRef( true );
	const initialBlocksRef = useRef( null );

	/**
	 * Processes navigation blocks to ensure correct structure and attributes
	 * Memoized to prevent unnecessary recreation on re-renders
	 *
	 * @param {Array} blocks - Array of block objects to process
	 * @return {Array} Processed blocks with correct structure
	 */
	const processBlocks = useCallback( ( blocks ) => {
		return blocks
			.map( ( block ) => {
				const commonProps = {
					...block.attributes,
					label: block.attributes.label,
					url: block.attributes.url,
					type: block.attributes.type,
					id: block.attributes.id,
					kind: block.attributes.kind,
					opensInNewTab: block.attributes.opensInNewTab || false,
				};

				if ( block.name === 'core/navigation-link' ) {
					return createBlock( 'core/navigation-link', commonProps );
				}

				if ( block.name === 'core/navigation-submenu' ) {
					return createBlock(
						'core/navigation-submenu',
						commonProps,
						block.innerBlocks
							? processBlocks( block.innerBlocks )
							: []
					);
				}

				return null;
			} )
			.filter( Boolean );
	}, [] );

	/**
	 * Effect for handling initial menu content load
	 */
	useEffect( () => {
		if ( selectedMenu?.content && isInitialLoad.current ) {
			const parsedBlocks = parse( selectedMenu.content );
			initialBlocksRef.current = serialize( parsedBlocks );
			lastSavedContent.current = initialBlocksRef.current;
			registry
				.dispatch( blockEditorStore )
				.__unstableMarkNextChangeAsNotPersistent();
		}
	}, [ selectedMenu ] );

	/**
	 * Effect for handling block content changes
	 * Marks changes as non-persistent when content matches initial state
	 */
	useEffect( () => {
		if ( ! isInitialLoad.current && currentBlocks ) {
			const serializedContent = serialize( currentBlocks );
			if ( serializedContent === initialBlocksRef.current ) {
				registry
					.dispatch( blockEditorStore )
					.__unstableMarkNextChangeAsNotPersistent();
			}
		}
	}, [ currentBlocks ] );

	/**
	 * Effect for saving menu changes
	 * Handles saving when post is being saved
	 */
	useEffect( () => {
		if ( ! isCurrentPostSaving || ! menuId || ! currentBlocks ) {
			return;
		}

		const serializedContent = serialize( currentBlocks );
		if (
			serializedContent === lastSavedContent.current ||
			( isInitialLoad.current &&
				serializedContent === initialBlocksRef.current )
		) {
			return;
		}

		lastSavedContent.current = serializedContent;

		( async () => {
			try {
				await editEntityRecord( 'postType', 'wp_navigation', menuId, {
					content: serializedContent,
					status: 'publish',
				} );
				await saveEditedEntityRecord(
					'postType',
					'wp_navigation',
					menuId
				);
			} catch ( error ) {
				throw new Error( 'Failed to update navigation menu:', error );
			}
		} )();
	}, [
		isCurrentPostSaving,
		menuId,
		currentBlocks,
		editEntityRecord,
		saveEditedEntityRecord,
	] );

	/**
	 * Effect for updating blocks when menu selection changes
	 * Processes and replaces blocks when a new menu is selected
	 */
	useEffect( () => {
		if ( ! selectedMenu || ! selectedMenu.content ) {
			registry
				.dispatch( blockEditorStore )
				.__unstableMarkNextChangeAsNotPersistent();
			replaceInnerBlocks( clientId, [] );
			lastSavedContent.current = serialize( [] );
			isInitialLoad.current = false;
			return;
		}

		const parsedBlocks = parse( selectedMenu.content );
		const newBlocks = processBlocks( parsedBlocks );

		registry
			.dispatch( blockEditorStore )
			.__unstableMarkNextChangeAsNotPersistent();
		replaceInnerBlocks( clientId, newBlocks );

		if ( isInitialLoad.current ) {
			lastSavedContent.current = serialize( newBlocks );
			initialBlocksRef.current = lastSavedContent.current;
			isInitialLoad.current = false;

			registry
				.dispatch( blockEditorStore )
				.__unstableMarkNextChangeAsNotPersistent();
		}
	}, [
		selectedMenu,
		registry,
		clientId,
		processBlocks,
		replaceInnerBlocks,
	] );

	/**
	 * Handles menu selection changes
	 * @param {string} value - The selected menu ID
	 */
	const handleMenuSelect = ( value ) => {
		const newMenuId = parseInt( value );
		setAttributes( { menuId: newMenuId } );
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

	/**
	 * Inner blocks configuration for the navigation menu
	 * Restricts allowed blocks to navigation-specific types
	 */
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'dswp-block-navigation__container' },
		{
			allowedBlocks: ALLOWED_BLOCKS,
			orientation: 'horizontal',
			templateLock: false,
		}
	);

	// Early return for loading state
	if ( ! hasResolvedMenus ) {
		return <Spinner />;
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Navigation Settings', 'dswp' ) }>
					<SelectControl
						label={ __( 'Select Menu', 'dswp' ) }
						value={ menuId || 0 }
						options={ menuOptions }
						onChange={ handleMenuSelect }
					/>

					<ButtonGroup>
						<span
							className="components-base-control__label"
							style={ { display: 'block', marginBottom: '8px' } }
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

					{ overlayMenu === 'mobile' && (
						<div style={ { marginTop: '1rem' } }>
							<RangeControl
								label={ __( 'Mobile Breakpoint (px)', 'dswp' ) }
								value={ mobileBreakpoint }
								onChange={ ( value ) =>
									setAttributes( { mobileBreakpoint: value } )
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
				<MobileMenuIcon />
				<ul { ...innerBlocksProps } />
			</nav>
		</>
	);
}
