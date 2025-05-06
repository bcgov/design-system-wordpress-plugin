import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { sprintf } from '@wordpress/i18n';

/**
 * PaginationControls Component
 *
 * Renders pagination controls for navigating through document pages
 *
 * @param {Object}   props
 * @param {number}   props.currentPage  - Current page number
 * @param {number}   props.totalPages   - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes
 */
const PaginationControls = ( { currentPage, totalPages, onPageChange } ) => {
	if ( totalPages <= 1 ) {
		return null;
	}

	return (
		<div className="pagination">
			<Button
				onClick={ () => onPageChange( currentPage - 1 ) }
				disabled={ currentPage === 1 }
			>
				{ __( 'Previous', 'bcgov-design-system' ) }
			</Button>
			<span className="page-info">
				{ sprintf(
					__( 'Page %d of %d', 'bcgov-design-system' ),
					currentPage,
					totalPages
				) }
			</span>
			<Button
				onClick={ () => onPageChange( currentPage + 1 ) }
				disabled={ currentPage === totalPages }
			>
				{ __( 'Next', 'bcgov-design-system' ) }
			</Button>
		</div>
	);
};

export default PaginationControls;
