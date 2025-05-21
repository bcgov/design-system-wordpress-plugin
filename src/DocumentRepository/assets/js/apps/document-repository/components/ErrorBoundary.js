import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * ErrorBoundary Component
 *
 * A React error boundary component that catches JavaScript errors anywhere in its child component tree.
 * It logs those errors and displays a fallback UI instead of crashing the whole app.
 *
 * Features:
 * - Catches runtime errors in child components
 * - Displays a user-friendly error message
 * - Shows detailed error information in development mode
 * - Provides a reset mechanism to recover from errors
 *
 * @example
 * <ErrorBoundary>
 *   <ChildComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
	/**
	 * Initialize the error boundary with default state
	 *
	 * @class
	 * @param {Object} props - Component props
	 */
	constructor( props ) {
		super( props );
		this.state = {
			hasError: false, // Tracks if an error has occurred
			error: null, // Stores the error object
			errorInfo: null, // Stores additional error information
		};
	}

	/**
	 * Static method called during rendering when an error is thrown
	 * Used to update the component's state based on the caught error
	 *
	 * @static
	 * @param {Error} error - The error that was caught
	 * @return {Object} Updated state object
	 */
	static getDerivedStateFromError( error ) {
		return { hasError: true, error };
	}

	/**
	 * Lifecycle method called after an error has been caught
	 * Used for error logging and setting detailed error information in state
	 *
	 * @param {Error}  error     - The error that was caught
	 * @param {Object} errorInfo - Additional information about the error
	 */
	componentDidCatch( error, errorInfo ) {
		this.setState( {
			error,
			errorInfo,
		} );
	}

	/**
	 * Handles resetting the error boundary state and attempting recovery
	 * Either calls a provided reset handler or reloads the page
	 *
	 * @private
	 */
	handleReset = () => {
		this.setState( {
			hasError: false,
			error: null,
			errorInfo: null,
		} );

		// Attempt to recover by either calling provided handler or reloading page
		if ( this.props.onReset ) {
			this.props.onReset();
		} else {
			window.location.reload();
		}
	};

	/**
	 * Renders either the error UI or the child components
	 * In development mode, also shows detailed error information
	 *
	 * @return {JSX.Element} The rendered component
	 */
	render() {
		if ( this.state.hasError ) {
			return (
				<div className="error-boundary">
					<div className="error-content">
						<h2>
							{ __(
								'Something went wrong',
								'bcgov-design-system'
							) }
						</h2>
						<p>
							{ __(
								'An unexpected error occurred. Our team has been notified.',
								'bcgov-design-system'
							) }
						</p>
						{ /* Show detailed error information only in development mode */ }
						{ process.env.NODE_ENV === 'development' && (
							<details>
								<summary>
									{ __(
										'Error Details',
										'bcgov-design-system'
									) }
								</summary>
								<pre>
									{ this.state.error &&
										this.state.error.toString() }
									{ this.state.errorInfo &&
										this.state.errorInfo.componentStack }
								</pre>
							</details>
						) }
						<Button variant="primary" onClick={ this.handleReset }>
							{ __( 'Try Again', 'bcgov-design-system' ) }
						</Button>
					</div>
				</div>
			);
		}

		// If there's no error, render children normally
		return this.props.children;
	}
}

export { ErrorBoundary as default };
