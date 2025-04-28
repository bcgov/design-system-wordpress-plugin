import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * SafeRender Component
 * 
 * A utility component that wraps document table rows to provide error boundary functionality.
 * Catches and handles rendering errors in individual rows without breaking the entire table.
 * 
 * @component
 * @extends {Component}
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be rendered safely
 */
class SafeRender extends Component {
    /**
     * Constructor for the SafeRender component
     * Initializes state for error handling
     * 
     * @param {Object} props - Component props
     */
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    /**
     * Static method that returns a new state when an error is caught
     * Updates the component state to indicate an error has occurred
     * 
     * @static
     * @param {Error} error - The error that was caught
     * @returns {Object} New state object with error information
     */
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    /**
     * Lifecycle method called after an error has been caught
     * Logs the error and its details to the console for debugging
     * 
     * @param {Error} error - The error that was caught
     * @param {Object} errorInfo - Additional error information including component stack
     */
    componentDidCatch(error, errorInfo) {
        console.error('Row Render Error:', error, errorInfo);
    }

    /**
     * Renders the error UI when an error has been caught
     * Shows a user-friendly error message and detailed error info in development
     * 
     * @returns {JSX.Element} Error message UI with optional error details
     */
    renderError() {
        return (
            <div className="document-table-row error" role="row">
                <div className="document-table-cell" role="cell" style={{ textAlign: 'center' }}>
                    {__('Error rendering document row.', 'bcgov-design-system')}
                    {process.env.NODE_ENV === 'development' && (
                        <pre>{this.state.error?.toString()}</pre>
                    )}
                </div>
            </div>
        );
    }

    /**
     * Renders the child components when no error has been caught
     * 
     * @returns {ReactNode} Child components
     */
    renderContent() {
        return this.props.children;
    }

    /**
     * Main render method that decides whether to show error UI or child components
     * 
     * @returns {JSX.Element} Either error UI or child components
     */
    render() {
        if (this.state.hasError) {
            return this.renderError();
        }
        return this.renderContent();
    }
}

export default SafeRender; 