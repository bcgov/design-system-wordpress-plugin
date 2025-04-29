import React, { Component } from 'react';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

/**
 * Error Boundary component to catch and handle unexpected errors gracefully
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // Log error to console for debugging
        console.error('Error caught by boundary:', error);
        console.error('Error info:', errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Attempt to recover by reloading the page
        if (this.props.onReset) {
            this.props.onReset();
        } else {
            window.location.reload();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-content">
                        <h2>{__('Something went wrong', 'bcgov-design-system')}</h2>
                        <p>
                            {__('An unexpected error occurred. Our team has been notified.', 'bcgov-design-system')}
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <details>
                                <summary>{__('Error Details', 'bcgov-design-system')}</summary>
                                <pre>
                                    {this.state.error && this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                        <Button
                            variant="primary"
                            onClick={this.handleReset}
                        >
                            {__('Try Again', 'bcgov-design-system')}
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 