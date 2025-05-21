/**
 * VirtualList Component
 *
 * A component for efficiently rendering large lists by only rendering
 * items that are visible in the viewport.
 */

import { forwardRef } from '@wordpress/element';
import PropTypes from 'prop-types';
import useVirtualization from './hooks/useVirtualization';

/**
 * VirtualList component for efficient rendering of large lists
 */
const VirtualList = forwardRef(
	(
		{
			items,
			itemHeight,
			renderItem,
			className,
			listHeight,
			containerClassName,
			overscan = 3,
			emptyMessage = 'No items to display',
			loadingComponent = null,
			isLoading = false,
			keyExtractor = ( item, index ) => index,
		},
		ref
	) => {
		// Use the virtualization hook
		const {
			containerRef,
			visibleItems,
			totalHeight,
			offsetY,
			handleScroll,
			visibleStartIndex,
		} = useVirtualization( {
			items,
			itemHeight,
			overscan,
			listHeight,
		} );

		// Merge the forwarded ref with the internal ref
		const setRefs = ( element ) => {
			containerRef.current = element;
			if ( ref ) {
				if ( typeof ref === 'function' ) {
					ref( element );
				} else {
					ref.current = element;
				}
			}
		};

		// Calculate fixed container height or use auto
		const containerStyle = {
			height: listHeight || 'auto',
			overflow: 'auto',
			position: 'relative',
		};

		// Show loading state if provided
		if ( isLoading && loadingComponent ) {
			return (
				<div
					ref={ setRefs }
					className={ containerClassName }
					style={ containerStyle }
					role="list"
					aria-busy={ true }
					aria-live="polite"
				>
					{ loadingComponent }
				</div>
			);
		}

		// Show empty state if no items
		if ( ! isLoading && items.length === 0 ) {
			return (
				<div
					ref={ setRefs }
					className={ containerClassName }
					style={ containerStyle }
					role="list"
					aria-label="Empty list"
				>
					<div className="virtual-list__empty">{ emptyMessage }</div>
				</div>
			);
		}

		return (
			<div
				ref={ setRefs }
				className={ containerClassName }
				style={ containerStyle }
				onScroll={ handleScroll }
				role="list"
				aria-label={ `List with ${ items.length } items` }
			>
				{ /* The inner container that holds all the items and provides the scrollable height */ }
				<div
					style={ {
						height: `${ totalHeight }px`,
						position: 'relative',
					} }
				>
					{ /* Only render the visible items */ }
					<div
						style={ {
							position: 'absolute',
							top: `${ offsetY }px`,
							width: '100%',
						} }
						className={ className }
					>
						{ visibleItems.map( ( item, index ) => {
							const actualIndex = visibleStartIndex + index;
							const key = keyExtractor( item, actualIndex );

							return (
								<div
									key={ key }
									style={ { height: `${ itemHeight }px` } }
									role="listitem"
									aria-posinset={ actualIndex + 1 }
									aria-setsize={ items.length }
								>
									{ renderItem( {
										item,
										index: actualIndex,
										style: { height: itemHeight },
									} ) }
								</div>
							);
						} ) }
					</div>
				</div>
			</div>
		);
	}
);

VirtualList.displayName = 'VirtualList';

VirtualList.propTypes = {
	/** Array of items to render */
	items: PropTypes.array.isRequired,

	/** Height of each item in pixels */
	itemHeight: PropTypes.number.isRequired,

	/** Function to render an item given { item, index, style } */
	renderItem: PropTypes.func.isRequired,

	/** Optional custom class name for the list */
	className: PropTypes.string,

	/** Optional custom class name for the container */
	containerClassName: PropTypes.string,

	/** Optional fixed height for the list */
	listHeight: PropTypes.number,

	/** Number of items to render outside the visible area */
	overscan: PropTypes.number,

	/** Message to display when the list is empty */
	emptyMessage: PropTypes.node,

	/** Component to display when loading */
	loadingComponent: PropTypes.node,

	/** Whether the list is currently loading */
	isLoading: PropTypes.bool,

	/** Function to extract a unique key for an item */
	keyExtractor: PropTypes.func,
};

export default VirtualList;
