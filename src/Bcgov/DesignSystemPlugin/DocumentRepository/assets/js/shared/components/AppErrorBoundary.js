/**
 * Application Error Boundary Component
 *
 * A React error boundary component that catches JavaScript errors anywhere in the
 * application, logs those errors, and displays a fallback UI instead of crashing
 * the entire application.
 *
 * @component AppErrorBoundary
 * @augments React.Component
 */

import React from 'react';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Error boundary for the entire application
 *
 * @class AppErrorBoundary
 * @augments React.Component
 * @param {Object}          props          - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
class AppErrorBoundary extends React.Component {
	/**
	 * Creates an instance of AppErrorBoundary
	 *
	 * @param {Object} props - Component props
	 */
	constructor( props ) {
		super( props );
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	/**
	 * Updates state when an error is caught
	 *
	 * @static
	 * @param {Error} error - The error that was thrown
	 * @return {Object} New state with error information
	 */
	static getDerivedStateFromError( error ) {
		return { hasError: true, error };
	}

	/**
	 * Handles error logging and additional error information
	 *
	 * @param {Error}  error     - The error that was thrown
	 * @param {Object} errorInfo - Additional error information including component stack
	 */
	componentDidCatch( error, errorInfo ) {
		console.error( 'App error:', error, errorInfo );
		this.setState( { errorInfo } );
	}

	/**
	 * Renders either the error UI or children components
	 *
	 * @return {JSX.Element} Error UI or children components
	 */
	render() {
		if ( this.state.hasError ) {
			return (
				<div className="dswp-document-repository-error">
					<Notice status="error" isDismissible={ false }>
						<h2>
							{ __(
								'Something went wrong in the Document Repository',
								'bcgov-design-system'
							) }
						</h2>
						<p>
							{ this.state.error && this.state.error.toString() }
						</p>
						<details style={ { whiteSpace: 'pre-wrap' } }>
							{ this.state.errorInfo &&
								this.state.errorInfo.componentStack }
						</details>
					</Notice>
				</div>
			);
		}

		return this.props.children;
	}
}

export default AppErrorBoundary;
