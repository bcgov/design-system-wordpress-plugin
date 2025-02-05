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

const TEMPLATE = [
	[
		'core/navigation-link',
		{
			label: __( 'Add link', 'dswp' ),
			url: '#',
		},
	],
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
	const { overlayMenu, menuId, mobileBreakpoint } = attributes;
	const registry = useRegistry();
	const isInitialLoad = useRef( true );
	const initialBlocksRef = useRef( null );
	const lastSavedContent = useRef( null );

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const { editEntityRecord, saveEditedEntityRecord } =
		useDispatch( coreStore );

	const {
		currentBlocks,
		menus,
		selectedMenu,
		isLoading,
		isCurrentPostSaving,
	} = useSelect(
		( select ) => {
			const { getBlocks } = select( blockEditorStore );
			const { getEditedEntityRecord, isSavingEntityRecord } =
				select( coreStore );
			const { getEntityRecords } = select( coreStore );

			const navigationMenus = getEntityRecords(
				'postType',
				'wp_navigation',
				{
					per_page: -1,
					status: 'publish',
				}
			);

			const selectedNavigationMenu = menuId
				? getEditedEntityRecord( 'postType', 'wp_navigation', menuId )
				: null;

			return {
				currentBlocks: getBlocks( clientId ),
				menus: navigationMenus,
				selectedMenu: selectedNavigationMenu,
				isLoading:
					getEntityRecords( 'postType', 'wp_navigation', {
						per_page: -1,
					} ) === null,
				isCurrentPostSaving: isSavingEntityRecord(
					'postType',
					'wp_navigation',
					menuId
				),
			};
		},
		[ clientId, menuId ]
	);

	const processBlocks = useCallback( ( blocks ) => {
		return blocks.map( ( block ) => {
			if ( block.name === 'core/navigation-link' ) {
				return createBlock( 'core/navigation-link', block.attributes );
			}
			if ( block.name === 'core/navigation-submenu' ) {
				return createBlock(
					'core/navigation-submenu',
					block.attributes,
					processBlocks( block.innerBlocks )
				);
			}
			return block;
		} );
	}, [] );

	const blockProps = useBlockProps( {
		className: `dswp-block-navigation-is-${ overlayMenu }-overlay`,
		'data-dswp-mobile-breakpoint': mobileBreakpoint,
	} );

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'dswp-block-navigation__container',
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			template: TEMPLATE,
			templateLock: false,
			renderAppender: false,
		}
	);

	/**
	 * Effect for initializing content
	 * Sets up initial state when menu content is loaded
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
	}, [ selectedMenu, registry ] );

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
	}, [ currentBlocks, registry ] );

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

	const menuOptions = useMemo( () => {
		if ( ! menus?.length ) {
			return [
				{
					label: __( 'Select a menu', 'dswp' ),
					value: '',
				},
			];
		}

		return [
			{
				label: __( 'Select a menu', 'dswp' ),
				value: '',
			},
			...menus.map( ( menu ) => ( {
				label: menu.title.rendered,
				value: menu.id,
			} ) ),
		];
	}, [ menus ] );

	if ( isLoading ) {
		return (
			<div { ...blockProps }>
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Menu Settings', 'dswp' ) }>
					<SelectControl
						label={ __( 'Select Menu', 'dswp' ) }
						value={ menuId || '' }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( {
								menuId: value ? parseInt( value, 10 ) : null,
							} )
						}
					/>
					<ButtonGroup>
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
					</ButtonGroup>
					{ overlayMenu !== 'never' && (
						<RangeControl
							label={ __(
								'Mobile Breakpoint (in pixels)',
								'dswp'
							) }
							value={ mobileBreakpoint }
							onChange={ ( value ) =>
								setAttributes( { mobileBreakpoint: value } )
							}
							min={ 320 }
							max={ 1920 }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<nav { ...blockProps }>
				<MobileMenuIcon />
				<div { ...innerBlocksProps } />
			</nav>
		</>
	);
}
