import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Document Repository Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>{__('Something went wrong.', 'bcgov-design-system')}</h2>
                    <p>{__('Please try refreshing the page.', 'bcgov-design-system')}</p>
                    {process.env.NODE_ENV === 'development' && (
                        <pre>{this.state.error?.toString()}</pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 