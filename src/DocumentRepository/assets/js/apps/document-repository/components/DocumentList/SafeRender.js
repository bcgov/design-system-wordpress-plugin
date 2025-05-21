import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * SafeRender Component
 *
 * A utility component that wraps document table rows to provide error boundary functionality.
 * Catches and handles rendering errors in individual rows without breaking the entire table.
 *
 * @augments {Component}
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to be rendered safely
 */
class SafeRender extends Component {
	/**
	 * Constructor for the SafeRender component
	 * Initializes state for error handling
	 *
	 * @param {Object} props - Component props
	 */
	constructor( props ) {
		super( props );
		this.state = { hasError: false, error: null };
	}

	/**
	 * Static method that returns a new state when an error is caught
	 * Updates the component state to indicate an error has occurred
	 *
	 * @static
	 * @param {Error} error - The error that was caught
	 * @return {Object} New state object with error information
	 */
	static getDerivedStateFromError( error ) {
		return { hasError: true, error };
	}

	/**
	 * Renders the error UI when an error has been caught
	 * Shows a user-friendly error message and detailed error info in development
	 *
	 * @return {JSX.Element} Error message UI with optional error details
	 */
	renderError() {
		return (
			<div className="document-table-row error" role="row">
				<div
					className="document-table-cell"
					role="cell"
					style={ { textAlign: 'center' } }
				>
					{ __(
						'Error rendering document row.',
						'bcgov-design-system'
					) }
					{ process.env.NODE_ENV === 'development' && (
						<pre>{ this.state.error?.toString() }</pre>
					) }
				</div>
			</div>
		);
	}

	/**
	 * Renders the child components when no error has been caught
	 *
	 * @return {JSX.Element} Child components
	 */
	renderContent() {
		return this.props.children;
	}

	/**
	 * Main render method that decides whether to show error UI or child components
	 *
	 * @return {JSX.Element} Either error UI or child components
	 */
	render() {
		if ( this.state.hasError ) {
			return this.renderError();
		}
		return this.renderContent();
	}
}

export { SafeRender as default };
