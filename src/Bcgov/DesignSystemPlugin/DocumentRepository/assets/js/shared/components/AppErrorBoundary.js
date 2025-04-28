import React from 'react';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Error boundary for the entire app
 */
class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("App error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="dswp-document-repository-error">
                    <Notice status="error" isDismissible={false}>
                        <h2>{__('Something went wrong in the Document Repository', 'bcgov-design-system')}</h2>
                        <p>{this.state.error && this.state.error.toString()}</p>
                        <details style={{ whiteSpace: 'pre-wrap' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </Notice>
                </div>
            );
        }

        return this.props.children;
    }
}

export default AppErrorBoundary; 