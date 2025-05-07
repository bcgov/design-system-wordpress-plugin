import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * ErrorBoundary Component
 *
 * A React error boundary component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 *
 * @augments {Component}
 * @param {Object}      props          - Component props
 * @param {JSX.Element} props.children - Child components to be wrapped by the error boundary
 */
class ErrorBoundary extends Component {
	/**
	 * Constructor for the ErrorBoundary component
	 * @param {Object} props - Component props
	 */
	constructor( props ) {
		super( props );
		this.state = { hasError: false, error: null };
	}

	/**
	 * Static method that returns a new state when an error is caught
	 * @static
	 * @param {Error} error - The error that was caught
	 * @return {Object} New state object with error information
	 */
	static getDerivedStateFromError( error ) {
		return { hasError: true, error };
	}

	/**
	 * Renders the error UI when an error has been caught
	 * @return {JSX.Element} Error message UI
	 */
	renderError() {
		return (
			<div className="error-boundary">
				<h2>
					{ __( 'Something went wrong.', 'bcgov-design-system' ) }
				</h2>
				<p>
					{ __(
						'Please try refreshing the page.',
						'bcgov-design-system'
					) }
				</p>
				{ /* Only show error details in development environment */ }
				{ process.env.NODE_ENV === 'development' && (
					<pre>{ this.state.error?.toString() }</pre>
				) }
			</div>
		);
	}

	/**
	 * Renders the child components when no error has been caught
	 * @return {JSX.Element} Child components
	 */
	renderContent() {
		return this.props.children;
	}

	/**
	 * Main render method that decides whether to show error UI or child components
	 * @return {JSX.Element} Either error UI or child components
	 */
	render() {
		if ( this.state.hasError ) {
			return this.renderError();
		}
		return this.renderContent();
	}
}

export default ErrorBoundary;
